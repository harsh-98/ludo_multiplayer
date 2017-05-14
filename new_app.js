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
app.get("/",function(req,res){
        res.sendFile(__dirname+"/ludo2.html");
});
app.get("/ludo2.js",function(req,res){
	res.sendFile(__dirname+"/ludo2.js");
});
console.log("hi there");

var SOCKET_LIST={};
var num_player=0;
var array=[0,0,0,0];
var io=require("socket.io")(serv,{});
io.sockets.on("connection",function(socket){
	
	
	console.log("socket connection"+ num_player);
	SOCKET_LIST[num_player]=socket;
	
	socket.on("disconnect",function(){
		console.log(SOCKET_LIST.length);
		var endgame_user=socket.user_name;
		if(socket.user_name!=null)
		for (var i in SOCKET_LIST){
			console.log("dele");
			
			SOCKET_LIST[i].emit("endgame",endgame_user);
			delete SOCKET_LIST[i];
			for(i=0;i<4;i++)
				array[i]=0;

		}
		num_player=0;
		
		console.log(SOCKET_LIST);
	});
		socket.on("user_name",function(user_name){

			socket.user_name=user_name;
			socket.num=num_player;
			array[num_player]=user_name;
			num_player++;

			console.log(SOCKET_LIST);
		for (var i in SOCKET_LIST){
			//console.log(SOCKET_LIST[i].user_name);
			SOCKET_LIST[i].emit("player_name",array);
			

		}
			//console.log(socket.user_name);
			socket.emit("this_player_assigned",num_player);
		});
		socket.on("players_given",function(data){

			for(var i in SOCKET_LIST){
				SOCKET_LIST[i].emit("no_of_player",data);
				//console.log("data sent"+data,SOCKET_LIST[i].user_name);

			}
		});
		socket.on("roll",function(data){

			for(var i in SOCKET_LIST){
				SOCKET_LIST[i].emit("roll_emit",data);
				//console.log("data sent"+data,SOCKET_LIST[i].user_name);

			}
		});
		socket.on("choose",function(data){

			for(var i in SOCKET_LIST){
				//console.log(data);
				SOCKET_LIST[i].emit("choose_emit",data);
				//console.log("data sent"+data,SOCKET_LIST[i].user_name);

			}
		});
		socket.on("won",function(data){
			var name=null;
			for (var i in SOCKET_LIST){
				if(SOCKET_LIST[i].id==data){
					name=SOCKET_LIST[i].user_name;
				}
			}
			//console.log(SOCKET_LIST);
			for(var i in SOCKET_LIST){
				SOCKET_LIST[i].emit("won_emit",name);
				//console.log("data sent"+data,SOCKET_LIST[i].user_name);
			}
		});
		socket.on("data_send",function(data){
			//for (var i in SOCKET_LIST){
//				//console.log(SOCKET_LIST[i].num==data.id);
//				if(SOCKET_LIST[i].num==2){
//					name=SOCKET_LIST[i].user_name;
//}			}
			for(var i in SOCKET_LIST){
				console.log(data);
				var c=data.jk+" by "+ socket.user_name;
				if(data.move_num!=0){c+=" the dice roll gives  "+ data.move_num;}
				SOCKET_LIST[i].emit("data_receive",c);
				//console.log("data sent"+data,SOCKET_LIST[i].user_name);

			}
		});

		socket.on("allow_part",function(data){
			for(var i in SOCKET_LIST){
				console.log("emitted");
				SOCKET_LIST[i].emit("allow_part_emit",data);
				//console.log("data sent"+data,SOCKET_LIST[i].user_name);
			}
		});
	
});
/*setInterval(function(){
	for (var i in SOCKET_LIST){
		if(SOCKET_LIST[i].user_name==null){
			delete SOCKET_LIST[i];
		}
	}
},10);*/
