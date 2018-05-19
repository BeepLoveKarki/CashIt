let db=require('../models/model');
let misc=require('./misc');
let bcrypt=require('bcryptjs');
let data,num;
      

module.exports.controller=function(app) {

   app.get('/',(req,res)=>{
        res.send("OK");
   });
   
   app.post('/signup_form',(req,res)=>{
	 data=req.body;
	 delete data["conwalletup"];
	 delete data["conpassup"];
	 db.checkdata(data,res,2);
   });
   
   app.get('/insert',(req,res)=>{
     data["num"]=data["walletup"];
	 delete data["walletup"];
	 data["verified"]="no";
	 data["coins"]=0;
	 misc.hashpass(data,res);
   });
   
   app.get('/verified',(req,res)=>{
     db.verifiednum(data,res);
   });
   
   app.post('/signin_form',(req,res)=>{
     db.checkexist(req.body,res);
   });
   
   app.post('/fb_in',(req,res)=>{
	 data=req.body;
	 db.checkdata(data,res,0); //check if fb id already exists
   });
   
   app.post('/checkwallet',(req,res)=>{
     num=Object.keys(req.body)[0].replace(/[\[\]']/g,"");
	 db.checkdata(num,res,1);
   });
   
   app.post('/checkall',(req,res)=>{
    num=Object.keys(req.body)[0].replace(/[\[\]']/g,"");
	db.checknumall(num,res);
   });
   
   app.post('/updatepass',(req,res)=>{
     let pass=Object.keys(req.body)[0];
	 misc.updatepass(num,pass,res);
   });
   
   app.post('/verifynum',(req,res)=>{
	 let num=Math.floor((Math.random()*100000)+10000);
	 console.log(num);
     res.send(JSON.stringify({status:"OK",num:num}));
   });
   
   app.get('/storenow',(req,res)=>{
     data["num"]=num;
	 data["coins"]=0;
	 db.storedata(data,res,0);
   });
   
   app.post('/numin',(req,res)=>{
     db.numverify(Object.keys(req.body)[0],res);
   });

}
