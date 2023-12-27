const Sequelize=require('sequelize');

   let sequelize= new Sequelize({
        username: `root`,
        password: `Satpreet@13`,
        database: `nursing`,
        host: "localhost",
        dialect: "mysql"
    })
    

module.exports={sequelize};