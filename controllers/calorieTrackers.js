const Joi = require('joi');
const { calorieTracker } = require('../models/calorieTrackers');

module.exports = {
    create = async (req, res) => {
        const dataUser = req.users
        const body = req.body

        try{
            const schema = Joi.object({
                calorieSize: Joi.number().required()
            })

            const check = schema.validate({
                calorieSize: body.calorieSize
            })
            const createCalorieSize = await calorieTracker.create()

        } catch (error) {

        }
    }
}