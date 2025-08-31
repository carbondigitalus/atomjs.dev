---
sidebar_position: 11
---

# Refs (Coming Soon)

**Refs** give your component a direct handle to a DOM node (or a child component instance) for imperative reads/writes—think measurements, focus management, or integrating third-party libraries.

> Status  
> • Callback refs on intrinsic elements → **Coming soon**  
> • Object refs (mutable holder) → **Coming soon**  
> • Component instance refs → **Coming soon**

---

## Why refs?

-   Read layout/size (e.g., `getBoundingClientRect()`)
-   Control focus/selection (`el.focus()`, `el.select()`)
-   Imperative scroll, animations, and third-party widgets
-   Integrate with non-AtomJS code that expects a DOM element

---

## Callback refs (planned)

Callback refs receive the underlying element when it mounts/updates, and `null` when it unmounts.

```tsx
import { AtomComponent } from '@atomdev/core';

export class FocusInput extends AtomComponent {
    private inputEl?: HTMLInputElement;

    // Coming soon: callback ref API
    render() {
        return (
            <input
                type='text'
                ref={(el) => {
                    this.inputEl = el ?? undefined;
                }}
            />
        );
    }

    afterMount() {
        this.inputEl?.focus();
    }

    beforeUnmount() {
        this.inputEl = undefined;
    }
}
```

---

## Object refs (planned)

Object refs store the element on a stable `.current` field.

```tsx
// Coming soon
interface RefObject<T> {
    current: T | null;
}

export class MeasureBox extends AtomComponent {
    private boxRef: RefObject<HTMLDivElement> = { current: null };

    render() {
        return <div ref={this.boxRef}>Measure me</div>;
    }

    afterMount() {
        const rect = this.boxRef.current?.getBoundingClientRect();
        // use rect…
    }

    beforeUnmount() {
        this.boxRef.current = null;
    }
}
```

---

## Component instance refs (planned)

For child components, refs provide access to **public** methods/fields you explicitly expose.

```tsx
// Coming soon
export class Player extends AtomComponent {
    play() {
        /* ... */
    }
    pause() {
        /* ... */
    }
    render() {
        return <button>...</button>;
    }
}

export class App extends AtomComponent {
    private playerRef: { current: Player | null } = { current: null };

    render() {
        return (
            <>
                <Player ref={this.playerRef} />
                <button onClick={() => this.playerRef.current?.play()}>Play</button>
            </>
        );
    }
}
```

> Keep public instance APIs small and intentional. Prefer props/state for data flow; use refs for targeted imperative control.

---

## Patterns & pitfalls

-   ✅ Read/measure DOM in `afterMount`/`afterUpdate`; clean in `beforeUnmount`.
-   ✅ Guard ref usage (`if (this.inputEl) …`)—refs can be `undefined/null`.
-   ❌ Don’t sprinkle refs everywhere; overuse makes code harder to reason about.
-   ❌ Don’t mutate the DOM in ways that conflict with AtomJS’s own updates.

---

## Temporary workarounds (until refs land)

If you must access a node today, use a stable `id` or selector in `afterMount`:

```tsx
export class LegacyFocus extends AtomComponent {
    afterMount() {
        const el = document.querySelector<HTMLInputElement>('#legacy-input');
        el?.focus();
    }

    render() {
        return (
            <input
                id='legacy-input'
                type='text'
            />
        );
    }
}
```

This keeps logic **class-based** and localized until the official `ref` API ships.

---

:::tip Next Step
Continue to **Reconciliation & Keys (Deep Dive)** for a closer look at how AtomJS matches, moves, and updates nodes efficiently.
:::
