---
sidebar_position: 4
---

# Fragments

**Fragments** let a component return multiple siblings **without** adding an extra wrapper element to the real DOM.

They are written with the JSX short syntax: `<> ... </>`.

---

## Why fragments?

-   Avoid unnecessary wrapper `<div>` elements
-   Keep your DOM clean for styling and layout
-   Compose multiple siblings naturally inside `render()`

---

## Basic usage

```tsx
import { AtomComponent } from '@atomdev/core';

export class DashboardHeader extends AtomComponent {
    render() {
        return (
            <>
                <h1 class='page-title'>Dashboard</h1>
                <p class='subtitle'>Welcome back.</p>
            </>
        );
    }
}
```

This returns two siblings (`<h1>` and `<p>`) as one virtual unit, but **does not** create an extra DOM node.

---

## Nesting fragments

Fragments can be nested or combined with regular elements:

```tsx
export class Profile extends AtomComponent {
    render() {
        return (
            <section class='profile'>
                <>
                    <h2>About</h2>
                    <p>Small intro about the user.</p>
                </>
                <>
                    <h2>Links</h2>
                    <ul>
                        <li>
                            <a href='/settings'>Settings</a>
                        </li>
                        <li>
                            <a href='/billing'>Billing</a>
                        </li>
                    </ul>
                </>
            </section>
        );
    }
}
```

---

## Fragments with lists

You can map over data and return fragments when you don’t want a wrapper around each group:

```tsx
interface Item {
    id: string;
    title: string;
    body: string;
}

export class ArticleList extends AtomComponent<{ items: Item[] }> {
    render() {
        return (
            <ul class='articles'>
                {this.props.items.map((item) => (
                    <>
                        <li
                            class='title'
                            key={`${item.id}-title`}
                        >
                            {item.title}
                        </li>
                        <li
                            class='body'
                            key={`${item.id}-body`}
                        >
                            {item.body}
                        </li>
                    </>
                ))}
            </ul>
        );
    }
}
```

> **Keys:** When rendering lists, provide stable keys for items you expect to move, insert, or remove. If your runtime supports keyed fragments, you may attach keys to the individual children (as above). Use IDs from your data, not array indices.

---

## When **not** to use fragments

-   When you **need a semantic wrapper** (e.g., `<ul>` around `<li>` items, `<form>` around inputs).
-   When you **need attributes or styles** on a group—fragments can’t carry DOM attributes. Use a real element instead.

---

## Takeaways

-   Fragments group siblings without adding DOM nodes.
-   They’re ideal for clean markup and flexible component composition.
-   In lists, continue to use **stable keys** on children that AtomJS should track across renders.

---

:::tip Next Step
Move on to **Lifecycle Methods** to see how components hook into mount, update, and unmount phases.
:::

```

```
