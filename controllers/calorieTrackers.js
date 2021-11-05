const { calorieTrackers, users, sequelize } = require('../models');
const moment = require('moment');
const Joi = require('joi')

module.exports = {
    getDataById: async (req, res) => {
        const dateData = new Date()
        const dataUserId = req.users.id;

        try {
            const dataCalorie = await calorieTrackers.findOne({
                where: {
                    userId: dataUserId,
                    date: new Date(dateData.getFullYear(), dateData.getMonth(), dateData.getDate())
                },
                include: [{
                    model: users,
                    attributes: {exclude: ["password", "createdAt", "updatedAt"]},
                }],
            });

            if (!dataCalorie) {
                return res.status(400).json({
                    status: "failed",
                    message: "data not found",
                })
            };

            return res.status(200).json({
                status: "success",
                message: "success retreived data",
                data: dataCalorie
            })

        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "Internal server error"
            })
        };
    },

    updateCalorieTracker: async (req, res) => {
        const body = req.body;
        const t = await sequelize.transaction()

        try {
            const schema = Joi.object({
                calorieSize: Joi.number().min(1000).max(2000)
            })

            const check = schema.validate({
                calorieSize: body.calorieSize
            }, { abortEarly: false });

            if (check.error) {
                return res.status(400).json({
                    status: "failed",
                    message: "Bad Request",
                    errors: check.error["details"].map(({ message }) => message)
                })
            };

            const today = new Date()

            const dataCalorieTrack = await calorieTrackers.findOne({
                where: {
                    userId: req.users.id,
                    date: new Date(today.getFullYear(), today.getMonth(), today.getDate())
                }
            })

            const dataCalorieTrack2 = await calorieTrackers.update({
                remainCalSize: body.calorieSize - dataCalorieTrack.calConsumed
            },
                {
                    where: {
                        userId: req.users.id,
                        date: today
                    }
            }, { transaction: t });

            const calorieUser = await users.update({
                calorieSize: body.calorieSize
            },
                {
                    where: {
                        id: req.users.id
                    }
            }, { transaction: t });

            await t.commit()

            if (!dataCalorieTrack2 || !calorieUser) {
                return res.status(400).json({
                    status: "failed",
                    message: "unable to input the data"
                })
            };

            const dataCalorieUser = await calorieTrackers.findOne({
                where: {
                    userId: req.users.id,
                    date: today
                },
                include: [{
                    model: users,
                    attributes: {exclude: ["password", "createdAt", "updatedAt"]},
                }],
            });

            return res.status(200).json({
                status: "success",
                message: "success update calorie size",
                dataCalorieTrackerUser: dataCalorieUser,
            });

        } catch (error) {
            await t.rollback()
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error",
            });
        }
    }
};