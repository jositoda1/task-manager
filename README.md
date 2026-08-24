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
- Task deletion
- Immutable deletion with `filter()`
- Delete action propagated through callback props
- Singular and plural task counter
- Automated component tests
- Integration-style tests for component communication
- Integration-style task completion test
- Integration-style task deletion test
- Responsive application layout
- CSS Grid for structural layout
- Flexbox for component alignment
- CSS custom properties for shared design values
- Reusable primary, danger, and small button variants
- Styled form controls
- Hover, active, and focus-visible interaction states
- Visual styling for completed tasks
- Responsive mobile layout
- Task-specific accessible delete labels

### Planned

- Task editing
- Task filtering
- Local storage persistence
- Automated deployment

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- CSS Grid
- Flexbox
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

The task form lives in `TaskForm`, the task collection is displayed by `TaskList`, and each interactive task is rendered by `TaskItem`.

This keeps `App` responsible for application-level state and component composition instead of detailed UI responsibilities.

I deliberately avoid creating components before they have a clear responsibility. I introduced `TaskItem` only when individual tasks gained their own behavior.

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

`TaskForm` receives `onAddTask`, while `TaskItem` receives `onToggleTask` and `onDeleteTask`.

For deletion, the flow is:

```text
App
  ↓ onDeleteTask
TaskList
  ↓ onDeleteTask
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

I chose this approach because each task needs its own identity and behavior-related state.

I deliberately avoid adding properties before they are needed. I prefer evolving the data model alongside real application requirements.

### Stable Task IDs

I assign each task a stable ID when it is created using `crypto.randomUUID()`.

I chose a stable ID because React list items need an identity that remains associated with the same task even when the collection changes.

The same ID is also used for completion and deletion actions.

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

For deleting tasks:

```js
setTasks((currentTasks) =>
  currentTasks.filter((task) => task.id !== taskId),
)
```

I chose this approach because each next collection depends on the current collection.

Using the previous state provided by React avoids relying on a potentially stale state snapshot.

### Immutable Task Updates

I treat React state as immutable.

For completion, I use `map()` and object spread to create a new task object only for the task that changed.

I deliberately avoid direct mutation such as:

```js
task.completed = true
```

because it modifies an object that already belongs to React state.

### Immutable Task Deletion

I chose `filter()` for task deletion.

The deletion rule is expressed as keeping every task whose ID does not match the selected task:

```js
currentTasks.filter((task) => task.id !== taskId)
```

I chose this approach because `filter()` returns a new array without mutating the existing state collection.

I deliberately avoided methods such as `splice()` because they modify the existing array in place.

Using `filter()` also makes the intention of the operation clear: the next collection is the current collection without one identified task.

### Dedicated TaskList Component

I render the task collection inside a dedicated `TaskList` component instead of placing list markup directly inside `App`.

This gives the collection a clear rendering responsibility while leaving `App` focused on state ownership and application composition.

`TaskList` also forwards task-level actions such as completion and deletion without owning the application state itself.

### Dedicated TaskItem Component

I introduced `TaskItem` when individual tasks gained interactive behavior.

The component is responsible for:

- displaying the task title
- displaying completion state
- exposing the completion checkbox
- exposing the delete action
- reporting user actions using the task ID

I chose to keep state changes outside `TaskItem` because the parent application owns the shared collection.

### Single Source of Truth for Task State

I do not create a second copy of task completion or deletion state inside `TaskItem`.

The task collection in `App` remains the single source of truth.

For completion, `TaskItem` receives `task.completed`.

For deletion, `TaskItem` reports the selected task ID and disappears only after `App` produces a new task collection.

I chose this approach because duplicated state can become inconsistent.

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

### Explicit Delete Button Type

The delete action uses:

```jsx
<button type="button">
  Delete
