let MongoClient=require('mongodb').MongoClient;
let bcrypt=require('bcryptjs');
let url="mongodb://127.0.0.1:27017/";
let opt={ useNewUrlParser: true };

function checkdata(data,res,num){
  let l;
  if(num==0){
    l={id:data["id"]}; //check for fb id
  }
  if(num==1){
    l={num:data}; //check for wallet number
  }
  if(num==2){
    l={num:data["walletup"]};
  }
  MongoClient.connect(url,opt,(err,db)=>{
    let dbase=db.db("cashout_db");
    dbase.collection("clients").findOne(l,(err,result)=>{
	  db.close();
	  if(result==null){
		  res.send(JSON.stringify({status:"nOK",num:""})); //send if no existence
	  }else{
	     res.send(JSON.stringify({status:"OK",num:result.num})); //send if  fb id exists
	  }
	});
  });
}

function storedata(data,res,a){
	delete data["passup"];
	MongoClient.connect(url,opt,(err,db)=>{
	  let dbase=db.db("cashout_db");
	  dbase.collection("clients").insertOne(data,(err,result)=>{
	    db.close();
		if(err){
		  res.send(JSON.stringify("nOK"));
		}else{
		 if(a==0){
		  res.send(JSON.stringify("OK"));
		 }else{
		   res.send(JSON.stringify({status:"OK",num:data["num"]}));
		 }
		}
	  });
	});

}

function verifiednum(data,res){ //number verification
 MongoClient.connect(url,opt,(err,db)=>{
  let dbase=db.db("cashout_db");
  dbase.collection("clients").update({_id:data["_id"]},{$set:{"verified":"yes"}},(err,results)=>{
    db.close();
	if(err){
	   res.send(JSON.stringify("nOK"));
	}else{
	  if(results.result.nModified!=0){
	    res.send(JSON.stringify("OK"));
	  }else{
	    res.send(JSON.stringify("nOK")); 
	  }
	}
  });
 });

}

function checknumall(number,res){ //fyp num check
  MongoClient.connect(url,opt,(err,db)=>{
    let dbase=db.db("cashout_db");
	dbase.collection("clients").findOne({num:number},(err,result)=>{
	  db.close();
	  if(result==null){
	     res.send(JSON.stringify({status:"nOK"}));
	  }else{
	      if(result.password==undefined){
		    res.send(JSON.stringify({status:"fb"}));
		  }else{
		   res.send(JSON.stringify({status:"OK"}));
		  }
	  }
	});
  });
}

function updatepass(num,pass,res){
 MongoClient.connect(url,opt,(err,db)=>{
    let dbase=db.db("cashout_db");
	dbase.collection("clients").findOne({num:num},(err,result)=>{
	  dbase.collection("clients").update({_id:result["_id"]},{$set:{"password":pass}},(err,results)=>{
	    db.close();
		if(results.result.nModified!=0){
		  res.send(JSON.stringify("OK"));
		}else{
		  res.send(JSON.stringify("nOK"));
		}
	  });
	 });
	});
}

function checkexist(data,res){
 MongoClient.connect(url,opt,(err,db)=>{
  let dbase=db.db("cashout_db");
  dbase.collection("clients").findOne({num:data["walletin"]},(err,result)=>{
    db.close();
	if(result==null){  
	  res.send(JSON.stringify({status:"nOK","verified":""}));
	}else{
	  comparepass(data["passin"],result.password,result.verified,res);
	}
  });
 });
}

function comparepass(p1,p2,verified,res){
  bcrypt.compare(p1,p2,(err,val)=>{
	if(val==true){
	 res.send(JSON.stringify({status:"OK","verified":verified}));
	}else{
	  res.send(JSON.stringify("nOK"));
	}
  });
}

function numverify(num,res){
MongoClient.connect(url,opt,(err,db)=>{
    let dbase=db.db("cashout_db");
	dbase.collection("clients").findOne({num:num},(err,result)=>{
	  dbase.collection("clients").update({_id:result["_id"]},{$set:{"verified":"yes"}},(err,results)=>{
	    db.close();
		if(results.result.nModified!=0){
		  res.send(JSON.stringify("OK"));
		}else{
		  res.send(JSON.stringify("nOK"));
		}
	  });
	 });
	});
}


module.exports={
    checkdata:checkdata,
	storedata:storedata,
	verifiednum:verifiednum,
	checknumall:checknumall,
	updatepass:updatepass,
	checkexist:checkexist,
	numverify:numverify
}
