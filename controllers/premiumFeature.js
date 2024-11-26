const User = require('../models/user');
const Expences = require('../models/expence');
const sequelize = require('../utils/database');
const e = require('express');
const getUserLeaderBoard = async (req, res) => {
    try {
        const leaderboard = await User.findAll({
            // attributes: ['id', 'name', [sequelize.fn('SUM', sequelize.col('expence_trackers.expence')), 'total_cost']],
            // include: [
            //     {
            //         model: Expences,
            //         attributes: [],
            //     },
            // ],
            //group: ['User.id'],
            
            order: [['totalExpenses', 'DESC']],
        });
        res.status(200).json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    getUserLeaderBoard
}