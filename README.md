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

## Live Demo

The application is publicly available at:

**https://jositoda1.github.io/task-manager/**

I deploy the production build automatically with GitHub Actions and GitHub Pages. The public endpoint has been verified with an HTTP `200` response after deployment.

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
- Task editing
- Temporary edit mode state inside `TaskItem`
- Controlled edit input
- Save and Cancel edit actions
- Edited-title trimming and whitespace validation
- Immutable title updates with `map()`
- Integration-style task editing test
- Task filtering with All, Active, and Completed views
- Dedicated `TaskFilters` component
- Selected filter state with `aria-pressed`
- Derived visible task collection without duplicated state
- Exact accessible-name queries for filter controls
- Integration-style filtering test
- Task persistence with `localStorage`
- Lazy initialization of task state from browser storage
- Automatic synchronization of task changes to storage with `useEffect`
- JSON serialization and deserialization
- Defensive recovery from malformed stored JSON
- Validation that stored data is a task collection
- Persistence tests for add, complete, edit, and delete flows
- Task summary with active and completed counts
- Dedicated `TaskSummary` component
- Derived active and completed task counts
- `Clear completed` bulk action
- Disabled clear action when no completed tasks exist
- Persisted clearing of completed tasks
- Responsive task summary layout
- Production deployment to GitHub Pages
- Automated deployment through GitHub Actions
- Vite repository base-path configuration
- Separate build and deploy jobs
- Production `dist` artifact publishing
- Manual deployment support with `workflow_dispatch`
- Public deployment verification with HTTP status checking

### Planned

- Further portfolio projects and backend-focused work

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
- GitHub Pages

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

`TaskForm` receives `onAddTask`, while `TaskItem` receives `onToggleTask`, `onDeleteTask`, and `onEditTask`.

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

For editing, the callback follows the same ownership boundary:

```text
App
  ↓ onEditTask
TaskList
  ↓ onEditTask
TaskItem
  ↑ task ID + normalized title
App
```

I chose to forward `onEditTask` through `TaskList` rather than moving task state into the list or item. `TaskList` remains responsible for rendering and forwarding actions, while `App` remains responsible for persistent application data.

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

For editing task titles:

```js
setTasks((currentTasks) =>
  currentTasks.map((task) =>
    task.id === taskId
      ? { ...task, title: newTitle }
      : task,
  ),
)
```

I chose `map()` for editing because one task changes while the remaining tasks should keep their existing values. Object spread preserves the task ID, completion state, and any future properties while replacing only the title.

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

### Temporary Edit State

I keep `isEditing` and `editTitle` inside `TaskItem`.

These values represent temporary interface state rather than persistent application data.

For example, while the user changes:

```text
Buy groceries
```

to an unfinished draft such as:

```text
Buy veget...
```

the application-level task should still be considered `Buy groceries` until the user explicitly saves the edit.

I chose this separation because `App` should own the saved task title, while `TaskItem` can own the temporary editing experience.

This avoids updating shared application state on every edit keystroke and keeps the distinction between a saved value and an unfinished draft clear.

### Entering Edit Mode

When editing starts, I copy the current saved task title into the local edit draft.

```js
setEditTitle(task.title)
setIsEditing(true)
```

I deliberately reset the draft whenever Edit is selected.

This ensures that reopening the editor always starts from the latest saved application state instead of from an abandoned local value.

### Controlled Edit Input

The edit field is a controlled React input.

Its value comes from `editTitle`, and `onChange` updates that local state.

I chose a controlled input for the same reason I use one in `TaskForm`: validation, resetting, and explicit interaction behavior are easier to reason about when React owns the current value.

### Saving an Edited Task

When the user selects Save, I normalize the draft with `trim()` before sending it to `App`.

```js
const trimmedTitle = editTitle.trim()
```

If the normalized value is valid, `TaskItem` reports:

```js
onEditTask(task.id, trimmedTitle)
```

I chose to send the task ID and new title rather than the entire modified task object.

`TaskItem` knows which task the user is editing and what title they entered, while `App` remains responsible for deciding how the shared task collection changes.

### Consistent Validation Between Create and Edit

Task creation and task editing use the same whitespace rule.

Both reject empty or whitespace-only titles after normalization with `trim()`.

I chose to keep this rule consistent because the validity of a task title should not depend on whether the task is being created or edited.

An existing valid task should not be replaceable with meaningless whitespace.

### Keeping Edit Mode Open After Invalid Save

When the user attempts to save a whitespace-only title, I do not close edit mode.

I chose this behavior because leaving the editor open allows the user to correct the invalid value immediately.

Closing the editor would hide the problem and make the correction workflow less clear.

### Cancelling an Edit

Cancel discards the unfinished draft and returns to the saved task title without calling `onEditTask`.

