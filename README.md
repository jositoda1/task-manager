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

I am building this project incrementally as part of my frontend development portfolio. My goal is not only to implement application features, but also to understand and apply professional development practices such as component architecture, automated testing, accessibility, CI/CD, Git workflows, and clear technical documentation.

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
- Task submission through a callback prop
- Whitespace normalization with `trim()`
- Validation against empty and whitespace-only task titles
- Input reset after successful submission
- Parent-owned task collection
- Functional state updates
- Task objects with stable IDs
- Dedicated `TaskList` component
- Empty task-list state
- Semantic task list markup
- Visible rendering of submitted tasks
- Singular and plural task counter
- Automated component tests
- Integration-style tests for component communication

### Planned

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

I chose to separate the interface into focused components instead of keeping all application markup and behavior inside `App.jsx`.

The task form lives in `TaskForm`, while the task collection is displayed by `TaskList`.

This keeps `App` responsible for application-level state and component composition instead of detailed UI responsibilities.

I deliberately avoid creating components before they have a clear responsibility. I prefer introducing abstractions only when they provide a concrete maintenance or testing benefit.

### Controlled Form State

I chose to manage the unfinished task title as a controlled React input using `useState`.

The current value of the input is stored in React state and updated whenever the user types.

This gives me explicit control over the field value and makes validation, submission handling, and resetting the input predictable.

I considered leaving the input uncontrolled and reading its value only when the form is submitted.

That approach would require less code initially, but I chose controlled state because the form behavior depends on the current value.

I also decided to keep the unfinished task title state inside `TaskForm` instead of moving it to `App`.

No other component needs access to what the user is typing before submission, so lifting that temporary state would introduce unnecessary coupling.

### Parent-owned Task Collection

I chose to keep the submitted task collection in `App` rather than inside `TaskForm` or `TaskList`.

`TaskForm` collects and validates input, while `TaskList` renders the collection.

`App` owns the shared task data because multiple components need, or will need, access to it.

I chose this separation because the task collection represents application-level state, while the unfinished form value is local component state.

### Callback Prop for Child-to-Parent Communication

I chose to pass an `onAddTask` callback from `App` to `TaskForm`.

When a valid title is submitted, `TaskForm` calls the callback with the normalized title instead of modifying parent state directly.

I chose this approach because React data flows down through props, while child components can communicate user-driven events upward through callback functions.

I deliberately avoided putting the application task collection inside the form because that would mix form responsibilities with application data ownership.

### Input Normalization and Validation

I chose to normalize submitted titles with `trim()` before sending them to the parent.

This prevents accidental leading and trailing whitespace from becoming part of the stored task title.

I also reject empty and whitespace-only values before calling `onAddTask`.

I chose to perform this validation inside `TaskForm` because invalid input should be rejected at the form boundary before it reaches application state.

I deliberately avoided relying only on an HTML `required` attribute because I also want the application logic itself to protect the data from whitespace-only values.

### Reset After Successful Submission

I clear the controlled input only after a valid task has been submitted.

This prepares the form for the next task while preserving the user's text when submission is rejected.

I chose this behavior because clearing invalid input would remove information the user may want to correct.

### Task Data Model

I initially stored submitted tasks as plain strings because that was sufficient while I was learning the form submission flow.

When I introduced the task list, I changed the task representation to objects:

```js
{
  id: crypto.randomUUID(),
  title: taskTitle,
}
```

I chose this approach because each task will need its own identity and will gain additional properties as features such as completion, editing, and persistence are added.

I deliberately avoided adding future properties such as `completed` or timestamps before they are needed. I prefer evolving the data model alongside real application requirements.

### Stable Task IDs

I assign each task a stable ID when it is created using `crypto.randomUUID()`.

I chose a stable ID because React list items need an identity that remains associated with the same task even when the collection changes.

I deliberately avoided using the array index as the React `key` because array positions can change when tasks are deleted, filtered, or reordered.

### Functional State Updates

When adding a submitted task to the collection, I use a functional state update:

```js
setTasks((currentTasks) => [...currentTasks, newTask])
```

I chose this approach because the next task collection depends on the previous state.

Using the previous state provided by React avoids relying on a potentially stale state snapshot and makes the relationship between the old and new state explicit.

### Dedicated TaskList Component

I chose to render the task collection inside a dedicated `TaskList` component instead of placing the list markup directly inside `App`.

