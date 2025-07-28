<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\StorePaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Services\PaymentService;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function __construct(
        private PaymentService $paymentService
    ) {}

    /**
     * Get user's payments.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['status', 'type', 'payment_method']);
            $payments = $this->paymentService->getUserPayments($request->user()->id, $filters);

            return response()->json([
                'success' => true,
                'data' => PaymentResource::collection($payments)
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve payments', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve payments'
            ], 500);
        }
    }

    /**
     * Create a new payment.
     */
    public function store(StorePaymentRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['user_id'] = $request->user()->id;

            $payment = $this->paymentService->createPayment($data);

            return response()->json([
                'success' => true,
                'data' => new PaymentResource($payment),
                'message' => 'Payment created successfully'
            ], 201);

        } catch (\Exception $e) {
            Log::error('Failed to create payment', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create payment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payment by ID.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        try {
            $payment = $this->paymentService->getPayment($id);

            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not found'
                ], 404);
            }

            // Check if user owns the payment
            if ($payment->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to payment'
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => new PaymentResource($payment)
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve payment', [
                'payment_id' => $id,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve payment'
            ], 500);
        }
    }

    /**
     * Initialize payment with gateway.
     */
    public function initialize(Request $request, int $id): JsonResponse
    {
        try {
            $payment = $this->paymentService->getPayment($id);

            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not found'
                ], 404);
            }

            // Check if user owns the payment
            if ($payment->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to payment'
                ], 403);
            }

            $result = $this->paymentService->initializePayment($payment);

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Payment initialized successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to initialize payment', [
                'payment_id' => $id,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to initialize payment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify payment with gateway.
     */
    public function verify(Request $request, int $id): JsonResponse
    {
        try {
            $payment = $this->paymentService->getPayment($id);

            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not found'
                ], 404);
            }

            // Check if user owns the payment
            if ($payment->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to payment'
                ], 403);
            }

            $transactionId = $request->input('transaction_id');
            $isVerified = $this->paymentService->verifyPayment($payment, $transactionId);

            return response()->json([
                'success' => true,
                'data' => [
                    'payment_id' => $payment->payment_id,
                    'reference' => $payment->reference,
                    'is_verified' => $isVerified,
                    'status' => $payment->fresh()->status,
                ],
                'message' => $isVerified ? 'Payment verified successfully' : 'Payment verification failed'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to verify payment', [
                'payment_id' => $id,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to verify payment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Refund payment.
     */
    public function refund(Request $request, int $id): JsonResponse
    {
        try {
            $request->validate([
                'amount' => 'sometimes|numeric|min:0'
            ]);

            $payment = $this->paymentService->getPayment($id);

            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not found'
                ], 404);
            }

            // Check if user owns the payment
            if ($payment->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to payment'
                ], 403);
            }

            $amount = $request->input('amount');
            $isRefunded = $this->paymentService->refundPayment($payment, $amount);

            return response()->json([
                'success' => true,
                'data' => [
                    'payment_id' => $payment->payment_id,
                    'reference' => $payment->reference,
                    'is_refunded' => $isRefunded,
                    'status' => $payment->fresh()->status,
                ],
                'message' => $isRefunded ? 'Payment refunded successfully' : 'Payment refund failed'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to refund payment', [
                'payment_id' => $id,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to refund payment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payment by reference.
     */
    public function byReference(Request $request, string $reference): JsonResponse
    {
        try {
            $payment = $this->paymentService->getPaymentByReference($reference);

            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not found'
                ], 404);
            }

            // Check if user owns the payment
            if ($payment->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to payment'
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => new PaymentResource($payment)
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve payment by reference', [
                'reference' => $reference,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve payment'
            ], 500);
        }
    }

    /**
     * Get payment statistics.
     */
    public function stats(Request $request): JsonResponse
    {
        try {
            $stats = $this->paymentService->getPaymentStats($request->user()->id);

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get payment statistics', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get payment statistics'
            ], 500);
        }
    }

    /**
     * Process payment webhook.
     */
    public function webhook(Request $request, string $gateway): JsonResponse
    {
        try {
            $data = $request->all();
            $isProcessed = $this->paymentService->processWebhook($data, $gateway);

            return response()->json([
                'success' => $isProcessed,
                'message' => $isProcessed ? 'Webhook processed successfully' : 'Webhook processing failed'
            ], $isProcessed ? 200 : 400);

        } catch (\Exception $e) {
            Log::error('Failed to process webhook', [
                'gateway' => $gateway,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to process webhook'
            ], 500);
        }
    }

    /**
     * Get payment callback.
     */
    public function callback(Request $request, string $gateway): JsonResponse
    {
        try {
            // Handle payment callback from gateway
            $data = $request->all();

            // Extract payment reference from callback data
            $reference = null;
            switch ($gateway) {
                case 'flutterwave':
                    $reference = $data['tx_ref'] ?? null;
                    break;
                case 'paystack':
                    $reference = $data['reference'] ?? null;
                    break;
                default:
                    $reference = $data['reference'] ?? null;
            }

            if (!$reference) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid callback data'
                ], 400);
            }

            $payment = $this->paymentService->getPaymentByReference($reference);

            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not found'
                ], 404);
            }

            // Verify the payment
            $isVerified = $this->paymentService->verifyPayment($payment);

            return response()->json([
                'success' => true,
                'data' => [
                    'payment_id' => $payment->payment_id,
                    'reference' => $payment->reference,
                    'is_verified' => $isVerified,
                    'status' => $payment->fresh()->status,
                ],
                'message' => $isVerified ? 'Payment verified successfully' : 'Payment verification failed'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to process payment callback', [
                'gateway' => $gateway,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to process payment callback'
            ], 500);
        }
    }

    /**
     * Get payment methods.
     */
    public function methods(Request $request): JsonResponse
    {
        try {
            $methods = [
                'flutterwave' => [
                    'name' => 'Flutterwave',
                    'description' => 'Pay with card, bank transfer, or mobile money',
                    'supported_currencies' => ['GHS', 'NGN', 'USD', 'EUR'],
                    'logo' => 'flutterwave-logo.png'
                ],
                'paystack' => [
                    'name' => 'Paystack',
                    'description' => 'Pay with card or bank transfer',
                    'supported_currencies' => ['GHS', 'NGN', 'USD'],
                    'logo' => 'paystack-logo.png'
                ],
                'momo' => [
                    'name' => 'Mobile Money',
                    'description' => 'Pay with MTN MoMo, Vodafone Cash, or AirtelTigo Money',
                    'supported_currencies' => ['GHS'],
                    'logo' => 'momo-logo.png'
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $methods
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get payment methods', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get payment methods'
            ], 500);
        }
    }
}