I reset the local draft from `task.title` before leaving edit mode.

I chose this behavior because Cancel should be non-destructive: temporary input is abandoned, while persistent application state remains untouched.

### Immutable Title Updates

`App` updates an edited title with `map()` and object spread:

```js
setTasks((currentTasks) =>
  currentTasks.map((task) =>
    task.id === taskId
      ? { ...task, title: newTitle }
      : task,
  ),
)
```

I chose this approach because editing changes one property of one task.

Using:

```js
{ ...task, title: newTitle }
```

preserves the existing `id`, `completed` state, and any future task properties while replacing only the title.

I deliberately avoid direct mutation such as:

```js
task.title = newTitle
```

because objects already stored in React state should be treated as immutable.

### Secondary Action Styling

Editing introduced supporting actions such as Edit and Cancel.

I use a neutral secondary button variant for these actions so they remain visible without competing with the primary Add or Save actions or the destructive Delete action.

This creates a clearer visual hierarchy:

```text
Primary
  -> Add task
  -> Save

Secondary
  -> Edit
  -> Cancel

Danger
  -> Delete
```

I chose semantic button variants because visual priority should reflect the meaning and consequence of each action.

### Grid and Flexbox in Edit Mode

The edit layout continues the same Grid and Flexbox strategy used elsewhere in the project.

The edit row uses Grid so the text input can consume the available width while the action group keeps the space it needs.

The action group uses Flexbox because Save and Cancel need simple one-dimensional alignment and spacing.

I chose to reuse the existing layout principles instead of introducing a different styling technique specifically for edit mode.

### Dedicated TaskFilters Component

I introduced a dedicated `TaskFilters` component for the `All`, `Active`, and `Completed` controls.

I chose a separate component because filtering is now a distinct interface responsibility with its own rendering logic, accessibility state, interaction contract, and tests.

`TaskFilters` does not own the application task collection. It receives the current filter and reports user selections through props.

This keeps the component focused on presentation and interaction while `App` remains responsible for application-level state.

### Filter Configuration as Data

The available filters are represented as a small configuration array:

```js
const filters = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'active',
    label: 'Active',
  },
  {
    value: 'completed',
    label: 'Completed',
  },
]
```

I chose to map over configuration data instead of manually duplicating three nearly identical button elements.

At this point the controls share the same structure and behavior, so the small abstraction removes unnecessary repetition without hiding important application logic.

### Filter State in App

I keep the selected filter in `App`:

```js
const [filter, setFilter] = useState('all')
```

I chose `App` because the selected filter determines which tasks are passed to `TaskList`.

The filter is application-level UI state: multiple child components participate in the result, so keeping it at their closest shared owner makes the data flow explicit.

### Source State and Derived Data

The complete task collection remains the source state.

The visible task collection is derived from `tasks` and `filter`:

```js
const visibleTasks = tasks.filter((task) => {
  if (filter === 'active') {
    return !task.completed
  }

  if (filter === 'completed') {
    return task.completed
  }

  return true
})
```

I deliberately do not create a second state variable such as:

```js
const [filteredTasks, setFilteredTasks] = useState([])
```

because that would duplicate information already available from the source task collection and the selected filter.

Duplicated state creates synchronization risk. A separate filtered collection would need to stay correct after task creation, completion, editing, deletion, and every future task mutation.

By deriving `visibleTasks` during rendering, React always calculates the current view from the latest source data.

### Why I Did Not Use useEffect for Filtering

I do not use `useEffect` to synchronize a filtered task list.

Filtering is a pure calculation based on values already available during rendering, so an effect would add unnecessary state synchronization and another render cycle.

I chose direct derivation because the operation is small, deterministic, and easy to reason about.

If filtering later became computationally expensive with a very large collection, memoization could be evaluated based on measured performance rather than added prematurely.

### Filter Semantics

The filtering rules are intentionally simple:

```text
All
  -> every task

Active
  -> completed === false

Completed
  -> completed === true
```

I chose to derive the views from the existing `completed` property instead of storing a separate status value.

This keeps completion state normalized and avoids representing the same concept in multiple forms.

### Total Count Versus Visible Count

The task counter continues to use:

```js
tasks.length
```

instead of:

```js
visibleTasks.length
```

I chose this because the current text describes how many tasks exist in the application, not how many happen to be visible under the selected filter.

Filtering changes presentation, not the underlying collection.

### Passing setFilter Directly

`TaskFilters` receives:

```jsx
onFilterChange={setFilter}
```

I chose to pass the state setter directly because there is currently no additional application logic required when the filter changes.

A wrapper such as:

```js
const handleFilterChange = (newFilter) => {
  setFilter(newFilter)
}
```

would only forward the same value.

