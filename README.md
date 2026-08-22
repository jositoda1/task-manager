# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# Task Manager

A task management application built with React and Vite.

I am building this project incrementally as part of my frontend development portfolio. My goal is not only to implement the application features, but also to apply professional development practices such as automated testing, CI/CD, accessibility, Git workflows, and clear technical documentation.

## Current Status

The project is currently under active development.

### Implemented

* React application created with Vite
* ESLint configuration
* Vitest testing environment
* React Testing Library
* GitHub Actions continuous integration
* Initial `TaskForm` component
* Automated component tests

### Planned

* Task creation
* Form validation
* Task list
* Task completion
* Task editing
* Task deletion
* Task filtering
* Local storage persistence
* Responsive interface
* Automated deployment

## Tech Stack

* React
* Vite
* JavaScript
* CSS
* Vitest
* React Testing Library
* ESLint
* GitHub Actions

## Engineering Decisions

### React with Vite

I chose React with Vite because I wanted a modern and lightweight development environment with fast local development and a simple production build process.

I deliberately avoided adding a larger framework at this stage because this project is focused on strengthening my understanding of core React concepts.

### Component-based structure

I chose to move the task form into a dedicated `TaskForm` component instead of keeping the entire interface inside `App.jsx`.

This keeps `App` focused on composing the application while allowing the form to evolve independently.

The separation will also make validation, submission behavior, and automated testing easier to maintain as the project grows.

I deliberately avoided creating many small components before they are needed. I prefer introducing abstractions when there is a clear responsibility to separate.

### Controlled form state

I chose to manage the task title as a controlled React input using `useState`.

This gives me explicit control over the current field value and prepares the form for validation, submission handling, and resetting the input after a task is created.

I considered leaving the input uncontrolled and reading its value only during submission. That would require less code initially, but I chose controlled state because the form behavior will soon depend on the current value.

I also decided to keep this state inside `TaskForm` instead of moving it to `App`. At this stage, no other component needs access to the unfinished input value, so lifting the state would add unnecessary coupling.

### User interaction testing

I use `@testing-library/user-event` for interactions such as typing and clicking.

I chose this approach because it models user interaction more closely than manually dispatching individual DOM events.

My tests focus on observable behavior, such as verifying that text entered by a user appears in the input, rather than testing React state or other implementation details directly.

### Testing strategy

I chose Vitest because the project already uses Vite and it integrates naturally with the same development ecosystem.

For React components, I use React Testing Library and prefer accessible queries such as `getByRole`.

I chose this approach because I want my tests to verify the application from the user's perspective rather than depend heavily on internal implementation details.

For example, the task input is queried through its accessible role and label instead of a CSS selector.

### Continuous Integration

I configured GitHub Actions to automatically run the following checks on pull requests targeting `main`:

```text
npm ci
npm run lint
npm test
npm run build
```

I chose this pipeline so that every change is validated in a clean environment before being integrated into the main branch.

Running the same validation locally and in CI reduces the risk of merging code that only works on my development machine.

## Development Workflow

For each feature, I work on a dedicated Git branch and integrate changes through a pull request.

My current workflow is:

```text
Feature branch
    ↓
Local development
    ↓
Lint
    ↓
Automated tests
    ↓
Production build
    ↓
Commit
    ↓
Push
    ↓
Pull Request
    ↓
GitHub Actions
    ↓
Merge into main
```

I chose this workflow because it gives me practice with a development process similar to the one commonly used in collaborative software projects.
