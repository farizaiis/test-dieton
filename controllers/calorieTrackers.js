const { calorieTrackers, users } = require('../models');

module.exports = {
    getDataById : async (req, res) => {
        const dateData = moment(new Date()).local().format("LL");
        const dataUserId = req.users.id;

        try {
            const dataCalorie = await calorieTrackers.findOne({
                where: {
                    userId: dataUserId,
                    date: dateData
                },
                include: [{
                    model: users,
                }]
            });

            if(!dataCalorie) {
                return res.status(400).json({
                    status: "failed",
                    message: "data not found"
                })
            };

            return res.status(200).json({
                status: "success",
                message: "success retreived data",
                data: dataCalorie
            })

        } catch(error) {
            return res.status(500).json({
                status: "failed",
                message: "Internal server error"
            })
        };
    }
};