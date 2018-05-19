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

module.exports={
   hashpass:hashpass,
   updatepass:updatepass
}