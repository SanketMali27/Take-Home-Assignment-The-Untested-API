const request = require('supertest');
const app = require('../src/app');
const taskService = require('../src/services/taskService');

describe('Task API', () => {
    beforeEach(() => {
        taskService._reset();
    });

    describe('POST /tasks', () => {
        test('should create a task', async () => {
            const res = await request(app)
                .post('/tasks')
                .send({
                    title: 'Learn Jest',
                    description: 'Testing Node API',
                    priority: 'high',
                });

            expect(res.status).toBe(201);
            expect(res.body.title).toBe('Learn Jest');
            expect(res.body.priority).toBe('high');
            expect(res.body.status).toBe('todo');
            expect(res.body).toHaveProperty('id');
        });

        test('should reject task without title', async () => {
            const res = await request(app)
                .post('/tasks')
                .send({
                    description: 'No title',
                });

            expect(res.status).toBe(400);
        });

        test('should reject invalid priority', async () => {
            const res = await request(app)
                .post('/tasks')
                .send({
                    title: 'Test',
                    priority: 'urgent',
                });

            expect(res.status).toBe(400);
        });
    });

    describe('GET /tasks', () => {
        test('should return all tasks', async () => {
            await request(app)
                .post('/tasks')
                .send({ title: 'Task 1' });

            await request(app)
                .post('/tasks')
                .send({ title: 'Task 2' });

            const res = await request(app).get('/tasks');

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
        });

        test('should filter tasks by status', async () => {
            await request(app)
                .post('/tasks')
                .send({
                    title: 'Todo',
                    status: 'todo',
                });

            await request(app)
                .post('/tasks')
                .send({
                    title: 'Done',
                    status: 'done',
                });

            const res = await request(app).get('/tasks?status=todo');

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].status).toBe('todo');
        });

        test('should paginate tasks', async () => {
            await request(app).post('/tasks').send({ title: 'Task 1' });
            await request(app).post('/tasks').send({ title: 'Task 2' });
            await request(app).post('/tasks').send({ title: 'Task 3' });

            const res = await request(app)
                .get('/tasks?page=1&limit=2');

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0].title).toBe('Task 1');
            expect(res.body[1].title).toBe('Task 2');
        });
    });

    describe('PUT /tasks/:id', () => {
        test('should update a task', async () => {
            const create = await request(app)
                .post('/tasks')
                .send({ title: 'Old title' });

            const id = create.body.id;

            const res = await request(app)
                .put(`/tasks/${id}`)
                .send({
                    title: 'New title',
                    priority: 'high',
                });

            expect(res.status).toBe(200);
            expect(res.body.title).toBe('New title');
            expect(res.body.priority).toBe('high');
        });

        test('should return 404 for unknown task', async () => {
            const res = await request(app)
                .put('/tasks/invalid-id')
                .send({ title: 'Updated' });

            expect(res.status).toBe(404);
        });
    });

    describe('DELETE /tasks/:id', () => {
        test('should delete a task', async () => {
            const create = await request(app)
                .post('/tasks')
                .send({ title: 'Delete me' });

            const id = create.body.id;

            const res = await request(app)
                .delete(`/tasks/${id}`);

            expect(res.status).toBe(204);

            const get = await request(app).get('/tasks');

            expect(get.body).toHaveLength(0);
        });

        test('should return 404 for unknown task', async () => {
            const res = await request(app)
                .delete('/tasks/invalid-id');

            expect(res.status).toBe(404);
        });
    });
    describe('PATCH /tasks/:id/assign', () => {
        test('should assign a task', async () => {
            const create = await request(app)
                .post('/tasks')
                .send({
                    title: 'Assign me',
                });

            const id = create.body.id;

            const res = await request(app)
                .patch(`/tasks/${id}/assign`)
                .send({
                    assignee: 'Sanket',
                });

            expect(res.status).toBe(200);
            expect(res.body.assignee).toBe('Sanket');
        });

        test('should return 404 for unknown task', async () => {
            const res = await request(app)
                .patch('/tasks/invalid-id/assign')
                .send({
                    assignee: 'Sanket',
                });

            expect(res.status).toBe(404);
        });

        test('should reject empty assignee', async () => {
            const create = await request(app)
                .post('/tasks')
                .send({
                    title: 'Assign me',
                });

            const res = await request(app)
                .patch(`/tasks/${create.body.id}/assign`)
                .send({
                    assignee: '',
                });

            expect(res.status).toBe(400);
        });

        test('should reject non-string assignee', async () => {
            const create = await request(app)
                .post('/tasks')
                .send({
                    title: 'Assign me',
                });

            const res = await request(app)
                .patch(`/tasks/${create.body.id}/assign`)
                .send({
                    assignee: 123,
                });

            expect(res.status).toBe(400);
        });

        test('should allow reassignment', async () => {
            const create = await request(app)
                .post('/tasks')
                .send({
                    title: 'Assign me',
                });

            const id = create.body.id;

            await request(app)
                .patch(`/tasks/${id}/assign`)
                .send({
                    assignee: 'Sanket',
                });

            const res = await request(app)
                .patch(`/tasks/${id}/assign`)
                .send({
                    assignee: 'Rahul',
                });

            expect(res.status).toBe(200);
            expect(res.body.assignee).toBe('Rahul');
        });
    });
    describe('PATCH /tasks/:id/complete', () => {
        test('should complete a task', async () => {
            const create = await request(app)
                .post('/tasks')
                .send({
                    title: 'Complete me',
                    priority: 'high',
                });

            const id = create.body.id;

            const res = await request(app)
                .patch(`/tasks/${id}/complete`);

            expect(res.status).toBe(200);
            expect(res.body.status).toBe('done');
            expect(res.body.completedAt).not.toBeNull();
        });

        test('should return 404 for unknown task', async () => {
            const res = await request(app)
                .patch('/tasks/invalid-id/complete');

            expect(res.status).toBe(404);
        });
    });

    describe('GET /tasks/stats', () => {
        test('should return task statistics', async () => {
            await request(app)
                .post('/tasks')
                .send({
                    title: 'Todo',
                    status: 'todo',
                });

            await request(app)
                .post('/tasks')
                .send({
                    title: 'Done',
                    status: 'done',
                });

            const res = await request(app).get('/tasks/stats');

            expect(res.status).toBe(200);
            expect(res.body.todo).toBe(1);
            expect(res.body.done).toBe(1);
            expect(res.body.in_progress).toBe(0);
            expect(res.body).toHaveProperty('overdue');
        });
    });
});