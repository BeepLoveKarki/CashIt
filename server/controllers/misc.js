let db=require('../models/model');
let bcrypt=require('bcryptjs');


function hashpass(data,res){
   bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(data["passup"],salt,(err,hash)=>{
      data["password"]=hash;
	  db.storedata(data,res,1); //store for signup
	});
   });
}

function updatepass(num,pass,res){
  bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(pass,salt,(err,hash)=>{
      db.updatepass(num,hash,res);
	});
   });
}

function editdata(data,res){
 if(data["type"]=="pass"){
  bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(data["value"],salt,(err,hash)=>{
      data["value"]=hash;
	  db.editdata(data,res);
	});
   });
 }else{
   db.editdata(data,res);
 }
}

module.exports={
   hashpass:hashpass,
   updatepass:updatepass,
   editdata:editdata
}