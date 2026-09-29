# Bug Report

## Bug 1 — Pagination starts from the wrong offset

### Expected Behavior

When requesting a page with a given limit, pagination should start at the
correct position.

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

### Status
Fixed. Changed partial matching to exact status matching.
```js
getPaginated(1, 2)