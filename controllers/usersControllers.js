const { users, calorieTrackers } = require('../models');
require('dotenv').config();
const Joi = require('joi');
const { generateToken, getUserdata } = require('../helper/jwt');
const { encrypt, comparePass } = require('../helper/bcrypt');


module.exports = {
    signup : async (req, res) => {
        const body = req.body

        try{
            const schema = Joi.object({
                fullName: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().min(6).max(12).required(),
                profilePic: Joi.string()
            })

            const check = schema.validate({
                fullName: body.fullName,
                email: body.email,
                password: body.password,
                profilePic: req.file ? req.file.path : "profilePic"
            }, { abortEarly: false });

            if(check.error) {
                return res.status(400).json({
                    status: "failed",
                    message: "bad request",
                    errors: check.error["details"].map(({ message }) => message )
                });
            }

            const checkEmail = await users.findOne({
                where: {
                    email: body.email
                }
            });

            if(checkEmail) {
                return res.status(400).json({
                    status: "failed",
                    message: "email already use, please use another email"
                })
            };

            const createUser = await users.create({
                fullName: body.fullName,
                email: body.email,
                password: encrypt(body.password),
                [req.file ? "profilePic" : null]: req.file ? req.file.path : null
            });
            
            const payload = {
                role : createUser.dataValues.role,
                email : createUser.dataValues.email,
                id : createUser.dataValues.id
            };
            
            const token = generateToken(payload);
            
            const createCalorieSize = await calorieTrackers.create({
                userId: createUser.dataValues.id,
                calorieSize:  body.calorieSize,
                calConsumed: 0,
                remainCalSize: body.calorieSize,
                date: new Date()
            });

            return res.status(200).json({
                    status: "success",
                    message: "sign up successfully",
                    token: token
                });

        } catch (error) {
            console.log("🚀 ~ file: usersControllers.js ~ line 79 ~ signup: ~ error", error)
            return res.status(500).json({
            status: "failed",
            message: "Internal Server Error",
            });
        }
    },

    signin : async (req, res) => {
        const body = req.body

        try{
            const schema = Joi.object({
                email: Joi.string().required(),
                password: Joi.string().required()
            });

            const check = schema.validate({
                email: body.email,
                password: body.password
        }, { abortEarly: false });

            if(check.error) {
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

            if(!userEmailData) {
                return res.status(400).json({
                    status: "failed",
                    message: "invalid email"
                })
            }

            const checkPass = comparePass(body.password, userEmailData.dataValues.password)

            if(!checkPass) {
                return res.status(400).json({
                    status: "failed",
                    message: "wrong password"
                })
            }

            const payload = {
                role : userEmailData.dataValues.role,
                email : userEmailData.dataValues.email,
                id : userEmailData.dataValues.id
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

        try{
            const dataToken = req.users;
            console.log("🚀 ~ file: usersControllers.js ~ line 157 ~ delete: ~ dataToken", dataToken)

            const userData = await users.findOne({
                where: {
                    id: id
                }
            })

            if(userData.id !== dataToken.id) {
                return res.status(400).json({
                    status: "failed",
                    message: "not authorize"
                })
            }

            const dataUser = await user.destroy({
                where: {
                    id: id
                }
            })

            const deleteDataCalorie = await calorieTrackers.destroy({
                where: {
                    userId: id
                }
            })

            if(!dataUser) {
                res.status(400).json({
                    status: "failed",
                    message: "data not found"
                })
            }

            return res.status(200).json({
                status: "success",
                message: "data has been deleted"
            })
        } catch (error) {
            console.log("🚀 ~ file: usersControllers.js ~ line 189 ~ delete: ~ error", error)
            return res.status(500).json({
                status : "failed",
                message : "Internal Server Error"
            })
        }
    },

    update : async (req, res) => {
        const body = req.body;
        const id = req.params.id;
        
        try{
            const schema = Joi.object({
                fullName: Joi.string(),
                password: Joi.string().min(6).max(12),
                profilePic: Joi.string()
            })

            const check = schema.validate({
                fullName: body.fullName,
                password: body.password,
                profilePic : req.file ? req.file.path : "profilePic"
        }, { abortEarly: false});

            if (check.error) {
                return res.status(400).json({
                    status : "failed",
                    message : "Bad Request",
                    errors : error["details"].map(({ message }) => message )
                })
            };

            const dataUser = await users.findOne({
                where: { 
                    id: id
                }
            })

            if(dataUser.dataValues.fullName == body.fullName) {
                return res.status(400).json({
                    status: "failed",
                    message: "please add another name"
                })
            }

            if(dataUser.dataValues.password == body.password) {
                return res.status(400).json({
                    status: "failed",
                    message: "please add another password"
                }) 
            }

            const updateUser = await users.update({
                fullName: body.fullName,
                password: body.password,
                [req.file ? "profilePic" : null]: req.file ? req.file.path : null
                },
                { where : { id } }
            )

            if(!updateUser) {
                return res.status(400).json({
                    status: "failed",
                    message: "unbale to input the data"
                })
            }

            const userFinalUpdate = await users.findOne({
                where: { id: id }
            })

            return res.status(200).json({
                status: "success",
                message: "update successfully",
                data: userFinalUpdate
            });

        } catch (error) {
            return res.status(500).json({
                status : "failed",
                message : "Internal Server Error"
            })
        }
    },

    getUserById : async (req, res) => {
        const id = req.params.id

        try{
            dataToken = req.users

            const profileUser = await users.findOne({
                where: {
                    id: id
                },
                
            });

            if(profileUser.id !== dataToken.id) {
                return res.status(400).json({
                    status: "failed",
                    message: "not authorize"
                })
            };

            if(!profileUser) {
                return res.status(400).json({
                    status: "failed",
                    message: "data not found"
                })
            };

            return res.status(200).json({
                status: "success",
                message: "successfully retrieved data",
                data: profileUser
            })
        } catch (error) {
            return res.status(500).json({
                status : "failed",
                message : "Internal Server Error"
            })
        }
    }
};

