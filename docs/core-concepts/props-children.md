---
sidebar_position: 6
---

# Props & Children

Props are how data flows **into** AtomJS class components. Children are just a special prop that carries nested content. This page covers typing, defaults, validation, and list keys.

---

## Typing props on class components

Use the first generic on `AtomComponent<P, S>` for props:

```tsx
import { AtomComponent } from '@atomdev/core';

interface GreetingProps {
    name: string;
}

export class Greeting extends AtomComponent<GreetingProps> {
    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}
```

---

## Children as a prop

Children are passed automatically when you nest JSX. Type them explicitly when you need stronger guarantees.

```tsx
import { AtomComponent } from '@atomdev/core';
import type { VNode } from '@atomdev/core';

interface CardProps {
    title: string;
    children?: VNode | VNode[]; // children are VNodes
}

export class Card extends AtomComponent<CardProps> {
    render() {
        return (
            <section class='card'>
                <h2>{this.props.title}</h2>
                <div class='content'>{this.props.children}</div>
            </section>
        );
    }
}
```

Usage:

```tsx
<Card title='Profile'>
    <p>A short bio goes here.</p>
</Card>
```

---

## Default props (merge order)

Define `static defaultProps` on the class. AtomJS merges like this:

`finalProps = { ...defaultProps, ...passedProps }`

Values provided by the caller **override** defaults.

```tsx
interface ButtonProps {
    label?: string;
    variant?: 'primary' | 'secondary';
}

export class Button extends AtomComponent<ButtonProps> {
    static defaultProps: Partial<ButtonProps> = {
        label: 'Click',
        variant: 'primary',
    };

    render() {
        const { label, variant } = this.props;
        return <button data-variant={variant}>{label}</button>;
    }
}
```

---

## Prop validation (optional)

If you define `static propTypes`, AtomJS validates incoming props at construction time and throws with a clear message if a rule fails.

**Shape**

```ts
type PropValidator = (value: unknown, propName: string, componentName: string) => Error | void;

type PropTypes = {
    [propName: string]: PropValidator;
};
```

**Example**

```tsx
import { AtomComponent, PropTypes } from '@atomdev/core';

interface AvatarProps {
    src: string;
    size?: number;
}

export class Avatar extends AtomComponent<AvatarProps> {
    static propTypes = {
        src: (v) => (typeof v === 'string' && v.length ? undefined : new Error('`src` must be a non-empty string')),
        size: (v) =>
            v == null || (typeof v === 'number' && v > 0) ? undefined : new Error('`size` must be a positive number'),
    } satisfies PropTypes;

    render() {
        const { src, size = 40 } = this.props;
        return (
            <img
                src={src}
                width={size}
                height={size}
                alt=''
            />
        );
    }
}
```

> If you ship a validators helper (e.g., `PropTypes.string`, `PropTypes.number`), you can replace the inline functions with those. Otherwise, custom validators like above work today.

---

## Immutable props

Props are **read-only**. Derive display values in `render()` or compute once in the constructor. Use **state** (via `this.state` and `setState`) for data that changes over time.

---

## Passing props down (spreading carefully)

Forward props explicitly when possible; fall back to rest/spread for pass-through components.

```tsx
interface LinkProps {
    href: string;
    children?: any;
}

export class Link extends AtomComponent<LinkProps> {
    render() {
        const { href, children, ...rest } = this.props as Record<string, unknown>;
        return (
            <a
                href={href}
                {...rest}
            >
                {children}
            </a>
        ); // ensure `rest` only contains valid DOM attributes
    }
}
```

---

## Lists and `key`

When rendering lists, set a **stable** `key` so AtomJS can match/move items precisely. Prefer IDs from your data over array indices.

```tsx
interface Item {
    id: string;
    text: string;
}

export class TodoList extends AtomComponent<{ items: Item[] }> {
    render() {
        return (
            <ul>
                {this.props.items.map((item) => (
                    <li key={item.id}>{item.text}</li>
                ))}
            </ul>
        );
    }
}
```

---

## Patterns & pitfalls

-   ✅ Type props with the component generic; keep them small and cohesive.
-   ✅ Use `defaultProps` for optional values; caller props win over defaults.
-   ✅ Validate with `propTypes` when you want runtime guarantees in dev/test.
-   ❌ Don’t mutate `this.props`. Treat props as immutable inputs.
-   ❌ Avoid passing unknown attributes to DOM nodes; validate or whitelist before spreading.

---

:::tip Next Step
Move on to **Event Handling (Advanced Patterns)** or jump to **State & setState** to see how component state evolves over time (including upcoming scheduling semantics).
:::
