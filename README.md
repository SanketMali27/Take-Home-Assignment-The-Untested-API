# Take-Home Assignment — The Untested API

A 2-day take-home assignment focused on reading unfamiliar code, writing tests, identifying and fixing bugs, and implementing a small API feature.

## Overview

This project is a Node.js/Express Task Manager API with an in-memory data store.

The assignment involved:

- Understanding the existing API and service layer
- Writing unit tests for the task service
- Writing integration tests for API routes using Supertest
- Finding and fixing bugs
- Implementing task assignment functionality
- Testing edge cases
- Measuring test coverage

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
cd task-api
npm install
```

### Start the API

```bash
npm start
```

The API runs on:

```text
http://localhost:3000
```

---

## Running Tests

Run the complete test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run coverage
```

### Test Results

Current test results:

- **47 tests passed**
- **0 tests failed**

### Coverage

- **Statement Coverage:** 96.02%
- **Branch Coverage:** 90.36%
- **Function Coverage:** 93.10%
- **Line Coverage:** 95.62%

---

## Project Structure

```text
task-api/
│
├── src/
│   ├── app.js
│   ├── routes/
│   │   └── tasks.js
│   ├── services/
│   │   └── taskService.js
│   └── utils/
│       └── validators.js
│
├── tests/
│   ├── taskService.test.js
│   ├── tasks.test.js
│   └── validators.test.js
│
├── BUGS.md
├── ASSIGNMENT.md
├── package.json
└── package-lock.json
```

The application uses an **in-memory data store**, so all task data is reset when the application restarts.

---

# API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | List all tasks |
| GET | `/tasks?status=` | Filter tasks by status |
| GET | `/tasks?page=&limit=` | Get paginated tasks |
| GET | `/tasks/stats` | Get task statistics |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |
| PATCH | `/tasks/:id/complete` | Mark a task as complete |
| PATCH | `/tasks/:id/assign` | Assign a task to a user |

---

## Task Shape

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "status": "todo | in_progress | done",
  "priority": "low | medium | high",
  "dueDate": "ISO 8601 or null",
  "completedAt": "ISO 8601 or null",
  "createdAt": "ISO 8601"
}
```

---

# Testing

The test suite contains unit, integration, and validation tests.

## Unit Tests

`tests/taskService.test.js`

Tests the task service business logic, including:

- Creating tasks
- Finding tasks
- Listing tasks
- Status filtering
- Pagination
- Statistics
- Updating tasks
- Deleting tasks
- Completing tasks

## Integration Tests

`tests/tasks.test.js`

Tests the Express API using Supertest, including:

- `GET /tasks`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`
- `PATCH /tasks/:id/complete`
- `PATCH /tasks/:id/assign`
- `GET /tasks/stats`
- Status filtering
- Pagination
- Error responses
- Edge cases

## Validation Tests

`tests/validators.test.js`

Tests validation for:

- Missing title
- Empty title
- Invalid status
- Invalid priority
- Invalid due date
- Valid task data
- Update validation

---

# Bugs Found and Fixed

Two bugs were discovered while writing tests.

Detailed bug information is available in [`BUGS.md`](./BUGS.md).

## Bug 1 — Pagination Offset

### Location

`src/services/taskService.js`

Function:

```js
getPaginated()
```

### Problem

The original implementation calculated the offset using:

```js
const offset = page * limit;
```

For page 1 with a limit of 2, this produced an offset of 2, causing the first two tasks to be skipped.

### Fix

Changed it to:

```js
const offset = (page - 1) * limit;
```

This makes page 1 start from the first task.

---

## Bug 2 — Status Filtering

### Location

`src/services/taskService.js`

Function:

```js
getByStatus()
```

### Problem

The original implementation used:

```js
tasks.filter((t) => t.status.includes(status));
```

This performed partial matching.

For example:

```js
'in_progress'.includes('progress')
```

returns:

```text
true
```

Therefore, filtering with `progress` incorrectly returned an `in_progress` task.

### Fix

Changed it to exact matching:

```js
tasks.filter((t) => t.status === status);
```

---

# Task Assignment Feature

Implemented:

```http
PATCH /tasks/:id/assign
```

## Request

```json
{
  "assignee": "John"
}
```

## Successful Response

The updated task is returned with the `assignee` field:

```json
{
  "id": "task-id",
  "title": "Write tests",
  "assignee": "John"
}
```

## Validation

The endpoint rejects:

- Missing `assignee`
- Empty strings
- Whitespace-only strings
- Non-string values

For example:

```json
{
  "assignee": ""
}
```

returns:

```http
400 Bad Request
```

If the task does not exist:

```http
404 Not Found
```

Reassignment is allowed, so an existing task can be assigned to another user.

---

# Design Decisions

## Assignee Validation

I chose to require `assignee` to be a non-empty string.

This prevents invalid values such as:

```json
{
  "assignee": ""
}
```

or:

```json
{
  "assignee": 123
}
```

Whitespace is trimmed before storing the value.

## Reassignment

Reassignment is allowed.

An existing task can be assigned to another user when needed.

---

# What I Would Test Next

If I had more time, I would add tests for:

- Concurrent requests
- Malformed JSON requests
- Pagination boundary values
- Additional date/time edge cases
- API error handling
- Very large pagination limits
- Reassignment edge cases

---

# What Surprised Me

The API uses an in-memory data store, so all task data is lost when the application restarts.

This makes the application simple to test and run locally, but it would need persistent storage for production use.

---

# Questions Before Shipping to Production

Before shipping this API to production, I would clarify:

- What database will be used in production?
- What authentication and authorization are required?
- What timezone should be used for due dates and overdue tasks?
- What are the maximum pagination limits?
- What is the expected reassignment behavior?
- Should the API use a standardized error response format?
- What logging and monitoring requirements are expected?
- What API rate limiting is required?

---

# Submission Summary

This submission includes:

- Unit tests for the service layer
- Integration tests for API routes
- Validation tests
- Edge-case tests
- Two identified and fixed bugs
- Task assignment feature
- Documentation of design decisions
- Test coverage above 80%

## Final Test Status

```text
Test Suites: 3 passed, 3 total
Tests:       47 passed, 47 total

Statement Coverage: 96.02%
Branch Coverage:    90.36%
Function Coverage:  93.10%
Line Coverage:      95.62%
```