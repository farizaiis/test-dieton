const app = require("../server");
const supertest = require("supertest");

// // test("POST /v1/exercisesplan/", async () => {
// //     const token = await supertest(app)
// //     .post("/v1/users/signin")
// //     .send({
// //         email: "admin@gmail.com",
// //         password: "admindieton"
// //     })
    
// //     const exercisesData = await supertest(app)
// //     .post("/v1/exercises/")
// //     .set("Authorization", "Bearer " + token.body.token)
// //     .send({
// //         name: "Create Data Test 2",
// //         calorie: 130,
// //         logoExercise : "https://res.cloudinary.com/dejongos/image/upload/v1634276426/profilePic/default.png"
// //     })
    
// //     const data = {
// //         "exerciseId" : exercisesData.body.data.id,
// //         "long" : 20,
// //         "time" : "Hours",
// //         "alert" : "08:00",
// //         "date" : "2021-11-03"
// //     };

// //     await supertest(app)
// //     .post("/v1/exercisesplan/")
// //     .set("Authorization", "Bearer " + token.body.token)
// //     .send(data)
// //     .expect(200)
// //     .then((res) => {
// //         expect(res.body.data.exerciseId).toBe(data.exerciseId);
// //         expect(res.body.data.long).toBe(data.long);
// //         expect(res.body.data.time).toBe(data.time);
// //         expect(res.body.data.calAmount).toBe(exercisesData.body.data.calorie * data.long)
// //         expect(res.body.data.date).toBe(data.date)
// //     });
// // });

// test("POST /v1/exercisesplan/", async () => {
//     const token = await supertest(app)
//     .post("/v1/users/signin")
//     .send({
//         email: "admin@gmail.com",
//         password: "admindieton"
//     })
    
//     const exercisesData = await supertest(app)
//     .post("/v1/exercises/")
//     .set("Authorization", "Bearer " + token.body.token)
//     .send({
//         name: "Create Data 3",
//         calorie: 130,
//         logoExercise : "https://res.cloudinary.com/dejongos/image/upload/v1634276426/profilePic/default.png"
//     })
    
//     const data = {
//         "exerciseId" : exercisesData.body.data.id,
//         "long" : 20,
//         "time" : "Minutes",
//         "alert" : "01:00",
//         "date" : "2021-11-05"
//     };

//     await supertest(app)
//     .post("/v1/exercisesplan/")
//     .set("Authorization", "Bearer " + token.body.token)
//     .send(data)
//     .expect(200)
//     .then((res) => {
//         expect(res.body.data.exerciseId).toBe(data.exerciseId);
//         expect(res.body.data.long).toBe(data.long);
//         expect(res.body.data.time).toBe(data.time);
//         expect(res.body.data.calAmount).toBe(Math.round((exercisesData.body.data.calorie / 60) * data.long))
//         expect(res.body.data.date).toBe(data.date)
//     });
// });

test("DELETE /v1/exercisesplan/:id", async () => {
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
        name: "Create Data 9",
        calorie: 130,
        logoExercise : "https://res.cloudinary.com/dejongos/image/upload/v1634276426/profilePic/default.png"
    })
    
    const exercisePlanData = await supertest(app)
    .post("/v1/exercisesplan/")
    .set("Authorization", "Bearer " + token.body.token)
    .send({
        "exerciseId" : exercisesData.body.data.id,
        "long" : 20,
        "time" : "Minutes",
        "alert" : "05:00",
        "date" : "2021-11-06"
    })
    
    console.log(exercisePlanData.body)

    await supertest(app)
    .delete("/v1/exercisesplan/" + exercisePlanData.data.id)
    .set("Authorization", "Bearer " + token.body.token)
    .expect(200)
    .then((res) => {
        expect(res.body.status).toBe('success');
    });
});


