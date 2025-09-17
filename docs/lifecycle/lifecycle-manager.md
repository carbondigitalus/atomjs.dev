---
sidebar_position: 1
---

# LifecycleManager

The `LifecycleManager` is a centralized coordinator that orchestrates the complete component mounting sequence and provides utilities for lifecycle management, validation, and monitoring.

## Overview

The LifecycleManager ensures proper execution order of lifecycle methods, handles error scenarios gracefully, and provides tools for debugging and monitoring component lifecycle behavior.

## Core Methods

### executeMountingLifecycle

Executes the complete mounting lifecycle sequence in the correct order.

```typescript
static executeMountingLifecycle(
  component: AtomComponent<any, any>,
  createDOMNodeFn: (result: any) => Node
): Node
```

**Execution Order:**

1. `beforeMount` - Setup before rendering
2. `render` - Create virtual DOM structure
3. `createDOMNode` - Convert virtual DOM to real DOM
4. `didMount` - Setup after DOM creation

**Example:**

```typescript
import { LifecycleManager } from '@atomdev/core';

const component = new MyComponent(props);
const domNode = LifecycleManager.executeMountingLifecycle(component, createDOMNodeFn);
```

### executeAfterMountLifecycle

Handles the asynchronous `afterMount` lifecycle execution.

```typescript
static async executeAfterMountLifecycle(
  component: AfterMountCapableComponent
): Promise<void>
```

**Example:**

```typescript
// After DOM insertion
await LifecycleManager.executeAfterMountLifecycle(component);
```

## Validation Methods

### supportsFullMountingLifecycle

Checks if a component supports the complete mounting lifecycle.

```typescript
static supportsFullMountingLifecycle(
  component: unknown
): component is FullLifecycleComponent
```

**Example:**

```typescript
if (LifecycleManager.supportsFullMountingLifecycle(component)) {
    // Component has all required lifecycle methods
    console.log('Component supports full lifecycle');
}
```

### validateMountingReadiness

Ensures a component is ready for the mounting process.

```typescript
static validateMountingReadiness(
  component: AtomComponent<any, any>
): void
```

**Validation Checks:**

-   Constructor has been called
-   Component is not already mounted
-   Component is not currently mounting
-   Component has a `render` method

**Example:**

```typescript
try {
    LifecycleManager.validateMountingReadiness(component);
    // Safe to proceed with mounting
} catch (error) {
    console.error('Component not ready:', error.message);
}
```

## Monitoring Methods

### getLifecyclePhase

Returns the current lifecycle phase of a component.

```typescript
static getLifecyclePhase(
  component: AtomComponent<any, any>
): 'constructed' | 'mounting' | 'mounted' | 'unknown'
```

**Example:**

```typescript
const phase = LifecycleManager.getLifecyclePhase(component);
console.log(`Component is in ${phase} phase`);

switch (phase) {
    case 'constructed':
        // Component created but not mounting
        break;
    case 'mounting':
        // Currently in mounting process
        break;
    case 'mounted':
        // Fully mounted and ready
        break;
    case 'unknown':
        // Indeterminate state
        break;
}
```

### createLifecycleEvent

Creates lifecycle event objects for debugging and monitoring.

```typescript
static createLifecycleEvent(
  component: AtomComponent<any, any>,
  phase: 'beforeMount' | 'didMount' | 'afterMount' | 'beforeUnmount',
  timestamp?: number
)
```

**Example:**

```typescript
const event = LifecycleManager.createLifecycleEvent(component, 'afterMount');

console.log({
    component: event.componentName,
    phase: event.phase,
    timestamp: event.timestamp,
    props: event.props,
    state: event.state,
});
```

## Complete Lifecycle Coordination

### Full Mounting Example

