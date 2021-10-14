const { nutritionFacts } = require('../models')
const Joi = require('joi').extend(require('@joi/date'))

module.exports = {
    postFacts : async (req, res) => {
        const body = req.body
        try {
            const schema = Joi.object({
                poster: Joi.string().required(),
                title: Joi.string().required(),
                creator: Joi.string().required(),
                releaseDate: Joi.date().format('YYYY-M-D').required(),
                content: Joi.string().required(),
            })

            const check = schema.validate({
                poster: req.file ? req.file.path : "poster",
                title: body.title,
                creator: body.creator,
                releaseDate: body.releaseDate,
                content: body.content,
            }, { abortEarly: false})

            if (check.error) {
                return res.status(400).json({
                    status : "failed",
                    message : "Bad Request",
                    errors : check.error["details"].map(({ message }) => message )
                })
            }
            const checkFact = await nutritionFacts.findOne({
                where: { title: body.title, creator: body.creator }
            })
            if (checkFact) {
                return res.status(400).json({
                    status : "failed",
                    message : "Can't post same nutrition fact"
                })
            }
            const addFact = await nutritionFacts.create({
                [ req.file ? "poster" : null ] : req.file ? req.file.path : null,
                title: body.title,
                creator: body.creator,
                releaseDate: body.releaseDate,
                content: body.content,
            })
            return res.status(200).json({
                status: "success",
                message: "Post nutrition fact success",
                data: addFact
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message || "Internal Server Error"
            })
        } 
    },
    getAllFacts : async (req, res) => {

        try {
            const GetFacts = await nutritionFacts.findAll({})
            if (!GetFacts) {
                return res.status(400).json({
                    status: "failed",
                    message: "Data not found"
                })
            }
           
            return res.status(200).json({
                status: "success",
                message: "Get nutrition facts success",
                data: GetFacts
            })

        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message || "Internal Server Error"
            })
        }
    },
    getOneFact: async (req, res) => {
        const id = req.params.id
        try {
            const GetOneFacts = await nutritionFacts.findOne({
                where: { id }
            })
            if (!GetOneFacts) {
                return res.status(400).json({
                    status: "failed",
                    message: "Data not found",
                })
            }
            return res.status(200).json({
                status: "success",
                message: "Get one nutrition fact data success",
                data: GetOneFacts
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message || "Internal Server Error"
            })
        }
    },
    updateFacts : async (req, res) => {
        const body = req.body
        const id = req.params.id
        try {
            const schema = Joi.object({
                poster: Joi.string(),
                title: Joi.string(),
                creator: Joi.string(),
                releaseDate: Joi.date().format('YYYY-M-D'),
                content: Joi.string()
            })
            const check = schema.validate({
                poster: req.file ? req.file.path : "poster",
                title: body.title,
                creator: body.creator,
                releaseDate: body.releaseDate,
                content: body.content,
            }, { abortEarly: false})

            if (check.error) {
                return res.status(400).json({
                    status: "failed",
                    message: "Bad Request"  ,
                    errors : check.error["details"].map(({ message }) => message )          
                })
            }
            const editFact = await nutritionFacts.update(
                {
                    [req.file ? "poster" : null]: req.file ? req.file.path : null,
                    title: body.title,
                    creator: body.creator,
                    releaseDate: body.releaseDate,
                    content: body.content,
                },{
                    where: { id: id }
                })
            if (!editFact) {
                return res.status(400).json({
                    status: "failed",
                    message: "Data not found"
                })
            }
            return res.status(200).json({
                status: "success",
                message: "Update nutrition fact success",
                data: editFact
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message || "Internal Server Error"
            })
        } 
    },
    deleteFacts : async (req, res) => {
        const id = req.params.id
        try {
            const removeFact = await nutritionFacts.destroy({
                where: {
                    id
                }
            })
            if (!removeFact) {
                return res.status(400).json({
                    status: "failed",
                    message: "Data not found"
                })
            }
            return res.status(200).json({
                status: "success",
                message: "Delete nutrition fact success"
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message || "Internal Server Error"
            })
        } 
    }
}
