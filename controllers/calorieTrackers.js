const { calorieTrackers, users } = require('../models');
const moment = require('moment');
const Joi = require('joi');

module.exports = {
    getDataById: async (req, res) => {
        const dateData = new Date();
        const dataUserId = req.users.id;

        try {
            const dataCalorie = await calorieTrackers.findOne({
                where: {
                    userId: dataUserId,
                    date: new Date(
                        dateData.getFullYear(),
                        dateData.getMonth(),
                        dateData.getDate()
                    ),
                },
                include: [
                    {
                        model: users,
                        attributes: {
                            exclude: ['password', 'createdAt', 'updatedAt'],
                        },
                    },
                ],
            });

            if (!dataCalorie) {
                const calSizeUser = await users.findOne({
                    where: { id: req.users.id },
                });

                const createCalTrack = await calorieTrackers.create({
                    userId: req.users.id,
                    calConsumed: 0,
                    remainCalSize: calSizeUser.dataValues.calorieSize,
                    date: new Date(
                        dateData.getFullYear(),
                        dateData.getMonth(),
                        dateData.getDate()
                    ),
                });

                return res.status(200).json({
                    status: 'success',
                    message: 'success retreived data',
                    data: createCalTrack,
                });
            }

            return res.status(200).json({
                status: 'success',
                message: 'success retreived data',
                data: dataCalorie,
            });
        } catch (error) {
            return res.status(500).json({
                status: 'failed',
                message: 'Internal server error',
            });
        }
    },

    updateCalorieTracker: async (req, res) => {
        const body = req.body;

        try {
            const schema = Joi.object({
                calorieSize: Joi.number().min(1000).max(2000),
            });

            const check = schema.validate(
                {
                    calorieSize: body.calorieSize,
                },
                { abortEarly: false }
            );

            if (check.error) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Bad Request',
                    errors: check.error['details'].map(
                        ({ message }) => message
                    ),
                });
            }

            const today = new Date();

            const dataCalorieTrack = await calorieTrackers.findOne({
                where: {
                    userId: req.users.id,
                    date: new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        today.getDate()
                    ),
                },
            });

            if (!dataCalorieTrack) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'data not found',
                });
            }

            const dataCalorieTrack2 = await calorieTrackers.update(
                {
                    remainCalSize:
                        body.calorieSize - dataCalorieTrack.calConsumed,
                },
                {
                    where: {
                        userId: req.users.id,
                        date: today,
                    },
                }
            );

            if (!dataCalorieTrack2) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'unable to update data calorie',
                });
            }

            const calorieUser = await users.update(
                {
                    calorieSize: body.calorieSize,
                },
                {
                    where: {
                        id: req.users.id,
                    },
                }
            );

            if (!calorieUser) {
                return res.status(400).json({
                    status: 'failed',
                    message:
                        'data calorie tracker has been update, but please update again data calorie user',
                });
            }

            const dataCalorieUser = await calorieTrackers.findOne({
                where: {
                    userId: req.users.id,
                    date: today,
                },
                include: [
                    {
                        model: users,
                        attributes: {
                            exclude: ['password', 'createdAt', 'updatedAt'],
                        },
                    },
                ],
            });

            return res.status(200).json({
                status: 'success',
                message: 'success update calorie size',
                dataCalorieTrackerUser: dataCalorieUser,
            });
        } catch (error) {
            return res.status(500).json({
                status: 'failed',
                message: 'Internal Server Error',
            });
        }
    },
};
