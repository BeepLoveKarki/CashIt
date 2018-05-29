window.onload=()=>{
  $('#main').addClass('animated slideInUp');
  if(window.localStorage.getItem("num")!=null){
    window.location.href="dashboard.html";
  }
};

openFB.init({appId: '2084732608428665'});

document.addEventListener("backbutton",exit);
function exit(e){
  e.preventDefault();
  navigator.app.exitApp();
}


document.getElementById("fyp").addEventListener("click",showfyp);
document.getElementById("buttonup").addEventListener("click",showsignup);
document.getElementById("buttonsignin").addEventListener("click",showsignin);
document.getElementById("buttonin").addEventListener("click",makein);
document.getElementById("buttonsignup").addEventListener("click",passnotmatch);
document.getElementById("buttonfb").addEventListener("click",signinfb);

function makein(){ //signin
  if($.trim($("#walletin").val())==""||$.trim($("#passin").val())==""){
    preventform("Either of the input fields is empty");
  }else if(document.getElementById("walletin").value.length!=10){
    preventform("Please enter a valid wallet number");
  }
  else if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
    preventform("Your offline. Please get connected to internet before proceeding.");
  }else{
     //window.plugins.spinnerDialog.show();
  $.ajax({
    url:$(".signin").attr("action"),
    type:'POST',
    data:$(".signin").serialize(),
    success:function(res){
      let m=$.parseJSON(res);
      //window.plugins.spinnerDialog.hide();
      if(m.status=="OK"){
        startdash($("#walletin").val());
      }else{
        preventform("Account with the provided credentials is not found");
      }
    }
  });
 }
}

function submitsignup(){ //signup form check if exist
  let val=$(".signup").serialize().toString();
  if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
    preventform("Your offline. Please get connected to internet before proceeding.");
  }else{ 
  //window.plugins.spinnerDialog.show();
  $.ajax({
    url:$(".signup").attr("action"),
    type:'POST',
    data:$(".signup").serialize(),
    success:function(res){
      let m=$.parseJSON(res);
      if(m.status!="OK"){
        inserttodb($("#walletup").val());
      }else{
        //window.plugins.spinnerDialog.hide();
        preventform("An account with this wallet number already exists");
      }
    }
  });
}
}

function inserttodb(num){ //sign up backend handle
  if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
    preventform("Your offline. Please get connected to internet before proceeding.");
  }else{
    postforsms(num,1);
 }
}

function inserttodbplz(){ //insert to db finally
   //window.plugins.spinnerDialog.show();
  $.get("http://192.168.0.112:8080/insert").then((res)=>{
     //window.plugins.spinnerDialog.hide();
    let m=$.parseJSON(res);
    if(m.status=="OK"){
      navigator.notification.alert("Account created!!! You may now sign in using these credentials!!!",()=>{
        $(".signup").trigger("reset");
        $("#buttonsignin").click();
      },"",["OK"]);
    }else{
      preventform("An error occured. Please try again.");
    }
  });
}

function passnotmatch(){ //validate sign up form
  if($.trim($("#name").val())==''||$.trim($("#walletup").val())==''||$.trim($("#conwalletup").val())==''||
     $.trim($("#passup").val())==''||$.trim($("#conpassup").val())==''){
         preventform("Either of the input fields is empty");
  }else{
    if(document.getElementById("walletup").value!=document.getElementById("conwalletup").value){
		    preventform("Mobile wallet numbers didn't match. Try again.");     
      }else if(document.getElementById("walletup").value.length!=10 || document.getElementById("conwalletup").value.length!=10 ){
        preventform("Please enter valid wallet numbers in both fields");
      }else{
      if(document.getElementById("passup").value!="" && document.getElementById("conpassup").value!=""){
        if(document.getElementById("passup").value!=document.getElementById("conpassup").value){
          preventform("Passwords didn't match. Try again.");
       }else{
         submitsignup();
       }
      }
  }
}
}

function signinfb(){ //sign in with fb
  if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
    preventform("Your offline. Please get connected to internet before proceeding.");
  }else{
  openFB.login((response) =>{
       if(response.status === 'connected') {
              getfbdata();
       }
     }, {scope: 'email'});
  }
}

function getfbdata(){ //get fb data
 openFB.api({
     path: '/me',
     success: (data) =>{
        fbdatapost(data);
     },
     error:()=>{
	     preventform('Facebook data fetch error. Try again.');
	 }
  });
}

function fbdatapost(data){ //post data from fb
   if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
    preventform("Your offline. Please get connected to internet before proceeding.");
  }else{
    //window.plugins.spinnerDialog.show();
  $.ajax({
    url:"http://192.168.0.112:8080/fb_in",
    type:'POST',
    data:data,
    success:function(res){
      let m=$.parseJSON(res);
      //window.plugins.spinnerDialog.hide();
      if(m.status=="OK"){ //already exists
        startdash(m.num);
      }else{ //not existed
        showfyp(0);
      }
    }
  });
}
}


function preventform(a){ //show alert msg
   navigator.notification.alert(a,null,"",["OK"]);
}


