# Debugging Journal

## Errors found and fixes

### Already fixed in existing worktree edits and preserved

- **Active filtering and the remaining count were inverted in `App.jsx`.** The existing edits correctly retain incomplete tasks in the Active view and count incomplete tasks as remaining.
- **React mounted to the wrong element in `main.jsx`.** The existing edit mounts to `#app`, which matches `index.html`; the stylesheet selector was then updated to match.
- **Storage did not serialize todos or handle an empty store in `storage.js`.** Existing edits serialize with JSON and use starter tasks when no saved value exists; this pass also added malformed-JSON recovery and record validation.
- **The `dev` script used the preview server in `package.json`.** The existing edit starts Vite's development server instead.

### Fixed in this pass

1. **Submitting a task navigated/reloaded the page.** The form submit handler did not prevent the browser's default submission. It now calls `preventDefault()` before adding the task.
2. **Typing into the task field stored an event object instead of text.** The input change handler now reads `event.target.value`.
3. **Filter counts and selected state were incorrect.** Active and completed chips displayed each other's counts, and the All chip stayed selected regardless of the chosen filter. The count keys now match their filters, and selection styling and `aria-pressed` follow the current filter.
4. **Todo deletion ran during render.** The delete handler called `onDelete` immediately. It now passes a callback, so deletion occurs only after a click.
5. **Todo rows had no stable React key.** Each row now uses its todo ID as its key.
6. **Toggling tasks mutated state in place.** React could miss the update because the same array was passed back. Toggles now create updated todo objects in a new array using a functional state update.
7. **New task IDs could collide after deleting a task.** IDs now use one more than the highest current ID, rather than the current list length.
8. **Renaming saved to `title`, while the UI reads `text`.** Updates now write the trimmed value to `text`, preserving the displayed task name.
9. **Clearing completed tasks skipped adjacent completed items.** The loop removed array entries while advancing its index. Filtering now removes all completed tasks in one immutable update.
10. **Malformed or invalid saved data could crash rendering.** Storage loading now catches invalid JSON and checks each saved task's shape, falling back to copied starter tasks when data is corrupt. Valid arrays, including an intentionally empty list, are preserved.
11. **The document and stylesheet used different mount IDs.** `main.jsx` and `index.html` now mount to `#app`, while the base stylesheet previously targeted `#root`; the stylesheet now targets `#app`.
12. **Completed-task styling targeted the wrong class.** Components render `is-done`, not `completed`; the CSS selector now matches and applies the completed style.
13. **The app crashed at runtime with `React is not defined`.** Vite's React plugin was imported but left out of the config's plugin list, so JSX was not transformed for React. The config now enables `react()`.

## Verification

`npm run build` succeeds. The Vite development server responds, and a browser smoke test passed for task creation, active filtering, renaming, deletion, clearing adjacent completed tasks, persistence after reload, and recovery from malformed saved JSON.
