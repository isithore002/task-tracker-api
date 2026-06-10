/**
 * Jest API integration tests for Task Tracker REST API
 * Prerequisites: Spring Boot server must be running on http://localhost:8080
 * Run: cd tests && npm install && npm test
 */

const axios = require('axios');

const BASE = 'http://localhost:8080/api';
const client = axios.create({ baseURL: BASE, validateStatus: () => true });

let projectId;
let taskId;

// ── Projects ──────────────────────────────────────────────────────────────

describe('Projects API', () => {

  test('POST /projects — creates a project and returns 201', async () => {
    const res = await client.post('/projects', {
      name: 'Test Project',
      description: 'Created by Jest test suite'
    });
    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty('id');
    expect(res.data.name).toBe('Test Project');
    projectId = res.data.id;
  });

  test('GET /projects — returns array with at least one project', async () => {
    const res = await client.get('/projects');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBeGreaterThan(0);
  });

  test('GET /projects/:id — returns the created project', async () => {
    const res = await client.get(`/projects/${projectId}`);
    expect(res.status).toBe(200);
    expect(res.data.id).toBe(projectId);
    expect(res.data.name).toBe('Test Project');
  });

  test('GET /projects/:id — returns 404 for non-existent project', async () => {
    const res = await client.get('/projects/999999');
    expect(res.status).toBe(404);
  });

  test('PUT /projects/:id — updates project name', async () => {
    const res = await client.put(`/projects/${projectId}`, {
      name: 'Updated Project',
      description: 'Updated by Jest'
    });
    expect(res.status).toBe(200);
    expect(res.data.name).toBe('Updated Project');
  });

});

// ── Tasks ─────────────────────────────────────────────────────────────────

describe('Tasks API', () => {

  test('POST /projects/:id/tasks — creates a task and returns 201', async () => {
    const res = await client.post(`/projects/${projectId}/tasks`, {
      title: 'Write unit tests',
      description: 'Add Jest integration tests',
      priority: 'HIGH'
    });
    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty('id');
    expect(res.data.title).toBe('Write unit tests');
    expect(res.data.status).toBe('TODO');
    taskId = res.data.id;
  });

  test('POST /projects/:id/tasks — returns 400 when title is blank', async () => {
    const res = await client.post(`/projects/${projectId}/tasks`, {
      title: '',
      priority: 'LOW'
    });
    expect(res.status).toBe(400);
  });

  test('GET /tasks — returns all tasks', async () => {
    const res = await client.get('/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  test('GET /tasks?status=TODO — filters tasks by status', async () => {
    const res = await client.get('/tasks?status=TODO');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    res.data.forEach(task => expect(task.status).toBe('TODO'));
  });

  test('GET /tasks/:id — returns the created task', async () => {
    const res = await client.get(`/tasks/${taskId}`);
    expect(res.status).toBe(200);
    expect(res.data.id).toBe(taskId);
  });

  test('GET /tasks/:id — returns 404 for non-existent task', async () => {
    const res = await client.get('/tasks/999999');
    expect(res.status).toBe(404);
  });

  test('GET /projects/:id/tasks — returns tasks for the project', async () => {
    const res = await client.get(`/projects/${projectId}/tasks`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.some(t => t.id === taskId)).toBe(true);
  });

  test('PATCH /tasks/:id/status — updates status to IN_PROGRESS', async () => {
    const res = await client.patch(`/tasks/${taskId}/status?status=IN_PROGRESS`);
    expect(res.status).toBe(200);
    expect(res.data.status).toBe('IN_PROGRESS');
  });

  test('PATCH /tasks/:id/status — updates status to DONE', async () => {
    const res = await client.patch(`/tasks/${taskId}/status?status=DONE`);
    expect(res.status).toBe(200);
    expect(res.data.status).toBe('DONE');
  });

  test('PUT /tasks/:id — updates task fields', async () => {
    const res = await client.put(`/tasks/${taskId}`, {
      title: 'Write unit tests (updated)',
      priority: 'MEDIUM'
    });
    expect(res.status).toBe(200);
    expect(res.data.title).toBe('Write unit tests (updated)');
  });

});

// ── Cleanup ───────────────────────────────────────────────────────────────

describe('Cleanup', () => {

  test('DELETE /tasks/:id — deletes the task and returns 204', async () => {
    const res = await client.delete(`/tasks/${taskId}`);
    expect(res.status).toBe(204);
  });

  test('GET /tasks/:id — returns 404 after deletion', async () => {
    const res = await client.get(`/tasks/${taskId}`);
    expect(res.status).toBe(404);
  });

  test('DELETE /projects/:id — deletes the project and returns 204', async () => {
    const res = await client.delete(`/projects/${projectId}`);
    expect(res.status).toBe(204);
  });

});