</button>
```

I chose an explicit `type="button"` because deleting a task is an action, not a form submission.

Although `TaskItem` is not currently rendered inside the task form, making the button's intent explicit avoids accidental submission behavior if the component structure changes later.

### Semantic List Markup

I render the task collection with `<ul>` and `<li>` elements.

I chose semantic list markup because tasks represent a collection of related items.

Using native list elements communicates that structure directly to browsers and assistive technologies without recreating list semantics with generic `<div>` elements.

### Accessible Task Controls

I wrap the completion checkbox and task title in a `<label>`.

This gives the checkbox an accessible name based on the visible task title.

For example:

```js
screen.getByRole('checkbox', {
  name: /buy groceries/i,
})
```

I also locate the delete action by its accessible button role and visible label.

I chose accessible queries and semantic controls because they reflect how users interact with the interface rather than how the DOM happens to be structured internally.

For repeated Delete buttons, I also provide a task-specific accessible label:

```jsx
aria-label={`Delete ${task.title}`}
```

I chose this because several controls may share the same visible text, while assistive technologies benefit from knowing which task each destructive action affects.

### Empty State

When the task collection is empty, `TaskList` displays a clear message instead of rendering an empty list.

I chose to provide an explicit empty state because a blank area does not tell the user whether the interface is working or what action to take next.

After the final task is deleted, the application naturally returns to this empty state because it is derived from the task collection.

## Visual Design Decisions

### Styling After Core Behavior

I chose to introduce the responsive visual system after the core task interactions were already working.

At that point, the application already had real form behavior, task rendering, completion, deletion, and automated tests.

I chose this order because it allowed me to design around real components and real states instead of styling hypothetical interface elements.

It also meant that the existing test suite could protect application behavior while I changed presentation and layout.

### Plain CSS Instead of Bootstrap

I deliberately chose not to install Bootstrap or another CSS framework for this stage of the project.

I wanted the interface to have the clarity and consistency commonly associated with component frameworks while still understanding and implementing the underlying CSS myself.

Using plain CSS gives me direct practice with:

- layout systems
- reusable visual patterns
- responsive behavior
- semantic variants
- interaction states
- accessibility
- CSS architecture

Bootstrap could reduce the amount of CSS required, but it would also hide some of the layout and styling decisions that I specifically want to understand and demonstrate in this portfolio project.

### Small Design System

I created a small reusable visual system instead of styling every component independently.

Shared colors, borders, radii, shadows, and focus values are defined centrally and reused throughout the interface.

I chose this approach because repeated visual values should have a single source of truth.

This gives the project some of the maintainability benefits of a UI framework without introducing an external dependency.

### CSS Custom Properties

I use CSS custom properties for shared design values.

For example:

```css
--color-primary: #0d6efd;
--color-primary-hover: #0b5ed7;
--color-danger: #dc3545;
--color-border: #dee2e6;
--color-text-muted: #6c757d;
```

I chose custom properties instead of repeating literal values throughout the stylesheet.

This makes visual changes easier to apply consistently and keeps the relationship between components clear.

I deliberately avoid creating variables for every single CSS value. I introduce shared properties only when they represent a reusable design decision.

### CSS Grid for Structural Layout

I use CSS Grid for layout problems that involve structural regions or column relationships.

The main application uses Grid to create consistent vertical spacing between major sections.

The task form also uses Grid:

```css
.task-form__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.75rem;
}
```

I chose this layout because the input should consume the available horizontal space while the Add task button keeps the width required by its content.

I use `minmax(0, 1fr)` instead of only `1fr` so the flexible column is explicitly allowed to shrink inside the available container width.

This becomes useful when content grows or the available space becomes limited.

### Flexbox for Component Alignment

I use Flexbox inside individual task items.

For example:

```css
.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
```

I chose Flexbox because the task content and its action need one-dimensional alignment across the same row.

My layout rule in this project is therefore:

```text
Grid
  -> structural regions
  -> column relationships
Flexbox
  -> alignment inside a component
  -> one-dimensional distribution
