const app = require("../server");
const supertest = require("supertest");

// test("POST /v1/exercises/", async () => {
//     const data = {
//         name : "Test Create 6",
//         calorie : 120,
//         logoExercise : 'https://res.cloudinary.com/dejongos/image/upload/v1635509618/logoExercise/rd5p7zxkak2arpxvtdaq.png'
//     };

//     const token = await supertest(app)
//     .post("/v1/users/signin")
//     .send({
//         email: "admin@gmail.com",
//         password: "admindieton"
//     })

//     await supertest(app)
//     .post("/v1/exercises/")
//     .set("Authorization", "Bearer " + token.body.token)
//     .send(data)
//     .expect(200)
//     .then((res) => {
//         expect(res.body.data.name).toBe(data.name);
//         expect(res.body.data.calorie).toBe(data.calorie);
//         expect(res.body.data.logoExercise).toBe(null);
//     });
// });

test("GET /v1/exercises/", async () => {

    const token = await supertest(app)
    .post("/v1/users/signin")
    .send({
        email: "admin@gmail.com",
        password: "admindieton"
    })

    await supertest(app)
    .get("/v1/exercises/")
    .set("Authorization", "Bearer " + token.body.token)
    .expect(200)
    .then((res) => {
        expect(Array.isArray(res.body.data)).toBeTruthy();
    });
});

// test("GET /v1/exercises/:id", async () => {

//     const token = await supertest(app)
//     .post("/v1/users/signin")
//     .send({
//         email: "admin@gmail.com",
//         password: "admindieton"
//     })

//     const data = {
//         name : "Get Data 10",
//         calorie : 130,
//         logoExercise : 'https://res.cloudinary.com/dejongos/image/upload/v1635509618/logoExercise/rd5p7zxkak2arpxvtdaq.png'
//     }

//     const createData = await supertest(app)
//     .post("/v1/exercises/")
//     .set("Authorization", "Bearer " + token.body.token)
//     .send(data)

//     await supertest(app)
//     .get("/v1/exercises/" + createData.body.data.id)
//     .set("Authorization", "Bearer " + token.body.token)
//     .expect(200)
//     .then((res) => {
//         expect(typeof res.body).toBe('object');
//     });
// });

// test("GET /v1/exercises?name=", async () => {

//     const token = await supertest(app)
//     .post("/v1/users/signin")
//     .send({
//         email: "admin@gmail.com",
//         password: "admindieton"
//     })

//     const name = "p"

//     await supertest(app)
//     .get("/v1/exercises?name=" + name)
//     .set("Authorization", "Bearer " + token.body.token)
//     .expect(200)
//     .then((res) => {
//         expect(Array.isArray(res.body.data)).toBeTruthy();
//     });
// });

// test("PUT /v1/exercises/:id", async () => {

//     const token = await supertest(app)
//     .post("/v1/users/signin")
//     .send({
//         email: "admin@gmail.com",
//         password: "admindieton"
//     })

//     const data = {
//         name : "Create Data 4",
//         calorie : 130,
//         logoExercise : 'https://res.cloudinary.com/dejongos/image/upload/v1635509618/logoExercise/rd5p7zxkak2arpxvtdaq.png'
//     }

//     const createData = await supertest(app)
//     .post("/v1/exercises/")
//     .set("Authorization", "Bearer " + token.body.token)
//     .send(data)

//     const updateData = {
//         name : "Update Data 5",
//         calorie : 130,
//         logoExercise : 'https://res.cloudinary.com/dejongos/image/upload/v1635509618/logoExercise/rd5p7zxkak2arpxvtdaq.png'
//     }

//     await supertest(app)
//     .put("/v1/exercises/" + createData.body.data.id)
//     .set("Authorization", "Bearer " + token.body.token)
//     .send(updateData)
//     .expect(200)
//     .then((res) => {
//         expect(typeof res.body).toBe('object');
//     });
// });

// test("DELETE /v1/exercises/:id", async () => {

//     const token = await supertest(app)
//     .post("/v1/users/signin")
//     .send({
//         email: "admin@gmail.com",
//         password: "admindieton"
//     })

//     const data = {
//         name : "Create Data 4",
//         calorie : 130,
//         logoExercise : 'https://res.cloudinary.com/dejongos/image/upload/v1635509618/logoExercise/rd5p7zxkak2arpxvtdaq.png'
//     }

//     const createData = await supertest(app)
//     .post("/v1/exercises/")
//     .set("Authorization", "Bearer " + token.body.token)
//     .send(data)


//     await supertest(app)
//     .put("/v1/exercises/" + createData.body.data.id)
//     .set("Authorization", "Bearer " + token.body.token)
//     .expect(200)
//     .then((res) => {
//         expect(res.body.status).toBe('success');
//     });
// });