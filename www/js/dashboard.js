let code,coins,dates,wdates,uid,name,numbers;


document.addEventListener("deviceready",()=>{ 
  setInterval(notificationgain,1000);
  fetchdata(1);
}, false);

document.addEventListener("backbutton",exit);
document.getElementById("pledge").addEventListener("click",()=>{
 navigator.notification.confirm("1. I know CashCow is a club\n2. I am 18 years and above\n3. I have up to Ghc 55 in my account\n4. I will keep the cycle active by recommitting",(r)=>{
   if(r==1){
    fundwork(0);
   }
 },"Are you sure to pledge?",["OK","Cancel"]);
});

function withdrawing(){
   if(parseInt(coins)==0){
      preventform("You have no coins in order to withdraw to mobile money device");
    }else{
      if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
        preventform("Your offline. Please get connected to internet before proceeding.");
      }else{
      //SpinnerDialog.show();
       $.post("http://192.168.0.109:8080/getwtimes",{num:window.localStorage.getItem("num"),date:new Date()}).then((res)=>{
        //SpinnerDialog.hide();
         if(res!="\"OK\""){
           preventform("You cannot withdraw more than 350 GHC per day. So please wait for tomorrow.");
         }else{
          if(numbers==1){
            please45();
          }else{
           withdrawall(); 
          }
        }
    },(err)=>{
      //Spinnerdialog.hide();
      preventform("An error occured. Please try again.");
    });
   }
  }
}

function please45(){
  navigator.notification.confirm("You have only one pledge left for withdrawal. So, you cannot withdraw 70 coins of that pledge until you pledge again, but if you insist we may give you 45 coins. The rate of convesion is 1 coin=1 GHC.",(r)=>{
    if(r==1){
       withdraw45();
    }
 },""["OK","Cancel"]);
}

function withdraw45(){
  let a="Please enter your mobile money number password";
  window.plugins.numberDialog.prompt(a,(r)=>{
    ////Spinnerdialog.hide()vigator.notification.prompt(a,(r)=>{
     if(r.buttonIndex==1){
       if(r.input1.length==4 && !isNaN(r.input1)){
        if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
          preventform("Your offline. Please get connected to internet before proceeding.");
        }else{
           //SpinnerDialog.show();
         $.post("http://192.168.0.109:8080/withdraw45",{num:window.localStorage.getItem("num"),pass:r.input1,date:new Date()}).then((res)=>{
           //SpinnerDialog.show]]]();
            if(res=="\"OK\""){
              navigator.notification.alert("45 coins has been loaded to your mobile oney number successfully.",()=>{
                 fetchdata();
              },"","OK");
            }else if(res=="\"Wait\""){
              preventform("You have to wait at least 8 hours before your last pledge in order to withdraw coins to mobile money number");
            }else{
              preventform("An error occurred. Please recheck your mobile money number and try again.");
            }
         },(err)=>{
          //Spinnerdialog.hide();
          preventform("An error occured. Please try again.");
        });
        }
       }else{
         navigator.notification.alert("Please enter a valid password",()=>{
           withdraw45();
         },"","OK");
       }
     }
  },"",["OK","Cancel"]);
}

function beforeit(){
  navigator.notification.confirm("You must pledge once before withdrawing all coins at once. Click OK to continue.",(num)=>{
    if(num==1){
       fundwork(0);
    }     
  },"",["OK","Cancel"]);
}

function withdrawall(){
if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
    preventform("Your offline. Please get connected to internet before proceeding.");
}else{
  //SpinnerDialog.show();
  $.post("http://192.168.0.109:8080/withdrawall",{num:window.localStorage.getItem("num"),date:new Date()}).then((res)=>{
     //Spinnerdialog.hide();
     if(res=="\"OK\""){
      navigator.notification.alert("All fund has been loaded to your mobile money device, excluding one since we want you to keep at least one active pledge in your account. If you insist to withdraw, try withdrawing it separately.",()=>{
         fetchdata();
      },"",["OK"]);
    }else if(res=="\"reached\""){
        preventform("You cannot withdraw all pledges at once if you have more than 5 active pledges. So, please try withdrawing separately till it reaches less than 5 left in the active pledges list.");
    }else{
      preventform("An unexpected error occurred. Try again with proper checking of your mobile money number password");
    }
  },(err)=>{
    //Spinnerdialog.hide();
    preventform("An error occured. Please try again.");
  });
}
}

