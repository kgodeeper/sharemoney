const con = require('./connect');

const getElectVal = async (cb)=>{
     await con.query('SELECT * FROM SoDien',(err,res)=>{
          cb(err,res);
     })
}

const getElectByMonth = async (month,cb)=>{
     await con.query(`SELECT * FROM SoDien WHERE month = '${month}'`,
     (err,res)=>{
          cb(err,res);
     })
}

const saveElect = async (elect, cb)=>{
     let sql = `SELECT * FROM SoDien WHERE month = '${elect.month}'`;
     await con.query(sql,async (err,res)=>{
          if(err) cb(err,res);
          else{
               if(res.length > 0){
                    console.log(res.length);
                    sql = `UPDATE SoDien SET val = ${elect.number} WHERE month = ${elect.month}`;
                    await con.query(sql, async (err,res)=>{
                         cb(err,res);
                    })
               }else{
                    sql = `INSERT INTO SoDien VALUES('${elect.month}',${elect.number})`;
                    await con.query(sql, async (err,res)=>{
                         cb(err,res);
                    })
               }
          }
     })
}

const getBill = async (cb)=>{
     await con.query(`SELECT * FROM HoaDon  ORDER BY status ASC`, 
     (err,res)=>{
          cb(err,res);
     })
}

const addBill = async (bill,cb)=>{
     let sql = `INSERT INTO HoaDon(title,quantity,price,person,status) VALUES('${bill.title}',${bill.quantity},${bill.price},${bill.person},0)`;
     if(bill.id == ''){
          await con.query(sql,
          (err,res)=>{
               cb(err,res);
          });
     }else{
          sql = `UPDATE HoaDon SET title='${bill.title}', quantity=${bill.quantity}, price = ${bill.price}, person = ${bill.person} WHERE id = ${bill.id}`;
          await con.query(sql,
               (err,res)=>{
                    cb(err,res);
               });
     }
}

const payAll = async (cb)=>{
     await con.query(`UPDATE HoaDon SET status = 1 WHERE status = 0`,
     (err,res)=>{
          cb(err,res);
     });
}
const payOne = async(id,cb)=>{
     await con.query(`UPDATE HoaDon SET status = 1 WHERE id = ${id}`,
     (err,res)=>{
          cb(err,res);
     });
}
const noPay = async(id,cb)=>{
     console.log(id);
     await con.query(`UPDATE HoaDon SET status = 0 WHERE id = ${id}`,
     (err,res)=>{
          cb(err,res);
     });
}
module.exports = {
     getElectVal,
     getElectByMonth,
     getBill,
     addBill,
     payAll,
     payOne,
     noPay,
     saveElect
}