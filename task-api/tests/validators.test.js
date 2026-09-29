const {
    validateCreateTask,
    validateUpdateTask,
} = require('../src/utils/validators');

describe('Validators', () => {
    describe('validateCreateTask', () => {
        test('accepts valid task', () => {
            expect(
                validateCreateTask({
                    title: 'Test',
                    status: 'todo',
                    priority: 'high',
                    dueDate: '2030-01-01T00:00:00.000Z',
                })
            ).toBeNull();
        });

        test('rejects empty title', () => {
            expect(validateCreateTask({ title: '' })).toBeTruthy();
        });

        test('rejects invalid status', () => {
            expect(
                validateCreateTask({
                    title: 'Test',
                    status: 'invalid',
                })
            ).toBeTruthy();
        });

        test('rejects invalid priority', () => {
            expect(
                validateCreateTask({
                    title: 'Test',
                    priority: 'urgent',
                })
            ).toBeTruthy();
        });

        test('rejects invalid dueDate', () => {
            expect(
                validateCreateTask({
                    title: 'Test',
                    dueDate: 'invalid-date',
                })
            ).toBeTruthy();
        });
    });

    describe('validateUpdateTask', () => {
        test('accepts valid update', () => {
            expect(
                validateUpdateTask({
                    title: 'Updated',
                    status: 'done',
                    priority: 'low',
                    dueDate: '2030-01-01T00:00:00.000Z',
                })
            ).toBeNull();
        });

        test('rejects empty title', () => {
            expect(
                validateUpdateTask({
                    title: '',
                })
            ).toBeTruthy();
        });

        test('rejects invalid status', () => {
            expect(
                validateUpdateTask({
                    status: 'invalid',
                })
            ).toBeTruthy();
        });

        test('rejects invalid priority', () => {
            expect(
                validateUpdateTask({
                    priority: 'urgent',
                })
            ).toBeTruthy();
        });

        test('rejects invalid dueDate', () => {
            expect(
                validateUpdateTask({
                    dueDate: 'invalid-date',
                })
            ).toBeTruthy();
        });
    });
});