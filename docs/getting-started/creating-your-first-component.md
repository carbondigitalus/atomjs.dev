---
sidebar_position: 1
---

# Creating Your First Component

Components are the building blocks of AtomJS.  
Unlike other frameworks that rely on functions or hidden reactivity, AtomJS uses **class-based components** for clarity and explicit design.

---

## 1. Create a Component File

In `src/HelloWorld.tsx`:

```tsx
import { Component } from '@atomdev/core';

export default class HelloWorld extends Component {
    render() {
        return <h1>Hello from AtomJS 👋</h1>;
    }
}
```

### Key points

-   Every component **extends `Component`** from AtomJS Core.
-   Components must implement a `render()` method.
-   `render()` returns **JSX** that AtomJS transforms into virtual DOM nodes.

---

## 2. Render It to the DOM

In `src/main.tsx`:

```tsx
import { render } from '@atomdev/core';
import HelloWorld from './HelloWorld';

const root = document.getElementById('app');
render(<HelloWorld />, root);
```

And in `index.html`:

```html
<div id="app"></div>
```

---

## 3. Add Children

Components can contain other elements or components:

```tsx
import { Component } from '@atomdev/core';

export default class Welcome extends Component {
    render() {
        return (
            <div>
                <h1>Welcome to AtomJS</h1>
                <p>This is your first component with children.</p>
            </div>
        );
    }
}
```

---

## 4. Reuse Your Component

You can render multiple instances of a component just like HTML elements:

```tsx
render(
    <div>
        <HelloWorld />
        <HelloWorld />
    </div>,
    root,
);
```

---

🎉 That’s it — you’ve built and rendered your first AtomJS component!

---

:::tip Next Step
Learn how to **pass data with props** and handle **events** in AtomJS.
:::