If the interaction later needs analytics, URL synchronization, validation, or another side effect, I can introduce a dedicated handler at that point.

### aria-pressed for Filter Selection

Each filter is a button with an `aria-pressed` value that reflects whether it is currently selected.

```jsx
aria-pressed={isActive}
```

I chose `aria-pressed` because these controls behave like toggle-style selection buttons.

The selected filter therefore has both a visual state and a semantic state available to assistive technologies.

I deliberately avoid relying only on an active CSS class to communicate selection.

### Filtering Preserves Source Tasks

Applying a filter never modifies the original task objects or removes tasks from the source collection.

The filter only changes which task objects are passed to `TaskList`.

I chose this separation because filtering is a view concern. A user switching from `Completed` back to `All` should immediately see the same underlying data again.

### Filter Buttons Do Not Mutate Task Data

The filter buttons use a lighter visual treatment than primary or destructive task actions.

Changing from `All` to `Active` or `Completed` changes visibility only; it does not create, edit, complete, or delete task data.

I chose a separate filter button variant so the visual hierarchy reflects the lower consequence of the action.

### Flexbox for Filter Controls

The filter controls use Flexbox.

They form one horizontal control group whose main layout requirements are alignment, spacing, and wrapping on narrower screens.

I chose Flexbox instead of Grid here because the layout is primarily one-dimensional.

This follows the same layout principle used throughout the application: Grid for structural two-dimensional relationships and Flexbox for aligned component groups.

### Browser Persistence with localStorage

I use the browser Web Storage API to persist the task collection between page reloads.

I chose `localStorage` because this project is currently a client-side application without a backend, and the data is small, user-specific to the current browser, and suitable for simple local persistence.

This gives the application realistic persistence behavior without introducing a server before the frontend architecture is ready for that next step.

I deliberately do not use `sessionStorage` because task data should survive browser tab and browser-session restarts.

I also do not introduce IndexedDB at this stage because the task collection is small and does not require indexed queries, transactions, or large structured datasets.

### Stable Storage Key

The application uses a dedicated constant:

```js
const TASKS_STORAGE_KEY = 'task-manager-tasks'
```

I keep this outside the component because it is configuration rather than render-specific state.

Using one named constant also avoids repeating a storage key string throughout application code.

### Lazy State Initialization

The task state is initialized with a function:

```js
const [tasks, setTasks] = useState(() => {
  // read localStorage
})
```

I chose lazy initialization because reading and parsing browser storage is only necessary when the task state is created.

If I placed the storage read directly in the component body, it would run on every render even though subsequent renders should use React state as the source of truth.

Lazy initialization keeps the storage read tied to state initialization rather than normal rendering.

### Empty Storage Fallback

When no saved task collection exists, the initializer returns:

```js
[]
```

I chose an empty array as the fallback because it is already the valid default shape expected by the rest of the application.

This allows first-time users and users with cleared browser storage to start in a normal empty state without special rendering logic.

### JSON Serialization

`localStorage` stores string values, while the application uses an array of task objects.

I serialize the task collection with:

```js
JSON.stringify(tasks)
```

and restore it with:

```js
JSON.parse(storedTasks)
```

The conversion flow is:

```text
JavaScript task array
      ↓
JSON.stringify()
      ↓
string in localStorage
      ↓
JSON.parse()
      ↓
JavaScript task array
```

I chose JSON because the current task model contains serializable primitive values and does not require custom encoding.

### useEffect for External Synchronization

I synchronize task changes with browser storage using:

```js
useEffect(() => {
  localStorage.setItem(
    TASKS_STORAGE_KEY,
    JSON.stringify(tasks),
  )
}, [tasks])
```

I chose `useEffect` here because `localStorage` is an external browser system outside React state.

This is different from task filtering.

Filtering is derived data that can be calculated directly during rendering, so I intentionally avoided `useEffect` there.

Persistence is a side effect: React state changes and an external system must be updated to reflect that change.

This distinction keeps effects reserved for synchronization rather than using them for calculations that belong in render logic.

### Narrow Effect Dependency

The persistence effect depends only on:

```js
[tasks]
```

I chose this dependency because only changes to the task collection need to be persisted.

Changing the selected filter should not rewrite task storage because the filter is temporary interface state and is not part of the persisted task data.

A narrow dependency list makes the synchronization rule explicit.

### Centralized Persistence

I do not write to `localStorage` separately inside every task handler.

I avoid code such as:

```text
handleAddTask
  -> update React state
  -> update localStorage

handleToggleTask
  -> update React state
  -> update localStorage

handleEditTask
  -> update React state
  -> update localStorage

handleDeleteTask
  -> update React state
  -> update localStorage
```

Instead, every handler updates React state, and one effect synchronizes the resulting collection:

