const Joi = require('joi')
const { listMeals, foods, mealsPlans } = require('../models')


module.exports = {
    postListMeals : async (req, res) => {
        const body = req.body
        const mealsPlanId = req.query.mealsplan
        const foodId = req.query.food
        try {
            const schema = Joi.object({
                mealsPlanId : Joi.number().required(),
                foodId : Joi.number().required(),
                qty : Joi.number(),
                calAmount : Joi.number()
            })

            const check = schema.validate({
                mealsPlanId : mealsPlanId,
                foodId : foodId,
                qty : body.qty
                }, { abortEarly : false });

            if (check.error) {
                    return res.status(400).json({
                    status : "failed",
                    message : "Bad Request",
                    errors : check.error["details"].map(({ message }) => message )
                })
            }
            
            const cekMealsPlan = await mealsPlans.findOne({
                where : {
                    id : mealsPlanId
                }
            })

            if (!cekMealsPlan) {
                return res.status(400).json({
                    status : "fail",
                    message : "Cant find the mealsplan"
                })
            }
            
            const cekFood = await foods.findOne({
                where: {
                    id : foodId
                }
            })

            if(!cekFood) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cant find the food",
                });
            }

            const dataListMeals = await listMeals.create({
                mealsPlanId : mealsPlanId,
                foodId : foodId,
                qty : body.qty,
                calAmount : cekFood.dataValues.calorie * body.qty
            });

            const getCalAmount = await listMeals.findAll({
                where: {mealsPlanId : mealsPlanId}
            })

            let sumCalAmount = getCalAmount.map(e => {
                return e.dataValues.calAmount
            })

            sumCalAmount.push(body.rating)

            const sum = sumCalAmount.reduce((a,b) => a+b)

            const newTotalCalAmount = await mealsPlans.update({
                totalCalAmount : sum
            }, { where : {id : mealsPlanId}})

            return res.status(200).json({
                        status: "success",
                        message: "Succesfully input new food to the List",
                        data : dataListMeals,
                        // totalAmountNow : newTotalCalAmount
                    });
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
            status: "failed",
            message: "Internal Server Error",
            });
        }
    },

    deleteListMeals : async (req, res) => {
        try {
            const deleteListMeals = await listMeals.destroy({
                where : {
                    id : req.params.id
                }
            });

            if(!deleteListMeals) {
                return res.status(400).json({
                    status : "failed",
                    message : "Data not found"
                });
            }

            return res.status(200).json({
                        status: "success",
                        message: "Deleted Succesfully"
            })
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
            status: "failed",
            message: "Internal Server Error",
            });
        }
    },
}