<?php

namespace Database\Factories;

use App\Models\Flow;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Flow>
 */
class FlowFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Flow::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->words(3, true) . ' Flow',
            'description' => fake()->optional()->sentence(),
            'flow_data' => $this->getDefaultFlowData(),
            'variables' => [],
            'is_active' => false,
            'is_template' => false,
            'category' => fake()->randomElement(['banking', 'ecommerce', 'healthcare', 'education', 'entertainment', 'utilities', 'custom']),
            'tags' => fake()->optional()->words(3, false),
            'version' => 1,
            'usage_count' => 0,
            'last_used_at' => null,
        ];
    }

    /**
     * Indicate that the flow is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the flow is a template.
     */
    public function template(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_template' => true,
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the flow has been used.
     */
    public function used(): static
    {
        return $this->state(fn (array $attributes) => [
            'usage_count' => fake()->numberBetween(1, 1000),
            'last_used_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ]);
    }

    /**
     * Indicate that the flow is a banking flow.
     */
    public function banking(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'banking',
            'name' => fake()->randomElement([
                'Mobile Money Transfer',
                'Account Balance Check',
                'Bill Payment',
                'Airtime Purchase',
                'Bank Transfer',
                'Loan Application'
            ]),
            'flow_data' => $this->getBankingFlowData(),
            'tags' => 'payment,transfer,banking,financial',
        ]);
    }

    /**
     * Indicate that the flow is an e-commerce flow.
     */
    public function ecommerce(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'ecommerce',
            'name' => fake()->randomElement([
                'Product Catalog',
                'Shopping Cart',
                'Order Tracking',
                'Payment Gateway',
                'Customer Support',
                'Product Search'
            ]),
            'flow_data' => $this->getEcommerceFlowData(),
            'tags' => 'shopping,products,orders,payment',
        ]);
    }

    /**
     * Indicate that the flow is a healthcare flow.
     */
    public function healthcare(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'healthcare',
            'name' => fake()->randomElement([
                'Appointment Booking',
                'Health Records',
                'Prescription Refill',
                'Emergency Contact',
                'Health Tips',
                'Doctor Directory'
            ]),
            'flow_data' => $this->getHealthcareFlowData(),
            'tags' => 'health,medical,appointment,emergency',
        ]);
    }

    /**
     * Indicate that the flow is an education flow.
     */
    public function education(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'education',
            'name' => fake()->randomElement([
                'Course Registration',
                'Exam Results',
                'Library Services',
                'Student Portal',
                'Fee Payment',
                'Academic Calendar'
            ]),
            'flow_data' => $this->getEducationFlowData(),
            'tags' => 'education,student,courses,academic',
        ]);
    }

    /**
     * Indicate that the flow has a specific version.
     */
    public function version(int $version): static
    {
        return $this->state(fn (array $attributes) => [
            'version' => $version,
        ]);
    }

    /**
     * Indicate that the flow has specific usage count.
     */
    public function usageCount(int $count): static
    {
        return $this->state(fn (array $attributes) => [
            'usage_count' => $count,
            'last_used_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ]);
    }

    /**
     * Get default flow data structure.
     */
    private function getDefaultFlowData(): array
    {
        return [
            'nodes' => [
                [
                    'id' => 'start',
                    'type' => 'start',
                    'position' => ['x' => 100, 'y' => 100],
                    'data' => [
                        'label' => 'Start',
                        'message' => 'Welcome to USSD Service'
                    ]
                ],
                [
                    'id' => 'menu',
                    'type' => 'menu',
                    'position' => ['x' => 300, 'y' => 100],
                    'data' => [
                        'label' => 'Main Menu',
                        'options' => [
                            ['key' => '1', 'text' => 'Option 1'],
                            ['key' => '2', 'text' => 'Option 2'],
                            ['key' => '3', 'text' => 'Option 3']
                        ]
                    ]
                ],
                [
                    'id' => 'end',
                    'type' => 'end',
                    'position' => ['x' => 500, 'y' => 100],
                    'data' => [
                        'label' => 'End',
                        'message' => 'Thank you for using our service'
                    ]
                ]
            ],
            'edges' => [
                [
                    'id' => 'start-menu',
                    'source' => 'start',
                    'target' => 'menu',
                    'type' => 'default'
                ],
                [
                    'id' => 'menu-end',
                    'source' => 'menu',
                    'target' => 'end',
                    'type' => 'default'
                ]
            ],
            'viewport' => ['x' => 0, 'y' => 0, 'zoom' => 1]
        ];
    }

    /**
     * Get banking flow data structure.
     */
    private function getBankingFlowData(): array
    {
        return [
            'nodes' => [
                [
                    'id' => 'start',
                    'type' => 'start',
                    'position' => ['x' => 100, 'y' => 100],
                    'data' => [
                        'label' => 'Welcome',
                        'message' => 'Welcome to Mobile Banking'
                    ]
                ],
                [
                    'id' => 'main-menu',
                    'type' => 'menu',
                    'position' => ['x' => 300, 'y' => 100],
                    'data' => [
                        'label' => 'Main Menu',
                        'options' => [
                            ['key' => '1', 'text' => 'Check Balance'],
                            ['key' => '2', 'text' => 'Transfer Money'],
                            ['key' => '3', 'text' => 'Buy Airtime'],
                            ['key' => '4', 'text' => 'Pay Bills']
                        ]
                    ]
                ],
                [
                    'id' => 'balance',
                    'type' => 'response',
                    'position' => ['x' => 500, 'y' => 50],
                    'data' => [
                        'label' => 'Balance',
                        'message' => 'Your balance is GHS {balance}'
                    ]
                ],
                [
                    'id' => 'transfer',
                    'type' => 'input',
                    'position' => ['x' => 500, 'y' => 150],
                    'data' => [
                        'label' => 'Transfer',
                        'message' => 'Enter recipient number:',
                        'variable' => 'recipient'
                    ]
                ],
                [
                    'id' => 'end',
                    'type' => 'end',
                    'position' => ['x' => 700, 'y' => 100],
                    'data' => [
                        'label' => 'End',
                        'message' => 'Thank you for using Mobile Banking'
                    ]
                ]
            ],
            'edges' => [
                ['id' => 'start-menu', 'source' => 'start', 'target' => 'main-menu'],
                ['id' => 'menu-balance', 'source' => 'main-menu', 'target' => 'balance', 'condition' => '1'],
                ['id' => 'menu-transfer', 'source' => 'main-menu', 'target' => 'transfer', 'condition' => '2'],
                ['id' => 'balance-end', 'source' => 'balance', 'target' => 'end'],
                ['id' => 'transfer-end', 'source' => 'transfer', 'target' => 'end']
            ],
            'viewport' => ['x' => 0, 'y' => 0, 'zoom' => 1]
        ];
    }

    /**
     * Get e-commerce flow data structure.
     */
    private function getEcommerceFlowData(): array
    {
        return [
            'nodes' => [
                [
                    'id' => 'start',
                    'type' => 'start',
                    'position' => ['x' => 100, 'y' => 100],
                    'data' => [
                        'label' => 'Welcome',
                        'message' => 'Welcome to Online Store'
                    ]
                ],
                [
                    'id' => 'menu',
                    'type' => 'menu',
                    'position' => ['x' => 300, 'y' => 100],
                    'data' => [
                        'label' => 'Store Menu',
                        'options' => [
                            ['key' => '1', 'text' => 'Browse Products'],
                            ['key' => '2', 'text' => 'My Orders'],
                            ['key' => '3', 'text' => 'Customer Support']
                        ]
                    ]
                ],
                [
                    'id' => 'products',
                    'type' => 'response',
                    'position' => ['x' => 500, 'y' => 50],
                    'data' => [
                        'label' => 'Products',
                        'message' => 'Available products: {product_list}'
                    ]
                ],
                [
                    'id' => 'end',
                    'type' => 'end',
                    'position' => ['x' => 700, 'y' => 100],
                    'data' => [
                        'label' => 'End',
                        'message' => 'Thank you for shopping with us'
                    ]
                ]
            ],
            'edges' => [
                ['id' => 'start-menu', 'source' => 'start', 'target' => 'menu'],
                ['id' => 'menu-products', 'source' => 'menu', 'target' => 'products', 'condition' => '1'],
                ['id' => 'products-end', 'source' => 'products', 'target' => 'end']
            ],
            'viewport' => ['x' => 0, 'y' => 0, 'zoom' => 1]
        ];
    }

    /**
     * Get healthcare flow data structure.
     */
    private function getHealthcareFlowData(): array
    {
        return [
            'nodes' => [
                [
                    'id' => 'start',
                    'type' => 'start',
                    'position' => ['x' => 100, 'y' => 100],
                    'data' => [
                        'label' => 'Welcome',
                        'message' => 'Welcome to Health Services'
                    ]
                ],
                [
                    'id' => 'menu',
                    'type' => 'menu',
                    'position' => ['x' => 300, 'y' => 100],
                    'data' => [
                        'label' => 'Health Menu',
                        'options' => [
                            ['key' => '1', 'text' => 'Book Appointment'],
                            ['key' => '2', 'text' => 'Health Tips'],
                            ['key' => '3', 'text' => 'Emergency Contact']
                        ]
                    ]
                ],
                [
                    'id' => 'appointment',
                    'type' => 'input',
                    'position' => ['x' => 500, 'y' => 50],
                    'data' => [
                        'label' => 'Appointment',
                        'message' => 'Enter your preferred date (DD/MM/YYYY):',
                        'variable' => 'appointment_date'
                    ]
                ],
                [
                    'id' => 'end',
                    'type' => 'end',
                    'position' => ['x' => 700, 'y' => 100],
                    'data' => [
                        'label' => 'End',
                        'message' => 'Thank you for using Health Services'
                    ]
                ]
            ],
            'edges' => [
                ['id' => 'start-menu', 'source' => 'start', 'target' => 'menu'],
                ['id' => 'menu-appointment', 'source' => 'menu', 'target' => 'appointment', 'condition' => '1'],
                ['id' => 'appointment-end', 'source' => 'appointment', 'target' => 'end']
            ],
            'viewport' => ['x' => 0, 'y' => 0, 'zoom' => 1]
        ];
    }

    /**
     * Get education flow data structure.
     */
    private function getEducationFlowData(): array
    {
        return [
            'nodes' => [
                [
                    'id' => 'start',
                    'type' => 'start',
                    'position' => ['x' => 100, 'y' => 100],
                    'data' => [
                        'label' => 'Welcome',
                        'message' => 'Welcome to Student Portal'
                    ]
                ],
                [
                    'id' => 'menu',
                    'type' => 'menu',
                    'position' => ['x' => 300, 'y' => 100],
                    'data' => [
                        'label' => 'Student Menu',
                        'options' => [
                            ['key' => '1', 'text' => 'Check Results'],
                            ['key' => '2', 'text' => 'Course Registration'],
                            ['key' => '3', 'text' => 'Fee Payment']
                        ]
                    ]
                ],
                [
                    'id' => 'results',
                    'type' => 'response',
                    'position' => ['x' => 500, 'y' => 50],
                    'data' => [
                        'label' => 'Results',
                        'message' => 'Your results: {results}'
                    ]
                ],
                [
                    'id' => 'end',
                    'type' => 'end',
                    'position' => ['x' => 700, 'y' => 100],
                    'data' => [
                        'label' => 'End',
                        'message' => 'Thank you for using Student Portal'
                    ]
                ]
            ],
            'edges' => [
                ['id' => 'start-menu', 'source' => 'start', 'target' => 'menu'],
                ['id' => 'menu-results', 'source' => 'menu', 'target' => 'results', 'condition' => '1'],
                ['id' => 'results-end', 'source' => 'results', 'target' => 'end']
            ],
            'viewport' => ['x' => 0, 'y' => 0, 'zoom' => 1]
        ];
    }
}
