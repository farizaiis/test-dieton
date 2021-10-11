// const express = require('express')
// const { Nutrition } = require('../models/nutritionfacts')
// const Joi = require('joi').extend(require('@joi/date'))

// module.exports = {
//     getFacts : async (req, res) => {
//         try {
//             const Facts = await Nutrition.findAll()
//             if(!Facts) {
//                 return res.status(400).json({
//                     status : "failed",
//                     message : "Data not found"
//                 });
//             }
//             return res.status(200).json({
//                 status : "success",
//                 message : "Succesfully retrieved All Fun Fact",
//                 data: Facts,
//             });
//         } catch (error) {
//             return res.status(500).json({
//                 status : "failed",
//                 message : error.message || "Internal Server Error"
//             })
//         }
//     },
//     createFacts : async (req, res) => {
//         const body = req.body
//         try {
//             const schema = joi.object({
//                 poster : Joi.string(),
//                 title : Joi.string(),
//                 linkArticle : Joi.string(),
//                 releaseDate : Joi.date().format("D-M-YYYY"),
//             })
//             const check = schema.validate({
//                 poster : req.file ? req.file.path : "poster",
//                 title : body.title,
//                 linkArticle : body.linkArticle,
//                 releaseDate : body.releaseDate,
//                 }, { abortEarly : false })
//             if (!check) {
//                 return res.status(400).json({
//                     status : "failed",
//                     message : "Bad Request",
//                     errors : check.error["details"].map(({ message }) => message )
//                 })
//             }
//             const Facts = await Nutrition.create(
//                 {
//                     [req.file ? "poster" : null]: req.file ? req.file.path : null,
//                     title : body.title,
//                     linkArticle : body.linkArticle,
//                     releaseDate : body.releaseDate,
//                 }
//             ); 
//             if (!Facts) {
//                 return res.status(400).json({
//                     status: "failed",
//                     message: "Can't add Fun Fact"
//                 })
//             }
//             return res.status(200).json({
//                 status: "success",
//                 message: "Success add Fun Fact"
//             })
//         } catch (error) {
//             return res.status(500).json({
//                 status : "failed",
//                 message : error.message || "Internal Server Error"
//             })
//         }
//     },
//     updateFacts : async (req, res) => {
//         const body = req.body
//         const id = req.params.id
//         try {
//             const schema = Joi.object({
//                 poster : Joi.string(),
//                 title : Joi.string(),
//                 linkArticle : Joi.string(),
//                 releaseDate : Joi.date().format("D-M-YYYY"),
//             })

//             const check = schema.validate({
//                 poster : req.file ? req.file.path : "poster",
//                 title : body.title,
//                 linkArticle : body.linkArticle,
//                 releaseDate : body.releaseDate,
//                 }, { abortEarly : false });

//             if (check.error) {
//                 return res.status(400).json({
//                     status : "failed",
//                     message : "Bad Request",
//                     errors : check.error["details"].map(({ message }) => message )
//                 })
//             }

//             if(body.title) {
//                 const checktitle = await Movies.findOne({where : {title : body.title}})
//                 if(checktitle) {
//                         return res.status(400).json({
//                             status : "failed",
//                             message : "Title of movie cant duplicate"
//                         });
//                 }
//             }
            
//             const FactsUpdate = await Nutrition.update(
//                 {
//                     [req.file ? "poster" : null]: req.file ? req.file.path : null,
//                     title : body.title,
//                     linkArticle : body.linkArticle,
//                     releaseDate : body.releaseDate,
//                 },
//                 { where : { id } }
//             ); 

//             if(!FactsUpdate[0]) {
//                 return res.status(400).json({
//                     status : "failed",
//                     message : "Unable to input data"
//                 });
//             }

//             //ngambil data yang telah di update supaya muncul datanya di postman
//             const data = await Nutrition.findOne({
//                 where : { id }
//             })
            
//             return res.status(200).json({
//                 status : "success",
//                 message : "Succesfully update the Movie",
//                 data : data
//             });
//         } catch (error) {
//             return res.status(500).json({
//                 status : "failed",
//                 message : error.message || "Internal Server Error"
//             })
//         }

//     },
//     deleteFacts : async (req, res) => {
//         const id = req.params.id
//         try {
//             const Facts = await Nutrition.destroy({where : { id }})
//             if(!Facts) {
//                 return res.status(400).json({
//                     status : "failed",
//                     message : "Data not found"
//                 });
//             }
//             return res.status(200).json({
//                 status : "success",
//                 message : "Deleted successfully",
//             });
//         } catch (error) {
//             return res.status(500).json({
//                 status : "failed",
//                 message : error.message || "Internal Server Error"
//             })
//         }
//     }
// }
