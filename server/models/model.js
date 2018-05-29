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
	data["uid"]="3CA"+(Math.floor(Math.random() * 100000) + 10000).toString();
	data["pledges"]="0";
	data["pledgedate"]="";
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
	});
}

function checkexist(data,res){
 MongoClient.connect(url,opt,(err,db)=>{
  let dbase=db.db("cashout_db");
  dbase.collection("clients").findOne({num:data["walletin"]},(err,result)=>{
    db.close();
	if(err){
	   res.send(JSON.stringify({status:"nOK","verified":""}));
	}else{
	 if(result==null){  
	   res.send(JSON.stringify({status:"nOK","verified":""}));
	 }else{
	  comparepass(data["passin"],result.password,result.verified,res);
	 }
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


function getdata(num,res){
 MongoClient.connect(url,opt,(err,db)=>{
   let dbase=db.db("cashout_db");
   dbase.collection("clients").findOne({num:num},(err,result)=>{
     db.close();
	 res.send(JSON.stringify({name:result["name"],coins:result["coins"],uid:result["uid"],dates:result["pledgedate"]}));
   });
 });
}

function pledgedtime(date,number,res){
   let d=new Date(date);
   MongoClient.connect(url,opt,(err,db)=>{
     let dbase=db.db("cashout_db");
	 dbase.collection("clients").findOne({num:number},(err,result)=>{
		let data=result["pledgedate"]+d.toLocaleString()+",";
	    dbase.collection("clients").update({_id:result["_id"]},{$set:{"pledgedate":data}},(err,results)=>{
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

function clearpledge(num,res){
  MongoClient.connect(url,opt,(err,db)=>{
   let dbase=db.db("cashout_db");
   dbase.collection("clients").findOne({num:num},(err,result)=>{
     dbase.collection("clients").update({_id:result["_id"]},{$set:{"pledgedate":""}},(err,results)=>{
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

function withdraw(num,pass,date,res){
 MongoClient.connect(url,opt,(err,db)=>{
   let dbase=db.db("cashout_db");
   dbase.collection("clients").findOne({num:num},(err,result)=>{
     let dates=result["pledgedate"];
	 dates=dates.slice(0,-1);
	 let lastdate=dates.split(",").pop();
	 let diff=Math.floor((new Date(date).getMilliseconds()-new Date(lastdate).getMilliseconds())/(1000*60*60));
	 if(diff<3){
	   db.close();
	   res.send(JSON.stringify("Wait"));
	 }else{
	    //perform withdraw using pass and use coins
	   dbase.collection("clients").update({_id:result["_id"]},{$set:{"coins":0}},(err,results)=>{
           db.close();
		   if(results.result.nModified!=0){
		    res.send(JSON.stringify("OK"));
		   }else{
		    res.send(JSON.stringify("nOK"));
		   }
	   });
	 }
   });
 });
}




module.exports={
    checkdata:checkdata,
	storedata:storedata,
	checknumall:checknumall,
	updatepass:updatepass,
	checkexist:checkexist,
	getdata:getdata,
	pledgedtime:pledgedtime,
	clearpledge:clearpledge,
	withdraw:withdraw
}
