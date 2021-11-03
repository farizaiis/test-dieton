const { calorieTrackers, users } = require('../models');
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
                }]
            });

            if (!dataCalorie) {
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

        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "Internal server error"
            })
        };
    },

    updateCalorieTracker: async (req, res) => {
        const body = req.body;

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
            });

            const calorieUser = await users.update({
                calorieSize: body.calorieSize
            },
                {
                    where: {
                        id: req.users.id
                    }
            });

            if (!dataCalorieTrack2 || !calorieUser) {
                return res.status(400).json({
                    status: "failed",
                    message: "unable to input the data"
                })
            }
            
            const dataProfileUser = await users.findOne ({
                where: {
                    id: req.users.id
                }
            });

            const dataCalorieUser = await calorieTrackers.findOne({
                where: {
                    userId: req.users.id,
                    date: today
                }
            });

            return res.status(200).json({
                status: "success",
                message: "success update calorie size",
                dataUser: dataProfileUser,
                dataCalorieTrackerUser: dataCalorieUser
            });

        } catch (error) {
            console.log("🚀 ~ file: usersControllers.js ~ line 316 ~ update: ~ error", error)
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error"
            })
        }
    }
};
