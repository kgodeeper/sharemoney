require('dotenv').config();
const express = require('express');
const body_parser = require('body-parser');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const path = require('path');
const { rmSync } = require('fs');
const app = express();
const router = express.Router();

const checkPerm = (req,res,next)=>{
     let token = req.params._id;
     try{
          jwt.verify(token,'SECRET_STR');
          next();
     }catch{
          res.redirect('/authenticate');
     }
}

router.get("/css_index_file",(req,res)=>{
     res.sendFile(path.join(__dirname,path.join('css','index.css')));
})
router.get("/css_auth_file",(req,res)=>{
     res.sendFile(path.join(__dirname,path.join('css','auth.css')));
})
router.get("/authenticate",(req,res)=>{
     res.sendFile(path.join(__dirname,path.join('views','auth.html')));
})
router.post("/authenticate",(req,res)=>{
     let password = req.body.password;
     password = crypto.Hash('SHA256').update(password).digest('hex');
     if(password == process.env.PASSWORD){
          let token = jwt.sign({data:'nodata'},'SECRET_STR');
          res.status(200).json({token:token});
     }else{
          res.status(200).json({token:''});
     }
})
router.get('/',checkPerm,(req,res)=>{
     res.sendFile(path.join(__dirname,path.join('views','index.html')));
})

router.get('/trang-chu/:_id',checkPerm,(req,res)=>{
     res.sendFile(path.join(__dirname,path.join('views','index.html')));
})
router.get('/so-dien/:_id',checkPerm,(req,res)=>{
     res.sendFile(path.join(__dirname,path.join('views','electric.html')));
})
router.get('/thong-ke/:_id',checkPerm,(req,res)=>{
     res.sendFile(path.join(__dirname,path.join('views','zoom.html')));
})
router.get('/tk-so-dien',(req,res)=>{
     require('./control/db').getElectVal((err,result)=>{
          if(err) res.status(500).json({err});
          else{
               res.status(200).json({data:result})
          }
     })
})
router.get('/tk-hoa-don',(req,res)=>{
     require('./control/db').getBill((err,result)=>{
          if(err) res.status(500).json({err});
          else{
               res.status(200).json({data:result})
          }
     })
})
router.post('/st-so-dien',(req,res)=>{
     const month = req.body.month;
     require('./control/db').getElectByMonth(month,(err,result)=>{
          if(err) res.status(500).json({err});
          else{
               res.status(200).json({data:result})
          }
     })
})
router.post('/luu-so-dien',(req,res)=>{
     let elect = req.body.elect;
     require('./control/db').saveElect(elect,(err,result)=>{
          if(err) res.status(500).json({err});
          else{
               res.status(200).json({data:result})
          }
     })
}) 
router.post('/them-hoa-don',(req,res)=>{
     let bill = req.body.bill;
     require('./control/db').addBill(bill,(err,result)=>{
          if(err) res.status(500).json({err});
          else{
               res.status(200).json({data:result})
          }
     })
})
router.post('/thanh-toan',(req,res)=>{
     let id = req.body.id;
     console.log(id);
     if(id == ''){
          require('./control/db').payAll((err,result)=>{
               if(err) res.status(500).json({err});
               else{
                    res.status(200).json({data:result})
               }
          })
     }else{
          require('./control/db').payOne(id,(err,result)=>{
               if(err) res.status(500).json({err});
               else{
                    res.status(200).json({data:result})
               }
          })
     }
})

router.post('/huy-thanh-toan',(req,res)=>{
     let id = req.body.id;
     require('./control/db').noPay(id,(err,result)=>{
          if(err) res.status(500).json({err});
          else{
               res.status(200).json({data:result})
          }
     })
})

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended:true}));
app.use(router);

app.listen(process.env.PORT);