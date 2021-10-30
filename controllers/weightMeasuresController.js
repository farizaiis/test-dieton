const Joi = require('joi').extend(require('@joi/date'))
const { weightMeasures, users } = require('../models')
const moment = require('moment')
const { Op } = require('sequelize')


module.exports = {
    postWeight: async(req, res) => {
        const body = req.body
        try {
            // const today = moment.utc(new Date()).local().format("YYYY-M-D")

            // if (moment.utc(new Date(body.date)).local().format("YYYY-M-D") < today) {
            //     return res.status(400).json({
            //         status: "failed",
            //         message: "Cant Create date already passed"
            //     })
            // }

            // if (moment.utc(new Date(body.date)).local().format("YYYY-M-D") > today) {
            //     return res.status(400).json({
            //         status: "failed",
            //         message: "Cant Create for tomorrow"
            //     })
            // }

            const schema = Joi.object({
                userId: Joi.number(),
                weight: Joi.number().required(),
                waistline: Joi.number().required(),
                thigh: Joi.number().required(),
                date: Joi.date().required().format("YYYY-M-D")
            })

            const cekInput = schema.validate({
                userId: req.users.id,
                weight: body.weight,
                waistline: body.waistline,
                thigh: body.thigh,
                date: body.date
            }, { abortEarly: false })

            if (cekInput.error) {
                return res.status(400).json({
                    status: "failed",
                    message: "Bad Request",
                    errors: cekInput.error["details"].map(({ message }) => message)
                })
            }

            const cekData = await weightMeasures.findOne({
                where: { userId: req.users.id, date: body.date }
            })


            if (cekData) {
                return res.status(400).json({
                    status: "failed",
                    message: "Can't duplicate date"
                })
            }

            const createWnm = await weightMeasures.create({
                userId: req.users.id,
                weight: body.weight,
                waistline: body.waistline,
                thigh: body.thigh,
                date: body.date
            })

            const getUser = await users.findOne({
                where: { id: req.users.id }
            })
            const newProgres = getUser.dataValues.earlyWeight - body.weight

            const heightInMeter = getUser.dataValues.height / 100

            const newBmi = body.weight / (heightInMeter ** 2)

            await users.update({
                progress: newProgres,
                BMI: Math.round(newBmi)
            }, { where: { id: req.users.id } })


            return res.status(200).json({
                status: 'Success',
                message: 'Data create successfully',
                data: createWnm
            })

        } catch (error) {

        }
    },

    getWeight: async(req, res) => {
        try {
            const dates = req.query.date

            if (!dates) {
                const data = await weightMeasures.findAll({
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                    where: { userId: req.users.id }
                });
                return res.status(200).json({
                    status: 'Success',
                    message: 'Data retrieved successfully',
                    data: data
                });
            }

            const allData = await weightMeasures.findOne({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                where: { date: dates, userId: req.users.id }
            });

            if (!allData) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Data not Found '
                });
            }

            return res.status(200).json({
                status: 'Success',
                message: 'Data retrieved successfully',
                data: allData
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                status: 'failed',
                message: 'Internal server error'
            })
        }
    },

    updateWeight: async(req, res) => {
        const weight = req.body.weight;
        const waistline = req.body.waistline;
        const thigh = req.body.thigh;

        try {
            const today = moment.utc(new Date()).local().format("YYYY-M-D")

            if (moment.utc(new Date(req.query.date)).local().format("YYYY-M-D") < today) {
                return res.status(400).json({
                    status: "failed",
                    message: "Cant update date already passed"
                })
            }

            if (moment.utc(new Date(req.query.date)).local().format("YYYY-M-D") > today) {
                return res.status(400).json({
                    status: "failed",
                    message: "Cant update for tomorrow"
                })
            }

            const schema = Joi.object({
                weight: Joi.number().required(),
                waistline: Joi.number().required(),
                thigh: Joi.number().required()
            })

            const cekInput = schema.validate({
                weight: weight,
                waistline: waistline,
                thigh: thigh
            }, { abortEarly: false })

            if (cekInput.error) {
                return res.status(400).json({
                    status: "failed",
                    message: "Bad Request",
                    errors: cekInput.error["details"].map(({ message }) => message)
                })
            }

            const updateWeight = await weightMeasures.update({
                weight: weight,
                waistline: waistline,
                thigh: thigh
            }, {
                where: { userId: req.users.id, date: req.query.date }
            });

            if (!updateWeight) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Failed to update data'
                });
            }

            const getUser = await users.findOne({
                where: { id: req.users.id }
            })
            const newProgres = getUser.dataValues.earlyWeight - req.body.weight

            const heightInMeter = getUser.dataValues.height / 100

            const newBmi = req.body.weight / (heightInMeter ** 2)

            await users.update({
                progress: newProgres,
                BMI: Math.round(newBmi)
            }, { where: { id: req.users.id } })

            return res.status(200).json({
                status: 'Success',
                message: 'Data update successfully',
            });
        } catch (error) {
            res.status(500).json({
                status: 'failed',
                message: 'Internal server error'
            })
        }
    },

    deleteWeight: async(req, res) => {
        const { id } = req.params;
        try {
            await weightMeasures.destroy({ where: { id: id } });
            res.status(200).json({
                status: 'Success',
                message: "Data has been deleted"
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                status: 'failed',
                message: 'Internal server error'
            })
        }
    },

    getProgress: async(req, res) => {
        const month = new Date(req.params.date)
        let firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
        let lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 1);

        try {
            const allData = await weightMeasures.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                where: {
                    date: {
                        [Op.gte]: firstDay,
                        [Op.lt]: lastDay
                    },
                    userId: req.users.id
                }
            });

            if (!allData) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Data not Found '
                });
            }

            return res.status(200).json({
                status: 'Success',
                message: 'Data retrieved successfully',
                data: allData
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                status: 'failed',
                message: 'Internal server error'
            })
        }
    }
}