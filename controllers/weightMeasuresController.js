const Joi = require('joi').extend(require('@joi/date'))
const { weightMeasures } = require('../models')


module.exports = {
    postWeight: async(req, res) => {
        const userId = req.users.id;
        const weight = req.body.weight;
        const height = req.body.height;
        const waistline = req.body.waistline;
        const thigh = req.body.thigh;
        const date = req.body.date;

        try {
            const schema = Joi.object({
                userId: Joi.number(),
                weight: Joi.number().required(),
                height: Joi.number().required(),
                waistline: Joi.number().required(),
                thigh: Joi.number().required(),
                date: Joi.date().format("YYYY-M-D").required()
            })

            const cekInput = schema.validate({
                weight: weight,
                height: height,
                waistline: waistline,
                thigh: thigh,
                date: date,
            }, { abortEarly: false })

            if (cekInput.error) {
                return res.status(400).json({
                    status: "failed",
                    message: "Bad Request",
                    errors: cekInput.error["details"].map(({ message }) => message)
                })
            }

            const check = await weightMeasures.findOne({ where: { userId, date } });

            if (check) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Already added data'
                });
            }

            const data = await weightMeasures.create({
                userId,
                weight,
                height,
                waistline,
                thigh,
                date
            });

            if (!data) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Cannot insert data weight'
                })
            }

            return res.status(200).json({
                status: 'Success',
                message: 'Successfully insert data weight',
                data: data
            })

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                status: 'failed',
                message: 'Internal server error'
            })
        }
    },
    getWeight: async(req, res) => {
        try {
            const dates = req.query.date

            if (!dates) {
                const data = await weightMeasures.findAll({
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                    where: { userId: req.users.id }
                });
                res.status(200).json({
                    status: 'Success',
                    message: 'Data retrieved successfully',
                    data: data
                });
            }

            const allData = await weightMeasures.findOne({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                where: { date: dates, userId: req.users.id }
            });

            if (!allData) {
                return res.status(400).json({
                    status: "failed",
                    massage: "Data not found"
                });
            }

            res.status(200).json({
                status: 'Success',
                message: 'Data retrieved successfully',
                data: allData
            });

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                status: 'failed',
                message: 'Internal server error'
            })
        }
    },
    updateWeight: async(req, res) => {
        const { id } = req.params;
        const weight = req.body.weight;
        const height = req.body.height;
        const waistline = req.body.waistline;
        const thigh = req.body.thigh;

        try {
            const schema = Joi.object({
                weight: Joi.number(),
                height: Joi.number(),
                waistline: Joi.number(),
                thigh: Joi.number()
            })

            const cekInput = schema.validate({
                weight: weight,
                height: height,
                waistline: waistline,
                thigh: thigh
            }, { abortEarly: false })

            if (cekInput.error) {
                return res.status(400).json({
                    status: "failed",
                    message: "Bad Request",
                    errors: cekInput.error["details"].map(({ message }) => message)
                })
            }

            const updateWeight = await weightMeasures.update({
                weight,
                height,
                waistline,
                thigh
            }, {
                where: { id }
            });

            if (!updateWeight) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Failed to update data'
                });
            }

            const response = await weightMeasures.findOne({
                where: { id }
            });

            res.status(200).json({
                status: 'Success',
                message: 'Data update successfully'
            });
        } catch (error) {
            res.status(500).json({
                status: 'failed',
                message: 'Internal server error'
            })
        }
    },
    deleteWeight: async(req, res) => {
        const { id } = req.params;
        try {
            await weightMeasures.destroy({ where: { id: id } });
            res.status(200).json({
                status: 'Success',
                message: "Data has been deleted"
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                status: 'failed',
                message: 'Internal server error'
            })
        }
    }

}