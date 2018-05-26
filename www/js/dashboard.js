let code,coins,dates;
window.onload=()=>{
  if(window.localStorage.getItem("verified")!=null && window.localStorage.getItem("verified")=="no"){
    $(".unverified").css("display","block");
  }
  else{
    $(".unverified").css("display","none");
    fetchdata();
  }
};

document.addEventListener("backbutton",exit);
document.getElementById("pledge").addEventListener("click",pledging);

function pledging(){
  if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
    preventform("Your offline. Please get connected to internet before proceeding.");
  }else{
    if(parseInt(coins)<50){
       preventform("You need at least 50 coins in your bucket to pledge. Please load some coins from Load Coin option under top left bar button.");
    }else{
   //window.plugins.spinnerDialog.show();
   $.post("http://192.168.0.112:8080/pledge",{date:new Date(),number:window.localStorage.getItem("num")}).then((res)=>{
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
   $("#name").text(m.name);
   $("#coins").text("Coins:"+m.coins);
   $("#uid").append("User Id: "+m.uid);
   $("#wallet").append("Wallet: "+window.localStorage.getItem("num"));
   if(m.dates==""){
     $(".trans").css({
       "background-color":"#DB7093",
       "color":"#FFFFFF",
       "border-radius": "10px",
       "margin-left": "40px",
       "margin-right": "42px"
     });
     $(".trans-head").css("display","none");
     $(".trans").html("<h5 class=\"text-center\" id=\"no-pledge\">You have no any pledge history</h5>");
   }else{
     $(".trans-head").css({
       "display":"block",
       });
     $(".trans").empty();
     $(".trans").css({
      "background-color":"#FFFFFF",
      "color":"#000000",
      "margin-left":"0px",
      "margin-right":"0px"
     });
      m.dates=m.dates.slice(0,-1);
      m.dates.split(",").reverse().forEach(element => {
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
        $(".trans").append("<div class=\"date\">"+"<span id=\"fdate\">"+fdate+"</span><span id=\"time\"> "+ftime+"</span><span class=\"pull-right\" id=\"mon\">50 GHC</span></div>");
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
     loadnow();
     break;
    case 3:
     clearpledge();
     break;
  }
}

function loadnow(){
  //window.plugins.numberDialog.promptClear("Please enter the number of coins to load \(1 coin = 1 GHC\)",loadfund,"",["OK","Cancel"]);
  navigator.notification.prompt("Please enter the number of coins to load \(1 coin = 1 GHC\)",loadfund,"",["OK","Cancel"]);
  
  function loadfund(r){
  if(r.buttonIndex==1){
    if(isNaN(r.input1)|| r.input1.length==0 || Math.sign(r.input1)!=1){
       navigator.notification.alert("Please enter a valid number of coins",()=>{
          loadnow();
       },["OK"]);
    }else{
     if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
        preventform("Your offline. Please get connected to internet before proceeding.");
    }else{
       //window.plugins.spinnerDialog.show();
      $.post("http://192.168.0.112:8080/loadfund",{num:window.localStorage.getItem("num"),amt:r.input1}).then((res)=>{
        //window.plugins.spinnerDialog.hide(); 
       if(res=="\"OK\""){
          navigator.notification.alert("Fund has been successfully loaded",()=>{
            fetchdata();
          },["OK"]);
        }else{
          preventform("An error occurred. Please try again later");
        }
      });
    }
  } 
  }
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