const { Sequelize } = require('sequelize');

// module.exports = new Sequelize(
//     'telega_bot',
//     'root',
//     'root',
//     {
//         host: '5.188.128.98',
//         port: '6432',
//         dialect: 'postgres'
//     }
// )

module.exports = new Sequelize(
    // 'mydbinstance',postgres 
    'postgres',
    'myuser',
    'mypassword',
    {
        host: 'mydbinstance.clyg0k4wgbkk.eu-west-3.rds.amazonaws.com',
        port: '5432',
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true, // Вимагати SSL
                rejectUnauthorized: false // Відключити перевірку сертифікату для простоти (не рекомендується для продакшн)
            }
        }
    },
)

// module.exports = new Sequelize(
//     // 'mydbinstance',postgres 
//     'mydbinstancenamepgadminhand',
//     'myuser',
//     'mypassword',
//     {
//         host: 'mydbinstance.clyg0k4wgbkk.eu-west-3.rds.amazonaws.com',
//         port: '5432',
//         dialect: 'postgres',
//         dialectOptions: {
//             ssl: {
//                 require: true, // Вимагати SSL
//                 rejectUnauthorized: false // Відключити перевірку сертифікату для простоти (не рекомендується для продакшн)
//             }
//         }
//     },
// )
