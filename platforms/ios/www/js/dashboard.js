let code;
window.onload=()=>{
  if(window.localStorage.getItem("verified")!=null && window.localStorage.getItem("verified")=="no"){
    $(".unverified").css("display","block");
  }
  else{
    $(".unverified").css("display","none");
  }
};

document.addEventListener("backbutton",exit);
function preventdialog(e){
    e.preventDefault();
    showdialog();
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
      url:"http://192.168.0.101:8080/verifynum",
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
              url:"http://192.168.0.101:8080/numin",
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