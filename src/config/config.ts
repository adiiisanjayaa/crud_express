//use dotenv to use .env file
require('dotenv').config()

export default {
    jwtSecret: process.env.JWT_SECRET||"@QEGTUI",
    port :process.env.PORT||3000
  };