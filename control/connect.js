const mysql = require('mysql');

let con = mysql.createConnection({
     host: '103.97.125.254',
     port: 3306,
     user: 'yxyelqww_admin',
     password: 'khanh1711',
     database: 'yxyelqww_sharemoney'
})

// Keep connect
setInterval(()=>{
     con.query('SELECT version()',(err,res)=>{
     })
},5000);

module.exports = con;