```text
user action
   ↓
task handler
   ↓
setTasks()
   ↓
tasks changes
   ↓
useEffect
   ↓
localStorage
```

I chose this architecture because it keeps React state as the single source of truth and centralizes the persistence boundary.

It also reduces duplication and lowers the risk that a future task mutation forgets to update browser storage.

### Preserving Task Identity During Persistence

The persistence tests verify that completing and editing a task preserve the same stored task ID.

This matters because completion and editing should change properties of an existing task, not create a new logical entity.

The sequence remains:

```text
Add
  ↓
same task ID
  ↓
Complete
  ↓
same task ID
  ↓
Edit
  ↓
same task ID
```

The existing immutable update strategy naturally supports this because task updates copy the existing task object and preserve its ID.

### Persistent Deletion

When a task is deleted, React state becomes a collection without that task.

The persistence effect then stores the new collection.

I verify that storage becomes:

```json
[]
```

when the last task is deleted.

I chose to test deletion at the storage boundary because a task removed only from the current React render but left in storage would reappear after a page reload.

### Defensive JSON Parsing

Stored browser data cannot be assumed to be valid forever.

The initializer therefore protects `JSON.parse()` with `try/catch`.

If malformed JSON is present, the application recovers to:

```js
[]
```

instead of failing to render.

I chose this defensive behavior because persistent browser storage can be manually edited, left behind by older application versions, or otherwise corrupted.

A recoverable local storage problem should not prevent the entire interface from loading.

### Valid JSON Is Not Necessarily Valid Application Data

Successful `JSON.parse()` only proves that the stored text is syntactically valid JSON.

For example:

```json
{
  "unexpected": "value"
}
```

is valid JSON but is not a task collection.

After parsing, I verify:

```js
Array.isArray(parsedTasks)
```

and fall back to an empty collection when the value is not an array.

I chose this extra structural validation because syntax validity and application-level data validity are different concerns.

### Why I Do Not Fully Validate Every Task Object Yet

The current implementation validates that persisted data is an array, but it does not yet perform schema-level validation of every task object.

For example, it does not currently verify every stored item has a string `id`, string `title`, and boolean `completed`.

I chose not to introduce a complete validation layer yet because the data model is still small and the project has not introduced a validation library or backend contract.

The current validation protects the application from the most immediate malformed-storage failures while leaving room for stronger schema validation when the data model becomes more complex.

### Persistence Scope

Only the task collection is persisted.

The selected filter is intentionally not stored.

I chose this because task data represents user-created application content, while the filter is a temporary view preference in the current product design.

This keeps persisted data focused on information that would be frustrating to lose after a reload.

### Dedicated TaskSummary Component

I introduced a dedicated `TaskSummary` component to display active and completed task counts and expose the `Clear completed` action.

I chose a separate component because summary information and bulk actions form a distinct interface responsibility. `TaskSummary` does not own task state; it receives derived counts and a callback from `App`.

### Derived Active and Completed Counts

I calculate the summary values directly from the task collection:

```js
const activeCount = tasks.filter((task) => !task.completed).length
const completedCount = tasks.filter((task) => task.completed).length
```

I deliberately do not store these values in separate React state because they can always be derived from `tasks`. This keeps the task collection as the single source of truth and avoids synchronization bugs.

### Bulk Clear Completed Action

The `Clear completed` action removes completed tasks with one immutable transformation:

```js
setTasks((currentTasks) =>
  currentTasks.filter((task) => !task.completed),
)
```

I chose `filter()` because the operation naturally means keeping active tasks and excluding completed ones. This avoids mutating the existing array and avoids deleting items one by one.

### Why Clear Completed Lives in App

`TaskSummary` reports the user action through `onClearCompleted`, while `App` performs the collection update.

I chose this ownership boundary because `App` already owns the shared task collection. The summary component stays focused on presentation and interaction rather than application-state mutation.

### Automatic Persistence of Bulk Clearing

`handleClearCompleted` does not write directly to `localStorage`. It updates `tasks`, and the existing persistence effect stores the new collection:

```text
Clear completed
      ↓
setTasks()
      ↓
tasks changes
      ↓
useEffect
      ↓
localStorage updates
```

I chose this because persistence is already centralized around the task collection. Repeating storage writes inside the bulk action would duplicate logic and increase maintenance risk.

### Disabled Clear Action

The button uses:

```jsx
disabled={completedCount === 0}
```

I chose the native disabled state because the action has no meaningful result when there are no completed tasks. This communicates the unavailable state both behaviorally and semantically instead of relying on styling alone.

### Singular and Plural Summary Labels

The summary adapts its labels to the count:

```text
1 active task
2 active tasks

1 completed task
2 completed tasks
```

