let db=require('../models/model');
let misc=require('./misc');
let bcrypt=require('bcryptjs');
let data,num,number;
      

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
	 misc.hashpass(data,res);
   });
   
   app.get('/verified',(req,res)=>{
	 data["num"]=data["walletup"];
	 delete data["walletup"];
	 data["coins"]=0;
	 res.send(JSON.stringify("OK"));
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
   
   app.post('/getdata',(req,res)=>{
	 number=req.body["data"];
     db.getdata(req.body["data"],res);
   });
   
   app.post('/pledge',(req,res)=>{ //////////////////////////////////////
	  //perform pledge task with req["pass"]
      db.pledgedtime(req.body["date"],req.body["number"],res);
   });
   
   app.post('/clearpledge',(req,res)=>{
     db.clearpledge(req.body["num"],res);
   });
   
   app.post('/withdraw',(req,res)=>{
	 db.withdraw(req.body["num"],req.body["pass"],req.body["date"],res);
   });
   
   app.post('/withdrawcheck',(req,res)=>{
     db.withdrawcheck(req.body["num"],req.body["date"],res);
   });
   
   app.post('/withdrawall',(req,res)=>{
     db.withdrawall(req.body["num"],res);
   });

}
