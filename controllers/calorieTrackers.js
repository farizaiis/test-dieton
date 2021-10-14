const Joi = require('joi').extend(require('@joi/date'));
const { calorieTrackers } = require('../models');

module.exports = {
    postCalorie: async (req, res) => {
        const dataUser = req.users
        const body = req.body

        try {
            const schema = Joi.object({
                calorieSize: Joi.number().required(),
                date: Joi.date().format("YYYY-M-D").required()
            })

            const check = schema.validate({
                calorieSize: body.calorieSize,
                date: body.date
            }, { abortEarly: false });

            if (check.error) {
                return res.status(400).json({
                    status: "failed",
                    message: "bad request",
                    errors: check.error["details"].map(({ message }) => message)
                })
            };

            const createCalorieSize = await calorieTrackers.create({
                userId: dataUser.id,
                calorieSize: body.calorieSize,
                calConsumed: 0,
                remainCalSize: body.calorieSize,
                date: body.date
            })

            return res.status(200).json({
                status: "success",
                message: "calorie tracker created",
                data: createCalorieSize
            })

        } catch (error) {
            console.log("🚀 ~ file: calorieTrackers.js ~ line 43 ~ create: ~ error", error)
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error"
            });
        }
    },

    update: async (req, res) => {
        const dataUser = req.users
        const dataUserId = req.query.userId
        const dateData = req.query.date
        const body = req.body

        try {
            const schema = Joi.object({
                calorieSize: Joi.number().required()
            });

            const check = schema.validate({
                calorieSize: body.calorieSize
            }, { abortEarly: false });

            if (check.error) {
                return res.status(400).json({
                    status: "failed",
                    message: "bad request",
                    error: check.error["details"].map(({ message }) => message)
                })
            };


            const dataCalorie = await calorieTrackers.findOne({
                where: {
                    userId: dataUserId,
                    date: dateData
                }
            });

            const updateCalorie = await calorieTrackers.update({
                calorieSize: body.calorieSize,
                remainCalSize: body.calorieSize - dataCalorie.calConsumed
            },
                {
                    where: {
                        userId: dataUserId,
                        date: dateData
                    }
                }
            );

            const dataCalorie2 = await calorieTrackers.findOne({
                where: {
                    userId: dataUserId,
                    date: dateData
                }
            });

            return res.status(200).json({
                status: "success",
                message: "update success",
                dataUpdate: dataCalorie2
            })

        } catch (error) {
            console.log("🚀 ~ file: calorieTrackers.js ~ line 101 ~ update: ~ error", error)
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error"
            });
        };
    },

    delete: async (req, res) => {
        const dataUserId = req.query.userId
        const dateData = req.query.date

        try {
            const deleteDataCalorie = await calorieTrackers.destroy({
                where: {
                    userId: dataUserId,
                    date: dateData
                }
            });

            if (!deleteDataCalorie) {
                return res.status(400).json({
                    status: "failed",
                    message: "data not found"
                })
            };


            return res.status(200).json({
                status: "success",
                message: `Data has been deleted`
            })

        } catch (error) {
            console.log("🚀 ~ file: calorieTrackers.js ~ line 157 ~ delete: ~ error", error)
            return res.status(500).json({
                status: "failed",
                message: "Internal server error"
            })
        }
    },

    getDataById : async (req, res) => {
        const dateData = req.query.date
        const dataUserId = req.users.id

        try {
            const schema = Joi.object({
                date: Joi.date().format("YYYY-M-D").required()
            });

            const check = schema.validate({
                date: dateData
            }, { abortEarly: false });

            if (check.error) {
                return res.status(400).json({
                    status: "failed",
                    message: "bad request",
                    error: check.error["details"].map(({ message }) => message)
                })
            };

            const dataCalorie = await calorieTrackers.findOne({
                where: {
                    userId: dataUserId,
                    date: dateData
                }
            });

            if(!dataCalorie) {
                return res.status(400).json({
                    status: "failed",
                    message: "data not found"
                })
            };

            return res.status(200).json({
                status: "success",
                message: "success retreived data",
                data: dataCalorie
            })

        } catch(error) {
            return res.status(500).json({
                status: "failed",
                message: "Internal server error"
            })
        };
    }
};