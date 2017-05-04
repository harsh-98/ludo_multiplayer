var express =require("express");
var app=express();
var serv=require("http").Server(app);
serv.listen(10101);
//app.listen(10101);
app.use("/assets",express.static("assets"));

app.get("/ludo.css",function(req,res){
		res.sendFile(__dirname+"/ludo.css");
});
app.get("/ludo2.html",function(req,res){
	res.sendFile(__dirname+"/ludo2.html");
});
app.get("/ludo2.js",function(req,res){
	res.sendFile(__dirname+"/ludo2.js");
});
console.log("hi there");

var SOCKET_LIST={};
var num_player=0;
var io=require("socket.io")(serv,{});
io.sockets.on("connection",function(socket){
	
	
	console.log("socket connection"+ num_player);
	SOCKET_LIST[num_player]=socket;
	
	socket.on("disconnect",function(){
		var endgame_user=socket.user_name;
		for (var i in SOCKET_LIST){
			console.log("dele");
			SOCKET_LIST[i].emit("endgame",endgame_user);
			delete SOCKET_LIST[i];
			

		}
		num_player=0;
		
		console.log(SOCKET_LIST);
	});
		socket.on("user_name",function(user_name){
			socket.user_name=user_name;
			socket.id=num_player;
		num_player++;for (var i in SOCKET_LIST){
			console.log(SOCKET_LIST[i].user_name);
			

		}
			console.log(socket.user_name);
			socket.emit("player_assigned",num_player);
		});


	
});
