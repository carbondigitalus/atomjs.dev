---
sidebar_position: 4
---

# Events

AtomJS attaches DOM events (e.g., `onClick`, `onInput`, `onChange`) directly in JSX.  
With **class-based components**, handlers are just class methods that you reference in `render()`.

> **State note:** Use `setState` to trigger updates **after** mount.  
> Calling `setState` in the constructor is prohibited and will throw (by design).

---

## 1) Basic click handler

```tsx
import { AtomComponent } from '@atomdev/core';

export default class Counter extends AtomComponent<{}, { count: number }> {
    constructor(props: {}) {
        super(props);
        this.state = { count: 0 }; // OK in constructor
    }

    // Arrow property auto-binds `this` (or override `_bindMethods()` to bind manually)
    handleIncrement = () => {
        this.setState({ count: this.state.count + 1 });
    };

    render() {
        return (
            <div>
                <p>Count: {this.state.count}</p>
                <button onClick={this.handleIncrement}>Increment</button>
            </div>
        );
    }
}
```

**Why this works**

-   `this.state` is initialized in the constructor.
-   `this.setState` merges partial state and triggers a re-render (only valid after mount).

---

## 2) Reading input values

```tsx
import { AtomComponent } from '@atomdev/core';

type State = { name: string };

export default class NameForm extends AtomComponent<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = { name: '' };
    }

    handleInput = (event: InputEvent) => {
        const value = (event.target as HTMLInputElement).value;
        this.setState({ name: value });
    };

    render() {
        return (
            <div>
                <input
                    type='text'
                    value={this.state.name}
                    onInput={this.handleInput}
                />
                <p>Hello, {this.state.name || 'friend'}.</p>
            </div>
        );
    }
}
```

---

## 3) Passing event callbacks via props

Children receive callbacks from parents as **props**, then wire them to DOM events.

```tsx
import { AtomComponent } from '@atomdev/core';

interface ButtonProps {
    onPress: () => void;
    label?: string;
}

export class Button extends AtomComponent<ButtonProps> {
    static defaultProps = { label: 'Click Me' };

    render() {
        return <button onClick={this.props.onPress}>{this.props.label}</button>;
    }
}

export class App extends AtomComponent {
    handlePress = () => {
        // do something meaningful here
        console.log('Pressed!');
    };

    render() {
        return (
            <Button
                onPress={this.handlePress}
                label='Run Action'
            />
        );
    }
}
```

---

## 4) Supported event names (common)

-   **Mouse:** `onClick`, `onDblClick`, `onMouseEnter`, `onMouseLeave`
-   **Keyboard:** `onKeyDown`, `onKeyUp`, `onKeyPress`
-   **Form:** `onInput`, `onChange`, `onSubmit`
-   **Focus:** `onFocus`, `onBlur`

These map to standard DOM events (camelCase in JSX).

---

## 5) Gotchas & best practices

-   **Initialize state in the constructor** (`this.state = {...}`) — it’s the safe place to set initial state.
-   **Don’t call `setState` in the constructor.** The base class guards will throw.
-   **Bind methods** using class properties (arrow functions) _or_ override `_bindMethods()` to bind explicitly.
-   **Use `defaultProps`** for optional props so your render logic can stay simple.
-   If you define **`propTypes`**, they’ll be validated at construction to help catch issues early.

---

🎉 You now know how to handle **events** in AtomJS using **class-based components** only.
