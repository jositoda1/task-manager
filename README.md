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
- Dedicated `TaskItem` component
- Empty task-list state
- Semantic task list markup
- Stable React list keys
- Task completion state
- Controlled completion checkbox
- Immutable task updates
- Singular and plural task counter
- Automated component tests
- Integration-style tests for component communication
- End-to-end component flow for task completion

### Planned

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

The task form lives in `TaskForm`, the task collection is displayed by `TaskList`, and each individual interactive task is rendered by `TaskItem`.

This keeps `App` responsible for application-level state and component composition instead of detailed UI responsibilities.

I deliberately avoid creating components before they have a clear responsibility. I introduced `TaskItem` only when individual tasks gained their own behavior through the completion checkbox.

### Controlled Form State

I chose to manage the unfinished task title as a controlled React input using `useState`.

The current value of the input is stored in React state and updated whenever the user types.

This gives me explicit control over the field value and makes validation, submission handling, and resetting the input predictable.

I considered leaving the input uncontrolled and reading its value only when the form is submitted.

That approach would require less code initially, but I chose controlled state because the form behavior depends on the current value.

I also decided to keep the unfinished task title state inside `TaskForm` instead of moving it to `App`.

No other component needs access to what the user is typing before submission, so lifting that temporary state would introduce unnecessary coupling.

### Parent-owned Task Collection

I chose to keep the submitted task collection in `App` rather than inside `TaskForm`, `TaskList`, or `TaskItem`.

`TaskForm` collects and validates input, `TaskList` renders the collection, and `TaskItem` represents one interactive task.

`App` owns the shared task data because multiple components need access to it.

I chose this separation because the task collection represents application-level state, while temporary UI values should remain local to the components that own them.

### Callback Props for Component Communication

I use callback props to communicate user actions from child components back to `App`.

`TaskForm` receives `onAddTask`, while `TaskItem` receives `onToggleTask`.

For task completion, the flow is:

```text
App
  ↓ onToggleTask
TaskList
  ↓ onToggleTask
TaskItem
  ↑ task ID
App
```

I chose this approach because React data flows down through props, while child components can report user-driven events upward through callback functions.

I deliberately avoid allowing child components to own or directly mutate application-level task data.

### Input Normalization and Validation

I normalize submitted titles with `trim()` before sending them to the parent.

This prevents accidental leading and trailing whitespace from becoming part of the stored task title.

I also reject empty and whitespace-only values before calling `onAddTask`.

I chose to perform this validation inside `TaskForm` because invalid input should be rejected at the form boundary before it reaches application state.

I deliberately avoided relying only on an HTML `required` attribute because I also want the application logic itself to protect the data from whitespace-only values.

### Reset After Successful Submission

I clear the controlled input only after a valid task has been submitted.

This prepares the form for the next task while preserving the user's text when submission is rejected.

I chose this behavior because clearing invalid input would remove information the user may want to correct.

### Task Data Model

I initially stored submitted tasks as plain strings because that was sufficient for the first form implementation.

When I introduced the task list, I changed the task representation to objects.

The current structure is:

```js
{
  id: crypto.randomUUID(),
  title: taskTitle,
  completed: false,
}
```

I chose this approach because each task now has both identity and behavior-related state.

Adding `completed` to the task object keeps all persistent task information together and prepares the model for later features such as filtering and persistence.

I deliberately avoid adding properties before they are needed. I prefer evolving the data model alongside real application requirements.

### Stable Task IDs

I assign each task a stable ID when it is created using `crypto.randomUUID()`.

I chose a stable ID because React list items need an identity that remains associated with the same task even when the collection changes.

I also use the ID when requesting task updates.

I deliberately avoided using the array index as the React `key` because array positions can change when tasks are deleted, filtered, or reordered.

### Functional State Updates

When an update depends on previous state, I use the functional form of the React state setter.

For adding tasks:

```js
setTasks((currentTasks) => [...currentTasks, newTask])
```

For toggling task completion:

```js
setTasks((currentTasks) =>
  currentTasks.map((task) =>
    task.id === taskId
      ? { ...task, completed: !task.completed }
      : task,
  ),
)
```

I chose this approach because the next task collection depends on the previous collection.

Using the previous state provided by React avoids relying on a potentially stale state snapshot.

### Immutable Task Updates

I update task completion immutably instead of modifying the existing task object.

I use `map()` to create a new array and object spread to create a new object only for the task that changed.

I chose this approach because React state should be treated as immutable.

Direct mutation such as:

```js
task.completed = true
```

would modify an object already stored in state and make state changes harder to reason about.

The immutable update keeps unchanged tasks intact while producing a new collection for React.

### Dedicated TaskList Component

I render the task collection inside a dedicated `TaskList` component instead of placing list markup directly inside `App`.

This gives the collection a clear rendering responsibility while leaving `App` focused on state ownership and application composition.

`TaskList` also acts as the connection between application-level task data and the individual `TaskItem` components.

### Dedicated TaskItem Component

