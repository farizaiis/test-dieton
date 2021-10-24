const Joi = require('joi').extend(require('@joi/date'))
const moment = require('moment')
const { exercisesPlans, exercises, calorieTrackers, users } = require('../models')

module.exports = {
    postExercisesPlans : async (req, res) => {
        const body = req.body
        try {
            const schema = Joi.object({
                userId : Joi.number(),
                date : Joi.date().format("YYYY-M-D").required()
            })

            const check = schema.validate({
                userId : req.users.id,
                date : body.date
                }, { abortEarly : false });

            if (check.error) {
                    return res.status(400).json({
                    status : "failed",
                    message : "Bad Request",
                    errors : check.error["details"].map(({ message }) => message )
                })
            }

            const today = moment.utc(new Date()).local().format("LL")

            if(moment.utc(new Date(body.date)).local().format("LL") < today) {
                return res.status(400).json({
                    status : "failed",
                    message : "Cant post date already passed"
                })
            }

            const checkuser = await exercisesPlans.findOne({
                where: {
                    userId : req.users.id,
                    date : body.date
                }
            })

            if(checkuser) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cant post exercise plans at same day",
                });
            }

            await exercisesPlans.create({
                userId : req.users.id,
                mealsTime : body.mealsTime,
                date : body.date
            });

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

            const cekData = await exercisesPlans.findAll({
                where : { userId : req.users.id, date : body.date},
                attributes : { exclude : ["id", "createdAt", "updatedAt"] }
            })

            return res.status(200).json({
                        status: "success",
                        message: "Succesfully input new exercise plans",
                        datauser : cekData
                    });
        } catch (error) {
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
                const getByUserId = await exercisesPlans.findAll({
                    where : { userId : req.users.id },
                    attributes : { exclude : ["id", "createdAt", "updatedAt"] },
                    include : [{
                        model : exercises,
                        as : "listexercises"
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
                    message: "Success get data Exercise Plan",
                    data: getByUserId
                })
            }

            const getByDate = await exercisesPlans.findAll({
                where : { userId : req.users.id, date : dates },
                attributes : { exclude : ["id", "createdAt", "updatedAt"] },
                include : [{
                    model : exercises,
                    as : "listexercises"
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
                message: "Success get data Exercise Plan",
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
            const cekExercisesPlans = await exercisesPlans.findOne({
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

            if(!cekExercisesPlans || !cekCalorieTracker) {
                return res.status(400).json({
                    status : "failed",
                    message : "Data not found"
                })
            }

            if(cekExercisesPlans.dataValues.status == 1){
                return res.status(400).json({
                    status : "failed",
                    message : "the Exercise Plan Already update"
                })
            }

            await exercisesPlans.update({
                status : 1
            },
            {where : {
                userId : req.users.id,
                mealsTime : req.query.type,
                date : req.query.date,
            }}
            );

            const dataExercisesPlans = await exercisesPlans.findOne({
                where : {
                    userId : req.users.id,
                    mealsTime : req.query.type,
                    date : req.query.date,
                }
            })

            const getCalTrack = await calorieTrackers.findOne({
                where : {
                    userId : req.users.id,
                    date : req.query.date
                }
            })

            await calorieTrackers.update(
            {
                calConsumed : getCalTrack.dataValues.calConsumed + dataExercisesPlans.dataValues.totalCalAmount,
                remainCalSize : getCalTrack.dataValues.remainCalSize - dataExercisesPlans.dataValues.totalCalAmount
            },
            {
                where : {
                    userId : req.users.id,
                    date : req.query.date
                }
            })

            return res.status(200).json({
                        status: "success",
                        message: "Succesfully Update Status",
                        data : dataExercisesPlans
                    });
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
            status: "failed",
            message: "Internal Server Error",
            });
        }
    },

    deleteExercisesPlans : async (req, res) => {
        try {
            const deleteExercisesPlans = await exercisesPlans.destroy({
                where : {
                    id : req.params.id
                }
            });

            if(!deleteExercisesPlans) {
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