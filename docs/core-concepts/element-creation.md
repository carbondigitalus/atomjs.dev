---
sidebar_position: 3
---

# Element Creation

JSX is the ergonomic way to describe UI in AtomJS, but under the hood it becomes calls to `createElement`.  
Understanding `createElement` helps when you need **dynamic tags**, **programmatic children**, or want to reason about what JSX emits.

---

## Signature

```ts
createElement(
  type: string | (new (...args: any[]) => AtomComponent<any, any>),
  props?: Record<string, any> | null,
  ...children: any[]
)
```

-   **type** — an intrinsic tag (`'div'`, `'button'`, …) or a class component (extending `AtomComponent`)
-   **props** — attributes/props, including `key` and `children`
-   **children** — variadic children; equivalent to `props.children`

> JSX like `<div id="x">Hello</div>` compiles to
> `createElement('div', { id: 'x' }, 'Hello')`.

---

## Intrinsic element example

Inside a class component’s `render()`:

```tsx
import { AtomComponent, createElement } from '@atomdev/core';

export class PrimaryButton extends AtomComponent<{ label: string }> {
    handleClick = () => {
        // ...
    };

    render() {
        return createElement('button', { className: 'btn btn-primary', onClick: this.handleClick }, this.props.label);
    }
}
```

---

## Component element example

You can create VNodes for other **class components**:

```tsx
import { AtomComponent, createElement } from '@atomdev/core';

class Greeting extends AtomComponent<{ name: string }> {
    render() {
        return createElement('h2', null, `Hello, ${this.props.name}`);
    }
}

export class Welcome extends AtomComponent {
    render() {
        return createElement(Greeting, { name: 'Ava' });
    }
}
```

---

## Lists and `key`

When creating lists programmatically, pass a **stable `key`** to each child for efficient reconciliation:

```tsx
export class TodoList extends AtomComponent<{ items: { id: string; text: string }[] }> {
    render() {
        const children = this.props.items.map((item) => createElement('li', { key: item.id }, item.text));

        return createElement('ul', null, ...children);
    }
}
```

---

## Dynamic tag (polymorphic) patterns

Choose a tag at runtime:

```tsx
type Tag = 'a' | 'button';

export class Linkish extends AtomComponent<{ as: Tag; href?: string; onPress?: () => void }> {
    render() {
        const { as, href, onPress, children } = this.props;

        if (as === 'a') {
            return createElement('a', { href }, children);
        }

        return createElement('button', { onClick: onPress }, children);
    }
}
```

---

## Mixing `createElement` and JSX

You can freely mix styles inside `render()`—both produce identical VNodes:

```tsx
export class Mixed extends AtomComponent {
    render() {
        const footer = createElement('footer', null, '— fin —');
        return (
            <>
                <h1>Title</h1>
                <p>Body</p>
                {footer}
            </>
        );
    }
}
```

---

## Common pitfalls

-   **Don’t double-specify children.** Use either the variadic `...children` **or** `props.children`, not both.
-   **Use stable keys** for list items (IDs, not array indices).
-   **Class-only components.** Custom components must extend `AtomComponent` and implement `render()`.

---

:::tip Next Step
Continue to **Fragments** to see how to return multiple siblings without extra wrapper elements.
:::
