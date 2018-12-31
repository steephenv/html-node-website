import * as got from 'got';

let token = '';

beforeAll(done => {
  got('http://localhost:7000/v1/user/login', {
    method: 'POST',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
    json: true,
    body: {
      username: 'bernu@yopmail.com',
      password: '123456',
    },
  })
    .then(res => {
      token = res.body.accessToken;
      return done();
    })
    .catch(err => {
      throw err;
    });
});

describe('Test for list activities  ===> ', () => {
  it('List docs', done => {
    got('http://localhost:7000/v1/central/fetch', {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: `Bearer ${token}`,
      },
      json: true,
      body: {
        collection: 'activity',
        condition: {
          createdAt: { __lte: new Date(), __gte: new Date() },
        },
      },
    })
      .then(() => done())
      .catch(err => {
        throw err;
      });
  }, 15000);
});
