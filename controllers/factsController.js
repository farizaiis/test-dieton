const { Nutrition } = require('../models/nutritionfacts')
const Joi = require('joi').extend(require('@joi/date'))

module.exports = {
    getAllFacts : async (req, res) => {
       try {
           const Fact = await Nutrition.findAll()
           if (!Fact) {
               return res.status(400).json({
                   status: "failed",
                   message: "Data Not Found"
               })
           }
           return res.status(200).json({
               status: "success",
               message: "Get data success"
           })
       } catch (error) {
           return res.status(500).json({
               status: "failed",
               message: error.message || "Internal Server Error"
           })
       } 
    },
    getOneFact : async (req, res) => {
        try {
            return res.status(200).json({
                status: "success",
                message: "Get data success"
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message || "Internal Server Error"
            })
        } 
     },
     postFacts : async (req, res) => {
        const body = req.body
        try {
            const schema = Joi.object({
                poster: Joi.string().required(),
                title: Joi.string().required(),
                creator: Joi.string().required(),
                releaseDate: Joi.date().required(),
                content: Joi.string().required(),
            })
            const check = Joi.validate({
                poster: body.poster,
                title: body.title,
                creator: body.creator,
                releaseDate: body.releaseDate,
                content: body.content,
            })
            if (check.error) {
                return res.status(400).json({
                    status: "failed",
                    message: ""            
                })
            }
            const addFact = await Nutrition.create()
            return res.status(200).json({
                status: "success",
                message: "Get data success"
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message || "Internal Server Error"
            })
        } 
     },
     updateFacts : async (req, res) => {
        try {
            const schema = Joi.object({
                poster: Joi.string().required(),
                title: Joi.string().required(),
                creator: Joi.string().required(),
                releaseDate: Joi.date().required(),
                content: Joi.string().required(),
            })
            const check = Joi.validate({
                poster: body.poster,
                title: body.title,
                creator: body.creator,
                releaseDate: body.releaseDate,
                content: body.content,
            })
            return res.status(200).json({
                status: "success",
                message: "Get data success"
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
            const removeFact = await Nutrition.destroy({
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
                message: "Get data success"
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: error.message || "Internal Server Error"
            })
        } 
     }
}