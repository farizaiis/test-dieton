const app = require("../server");
const supertest = require("supertest");

test("POST /v1/mealsplan/", async () => {
    const token = await supertest(app)
    .post("/v1/users/signin")
    .send({
        email: "admin@gmail.com",
        password: "admindieton"
    })
    
    const data = {
        "mealsTime" : "Lunch",
        "date" : "2021-11-08"
    };

    await supertest(app)
    .post("/v1/mealsplan/")
    .set("Authorization", "Bearer " + token.body.token)
    .send(data)
    .expect(200)
    .then((res) => {
        expect(res.body.data.mealsTime).toBe(data.mealsTime);
        expect(res.body.data.date).toBe(data.date)
    });
});

test("GET /v1/mealsplan/", async () => {
    const token = await supertest(app)
    .post("/v1/users/signin")
    .send({
        email: "admin@gmail.com",
        password: "admindieton"
    })
    
    const data = {
        "mealsTime" : "Dinner",
        "date" : "2021-11-10"
    };

    await supertest(app)
    .post("/v1/mealsplan/")
    .set("Authorization", "Bearer " + token.body.token)
    .send(data)

    await supertest(app)
    .get("/v1/mealsplan/")
    .set("Authorization", "Bearer " + token.body.token)
    .expect(200)
    .then((res) => {
        expect(Array.isArray(res.body.data)).toBeTruthy();
    });
});

test("GET /v1/mealsplan?date=", async () => {
    const token = await supertest(app)
    .post("/v1/users/signin")
    .send({
        email: "admin@gmail.com",
        password: "admindieton"
    })
    
    const data = {
        "mealsTime" : "Dinner",
        "date" : "2021-11-14"
    };

    const create = await supertest(app)
    .post("/v1/mealsplan/")
    .set("Authorization", "Bearer " + token.body.token)
    .send(data)

    await supertest(app)
    .get("/v1/mealsplan?date=" + create.body.data.date)
    .set("Authorization", "Bearer " + token.body.token)
    .expect(200)
    .then((res) => {
        expect(Array.isArray(res.body.data)).toBeTruthy();
    });
});

test("PUT /v1/mealsplan/status", async () => {
    const token = await supertest(app)
    .post("/v1/users/signin")
    .send({
        email: "admin@gmail.com",
        password: "admindieton"
    })
    
    const data = {
        "mealsTime" : "Lunch",
        "date" : "2021-11-14"
    };

    const create = await supertest(app)
    .post("/v1/mealsplan/")
    .set("Authorization", "Bearer " + token.body.token)
    .send(data)

    await supertest(app)
    .put("/v1/mealsplan/status?type=" + create.body.data.mealsTime + "&date=" + create.body.data.date)
    .set("Authorization", "Bearer " + token.body.token)
    .expect(200)
    .then((res) => {
        expect(res.body.status).toBe('success');
    });
});

test("DELETE /v1/mealsplan/:id", async () => {
    const token = await supertest(app)
    .post("/v1/users/signin")
    .send({
        email: "admin@gmail.com",
        password: "admindieton"
    })
    
    const data = {
        "mealsTime" : "Lunch",
        "date" : "2021-11-15"
    };

    const create = await supertest(app)
    .post("/v1/mealsplan/")
    .set("Authorization", "Bearer " + token.body.token)
    .send(data)

    await supertest(app)
    .delete("/v1/mealsplan/" + create.body.data.id)
    .set("Authorization", "Bearer " + token.body.token)
    .expect(200)
    .then((res) => {
        expect(res.body.status).toBe('success');
    });
});