I chose this small presentation rule because status text should read naturally to the user.

### Summary Versus Total Task Count

The interface currently shows both the total task count and the active/completed breakdown.

The total count answers how many tasks exist, while the summary explains how those tasks are distributed by completion state. I keep both for now because they communicate different information and can be revisited later as a product-design decision.

### Flexbox for Task Summary Layout

The summary uses Flexbox because it contains two main one-dimensional groups: counts and the related action.

```text
counts <----------------> action
```

I chose Flexbox rather than Grid because the primary requirement is horizontal alignment and spacing.

### Responsive Task Summary Layout

On narrower screens, the summary changes from horizontal to vertical layout and the action can use the available width.

I chose CSS for this behavior because it is purely presentational and does not require JavaScript-driven layout state.

## Deployment and CI/CD Decisions

### GitHub Pages as the Current Production Target

I deploy the application to:

```text
https://jositoda1.github.io/task-manager/
```

I chose GitHub Pages because the current application is a client-side React application that Vite compiles into static assets.

At this stage, the project does not require a production Node.js server, PHP runtime, database, server-side rendering, or backend API. A static hosting platform is therefore an appropriate and intentionally simple production target.

I would reassess the hosting architecture if the project later gained backend requirements rather than forcing server-side needs into a static hosting platform.

### Vite Base Path for a Project Site

The repository is named:

```text
task-manager
```

A GitHub Pages project site is served below the repository path instead of directly from the account domain root.

The application therefore needs production assets below:

```text
/task-manager/
```

I configure Vite with:

```js
export default defineConfig({
  base: '/task-manager/',
  plugins: [react()],
})
```

I chose an explicit base path because Vite must generate URLs that match the actual hosting location.

Without it, a build could reference:

```text
/assets/index.js
/assets/index.css
```

while the deployed project expects:

```text
/task-manager/assets/index.js
/task-manager/assets/index.css
```

That mismatch can allow the HTML document to load while JavaScript and CSS return `404` responses.

### Verifying the Generated Build

I verify the production configuration by inspecting `dist/index.html` after `npm run build`.

The generated document contains asset paths such as:

```html
<script type="module" src="/task-manager/assets/..."></script>
<link rel="stylesheet" href="/task-manager/assets/...">
```

I also use Vite preview locally, where the production build is served below:

```text
http://localhost:4173/task-manager/
```

I chose to inspect generated output instead of assuming that a configuration value is correct just because the source file looks correct.

### Deployment Workflow Trigger

The deployment workflow runs on pushes to `main`:

```yaml
on:
  push:
    branches:
      - main

  workflow_dispatch:
```

I deliberately do not deploy the production site from feature or CI branches.

My delivery flow is:

```text
feature or CI branch
      ↓
pull request
      ↓
CI validation
      ↓
squash merge
      ↓
main
      ↓
deployment workflow
```

A pull request represents a proposed change, while `main` represents the accepted production state.

### Manual Deployment Support

I also enable:

```yaml
workflow_dispatch:
```

This gives me an operational fallback for rerunning a deployment without creating an artificial source-code change just to trigger the workflow.

The normal path is still automatic deployment after a successful merge into `main`.

### Explicit Deployment Permissions

The workflow declares:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

I keep repository-content access read-only because the workflow only needs to check out and build the application.

`pages: write` allows the workflow to publish the Pages deployment, and `id-token: write` supports the identity flow required by the deployment action.

I prefer explicit limited permissions over broad repository write access.

### Separate Build and Deploy Jobs

The Pages workflow is divided into two jobs:

```text
build
  ↓
deploy
```

The deployment job uses:

```yaml
needs: build
```

I chose this structure because building and publishing are different responsibilities.

The build job validates and prepares the application. The deploy job only runs after the build job succeeds.

This prevents publishing after a failed validation or build stage and keeps the workflow easier to reason about.

### Deployment Build Quality Gates

The build job runs:

```text
npm ci
npm test
npm run lint
npm run build
```

I intentionally repeat these checks in the deployment workflow even though pull requests already use CI.

This makes the deployment workflow independently safe when it is started through `workflow_dispatch`, rather than assuming another workflow has already validated the same state.

### Why I Use npm ci in Automation

I use:

```text
npm ci
```

instead of `npm install` in CI/CD because `npm ci` installs from the committed lockfile in a clean and reproducible way.

This reduces the risk of a deployment being built with dependency versions that differ from the versions represented by the repository.

### Production Artifact

Vite creates the production application inside:

```text
dist/
```

The workflow uploads only:

```yaml
with:
  path: ./dist
```

I chose to publish the production artifact rather than the complete repository.

The deployed result contains the optimized HTML, CSS, JavaScript, and public assets generated by Vite. Tests, source files, development configuration, and `node_modules` are not the deployment artifact.