```typescript
import { LifecycleManager } from '@atomdev/core';

class ComponentRenderer {
    async mountComponent(component: AtomComponent, container: Element) {
        try {
            // 1. Validate component readiness
            LifecycleManager.validateMountingReadiness(component);

            // 2. Check lifecycle support
            const hasFullLifecycle = LifecycleManager.supportsFullMountingLifecycle(component);
            console.log('Full lifecycle support:', hasFullLifecycle);

            // 3. Execute mounting lifecycle
            const domNode = LifecycleManager.executeMountingLifecycle(component, this.createDOMNode);

            // 4. Insert into DOM
            container.appendChild(domNode);

            // 5. Execute afterMount
            if (hasFullLifecycle) {
                await LifecycleManager.executeAfterMountLifecycle(component);
            }

            // 6. Component is fully mounted
            console.log('Component phase:', LifecycleManager.getLifecyclePhase(component));
        } catch (error) {
            console.error('Mounting failed:', error);
        }
    }
}
```

## Event Monitoring

### Lifecycle Event Tracking

```typescript
class LifecycleMonitor {
    private events: any[] = [];

    trackComponent(component: AtomComponent) {
        // Track beforeMount
        const beforeMountEvent = LifecycleManager.createLifecycleEvent(component, 'beforeMount');
        this.events.push(beforeMountEvent);

        // Track afterMount
        const afterMountEvent = LifecycleManager.createLifecycleEvent(component, 'afterMount');
        this.events.push(afterMountEvent);
    }

    getComponentHistory(componentName: string) {
        return this.events.filter((event) => event.componentName === componentName);
    }
}
```

## Error Handling

The LifecycleManager provides robust error handling throughout the mounting process:

```typescript
class SafeMountingExample {
    async safeMount(component: AtomComponent) {
        try {
            // Validation errors throw immediately
            LifecycleManager.validateMountingReadiness(component);

            // Lifecycle execution has built-in error recovery
            const domNode = LifecycleManager.executeMountingLifecycle(component, this.createDOMNode);

            // afterMount errors are caught and logged
            await LifecycleManager.executeAfterMountLifecycle(component);
        } catch (validationError) {
            // Handle validation failures
            console.error('Component validation failed:', validationError);
            return null;
        }

        // Lifecycle method errors don't throw - they're logged
        // Component remains functional even if lifecycle methods fail
    }
}
```

## Best Practices

### Component Factory Pattern

```typescript
class ComponentFactory {
    static async create<T extends AtomComponent>(
        ComponentClass: new (props: any) => T,
        props: any,
        container: Element,
    ): Promise<T> {
        const component = new ComponentClass(props);

        // Validate before mounting
        LifecycleManager.validateMountingReadiness(component);

        // Execute mounting
        const domNode = LifecycleManager.executeMountingLifecycle(component, this.createDOMNode);

        container.appendChild(domNode);

        // Complete with afterMount
        await LifecycleManager.executeAfterMountLifecycle(component);

        return component;
    }
}
```

### Development Debugging

```typescript
class DevTools {
    static enableLifecycleLogging(component: AtomComponent) {
        const originalValidate = LifecycleManager.validateMountingReadiness;

        LifecycleManager.validateMountingReadiness = (comp) => {
            console.log('Validating:', comp.constructor.name);
            const phase = LifecycleManager.getLifecyclePhase(comp);
            console.log('Current phase:', phase);

            return originalValidate(comp);
        };
    }
}
```

## Testing

### Unit Testing with LifecycleManager

```typescript
describe('Component Mounting', () => {
    it('should complete full mounting lifecycle', async () => {
        const component = new TestComponent(props);

        // Validate readiness
        expect(() => {
            LifecycleManager.validateMountingReadiness(component);
        }).not.toThrow();

        // Check lifecycle support
        expect(LifecycleManager.supportsFullMountingLifecycle(component)).toBe(true);

        // Execute mounting
        const domNode = LifecycleManager.executeMountingLifecycle(component, mockCreateDOMNode);

        expect(domNode).toBeDefined();

        // Execute afterMount
        await LifecycleManager.executeAfterMountLifecycle(component);

        // Verify final state
        expect(LifecycleManager.getLifecyclePhase(component)).toBe('mounted');
    });
});
```

## Performance Considerations

-   LifecycleManager methods are lightweight and optimized for production use
-   Validation checks are minimal overhead operations
-   Event creation is optional and should be used primarily for debugging
-   Error handling has no performance impact when lifecycle methods succeed
