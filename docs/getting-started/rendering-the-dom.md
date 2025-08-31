---
sidebar_position: 2
---

# Rendering to the DOM

AtomJS uses a lightweight virtual DOM engine to efficiently render your **class-based components** into the browser.  
The process has two steps:

1. Define a component by extending `Component`.
2. Mount it into the DOM using the `render()` function from AtomJS Core.

---

## 1. The `render()` Function

The `render()` function takes two arguments:

```ts
render(virtualNode, container);
```

-   **virtualNode** — JSX for a component you want to render
-   **container** — a real DOM element where the output should be mounted

---

## 2. Mounting a Component

Example:

```tsx
import { render } from '@atomdev/core';
import { Component } from '@atomdev/core';

class HelloWorld extends Component {
    render() {
        return <h1>Hello from AtomJS 👋</h1>;
    }
}

const root = document.getElementById('app');
render(<HelloWorld />, root);
```

And in `index.html`:

```html
<body>
    <div id="app"></div>
</body>
```

AtomJS will transform `<HelloWorld />` into a virtual DOM representation, then mount it into the real DOM at `#app`.

---

## 3. Rendering Multiple Components

You can render multiple class components by wrapping them in a parent element or a fragment:

```tsx
class Welcome extends Component {
    render() {
        return <h2>Welcome to AtomJS</h2>;
    }
}

render(
    <>
        <HelloWorld />
        <Welcome />
    </>,
    root,
);
```

Fragments (`<>...</>`) allow multiple children without adding an extra wrapper element.

---

## 4. Updating the DOM

When you re-render a component with different props or children, AtomJS will efficiently **diff** the virtual DOM and update only what has changed:

```tsx
class Greeting extends Component<{ name: string }> {
    render() {
        return <h1>Hello, {this.props.name}!</h1>;
    }
}

render(<Greeting name='Alice' />, root);
render(<Greeting name='Bob' />, root); // Only the text updates
```

---

## 5. Cleaning Up

When you render into the same container again, AtomJS will replace the previous contents.
To clear a container, simply render `null` or an empty fragment:

```tsx
render(null, root);
```

---

🎉 Now you know how to mount and update **class-based components** in AtomJS!

---

\:::tip Next Step
Learn how to pass **props** and handle **events** in your components.
\:::

```

Want me to go ahead and draft the **Events and Props** page (the last piece of the *Getting Started* section)?
```

```

```
