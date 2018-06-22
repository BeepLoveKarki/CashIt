let text,stats,fcount;
let socket = io.connect('http://192.168.0.109:8080');

function notificationgain(){
  socket.emit('number',window.localStorage.getItem("num"));
  socket.on('notification', function (data) {
    fcount=0;
    let m=$.parseJSON(data);
    text=m.text.split(",").reverse();
    stats=m.status.split(",").reverse();
    text.shift();
    stats.shift();
    $(".notify").empty();
    if(text.length==0){
      $(".notify").append("<h5 id=\"noticen\" class=\"text-center\">No any info found</h5>");
    }else{
    text.forEach((val,index) => {
      $(".notify").append("<p id=\"notice"+index+"\">"+val+"</p><hr>");
      if(stats[index]=="false"){
         fcount++;
         $("#notice"+index).css("font-weight","500");
      }else{
         $("#notice"+index).css("font-weight","400");
      }
      if(fcount!=0){
        $(".infotab").html("Info<span class=\"badge badge-light\">"+fcount.toString()+"</span>");
      }else{
        $(".infotab").html("Info");
      }
    });
   }
  });
}

function makeseen(){
 if(text.length!=0){
  if(navigator.connection.type==Connection.UNKNOWN||navigator.connection.type==Connection.NONE){
    preventform("Your offline. Please get connected to internet before proceeding.");
  }else{
  //SpinnerDialog.show();
  $.post("http://192.168.0.109:8080/sendseen",{num:window.localStorage.getItem("num")}).then((res)=>{
   //SpinnerDialog.show();  
  },(err)=>{
    //SpinnerDialog.hide();
    preventform("An expected error occurred. Please try again later");
  });
  }
 }
}