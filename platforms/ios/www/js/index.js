window.onload=()=>{
	$('#main').addClass('animated slideInUp');
};

openFB.init({appId: '2084732608428665'});

document.getElementById("fyp").addEventListener("click",showfyp);
document.getElementById("buttonup").addEventListener("click",showsignup);
document.getElementById("buttonsignin").addEventListener("click",showsignin);
document.getElementById("buttonsignup").addEventListener("click",passnotmatch);
document.getElementById("buttonfb").addEventListener("click",signinfb);

function passnotmatch(){

  if(document.getElementById("walletup").value!="" && document.getElementById("conwalletup").value!=""){
     if(document.getElementById("walletup").value!=document.getElementById("conwalletup").value){
		 preventform("Mobile wallet numbers didn't match!!! Try again!!!");
	 }else{
	   $('.signup').attr('onsubmit','return true;');
	 }
  }
  
  if(document.getElementById("passup").value!="" && document.getElementById("conpassup").value!=""){
     if(document.getElementById("passup").value!=document.getElementById("conpassup").value){
	    preventform("Passwords didn't match!!! Try again!!!");
	 }else{
	   $('.signup').attr('onsubmit','return true;');
	 }
  }

}

function signinfb(){
  openFB.login((response) =>{
       if(response.status === 'connected') {
              getfbdata();
       }
     }, {scope: 'email'});
}

function getfbdata(){
 openFB.api({
     path: '/me',
     success: (data) =>{
          alert(JSON.stringify(data));
     },
     error:()=>{
	     alert('Facebook data fetch error!!!');
	 }
  });
}


function preventform(a){
   $('.signup').attr('onsubmit','return false;');
   alert(a);
}


function showfyp(){
  $(".wrapper").css("position","fixed");
  $("#fyp-modal").modal("show");
  document.addEventListener("backbutton",onBackKey,false);
  
  function onBackKey(e){
    e.preventDefault();
	$("#fyp-modal").modal("hide");
	document.removeEventListener("backbutton",onBackKey,false);
  }
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

