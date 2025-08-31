---
sidebar_position: 3
---

# Props

Props allow you to **pass data into components** and make them reusable.  
In AtomJS, props are **strongly typed** with TypeScript for clarity and safety.

---

## 1. Defining Props

To define props, add a **generic type** to your component class.

```tsx
import { Component } from '@atomdev/core';

interface GreetingProps {
    name: string;
}

export default class Greeting extends Component<GreetingProps> {
    render() {
        return <h1>Hello, {this.props.name}!</h1>;
    }
}
```

Here:

-   `GreetingProps` defines the expected props.
-   `this.props` gives you access inside the component.

---

## 2. Rendering with Props

In `src/main.tsx`:

```tsx
import { render } from '@atomdev/core';
import Greeting from './Greeting';

const root = document.getElementById('app');
render(<Greeting name='Alice' />, root);
```

Output:

```html
<h1>Hello, Alice!</h1>
```

---

## 3. Multiple Props

```tsx
interface UserCardProps {
    name: string;
    age: number;
}

export default class UserCard extends Component<UserCardProps> {
    render() {
        return (
            <div>
                <h2>{this.props.name}</h2>
                <p>Age: {this.props.age}</p>
            </div>
        );
    }
}
```

Render it in `main.tsx`:

```tsx
render(
    <UserCard
        name='Sam'
        age={29}
    />,
    root,
);
```

---

## 4. Default Props

AtomJS doesn’t enforce default props at the runtime level, but you can set defaults inside the class:

```tsx
interface ButtonProps {
    label?: string;
}

export default class Button extends Component<ButtonProps> {
    render() {
        const label = this.props.label ?? 'Click Me';
        return <button>{label}</button>;
    }
}
```

If no `label` is provided, `"Click Me"` will be used.

---

## 5. Children as Props

Every AtomJS component automatically receives a special `children` prop.

```tsx
interface CardProps {
    title: string;
}

export default class Card extends Component<CardProps> {
    render() {
        return (
            <div>
                <h2>{this.props.title}</h2>
                <div>{this.props.children}</div>
            </div>
        );
    }
}
```

Render in `main.tsx`:

```tsx
render(
    <Card title='Profile'>
        <p>This is the inner content passed as children.</p>
    </Card>,
    root,
);
```

---

🎉 You now know how to define and use **props** in AtomJS class components!

---

:::tip Next Step
Learn how AtomJS handles **events** for interactivity.
:::
