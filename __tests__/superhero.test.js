const request = require('supertest');

const app = require('../dist/app').default;

const mongoose = require('mongoose');

const Superhero = require('../dist/models/Superhero').default;

// beforeAll(() => {
//   async () => {
//     await Superhero.deleteMany();
//   };
// });

afterAll((done) => {
  async () => {
    await Superhero.deleteMany();
  };
  mongoose.disconnect(done);
});

test('We can create a superhero', () => {
  async () => {
    const result = await request(app)
      .post('/api/create')
      .send({
        govermentName: 'Clark Kent',
        superheroName: 'Superman',
        superpowers: ['Strength', 'Flight'],
        trait: 'Good guy',
        city: 'Metropolis',
        password: 'eba',
      });
    expect(result.status).toBe(200);
  };
});

test('It returns a 500 HTTP Error when we do not feed the right data', () => {
  async () => {
    const result = await request(app)
      .post('/api/create')
      .send({
        govermentName: 'Clark Kent',
        superheroName: 'Superman',
        superpowers: ['Strength', 'Flight'],
        trait: 'Good guy',
        city: 'Metropolis',
      });
    expect(result.status).toBe(500);
  };
});

test('We get JSON Token when we log in with the right credentials', () => {
  async () => {
    const result = await request('app')
      .post('/api/login')
      .send({
        superheroName: 'Superman',
        password: 'eba',
      });
    expect(result.body.token).toBeTruthy();
  };
});

test("We can't create the same superhero twice", () => {
  async () => {
    const data = {
      govermentName: 'Tony Stark',
      superheroName: 'Iron Man',
      superpowers: ['Wealth', 'Badassery'],
      trait: 'Asshole',
      city: 'LA',
      password: 'eba',
    };

    const firstAttempt = await request(app)
      .post('/api/create')
      .send(data);

    const secondAttempt = await request(app)
      .post('/api/create')
      .send(data);

    expect(secondAttempt).toBeTruthy();
    expect(secondAttempt.status).toBe(401);
  };
});
