---
sidebar_position: 7
---

# State Management

State holds data that **changes over time** inside a class component.  
Initialize it in the constructor and update it with `setState` **after mount**.

> **Status**
>
> -   `setState` shallow-merges state. **Available**
> -   Update scheduling / re-render on `setState`. **Coming soon**
> -   Functional `setState` form (using an updater function). **Coming soon**
> -   Batching multiple `setState` calls. **Coming soon**

---

## Rules of state

-   **Initialize in `constructor`** using `this.state = { ... }`.
-   **Do not call `setState` in the constructor.** Guards will throw.
-   `setState(partial)` performs a **shallow merge** into the current state.
-   Re-rendering after `setState` is **coming soon** (merging works today; scheduling/patching will land shortly).

---

## Initialize state

```tsx
import { AtomComponent } from '@atomdev/core';

interface State {
    count: number;
    loading: boolean;
}

export class Counter extends AtomComponent<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = { count: 0, loading: false };
    }

    render() {
        return <p>Count: {this.state.count}</p>;
    }
}
```

---

## Update state after mount

Use `setState` (post-mount) to merge partial updates.

```tsx
export class Counter extends AtomComponent<{}, { count: number }> {
    constructor(props: {}) {
        super(props);
        this.state = { count: 0 };
    }

    increment = () => {
        this.setState({ count: this.state.count + 1 }); // merges; re-render scheduling coming soon
    };

    render() {
        return (
            <div>
                <p>Count: {this.state.count}</p>
                <button onClick={this.increment}>Add</button>
            </div>
        );
    }
}
```

> **Why not in the constructor?**
> The base class enforces that `setState` is only used after the component has mounted.

---

## Shallow merge semantics

`setState` merges one level deep:

```tsx
interface State {
    user: { name: string; theme: { mode: 'light' | 'dark' } };
}

export class Profile extends AtomComponent<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = { user: { name: 'Ava', theme: { mode: 'light' } } };
    }

    // This replaces `user.theme` entirely unless you spread the previous value
    setDarkMode = () => {
        this.setState({
            user: { ...this.state.user, theme: { mode: 'dark' } },
        });
    };

    render() {
        return (
            <div>
                <p>{this.state.user.name}</p>
                <button onClick={this.setDarkMode}>Dark Mode</button>
            </div>
        );
    }
}
```

If you need deep updates, **spread nested objects yourself** (or use your own helper) before passing to `setState`.

---

## Scheduling, batching, and functional updates (coming soon)

Planned enhancements:

-   **Re-render scheduling:** `setState` will trigger a diff/patch cycle automatically.
-   **Batching:** multiple `setState` calls in the same tick will be coalesced.
-   **Functional form:** `setState(updater)` where `updater(prevState, props)` returns the partial state, avoiding stale reads during batching.

```tsx
// Example API (coming soon)
this.setState((prev) => ({ count: prev.count + 1 }));
```

Until these land, prefer a **single** `setState` per user action and compute new state from the current instance state.

---

## Deriving state from props

When new props arrive, you may want to adjust state.

-   For simple cases, compute values **inside `render()`** from props—no extra state required.
-   For synchronized state (e.g., caching a prop value), a hook like `beforePropsUpdate(nextProps)` is planned. **Coming soon**

---

## Side effects with state

Start effects that depend on the DOM in `afterMount` and clean them in `beforeUnmount`.

```tsx
export class Ticker extends AtomComponent<{}, { t: number }> {
    private id?: number;

    constructor(props: {}) {
        super(props);
        this.state = { t: 0 };
    }

    afterMount() {
        this.id = window.setInterval(() => {
            this.setState({ t: this.state.t + 1 }); // re-render scheduling coming soon
        }, 1000);
    }

    beforeUnmount() {
        if (this.id) window.clearInterval(this.id);
    }

    render() {
        return <span>{this.state.t}s</span>;
    }
}
```

---

## Patterns & pitfalls

-   ✅ Initialize once in the constructor with `this.state = {...}`.
-   ✅ Treat state as **immutable**; construct new objects when updating.
-   ✅ Prefer computing derived values in `render()` when feasible.
-   ❌ Don’t call `setState` in the constructor (guarded).
-   ❌ Don’t rely on deep merging; `setState` is **shallow**.
-   🔜 Avoid multiple sequential `setState` calls; batching will arrive soon.

---

:::tip Next Step
Head to **Event Handling (Advanced Patterns)** for preventDefault/stopPropagation, keyboard interactions, and composing event callbacks across components.
:::