function pledgefund(pass){
if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
    preventform("Your offline. Please get connected to internet before proceeding.");
}else{
 //SpinnerDialog.show();
 $.post("http://192.168.0.109:8080/pledge",{date:new Date(),number:window.localStorage.getItem("num"),pass:pass}).then((res)=>{
  //Spinnerdialog.hide();
  if(res=="\"OK\""){
   navigator.notification.alert("You have successfully pledged",()=>{
      fetchdata();
   },"",["OK"]);
  }else{
    preventform("An unexpected error occurred. Try again.");
  }
},(err)=>{
  //Spinnerdialog.hide();
  preventform("An error occured. Please try again.");
});
}
}

function fundwork(b,d=5000){
 if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
    preventform("Your offline. Please get connected to internet before proceeding.");
 }else{
  if(b==1){
   //SpinnerDialog.show();
   $.post("http://192.168.0.109:8080/getwtimes",{num:window.localStorage.getItem("num"),date:new Date()}).then((res)=>{
     //Spinnerdialog.hide(); 
     if(res=="\"OK\""){
        if(d!=5000 && numbers==1){
          please45();
        }else{
          fundworkhelper(b,d);
        }
      }else{
        preventform("You cannot withdraw more than 5 times a day, i.e. not more than 350 GHC per day. So please wait for tomorrow.");
      }
    },(err)=>{
      //Spinnerdialog.hide();
      preventform("An error occured. Please try again.");
    });
  }else{
    //SpinnerDialog.show();
    $.post("http://192.168.0.109:8080/getptimes",{num:window.localStorage.getItem("num"),date:new Date()}).then((res)=>{
      //Spinnerdialog.hide();
      if(res=="\"nOK\""){
        preventform("You have already reached the limit of pledging for the month, i.e. We allow only 100 pledges per month. So, you cannot pledge now within this month.");
      }else if(res=="\"OK\""){
       fundworkhelper(b,d);
      }else{
        preventform("An error occured. Please try again.");
      }
     },(err)=>{
      //Spinnerdialog.hide();
      preventform("An error occured. Please try again.");
    });
  }
 }
}

function fundworkhelper(b,d){
  let a="Please enter the code sent to your device"; //ussd or code
  navigator.notification.prompt(a,(r)=>{
    if(r.buttonIndex==1){
      if(r.input1.length!=4||isNaN(r.input1)){
        navigator.notification.alert("Please enter a valid mobile money number password",()=>{
          fundwork(b);
        },"",["OK"]);
      }else{
        if(b==1){
            withdrawfund(r.input1,d);
        }else{
          pledgefund(r.input1);
        }
      }
    }
  },"",["OK","Cancel"]);
}

function withdrawfund(pass,index){
  let url="http://192.168.0.109:8080/withdraw";
  if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
    preventform("Your offline. Please get connected to internet before proceeding.");
  }else{
   //SpinnerDialog.show();
  $.post(url,{num:window.localStorage.getItem("num"),pass:pass,index:index,date:new Date()}).then((res)=>{
    if(res=="\"OK\""){
      ////Spinnerdialog.hide();
      navigator.notification.alert("The selected fund has been successfully withdrawn to your mobile money number with the rate of 1 Coin=1GHC",()=>{
         fetchdata();
      },"",["OK"]);
    }else if(res=="\"Wait\""){
       preventform("You have to wait at least 8 hours before your last pledge in order to withdraw coins to mobile money number");
    }else{
      preventform("An unexpected error occurred. Try again with proper checking of your mobile money number password");
    }
  },(err)=>{
    //Spinnerdialog.hide();
    preventform("An error occured. Please try again.");
  });
 }
}

