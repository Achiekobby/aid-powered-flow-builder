# Flow Factory Usage Guide

## Basic Usage

### Create a Single Flow
```php
// Create a basic flow with default values
$flow = Flow::factory()->create();

// Create a flow for a specific user
$user = User::find(1);
$flow = Flow::factory()->for($user)->create();
```

### Create Multiple Flows
```php
// Create 5 flows
$flows = Flow::factory()->count(5)->create();

// Create 3 flows for a specific user
$user = User::find(1);
$flows = Flow::factory()->count(3)->for($user)->create();
```

## Factory States

### Active Flows
```php
// Create an active flow
$activeFlow = Flow::factory()->active()->create();

// Create 5 active flows
$activeFlows = Flow::factory()->count(5)->active()->create();
```

### Template Flows
```php
// Create a template flow
$templateFlow = Flow::factory()->template()->create();

// Create 10 template flows
$templateFlows = Flow::factory()->count(10)->template()->create();
```

### Used Flows
```php
// Create a flow with usage history
$usedFlow = Flow::factory()->used()->create();

// Create a flow with specific usage count
$flow = Flow::factory()->usageCount(500)->create();
```

## Category-Specific Flows

### Banking Flows
```php
// Create a banking flow
$bankingFlow = Flow::factory()->banking()->create();

// Create an active banking template
$bankingTemplate = Flow::factory()
    ->banking()
    ->template()
    ->create();
```

### E-commerce Flows
```php
// Create an e-commerce flow
$ecommerceFlow = Flow::factory()->ecommerce()->create();

// Create an active e-commerce flow with usage
$popularEcommerceFlow = Flow::factory()
    ->ecommerce()
    ->active()
    ->used()
    ->create();
```

### Healthcare Flows
```php
// Create a healthcare flow
$healthcareFlow = Flow::factory()->healthcare()->create();

// Create a healthcare template
$healthcareTemplate = Flow::factory()
    ->healthcare()
    ->template()
    ->create();
```

### Education Flows
```php
// Create an education flow
$educationFlow = Flow::factory()->education()->create();

// Create an active education flow
$activeEducationFlow = Flow::factory()
    ->education()
    ->active()
    ->create();
```

## Advanced Usage

### Combining States
```php
// Create an active banking flow with usage
$flow = Flow::factory()
    ->banking()
    ->active()
    ->used()
    ->create();

// Create a template e-commerce flow
$template = Flow::factory()
    ->ecommerce()
    ->template()
    ->create();
```

### Version Control
```php
// Create a flow with specific version
$flow = Flow::factory()->version(2)->create();

// Create multiple flows with different versions
$flows = Flow::factory()
    ->count(3)
    ->sequence(
        ['version' => 1],
        ['version' => 2],
        ['version' => 3]
    )
    ->create();
```

### Custom Usage Counts
```php
// Create a flow with specific usage count
$flow = Flow::factory()->usageCount(1000)->create();

// Create flows with random usage counts
$flows = Flow::factory()
    ->count(5)
    ->sequence(
        ['usage_count' => 100],
        ['usage_count' => 250],
        ['usage_count' => 500],
        ['usage_count' => 750],
        ['usage_count' => 1000]
    )
    ->create();
```

## Testing Scenarios

### User with Multiple Flows
```php
$user = User::factory()->create();

// Create various types of flows for the user
$userFlows = [
    Flow::factory()->for($user)->create(), // Regular flow
    Flow::factory()->for($user)->active()->create(), // Active flow
    Flow::factory()->for($user)->banking()->create(), // Banking flow
    Flow::factory()->for($user)->ecommerce()->active()->create(), // Active e-commerce
    Flow::factory()->for($user)->used()->create(), // Used flow
];
```

### Template Marketplace
```php
// Create template flows for different categories
$templates = [
    Flow::factory()->template()->banking()->create(),
    Flow::factory()->template()->ecommerce()->create(),
    Flow::factory()->template()->healthcare()->create(),
    Flow::factory()->template()->education()->create(),
];
```

### Popular Flows
```php
// Create flows with high usage (popular flows)
$popularFlows = Flow::factory()
    ->count(10)
    ->active()
    ->usageCount(fake()->numberBetween(500, 2000))
    ->create();
```

## Seeder Usage

### Run the Flow Seeder
```bash
php artisan db:seed --class=FlowSeeder
```

### Custom Seeder
```php
// In your custom seeder
public function run(): void
{
    // Create users first
    $users = User::factory(3)->create();

    // Create flows for each user
    foreach ($users as $user) {
        Flow::factory()
            ->count(3)
            ->for($user)
            ->create();

        Flow::factory()
            ->active()
            ->for($user)
            ->create();
    }

    // Create some templates
    Flow::factory()
        ->count(5)
        ->template()
        ->create();
}
```

## Flow Data Structure

The factory creates realistic flow data structures:

### Default Flow
- Start node
- Menu node with 3 options
- End node
- Basic edges connecting nodes

### Banking Flow
- Welcome message
- Main menu with banking options
- Balance check functionality
- Money transfer functionality
- Proper edge conditions

### E-commerce Flow
- Store welcome
- Product browsing
- Order management
- Customer support

### Healthcare Flow
- Health services welcome
- Appointment booking
- Health tips
- Emergency contacts

### Education Flow
- Student portal welcome
- Results checking
- Course registration
- Fee payment

## Available Categories

- `banking` - Banking and financial services
- `ecommerce` - E-commerce and shopping
- `healthcare` - Healthcare services
- `education` - Educational services
- `entertainment` - Entertainment and media
- `utilities` - Utility services
- `custom` - Custom applications 
