const request = require('supertest');
const Task = require('../src/models/task');
const app = require('../src/app');
const {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase
} = require('./fixtures/db');
beforeEach(setupDatabase);
test('Should create task for User', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: ' this is from my test case'
    })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test('should give all tasks for userOne', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
});

test('should not delete taskOne by userTwo', async () => {
  await request(app)
    .delete(`/tasks/:${taskOne._id}`)
    .set('Authorization', `bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(401);

  const task = await Task.findById(taskOne._id);

  expect(task).not.toBeNull();
});
