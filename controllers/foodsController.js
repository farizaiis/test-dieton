const { foods } = require('../models')
const Joi = require('joi')
const { Op } = require('sequelize')

module.exports = {
    createFoods : async (req, res) => {
        const body = req.body
        const akg = 2000
        try {
            const schema = Joi.object({
                name : Joi.string().required(),
                calorie : Joi.number().required(),
                unit : Joi.string().required(),
            })

            const check = schema.validate({
                name : body.name,
                calorie : body.calorie,
                unit : body.unit
            })

            if (check.error) {
                return res.status(400).json({
                status : "failed",
                message : "Bad Request",
                errors : check.error["details"].map(({ message }) => message )
                })
            }

            const checkFoods = await foods.findOne({
                where: { name: body.name}
            })

            if (checkFoods) {
                return res.status(400).json({
                    status: "failed",
                    message: "Can't add same foods",
                });

            }
            const addFoods = await foods.create({
                name : body.name,
                calorie : body.calorie,
                rda: Math.round((body.calorie / akg) * 100),
                unit : body.unit
            })
            if (!addFoods) {
                return res.status(400).json({
                    status: "failed",
                    message: "Data not found"
                })
            }
            return res.status(200).json({
                status: "success",
                message: "Successfully add foods data",
                data: addFoods
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message || "Internal Server Error"
            })
        }
    },
    getAllFoods : async (req, res) => {
        try {
            const names = req.query.name ? req.query.name : ""
            const GetFoods = await foods.findAll({ 
                where: {
                    name: {
                        [Op.iLike]: '%' + names + '%'
                    }}
            })

            if (!GetFoods > 0) {
                return res.status(400).json({
                    status: "failed",
                    message: "Data not found"
                })
            }
            return res.status(200).json({
                status: "success",
                message: "Success get foods data",
                data: GetFoods
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message || "Internal Server Error"
            })
        }
    },
    getOneFoods : async (req, res) => {
        const id = req.params.id
        try {
            const GetOneFoods = await foods.findOne({
                where: { id }
            })
            if (!GetOneFoods) {
                return res.status(400).json({
                    status: "failed",
                    message: "Data not found",
                })
            }
            return res.status(200).json({
                status: "success",
                message: "Success get one foods data",
                data: GetOneFoods
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message || "Internal Server Error"
            })
        }
    },
    updateFoods : async (req, res) => {
        const body = req.body
        const id = req.params.id
        const akg = 2000
        try {
            const schema = Joi.object({
                name : Joi.string(),
                calorie : Joi.number(),
                rda: Joi.number(),
                unit : Joi.string(),
            })
            const check = schema.validate({
                name : body.name,
                calorie : body.calorie,
                unit : body.unit
            })
            if (check.error) {
                return res.status(400).json({
                status : "failed",
                message : "Bad Request",
                errors : check.error["details"].map(({ message }) => message )
                })
            }
            const Foods = await foods.update(
                {
                    name : body.name,
                    calorie : body.calorie,
                    rda : Math.round((body.calorie / akg) * 100),
                    unit : body.unit
                },
                {
                    where: { id: id}
                }
            )
            const editFoods = await foods.findByPk(id)
            if (!editFoods) {
                return res.status(400).json({
                    status: "failed",
                    message: "Data not Found"
                })
            }
            return res.status(200).json({
                status: "success",
                message: "Success update foods data",
                data: editFoods
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message || "Internal Server Error"
            })
        }
    },
    deleteFoods : async (req, res) => {
        const id = req.params.id
        try {
            const removeFoods = await foods.destroy({
                where: {
                    id: id
                }
            })
            if (!removeFoods) {
                return res.status(400).json({
                    status: "failed",
                    message: "Data not Found"
                })
            }
            return res.status(200).json({
                status: "success",
                message: "Successfully delete foods data"
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message || "Internal Server Error"
            })
        }
    }
}