---
sidebar_position: 3
---

# Quickstart

Let’s get AtomJS running in just a few minutes.

AtomJS Core is distributed as an **npm package**, so you can add it to any TypeScript project. We recommend starting with [Vite](https://vitejs.dev/), a fast and modern build tool.

---

## 1. Prerequisites

-   [Node.js](https://nodejs.org/en/download/) version 18.0 or above
-   A code editor (VS Code recommended)
-   We recommend the use of Node Version Manager over Node.js

---

## 2. Create a Project with Vite

Generate a new TypeScript + Vite project:

```bash
npm create vite@latest my-app -- --template vanilla-ts
```

This will scaffold a basic TypeScript project without React or Vue.

---

## 3. Install AtomJS Core

Navigate into your project and install AtomJS Core:

```bash
cd my-app
npm install @atomdev/core
```

AtomJS Core includes the runtime, virtual DOM, JSX runtime, and DOM rendering utilities.

---

## 4. Enable JSX in TypeScript

In your project’s `tsconfig.json`, enable JSX support:

```json
{
    "compilerOptions": {
        "jsx": "react-jsx",
        "jsxImportSource": "@atomdev/core"
    }
}
```

This tells TypeScript to use AtomJS’s JSX runtime instead of React’s.

---

## 5. Create Your First Component

Create `src/HelloWorld.tsx`:

```tsx
import { Component } from '@atomdev/core';

export default class HelloWorld extends Component {
    render() {
        return <h1>Hello from AtomJS 👋</h1>;
    }
}
```

---

## 6. Render the Component

Update `src/main.tsx`:

```tsx
import { render } from '@atomdev/core';
import HelloWorld from './HelloWorld';

const root = document.getElementById('app');
render(<HelloWorld />, root);
```

Make sure your `index.html` has a matching mount point:

```html
<div id="app"></div>
```

---

## 7. Start the Dev Server

Run the project:

```bash
npm run dev
```

By default, Vite will serve your app at:

👉 [http://localhost:5173/](http://localhost:5173/)

---

🎉 You just built your first AtomJS project from scratch!

---

:::tip Next Step
Head over to [Element Creation](../core-concepts/element-creation.md) to learn how AtomJS components work.
:::
