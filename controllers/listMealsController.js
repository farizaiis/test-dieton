const Joi = require('joi').extend('@joi/date')
const { listMeals } = require('../models')


module.exports = {
    postListMeals : async (req, res) => {
        const body = req.body
        try {
            const schema = Joi.object({
                
            })

            const check = schema.validate({
                userId : req.users.id,
                mealsTime : body.mealsTime,
                date : body.date
                }, { abortEarly : false });

            if (check.error) {
                    return res.status(400).json({
                    status : "failed",
                    message : "Bad Request",
                    errors : check.error["details"].map(({ message }) => message )
                })
            }
            
            const checkuser = await mealsPlans.findOne({
                where: {
                    userId : req.users.id,
                    mealsTime : body.mealsTime,
                    date : body.date
                }
            })

            if(checkuser) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cant post same type MealsPlan at same day",
                });
            }

            const dataMealsPlans = await mealsPlans.create({
                userId : req.users.id,
                mealsTime : body.mealsTime,
                date : body.date
            });

            return res.status(200).json({
                        status: "success",
                        message: "Succesfully input new MealsPlan",
                        data : dataMealsPlans
                    });
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
            status: "failed",
            message: "Internal Server Error",
            });
        }
    },
}