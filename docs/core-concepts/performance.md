---
sidebar_position: 13
---

# Performance & Optimization

This guide focuses on optimizations you can use **today** with AtomJS class components.

> Status  
> • `shouldUpdate` guard → **Available**  
> • Keyed reconciliation for lists → **Available**  
> • Shallow-merge `setState` → **Available** (re-render scheduling **coming soon**)  
> • Snapshot/onRenderComplete → **Coming soon**  
> • Batching/functional `setState` → **Coming soon**

---

## 1) Use `shouldUpdate` to skip unnecessary work

Return `false` when the rendered output wouldn’t change.

```tsx
import { AtomComponent } from '@atomdev/core';

interface Props {
    value: number;
}
interface State {
    cached?: number;
}

export class Meter extends AtomComponent<Props, State> {
    shouldUpdate(nextProps: Props) {
        return nextProps.value !== this.props.value;
    }

    render() {
        return (
            <progress
                max='100'
                value={this.props.value}
            />
        );
    }
}
```

**Tips**

-   Keep `shouldUpdate` fast, side-effect free.
-   Compare props/state by value or stable references you control.

---

## 2) Provide **stable keys** for dynamic lists

Keys let the reconciler **move** nodes instead of recreating them.

```tsx
interface Item {
    id: string;
    label: string;
}

export class List extends AtomComponent<{ items: Item[] }> {
    render() {
        return (
            <ul>
                {this.props.items.map((i) => (
                    <li key={i.id}>{i.label}</li>
                ))}
            </ul>
        );
    }
}
```

Avoid array indices as keys for reordering/removal scenarios.

---

## 3) Minimize work inside `render()`

-   Precompute heavy values **outside** hot paths or cache on the instance.
-   Avoid creating new arrays/objects on every render if you only pass them through.
-   Move expensive formatting to helpers.

```tsx
export class Price extends AtomComponent<{ cents: number }> {
    private format(cents: number) {
        return `$${(cents / 100).toFixed(2)}`;
    }
    render() {
        return <span>{this.format(this.props.cents)}</span>;
    }
}
```

---

## 4) Treat state as immutable (shallow merge semantics)

`setState` merges **one level deep**. Copy nested objects yourself.

```tsx
interface State {
    user: { name: string; theme: { mode: 'light' | 'dark' } };
}

export class Profile extends AtomComponent<{}, State> {
    constructor(p: {}) {
        super(p);
        this.state = { user: { name: 'Ava', theme: { mode: 'light' } } };
    }

    dark = () => {
        this.setState({ user: { ...this.state.user, theme: { mode: 'dark' } } });
    };

    render() {
        return <button onClick={this.dark}>Dark</button>;
    }
}
```

---

## 5) Throttle/debounce noisy events

Limit update frequency for `onInput`, `onScroll`, `onPointerMove`, etc.

```tsx
export class SearchBox extends AtomComponent<{}, { q: string }> {
    private t?: number;
    constructor(p: {}) {
        super(p);
        this.state = { q: '' };
    }

    onInput = (e: Event) => {
        const q = (e.target as HTMLInputElement).value;
        window.clearTimeout(this.t);
        this.t = window.setTimeout(() => this.setState({ q }), 150);
    };

    beforeUnmount() {
        if (this.t) window.clearTimeout(this.t);
    }

    render() {
        return (
            <input
                type='search'
                onInput={this.onInput}
            />
        );
    }
}
```

---

## 6) Split large components

Break big components into smaller ones so `shouldUpdate` and keyed diffs act on tighter scopes.

```tsx
class Row extends AtomComponent<{ id: string; label: string }> {
    shouldUpdate(n: { id: string; label: string }) {
        return n.label !== this.props.label;
    }
    render() {
        return <li>{this.props.label}</li>;
    }
}

export class Table extends AtomComponent<{ rows: { id: string; label: string }[] }> {
    render() {
        return (
            <ul>
                {this.props.rows.map((r) => (
                    <Row
                        key={r.id}
                        {...r}
                    />
                ))}
            </ul>
        );
    }
}
```

---

## 7) Measure first, then optimize

-   Use simple counters/timestamps to time hot paths in dev builds.
-   Inspect how often `render()` runs; add `shouldUpdate` where it matters.
-   Profile list updates (append, remove, reorder) with/without keys.

---

## 8) Coming soon hooks to fold in later

-   **Batching & scheduling** — multiple state updates coalesced per tick.
-   **Functional `setState`** — `setState(prev => next)` to avoid stale reads.
-   **`captureSnapshot` & `onRenderComplete`** — pre/post-DOM hooks for measuring and tuning.

Once these land, revisit hot paths and replace manual guards with the built-in mechanisms.

---

## Quick checklist

-   ✅ Add `shouldUpdate` to hot components.
-   ✅ Use stable keys in lists; avoid index keys on reorders.
-   ✅ Keep `render()` pure and light; hoist heavy work.
-   ✅ Shallow-merge friendly state updates (copy nested objects).
-   ✅ Throttle/debounce high-frequency events.
-   🔜 Adopt batching/functional `setState` when available.
