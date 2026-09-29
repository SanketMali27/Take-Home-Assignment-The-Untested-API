const taskService = require('../src/services/taskService');

describe('Task Service', () => {
    beforeEach(() => {
        taskService._reset();
    });

    describe('create()', () => {
        test('should create a task with default values', () => {
            const task = taskService.create({
                title: 'Learn Jest',
            });

            expect(task).toHaveProperty('id');
            expect(task.title).toBe('Learn Jest');
            expect(task.description).toBe('');
            expect(task.status).toBe('todo');
            expect(task.priority).toBe('medium');
            expect(task.dueDate).toBeNull();
            expect(task.completedAt).toBeNull();
            expect(task).toHaveProperty('createdAt');
        });

        test('should create a task with provided values', () => {
            const task = taskService.create({
                title: 'Build API',
                description: 'Build Task Manager API',
                status: 'in_progress',
                priority: 'high',
                dueDate: '2030-01-01T00:00:00.000Z',
            });

            expect(task.title).toBe('Build API');
            expect(task.description).toBe('Build Task Manager API');
            expect(task.status).toBe('in_progress');
            expect(task.priority).toBe('high');
            expect(task.dueDate).toBe('2030-01-01T00:00:00.000Z');
        });
    });

    describe('getAll()', () => {
        test('should return all tasks', () => {
            taskService.create({ title: 'Task 1' });
            taskService.create({ title: 'Task 2' });

            const tasks = taskService.getAll();

            expect(tasks).toHaveLength(2);
            expect(tasks[0].title).toBe('Task 1');
            expect(tasks[1].title).toBe('Task 2');
        });

        test('should return an empty array when there are no tasks', () => {
            expect(taskService.getAll()).toEqual([]);
        });
    });

    describe('findById()', () => {
        test('should find a task by ID', () => {
            const created = taskService.create({
                title: 'Find me',
            });

            const task = taskService.findById(created.id);

            expect(task).toEqual(created);
        });

        test('should return undefined for an unknown ID', () => {
            const task = taskService.findById('invalid-id');

            expect(task).toBeUndefined();
        });
    });

    describe('getByStatus()', () => {
        test('should return tasks with the requested status', () => {
            taskService.create({
                title: 'Todo task',
                status: 'todo',
            });

            taskService.create({
                title: 'In progress task',
                status: 'in_progress',
            });

            const tasks = taskService.getByStatus('todo');

            expect(tasks).toHaveLength(1);
            expect(tasks[0].status).toBe('todo');
        });

        test('should return an empty array when no task has the status', () => {
            taskService.create({
                title: 'Todo task',
                status: 'todo',
            });

            expect(taskService.getByStatus('done')).toEqual([]);
        });
    });

    describe('getPaginated()', () => {
        beforeEach(() => {
            taskService.create({ title: 'Task 1' });
            taskService.create({ title: 'Task 2' });
            taskService.create({ title: 'Task 3' });
            taskService.create({ title: 'Task 4' });
            taskService.create({ title: 'Task 5' });
        });

        test('should return the first page', () => {
            const tasks = taskService.getPaginated(1, 2);

            expect(tasks).toHaveLength(2);
            expect(tasks[0].title).toBe('Task 1');
            expect(tasks[1].title).toBe('Task 2');
        });

        test('should return the second page', () => {
            const tasks = taskService.getPaginated(2, 2);

            expect(tasks).toHaveLength(2);
            expect(tasks[0].title).toBe('Task 3');
            expect(tasks[1].title).toBe('Task 4');
        });
    });

    describe('update()', () => {
        test('should update an existing task', () => {
            const task = taskService.create({
                title: 'Old title',
                priority: 'low',
            });

            const updated = taskService.update(task.id, {
                title: 'New title',
                priority: 'high',
            });

            expect(updated.title).toBe('New title');
            expect(updated.priority).toBe('high');
            expect(updated.id).toBe(task.id);
        });

        test('should return null when task does not exist', () => {
            const result = taskService.update('invalid-id', {
                title: 'Updated',
            });

            expect(result).toBeNull();
        });
    });

    describe('remove()', () => {
        test('should remove an existing task', () => {
            const task = taskService.create({
                title: 'Delete me',
            });

            const result = taskService.remove(task.id);

            expect(result).toBe(true);
            expect(taskService.findById(task.id)).toBeUndefined();
        });

        test('should return false when task does not exist', () => {
            expect(taskService.remove('invalid-id')).toBe(false);
        });
    });

    describe('completeTask()', () => {
        test('should mark a task as done', () => {
            const task = taskService.create({
                title: 'Complete me',
                priority: 'high',
            });

            const completed = taskService.completeTask(task.id);

            expect(completed.status).toBe('done');
            expect(completed.completedAt).not.toBeNull();
            expect(completed.completedAt).toEqual(expect.any(String));
        });

        test('should return null when task does not exist', () => {
            expect(taskService.completeTask('invalid-id')).toBeNull();
        });
    });

    describe('getByStatus()', () => {
        test('should return tasks with the requested status', () => {
            taskService.create({
                title: 'Todo task',
                status: 'todo',
            });

            taskService.create({
                title: 'In progress task',
                status: 'in_progress',
            });

            const tasks = taskService.getByStatus('todo');

            expect(tasks).toHaveLength(1);
            expect(tasks[0].status).toBe('todo');
        });

        test('should return an empty array when no task has the status', () => {
            taskService.create({
                title: 'Todo task',
                status: 'todo',
            });

            expect(taskService.getByStatus('done')).toEqual([]);
        });

        test('should only match the exact status', () => {
            taskService.create({
                title: 'In progress task',
                status: 'in_progress',
            });

            const tasks = taskService.getByStatus('progress');

            expect(tasks).toHaveLength(0);
        });
    });
});