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

            if(cekMealsPlan.dataValues.status == 1){
                return res.status(400).json({
                    status : "fail",
                    message : "Cant add list meals when status has done or passed"
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

            const cekListMeals = await listMeals.findOne({
                where : {mealsPlanId : mealsPlanId, foodId : foodId}
            })

            if (cekListMeals) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cant add same list food",
                });
            }

            const dataListMeals = await listMeals.create({
                mealsPlanId : mealsPlanId,
                foodId : foodId,
                qty : body.qty,
                calAmount : cekFood.dataValues.calorie * body.qty
            });

            await mealsPlans.update({
                totalCalAmount : (cekMealsPlan.dataValues.totalCalAmount + dataListMeals.dataValues.calAmount)
            }, { where : {id : mealsPlanId}})

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
            const cekListMeals = await listMeals.findOne({
                where : {
                    id : req.params.id
                }
            })

            if(!cekListMeals) {
                return res.status(400).json({
                    status : "failed",
                    message : "Data not found"
                });
            }

            const cekMealsPlan = await mealsPlans.findOne({
                where : {
                    id : cekListMeals.dataValues.mealsPlanId
                }
            })

            if(cekMealsPlan.dataValues.status == 1) {
                return res.status(400).json({
                    status : "failed",
                    message : "Cant delete list where status has done"
                });
            }

            await mealsPlans.update({
                totalCalAmount : (cekMealsPlan.dataValues.totalCalAmount - cekListMeals.dataValues.calAmount)
            }, { where : {id : cekMealsPlan.dataValues.id}})

            await listMeals.destroy({
                where : {
                    id : req.params.id
                }
            });

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

    getAll : async (req, res) => {
        try {
            const mealsplan = req.query.mealsplan

            if (!mealsplan) {
                const allData = await listMeals.findAll({
                    attributes : { exclude : ["id", "createdAt", "updatedAt"] },
                    include : [{
                    model : foods
                }]
                })
                return res.status(200).json({
                    status: "success",
                    message: "Success get list meals data",
                    data: allData
                })
            }

            const dataListMeals = await listMeals.findAll({
                where : { mealsPlanId : mealsplan},
                attributes : { exclude : ["id", "createdAt", "updatedAt"] },
                include : [{
                    model : foods
                }]
            })

            if (!dataListMeals) {
                return res.status(400).json({
                    status: "failed",
                    message: "Data not found"
                })
            }

            return res.status(200).json({
                status: "success",
                message: "Success get list meals data",
                data: dataListMeals
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error"
            })
        }
    },

    updateQtyMeals : async (req, res) => {
        try {
            const schema = Joi.object({
                qty : Joi.number(),
                calAmount : Joi.number()
            })

            const check = schema.validate({
                qty : req.body.qty
                }, { abortEarly : false });

            if (check.error) {
                    return res.status(400).json({
                    status : "failed",
                    message : "Bad Request",
                    errors : check.error["details"].map(({ message }) => message )
                })
            }

            const cekMeals = await listMeals.findOne({
                where : {
                    id : req.params.id
                }
            })

            const cekMealsPlan = await mealsPlans.findOne({
                where : {
                    id : cekMeals.dataValues.mealsPlanId
                }
            })

            if(!cekMeals) {
                return res.status(400).json({
                    status : "failed",
                    message : "Data not found"
                });
            }

            const cekMealsPlan = await mealsPlans.findOne({
                where : {
                    id : cekMeals.dataValues.mealsPlanId
                }
            })

            if(!cekMealsPlan) {
                return res.status(400).json({
                    status : "failed",
                    message : "Data not found"
                });
            }

            if(cekMealsPlan.dataValues.status == 1) {
                return res.status(400).json({
                    status : "failed",
                    message : "Cant update list where status has done"
                });
            }

            const oldCalAmount = cekMeals.dataValues.calAmount

            const dataFood = await foods.findOne({
                where: {
                    id : cekMeals.dataValues.foodId
                }
            })

            await listMeals.update(
                {
                    qty : req.body.qty,
                    calAmount : dataFood.dataValues.calorie * req.body.qty
                }, 
                {where : {id : req.params.id}}
            )

            const getMeals = await listMeals.findOne({
                where : { id : req.params.id }
            })

            await mealsPlans.update({
                totalCalAmount : (cekMealsPlan.dataValues.totalCalAmount - oldCalAmount + getMeals.dataValues.calAmount)
            }, { where : {id : cekMealsPlan.dataValues.id}})

            return res.status(200).json({
                        status: "success",
                        message: "Update Succesfully",
                        data : getMeals
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