---
title: didMount
description: Execute setup after DOM creation but before DOM insertion.
sidebar_position: 4
---

# didMount

**Phase:** Mounting  
**Timing:** After the first `render()` and DOM creation, but **before** DOM insertion into the document.

## Signature

```ts
didMount(): void | Promise<void>
```

### Access inside the hook

-   this.props — merged with defaultProps, validated by propTypes (if provided)
-   this.state — current state after constructor and beforeMount
-   this.setState(partial) — allowed; merges state but does not schedule re-render during mount phase
-   DOM elements — created and accessible via refs, but not yet in document
-   Refs — populated and ready to use

## Rules

-   Called once per instance
-   Runs after DOM creation but before insertion into document
-   Can be async (Promise return values are handled but not awaited)
-   Errors are caught; component still renders
-   DOM elements exist but may not have final computed styles

## Common Patterns

### Example 1: DOM Measurements and Setup

```tsx
class MeasuredComponent extends AtomComponent<{}, { width: number; height: number }> {
    private containerRef: HTMLElement | null = null;
    private canvasRef: HTMLCanvasElement | null = null;

    constructor(p: {}) {
        super(p);
        this.state = { width: 0, height: 0 };
    }

    didMount() {
        // DOM elements exist and refs are populated
        if (this.containerRef) {
            const rect = this.containerRef.getBoundingClientRect();
            this.setState({ width: rect.width, height: rect.height });
        }

        // Initialize canvas context
        if (this.canvasRef) {
            const ctx = this.canvasRef.getContext('2d');
            if (ctx) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(0, 0, 100, 100);
            }
        }
    }

    render(): VNode {
        return createElement(
            'div',
            {
                ref: (el: HTMLElement | null) => (this.containerRef = el),
            },
            createElement('canvas', {
                ref: (el: HTMLCanvasElement | null) => (this.canvasRef = el),
                width: 200,
                height: 200,
            }),
            createElement('p', {}, `Dimensions: ${this.state.width}x${this.state.height}`),
        );
    }
}
```

### Example 2: Third-Party Library Integration

```tsx
class ChartComponent extends AtomComponent<{ data: number[] }> {
    private chartRef: HTMLCanvasElement | null = null;
    private chart: any = null;

    didMount() {
        if (this.chartRef) {
            // Initialize chart library that needs DOM element
            this.chart = new ThirdPartyChart(this.chartRef, {
                type: 'line',
                data: this.props.data,
                options: { responsive: false }, // Not in document yet
            });
        }
    }

    beforeUnmount() {
        if (this.chart) {
            this.chart.destroy();
        }
    }

    render(): VNode {
        return createElement(
            'div',
            { className: 'chart-container' },
            createElement('canvas', {
                ref: (el: HTMLCanvasElement | null) => (this.chartRef = el),
            }),
        );
    }
}
```

### Example 3: Async Operations with Error Handling

```tsx
class AsyncSetupComponent extends AtomComponent<
    { userId: string },
    {
        ready: boolean;
        error?: string;
    }
> {
    private mapRef: HTMLDivElement | null = null;

    constructor(p: { userId: string }) {
        super(p);
        this.state = { ready: false };
    }

    async didMount() {
        try {
            await this.initializeComplexSetup();
            this.setState({ ready: true });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Setup failed';
            this.setState({ error: message });
        }
    }

    private async initializeComplexSetup(): Promise<void> {
        // Simulate async initialization
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (this.mapRef) {
            // Initialize map component
            console.log('Map initialized with DOM element');
        }

        // Fetch initial data
        const response = await fetch(`/api/user/${this.props.userId}`);
        if (!response.ok) throw new Error('Failed to load user data');
    }

    render(): VNode {
        return createElement(
            'div',
            {},
            createElement(
                'div',
                {
                    ref: (el: HTMLDivElement | null) => (this.mapRef = el),
                    className: 'map-container',
                },
                this.state.ready ? 'Map Ready' : 'Initializing...',
            ),
            this.state.error && createElement('div', { className: 'error' }, this.state.error),
        );
    }
}
```

### Example 4: Component Registration

```tsx
class RegisteredComponent extends AtomComponent {
    private elementRef: HTMLElement | null = null;

    didMount() {
        // Register component with a global manager
        if (this.elementRef) {
            GlobalComponentManager.register(this.elementRef, this);
        }
    }

    beforeUnmount() {
        if (this.elementRef) {
            GlobalComponentManager.unregister(this.elementRef);
        }
    }

    render(): VNode {
        return createElement(
            'div',
            {
                'ref': (el: HTMLElement | null) => (this.elementRef = el),
                'data-component-id': 'registered',
            },
            'Registered Component',
        );
    }
}
```

## Do / Don't

### Do

-   Access and manipulate DOM elements via refs
-   Initialize third-party libraries that need DOM elements
-   Perform DOM measurements (though results may not be final)
-   Start async operations that don't require full document insertion
-   Use setState to update component state

### Don't

-   Rely on computed styles being final (element not in document yet)
-   Assume element is visible or has final layout
-   Perform operations requiring full document insertion (use afterMount instead)
-   Assume getBoundingClientRect will return final values

## Timing Considerations

**didMount vs afterMount:**

-   **didMount:** DOM exists, refs populated, but element not in document
-   **afterMount:** DOM exists, refs populated, AND element is in document with final styles

Use `didMount` for:

-   Third-party library initialization
-   Basic DOM setup
-   Component registration

Use `afterMount` for:

-   Focus management
-   Scroll positioning
-   Operations requiring computed styles
-   Intersection observers

## Testing Tips

```tsx
// Test didMount timing
test('didMount called after DOM creation', () => {
    let didMountCalled = false;

    class TestComponent extends AtomComponent {
        didMount() {
            didMountCalled = true;
        }
        render() {
            return createElement('div', {}, 'test');
        }
    }

    const container = document.createElement('div');
    render(createElement(TestComponent), container);

    // didMount should be called synchronously after render
    expect(didMountCalled).toBe(true);
    expect(container.innerHTML).toContain('test');
});
```

## Error Handling

```tsx
class RobustDidMount extends AtomComponent<{}, { initError?: string }> {
    didMount() {
        try {
            this.riskyInitialization();
        } catch (error) {
            this.setState({
                initError: error instanceof Error ? error.message : 'Initialization failed',
            });
        }
    }

    private riskyInitialization() {
        // Risky DOM operations
    }

    render(): VNode {
        return createElement(
            'div',
            {},
            this.state.initError
                ? createElement('div', { className: 'error' }, this.state.initError)
                : createElement('div', {}, 'Component ready'),
        );
    }
}
```