function withdrawfund1(){
  let url="http://192.168.0.109:8080/withdrawcheck";
  if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
    preventform("Your offline. Please get connected to internet before proceeding.");
  }else{
  //SpinnerDialog.show();
  $.post(url,{num:window.localStorage.getItem("num"),date:new Date()}).then((res)=>{
    //Spinnerdialog.hide();
    if(res=="\"OK\""){
      beforeit();
    }else if(res=="\"Wait\""){
       preventform("Sorry. You have to wait at least 8 hours before your last pledge in order to withdraw coins to mobile money device");
    }else{
      preventform("An error occurred. Please try again later");
    }
  },(err)=>{
    //Spinnerdialog.hide();
    preventform("An error occured. Please try again.");
  });
 }
}

function preventdialog(e){
    e.preventDefault();
    showdialog();
}

function fetchdata(a=0){
  if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
    preventform("Your offline. Please get connected to internet before proceeding.");
  }else{
  if(a==1){
    //SpinnerDialog.show();
  }
 $.post("http://192.168.0.109:8080/getdata",{data:window.localStorage.getItem("num")}).then((res)=>{
   let m=$.parseJSON(res);
   coins=m.coins;
   dates=m.dates;
   wdates=m.wdates;
   uid=m.uid;
   name=m.name;
   forhist(wdates,uid);
   $("#name").text(m.name);
   if(parseInt(m.coins)>=1000){
    $("#coins").text("Coins:"+ (parseFloat((parseInt(m.coins)/1000).toString()).toFixed(1)).toString()+"K");
   }else{
    $("#coins").text("Coins:"+m.coins);
   }
   $("#uid").text("User Id: "+m.uid);
   $("#wallet").text("Wallet: "+window.localStorage.getItem("num"));
   if(m.dates==""){
     $(".trans").empty();
     $(".trans").html("<p class=\"text-center\" id=\"no-pledge\">No active pledges</p>");
   }else{
     $(".trans").empty();
      m.dates=m.dates.slice(0,-1);
      numbers=m.dates.split(",").length;
      m.dates.split(",").reverse().forEach((element,index) => {
        let date=new Date(element);
        let fdate=date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
        let ftime=timeshow(date);
        $(".trans").append("<div class=\"date\"><span id=\"code\">Pledge Code: "+uid+"-P"+(index+1)+"</span><br/>"+"<span id=\"mon\">Amount: 70 GHC</span><br/>"+"<span id=\"fdate\"> Date: "+fdate+"</span><br/><span id=\"time\"> Time: "+ftime+"</span></div>");
        $(".trans").append("<div class=\"withd text-right\"><button class=\"btn btn-info\" onclick=\"fundwork(1,"+index+")\">Withdraw</button></div><br/><hr>");
      });
   }
   if(a==1){
        //Spinnerdialog.hide();
        withdrawlim();
   }
 },(err)=>{
  navigator.notification.alert("An unexpected error occured. Please re-signin.",()=>{
    signout();
  },"","OK");
});
}
}

function withdrawlim(){
  let date=new Date();
   $.post("http://192.168.0.109:8080/withdrawlim",{num:window.localStorage.getItem("num"),date:date}).then((res)=>{
   },(err)=>{
    preventform("An error occured. Please try again.");
  });
}

