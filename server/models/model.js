let amount,pnum='';
let MongoClient=require('mongodb').MongoClient;
let bcrypt=require('bcryptjs');
let LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');
let url="mongodb://127.0.0.1:27017/";
let opt={ useNewUrlParser: true };
const { SMSMessage, SMSMessageConfig } = require("hubtel-mx");
const {MobileMoney,MobileMoneyConfig,getErrorMessageFromResponseCode } = require("hubtel-mx");

 
require('dotenv').load();

const config = new SMSMessageConfig({
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
});

const config1 = new MobileMoneyConfig({
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    merchantAccountNumber: process.env.merchantAccountNumber
});

const message = new SMSMessage(config);
const mobileMoney = new MobileMoney(config1);

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
	data["owncount"]=1;
	MongoClient.connect(url,opt,(err,db)=>{
	  let dbase=db.db("cashcow_db");
	  dbase.collection("clients").insertOne(data,(err,result)=>{
	   dbase.collection("notification").insertOne({num:data["num"],text:"",status:""},(err,result1)=>{
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

function pledgedtime(date,number,pass,res){

 MongoClient.connect(url,opt,(err,db)=>{
   let dbase=db.db("cashcow_db");
   dbase.collection("clients").findOne({num:num},(err,result)=>{
 /*mobileMoney.receive({
	    CustomerName: result["name"],
        CustomerMsisdn: number,
        Channel: "mtn-gh",
        Amount: 55,
        ClientReference: "CashCow"
    }).then(responseJSON => {
        console.log(responseJSON);
        console.log("Response message: ",getErrorMessageFromResponseCode(responseJSON.ResponseCode));
		pledgedtime1(date,number,res);
    }).catch(err => {
		res.send(JSON.stringify("nOK"));
	});*/
   });
 });
	pledgedtime1(date,number,res);
}


function pledgedtime1(date,number,res){
   let d=new Date(date),sets,sets1;
   let e=d.getFullYear()+'-'+(d.getMonth()+1)+" ptimes";
   MongoClient.connect(url,opt,(err,db)=>{
   let dbase=db.db("cashcow_db");
   dbase.collection("clients").findOne({num:number},(err,result)=>{
		let newval=parseInt(result[e])+1;
		let newcount=parseInt(result["owncount"])+1;
		if(localStorage.getItem("pnum")==undefined||localStorage.getItem("pnum")!=number){
		  sets={[e]:newval,"pledge":true};
		}else{
		  sets={[e]:newval,"pledge":true,"owncount":newcount};
		}
		localStorage.setItem("pnum",number);
	    dbase.collection("clients").findOneAndUpdate({_id:result["_id"]},{$set:sets},(err,results)=>{
		  if(results){
				dbase.collection("clients").updateMany({"pledge":true},{$inc:{"count":1}},(err,results1)=>{
				   if(results1.result.nModified!=0){
					 dbase.collection("clients").findOne({"count":4},(err,results2)=>{
					   if(results2!=undefined){
						let data=results2["pledgedate"]+d.toLocaleString()+",";
						pledgeit(db,results2,data,res,date,number);
					  }else{
					    notify(res,db,number,0,date);
					  }
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


function pledgeit(db,results2,data,res,date,number){
        let dbase=db.db("cashcow_db");
         dbase.collection("clients").findOne({_id:results2["_id"]},(err,resit)=>{
		   let incs,sets;
		   if(parseInt(resit["owncount"])==1){
		     incs={"coins":70};
		     sets={"pledgedate":data,"count":0,"pledge":false};
		   }else{
		     incs={"coins":70,"count":-1,"owncount":-1};
		     sets={"pledgedate":data};
		   }
           dbase.collection("clients").update({_id:results2["_id"]},{$set:sets,$inc:incs},(err,results3)=>{
			  fullfilled(db,results2,res,date,number);  //only for notification
		   });
         });
}


function fullfilled(db,resume,res,date,newnum=null){
   let d=new Date(date);
   let dbase=db.db("cashcow_db");
   dbase.collection("notification").findOne({num:resume["num"]},(err,results4)=>{
       let newtext=results4["text"]+"You have successfully received pledge coins on "+d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" at "+timeshow(d)+",";
	   let newstat=results4["status"]+"false,";
	   dbase.collection("notification").update({_id:results4["_id"]},{$set:{"text":newtext,"status":newstat}},(err,results5)=>{
		   notify(res,db,newnum,0,date);
	  });
  });
}

function notify(res,db,number,n,date){
	let dbase=db.db("cashcow_db");
	let text;
	let d=new Date(date);
	if(n==0){
	  //send notification of pledge on socket event notification
	  text="You have pledged sucessfully on "+d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" at "+timeshow(d)+",";
	  
	}else{
		text="You have successfully withdrawn "+amount.toString()+" GHC to wallet on "+d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" at "+timeshow(d)+",";
	   //send notification of withdrawal of amount GHC event notification
	}
    dbase.collection("notification").findOne({num:number},(err,result)=>{
	  let text1=result["text"]+text;
	  let status1=result["status"]+"false,";
	  dbase.collection("notification").update({_id:result["_id"]},{$set:{"text":text1,"status":status1}},(err,result1)=>{
	     db.close();
		 res.send(JSON.stringify("OK"));
	  });
	});
}

function timeshow(date){
  let r;
  let h=parseInt(date.getHours());
  let m=parseInt(date.getMinutes());
  let s=parseInt(date.getSeconds());
  if(h>12){
    h-=12;
    r="PM";
  }else{
    r="AM";
  }
  if(m<10){
     m="0"+m;
  }
  if(s<10){
    s="0"+s;
  }
  return h.toString()+":"+m.toString()+":"+s.toString()+" "+r;
}

function notifyseen(num,res){
  MongoClient.connect(url,opt,(err,db)=>{
   let dbase=db.db("cashcow_db");
   dbase.collection("notification").findOne({num:num},(err,result)=>{
     let stats=result["status"].split(",").slice();
	 stats.pop();
	 stats.forEach((val,index)=>{
	   stats[index]="true";
	 });
	 let stat1=stats.join(",")+",";
	 dbase.collection("notification").update({_id:result["_id"]},{$set:{"status":stat1}},(err,result)=>{
	    res.send(JSON.stringify("OK"));
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
 let lastdate,lastdate1,newwdates,dates,amt;
 MongoClient.connect(url,opt,(err,db)=>{
   let dbase=db.db("cashcow_db");
   dbase.collection("clients").findOne({num:num},(err,result)=>{
	 dates=result["pledgedate"];
	 dates=dates.slice(0,-1);
	 lastdate=dates.split(",").reverse()[index];
	 let diff=Math.floor((new Date(date).getTime()-new Date(lastdate).getTime())/(1000*60*60));
	 /*if(diff<8){
	   db.close();
	   res.send(JSON.stringify("Wait"));
	 }else{*/
	    //perform withdraw using pass and use coins
		//if c==1 withdraw 45 else 50
	   if(c==1){
	     amt=45;
	   }else{
	     amt=70;
	   }
     /*mobileMoney.send({
		RecipientName: result["name"],
        RecipientMsisdn: num,
        Channel: "tigo-gh",
        Amount:amt,
		PrimaryCallbackUrl: "",
		SecondaryCallbackUrl: "",
        ClientReference: "CashCow"
     }).then(responseJSON=> {
		helpwithdraw(dbase,res,dates);
	 }).catch((err) => {
	    res.send(JSON.stringify("nOK"));
		//helpwithdraw(dbase,res,dates);
	 });*/
	   helpwithdraw(db,res,dates,amt,num,date,result,de,lastdate,c); //comment this out later
	 //}
   });
  });
}

function helpwithdraw(db,res,dates,amt,num,date,result,de,lastdate,c){
	   let dbase=db.db("cashcow_db");
	   let lastdate1=dates.split(",").slice();
	   let newwdates;
	   if(c==0){
		  let lastdates=lastdate1.pop();
		  newwdates=result["withdrawdate"]+lastdates+",";
		  lastdate1=lastdate1.join(",")+",";
	   }else{
		 newwdates=result["withdrawdate"]+lastdate+"a,";
	     lastdate1="";
	   }
	   let newcoins=parseInt(result["coins"])-70;
	   let newval=parseInt(result[de])+1;
	   dbase.collection("clients").update({_id:result["_id"]},{$set:{"pledgedate":lastdate1,"withdrawdate":newwdates,"coins":newcoins,[de]:newval}},(err,results)=>{
		   if(results.result.nModified!=0){
		     amount=amt;
			 //add notification of withdrawing GHC equal to amt
			 //res.send(JSON.stringify("OK"))
			 notify(res,db,num,1,date);
		   }else{
		     res.send(JSON.stringify("nOK"));
		   }
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
  let len,pdates;
  let a=new Date(Date.parse(date));
  let c = a.getFullYear()+'-'+(a.getMonth()+1)+'-'+a.getDate()+" wtimes"; 
  MongoClient.connect(url,opt,(err,db)=>{
   let dbase=db.db("cashcow_db");
   dbase.collection("clients").findOne({num:num},(err,result)=>{
    pdates=result["pledgedate"].split(",").reverse();
    pdates.splice(0,-1);
    pdates.forEach((val,index)=>{
     if(val.length==0){
	   pdates.splice(index,1);
	 }
    });
	len=pdates.length;
	amount=(len-1)*70;
	/*mobileMoney.send({
		CustomerName: result["name"],
        RecipientMsisdn: num,
        Channel: "tigo-gh",
        Amount:amt,
		PrimaryCallbackUrl:"",
		SecondaryCallbackUrl: "",
        ClientReference: "CashCow"
     }).then(responseJSON=> {
		console.log(responseJSON);
		helpwithdrawall(pdates,db,dbase,res);
	 }).catch((err) => {
		 console.log(err);
	    res.send(JSON.stringify("nOK"));
	 });*/
	 helpwithdrawall(pdates,db,dbase,res,num,date,result,len,c); //comment this out later
  });
 });

}

function helpwithdrawall(pdates,db,dbase,res,num,date,result,len,c){
    let newcoins=parseInt(result["coins"])-(len-1)*70;
    let wdates=pdates.slice();
    wdates.splice(0,1);
    wdates=result["withdrawdate"]+wdates.reverse().toString()+",";
    pdates=pdates.shift()+","
	let wtimes=len+parseInt(result[c]);
	if(len>=5){
	  db.close();
	  res.send(JSON.stringify("reached"));
	}else{
      dbase.collection("clients").update({_id:result["_id"]},{$set:{"coins":newcoins,"pledgedate":pdates,"withdrawdate":wdates,[c]:wtimes}},(err,results)=>{
		//db.close();
	    if(results.result.nModified!=0){
		  notify(res,db,num,1,date);
	    }else{
		  res.send(JSON.stringify("nOK"));
	    }
      });
	}
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
				res.send(JSON.stringify("OK"));
			});
		});
	 }else{
	  if(result[f]==undefined){
	     dbase.collection("clients").update({_id:result["_id"]},g,(err,results)=>{
				db.close();
				res.send(JSON.stringify("OK"));
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
	     //send sms or ussd here
		 
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
	  if(parseInt(result[c])>=5){
	    res.send(JSON.stringify("nOK"));
	  }else{
	    res.send(JSON.stringify("OK"));
	  }
	});
  });
}

function sendsms(num,number,res){
  /*let phone="+233"+num;
  console.log(phone);
  message.sendOne({
        From: "CashCow",
        //To: "+233547789165",
		To:phone,
        Content: "Your CashCow Club wallet confirmation number is "+number,
    }).then(responseJSON => {
        /*if(responseJSON){
		   res.send(JSON.stringify({status:"OK",num:number}));
		}*/
		//console.log(responseJSON);
    /*}).catch((err) =>{
		res.send(JSON.stringify({status:"nOK"}));
	});*/
	
	res.send(JSON.stringify({status:"OK",num:number}));
}

function sendnotify(socket,num){
   MongoClient.connect(url,opt,(err,db)=>{
    let dbase=db.db("cashcow_db");
    dbase.collection("notification").findOne({num:num},(err,result)=>{
	   db.close();
       socket.emit("notification",JSON.stringify({text:result["text"],status:result["status"]}));
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
	withdraw:withdraw,
	withdrawcheck:withdrawcheck,
	withdrawall:withdrawall,
	editdata:editdata,
	withdrawlim:withdrawlim,
	checkptimes:checkptimes,
	checkwtimes:checkwtimes,
	sendsms:sendsms,
	notifyseen:notifyseen,
	sendnotify:sendnotify
}
