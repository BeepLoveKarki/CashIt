let MongoClient=require('mongodb').MongoClient;
let bcrypt=require('bcryptjs');
let url="mongodb://127.0.0.1:27017/";
let opt={ useNewUrlParser: true };
const { SMSMessage, SMSMessageConfig } = require("hubtel-mx");
require('dotenv').load();


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
    let dbase=db.db("cashcow_db");
    dbase.collection("clients").findOne(l,(err,result)=>{
	  db.close();
	  if(result==null){
		  res.send(JSON.stringify({status:"nOK",num:""})); //send if no existence
	  }else{
	     res.send(JSON.stringify({status:"OK",num:result.num})); //send if exists
	  }
	});
  });
}

function storedata(data,res,a){
	delete data["passup"];
	data["uid"]="3CU"+(Math.floor(Math.random() * 100000) + 10000).toString();
	data["pledgedate"]="";
	data["withdrawdate"]="";
	data["pledge"]=false;
	data["count"]=0;
	MongoClient.connect(url,opt,(err,db)=>{
	  let dbase=db.db("cashcow_db");
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
    let dbase=db.db("cashcow_db");
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
    let dbase=db.db("cashcow_db");
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
  let dbase=db.db("cashcow_db");
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
   let dbase=db.db("cashcow_db");
   dbase.collection("clients").findOne({num:num},(err,result)=>{
     db.close();
	 res.send(JSON.stringify({name:result["name"],coins:result["coins"],uid:result["uid"],dates:result["pledgedate"],wdates:result["withdrawdate"]}));
   });
 });
}

function pledgedtime(date,number,res){
   let d=new Date(date);
   let e=d.getFullYear()+'-'+(d.getMonth()+1)+" ptimes";
   MongoClient.connect(url,opt,(err,db)=>{
  let dbase=db.db("cashcow_db");
	 dbase.collection("clients").findOne({num:number},(err,result)=>{
		let newval=parseInt(result[e])+1;
	    dbase.collection("clients").update({_id:result["_id"]},{$set:{[e]:newval,"pledge":true}},(err,results)=>{
		  if(results.result.nModified!=0){
				dbase.collection("clients").updateMany({"pledge":true},{$inc:{"count":1}},(err,results)=>{
					if(results){
					dbase.collection("clients").find({"count":3,"pledge":true},(err,result)=>{
					   let data=result["pledgedate"]+d.toLocaleString()+",";
					   dbase.collection("clients").update({_id:result["_id"]},{$set:{"pledgedate":data,"pledge":false,"count":0,},$inc:{"coins":70}},(err,result)=>{
					      db.close();	
					      res.send(JSON.stringify("OK"));
					   });
					});
				}
				});
		  }else{
		    res.send(JSON.stringify("nOK"));
		  }
		});
	 });
   });
}

