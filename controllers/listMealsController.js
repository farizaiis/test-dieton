const Joi = require('joi')
const { listMeals, foods, mealsPlans } = require('../models')


module.exports = {
    postListMeals : async (req, res) => {
        const body = req.body
        const { mealsplan, food } = req.query
        try {
            const schema = Joi.object({
                mealsPlanId : Joi.number().required(),
                foodId : Joi.number().required(),
                qty : Joi.number(),
                calAmount : Joi.number()
            })

            const check = schema.validate({
                mealsPlanId : mealsplan,
                foodId : food,
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
                    id : mealsplan
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
                    id : food
                }
            })

            if(!cekFood) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cant find the food",
                });
            }

            const dataListMeals = await listMeals.create({
                mealsPlanId : mealsplan,
                foodId : food,
                qty : body.qty,
                calAmount : cekFood.dataValues.calorie * body.qty
            });

            return res.status(200).json({
                        status: "success",
                        message: "Succesfully input new food to the List",
                        data : dataListMeals
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