function showfyp(b){ //fyp dialog box
  let c;
  if(b!=0){
    c="Enter your account wallet number";
  }else{
    c="We require to verify your wallet number before proceeding. So, Please enter it below.";
  }
  //window.plugins.numberDialog.promptClear(c, callback, "", ["OK","Cancel"]);
  navigator.notification.prompt(c,callback,'',["OK","Cancel"]);
  function callback(r){
    if(r.buttonIndex==1){
      if(r.input1.length!=10 || isNaN(r.input1)){
        if(b==0){
          navigator.notification.alert("Please enter a valid wallet number",()=>{
             showfyp(0,c);
          },"",["OK"]);
        }else{
          preventform("Please enter a valid wallet number");
        }
      }else{
        checkifwallet(r.input1,b);
      }
    }
  }

}

function checkifwallet(a,b){ //check if wallet already exists
  if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
    preventform("Your offline. Please get connected to internet before proceeding.");
  }else{
  if(b!=0){
     //window.plugins.spinnerDialog.show();
    $.ajax({
      url:"http://192.168.0.112:8080/checkall",
      type:"POST",
      data:a,
      success:(res)=>{
       //window.plugins.spinnerDialog.hide();
       let m=$.parseJSON(res);
       if(m.status=="OK"){
         postforsms(a,b);
       }
       if(m.status=="fb"){
         preventform("This wallet number seems to be the one with facebook account credentials. Please try signing in with facebook.");
       }
       if(m.status=="nOK"){
         preventform("No account found with the entered wallet number");
       }
      }
    })
  }else{
    //window.plugins.spinnerDialog.show();
  $.ajax({
    url:"http://192.168.0.112:8080/checkwallet",
    type:'POST',
    data:a,
    success:(res)=>{
      let m=$.parseJSON(res);
      //window.plugins.spinnerDialog.hide();
      if(m.status!="OK"){
         postforsms(a,0);
      }else{
        preventform("An account with this wallet number already exists");
      }
    }
  });
  }
}
}

function postforsms(a,n){ //post for sending smd
  if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
    preventform("Your offline. Please get connected to internet before proceeding.");
  }else{
   //window.plugins.spinnerDialog.show();
  $.ajax({
    url:"http://192.168.0.112:8080/verifynum",
    type:'POST',
    data:a,
    success:function(res){
      //window.plugins.spinnerDialog.hide();
      let m=$.parseJSON(res);
      if(m.status=="OK"){
         help(a,m,n);
      }else{
        preventform("An error occurred. Please try again.");
      }
    }
  });
}
}

function datastore(num){  //store signup of fb data to db
  if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
    preventform("Your offline. Please get connected to internet before proceeding.");
  }else{
  $.get("http://192.168.0.112:8080/storenow").then((res)=>{
   if(res=="\"OK\""){
      startdash(num);
    }else{
      preventform("An error occurred. Please try again.");
    }
  });
}
}

function datarecover(){ //recover password
 navigator.notification.prompt("Enter new password for your account",(r)=>{
   if(r.buttonIndex==1){
     if(r.input1.length!=0){
       passrecover(r.input1);
     }else{
       navigator.notification.alert("Password cannot be empty",()=>{
          datarecover();
       },"",["OK"]);
     }
   }
 },"",["OK","Cancel"]);
  
 /*let options = {
   title: "",
   message: "Please enter new password for your account",
  };
  PasswordDialogPlugin.showEnterPassword(options,(result)=>{
    if(!result.cancel){
      alert(result.password);
    }
  },(err)=>{
    alert(err.toString());
  });*/

}

function passrecover(data){
  if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
    preventform("Your offline. Please get connected to internet before proceeding.");
  }else{
    //window.plugins.spinnerDialog.show();
  $.ajax({
    url:"http://192.168.0.112:8080/updatepass",
    type:"POST",
    data:data,
    success:(res)=>{
      //window.plugins.spinnerDialog.hide();
      if(res=="\"OK\""){
       preventform("Password updated. You may now log in using new password");
      }else{
        preventform("An error occurred. Please try again later");
      }
    }
  });
}
}

function datastored() { //new data stored
  if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
    preventform("Your offline. Please get connected to internet before proceeding.");
  }else{
    //window.plugins.spinnerDialog.show();
  $.get("http://192.168.0.112:8080/verified").then((result)=>{
   if(result=="\"OK\""){
     //window.plugins.spinnerDialog.hide();
    inserttodbplz();
   }else{
     preventform("An error occurred. Please try again later.");
   }  
  });
}
}

function help(a,m,n){
  //window.plugins.numberDialog.promptClear("Enter the code sent to your wallet device", checkit, "", ["Done","Cancel"]);
  navigator.notification.prompt("Enter the code sent to your wallet device",checkit,"",["Done","Cancel"]);
        function checkit(r){
          if(r.buttonIndex==1){
            if(r.input1==m.num.toString()){ 
            if(n==1){  
               datastored();
             }else if(n==0){
               datastore(a);
             }else{
               datarecover();
             }
            }else{
              navigator.notification.alert("Sorry. The code we sent U didn't match the one you entered. Please try again.",()=>{
                 help(a,m,n);
              },"",["OK"]);
            }
          }
        }
}

function startdash(num){ //function to start dashboard val==1 for fb and 0 for manual
  window.localStorage.setItem("num",num);
   window.location.href="dashboard.html";
}

function showsignup(){
   $(".signin").css("display","none");
   $(".signup").addClass("animated slideInLeft");
   $(".signup").css("display","block");
}

function showsignin(){
  $(".signin").addClass("animated slideInRight");
  $(".signin").css("display","block");
   $(".signup").css("display","none");
}

