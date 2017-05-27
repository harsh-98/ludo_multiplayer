var express =require("express");
var app=express();
var serv=require("http").Server(app);
var md5=require("md5");
serv.listen(process.env.PORT || 10101);
console.log(process.env.PORT);
//app.listen(10101);
app.use("/assets",express.static("assets"));

app.get("/ludo.css",function(req,res){
		res.sendFile(__dirname+"/ludo.css");
});
app.get("/ludo2.html",function(req,res){
	res.sendFile(__dirname+"/ludo2.html");
});
app.get("/",function(req,res){
        res.sendFile(__dirname+"/ludo2.html");
});
app.get("/ludo2.js",function(req,res){
	res.sendFile(__dirname+"/ludo2.js");
});
console.log("hi there");



var SOCKET_ROOM={};
var num_player=0;

var io=require("socket.io")(serv,{});
io.sockets.on("connection",function(socket){
	
	socket.on('room', function(room) {
		if(room==""){room=md5(Math.random());socket.emit("namespace",room);}
		if(!SOCKET_ROOM[room])SOCKET_ROOM[room]={};
		if(!SOCKET_ROOM[room]["no_of_player"])SOCKET_ROOM[room]["no_of_player"]=0;

		console.log("socket connection "+ num_player);
		SOCKET_ROOM[room][SOCKET_ROOM[room]["no_of_player"]++]=socket;
		socket.room=room;
        socket.join(room);
    });

	
	
	socket.on("disconnect",function(){
		//console.log(SOCKET_ROOM[socket.room].length);
		var endgame_user=socket.user_name;
			io.sockets.in(socket.room).emit("endgame",socket.user_name);
		if(socket.user_name!=null)
		
		delete SOCKET_ROOM[socket.room];
		
		
		
		//console.log(SOCKET_LIST);
	});
		socket.on("user_name",function(user_name){
			
			if(!SOCKET_ROOM[socket.room]["array"])SOCKET_ROOM[socket.room]["array"]=[0,0,0,0];
			socket.user_name=user_name;
			console.log(socket.room);
			num_player=SOCKET_ROOM[socket.room]["no_of_player"]-1;
			socket.num=num_player;
			SOCKET_ROOM[socket.room]["array"][num_player]=user_name;											
																		

			//console.log(SOCKET_LIST);
		
			//console.log(SOCKET_LIST[i].user_name);
			io.sockets.in(socket.room).emit("player_name",SOCKET_ROOM[socket.room]["array"]);
			

		
			//console.log(socket.user_name);
			socket.emit("this_player_assigned",num_player+1);
		});
		socket.on("players_given",function(data){

		
				io.sockets.in(socket.room).emit("no_of_player",data);
				//console.log("data sent"+data,SOCKET_LIST[i].user_name);

			
		});
		socket.on("roll",function(data){

			
				io.sockets.in(socket.room).emit("roll_emit",data);
				//console.log("data sent"+data,SOCKET_LIST[i].user_name);

			
		});
		socket.on("choose",function(data){

			
				//console.log(data);
				io.sockets.in(socket.room).emit("choose_emit",data);
				//console.log("data sent"+data,SOCKET_LIST[i].user_name);

			
		});
		socket.on("won",function(data){
			
			//console.log(SOCKET_LIST);
			
				io.sockets.in(socket.room).emit("won_emit",data);
				//console.log("data sent"+data,SOCKET_LIST[i].user_name);
			
		});
		socket.on("data_send",function(data){
			//for (var i in SOCKET_LIST){
//				//console.log(SOCKET_LIST[i].num==data.id);
//				if(SOCKET_LIST[i].num==2){
//					name=SOCKET_LIST[i].user_name;
//}			}
			
				console.log(data);
				var c=data.jk+" by "+ socket.user_name;
				if(data.move_num!=0){c+=" the dice roll gives  "+ data.move_num;}
				io.sockets.in(socket.room).emit("data_receive",c);
				//console.log("data sent"+data,SOCKET_LIST[i].user_name);

			
		});

		socket.on("pass", function(data){
			console.log("passed");
			io.sockets.in(socket.room).emit("pass_received", data);
		});

		socket.on("allow_part",function(data){
			
				console.log("emitted");
				io.sockets.in(socket.room).emit("allow_part_emit",data);
				//console.log("data sent"+data,SOCKET_LIST[i].user_name);
			
		});
	
});
/*setInterval(function(){
	for (var i in SOCKET_LIST){
		if(SOCKET_LIST[i].user_name==null){
			delete SOCKET_LIST[i];
		}
	}
},10);*/
