const { exercises } = require('../models')
const Joi = require('joi')
const { Op } = require('sequelize')

module.exports = {
    createExercises : async (req, res) => {
        const body = req.body
        try {
            const schema = Joi.object({
                name : Joi.string().required(),
                calorie : Joi.number().required(),
                logoExercise : Joi.string().required(),
            })

            const check = schema.validate({
                name : body.name,
                calorie : body.calorie,
                logoExercise : req.file ? req.file.path : "logoExercise"
            })

            if (check.error) {
                return res.status(400).json({
                status : "failed",
                message : "Bad Request",
                errors : check.error["details"].map(({ message }) => message )
                })
            }

            const checkExercises = await exercises.findOne({
                where: { name: body.name}
            })

            if (checkExercises) {
                return res.status(400).json({
                    status: "failed",
                    message: "Can't add same exercises",
                });
            }
            const addExercises = await exercises.create({
                name : body.name,
                calorie : body.calorie,
                [req.file ? "logoExercise" : null]: req.file ? req.file.path : null
            })
            if (!addExercises) {
                return res.status(400).json({
                    status: "failed",
                    message: "Data not found"
                })
            }
            return res.status(200).json({
                status: "success",
                message: "Successfully add exercises data",
                data: addExercises
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message || "Internal Server Error"
            })
        }
    },

    getAllExercises : async (req, res) => {
        try {
            const names = req.query.name ? req.query.name : ""
            const getExcercises = await exercises.findAll({ 
                where: {
                    name: {
                        [Op.iLike]: '%' + names + '%'
                    }}
            })

            if (!getExcercises > 0) {
                return res.status(400).json({
                    status: "failed",
                    message: "Data not found"
                })
            }
            return res.status(200).json({
                status: "success",
                message: "Success get exercises data",
                data: getExcercises
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message || "Internal Server Error"
            })
        }
    },

    getOneExercises : async (req, res) => {
        const id = req.params.id
        try {
            const getExcercises = await exercises.findOne({
                where: { id }
            })
            if (!getExcercises) {
                return res.status(400).json({
                    status: "failed",
                    message: "Data not found",
                })
            }
            return res.status(200).json({
                status: "success",
                message: "Success get one exercises data",
                data: getExcercises
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message || "Internal Server Error"
            })
        }
    },

    updateExercises : async (req, res) => {
        const body = req.body
        const id = req.params.id
        try {
            const schema = Joi.object({
                name : Joi.string(),
                calorie : Joi.number(),
                logoExercise : Joi.string(),
            })
            const check = schema.validate({
                name : body.name,
                calorie : body.calorie,
                logoExercise : req.file ? req.file.path : "logoExercise"
            })
            if (check.error) {
                return res.status(400).json({
                status : "failed",
                message : "Bad Request",
                errors : check.error["details"].map(({ message }) => message )
                })
            }

            if(body.name) {
                const cekName = await exercises.findOne({
                    where : { name : body.name}
                })

                if(cekName) {
                    return res.status(400).json({
                        status: "failed",
                        message: "Can't update same name exercises",
                    });
                }
            }

            const exercises = await exercises.update(
                {
                    name : body.name,
                    calorie : body.calorie,
                    [req.file ? "logoExercise" : null]: req.file ? req.file.path : null
                },
                {
                    where: { id: id}
                }
            )

            const editedExercise = await exercises.findByPk(id)
            if (!editedExercise) {
                return res.status(400).json({
                    status: "failed",
                    message: "Data not Found"
                })
            }

            return res.status(200).json({
                status: "success",
                message: "Success update exercises data",
                data: editedExercise
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message || "Internal Server Error"
            })
        }
    },

    deleteExercises : async (req, res) => {
        const id = req.params.id
        try {
            const removeExercises = await exercises.destroy({
                where: {
                    id: id
                }
            })

            if (!removeExercises) {
                return res.status(400).json({
                    status: "failed",
                    message: "Data not Found"
                })
            }

            return res.status(200).json({
                status: "success",
                message: "Successfully delete exercises data"
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message || "Internal Server Error"
            })
        }
    }
}