I introduced `TaskItem` when individual tasks gained their own interactive behavior.

Previously, each task only displayed text, so a separate component would have added structure without providing a clear benefit.

Once completion behavior was added, the task item gained its own responsibilities:

- display the task title
- display the completion state
- expose a checkbox interaction
- report toggle requests to the parent

I chose to create the component at this point because the abstraction now represents a real domain concept and interaction boundary.

### Single Source of Truth for Completion State

I chose not to create local `useState` inside `TaskItem` for the checkbox.

The checkbox receives its checked value from `task.completed`.

This means the task collection in `App` remains the single source of truth.

I deliberately avoided duplicating completion state locally because two copies of the same state could become inconsistent.

The flow is:

```text
App task state
  ↓
TaskItem checkbox
  ↓ user interaction
onToggleTask(task.id)
  ↓
App updates task state
  ↓
TaskItem receives updated task
```

### Controlled Completion Checkbox

The completion checkbox is controlled through:

```jsx
checked={task.completed}
```

and reports changes through:

```jsx
onChange={handleToggle}
```

I chose a controlled checkbox because its visual state should always reflect the application data stored in `App`.

This keeps the user interface synchronized with the actual task model.

### Semantic List Markup

I render the task collection with `<ul>` and `<li>` elements.

I chose semantic list markup because tasks represent a collection of related items.

Using native list elements communicates that structure directly to browsers and assistive technologies without recreating list semantics with generic elements.

### Accessible Task Controls

I wrap the checkbox and task title in a `<label>`.

This creates an accessible relationship between the task title and its checkbox.

As a result, the checkbox can be identified by the visible task name, for example:

```js
screen.getByRole('checkbox', {
  name: /buy groceries/i,
})
```

I chose this approach because the control should be understandable and operable through its visible task label without requiring hidden testing-specific attributes.

### Empty State

When the task collection is empty, `TaskList` displays a clear message instead of rendering an empty list.

I chose to provide an explicit empty state because a blank area does not tell the user whether the interface is working or what action to take next.

### Testing Strategy

I use Vitest together with React Testing Library.

My tests focus on observable behavior instead of internal React implementation details.

For example, completion is verified through the checkbox state rather than by accessing `task.completed` inside the application.

I chose this approach because user-facing tests remain useful even when implementation details change.

### Accessible Testing Queries

I prefer queries such as `getByRole` when testing interactive elements.

For example:

```js
screen.getByRole('checkbox', {
  name: /buy groceries/i,
})
```

I chose this approach because it reflects how users and assistive technologies identify interface elements.

I deliberately avoid relying on CSS selectors or testing-specific attributes when an accessible query is available.

### User Interaction Testing

I use `@testing-library/user-event` for interactions such as typing and clicking.

For example:

```js
await user.click(taskCheckbox)
```

I chose `user-event` because it models user interaction more closely than manually dispatching individual low-level DOM events.

### Mock Functions for Component Contracts

I use `vi.fn()` when testing child component callback contracts.

For `TaskItem`, I verify that clicking the checkbox calls `onToggleTask` with the correct task ID.

I chose this approach because the component should report intent while the parent remains responsible for changing application state.

### TaskItem Component Tests

I test `TaskItem` independently with predictable task objects.

The tests verify:

- an incomplete task renders an unchecked checkbox
- a completed task renders a checked checkbox
- clicking the checkbox reports the correct task ID

I chose these tests because they cover the component's visible state and public interaction contract without testing internal implementation details.

### Integration-style Completion Test

I also test task completion through the complete `App` component.

The test creates a task, finds its checkbox, verifies that it starts unchecked, clicks it, and verifies that it becomes checked.

The full flow tested is:

```text
User creates task
  ↓
TaskForm
  ↓
App stores task with completed: false
  ↓
TaskList
  ↓
TaskItem
  ↓
User clicks checkbox
  ↓
onToggleTask(task.id)
  ↓
App updates task immutably
  ↓
React renders updated task
  ↓
Checkbox becomes checked
```

I chose this integration-style test because isolated component tests prove individual contracts, but they do not prove that state ownership and callback propagation work correctly across the full component tree.

### Test Isolation

I explicitly clean up the rendered DOM after every test.

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

I chose `npm ci` instead of `npm install` in CI because it installs dependencies using the committed lock file and provides a reproducible environment.

I chose this pipeline so every pull request is validated before being integrated into `main`.

## Development Workflow

For each feature, I work on a dedicated Git branch and integrate changes through a pull request.

My workflow is:

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

GitHub Actions validates changes automatically.

Squash merging keeps the history of `main` focused on completed features rather than intermediate development commits.

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
- Controlled checkboxes
- State ownership
- Single source of truth
- Props and callback props
- Child-to-parent communication
- Callback propagation
- Functional state updates
- Immutable array updates
- Immutable object updates
- `map()` for state transformations
- Object spread syntax
- Form submission
- Input normalization
- Input validation
- Data-model evolution
- Stable identifiers
- React list keys
- Semantic list markup
- Accessible form controls
- Empty states
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