function forhist(wdates,uid){
  let m=70;
  $(".trans1").empty();
  if(wdates==""){
    $(".trans1").html("<p class=\"text-center\" id=\"no-with\">No history</p><hr>");
  }else{
    $(".trans1").empty();
     wdates=wdates.slice(0,-1);
     wdates.split(",").reverse().forEach((element,index) => {
       if(element[element.length-1]=="a"){
         m=45;
         element=element.slice(0,-1);
       }
       let date=new Date(element);
       let fdate=date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
       let ftime=timeshow(date);
       $(".trans1").append("<div class=\"date\"><span id=\"code\">Pledge Code: "+uid+"-W"+(index+1)+"</span><br/>"+"<span id=\"mon\">Amount: "+m+" GHC</span><br/>"+"<span id=\"fdate\"> Date: "+fdate+"</span><br/><span id=\"time\"> Time: "+ftime+"</span></div><hr>"); 
       m=70;
    });
  }
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

function show(n){
  switch(n){
    case 0:
      $(".nav-home").css("display","block");
      $(".nav-media").css("display","none");
      $(".nav-info").css("display","none");
      break;
    case 1:
      $(".nav-home").css("display","none");
      $(".nav-media").css("display","block");
      $(".nav-info").css("display","none");
      break;
    case 2:
    $(".nav-home").css("display","none");
    $(".nav-media").css("display","none");
    $(".nav-info").css("display","block");
    makeseen();
    break;
  }
}

function exit(e){
  e.preventDefault();
  navigator.app.exitApp();
}

document.getElementById("signout").addEventListener("click",signout);
document.getElementById("verify").addEventListener("click",walletverify);

function walletverify(){
    if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
        preventform("Your offline. Please get connected to internet before proceeding.");
      }else{
    //SpinnerDialog.show();
    $.ajax({
      url:"http://192.168.0.109:8080/verifynum",
      type:"POST",
      data:window.localStorage.getItem("num"),
      success:(res)=>{
        ////Spinnerdialog.hide();
        let m=$.parseJSON(res);
        if(m.status=="OK"){
            code=m.num;
            checknow();
        }else{
          preventform("An unexpected error occurred. Try again.");
        }
      },
      error: ()=> {
        //Spinnerdialog.hide();
        preventform("An unexpected error occurred. Try again.");
     } 
    });
 }
}

function checknow(){
    //window.plugins.numberDialog.promptClear("Enter the code sent to your wallet device", checkit, "", ["Done","Cancel"]);
     navigator.notification.prompt("Enter the code sent to your mobile money number", checkit, "", ["Done","Cancel"]);
    function checkit(r){
     if(r.buttonIndex==1){
          if(r.input1==code){ 
            //SpinnerDialog.show();
            if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
                preventform("Your offline. Please get connected to internet before proceeding.");
              }else{
            $.ajax({
              url:"http://192.168.0.109:8080/numin",
              type:"POST",
              data:window.localStorage.getItem("num"),
              success:(res)=>{
                  ////Spinnerdialog.hide();
                  if(res=="\"OK\""){
                      navigator.notification.alert("Your mobile money number has been successfully verified. Please sign in again to continue.",()=>{
                        signout();           
                      },"",["OK"]);
                  }else{
                      preventform("An unexpected error occurred. Try again.");
                  }
              },
              error: ()=> {
                //Spinnerdialog.hide();
                preventform("An unexpected error occurred. Try again.");
             } 
            });
           }
          }else{
            navigator.notification.alert("Sorry. The code we sent U didn't match the one you entered. Please try again.",()=>{
               checknow();
            },"",["OK"]);
          }
        }
    }
}

function preventform(a){ //show alert msg
   navigator.notification.alert(a,null,"",["OK"]);
}

function signout(){
    socket.disconnect();
    window.localStorage.clear();
    window.location.href="index.html";
}

function sets(n){
  switch(n){
    case 0:
     accountset();
     break;
    case 1:
     withdrawing();
     break;
    case 2:
     clearpledge();
     break;
  }
}

function accountset(){
  let config = {
    title: "Select one among the following actions", 
    items: [
        { text: "Edit Name", value: "ename" },
        { text: "Edit Mobile Money Number", value: "enum" },
        { text: "Edit Password", value: "epass" }
    ],
    doneButtonLabel: "Done",
    cancelButtonLabel: "Cancel"
  };
   window.plugins.listpicker.showPicker(config, (item)=> { 
        switch(item){
          case "ename":
           navigator.notification.prompt("Enter new name",(r)=>{
             if(r.buttonIndex==1){
               if(r.input1==name){
                 preventform("Either the name is kept unchanged or the field is empty. We don't proceed on such cases.");
               }else{
                 editit(r.input1,0);
               }
             }
           },"",["OK","Cancel"],name);
           break;
          case "enum":
          window.plugins.numberDialog.promptClear("Enter the new mobile money number",(r)=>{
            if(r.buttonIndex==1){
              if(r.input1.length!=10||r.input1==window.localStorage.getItem("num")){
                preventform("Either the input is invalid is same as the already registered number");
              }else{
                sendcode(r.input1);
              }
            }
          }," ",["Done","Cancel"])
           break;
          case "epass":
           passchange();
           break;
          case "close":
           break;
        }
    });
}

