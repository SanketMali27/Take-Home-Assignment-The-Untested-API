# Bug Report

## Bug 1 — Pagination Starts From the Wrong Offset

### Location

`src/services/taskService.js`

Function:

```js
getPaginated()
```

### Expected Behavior

When requesting a page with a given limit, pagination should start at the correct position.

For example, with 5 tasks and a limit of 2:

- Page 1 → Task 1, Task 2
- Page 2 → Task 3, Task 4
- Page 3 → Task 5

### Actual Behavior

Page 1 returned Task 3 and Task 4 instead of Task 1 and Task 2.

Page 2 returned only Task 5.

### How It Was Discovered

A unit test was written for `taskService.getPaginated()`.

The test created five tasks and called:

```js
getPaginated(1, 2)
```

The test expected Task 1 and Task 2 but received Task 3 and Task 4.

An integration test for:

```http
GET /tasks?page=1&limit=2
```

also failed with the same behavior.

### Root Cause

The pagination offset was calculated as:

```js
const offset = page * limit;
```

For page 1 and limit 2:

```text
1 × 2 = 2
```

This skips the first two tasks.

### Fix

Changed the calculation to:

```js
const offset = (page - 1) * limit;
```

This makes page 1 start at index 0.

### Status

Fixed. Pagination now returns the correct tasks for each page.

---

## Bug 2 — Status Filtering Performs Partial Matching

### Location

`src/services/taskService.js`

Function:

```js
getByStatus()
```

### Expected Behavior

Filtering tasks by status should match the complete status value.

Valid statuses are:

- `todo`
- `in_progress`
- `done`

For example:

```http
GET /tasks?status=progress
```

should not return a task whose status is:

```text
in_progress
```

because `progress` is not a complete valid status.

### Actual Behavior

The service returned tasks with status `in_progress` when filtering with:

```text
progress
```

### How It Was Discovered

A unit test was added to verify exact status matching:

```js
const tasks = taskService.getByStatus('progress');

expect(tasks).toHaveLength(0);
```

The test failed because an `in_progress` task was returned.

### Root Cause

The service used:

```js
tasks.filter((t) => t.status.includes(status));
```

`includes()` performs partial string matching.

For example:

```js
'in_progress'.includes('progress')
```

returns:

```text
true
```

### Fix

Changed the filtering logic to exact matching:

```js
tasks.filter((t) => t.status === status);
```

### Status

Fixed. Status filtering now uses exact matching.