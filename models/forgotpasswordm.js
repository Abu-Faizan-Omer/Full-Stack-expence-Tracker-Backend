const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const { v4: uuidv4 } = require('uuid');
const { forgotpassword } = require('../controllers/resetpassword');

const ForgotPassword = sequelize.define('forgotpassword',{
    id:{
        type:Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    userId:{
        type:Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Reference to the Users table
            key: 'id',
          },
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

})

module.exports =ForgotPassword;