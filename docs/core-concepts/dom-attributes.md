---
sidebar_position: 9
---

# DOM Attributes

This page covers how JSX props map to **real DOM attributes** in AtomJS.

> Status  
> • Standard/boolean attributes → **Available**  
> • `data-*` / `aria-*` passthrough → **Available**  
> • `ref` (callback/object refs) → **Coming soon**

---

## Basic attributes

Props on intrinsic tags become DOM attributes.

```tsx
import { AtomComponent } from '@atomdev/core';

export class Link extends AtomComponent {
    render() {
        return (
            <a
                href='/docs'
                title='Read the docs'
            >
                Docs
            </a>
        );
    }
}
```

-   Strings/numbers pass through.
-   Unknown/non-DOM props are ignored/stripped to keep markup clean.

## Boolean attributes

Pass booleans directly; true sets the attribute, false removes it.

```tsx
export class Submit extends AtomComponent<{ disabled?: boolean }> {
    render() {
        return (
            <button
                type='submit'
                disabled={!!this.props.disabled}
            >
                Save
            </button>
        );
    }
}
```

-   Common: disabled, required, readonly, checked, multiple, hidden.

## data-_ and aria-_

Custom data and accessibility attributes pass through unchanged.

```tsx
export class Row extends AtomComponent<{ id: string; selected?: boolean }> {
    render() {
        const { id, selected } = this.props;
        return (
            <div
                class='row'
                data-id={id}
                aria-selected={selected ? 'true' : 'false'}
                role='row'
            >
                {this.props.children}
            </div>
        );
    }
}
```

## Controlled form attributes

Keep inputs controlled by pairing value/checked with handlers.

```tsx
interface State {
    name: string;
    agree: boolean;
}

export class Form extends AtomComponent<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = { name: '', agree: false };
    }

    onName = (e: Event) => this.setState({ name: (e.target as HTMLInputElement).value });
    onAgree = (e: Event) => this.setState({ agree: (e.target as HTMLInputElement).checked });

    render() {
        return (
            <form>
                <label>
                    Name
                    <input
                        type='text'
                        value={this.state.name}
                        onInput={this.onName}
                    />
                </label>

                <label>
                    <input
                        type='checkbox'
                        checked={this.state.agree}
                        onChange={this.onAgree}
                    />
                    I agree
                </label>
            </form>
        );
    }
}
```

## Conditional attributes

Include attributes only when needed.

```tsx
export class Avatar extends AtomComponent<{ src?: string; alt?: string; decorative?: boolean }> {
    render() {
        const { src, alt, decorative } = this.props;
        return (
            <img
                src={src ?? '/fallback.png'}
                alt={decorative ? '' : alt ?? 'Avatar'}
                role={decorative ? 'presentation' : undefined}
            />
        );
    }
}
```

## Avoid invalid DOM props

Filter non-DOM props before spreading.

```tsx
interface ButtonProps {
    variant?: 'primary' | 'secondary';
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

export class Button extends AtomComponent<ButtonProps> {
    render() {
        const { variant, ...dom } = this.props as Record<string, unknown>;
        const cls = variant ? `btn btn--${variant}` : 'btn';
        return (
            <button
                class={cls}
                {...dom}
            >
                {this.props.children}
            </button>
        );
    }
}
```

## Quick checklist

-   ✅ Use valid DOM attributes; booleans pass through naturally
-   ✅ Prefer controlled inputs (value/checked + handler)
-   ✅ Use data-_/aria-_ for custom data and accessibility
-   ❌ Don’t leak non-DOM props to elements—strip or rename them

:::tip Next Step
Head to Styling for classes, conditional class patterns, and inline styles.
:::