### GitHub Pages Artifact Flow

The workflow uses the Pages-specific handoff:

```text
configure GitHub Pages
      ↓
upload dist artifact
      ↓
deploy artifact
```

This makes the boundary between application build and hosting explicit.

### GitHub Pages Environment

The deploy job targets:

```yaml
environment:
  name: github-pages
```

and exposes the deployment URL from the deployment step output.

I use the dedicated environment because a production deployment is an operational concern that should be visible separately from ordinary CI execution.

### Concurrency Control

The workflow defines a GitHub Pages concurrency group and cancels an older in-progress deployment when a newer one becomes the relevant deployment.

I chose this because the newest accepted `main` state is the version that should ultimately be published.

### CI Versus CD

I treat continuous integration and continuous delivery/deployment as related but distinct concerns.

The CI workflow answers:

```text
Is this change safe to integrate?
```

It runs:

```text
npm ci
npm run lint
npm test
npm run build
```

The deployment workflow answers:

```text
Can the accepted version be built and delivered automatically?
```

Its production path is:

```text
main
  ↓
validate
  ↓
build
  ↓
create Pages artifact
  ↓
deploy
```

Keeping CI and CD conceptually separate makes the repository easier to understand and prepares the project for more advanced delivery tooling later.

### Deployment Verification

After the first automated deployment, I verify the Pages configuration and obtain the published URL through the GitHub API.

I also request the live page directly and confirm an HTTP:

```text
200
```

response.

I prefer verifying the actual public endpoint rather than treating a green workflow as the only evidence that the application is reachable.

### Current End-to-End Delivery Architecture

The current development and delivery path is:

```text
local development
      ↓
dedicated branch
      ↓
local tests + lint + build
      ↓
commit
      ↓
push
      ↓
pull request
      ↓
GitHub Actions CI
      ↓
squash merge
      ↓
main
      ↓
GitHub Actions Pages workflow
      ↓
production build
      ↓
dist artifact
      ↓
GitHub Pages deployment
      ↓
public application
```

This gives the project an automated path from local development through validation to a publicly accessible production build.

### Current Hosting Tradeoffs

GitHub Pages is a strong fit for this frontend-only stage because it is simple, public, and works naturally with static Vite output.

Its limitation is equally important: it is not a runtime for backend Node.js applications, PHP, WordPress, private APIs, database-backed authentication, or other server-side workloads.

I consider that a useful architectural boundary rather than a problem. When a future project needs server-side behavior, I will choose infrastructure designed for that workload.


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

### Integration-style Editing Test

I test editing through the complete `App` component in addition to the isolated `TaskItem` tests.

The integration test creates a task, enters edit mode, changes the draft, saves it, verifies that the original title disappears, and verifies that the new title becomes visible.

The flow is:

```text
User creates task
  ↓
TaskForm
  ↓
App stores task
  ↓
TaskList
  ↓
TaskItem enters edit mode
  ↓
User changes local edit draft
  ↓
Save
  ↓
onEditTask(task.id, newTitle)
  ↓
TaskList forwards callback
  ↓
App updates title with map()
  ↓
React renders updated task
  ↓
New title becomes visible
```

I chose this test because an isolated `TaskItem` test can prove that `onEditTask` is called correctly, but it cannot prove that the callback is actually connected through `TaskList` to `App`.

During development, this distinction exposed a real integration bug: the isolated edit tests passed while the application could not save an edited title because `App` was not passing `onEditTask` to `TaskList`.

The integration test failed with that wiring mistake and passed after the callback chain was completed.

This is a useful example of why I keep both focused component tests and higher-level interaction tests.

### Edit Component Tests

The isolated `TaskItem` tests cover:

- entering edit mode with the current saved title
- submitting a normalized edited title
- leaving edit mode after a valid save
- rejecting whitespace-only edited titles
- remaining in edit mode after invalid input
- cancelling without calling the application callback
- restoring the saved task after cancellation

I chose these tests because they describe the local editing contract independently from the application-level state implementation.

### TaskFilters Component Tests

The isolated `TaskFilters` tests verify two responsibilities:

- the currently selected filter exposes the correct `aria-pressed` state
- selecting a filter reports the expected filter value to the parent

I chose these tests because they define the component contract independently from `App`.

The component does not need to know how tasks are filtered. It only needs to render the available controls, expose selection semantically, and report user intent correctly.

### Exact Accessible Names for Filter Queries

During the filtering integration test, a broad query such as:

```js
screen.getByRole('button', {
  name: /active/i,
})
```

matched more than the `Active` filter button.

Task-specific action labels such as:

```text
Edit Active task
Delete Active task
```

also contain the word `Active`.