function clearpledge(num,res){
  MongoClient.connect(url,opt,(err,db)=>{
   let dbase=db.db("cashcow_db");
   dbase.collection("clients").findOne({num:num},(err,result)=>{
     dbase.collection("clients").update({_id:result["_id"]},{$set:{"withdrawdate":""}},(err,results)=>{
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

function withdraw(num,pass,index,date,res,c){
 let a=new Date(Date.parse(date));
 let de = a.getFullYear()+'-'+(a.getMonth()+1)+'-'+a.getDate()+" wtimes"; 
 let lastdate,lastdate1,newwdates;
 MongoClient.connect(url,opt,(err,db)=>{
   let dbase=db.db("cashcow_db");
   dbase.collection("clients").findOne({num:num},(err,result)=>{
     let dates=result["pledgedate"];
	 dates=dates.slice(0,-1);
	 lastdate=dates.split(",").reverse()[index];
	 let diff=Math.floor((new Date(date).getTime()-new Date(lastdate).getTime())/(1000*60*60));
	 /*if(diff<8){
	   db.close();
	   res.send(JSON.stringify("Wait"));
	 }else{*/
	    //perform withdraw using pass and use coins
		//if c==1 withdraw 45 else 50
	   let lastdate1=dates.split(",").reverse();
	   lastdate1.splice(index,1);
	   if(lastdate1.length!=0){
	     lastdate1=lastdate1.join(",")+",";
	   }else{
	     lastdate1=lastdate1.join(",");
	   }
	   newwdates=result["withdrawdate"]+lastdate+",";
	   let newcoins=parseInt(result["coins"])-70;
	   let newval=parseInt(result[de])+1;
	   dbase.collection("clients").update({_id:result["_id"]},{$set:{"pledgedate":lastdate1,"withdrawdate":newwdates,"coins":newcoins,[de]:newval}},(err,results)=>{
		   if(results.result.nModified!=0){
		     res.send(JSON.stringify("OK"));
		   }else{
		     res.send(JSON.stringify("nOK"));
		   }
	   });
	  //}
   });
 });
}

function withdrawcheck(num,date,res){
  MongoClient.connect(url,opt,(err,db)=>{
   let dbase=db.db("cashcow_db");
   dbase.collection("clients").findOne({num:num},(err,result)=>{
     let dates=result["pledgedate"];
	 dates=dates.slice(0,-1);
	 let lastdate=dates.split(",").pop();
	 let diff=Math.floor((new Date(date).getTime()-new Date(lastdate).getTime())/(1000*60*60));
	 db.close();
	 if(diff<8){	   
	   res.send(JSON.stringify("Wait"));
	 }else{
	   res.send(JSON.stringify("OK"));
	 }
   });
  });
}

function withdrawall(num,date,res){
  let len;
  let a=new Date(Date.parse(date));
  let c = a.getFullYear()+'-'+(a.getMonth()+1)+'-'+a.getDate()+" wtimes"; 
  MongoClient.connect(url,opt,(err,db)=>{
   let dbase=db.db("cashcow_db");
   dbase.collection("clients").findOne({num:num},(err,result)=>{
    let pdates=result["pledgedate"].split(",").reverse();
    pdates.splice(0,-1);
    pdates.forEach((val,index)=>{
     if(val.length==0){
	   pdates.splice(index,1);
	 }
    });
    //withdraw all except one to wallet (pdates.length-1)*70
	let len=pdates.length-1;
    let newcoins=parseInt(result["coins"])-(pdates.length-1)*70;
    let wdates=pdates.slice();
    wdates.splice(0,1);
    wdates=result["withdrawdate"]+wdates.reverse().toString()+",";
    pdates=pdates.shift()+",";
    let wtimes=parseInt(result[c])+len;
	if(wtimes>5){
	  db.close();
	  res.send(JSON.stringify("reached"));
	}else{
      dbase.collection("clients").update({_id:result["_id"]},{$set:{"coins":newcoins,"pledgedate":pdates,"withdrawdate":wdates,[c]:wtimes}},(err,results)=>{
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

function editdata(data,res){
 let val;
 switch(data["type"]){
   case "name":
    val={$set:{"name":data["value"]}};
    break;
   case "pass":
    val={$set:{"password":data["value"]}};
    break;
   case "num":
    val={$set:{"num":data["value"]}};
    break;
 }
 MongoClient.connect(url,opt,(err,db)=>{
   let dbase=db.db("cashcow_db");
   dbase.collection("clients").findOne({num:data["num"]},(err,result)=>{
    dbase.collection("clients").update({_id:result["_id"]},val,(err,results)=>{
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

function withdrawlim(num,date,res){
 let a=new Date(Date.parse(date));
 let c = a.getFullYear()+'-'+(a.getMonth()+1)+'-'+a.getDate()+" wtimes"; 
 let b={$set:{[c]:0}};
 let d=a.getFullYear()+'-'+(a.getMonth()+1)+'-'+(a.getDate()-1)+" wtimes";
 let e={$unset:{[d]:""}};

 MongoClient.connect(url,opt,(err,db)=>{
   let dbase=db.db("cashcow_db");
   dbase.collection("clients").findOne({num:num},(err,result)=>{
	 if(result[d]!=undefined){
	    dbase.collection("clients").update({_id:result["_id"]},e,(err,results)=>{
				dbase.collection("clients").update({_id:result["_id"]},b,(err,results)=>{
					db.close();
			    pledgelim(num,a,res);
			});
		});
	 }else{
	  if(result[c]==undefined){
	     dbase.collection("clients").update({_id:result["_id"]},b,(err,results)=>{
				db.close();
			  pledgelim(num,a,res);
		 });
	  }
	 }
   });
 });
}

function pledgelim(num,a,res){
 let f=a.getFullYear()+'-'+(a.getMonth()+1)+" ptimes";
 let g={$set:{[f]:0}};
 let h=a.getFullYear()+'-'+a.getMonth()+" ptimes";
 let i={$unset:{[h]:""}};
 
MongoClient.connect(url,opt,(err,db)=>{
   let dbase=db.db("cashcow_db");
   dbase.collection("clients").findOne({num:num},(err,result)=>{
	 if(result[h]!=undefined){
	    dbase.collection("clients").update({_id:result["_id"]},i,(err,results)=>{
			dbase.collection("clients").update({_id:result["_id"]},g,(err,results)=>{
				db.close();
			});
		});
	 }else{
	  if(result[f]==undefined){
	     dbase.collection("clients").update({_id:result["_id"]},g,(err,results)=>{
				db.close();
		 });
	  }
	 }
   });
 });
}

function checkptimes(num,date,res){
  let a=new Date(Date.parse(date));
  let c=a.getFullYear()+'-'+(a.getMonth()+1)+" ptimes";
 
  MongoClient.connect(url,opt,(err,db)=>{
    let dbase=db.db("cashcow_db");
    dbase.collection("clients").findOne({num:num},(err,result)=>{
      if(parseInt(result[c])==100){
	    res.send(JSON.stringify("nOK"));
	  }else{
	    res.send(JSON.stringify("OK"));
	  }
	});
  });
}

function checkwtimes(num,date,res){
  let a=new Date(Date.parse(date));
  let c = a.getFullYear()+'-'+(a.getMonth()+1)+'-'+a.getDate()+" wtimes";   
  MongoClient.connect(url,opt,(err,db)=>{
    let dbase=db.db("cashcow_db");
    dbase.collection("clients").findOne({num:num},(err,result)=>{
	  if(parseInt(result[c])==5){
	    res.send(JSON.stringify("nOK"));
	  }else{
	    res.send(JSON.stringify("OK"));
	  }
	});
  });
}

function sendsms(num,number,res){
 const config = new SMSMessageConfig({
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret
});
const message = new SMSMessage(config);
  message.sendOne({
        From: "CashCow",
        To: "+233547789165",
		//To:"+233"+num,
        Content: "Your wallet confirmation number is "+number,
    }).then(responseJSON => {
        console.log(responseJSON);
    }).catch((err) =>{
		console.log(err);
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
	withdraw:withdraw,
	withdrawcheck:withdrawcheck,
	withdrawall:withdrawall,
	editdata:editdata,
	withdrawlim:withdrawlim,
	checkptimes:checkptimes,
	checkwtimes:checkwtimes,
	sendsms:sendsms
}
