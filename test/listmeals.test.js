const app = require('../server');
const supertest = require('supertest');

test('POST /v1/listmeals', async () => {
    const token = await supertest(app).post('/v1/users/signin').send({
        email: 'admin@gmail.com',
        password: 'admindieton',
    });

    const dataMealsPlan = await supertest(app)
        .post('/v1/mealsplan/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            mealsTime: 'Breakfast',
            date: '2021-11-10',
        });

    const id = 2;

    const getFood = await supertest(app)
        .get('/v1/foods/' + id)
        .set('Authorization', 'Bearer ' + token.body.token);

    const data = {
        mealsPlanId: dataMealsPlan.body.data.id,
        foodId: 2,
        qty: 1,
    };

    await supertest(app)
        .post('/v1/listmeals')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send(data)
        .expect(200)
        .then((res) => {
            expect(res.body.data.mealsPlanId).toBe(data.mealsPlanId);
            expect(res.body.data.foodId).toBe(data.foodId);
            expect(res.body.data.qty).toBe(data.qty);
            expect(res.body.data.calAmount).toBe(
                getFood.body.data.calorie * data.qty
            );
        });
});

test('GET /v1/listmeals', async () => {
    const token = await supertest(app).post('/v1/users/signin').send({
        email: 'admin@gmail.com',
        password: 'admindieton',
    });

    await supertest(app)
        .get('/v1/listmeals')
        .set('Authorization', 'Bearer ' + token.body.token)
        .expect(200)
        .then((res) => {
            expect(Array.isArray(res.body.data)).toBeTruthy();
        });
});

test('DELETE /v1/listmeals/:id', async () => {
    const token = await supertest(app).post('/v1/users/signin').send({
        email: 'admin@gmail.com',
        password: 'admindieton',
    });

    const dataMealsPlan = await supertest(app)
        .post('/v1/mealsplan/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            mealsTime: 'Lunch',
            date: '2021-11-10',
        });

    const getFood = await supertest(app)
        .get('/v1/foods/' + 2)
        .set('Authorization', 'Bearer ' + token.body.token);

    await supertest(app)
        .post('/v1/listmeals')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            mealsPlanId: dataMealsPlan.body.data.id,
            foodId: getFood.body.data.id,
            qty: 1,
        });

    await supertest(app)
        .delete('/v1/listmeals/' + 1)
        .set('Authorization', 'Bearer ' + token.body.token)
        .expect(200)
        .then((res) => {
            expect(res.body.status).toBe('success');
        });
});

test('PUT /v1/listmeals/:id', async () => {
    const token = await supertest(app).post('/v1/users/signin').send({
        email: 'admin@gmail.com',
        password: 'admindieton',
    });

    const dataMealsPlan = await supertest(app)
        .post('/v1/mealsplan/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            mealsTime: 'Dinner',
            date: '2021-11-10',
        });

    await supertest(app)
        .post('/v1/listmeals')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            mealsPlanId: dataMealsPlan.body.data.id,
            foodId: 1,
            qty: 1,
        });

    await supertest(app)
        .put('/v1/listmeals/' + 2)
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            qty: 1,
        })
        .expect(200)
        .then((res) => {
            expect(res.body.status).toBe('success');
        });
});
