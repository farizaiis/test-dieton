const Joi = require('joi').extend(require('@joi/date'))
const { mealsPlans, listMeals, foods, calorieTrackers } = require('../models')

module.exports = {
    postMealsPlans : async (req, res) => {
        const body = req.body
        try {
            const schema = Joi.object({
                userId : Joi.number(),
                mealsTime : Joi.string().required(),
                date : Joi.date().format("YYYY-M-D").required()
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
            if (error.name === "SequelizeDatabaseError" && error.parent.routine === "enum_in") {
                return res.status(400).json({ status : "failed", message: "Breakfast, Lunch, or Dinner only for meals time" })
            }
            return res.status(500).json({
            status: "failed",
            message: "Internal Server Error",
            });
        }
    },

    getUserPlans : async (req, res) => {
        try {
            const dates = req.query.dates

            if(!dates) {
                const getByUserId = await mealsPlans.findAll({
                    where : { userId : req.users.id },
                    attributes : { exclude : ["id", "createdAt", "updatedAt"] },
                    include : [{
                        model : foods,
                        as : "listmeals"
                }]
                })

                if (!getByUserId) {
                    return res.status(400).json({
                        status: "failed",
                        message: "Data not found"
                    })
                }

                return res.status(200).json({
                    status: "success",
                    message: "Success get data Meals Plan",
                    data: getByUserId
                })
            }

            const getByDate = await mealsPlans.findAll({
                where : { userId : req.users.id, date : dates },
                attributes : { exclude : ["id", "createdAt", "updatedAt"] },
                include : [{
                    model : foods,
                    as : "listmeals"
                }]
            })

            if (!getByDate) {
                return res.status(400).json({
                    status: "failed",
                    message: "Data not found"
                })
            }

            return res.status(200).json({
                status: "success",
                message: "Success get data Meals Plan",
                data: getByDate
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error"
            })
        }
    },

    updateStatus : async (req, res) => {
        try { 
            const updateMealsPlans = await mealsPlans.update({
                status : 1
            },
            {where : {
                id : req.params.id
            }}
            );

            if(!updateMealsPlans) {
                return res.status(400).json({
                    status : "failed",
                    message : "Data not found"
                });
            }

            const dataMealsPlans = await mealsPlans.findOne({
                where : {
                    id : req.params.id
                }
            })

            return res.status(200).json({
                        status: "success",
                        message: "Succesfully Update Status",
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

    deleteMealsPlans : async (req, res) => {
        try {
            const deleteMealsPlans = await mealsPlans.destroy({
                where : {
                    id : req.params.id
                }
            });

            if(!deleteMealsPlans) {
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