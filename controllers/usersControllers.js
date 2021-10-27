const { users, calorieTrackers, weightMeasures } = require('../models');
require('dotenv').config();
const Joi = require('joi');
const moment = require('moment');
const { generateToken } = require('../helper/jwt');
const { encrypt, comparePass } = require('../helper/bcrypt');
const nodemailer = require('nodemailer')


module.exports = {
    signup: async (req, res) => {
        const body = req.body

        try {
            const schema = Joi.object({
                fullName: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().min(6).max(12).required(),
                calorieSize: Joi.number().min(1000).max(2000).required(),
                weight: Joi.number().required(),
                height: Joi.number().required(),
                waistline: Joi.number().required(),
                thigh: Joi.number().required()
            })

            const check = schema.validate({
                fullName: body.fullName,
                email: body.email,
                password: body.password,
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
                [req.file ? "cover" : null]: req.file ? req.file.path : null,
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
                date: moment.utc(new Date()).local().format("LL")
            });

            const createWeightMeasure = await weightMeasures.create({
                userId: createUser.dataValues.id,
                weight: body.weight,
                waistline: body.waistline,
                thigh: body.thigh,
                date: moment.utc(new Date()).local().format("LL")
            })


            const payload = {
                role: createUser.dataValues.role,
                email: createUser.dataValues.email,
                id: createUser.dataValues.id
            };

            const token = generateToken(payload);

            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'dieton281@gmail.com',
                    pass: 'adm1nDIet'
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            const mailOptions = {
                from: 'dieton281@gmail.com',
                to: body.email,
                subject: 'Verified Your Email',
                text: `Please verified your account by click this link, https://localhost:8000/v1/users/verifiedaccount/${payload.id}`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response)
                }
            });

            return res.status(200).json({
                status: "success",
                message: "sign up successfully, and please verified your account first",
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

            if (userEmailData.dataValues.isVerified === false) {
                return res.status(400).json({
                    status: "failed",
                    message: "please verified your email first"
                })
            }

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

    updateUserProfile: async (req, res) => {
        const body = req.body;

        try {
            const schema = Joi.object({
                fullName: Joi.string(),
                password: Joi.string().min(6).max(12),
                profilePic: Joi.string(),
                cover: Joi.string()
            })

            const check = schema.validate({
                fullName: body.fullName,
                password: body.password,
                profilePic: req.file ? req.file.path : "profilePic",
                cover: req.file ? req.file.path : "cover"
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

            if (body.password) {
                const dataUser = await users.findOne({
                    where: {
                        id: req.users.id
                    }
                });

                const checkPass = comparePass(body.password, dataUser.dataValues.password)

                if (checkPass) {
                    return res.status(400).json({
                        status: "failed",
                        message: "please add another password"
                    })
                }

                await users.update({
                    password: encrypt(body.password)
                }, {
                    where: {
                        id: req.users.id
                    }
                })
            };

            const updateUser = await users.update({
                fullName: body.fullName,
                [req.file ? "profilePic" : null]: req.file ? req.file.path : null,
                [req.file ? "cover" : null]: req.file ? req.file.path : null
            },
                {
                    where: {
                        id: req.users.id
                    }
                });

            if (!updateUser) {
                return res.status(400).json({
                    status: "failed",
                    message: "unable to input the data"
                })
            };

            const userFinalUpdate = await users.findOne({
                where: {
                    id: req.users.id
                }
            })

            return res.status(200).json({
                status: "success",
                message: "update successfully",
                data: userFinalUpdate
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

        try {
            const dataToken = req.users

            const profileUser = await users.findOne({
                where: {
                    id: req.users.id
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
    },

    verifiedAccount: async (req, res) => {
        const id = req.params.id

        await users.update({
            isVerified: true
        },
            {
                where: {
                    id: id
                }
            })

        return res.status(200).json({
            status: "success",
            message: "successfully verified, please sign in again"
        })
    },

    forgotPass: async (req, res) => {
        const body = req.body

        try {
            const schema = Joi.object({
                email: Joi.string().required(),
            })

            const check = schema.validate({
                email: body.email
            }, { abortEarly: false });

            if (check.error) {
                return res.status(400).json({
                    status: "failed",
                    message: "bad request",
                    error: check.error["details"].map(({ message }) => message)
                });
            }

            const checkUser = await users.findOne({
                where: {
                    email: body.email
                }
            })

            if (!checkUser) {
                return res.status(400).json({
                    status: "failed",
                    message: "please register first"
                })
            }

            if (checkUser.dataValues.isVerified === false) {
                return res.status(400).json({
                    status: "failed",
                    message: "please verified your account first"
                })
            }

            const resetPass = await users.update({
                password: encrypt("dietOnResetPassword")
            },
                {
                    where: {
                        email: body.email
                    }
                })

            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'dieton281@gmail.com',
                    pass: 'adm1nDIet'
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            const mailOptions = {
                from: 'dieton281@gmail.com',
                to: body.email,
                subject: 'Your Default Password',
                text: "password: dietOnResetPassword"
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response)
                }
            });

            return res.status(200).json({
                status: "success",
                message: "successfully reset password"
            });
        } catch (error) {
            console.log("🚀 ~ file: usersControllers.js ~ line 499 ~ forgotPass:async ~ error", error)
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error",
            });
        }
    }
};
