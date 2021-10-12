const Joi = require('Joi')
const { weightMeasures } = require('../models')

module.exports = {
    postWeight: async(req, res) => {
        const userId = req.body.userId;
        const weight = req.body.weight;
        const height = req.body.height;
        const waistline = req.body.waistline;
        const thigh = req.body.thigh;
        const date = req.body.date;

        try {
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
                message: 'Successfully insert data weight'
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
            const data = await weightMeasures.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            });
            if (!data) {
                return res.status(400).json({
                    status: "failed",
                    massage: "Data not found"
                });
            }
            res.status(200).json({
                status: 'Success',
                message: 'Data retrieved successfully',
                data: data
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
        const userId = req.body.userId;
        const weight = req.body.weight;
        const height = req.body.height;
        const waistline = req.body.waistline;
        const thigh = req.body.thigh;
        const date = req.body.date;

        try {
            const updateWeight = await weightMeasures.update({
                userId,
                weight,
                height,
                waistline,
                thigh,
                date
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
                where: { id },
                attributes: ['userId', 'weight', 'height', 'waistline', 'thigh', 'date']
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