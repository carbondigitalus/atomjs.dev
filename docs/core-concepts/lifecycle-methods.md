---
sidebar_position: 5
---

# Lifecycle Methods

AtomJS class components extend `AtomComponent<P, S>` and can participate in a set of lifecycle hooks.  
Below is the comprehensive lifecycle, including hooks that are planned but not yet implemented.

> Status legend  
> • Available — implemented in `AtomComponent` today  
> • Coming soon — planned API, not yet implemented

---

## Mounting phase

Components are created and inserted into the DOM.

**Order of operations**

1. `constructor(props)` — initialize state and bind methods. **Available**
2. `beforeMount()` — runs before the first render. **Available**
3. `render()` — return JSX/VNode. **Available**
4. `afterMount()` — runs after the component is mounted to the DOM. **Available**

> State rules  
> • Initialize with `this.state = { ... }` in the constructor.  
> • Do not call `setState` in the constructor. Guards will throw.  
> • `setState` merges partial state and will participate in the update pipeline once scheduling lands. **Coming soon**

---

## Updating phase

Components re-render due to prop or state changes.

**Order of operations**

1. `beforePropsUpdate(nextProps)` — observe incoming props early. **Coming soon**
2. `shouldUpdate(nextProps, nextState)` — return boolean to control re-render. **Available**
3. `beforeUpdate(nextProps, nextState)` — prepare just before render. **Available**
4. `render()` — return updated JSX/VNode. **Available**
5. `afterUpdate(prevProps, prevState)` — run effects after DOM patches. **Available**
6. `onRenderComplete()` — notified after the render phase completes. **Coming soon**

**Snapshotting and fine control**

-   `captureSnapshot(prevProps, prevState)` — capture DOM info (e.g., scroll) before patch, passed to `afterUpdate`. **Coming soon**
-   `shouldComponentUpdate(nextProps, nextState, nextContext)` — alternative granular guard; may coexist with `shouldUpdate`. **Coming soon**

---

## Unmounting phase

Components are removed from the DOM.

**Order of operations**

1. `beforeUnmount()` — cleanup subscriptions, timers, observers. **Available**

---

## Error handling phase

Catch and recover from errors thrown in render or lifecycle methods.

-   `catchError(error, errorInfo)` — error boundary hook; return a value to indicate handled. **Coming soon**
-   `onErrorRecover()` — called after an error boundary successfully recovers. **Coming soon**

---

## Context and state management

-   `onContextUpdate(newContext, oldContext)` — respond to context provider changes. **Coming soon**
-   `onStateUpdate(newState, oldState)` — observe state transitions beyond the normal update loop. **Coming soon**

---

## Advanced mounting/unmounting

-   `onReattach()` — called when a component re-connects to the DOM (e.g., hot reload scenarios). **Coming soon**
-   `onPause()` — component enters a suspended state (async render). **Coming soon**
-   `onResume()` — resumes from suspension. **Coming soon**

---

## Complete reference

| Method                                          | Phase             | Purpose                                | Status                                 |
| ----------------------------------------------- | ----------------- | -------------------------------------- | -------------------------------------- |
| `constructor(props)`                            | Mounting          | Initialize state, bind handlers        | Available                              |
| `beforeMount()`                                 | Mounting          | Setup before initial render            | Available                              |
| `render()`                                      | Mounting/Updating | Return JSX/VNode                       | Available                              |
| `afterMount()`                                  | Mounting          | Start timers, subscriptions, DOM reads | Available                              |
| `beforePropsUpdate(nextProps)`                  | Updating          | Observe incoming props early           | Coming soon                            |
| `shouldUpdate(nextProps, nextState)`            | Updating          | Skip unnecessary renders               | Available                              |
| `captureSnapshot(prevProps, prevState)`         | Updating          | Snapshot DOM before patch              | Coming soon                            |
| `beforeUpdate(nextProps, nextState)`            | Updating          | Prepare for update                     | Available                              |
| `afterUpdate(prevProps, prevState[, snapshot])` | Updating          | Effects after patch                    | Available (snapshot param coming soon) |
| `onRenderComplete()`                            | Updating          | Post-render notification               | Coming soon                            |
| `beforeUnmount()`                               | Unmounting        | Cleanup work                           | Available                              |
| `catchError(error, errorInfo)`                  | Error             | Error boundary hook                    | Coming soon                            |
| `onErrorRecover()`                              | Error             | After successful recovery              | Coming soon                            |
| `onContextUpdate(newCtx, oldCtx)`               | Context           | React to context changes               | Coming soon                            |
| `onStateUpdate(newState, oldState)`             | State             | Observe state transitions              | Coming soon                            |
| `onReattach()`                                  | Advanced          | Handle DOM reconnection                | Coming soon                            |
| `onPause()`                                     | Advanced          | Suspend component                      | Coming soon                            |
| `onResume()`                                    | Advanced          | Resume component                       | Coming soon                            |

---

## Example usage

The example below shows available hooks and illustrates planned ones.  
Replace “Coming soon” sections with real logic as features land.

```tsx
import { AtomComponent } from '@atomdev/core';

interface Props {}
interface State {
    count: number;
}
interface Snapshot {
    scrollTop: number;
}

export class MyComponent extends AtomComponent<Props, State> {
    private containerRef?: HTMLDivElement;
    private timer?: number;

    constructor(props: Props) {
        super(props);
        this.state = { count: 0 };
    }

    // Mounting
    beforeMount() {
        // Setup that must run before initial render
    }

    afterMount() {
        // Start timers, subscriptions, or measure DOM
        this.timer = window.setInterval(() => {
            // Once scheduling is active, this will trigger update
            this.setState({ count: this.state.count + 1 }); // Coming soon: scheduled re-render
        }, 1000);
    }

    // Updating — guard
    shouldUpdate(nextProps: Props, nextState: State) {
        return nextState.count !== this.state.count;
    }

    // Updating — prepare
    beforeUpdate(nextProps: Props, nextState: State) {
        // Prepare for incoming update
    }

    // Updating — snapshot (coming soon)
    captureSnapshot(prevProps: Props, prevState: State): Snapshot | void {
        // Coming soon: capture scroll position before patch
        if (this.containerRef) {
            return { scrollTop: this.containerRef.scrollTop };
        }
    }

    // Updating — effects
    afterUpdate(prevProps: Props, prevState: State, snapshot?: Snapshot) {
        // Restore scroll from snapshot (when available)
        if (snapshot && this.containerRef) {
            this.containerRef.scrollTop = snapshot.scrollTop;
        }
    }

    // Error boundary (coming soon)
    catchError(error: unknown, errorInfo: unknown): boolean | void {
        // Log error, optionally render a fallback
        // Return true to signal handled recovery
        return true;
    }

    // Unmounting
    beforeUnmount() {
        if (this.timer) window.clearInterval(this.timer);
    }

    // Rendering
    increment = () => {
        this.setState({ count: this.state.count + 1 }); // Coming soon: scheduled re-render
    };

    render() {
        return (
            <div ref={(el) => (this.containerRef = el ?? undefined)}>
                <p>Count: {this.state.count}</p>
                <button onClick={this.increment}>Add</button>
            </div>
        );
    }
}
```
