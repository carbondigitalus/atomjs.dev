---
sidebar_position: 1
---

# Virtual DOM Overview

AtomJS represents your UI as a lightweight **virtual DOM (VDOM)**: an in-memory tree of nodes that mirrors what you intend to show in the browser. When something changes, AtomJS diffs the new VDOM against the previous one and applies the **minimal set of DOM updates**.

---

## What is a VNode?

A **VNode** (virtual node) is the atomic unit of the AtomJS VDOM. Conceptually, each VNode has:

-   **type** — a string tag (`'div'`, `'button'`, …) or a class component (extending `AtomComponent`)
-   **props** — attributes/props for that node (including `children`)
-   **key** _(optional)_ — a stable identifier used to reconcile lists efficiently
-   **children** — nested VNodes or text

JSX authored in your component’s `render()` method compiles into VNodes.

---

## From JSX to VNodes

TypeScript compiles your JSX into calls that produce VNodes using AtomJS’s JSX runtime.

Your `tsconfig.json` should point JSX to AtomJS:

```json
{
    "compilerOptions": {
        "jsx": "react-jsx",
        "jsxImportSource": "@atomdev/core"
    }
}
```

That setting ensures `<div />` and `<MyComponent />` create AtomJS VNodes (not React ones).

---

## Lifecycle and the VDOM

Class components extend `AtomComponent` and return a VNode tree from `render()`.

```tsx
import { AtomComponent } from '@atomdev/core';

export class Hello extends AtomComponent<{ name: string }> {
    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}
```

AtomJS coordinates rendering with lifecycle methods you can optionally implement:

-   `beforeMount` → initial VDOM build, before attaching to the DOM
-   `afterMount` → after the component is inserted into the DOM
-   `beforeUpdate(nextProps, nextState)` → before a diff/apply pass
-   `shouldUpdate(nextProps, nextState)` → return `false` to skip work
-   `afterUpdate(prevProps, prevState)` → after DOM patches are applied
-   `beforeUnmount` → cleanup before removing from the DOM

State changes go through `setState(partial)` (post-mount only). Initial state should be set in the constructor with `this.state = { … }`.

---

## Fragments

Use fragments to return multiple siblings without an extra wrapper element:

```tsx
<>
    <Hello name='Ava' />
    <Hello name='Mason' />
</>
```

Fragments compile to VNodes that don’t create a real DOM node.

---

## Lists and `key`

When rendering lists, provide a **stable `key`** so AtomJS can match, move, and update items precisely:

```tsx
export class TeamList extends AtomComponent<{ members: { id: string; name: string }[] }> {
    render() {
        return (
            <ul>
                {this.props.members.map((m) => (
                    <li key={m.id}>{m.name}</li>
                ))}
            </ul>
        );
    }
}
```

Use an ID from your data — not the array index — to avoid unnecessary re-renders.

---

## How diffing works (at a glance)

1. Build a new VNode tree by calling your component’s `render()`.
2. Compare it with the previous tree (node type, key, and props).
3. Patch only what changed:

    - Update attributes/props that differ
    - Reorder/mount/unmount children based on `key`
    - Reuse existing DOM nodes whenever possible

This keeps updates predictable and fast.

---

:::tip Next Step
Dive into the **JSX Runtime** to see how AtomJS turns your JSX into VNodes (and how to configure it cleanly).
:::
