const Joi = require('joi');
const { calorieTracker } = require('../models/calorieTrackers');

module.exports = {
    create = async (req, res) => {
        const dataUser = req.users
        const body = req.body

        try{
            const schema = Joi.object({
                calorieSize: Joi.number().required(),
                date: Joi.date().format("YYYY-M_D").required()
            })

            const check = schema.validate({
                calorieSize: body.calorieSize,
                date: body.date
            })

            if(check.error) {
                return res.status(400).json({
                    status: "failed",
                    message: "bad request",
                    errors: check.error["details"].map(({ message }) => message )
                })
            };
            
            const createCalorieSize = await calorieTracker.create({
                userId: dataUser.id,
                calorieSize:  body.calorieSize,
                calConsumed: 0,
                remainCalSize: body.calorieSize,
                date: body.date
            })

            return res.status(200).json({
                status: "success",
                message: "calorie tracker created",
                data: createCalorieSize
            })

        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error"
            });
        }
    },

    update = async (req, res) => {

        try {

        } catch (error) {

        }
    },
}