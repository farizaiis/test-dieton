const { foods } = require('../models')
const Joi = require('joi')


module.exports = {
    createFoods : async (req, res) => {
        const body = req.body
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

            if (!check) {
                return res.status(400).json({
                    status: "failed",
                    message: "input uncorrectly",
                    errors: check["details"][0]["message"]
                })
            }
            const checkFoods = await foods.findOne({
                where: { name: body.name}
            })

            if (checkFoods) {
                return res.status(400).json({
                    status: "fail",
                    message: "Can't add same foods",
                });

            }
            const addFoods = await foods.create({
                name : body.name,
                calorie : body.calorie,
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
                message: "Success add foods data",
                data: addFoods
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message || "Internal Server Error"
            })
        }
    },
    getFoods : async (req, res) => {
        try {
            const GetFoods = await foods.findAll()
            if (!GetFoods) {
                return res.status(400).json({
                    status: "failed",
                    message: "Data not found",
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
        const id = req.params.id
        try {
            const editFoods = await foods.update({
                where: { id }
            })
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
                message: "Success delete foods data"
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message || "Internal Server Error"
            })
        }
    },
    searchFoods : async (req, res) => {
        try {
            const { name } = req.query.name;
            const meals = await foods.findAll({
                where: {
                name: {
                    [Op.like]: `%${name}%`
                }
                }
            });
            if (!meals) {
                return res.status(400).json({
                    status: "failed",
                    message: "Data not found"
                })
            }
            return res.status(200).json({
                status: "success",
                message: "Success search foods data",
                data: meals
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message || "Internal Server Error"
            })
        }
    }
}