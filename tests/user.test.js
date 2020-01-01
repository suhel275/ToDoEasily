const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');

const { userOneId, userOne, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should signup the user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'Suhel',
      email: 'suhelkhan275@gmail.com',
      password: 'Suhel%12345'
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: {
      name: 'Suhel',
      email: 'suhelkhan275@gmail.com'
    },
    token: user.tokens[0].token
  });

  expect(user.password).not.toBe('Suhel%12345');
});

test('should login exist user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test('should not login  non-existent user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: 'saurabh275@gmail.com',
      password: userOne.password
    })
    .expect(400);
});

test('should give profile for authorized user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('should not give profile for unauthorized user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401);
});

test('should delete account for authorized user', async () => {
  const response = await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test('should not delete account for unauthorized user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401);
});

test('should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200);
  const user = await User.findById(userOneId);

  expect(user.avatar).toEqual(expect.any(Buffer));
});

test('should update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'Saurabh'
    })
    .expect(200);

  const user = await User.findById(userOne);
  expect(user.name).toEqual('Saurabh');
});

test('should not update invalid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: 'delhi'
    })
    .expect(400);
});
