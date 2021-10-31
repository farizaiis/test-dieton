const Joi = require('joi').extend(require('@joi/date'))
const { listExercises, exercises, exercisesPlans, calorieTrackers } = require('../models')


module.exports = {
    postListExercises : async (req, res) => {
        const body = req.body
        try {
            const schema = Joi.object({
                exercisesPlanId : Joi.number().required(),
                exerciseId : Joi.number().required(),
                long : Joi.number().min(1),
                time : Joi.string(),
                calAmount : Joi.number(),
                alert : Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/)
            })

            const check = schema.validate({
                exercisesPlanId : body.exercisesPlanId,
                exerciseId : body.exerciseId,
                long : body.long,
                time : body.time,
                alert : body.alert
                }, { abortEarly : false });

            if (check.error) {
                    return res.status(400).json({
                    status : "failed",
                    message : "Bad Request",
                    errors : check.error["details"].map(({ message }) => message )
                })
            }
            
            const cekExercisePlan = await exercisesPlans.findOne({
                where : {
                    id : body.exercisesPlanId
                }
            })

            if (!cekExercisePlan) {
                return res.status(400).json({
                    status : "fail",
                    message : "Cant find the exercise plan"
                })
            }

            if(cekExercisePlan.dataValues.status == 1){
                return res.status(400).json({
                    status : "fail",
                    message : "Cant add list exercise when status has done or passed"
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

            const ceklistExercises = await listExercises.findOne({
                where : {exercisesPlanId : body.exercisesPlanId, exerciseId : body.exerciseId, alert : body.alert}
            })

            if (ceklistExercises) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cant add same list exercise at same time",
                });
            }

            if (body.time == 'Hours') {
                const dataListExercises = await listExercises.create({
                    exercisesPlanId : body.exercisesPlanId,
                    exerciseId : body.exerciseId,
                    long : body.long,
                    time : body.time,
                    calAmount : cekExercise.dataValues.calorie * body.long,
                    alert : body.alert
                });

                await exercisesPlans.update({
                    totalCalAmount : (cekExercisePlan.dataValues.totalCalAmount + dataListExercises.dataValues.calAmount)
                }, { where : {id : body.exercisesPlanId}})

                return res.status(200).json({
                    status: "success",
                    message: "Succesfully input new exercises to the List",
                    data : dataListExercises
                });
            }

            if (body.time == 'Minutes') {
                const dataListExercises = await listExercises.create({
                    exercisesPlanId : body.exercisesPlanId,
                    exerciseId : body.exerciseId,
                    long : body.long,
                    time : body.time,
                    calAmount : Math.round((cekExercise.dataValues.calorie / 60) * body.long),
                    alert : body.alert
                });

                await exercisesPlans.update({
                    totalCalAmount : (cekExercisePlan.dataValues.totalCalAmount + dataListExercises.dataValues.calAmount)
                }, { where : {id : body.exercisesPlanId}})

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
            const cekListExercises = await listExercises.findOne({
                where : {
                    id : req.params.id
                }
            })

            if(!cekListExercises) {
                return res.status(400).json({
                    status : "failed",
                    message : "Data not found"
                });
            }

            const cekExercisePlan = await exercisesPlans.findOne({
                where : {
                    id : cekListExercises.dataValues.exercisesPlanId
                }
            })

            if(cekExercisePlan.dataValues.status == 1) {
                return res.status(400).json({
                    status : "failed",
                    message : "Cant delete list where status has done"
                });
            }

            await exercisesPlans.update({
                totalCalAmount : (cekExercisePlan.dataValues.totalCalAmount - cekListExercises.dataValues.calAmount)
            }, { where : {id : cekExercisePlan.dataValues.id}})

            await listExercises.destroy({
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
            const exerciseplan = req.query.exerciseplan

            if (!exerciseplan) {
                const allData = await listExercises.findAll({
                    attributes : { exclude : ["id", "createdAt", "updatedAt"] },
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

            const dataListExercises = await listExercises.findAll({
                where : { exercisesPlanId : exerciseplan},
                attributes : { exclude : ["id", "createdAt", "updatedAt"] },
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

            const cekList = await listExercises.findOne({
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

            const cekExercisePlan = await exercisesPlans.findOne({
                where : {
                    id : cekList.dataValues.exercisesPlanId
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
                    message : "Cant update list where status has done"
                });
            }

            const oldCalAmount = cekList.dataValues.calAmount

            const dataExercise = await exercises.findOne({
                where: {
                    id : cekList.dataValues.exerciseId
                }
            })

            if(req.body.long) {
                if(cekList.dataValues.time == 'Hours'){
                    await listExercises.update(
                        {
                            long : req.body.long,
                            calAmount : dataExercise.dataValues.calorie * req.body.long,
                            alert : req.body.alert
                        }, 
                        {where : {id : req.params.id}}
                    )
                } else if(cekList.dataValues.time == 'Minutes'){
                    await listExercises.update(
                        {
                            long : req.body.long,
                            calAmount : Math.round((dataExercise.dataValues.calorie / 60) * req.body.long),
                            alert : req.body.alert
                        }, 
                        {where : {id : req.params.id}}
                    )
                }

                const getLstExercise = await listExercises.findOne({
                    where : { id : req.params.id }
                })
    
                await exercisesPlans.update({
                    totalCalAmount : (cekExercisePlan.dataValues.totalCalAmount - oldCalAmount + getLstExercise.dataValues.calAmount)
                }, { where : {id : cekExercisePlan.dataValues.id}})
    
                return res.status(200).json({
                            status: "success",
                            message: "Update Succesfully",
                            data : getLstExercise
                })
            }

            if(req.body.long && req.body.time) {
                if(req.body.time == 'Hours'){
                    await listExercises.update(
                        {
                            long : req.body.long,
                            calAmount : dataExercise.dataValues.calorie * req.body.long,
                            alert : req.body.alert
                        }, 
                        {where : {id : req.params.id}}
                    )
                } else if(req.body.time == 'Minutes'){
                    await listExercises.update(
                        {
                            long : req.body.long,
                            calAmount : Math.round((dataExercise.dataValues.calorie / 60) * req.body.long),
                            alert : req.body.alert
                        }, 
                        {where : {id : req.params.id}}
                    )
                }

                const getLstExercise = await listExercises.findOne({
                    where : { id : req.params.id }
                })
    
                await exercisesPlans.update({
                    totalCalAmount : (cekExercisePlan.dataValues.totalCalAmount - oldCalAmount + getLstExercise.dataValues.calAmount)
                }, { where : {id : cekExercisePlan.dataValues.id}})
    
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
            const cekListExercises = await listExercises.findOne({
                where : {
                    id : req.query.id
                }
            })

            const cekExercisesPlans = await exercisesPlans.findOne({
                where : {
                    id : cekListExercises.dataValues.exercisesPlanId
                }
            })

            const cekCalorieTracker = await calorieTrackers.findOne({
                where : {
                    userId : req.users.id,
                    date : cekExercisesPlans.dataValues.date
                }
            })

            if(!cekExercisesPlans || !cekCalorieTracker || !cekListExercises) {
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

            await listExercises.update({
                status : 1
            },
            {where : {
                id : req.query.id
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
                    date : cekExercisesPlans.dataValues.date
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