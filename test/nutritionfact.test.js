const app = require("../server");
const supertest = require("supertest");

test("POST /v1/facts/", async () => {
    const data = {
        poster: 'https://res.cloudinary.com/dejongos/image/upload/v1635425266/poster/x0zom6mmyynwhkcgjapb.jpg',
        title: 'Makanan Diet',
        creator: 'Rayan',
        releaseDate: '2021-10-15T00:00:00.000Z',
        content: 'Makanan sehat untuk diet harus rendah kalori'
    };

    const token = await supertest(app)
    .post("/v1/users/signin")
    .send({
        email: "admin@gmail.com",
        password: "admindieton"
    })

    await supertest(app)
    .post("/v1/facts/")
    .set("Authorization", "Bearer " + token.body.token)
    .send(data)
    .expect(200)
    .then((res) => {
        expect(res.body.data.poster).toBe(data.poster);
        expect(res.body.data.title).toBe(data.title);
        expect(res.body.data.creator).toBe(data.creator);
        expect(res.body.data.releaseDate).toBe(data.releaseDate);
        expect(res.body.data.content).toBe(data.content);
    });
});

test("GET /v1/facts/", async () => {

    const token = await supertest(app)
    .post("/v1/users/signin")
    .send({
        email: "admin@gmail.com",
        password: "admindieton"
    })

    await supertest(app)
    .get("/v1/facts/")
    .set("Authorization", "Bearer " + token.body.token)
    .expect(200)
    .then((res) => {
        expect(Array.isArray(res.body.data)).toBeTruthy();
    });
});

test("GET /v1/facts/:id", async () => {

    const token = await supertest(app)
    .post("/v1/users/signin")
    .send({
        email: "admin@gmail.com",
        password: "admindieton"
    })

    const id = 3

    await supertest(app)
    .get("/v1/facts/" + id)
    .set("Authorization", "Bearer " + token.body.token)
    .expect(200)
    .then((res) => {
        expect(typeof res.body).toBe('object');
    });
});

test("GET /v1/facts?page=", async () => {

    const token = await supertest(app)
    .post("/v1/users/signin")
    .send({
        email: "admin@gmail.com",
        password: "admindieton"
    })

    const page = "1"

    await supertest(app)
    .get("/v1/facts?page=" + page)
    .set("Authorization", "Bearer " + token.body.token)
    .expect(200)
    .then((res) => {
        expect(Array.isArray(res.body.data)).toBeTruthy();
    });
});

test("PUT /v1/facts/:id", async () => {

    const token = await supertest(app)
    .post("/v1/users/signin")
    .send({
        email: "admin@gmail.com",
        password: "admindieton"
    })

    const data = {
        poster: 'https://res.cloudinary.com/dejongos/image/upload/v1635425266/poster/x0zom6mmyynwhkcgjapb.jpg',
        title: 'Makanan Diet',
        creator: 'Rayan',
        releaseDate: '2021-10-15T00:00:00.000Z',
        content: 'Makanan sehat untuk diet harus rendah kalori'
    }

    const createData = await supertest(app)
    .post("/v1/facts/")
    .set("Authorization", "Bearer " + token.body.token)
    .send(data)

    const updateData = {
        poster: 'https://res.cloudinary.com/dejongos/image/upload/v1635425266/poster/x0zom6mmyynwhkcgjapb.jpg',
        title: 'Makanan Diet',
        creator: 'Robert',
        releaseDate: '2021-10-15T00:00:00.000Z',
        content: 'Makanan sehat untuk diet harus rendah kalori'
    }
    await supertest(app)
    .put("/v1/facts/" + createData.body.data.id)
    .set("Authorization", "Bearer " + token.body.token)
    .send(updateData)
    .expect(200)
    .then((res) => {
        expect(res.body.data.poster).toBe(updateData.poster);
        expect(res.body.data.title).toBe(updateData.title);
        expect(res.body.data.creator).toBe(updateData.creator);
        expect(res.body.data.releaseDate).toBe(updateData.releaseDate);
        expect(res.body.data.content).toBe(updateData.content);
    });
});

test("DELETE /v1/facts/:id", async () => {

    const token = await supertest(app)
    .post("/v1/users/signin")
    .send({
        email: "admin@gmail.com",
        password: "admindieton"
    })

    const data = {
        poster: 'https://res.cloudinary.com/dejongos/image/upload/v1635425266/poster/x0zom6mmyynwhkcgjapb.jpg',
        title: 'Makanan Diet',
        creator: 'Rayan',
        releaseDate: '2021-10-15T00:00:00.000Z',
        content: 'Makanan sehat untuk diet harus rendah kalori'
    }

    const createData = await supertest(app)
    .post("/v1/facts/")
    .set("Authorization", "Bearer " + token.body.token)
    .send(data)

    await supertest(app)
    .delete("/v1/facts/" + createData.body.data.id)
    .set("Authorization", "Bearer " + token.body.token)
    .expect(200)
    .then((res) => {
        expect(res.body.status).toBe('success');
    });
});