```

I deliberately avoid using Grid everywhere or Flexbox everywhere. I choose the layout model based on the problem each component needs to solve.

### Responsive Form Layout

On wider screens, the task input and Add task button are displayed side by side.

On smaller screens, the form switches to a single-column layout.

I chose this behavior because a compact horizontal layout works well when enough space is available, while full-width controls are easier to read and use on narrow screens.

The responsive change is implemented with CSS rather than JavaScript because viewport-based layout is a presentation concern.

### Responsive Task Items

Task items use a horizontal layout on wider screens.

On smaller screens, the task content and action can stack vertically so long task titles do not compete with the Delete button for limited horizontal space.

I chose this approach because responsive design should protect content readability rather than simply shrink every element.

### Fluid Heading Size

The application heading uses `clamp()` for fluid typography.

For example:

```css
font-size: clamp(2.25rem, 6vw, 3.5rem);
```

I chose `clamp()` because it allows the heading to respond to viewport size while still respecting clear minimum and maximum sizes.

This reduces the need for additional typography-specific media queries.

### Card-like Application Surface

I group the main task controls inside a surface with a border, rounded corners, and a restrained shadow.

I chose a card-like treatment because it creates a clear visual hierarchy between the page background and the interactive application area.

I deliberately keep the shadow subtle because the goal is separation and depth, not decoration.

### Reusable Button Base Class

I created a reusable base button class and separate semantic variants.

The structure includes:

```text
button
button--primary
button--danger
button--small
```

The base class owns shared behavior such as:

- alignment
- minimum height
- padding
- font weight
- border radius
- cursor behavior
- transitions
- focus feedback
- active feedback

I chose this structure because shared button behavior should not be duplicated across every action.

### Primary Action Styling

The Add task button uses the primary visual treatment.

I chose stronger visual emphasis for this action because adding a task is the main constructive action in the current interface.

The primary variant uses a dedicated color and hover state so the control remains visually consistent while still providing interaction feedback.

### Destructive Action Styling

The Delete button uses a danger variant.

I chose a separate destructive treatment because deletion has a different meaning and consequence from normal actions.

The distinct styling helps users recognize that the action removes data before they activate it.

### Small Button Variant

The Delete action uses a smaller button variant inside each task item.

I chose this because the task title should remain the main visual content of the row, while the delete action should remain available without dominating the component.

The smaller size is still designed to remain comfortably interactive.

### Styled Form Controls

I style the task input with consistent padding, border, radius, placeholder color, and focus feedback.

I chose a reusable form-control class because form fields should share a predictable visual language as the project grows.

This also avoids tying input styling to one specific component.

### Visible Focus States

Interactive controls include visible keyboard focus feedback.

I use a focus ring rather than relying only on a subtle border-color change.

I chose this because keyboard users need a clear indication of which control currently has focus.

The project therefore treats focus feedback as part of the interface design rather than as a browser detail to remove.

### Hover and Active States

Buttons and task items include lightweight hover feedback, and buttons also include an active state.

I chose short transitions so users receive interaction feedback without creating distracting animation.

The active state slightly changes the button position to reinforce the physical feeling of pressing a control.

### Completed Task Styling

Completed tasks keep their title visible but reduce its visual emphasis and apply a line-through treatment.

I chose this approach because completion should be immediately understandable while the original task remains available as context.

I deliberately do not hide completed tasks automatically because filtering behavior will be introduced as its own feature later.

### Accessible Delete Labels

Each delete button keeps the concise visible text `Delete`, but it also includes a task-specific accessible label.

For example:

```jsx
aria-label={`Delete ${task.title}`}
```

I chose this because a visual list may contain several buttons that all display the word `Delete`.

A screen reader should instead be able to distinguish controls such as:

```text
Delete Buy groceries
Delete Study React
```

This keeps the visual interface concise while providing more context to assistive technologies.

### Responsive Design Without JavaScript

I implement viewport-based layout changes with CSS media queries.

I deliberately avoid reading the viewport width in React state because no application behavior depends on screen size.

Keeping responsive layout in CSS reduces JavaScript complexity and keeps presentation concerns in the stylesheet.

### Comments as Design Documentation

I use CSS comments for non-obvious layout and design decisions.

The comments explain why Grid or Flexbox was chosen, why a responsive breakpoint exists, and why reusable variants are structured in a particular way.

I deliberately avoid comments that simply translate CSS syntax into English.

The goal is to document intent and tradeoffs so the stylesheet remains useful as a learning and maintenance resource.

### Testing Strategy

I use Vitest together with React Testing Library.

My tests focus on observable behavior instead of internal React implementation details.

For example, completion is verified through the checkbox state and deletion is verified through the task disappearing from the document.

I chose this approach because user-facing tests remain useful even when implementation details change.

### Accessible Testing Queries

I prefer queries such as `getByRole` when testing interactive elements.

For example:

```js
screen.getByRole('button', {
  name: /delete/i,
})
```

I chose this approach because it reflects how users and assistive technologies identify interface elements.

I deliberately avoid relying on CSS selectors or testing-specific attributes when an accessible query is available.

### Querying for Absence

For deletion tests, I use a `queryBy...` query when the expected result is that an element no longer exists:

```js
expect(screen.queryByText('Buy groceries')).not.toBeInTheDocument()
```

I chose `queryByText` instead of `getByText` because `queryBy` returns `null` when no matching element exists.

That behavior is appropriate when absence is the expected result.

Using `getByText` would throw immediately when the element is missing, which makes it unsuitable for this negative assertion.

### User Interaction Testing

I use `@testing-library/user-event` for interactions such as typing and clicking.

For example:

```js
await user.click(deleteButton)
```

I chose `user-event` because it models user interaction more closely than manually dispatching individual low-level DOM events.

### Mock Functions for Component Contracts

I use `vi.fn()` when testing child component callback contracts.

For deletion, the `TaskItem` unit test verifies that clicking Delete calls `onDeleteTask` exactly once with the correct task ID.

I chose this approach because `TaskItem` should report the user's intention while `App` remains responsible for changing state.

### TaskItem Component Tests

I test `TaskItem` independently with predictable task objects.

The tests verify:

- an incomplete task renders an unchecked checkbox
- a completed task renders a checked checkbox
- clicking the checkbox reports the correct task ID
- clicking Delete reports the correct task ID

I chose these tests because they cover the component's visible state and public interaction contract without coupling the tests to parent state management.

### Integration-style Completion Test

I test completion through the complete `App` component.

The test creates a task, finds its checkbox, verifies that it starts unchecked, clicks it, and verifies that it becomes checked.

This proves that callback propagation and immutable state updates are correctly connected across the component tree.

### Integration-style Deletion Test

I also test deletion through the complete `App` component.

The test creates a task, verifies that the task is visible, clicks its Delete button, verifies that the task disappears, and verifies that the task counter returns to zero.

The tested flow is:

```text
User creates task
  ↓
TaskForm
  ↓
App stores task
  ↓
TaskList
  ↓
TaskItem
  ↓
User clicks Delete
  ↓
onDeleteTask(task.id)
  ↓
App filters task collection
  ↓
React renders updated collection
  ↓
Task disappears
```

I chose this integration-style test because the isolated `TaskItem` test only proves that the callback is called.

The `App` test proves that the complete deletion behavior works from the user's perspective.

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
- `map()` for targeted state transformations
- `filter()` for immutable deletion
- Object spread syntax
- Form submission
- Input normalization
- Input validation
- Data-model evolution
- Stable identifiers
- React list keys
- Semantic list markup
- Accessible controls
- Explicit button behavior
- Empty states
- Responsive design
- CSS custom properties
- CSS Grid
- Flexbox
- `minmax()` grid sizing
- Fluid typography with `clamp()`
- Media queries
- Reusable CSS component patterns
- Primary and destructive action variants
- Form-control styling
- Hover, active, and focus-visible states
- Visual state communication
- Accessible repeated actions
- Separation of presentation and application logic
- CSS comments that document design intent
- Component testing
- Mock functions
- Positive and negative DOM queries
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
