const { users, calorieTrackers, weightMeasures } = require('../models');
require('dotenv').config();
const Joi = require('joi');
const moment = require('moment');
const { generateToken } = require('../helper/jwt');
const { encrypt, comparePass } = require('../helper/bcrypt');


module.exports = {
    signup: async (req, res) => {
        const body = req.body

        try {
            const schema = Joi.object({
                fullName: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().min(6).max(12).required(),
                profilePic: Joi.string(),
                calorieSize: Joi.number().required(),
                weight: Joi.number().required(),
                height: Joi.number().required(),
                waistline: Joi.number().required(),
                thigh: Joi.number().required()
            })

            const check = schema.validate({
                fullName: body.fullName,
                email: body.email,
                password: body.password,
                profilePic: req.file ? req.file.path : "profilePic",
                calorieSize: body.calorieSize,
                weight: body.weight,
                height: body.height,
                waistline: body.waistline,
                thigh: body.thigh
            }, { abortEarly: false });

            if (check.error) {
                return res.status(400).json({
                    status: "failed",
                    message: "bad request",
                    errors: check.error["details"].map(({ message }) => message)
                });
            }

            const checkEmail = await users.findOne({
                where: {
                    email: body.email
                }
            });

            if (checkEmail) {
                return res.status(400).json({
                    status: "failed",
                    message: "email already use, please use another email"
                })
            };

            const createUser = await users.create({
                fullName: body.fullName,
                email: body.email,
                password: encrypt(body.password),
                [req.file ? "profilePic" : null]: req.file ? req.file.path : null,
                height: body.height,
                earlyWeight: body.weight,
                calorieSize: body.calorieSize,
                progress: 0,
                BMI: Math.round(body.weight / ((body.height / 100) ** 2))
            });

            const createCalorieSize = await calorieTrackers.create({
                userId: createUser.dataValues.id,
                calConsumed: 0,
                remainCalSize: body.calorieSize,
                date: moment(new Date()).local().format("LL")
            });

            const createWeightMeasure = await weightMeasures.create({
                userId: createUser.dataValues.id,
                weight: body.weight,
                waistline: body.waistline,
                thigh: body.thigh,
                date: moment(new Date()).local().format("LL")
            })


            const payload = {
                role: createUser.dataValues.role,
                email: createUser.dataValues.email,
                id: createUser.dataValues.id
            };

            const token = generateToken(payload);

            return res.status(200).json({
                status: "success",
                message: "sign up successfully",
                token: token,
                dataUser: createUser,
                dataCalorie: createCalorieSize,
                dataWeight: createWeightMeasure
            });

        } catch (error) {
            console.log("🚀 ~ file: usersControllers.js ~ line 79 ~ signup: ~ error", error)
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error",
            });
        }
    },

    signin: async (req, res) => {
        const body = req.body

        try {
            const schema = Joi.object({
                email: Joi.string().required(),
                password: Joi.string().required()
            });

            const check = schema.validate({
                email: body.email,
                password: body.password
            }, { abortEarly: false });

            if (check.error) {
                return res.status(400).json({
                    status: "failed",
                    message: "bad request",
                    errors: check.error["details"].map(({ message }) => message)
                });
            }

            const userEmailData = await users.findOne({
                where: {
                    email: body.email
                }
            })

            if (!userEmailData) {
                return res.status(400).json({
                    status: "failed",
                    message: "invalid email"
                })
            }

            const checkPass = comparePass(body.password, userEmailData.dataValues.password)

            if (!checkPass) {
                return res.status(400).json({
                    status: "failed",
                    message: "wrong password"
                })
            }

            const payload = {
                role: userEmailData.dataValues.role,
                email: userEmailData.dataValues.email,
                id: userEmailData.dataValues.id
            }

            const token = generateToken(payload)

            return res.status(200).json({
                status: "success",
                message: "sign in successfully",
                token: token
            })

        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "internal server error"
            })
        }
    },

    delete: async (req, res) => {
        const id = req.params.id

        try {
            const dataToken = req.users;
            console.log("🚀 ~ file: usersControllers.js ~ line 157 ~ delete: ~ dataToken", dataToken)

            const userData = await users.findOne({
                where: {
                    id: id
                }
            })

            if (!userData) {
                return res.status(400).json({
                    status: "failed",
                    message: "data not found"
                })
            };

            if (userData.id !== dataToken.id) {
                return res.status(401).json({
                    status: "failed",
                    message: "not authorize"
                })
            }

            const dataUser = await users.destroy({
                where: {
                    id: id
                }
            })

            return res.status(200).json({
                status: "success",
                message: "data has been deleted"
            })
        } catch (error) {
            console.log("🚀 ~ file: usersControllers.js ~ line 189 ~ delete: ~ error", error)
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error"
            })
        }
    },

    update: async (req, res) => {
        const body = req.body;

        try {
            const schema = Joi.object({
                fullName: Joi.string(),
                password: Joi.string().min(6).max(12),
                profilePic: Joi.string(),
                calorieSize: Joi.number()
            })

            const check = schema.validate({
                fullName: body.fullName,
                password: body.password,
                profilePic: req.file ? req.file.path : "profilePic",
                calorieSize: body.calorieSize
            }, { abortEarly: false });

            if (check.error) {
                return res.status(400).json({
                    status: "failed",
                    message: "Bad Request",
                    errors: error["details"].map(({ message }) => message)
                })
            };

            const dataUser = await users.findOne({
                where: {
                    id: req.users.id
                }
            })

            if (!dataUser) {
                return res.status(400).json({
                    status: " failed",
                    message: "data not found"
                })
            }

            const today = moment(new Date()).local()

            if (body.calorieSize) {
                const dataCalorieTrack = await calorieTrackers.findOne({
                    where: {
                        userId: req.users.id,
                        date: today
                    }
                })

                await calorieTrackers.update(
                    { remainCalSize: body.calorieSize - dataCalorieTrack.dataValues.calConsumed },
                    {
                        where: {
                            userId: req.users.id,
                            date: today
                        }
                    }
                );

                const calorieUser = await users.update({
                    calorieSize: body.calorieSize
                },
                    {
                        where: {
                            id: req.users.id
                        }
                    }
                )

                return res.status(200).json({
                    status: "success",
                    message: "success update calorie size"
                })
            };

            const checkPass = comparePass(body.password, dataUser.dataValues.password)

            if (checkPass) {
                return res.status(400).json({
                    status: "failed",
                    message: "please add another password"
                })
            }

            const updateUser = await users.update({
                fullName: body.fullName,
                password: body.password,
                [req.file ? "profilePic" : null]: req.file ? req.file.path : null,
                calorieSize: body.calorieSize
            },
                { where: {id: req.users.id} }
            )


            if (!updateUser) {
                return res.status(400).json({
                    status: "failed",
                    message: "unable to input the data"
                })
            }

            // const userFinalUpdate = await users.findOne({
            //     where: { id: id }
            // })

            return res.status(200).json({
                status: "success",
                message: "update successfully",
            });

        } catch (error) {
            console.log("🚀 ~ file: usersControllers.js ~ line 316 ~ update: ~ error", error)
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error"
            })
        }
    },

    getUserById: async (req, res) => {
        const id = req.params.id

        try {
            const dataToken = req.users

            const profileUser = await users.findOne({
                where: {
                    id: id
                },

            });

            if (!profileUser) {
                return res.status(400).json({
                    status: "failed",
                    message: "data not found"
                })
            };

            if (profileUser.id !== dataToken.id) {
                return res.status(400).json({
                    status: "failed",
                    message: "not authorize"
                })
            };

            return res.status(200).json({
                status: "success",
                message: "successfully retrieved data",
                data: profileUser
            })
        } catch (error) {
            console.log("🚀 ~ file: usersControllers.js ~ line 326 ~ getUserById: ~ error", error)
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error"
            })
        }
    },

    getAllUser: async (req, res) => {
        try {
            const getAll = await users.findAll()

            return res.status(200).json({
                status: "success",
                message: "success retrieved data",
                data: getAll
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error"
            })
        }
    }
};