function sendcode(num){
 if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
    preventform("Your offline. Please get connected to internet before proceeding.");
}else{
  //SpinnerDialog.show();
  $.ajax({
    url:"http://192.168.0.109:8080/checkwallet",
    type:'POST',
    data:num,
    success:(res)=>{
      let m=$.parseJSON(res);
      //Spinnerdialog.hide();
      if(m.status!="OK"){
        postforsms(num);
      }else{
        preventform("An account with this mobile money number already exists");
      }
    },
    error: ()=> {
      //Spinnerdialog.hide();
      preventform("An unexpected error occurred. Try again.");
   } 
  });
 }
}

function postforsms(a){ //post for sending smd
  if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
    preventform("Your offline. Please get connected to internet before proceeding.");
  }else{
  //SpinnerDialog.show();
  $.ajax({
    url:"http://192.168.0.109:8080/verifynum",
    type:'POST',
    data:a,
    success:function(res){
      //Spinnerdialog.hide();
      let m=$.parseJSON(res);
      if(m.status=="OK"){
         finalcheck(m,a);
      }else{
        preventform("An error occurred. Please try again.");
      }
    },
    error: ()=> {
      //Spinnerdialog.hide();
      preventform("An unexpected error occurred. Try again.");
   } 
  });
}
}

function finalcheck(m,a){
  window.plugins.numberDialog.promptClear("Enter the code sent to your mobile money number", checkit, " ", ["Done","Cancel"]);
        function checkit(r){
          if(r.buttonIndex==1){
            if(r.input1==m.num.toString()){ 
               editit(a,1);
            }else{
              navigator.notification.alert("Sorry. The code we sent U didn't match the one you entered. Please try again.",()=>{
                 finalcheck(m);
              },"",["OK"]);
            }
          }
        }
}

function passchange(){
  let options = {
   title: " ",
   message: "Please enter new password."
 };
 
 PasswordDialogPlugin.showConfirmPassword(options,(result)=>{
       if (!result.cancel) {
           editit(result.password,2);
       }
   },(err)=>{});
 }

function editit(val,index){
  let what,res;
  switch(index){
    case 0:
     what="name";
     result="Name has been successfully updated";
     break;
    case 1:
     what="num";
     result="Mobile money number has been successfully updated. Please signin once again to continue.";
     break;
    case 2:
     what="pass";
     result="Password has been successfully updated. Please signin once again to continue.";
     break;
  }
  if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
    preventform("Your offline. Please get connected to internet before proceeding.");
  }else{
  //SpinnerDialog.show();
  $.post("http://192.168.0.109:8080/edit",{value:val,type:what,num:window.localStorage.getItem("num")}).then((res)=>{
    if(res=="\"OK\""){
      //Spinnerdialog.hide();
     if(index==0){
       navigator.notification.alert(result,()=>{
        fetchdata();
       },"","OK");
     }else{
      navigator.notification.alert(result,()=>{
        signout();
       },"","OK");
     }
    }else{
      preventform("An error occurred!!! Please try again");
    }
  },(err)=>{
    //Spinnerdialog.hide();
    preventform("An error occured. Please try again.");
  });
 }
}


function clearpledge(){
  if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
    preventform("Your offline. Please get connected to internet before proceeding.");
  }else{
   if(wdates==""){
      preventform("You already have a cleared pledge history");
   }else{
    if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
        preventform("Your offline. Please get connected to internet before proceeding.");
    }else{
     //SpinnerDialog.show();
     $.post("http://192.168.0.109:8080/clearpledge",{num:window.localStorage.getItem("num")}).then((res)=>{
       //Spinnerdialog.hide(); 
     if(res=="\"OK\""){
       navigator.notification.alert("Your pledge history has been successfuly cleared",()=>{
        fetchdata();
       },"",["OK"]);
      }else{
       preventform("An error occurred. Please try again later");
      }
  },(err)=>{
    //Spinnerdialog.hide();
    preventform("An error occured. Please try again.");
  });
  }
 }
}
}