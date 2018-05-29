let code,coins,dates,uid;
window.onload=()=>{
    fetchdata();
};

document.addEventListener("backbutton",exit);
document.getElementById("pledge").addEventListener("click",fundwork);

function withdrawing(){
   if(parseInt(coins)==0){
      preventform("You have no coins in order to withdraw to wallet");
    }else{
      fundwork(1);
    }
    //fundwork(1);
}

function pledgefund(pass){
 //window.plugins.spinnerDialog.show();
 $.post("http://192.168.0.112:8080/pledge",{date:new Date(),number:window.localStorage.getItem("num"),pass:pass}).then((res)=>{
  //window.plugins.spinnerDialog.hide();
  if(res=="\"OK\""){
   navigator.notification.alert("You have successfully pledged 50 GHC",()=>{
     fetchdata();
   },"",["OK"]);
  }else{
    preventform("An unexpected error occurred. Try again.");
  }
});
}

function fundwork(b){
  navigator.notification.prompt("Please enter your mobile wallet password",(r)=>{
    if(r.buttonIndex==1){
      if(r.input1.length!=4||isNaN(r.input1)){
        navigator.notification.alert("Please enter a valid wallet password",()=>{
          fundwork(b);
        },"",["OK"]);
      }else{
        if(b==1){
          withdrawfund(r.input1);
        }else{
         pledgefund(r.input1);
        }
      }
    }
  },"",["OK","Cancel"]);
}

function withdrawfund(pass){
  if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
    preventform("Your offline. Please get connected to internet before proceeding.");
  }else{
  $.post("http://192.168.0.112:8080/withdraw",{num:window.localStorage.getItem("num"),pass:pass,date:new Date()}).then((res)=>{
    if(res=="\"OK\""){
      preventform("Your fund has been successfully withdrawn to wallet with the rate of 1 Coin=1GHC");
    }else if(res=="\"Wait\""){
       preventform("You have to wait at least 3 hours before your last pledge in order to withdraw coins to wallet");
    }else{
      preventform("An error occurred. Please try again later");
    }
  });
 }
}

function preventdialog(e){
    e.preventDefault();
    showdialog();
}

function fetchdata(){
  $("#coins").empty();
  $("#uid").empty();
  $("#wallet").empty();
 $.post("http://192.168.0.112:8080/getdata",{data:window.localStorage.getItem("num")}).then((res)=>{
   let m=$.parseJSON(res);
   coins=m.coins;
   dates=m.dates;
   uid=m.uid;
   $("#name").text(m.name);
   if(parseInt(m.coins)>=1000){
    $("#coins").text("Coins:"+ (parseFloat((parseInt(m.coins)/1000).toString()).toFixed(1)).toString()+"K");
   }else{
    $("#coins").text("Coins:"+m.coins);
   }
   $("#uid").append("User Id: "+m.uid);
   $("#wallet").append("Wallet: "+window.localStorage.getItem("num"));
   if(m.dates==""){
     $(".trans").css({
       "border-radius": "10px",
       "margin-left": "40px",
       "margin-right": "42px"
     });
     $(".trans").html("<p class=\"text-center\" id=\"no-pledge\">You have no any pledge history</p>");
   }else{
     $(".trans").empty();
     $(".trans").css({
      "margin-left":"0px",
      "margin-right":"0px"
     });
      m.dates=m.dates.slice(0,-1);
      m.dates.split(",").reverse().forEach((element,index) => {
        let r="AM";
        let date=new Date(element);
        let h=parseInt(date.getHours());
        let m=parseInt(date.getMinutes());
        let s=parseInt(date.getSeconds());
        if(h>12){
          h-=12;
          r="PM";
        }
        if(m<10){
           m="0"+m;
        }
        if(s<10){
          s="0"+s;
        }
        let fdate=date.getFullYear()+"/"+date.getMonth()+"/"+date.getDate();
        let ftime=h.toString()+":"+m.toString()+":"+s.toString()+" "+r;
        $(".trans").append("<div class=\"date\"><span id=\"code\">Pledge Code: "+uid+"-P"+(index+1)+"</span><br/>"+"<span id=\"mon\">Amount: 50 GHC</span><br/>"+"<span id=\"fdate\"> Date: "+fdate+"</span><br/><span id=\"time\"> Time: "+ftime+"</span></div><hr>");
      });
   }
 });
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
    //window.plugins.spinnerDialog.show();
    $.ajax({
      url:"http://192.168.0.112:8080/verifynum",
      type:"POST",
      data:window.localStorage.getItem("num"),
      success:(res)=>{
        //window.plugins.spinnerDialog.hide();
        let m=$.parseJSON(res);
        if(m.status=="OK"){
            code=m.num;
            checknow();
        }else{
          preventform("An unexpected error occurred. Try again.")
        }
      }
    });
 }
}

function checknow(){
    //window.plugins.numberDialog.promptClear("Enter the code sent to your wallet device", checkit, "", ["Done","Cancel"]);
    navigator.notification.prompt("Enter the code sent to your wallet device",checkit,"",["Done","Cancel"]);
     
    function checkit(r){
     if(r.buttonIndex==1){
          if(r.input1==code){ 
            //window.plugins.spinnerDialog.show();
            if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
                preventform("Your offline. Please get connected to internet before proceeding.");
              }else{
            $.ajax({
              url:"http://192.168.0.112:8080/numin",
              type:"POST",
              data:window.localStorage.getItem("num"),
              success:(res)=>{
                  //window.plugins.spinnerDialog.hide();
                  if(res=="\"OK\""){
                      navigator.notification.alert("Your wallet number has been successfully verified. Please sign in again to continue.",()=>{
                        signout();           
                      },"",["OK"]);
                  }else{
                      preventform("An unexpected error occurred. Try again.");
                  }
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
    window.localStorage.clear();
    window.location.href="index.html";
}

function sets(n){
  switch(n){
    case 0:
     break;
    case 1:
     break;
    case 2:
    withdrawing();
     break;
    case 3:
     clearpledge();
     break;
  }
}


function clearpledge(){
  if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
    preventform("Your offline. Please get connected to internet before proceeding.");
  }else{
    if(dates==""){
      preventform("You already have a cleared pledge history");
    }else{
  //window.plugins.spinnerDialog.show();
  $.post("http://192.168.0.112:8080/clearpledge",{num:window.localStorage.getItem("num")}).then((res)=>{
    //window.plugins.spinnerDialog.hide(); 
    if(res=="\"OK\""){
       navigator.notification.alert("Your pledge history has been successfuly cleared",()=>{
        fetchdata();
       },"",["OK"]);
     }else{
       preventform("An error occurred. Please try again later");
     }
  });
 }
}
}