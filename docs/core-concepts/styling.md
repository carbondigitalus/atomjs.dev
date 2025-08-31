---
sidebar_position: 10
---

# Styling

Style elements via **classes** or **inline styles**.

> Status
> • `class` (string) → **Available**
> • Inline `style` as **string** → **Available**
> • Inline `style` as **object** (camelCase, auto-uniting) → **Coming soon**
> • `ref` for DOM reads/writes → **Coming soon** (see Refs)

---

## Classes

Use the `class` attribute (not `className`).

```tsx
import { AtomComponent } from '@atomdev/core';

export class Button extends AtomComponent<{ primary?: boolean }> {
    render() {
        const cls = this.props.primary ? 'btn btn--primary' : 'btn';
        return <button class={cls}>Click</button>;
    }
}
```

### Conditional classes

A tiny helper keeps strings clean.

```tsx
const cx = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ');

export class Tag extends AtomComponent<{ active?: boolean; size?: 'sm' | 'md' | 'lg' }> {
    render() {
        const cls = cx('tag', this.props.active && 'is-active', this.props.size && `tag--${this.props.size}`);
        return <span class={cls}>{this.props.children}</span>;
    }
}
```

---

## Inline styles (string)

Provide a CSS string when you need one-off styles.

```tsx
export class Banner extends AtomComponent {
    render() {
        return <div style='padding:12px; border:1px solid #ddd;'>Hello</div>;
    }
}
```

---

## Inline styles (object — coming soon)

Planned support for an object form (camelCased properties):

```tsx
// Coming soon
export class Panel extends AtomComponent {
    render() {
        return <div style={{ padding: '12px', borderWidth: '1px', borderStyle: 'solid' }}>Panel</div>;
    }
}
```

---

## Patterns & pitfalls

-   ✅ Prefer classes for maintainable styling; keep inline styles minimal
-   ✅ Use a helper (e.g., `cx`) for conditional class composition
-   ❌ Avoid mixing conflicting inline and stylesheet rules unless deliberate
-   🔜 Use object `style` when it lands for programmatic style construction

---

:::tip Next Step
Check out **Refs (Coming Soon)** to see how you’ll read/measure DOM nodes when needed.
:::
