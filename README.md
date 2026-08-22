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

I am building this project incrementally as part of my frontend development portfolio. My goal is not only to implement the application features, but also to understand and apply professional development practices such as component architecture, automated testing, accessibility, CI/CD, Git workflows, and clear technical documentation.

Rather than building the entire application at once, I am developing it feature by feature. This allows me to understand each decision, validate each change, and keep the project maintainable as it grows.

## Current Status

The project is currently under active development.

### Implemented

- React application created with Vite
- ESLint configuration
- Vitest testing environment
- React Testing Library
- `@testing-library/user-event`
- Explicit test cleanup and isolation
- GitHub Actions continuous integration
- Dedicated `TaskForm` component
- Controlled task title input using React state
- Accessible form elements
- Automated component tests

### Planned

- Task submission
- Form validation
- Task creation
- Task list
- Task completion
- Task editing
- Task deletion
- Task filtering
- Local storage persistence
- Responsive interface
- Automated deployment

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- Vitest
- React Testing Library
- Testing Library User Event
- ESLint
- Git
- GitHub
- GitHub Actions

## Engineering Decisions

### React with Vite

I chose React with Vite because I wanted a modern and lightweight development environment with fast local development and a simple production build process.

Vite provides a minimal setup without introducing unnecessary framework-level abstractions, which allows me to focus on understanding React itself.

I deliberately avoided using a larger React framework at this stage because the main purpose of this project is to strengthen my understanding of core React concepts such as components, state, props, events, forms, and component communication.

### Incremental Development

I chose to build the application incrementally instead of implementing all features at once.

Each feature is developed, tested, documented, and reviewed before I move on to the next one.

I chose this approach because smaller changes are easier to understand, debug, test, and review.

This also gives me a clearer Git history and allows each pull request to represent a focused piece of work.

### Component-based Structure

I chose to move the task form into a dedicated `TaskForm` component instead of keeping the entire interface inside `App.jsx`.

This keeps `App` focused on application composition while allowing the form to have its own responsibility.

The separation also makes the form easier to test independently and prepares it for additional behavior such as validation and submission handling.

I deliberately avoided splitting the application into many small components before they are needed.

I prefer introducing abstractions only when there is a clear responsibility to separate, rather than creating complexity prematurely.

### Controlled Form State

I chose to manage the task title as a controlled React input using `useState`.

The current value of the input is stored in React state and updated whenever the user types.

This gives me explicit control over the field value and prepares the form for upcoming features such as validation, submission handling, and clearing the input after a task is created.

I considered leaving the input uncontrolled and reading its value only when the form is submitted.

That approach would require less code initially, but I chose controlled state because the form behavior will soon depend on the current value.

I also decided to keep the unfinished task title state inside `TaskForm` instead of moving it to `App`.

At this stage, no other component needs access to that temporary value, so lifting the state would introduce unnecessary coupling.

I will move state higher in the component tree only when another component genuinely needs access to it.

### Accessible Form Structure

I chose to associate the task input with a visible `<label>` using `htmlFor` and a matching input `id`.

This gives the input an accessible name and improves the experience for keyboard users and assistive technologies.

It also allows my tests to query the field through its accessible role and name rather than through implementation-specific selectors.

I prefer semantic HTML whenever possible instead of recreating standard browser behavior with generic elements.

### Testing Strategy

I chose Vitest because the project already uses Vite and Vitest integrates naturally with the same ecosystem.

For React components, I use React Testing Library.

My tests focus on behavior that a user can observe instead of testing internal React implementation details.

For example, I verify that the task input exists through its accessible role and label instead of selecting it using a CSS class or directly inspecting component state.

I chose this approach because tests based on user-visible behavior are generally less fragile when the internal implementation changes.

### Accessible Testing Queries

I prefer queries such as `getByRole` when testing interactive elements.

For example:

```js
screen.getByRole('textbox', {
  name: /task/i,
})
```

I chose this approach because it reflects how users and assistive technologies identify interface elements.

I deliberately avoided relying on CSS selectors or implementation-specific attributes when an accessible query is available.

This has an additional advantage: accessibility problems can also cause tests to fail, which encourages me to maintain meaningful semantic markup.

### User Interaction Testing

I use `@testing-library/user-event` for interactions such as typing and clicking.

I chose `user-event` because it models user interaction more closely than manually dispatching individual DOM events.

For example, the controlled task input is tested by simulating a user typing into it and then verifying the visible value.

```js
await user.type(taskInput, 'Buy groceries')

expect(taskInput).toHaveValue('Buy groceries')
```

I chose to test the observable result instead of directly testing the internal `useState` value.

This means the test can remain valid even if I later refactor the internal implementation while preserving the same user behavior.

### Test Isolation

I chose to explicitly clean up the rendered DOM after every test.

Each test should start with a clean environment and must not accidentally depend on elements created by another test.

Without cleanup, multiple component renders can remain in the test DOM and produce misleading failures.

I use:

```js
afterEach(() => {
  cleanup()
})
```

I preferred explicit cleanup over enabling additional global Vitest APIs because the project does not currently require global test functions.

This keeps the test configuration intentional and makes the isolation behavior visible and easy to understand.

### Continuous Integration

I configured GitHub Actions to validate changes automatically.

The CI pipeline runs:

```text
npm ci
npm run lint
npm test
npm run build
```

I chose `npm ci` instead of `npm install` in CI because it installs dependencies using the committed lock file and provides a more reproducible environment.

Linting catches code-quality issues.

Automated tests verify expected application behavior.

The production build confirms that the application can be successfully compiled for deployment.

I chose this pipeline so that every pull request is validated in a clean environment before being integrated into the `main` branch.

Running the same checks locally and in CI reduces the risk of merging code that only works on my development machine.

## Development Workflow

For each feature, I work on a dedicated Git branch and integrate changes through a pull request.

My current workflow is:

```text
main
  ↓
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
Code review
  ↓
Squash merge
  ↓
main
```

I chose this workflow because it gives me experience with a development process similar to the one commonly used in collaborative software projects.

Feature branches isolate work from the stable `main` branch.

Pull requests provide a clear review point before integration.

GitHub Actions validates the changes automatically.

Squash merging keeps the history of `main` focused on completed changes rather than every intermediate development commit.

## Testing

The complete test suite can be executed with:

```bash
npm test
```

Linting can be executed with:

```bash
npm run lint
```

The production build can be validated with:

```bash
npm run build
```

During development, the application can be started with:

```bash
npm run dev
```

## What I Am Learning

Through this project, I am actively practicing:

- React component design
- React state management
- Controlled form inputs
- Component responsibilities
- Semantic HTML
- Accessibility
- Component testing
- User interaction testing
- Test isolation
- Git branching
- Conventional Commits
- Pull requests
- Continuous integration
- Technical decision documentation
- Incremental software development

I am documenting these decisions intentionally so that the repository shows not only what I built, but also how I approached the development process and why I made specific technical choices.
