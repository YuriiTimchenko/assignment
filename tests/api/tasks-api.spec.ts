import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:3001';

test.describe('Tasks API', () => {
  test('GET /tasks returns the list of seeded tasks', async ({ request }) => {
    const response = await request.get(`${API_URL}/tasks`);
    expect(response.status()).toBe(200);

    const tasks = await response.json();
    expect(Array.isArray(tasks)).toBeTruthy();
    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks[0]).toHaveProperty('title');
    expect(tasks[0]).toHaveProperty('status');
  });

  test('POST /tasks creates a task and checks its properties', async ({ request }) => {
    const newTask = {
      title: `API created task ${Date.now()}`,
      description: 'Task created through the API to verify POST /tasks',
      status: 'Open',
    };

    const response = await request.post(`${API_URL}/tasks`, { data: newTask });
    const createdTask = await response.json();

    expect(response.status()).toBe(201);
    expect(createdTask).toMatchObject({
      id: expect.anything(),
      title: expect.any(String),
      description: expect.any(String),
      status: expect.any(String),
    });
    expect(createdTask.title).toBe(newTask.title);
    expect(createdTask.description).toBe(newTask.description);
    expect(createdTask.status).toBe(newTask.status);

    // Verify that the task can be fetched from the API
    const fetchResponse = await request.get(`${API_URL}/tasks/${createdTask.id}`);
    const a = await fetchResponse.json();

    expect(fetchResponse.status()).toBe(200);
    expect(await fetchResponse.json()).toMatchObject(newTask);

    // Sort of cleanup: delete the task after the test
    const deleteResponse = await request.delete(`${API_URL}/tasks/${createdTask.id}`);

    expect(deleteResponse.ok()).toBeTruthy();
  });
});
