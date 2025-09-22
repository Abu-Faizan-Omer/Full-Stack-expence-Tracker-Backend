const User = require('../models/user');
const Expences = require('../models/expence');
const e = require('express');
const getUserLeaderBoard = async (req, res) => {
    try {
       
        const leaderboard = await User.find({}).sort({ totalExpenses: -1 });  // Sort by total expenses
        return res.status(200).json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getUserLeaderBoard
}