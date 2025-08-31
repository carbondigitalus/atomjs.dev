---
sidebar_position: 8
---

# Event Handling

AtomJS wires **native DOM events** via JSX props like `onClick`, `onInput`, and `onKeyDown`.  
This page covers composition, control patterns, typing, and edge cases—using **class-only** examples.

> Status notes  
> • Native DOM event objects are passed to handlers. **Available**  
> • Event options (capture / once / passive) via props. **Coming soon**  
> • Functional `setState` to avoid stale reads during rapid events. **Coming soon**

---

## Preventing default and stopping propagation

```tsx
import { AtomComponent } from '@atomdev/core';

export class ActionLink extends AtomComponent<{ href: string }> {
    handleClick = (e: MouseEvent) => {
        e.preventDefault(); // don't navigate
        e.stopPropagation(); // don't bubble to parents
        // do something custom
    };

    render() {
        return (
            <a
                href={this.props.href}
                onClick={this.handleClick}
            >
                Run
            </a>
        );
    }
}
```

---

## Controlled inputs (parent-driven state)

Make inputs **controlled** by passing value and a change handler from the parent.

```tsx
import { AtomComponent } from '@atomdev/core';

interface InputProps {
    value: string;
    onChange: (next: string) => void;
}

export class TextInput extends AtomComponent<InputProps> {
    handleInput = (e: Event) => {
        const next = (e.target as HTMLInputElement).value;
        this.props.onChange(next);
    };

    render() {
        return (
            <input
                type='text'
                value={this.props.value}
                onInput={this.handleInput}
            />
        );
    }
}

export class Form extends AtomComponent<{}, { name: string }> {
    constructor(props: {}) {
        super(props);
        this.state = { name: '' };
    }

    setName = (name: string) => {
        this.setState({ name }); // scheduling/batching coming soon
    };

    render() {
        return (
            <div>
                <TextInput
                    value={this.state.name}
                    onChange={this.setName}
                />
                <p>Hello, {this.state.name || '—'}</p>
            </div>
        );
    }
}
```

---

## Keyboard interactions (accessibility-friendly)

```tsx
export class HotkeyButton extends AtomComponent<{ onActivate: () => void }> {
    handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); // avoid scrolling on Space
            this.props.onActivate();
        }
    };

    render() {
        return (
            <div
                role='button'
                tabIndex={0}
                onKeyDown={this.handleKey}
                onClick={this.props.onActivate}
                aria-pressed='false'
            >
                Activate
            </div>
        );
    }
}
```

---

## Composing callbacks across components

Children receive callbacks via **props** and can pass data upward.

```tsx
interface ItemProps {
    id: string;
    onSelect: (id: string) => void;
}

class Item extends AtomComponent<ItemProps> {
    handleClick = () => this.props.onSelect(this.props.id);

    render() {
        return <li onClick={this.handleClick}>{this.props.id}</li>;
    }
}

export class List extends AtomComponent<{ ids: string[] }> {
    handleSelect = (id: string) => {
        // centralize selection logic here
        console.log('Selected', id);
    };

    render() {
        return (
            <ul>
                {this.props.ids.map((id) => (
                    <Item
                        key={id}
                        id={id}
                        onSelect={this.handleSelect}
                    />
                ))}
            </ul>
        );
    }
}
```

---

## Debouncing and throttling high-frequency events

For `onInput`, `onScroll`, or `onMouseMove`, debounce or throttle to limit updates.

```tsx
export class SearchBox extends AtomComponent<{}, { q: string }> {
    private timeout?: number;

    constructor(props: {}) {
        super(props);
        this.state = { q: '' };
    }

    handleInput = (e: Event) => {
        const q = (e.target as HTMLInputElement).value;
        window.clearTimeout(this.timeout);
        this.timeout = window.setTimeout(() => this.setState({ q }), 200);
    };

    beforeUnmount() {
        if (this.timeout) window.clearTimeout(this.timeout);
    }

    render() {
        return (
            <input
                type='search'
                onInput={this.handleInput}
                placeholder='Search…'
            />
        );
    }
}
```

---

## Async handlers and stale state

When awaiting work in handlers, read from the **latest** state when applying updates.

```tsx
export class SaveButton extends AtomComponent<{}, { saving: boolean; count: number }> {
    constructor(props: {}) {
        super(props);
        this.state = { saving: false, count: 0 };
    }

    handleSave = async () => {
        this.setState({ saving: true });
        await fakeNetwork();
        // Coming soon: use functional setState to avoid stale reads during batching
        this.setState({ saving: false, count: this.state.count + 1 });
    };

    render() {
        return (
            <button
                disabled={this.state.saving}
                onClick={this.handleSave}
            >
                {this.state.saving ? 'Saving…' : `Save (${this.state.count})`}
            </button>
        );
    }
}

function fakeNetwork() {
    return new Promise((r) => setTimeout(r, 600));
}
```

---

## Pointer, wheel, and focus events (quick tour)

-   **Pointer:** `onPointerDown`, `onPointerMove`, `onPointerUp`, `onPointerCancel`
-   **Wheel/Scroll:** `onWheel` (bubbles), `onScroll` (does **not** bubble)
-   **Focus:** `onFocus`, `onBlur` (don’t bubble in the DOM spec; attach where needed)

> If you require **capture** or **passive** listeners, these will be available via event options props. **Coming soon**

---

## Event typing cheat sheet

| JSX prop        | Event type      | Typical target cast                    |
| --------------- | --------------- | -------------------------------------- |
| `onClick`       | `MouseEvent`    | `e.currentTarget as HTMLButtonElement` |
| `onInput`       | `Event`         | `e.target as HTMLInputElement`         |
| `onChange`      | `Event`         | `e.target as HTMLSelectElement`        |
| `onSubmit`      | `SubmitEvent`   | `e.target as HTMLFormElement`          |
| `onKeyDown`     | `KeyboardEvent` | `e.currentTarget as HTMLElement`       |
| `onPointerMove` | `PointerEvent`  | `e.currentTarget as HTMLElement`       |
| `onWheel`       | `WheelEvent`    | `e.currentTarget as HTMLElement`       |
| `onFocus`       | `FocusEvent`    | `e.currentTarget as HTMLElement`       |
| `onBlur`        | `FocusEvent`    | `e.currentTarget as HTMLElement`       |

> Prefer `e.currentTarget` when you attached the handler to that element.

---

## Patterns & pitfalls

-   ✅ Keep handlers as **class fields** (arrow functions) or bind in `_bindMethods()`.
-   ✅ Lift logic to parents; pass callbacks down via props for composition.
-   ✅ Debounce/throttle noisy events.
-   ❌ Don’t mutate DOM directly in handlers unless necessary—prefer state → render.
-   ❌ Don’t assume bubbling for `focus` or `scroll`. Attach where they fire.

---

:::tip Next Step
Continue to **DOM Attributes & Styling** to see how props map to attributes, classes, styles, and refs.
:::
