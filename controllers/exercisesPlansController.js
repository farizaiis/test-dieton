const Joi = require('joi').extend(require('@joi/date'))
const moment = require('moment');
const { exercisesPlans, exercises, calorieTrackers, users } = require('../models')


module.exports = {
    postListExercises : async (req, res) => {
        const body = req.body
        try {
            const today = moment.utc(new Date()).local().format("YYYY-M-D")

            if(moment.utc(new Date(body.date)).local().format("YYYY-M-D") < today) {
                return res.status(400).json({
                    status : "failed",
                    message : "Cant post date already passed"
                })
            }

            const schema = Joi.object({
                userId : Joi.number(),
                exerciseId : Joi.number().required(),
                long : Joi.number().min(1),
                time : Joi.string(),
                calAmount : Joi.number(),
                alert : Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/),
                date: Joi.date().format("YYYY-M-D")
            })

            const check = schema.validate({
                userId : req.users.id,
                exerciseId : body.exerciseId,
                long : body.long,
                time : body.time,
                alert : body.alert,
                date : body.date
                }, { abortEarly : false });

            if (check.error) {
                    return res.status(400).json({
                    status : "failed",
                    message : "Bad Request",
                    errors : check.error["details"].map(({ message }) => message )
                })
            }

            const cekExercise = await exercises.findOne({
                where: {
                    id : body.exerciseId
                }
            })

            if(!cekExercise) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cant find the exercise",
                });
            }

            const cekExercisesPlans = await exercisesPlans.findOne({
                where : {userId : req.users.id, date: body.date, alert : body.alert}
            })

            if (cekExercisesPlans) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cant add same list exercise at same time",
                });
            }

            if (body.time == 'Hours') {
                const dataListExercises = await exercisesPlans.create({
                    userId : req.users.id,
                    exerciseId : body.exerciseId,
                    long : body.long,
                    time : body.time,
                    calAmount : cekExercise.dataValues.calorie * body.long,
                    alert : body.alert,
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

                return res.status(200).json({
                    status: "success",
                    message: "Succesfully input new exercises to the List",
                    data : dataListExercises
                });
            }

            if (body.time == 'Minutes') {
                const dataListExercises = await exercisesPlans.create({
                    userId : req.users.id,
                    exerciseId : body.exerciseId,
                    long : body.long,
                    time : body.time,
                    calAmount : Math.round((cekExercise.dataValues.calorie / 60) * body.long),
                    alert : body.alert,
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

                return res.status(200).json({
                    status: "success",
                    message: "Succesfully input new exercises to the List",
                    data : dataListExercises
                });
            }
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
            status: "failed",
            message: "Internal Server Error",
            });
        }
    },

    deleteListExercises : async (req, res) => {
        try {

            const cekExercisePlan = await exercisesPlans.findOne({
                where : {
                    id : req.params.id
                }
            })

            if(!cekExercisePlan) {
                return res.status(400).json({
                    status : "failed",
                    message : "Data not found"
                });
            }

            if(cekExercisePlan.dataValues.status == 1) {
                return res.status(400).json({
                    status : "failed",
                    message : "Cant delete list where status has done"
                });
            }

            await exercisesPlans.destroy({
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
            const dates = req.query.date

            if (!dates) {
                const allData = await exercisesPlans.findAll({
                    include : [{
                    model : exercises
                }]
                })
                return res.status(200).json({
                    status: "success",
                    message: "Success get list excercise data",
                    data: allData
                })
            }

            const dataListExercises = await exercisesPlans.findAll({
                where : { date : dates },
                include : [{
                    model : exercises
                }]
            })

            if (!dataListExercises) {
                return res.status(400).json({
                    status: "failed",
                    message: "Data not found"
                })
            }

            return res.status(200).json({
                status: "success",
                message: "Success get list meals data",
                data: dataListExercises
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error"
            })
        }
    },

    updateList : async (req, res) => {
        try {
            const schema = Joi.object({
                long : Joi.number().min(1),
                time : Joi.string(),
                calAmount : Joi.number(),
                alert : Joi.string()
            })

            const check = schema.validate({
                long : req.body.long,
                time : req.body.time,
                alert : req.body.alert
                }, { abortEarly : false });

            if (check.error) {
                    return res.status(400).json({
                    status : "failed",
                    message : "Bad Request",
                    errors : check.error["details"].map(({ message }) => message )
                })
            }

            const cekList = await exercisesPlans.findOne({
                where : {
                    id : req.params.id
                }
            })

            if(!cekList) {
                return res.status(400).json({
                    status : "failed",
                    message : "Data not found"
                });
            }

            if(cekList.dataValues.status == 1) {
                return res.status(400).json({
                    status : "failed",
                    message : "Cant update list where status has done"
                });
            }

            const dataExercise = await exercises.findOne({
                where: {
                    id : cekList.dataValues.exerciseId
                }
            })

            if(req.body.long && req.body.time) {
                if(req.body.time == 'Hours'){
                    await exercisesPlans.update(
                        {
                            long : req.body.long,
                            time : req.body.time,
                            calAmount : dataExercise.dataValues.calorie * req.body.long,
                            alert : req.body.alert
                        }, 
                        {where : {id : req.params.id}}
                    )
                } 
                
                if(req.body.time == 'Minutes'){
                    await exercisesPlans.update(
                        {
                            long : req.body.long,
                            time : req.body.time,
                            calAmount : Math.round((dataExercise.dataValues.calorie / 60) * req.body.long),
                            alert : req.body.alert
                        }, 
                        {where : {id : req.params.id}}
                    )
                }

                const getLstExercise = await exercisesPlans.findOne({
                    where : { id : req.params.id }
                })

                return res.status(200).json({
                            status: "success",
                            message: "Update Succesfully",
                            data : getLstExercise
                })
            }

            if(req.body.long) {
                if(cekList.dataValues.time == 'Hours'){
                    await exercisesPlans.update(
                        {
                            long : req.body.long,
                            calAmount : dataExercise.dataValues.calorie * req.body.long,
                            alert : req.body.alert
                        }, 
                        {where : {id : req.params.id}}
                    )
                } 
                
                if(cekList.dataValues.time == 'Minutes'){
                    await exercisesPlans.update(
                        {
                            long : req.body.long,
                            calAmount : Math.round((dataExercise.dataValues.calorie / 60) * req.body.long),
                            alert : req.body.alert
                        }, 
                        {where : {id : req.params.id}}
                    )
                }

                const getLstExercise = await exercisesPlans.findOne({
                    where : { id : req.params.id }
                })
    
                return res.status(200).json({
                            status: "success",
                            message: "Update Succesfully",
                            data : getLstExercise
                })
            }
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
            status: "failed",
            message: "Internal Server Error",
            });
        }
    },

    updateStatus : async (req, res) => {
        try { 
            const cekListExercises = await exercisesPlans.findOne({
                where : {
                    id : req.params.id
                }
            })

            const cekCalorieTracker = await calorieTrackers.findOne({
                where : {
                    userId : req.users.id,
                    date : cekListExercises.dataValues.date
                }
            })

            if(!cekCalorieTracker || !cekListExercises) {
                return res.status(400).json({
                    status : "failed",
                    message : "Data not found"
                })
            }

            if(cekListExercises.dataValues.status == 1){
                return res.status(400).json({
                    status : "failed",
                    message : "the Exercise Already update"
                })
            }

            await exercisesPlans.update({
                status : 1
            },
            {where : {
                id : req.params.id
            }}
            );

            await calorieTrackers.update(
            {
                calConsumed : cekCalorieTracker.dataValues.calConsumed + cekListExercises.dataValues.calAmount,
                remainCalSize : cekCalorieTracker.dataValues.remainCalSize - cekListExercises.dataValues.calAmount
            },
            {
                where : {
                    userId : req.users.id,
                    date : cekListExercises.dataValues.date
                }
            })

            return res.status(200).json({
                        status: "success",
                        message: "Succesfully Update Status"
                    });
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
            status: "failed",
            message: "Internal Server Error",
            });
        }
    }
}