This gives the task collection a clear rendering responsibility while leaving `App` focused on state ownership and application composition.

I deliberately avoided creating a `TaskItem` component at this stage because each task currently renders only a title.

I will introduce a separate task-item component when individual tasks gain enough behavior to justify their own responsibility.

### Semantic List Markup

I render the task collection with `<ul>` and `<li>` elements.

I chose semantic list markup because tasks represent a collection of related items.

Using native list elements communicates that structure directly to browsers and assistive technologies without recreating list semantics with generic `<div>` elements.

### Empty State

When the task collection is empty, `TaskList` displays a clear message instead of rendering an empty list.

I chose to provide an explicit empty state because a blank area does not tell the user whether the interface is working or what action to take next.

The message guides the user toward adding the first task while keeping the behavior simple.

### Accessible Form Structure

I chose to associate the task input with a visible `<label>` using `htmlFor` and a matching input `id`.

This gives the input an accessible name and improves the experience for keyboard users and assistive technologies.

It also allows my tests to query the field through its accessible role and name rather than through implementation-specific selectors.

I prefer semantic HTML whenever possible instead of recreating standard browser behavior with generic elements.

### Testing Strategy

I chose Vitest because the project already uses Vite and Vitest integrates naturally with the same ecosystem.

For React components, I use React Testing Library.

My tests focus on behavior that a user can observe instead of testing internal React implementation details.

For example, I verify visible task titles instead of inspecting the internal `tasks` state.

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

I deliberately avoid relying on CSS selectors or implementation-specific attributes when an accessible query is available.

### User Interaction Testing

I use `@testing-library/user-event` for interactions such as typing and clicking.

I chose `user-event` because it models user interaction more closely than manually dispatching individual DOM events.

For example:

```js
await user.type(taskInput, 'Buy groceries')
await user.click(submitButton)
```

I test the observable result instead of directly inspecting internal React state.

This means the tests can remain valid even if I refactor the internal implementation while preserving the same user behavior.

### Mock Functions for Component Contracts

I use `vi.fn()` when testing whether `TaskForm` communicates correctly with its parent.

This allows me to verify that the component calls `onAddTask` with the expected normalized value without needing to render the complete application.

I chose this approach because it isolates the public contract of `TaskForm`.

### TaskList Component Tests

I test `TaskList` independently with predictable task objects.

One test verifies the empty state and another verifies that supplied task titles are visible.

I chose to test visible output rather than internal mapping logic because the important behavior is what the user sees after the component receives a task collection.

The tests use fixed IDs because deterministic test data is easier to understand and does not depend on runtime-generated values.

### Integration-style Component Testing

In addition to testing components independently, I test the complete interaction through `App`.

The integration-style test simulates a user entering a task, submitting the form, observing the counter update, and verifying that the submitted title appears in the task list.

I chose this additional test because isolated component tests can prove that individual contracts work, but they do not prove that the complete component flow is wired together correctly.

The tested flow is:

```text
User input
  ↓
TaskForm
  ↓
onAddTask
  ↓
App state
  ↓
TaskList
  ↓
Visible task
```

### Test Isolation

I chose to explicitly clean up the rendered DOM after every test.

Each test should start with a clean environment and must not accidentally depend on elements created by another test.

I use:

```js
afterEach(() => {
  cleanup()
})
```

I preferred explicit cleanup over enabling additional global Vitest APIs because the project does not currently require global test functions.

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

I chose this pipeline so that every pull request is validated in a clean environment before being integrated into the `main` branch.

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

## Testing

Run the complete test suite with:

```bash
npm test
```

Run linting with:

```bash
npm run lint
```

Validate the production build with:

```bash
npm run build
```

Start the development server with:

```bash
npm run dev
```

## What I Am Learning

Through this project, I am actively practicing:

- React component design
- React state management
- Controlled form inputs
- State ownership
- Props and callback props
- Child-to-parent communication
- Functional state updates
- Form submission
- Input normalization
- Input validation
- Data-model evolution
- Stable identifiers
- React list keys
- Semantic list markup
- Empty states
- Accessibility
- Component testing
- Mock functions
- User interaction testing
- Integration-style component testing
- Test isolation
- Git branching
- Conventional Commits
- Pull requests
- Continuous integration
- Technical decision documentation
- Incremental software development

I am documenting these decisions intentionally so that the repository shows not only what I built, but also how I approached the development process and why I made specific technical choices.
