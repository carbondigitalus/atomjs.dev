---
sidebar_position: 2
---

# JSX Runtime

AtomJS ships its own **JSX runtime** so that JSX written inside your class components compiles into **AtomJS VNodes**, not anything else. You don’t import the runtime manually—TypeScript routes JSX calls to AtomJS based on your `tsconfig` settings.

---

## Configure TypeScript

Enable the modern JSX transform and point it at AtomJS:

```json
{
    "compilerOptions": {
        "jsx": "react-jsx",
        "jsxImportSource": "@atomdev/core"
    }
}
```

-   `jsx: "react-jsx"` enables TypeScript’s automatic JSX transform (no pragma comments needed).
-   `jsxImportSource: "@atomdev/core"` tells TS to emit calls to AtomJS’s `jsx`, `jsxs`, and `jsxDEV`.

:::note Future configuration
We plan to ship an official **AtomJS tsconfig preset** (e.g., `@atomdev/tsconfig`) so new projects can extend a base config with JSX pre-wired to AtomJS.
Until then, using `jsx: "react-jsx"` is just a **TypeScript flag name**—it does **not** add React or tie you to it. The emitted calls still target `@atomdev/core`.
:::

> You don’t need to import `jsx/jsxs/jsxDEV` yourself. The compiler injects those calls.

---

## How JSX becomes VNodes

When you write JSX in a component’s `render()`:

```tsx
import { AtomComponent } from '@atomdev/core';

export class Hello extends AtomComponent<{ name: string }> {
    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}
```

TypeScript compiles it roughly to:

```ts
// Pseudocode showing the idea:
jsx('h1', { children: ['Hello, ', this.props.name] });
```

-   **Intrinsic elements** like `<div>` or `<button>` produce VNodes with a string `type`.
-   **Component elements** like `<Hello />` produce VNodes whose `type` is your class (extending `AtomComponent`).

---

## `jsx`, `jsxs`, and `jsxDEV`

-   **`jsx`**: emitted for elements with **one** child.
-   **`jsxs`**: emitted for elements with **multiple** children.
-   **`jsxDEV`**: emitted in development builds; includes helpful metadata such as `__source` and `__self` to improve diagnostics.

You don’t call these directly—the compiler does.

---

## Props, Children, and Keys

```tsx
export class List extends AtomComponent<{ items: { id: string; label: string }[] }> {
    render() {
        return (
            <ul>
                {this.props.items.map((item) => (
                    <li key={item.id}>{item.label}</li>
                ))}
            </ul>
        );
    }
}
```

-   `children` is passed automatically for nested JSX.
-   `key` is a special prop used to reconcile lists efficiently. Prefer a stable ID over an array index.

---

## Fragments

```tsx
export class Duo extends AtomComponent {
    render() {
        return (
            <>
                <span>Alpha</span>
                <span>Beta</span>
            </>
        );
    }
}
```

Fragments compile to VNodes that do not create a real DOM node.

---

## Events in JSX

```tsx
export class Button extends AtomComponent<{ label?: string }> {
    handleClick = () => {
        // ...
    };

    render() {
        return <button onClick={this.handleClick}>{this.props.label ?? 'Click'}</button>;
    }
}
```

(See the **Events** page for patterns and guardrails around state updates.)

---

## Type Safety

AtomJS provides typings so that:

-   Intrinsic elements validate attributes in JSX.
-   Component props are strongly typed via generics on `AtomComponent<P, S>`.
-   Children are typed through the `children` prop on `P` when needed.

If you maintain your own global JSX declarations, ensure they’re compatible with AtomJS’s VNode/Props types.

---

## Common Pitfalls

-   **Missing `jsxImportSource`** → JSX won’t resolve to AtomJS; double-check `tsconfig.json`.
-   **Using function components** → AtomJS is class-based; extend `AtomComponent` and implement `render()`.
-   **Calling `setState` in the constructor** → Not allowed; initialize with `this.state = { … }` in the constructor and use `setState` only after mount.

---

:::tip Next Step
Go deeper with **Element Creation (`createElement`)** to understand the lower-level building blocks behind the JSX runtime.
:::
