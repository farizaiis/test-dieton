const app = require("../server");
const supertest = require("supertest");

test("POST /v1/exercisesplan/", async () => {
    const token = await supertest(app)
    .post("/v1/users/signin")
    .send({
        email: "admin@gmail.com",
        password: "admindieton"
    })
    
    const exercisesData = await supertest(app)
    .post("/v1/exercises/")
    .set("Authorization", "Bearer " + token.body.token)
    .send({
        name: "Create Data 3",
        calorie: 130,
        logoExercise : "https://res.cloudinary.com/dejongos/image/upload/v1634276426/profilePic/default.png"
    })
    
    const data = {
        "exerciseId" : exercisesData.body.data.id,
        "long" : 20,
        "time" : "Hours",
        "alert" : "09:00",
        "date" : "2021-11-2"
    };

    await supertest(app)
    .post("/v1/exercisesplan/")
    .set("Authorization", "Bearer " + token.body.token)
    .send(data)
    .expect(200)
    .then((res) => {
        expect(res.body.data.exerciseId).toBe(data.exerciseId);
        expect(res.body.data.long).toBe(data.long);
        expect(res.body.data.time).toBe(data.time);
        expect(res.body.data.alert).toBe(data.alert);
        expect(res.body.data.date).toBe(data.date)
    });
});