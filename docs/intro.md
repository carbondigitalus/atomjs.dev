---
sidebar_position: 1
---

# Introduction to AtomJS

Welcome to **AtomJS** — a new class-based React alternative that combines React’s powerful component model with Vue’s simplicity, built entirely with TypeScript.

AtomJS gives you a lightweight virtual DOM, JSX runtime, and modern developer tooling, all designed for **clarity, performance, and scalability**.

## Getting Started

You can add AtomJS Core to any TypeScript + Vite project.

### What you'll need

-   [Node.js](https://nodejs.org/en/download/) version 18.0 or above
-   A project set up with **Vite** (recommended) or another modern build tool that supports JSX/TSX

## Install AtomJS Core

Install AtomJS Core as a dependency:

```bash
npm install @atomdev/core
```

This package provides:

-   The AtomJS runtime
-   Virtual DOM engine
-   JSX runtime (`jsx`, `jsxs`, `jsxDEV`)
-   DOM rendering utilities
-   TypeScript types

## Start a Project (with Vite)

If you don’t have a project yet, create one with Vite:

```bash
npm create vite@latest my-app -- --template vanilla-ts
```

Then install AtomJS Core:

```bash
cd my-app
npm install @atomdev/core
```

## Run the Project

Start your dev server with:

```bash
npm run dev
```

By default, Vite will serve your project at:

👉 [http://localhost:5173/](http://localhost:5173/)
