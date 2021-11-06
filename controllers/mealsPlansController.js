const Joi = require('joi').extend(require('@joi/date'))
const { mealsPlans, foods, calorieTrackers, users, sequelize } = require('../models')

module.exports = {
    postMealsPlans : async (req, res) => {
        const body = req.body
        try {
            const schema = Joi.object({
                userId : Joi.number(),
                mealsTime : Joi.string(),
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

            const todayDate = new Date()
            const today = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate())
            
            const dataDate = new Date(body.date)
            const cekDate = new Date(dataDate.getFullYear(), dataDate.getMonth(), dataDate.getDate())

            if (cekDate < today) {
                return res.status(400).json({
                    status: "failed",
                    message: "Cant Create date already passed"
                })
            }

            const checkuser = await mealsPlans.findOne({
                where: {
                    userId : req.users.id,
                    date : body.date,
                    mealsTime : body.mealsTime
                }
            })

            if(checkuser) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cant post same type of MealsPlan at same day",
                });
            }

            const dataCreate = await mealsPlans.create({
                userId : req.users.id,
                mealsTime : body.mealsTime,
                date : body.date
            });

            if(!dataCreate) {
                return res.status(400).json({
                    status: "fail",
                    message: "Fail Create",
                });
            }

            const cekCalorieTracker = await calorieTrackers.findOne({
                where : {date : body.date, userId : req.users.id}
            })

            const cekCalSize = await users.findOne({
                where : {id : req.users.id}
            })

            if(!cekCalorieTracker) {
                await calorieTrackers.create({
                    userId : req.users.id,
                    calConsumed : 0,
                    remainCalSize : cekCalSize.dataValues.calorieSize,
                    date : body.date
                })
            }

            return res.status(200).json({
                        status: "success",
                        message: "Succesfully input new MealsPlan",
                        data : dataCreate
                    });
            
        } catch (error) {
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
            const dates = req.query.date

            if(!dates) {
                const getByUserId = await mealsPlans.findAll({
                    where : { userId : req.users.id },
                    attributes : { exclude : ["createdAt", "updatedAt"] },
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
                attributes : { exclude : ["createdAt", "updatedAt"] },
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
        const t = await sequelize.transaction();
        try { 
            const cekMealsPlans = await mealsPlans.findOne({
                where : {
                    userId : req.users.id,
                    mealsTime : req.query.type,
                    date : req.query.date
                }
            })

            const cekCalorieTracker = await calorieTrackers.findOne({
                where : {
                    userId : req.users.id,
                    date : req.query.date
                }
            })

            if(!cekMealsPlans || !cekCalorieTracker) {
                return res.status(400).json({
                    status : "failed",
                    message : "Data not found"
                })
            }

            if(cekMealsPlans.dataValues.status == 1){
                return res.status(400).json({
                    status : "failed",
                    message : "the Meals Plan Already update"
                })
            }

            await mealsPlans.update({
                status : 1
            },
            {where : {
                userId : req.users.id,
                mealsTime : req.query.type,
                date : req.query.date,
            }},
            { transaction : t }
            );

            await calorieTrackers.update(
            {
                calConsumed : cekCalorieTracker.dataValues.calConsumed + cekMealsPlans.dataValues.totalCalAmount,
                remainCalSize : cekCalorieTracker.dataValues.remainCalSize - cekMealsPlans.dataValues.totalCalAmount
            },
            {
                where : {
                    userId : req.users.id,
                    date : req.query.date
                }
            },
            { transaction : t })

            await t.commit()

            return res.status(200).json({
                        status: "success",
                        message: "Succesfully Update Status"
                    });
            
        } catch (error) {
            await t.rollback()
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
