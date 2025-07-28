<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\User;
use App\Models\Subscription;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class PaymentService
{
    /**
     * Create a new payment.
     */
    public function createPayment(array $data): Payment
    {
        // Generate payment ID and reference
        $paymentId = $this->generatePaymentId();
        $reference = $this->generatePaymentReference();
        
        // Set expiration time (24 hours from now)
        $expiresAt = now()->addHours(24);

        $payment = Payment::create([
            'user_id' => $data['user_id'],
            'subscription_id' => $data['subscription_id'] ?? null,
            'payment_id' => $paymentId,
            'reference' => $reference,
            'type' => $data['type'],
            'status' => 'pending',
            'amount' => $data['amount'],
            'currency' => $data['currency'] ?? 'GHS',
            'payment_method' => $data['payment_method'],
            'gateway_response' => null,
            'metadata' => $data['metadata'] ?? [],
            'description' => $data['description'] ?? null,
            'expires_at' => $expiresAt,
        ]);

        Log::info('Payment created', [
            'payment_id' => $paymentId,
            'user_id' => $data['user_id'],
            'amount' => $data['amount'],
            'type' => $data['type'],
        ]);

        return $payment;
    }

    /**
     * Get payment by ID.
     */
    public function getPayment(int $id): ?Payment
    {
        return Payment::find($id);
    }

    /**
     * Get payment by payment ID.
     */
    public function getPaymentByPaymentId(string $paymentId): ?Payment
    {
        return Payment::where('payment_id', $paymentId)->first();
    }

    /**
     * Get payment by reference.
     */
    public function getPaymentByReference(string $reference): ?Payment
    {
        return Payment::where('reference', $reference)->first();
    }

    /**
     * Get user's payments.
     */
    public function getUserPayments(int $userId, array $filters = []): \Illuminate\Database\Eloquent\Collection
    {
        $query = Payment::where('user_id', $userId);

        // Apply filters
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['payment_method'])) {
            $query->where('payment_method', $filters['payment_method']);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Initialize payment with gateway.
     */
    public function initializePayment(Payment $payment): array
    {
        try {
            switch ($payment->payment_method) {
                case 'flutterwave':
                    return $this->initializeFlutterwavePayment($payment);
                case 'paystack':
                    return $this->initializePaystackPayment($payment);
                case 'momo':
                    return $this->initializeMobileMoneyPayment($payment);
                default:
                    throw new \Exception('Unsupported payment method');
            }
        } catch (\Exception $e) {
            Log::error('Payment initialization failed', [
                'payment_id' => $payment->payment_id,
                'error' => $e->getMessage(),
            ]);

            $payment->markAsFailed();
            
            throw $e;
        }
    }

    /**
     * Verify payment with gateway.
     */
    public function verifyPayment(Payment $payment, string $transactionId = null): bool
    {
        try {
            switch ($payment->payment_method) {
                case 'flutterwave':
                    return $this->verifyFlutterwavePayment($payment, $transactionId);
                case 'paystack':
                    return $this->verifyPaystackPayment($payment, $transactionId);
                case 'momo':
                    return $this->verifyMobileMoneyPayment($payment, $transactionId);
                default:
                    throw new \Exception('Unsupported payment method');
            }
        } catch (\Exception $e) {
            Log::error('Payment verification failed', [
                'payment_id' => $payment->payment_id,
                'error' => $e->getMessage(),
            ]);

            $payment->markAsFailed();
            
            return false;
        }
    }

    /**
     * Process payment webhook.
     */
    public function processWebhook(array $data, string $gateway): bool
    {
        try {
            switch ($gateway) {
                case 'flutterwave':
                    return $this->processFlutterwaveWebhook($data);
                case 'paystack':
                    return $this->processPaystackWebhook($data);
                default:
                    Log::warning('Unknown webhook gateway', ['gateway' => $gateway]);
                    return false;
            }
        } catch (\Exception $e) {
            Log::error('Webhook processing failed', [
                'gateway' => $gateway,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Refund payment.
     */
    public function refundPayment(Payment $payment, float $amount = null): bool
    {
        if (!$payment->isCompleted()) {
            throw new \Exception('Cannot refund incomplete payment');
        }

        $refundAmount = $amount ?? $payment->amount;

        try {
            switch ($payment->payment_method) {
                case 'flutterwave':
                    return $this->refundFlutterwavePayment($payment, $refundAmount);
                case 'paystack':
                    return $this->refundPaystackPayment($payment, $refundAmount);
                default:
                    throw new \Exception('Refund not supported for this payment method');
            }
        } catch (\Exception $e) {
            Log::error('Payment refund failed', [
                'payment_id' => $payment->payment_id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Get payment statistics.
     */
    public function getPaymentStats(int $userId): array
    {
        $payments = Payment::where('user_id', $userId)->get();

        return [
            'total_payments' => $payments->count(),
            'completed_payments' => $payments->where('status', 'completed')->count(),
            'pending_payments' => $payments->where('status', 'pending')->count(),
            'failed_payments' => $payments->where('status', 'failed')->count(),
            'cancelled_payments' => $payments->where('status', 'cancelled')->count(),
            'refunded_payments' => $payments->where('status', 'refunded')->count(),
            'total_amount' => $payments->where('status', 'completed')->sum('amount'),
            'payment_methods' => $payments->groupBy('payment_method')
                ->map(function ($group) {
                    return [
                        'method' => $group->first()->payment_method,
                        'count' => $group->count(),
                        'amount' => $group->where('status', 'completed')->sum('amount'),
                    ];
                })
                ->values()
                ->toArray(),
        ];
    }

    /**
     * Initialize Flutterwave payment.
     */
    private function initializeFlutterwavePayment(Payment $payment): array
    {
        $flutterwaveKey = config('services.flutterwave.secret_key');
        
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $flutterwaveKey,
            'Content-Type' => 'application/json',
        ])->post('https://api.flutterwave.com/v3/payments', [
            'tx_ref' => $payment->reference,
            'amount' => $payment->amount,
            'currency' => $payment->currency,
            'redirect_url' => config('app.url') . '/payment/callback/flutterwave',
            'customer' => [
                'email' => $payment->user->email,
                'name' => $payment->user->name,
                'phone_number' => $payment->user->phone,
            ],
            'meta' => [
                'payment_id' => $payment->payment_id,
                'user_id' => $payment->user_id,
            ],
        ]);

        if ($response->successful()) {
            $data = $response->json();
            
            $payment->update([
                'gateway_response' => json_encode($data),
            ]);

            return [
                'success' => true,
                'payment_url' => $data['data']['link'],
                'reference' => $payment->reference,
            ];
        }

        throw new \Exception('Flutterwave payment initialization failed: ' . $response->body());
    }

    /**
     * Initialize Paystack payment.
     */
    private function initializePaystackPayment(Payment $payment): array
    {
        $paystackKey = config('services.paystack.secret_key');
        
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $paystackKey,
            'Content-Type' => 'application/json',
        ])->post('https://api.paystack.co/transaction/initialize', [
            'reference' => $payment->reference,
            'amount' => $payment->amount * 100, // Paystack uses kobo
            'currency' => $payment->currency,
            'callback_url' => config('app.url') . '/payment/callback/paystack',
            'email' => $payment->user->email,
            'metadata' => [
                'payment_id' => $payment->payment_id,
                'user_id' => $payment->user_id,
            ],
        ]);

        if ($response->successful()) {
            $data = $response->json();
            
            $payment->update([
                'gateway_response' => json_encode($data),
            ]);

            return [
                'success' => true,
                'payment_url' => $data['data']['authorization_url'],
                'reference' => $payment->reference,
            ];
        }

        throw new \Exception('Paystack payment initialization failed: ' . $response->body());
    }

    /**
     * Initialize Mobile Money payment.
     */
    private function initializeMobileMoneyPayment(Payment $payment): array
    {
        // For now, simulate mobile money payment
        // In real implementation, integrate with MTN MoMo, Vodafone Cash, etc.
        
        $payment->update([
            'gateway_response' => json_encode(['status' => 'pending']),
        ]);

        return [
            'success' => true,
            'payment_url' => config('app.url') . '/payment/momo/' . $payment->reference,
            'reference' => $payment->reference,
        ];
    }

    /**
     * Verify Flutterwave payment.
     */
    private function verifyFlutterwavePayment(Payment $payment, string $transactionId = null): bool
    {
        $flutterwaveKey = config('services.flutterwave.secret_key');
        $reference = $transactionId ?? $payment->reference;
        
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $flutterwaveKey,
        ])->get("https://api.flutterwave.com/v3/transactions/{$reference}/verify");

        if ($response->successful()) {
            $data = $response->json();
            
            if ($data['status'] === 'success' && $data['data']['status'] === 'successful') {
                $payment->markAsCompleted();
                $payment->update([
                    'gateway_response' => json_encode($data),
                    'paid_at' => now(),
                ]);

                // Process subscription payment if applicable
                if ($payment->subscription_id) {
                    $subscription = Subscription::find($payment->subscription_id);
                    if ($subscription) {
                        app(SubscriptionService::class)->processSubscriptionPayment($subscription, $payment);
                    }
                }

                return true;
            }
        }

        return false;
    }

    /**
     * Verify Paystack payment.
     */
    private function verifyPaystackPayment(Payment $payment, string $transactionId = null): bool
    {
        $paystackKey = config('services.paystack.secret_key');
        $reference = $transactionId ?? $payment->reference;
        
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $paystackKey,
        ])->get("https://api.paystack.co/transaction/verify/{$reference}");

        if ($response->successful()) {
            $data = $response->json();
            
            if ($data['status'] && $data['data']['status'] === 'success') {
                $payment->markAsCompleted();
                $payment->update([
                    'gateway_response' => json_encode($data),
                    'paid_at' => now(),
                ]);

                // Process subscription payment if applicable
                if ($payment->subscription_id) {
                    $subscription = Subscription::find($payment->subscription_id);
                    if ($subscription) {
                        app(SubscriptionService::class)->processSubscriptionPayment($subscription, $payment);
                    }
                }

                return true;
            }
        }

        return false;
    }

    /**
     * Verify Mobile Money payment.
     */
    private function verifyMobileMoneyPayment(Payment $payment, string $transactionId = null): bool
    {
        // For now, simulate mobile money verification
        // In real implementation, integrate with telco APIs
        
        $payment->markAsCompleted();
        $payment->update([
            'gateway_response' => json_encode(['status' => 'success']),
            'paid_at' => now(),
        ]);

        // Process subscription payment if applicable
        if ($payment->subscription_id) {
            $subscription = Subscription::find($payment->subscription_id);
            if ($subscription) {
                app(SubscriptionService::class)->processSubscriptionPayment($subscription, $payment);
            }
        }

        return true;
    }

    /**
     * Process Flutterwave webhook.
     */
    private function processFlutterwaveWebhook(array $data): bool
    {
        $payment = Payment::where('reference', $data['txRef'])->first();
        
        if (!$payment) {
            return false;
        }

        if ($data['status'] === 'successful') {
            $payment->markAsCompleted();
            $payment->update([
                'gateway_response' => json_encode($data),
                'paid_at' => now(),
            ]);

            // Process subscription payment if applicable
            if ($payment->subscription_id) {
                $subscription = Subscription::find($payment->subscription_id);
                if ($subscription) {
                    app(SubscriptionService::class)->processSubscriptionPayment($subscription, $payment);
                }
            }

            return true;
        }

        return false;
    }

    /**
     * Process Paystack webhook.
     */
    private function processPaystackWebhook(array $data): bool
    {
        $payment = Payment::where('reference', $data['reference'])->first();
        
        if (!$payment) {
            return false;
        }

        if ($data['status'] === 'success') {
            $payment->markAsCompleted();
            $payment->update([
                'gateway_response' => json_encode($data),
                'paid_at' => now(),
            ]);

            // Process subscription payment if applicable
            if ($payment->subscription_id) {
                $subscription = Subscription::find($payment->subscription_id);
                if ($subscription) {
                    app(SubscriptionService::class)->processSubscriptionPayment($subscription, $payment);
                }
            }

            return true;
        }

        return false;
    }

    /**
     * Refund Flutterwave payment.
     */
    private function refundFlutterwavePayment(Payment $payment, float $amount): bool
    {
        $flutterwaveKey = config('services.flutterwave.secret_key');
        
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $flutterwaveKey,
            'Content-Type' => 'application/json',
        ])->post('https://api.flutterwave.com/v3/refunds', [
            'transaction_id' => $payment->getGatewayResponseData()['id'] ?? null,
            'amount' => $amount,
        ]);

        if ($response->successful()) {
            $payment->markAsRefunded();
            return true;
        }

        return false;
    }

    /**
     * Refund Paystack payment.
     */
    private function refundPaystackPayment(Payment $payment, float $amount): bool
    {
        $paystackKey = config('services.paystack.secret_key');
        
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $paystackKey,
            'Content-Type' => 'application/json',
        ])->post('https://api.paystack.co/refund', [
            'transaction' => $payment->getGatewayResponseData()['id'] ?? null,
            'amount' => $amount * 100, // Paystack uses kobo
        ]);

        if ($response->successful()) {
            $payment->markAsRefunded();
            return true;
        }

        return false;
    }

    /**
     * Generate unique payment ID.
     */
    private function generatePaymentId(): string
    {
        do {
            $paymentId = 'pay_' . Str::random(16);
        } while (Payment::where('payment_id', $paymentId)->exists());

        return $paymentId;
    }

    /**
     * Generate unique payment reference.
     */
    private function generatePaymentReference(): string
    {
        do {
            $reference = 'REF_' . strtoupper(Str::random(12));
        } while (Payment::where('reference', $reference)->exists());

        return $reference;
    }
} 