I changed the filter query to exact accessible-name matching:

```js
screen.getByRole('button', {
  name: /^active$/i,
})
```

and apply the same pattern to `Completed` and `All`.

I chose this instead of `getAllByRole()` because the test expects one specific control, not an arbitrary item from several matches.

This keeps the test aligned with the accessible name of the intended button and makes failures more meaningful.

### Integration-style Filtering Test

I test filtering through the complete `App` component.

The test:

1. creates an active task
2. creates a second task
3. marks the second task as completed
4. verifies both are visible under the default `All` filter
5. selects `Active` and verifies only the incomplete task remains visible
6. selects `Completed` and verifies only the completed task remains visible
7. selects `All` and verifies both tasks become visible again

The interaction flow is:

```text
tasks + filter
     ↓
visibleTasks is derived
     ↓
TaskList receives visibleTasks
     ↓
user selects another filter
     ↓
filter state changes
     ↓
visibleTasks is derived again
     ↓
TaskList renders the new view
```

I chose an integration test because the most important behavior crosses component boundaries.

An isolated `TaskFilters` test can prove that the component reports `completed`, but it cannot prove that `App` derives the correct task collection and passes it to `TaskList`.

### Testing a Failed Expectation Versus an Application Bug

While developing the filtering test, the application correctly displayed only the completed task after the `Completed` filter was selected, but the test initially expected the active task to remain visible.

The rendered DOM and `aria-pressed="true"` state made it clear that the application behavior was correct and the expectation was wrong.

I corrected the test sequence rather than changing working application code.

This reinforced an important testing principle: a failing test is evidence that something disagrees with the expectation, but the failure must still be diagnosed before deciding whether the product code or the test is incorrect.

### localStorage Test Isolation

The test suite clears browser storage before every `App` test:

```js
beforeEach(() => {
  localStorage.clear()
})
```

I chose this because `localStorage` persists values within the test environment unless explicitly cleared.

Without isolation, one test could accidentally depend on data created by another test, making results sensitive to test order.

Each test should establish its own persistence state.

### Loading Persisted Tasks Test

I seed `localStorage` before rendering `App` and verify that the saved task appears in the interface.

I verify the result through visible application behavior rather than reading React state directly.

This proves that the initialization boundary works from browser storage through React rendering.

### Saving Tasks Test

I create a task through the interface and then read the stored collection back through the Web Storage API.

I use `waitFor()` because persistence happens through an effect after the React state update.

The test does not assume the exact scheduling moment of that effect. It waits for the observable storage state to become correct.

### Partial Object Matching for Generated IDs

New task IDs are generated dynamically with `crypto.randomUUID()`.

For the basic storage-write test, I use `toMatchObject()` for the properties relevant to that test:

```js
expect(storedTasks[0]).toMatchObject({
  title: 'Persisted task',
  completed: false,
})
```

I chose partial matching because the exact UUID value is not part of this test's responsibility.

The test should prove persistence of task data without becoming coupled to an unpredictable identifier value.

### Persistence Lifecycle Integration Test

I test a complete persisted task lifecycle:

```text
Add
  ↓
Complete
  ↓
Edit
  ↓
Delete
```

After each meaningful change, I read `localStorage` and verify that the stored collection matches the application state.

The test also captures the generated ID after creation and confirms that completion and editing preserve that same identity.

I chose one lifecycle-oriented integration test because all of these operations share one persistence mechanism: they update `tasks`, and the persistence effect synchronizes the resulting collection.

This proves that persistence is centralized rather than accidentally working only for task creation.

### Invalid JSON Recovery Test

I intentionally place malformed data in storage:

```text
{invalid-json
```

and render the application.

I verify that the UI still loads in a valid empty state.

I chose this test because browser persistence should not become a single point of failure for application startup.

### Invalid Stored Shape Test

I also store syntactically valid JSON that is not a task collection.

For example:

```json
{
  "unexpected": "value"
}
```

The application ignores that value and starts from an empty task collection.

I chose a separate test because malformed JSON and valid-but-unusable JSON are different failure modes.

Testing both documents the difference between parsing successfully and validating the expected data structure.

### TaskSummary Component Tests

The isolated `TaskSummary` tests verify three responsibilities:

- active and completed counts are rendered
- `Clear completed` is disabled when there are no completed tasks
- clicking the enabled action reports the clear request to the parent

I chose these tests because they define the component contract independently from the application-level state mutation.

### Clear Completed Integration Test

I test the bulk clear operation through the complete `App` component.

The test creates one active task and one completed task, verifies the derived summary, selects `Clear completed`, and verifies that the completed task disappears, the active task remains, the counts update, and the clear action becomes disabled.

This covers the full flow:

```text
TaskSummary
   ↓ callback
App
   ↓ immutable task update
derived counts
   ↓
TaskSummary re-renders
TaskList re-renders
```

### Persistence After Clear Completed

The integration test also verifies the `localStorage` result after clearing completed tasks.

I chose to test this boundary because a completed task removed only from React state but left in storage would return after a page reload. This also proves that the centralized persistence effect automatically supports a newly introduced bulk mutation.

### Duplicate Markup Caught by Existing Tests

During integration, the total task-count paragraph was accidentally rendered twice.

Existing tests failed because `getByText()` found multiple identical count elements. I fixed the duplicated markup instead of changing the tests to a plural query such as `getAllByText()`.

I chose this because the interface was supposed to render one total count. Making the test more permissive would have hidden a real UI defect.

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

### Continuous Deployment

I configured a second GitHub Actions workflow to deploy the accepted `main` branch to GitHub Pages.

The deployment path is:

```text
main push
  ↓
npm ci
  ↓
tests
  ↓
lint
  ↓
production build
  ↓
Pages artifact
  ↓
deploy
```

I keep this workflow separate from pull-request CI because validation and production delivery have different triggers and permissions.

The public application is available at:

```text
https://jositoda1.github.io/task-manager/
```

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
GitHub Actions CI
  ↓
Code review
  ↓
Squash merge
  ↓
main
  ↓
GitHub Actions deployment
  ↓
GitHub Pages
```

I chose this workflow because it gives me experience with a development process similar to the one commonly used in collaborative software projects.

Feature branches isolate work from the stable `main` branch.

Pull requests provide a clear review point before integration.

GitHub Actions validates changes automatically.

Squash merging keeps the history of `main` focused on completed features rather than intermediate development commits.

## Testing

The current suite contains 32 automated tests covering component behavior and application-level interaction flows.

### Deployment Validation

The deployment work does not increase the React test count because it changes delivery infrastructure rather than application behavior.

Before committing the deployment workflow, I still run the complete local quality gate:

```text
npm test
npm run lint
npm run build
```

The application remains at 32 passing automated tests.

I then validate the hosting-specific behavior by inspecting the generated Vite asset paths, previewing the production build below the repository subpath, confirming the GitHub Pages workflow succeeds after merge, and verifying the public endpoint returns HTTP `200`.

This gives me several independent validation layers:

```text
automated application tests
      ↓
lint
      ↓
production build
      ↓
generated asset-path inspection
      ↓
GitHub Pages workflow
      ↓
public endpoint verification
```


| Test area | Tests |
| --- | ---: |
| `TaskForm` | 5 |
| `TaskFilters` | 2 |
| `TaskSummary` | 3 |
| `TaskList` | 2 |
| `TaskItem` | 8 |
| `App` integration behavior | 12 |
| **Total** | **32** |

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
- Temporary UI state versus persistent application state
- Edit-mode state
- Controlled edit inputs
- Save and Cancel interaction patterns
- Consistent validation across create and edit flows
- Callback wiring across multiple component levels
- Immutable property updates with object spread
- Unit tests versus integration tests for component wiring
- Source state versus derived data
- Avoiding duplicated React state
- Deriving filtered collections during render
- Knowing when `useEffect` is unnecessary
- Accessible toggle-button state with `aria-pressed`
- Exact accessible-name matching in Testing Library
- Diagnosing whether a failing test or application behavior is incorrect
- Flexbox for compact control groups
- View-level filtering without mutating source data
- Browser persistence with `localStorage`
- Lazy state initialization
- JSON serialization and deserialization
- Using `useEffect` for external synchronization
- Choosing narrow effect dependencies
- Centralizing persistence instead of duplicating storage writes
- Preserving entity identity across persisted updates
- Defensive parsing of stored data
- Distinguishing valid JSON from valid application data
- Test isolation for persistent browser state
- Using `waitFor()` for effect-driven synchronization tests
- Testing persistence across create, complete, edit, and delete flows
- Derived summary values from source state
- Bulk immutable collection updates
- Designing disabled actions with native semantics
- Separating bulk-action presentation from state ownership
- Reusing centralized persistence for new mutations
- Singular and plural user-facing labels
- Responsive summary layouts with Flexbox
- Recognizing when a failing test exposes duplicate UI markup
- Static production deployment with GitHub Pages
- Vite base paths for repository-hosted applications
- Inspecting generated build output before deployment
- Continuous integration versus continuous deployment
- Deployment workflows with dependent jobs
- Publishing production artifacts rather than source repositories
- Minimal GitHub Actions deployment permissions
- Manual workflow dispatch as an operational fallback
- GitHub Pages environments
- Deployment concurrency control
- Verifying a public production endpoint after deployment
- Static-hosting tradeoffs and backend limitations
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
