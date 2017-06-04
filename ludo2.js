

var k = 0,
    turn = 0,
    allow = 1,
    player_assign_allow = 1,
    sel = 1,
    no = 0,
    //allow_part allows u to move the new part and by allow_part and no==6 if assigned then allow_part is ==0
    // allow to move part
    // used for the choose to be allowed only when roll has been perform first
    // after rolling move part , choose part and allow_new_part can happen
    allow_part = 1;
var x1 = 0;
var user1, user2, user3, user4;
var socket = io();
//socket.emit("moved");
var player_id = 0,rolling_allow=1;
var allow_tousethechance_after_current_move=1;

//entering a room 


socket.on('connect', function() {
   // Connected, let's sign-up for to receive messages for this room
   socket.emit('room', location.hash.split("#").pop());
});

// entering a room


// user name prompt
$(document).ready(function() {
    var name = prompt("ENTER YOUR NAME");
    if (name != null) {
        socket.user_name=name;
        socket.emit("user_name", name);
    }

});
// user name prompt end 



// socket function and  on emit 
socket.on("data_receive",function(data){
    document.getElementById("demo").innerHTML=data;
});
socket.on("this_player_assigned", function(player_number) {
    alert("You are assigned player " + player_number);
    player_id = player_number;
});

socket.on("namespace",function(data){
    history.pushState(null, null,"#"+data);
});
socket.on("endgame", function(player_name) {
    var confirmation = confirm(" " + player_name + "  left the game so ,, \n Do you want to start a new game ??");
    if (confirmation == true)
        game.new_game();
});


socket.on("no_of_player", function(data_) {
    //console.log(data1);
    k = data_;
    game.user_assign(0);
});
socket.on("roll_emit", function(data_) {
    no = data_;
    game.roll(0);
});
socket.on("choose_emit", function(data_) {
    game.choose(data_);
});
socket.on("won_emit", function(data_) {
    alert(data_ + " won the game ");
    console.log("a");
});
socket.on("allow_part_emit",function(data){
    game.allow_new_part(data);
});
socket.on("player_name",function(array_emit){
    console.log("addd");
    var data_="";

for(i=0;i<4;i++){
    
    switch(i){
        case 0:
        if (array_emit[i]!=0)data_+="user1=green  --"+array_emit[i]+" <br>";
        break;
        case 1:
        if (array_emit[i]!=0)data_+="user2=red  --"+array_emit[i]+" <br>";
        break;
        case 2:
        if (array_emit[i]!=0)data_+="user3=blue  --"+array_emit[i]+" <br>";
        break;
        case 3:
        if (array_emit[i]!=0)data_+="user4=yellow  --"+array_emit[i]+" <br>";
        break;

    }
    
}document.getElementById('player_name').innerHTML=data_;
});
// socket end

socket.on("pass_received",function(data){
    game.pass();
});

// user defined 
function user(color, position_array, parts_in, color_half, starting_position, id_of_player) {
    this.color = color;
    this.position_array = position_array;
    this.starting_position = starting_position;
    this.parts_in = parts_in;
    this.color_half = color_half;
    this.id_of_player = id_of_player;

}

//user assignment end


//games feature function 
var game = {
    roll: function(emit = 1) {
        console.log(turn + 1 == player_id);
        if (emit && turn + 1 == player_id && rolling_allow==1) {
            if (x1 == 0) {
                no = Math.ceil(Math.random() * 6);
                document.getElementById("roll").value = no;
                x1 = 10;
                socket.emit("roll", no);
            } else if (x1 == 20) {
                document.getElementById("roll").value = no;

                socket.emit("roll", no);


            }
        }
        allow = 1;
        allow_part = 1;
        rolling_allow=0;
    },


    roll_god: function() {
        no = 6;
        x1 = 20;
         socket.emit("roll", no);       
    },
    roll_cracked: function() {
        no = document.getElementById("roll").value;
        allow = 1;
        allow_part = 1;

    },
    user_assign: function(emit = 1) {

        if (player_assign_allow == 1) {
            if (document.getElementById("user").value)
                k = parseInt(document.getElementById("user").value);

            if (emit == 1)
                socket.emit("players_given", k);
            switch (k) {
                case 4:
                    user4 = new user("yellow", [0, 40, 40, 40, 40, 0, 0, 0, 0], 4, "yel-", 40, 4);
                    general_operation.dead("yel-1");
                    user4.position_array[5] = 1;
                    general_operation.make("40", user4.color);
                    //user4_playing_parts--;
                case 3:
                    user3 = new user("blue", [0, 27, 27, 27, 27, 0, 0, 0, 0], 4, "blu-", 27, 3);
                    general_operation.dead("blu-1");
                    general_operation.make("27", user3.color);
                    user3.position_array[5] = 1;
                    //user3_playing_parts--;
                case 2:
                    user2 = new user("red", [0, 14, 14, 14, 14, 0, 0, 0, 0], 4, "red-", 14, 2);
                    general_operation.dead("red-1");
                    general_operation.make("14", user2.color);
                    user2.position_array[5] = 1;
                    //user2_playing_parts--;
                case 1:
                    user1 = new user("green", [0, 1, 1, 1, 1, 0, 0, 0, 0], 4, "gre-", 1, 1);
                    general_operation.dead("gre-1");
                    general_operation.make("1", user1.color);
                    user1.position_array[5] = 1;
                    //user1_playing_parts--;

            }
        }
        player_assign_allow = 0;
    },

    pass: function() {
        console.log("pass");
        turn = (turn + 1) % k;
        rolling_allow=1;
        allow=1;
        allow_tousethechance_after_current_move=1;

    },
    new_game: function() {
        window.location = "/";
    },
    choose: function(x) {
        if (allow == 1) {

            switch (turn) {
                case 0:
                    var arr = user1.position_array;
                    break;
                case 1:
                    var arr = user2.position_array;
                    break;
                case 2:
                    var arr = user3.position_array;
                    break;
                case 3:
                    var arr = user4.position_array;
                    break;
            }
            if (x == 1 && arr[5] == 1) {
                sel = 1;
                game.move();
                socket.emit("choose", x);
            allow = 0;
            }
            if (x == 2 && arr[6] == 1) {
                sel = 2;
                game.move();
                socket.emit("choose", x);
            allow = 0;
            }
            if (x == 3 && arr[7] == 1) {
                sel = 3;
                game.move();
                socket.emit("choose", x);
            allow = 0;
            }
            if (x == 4 && arr[8] == 1) {
                sel = 4;
                game.move();
                socket.emit("choose", x);
            allow = 0;
            }


            
        }
    },
    uniKeyCode: function(event) {
        var key_num = event.keyCode;
        if (key_num == 83) {
            game.user_assign();
            document.getElementById("user").value = "";
            document.getElementById("user").blur();
            jk = "the number of players is selected";

        }
         if (key_num == 70) {
            document.getElementById("user").focus();
            document.getElementById("user").value = "";
            jk = "enter the number of players";

        }
        if(turn+1==player_id && allow_tousethechance_after_current_move){
        
        ////console.log(key_num);
        var jk="";
        if (key_num == 82) {
            game.roll();
            jk = "rolling the dice";
        }
        if (key_num == 78) {
            socket.emit("allow_part",0);
            jk = "allowing new part";
        }
        if (key_num == 96) {
            socket.emit("pass", null);
            jk = "passed the chance to the new player";
        }
       
        
        if (key_num == 97) {
            game.choose(1);
            jk = "moving the part 1";

        }
        if (key_num == 98) {
            game.choose(2);
            jk = "moving the part 2";

        }
        if (key_num == 99) {
            game.choose(3);
            jk = "moving the part 3";

        }
        if (key_num == 100) {
            game.choose(4);
            jk = "moving the part 4";

        }

        // 6 is out come
        if (key_num == 90) {
            game.roll_god();
            //console.log(key_num);
        }
        // enter the no of move
        if (key_num == 65) {
            document.getElementById("roll").focus();
            document.getElementById("roll").value = "";
        }
        if (key_num == 66) {
            no = parseInt(document.getElementById('roll').value);
            socket.emit("roll", no);
            document.getElementById('roll').value = "";
            document.getElementById("roll").blur();
            allow = 1;
            allow_part = 1;

        }
socket.emit("data_send",{jk:jk,move_num:no});
//socket.emit("data_send",{jk:jk,id:player_id});

}
    },


    allow_new_part: function(index_) {
        if (no == 6 && allow_part == 1) {
            switch (turn) {
                case 0:
                    general_operation.del_insert(user1, index_);
                    break;
                case 1:
                    general_operation.del_insert(user2, index_);
                    break;
                case 2:
                    general_operation.del_insert(user3, index_);
                    break;
                case 3:
                    general_operation.del_insert(user4, index_);
                    break;
            }
        }
                    allow=0;
                    allow_part=0;
                    x1 = 0;
                    rolling_allow=1;
},
    which_user: function() {
        switch (player_id) {
            case 1:
                return user1;
                break;
            case 2:
                return user2;
                break;
            case 3:
                return user3;
                break;
            case 4:
                return user4;
                break;
        }
    },
    won: function() {
        console.log("hi");
        user_decided = game.which_user();
        if (user_decided) {
            var j = 0;
            for (i = 1; i <= 4; i++) {
                if (user_decided.position_array[i] > player_id * 100 + 5) {
                    j++;
                    console.log("hi");
                }
                if (j == 4) socket.emit("won", socket.user_name);
            }
        }
    },
    move: function() {
        allow_tousethechance_after_current_move=0;
        if (allow == 1 && no) {
            var t = 0;
            var color = "";
            switch (turn) {
                case 0:
                    t = user1.position_array[sel];
                    color = user1.color;
                    color1 = "rgb(0, 128, 0)";
                    break;
                case 1:
                    t = user2.position_array[sel];
                    color = user2.color;
                    color1 = "rgb(255, 0, 0)";
                    break;
                case 2:
                    t = user3.position_array[sel];
                    color = user3.color;
                    color1 = "rgb(0, 0, 255)";
                    break;
                case 3:
                    t = user4.position_array[sel];
                    color = user4.color;
                    color1 = "rgb(255, 255, 0)";
                    break;
            }
            console.log(turn);

            for (i = 1; i <= no; i++) {
                if (!(t > 405 || (t > 105 && t < 200) || (t > 205 && t < 300) || (t > 305 && t < 400))) {

                    setTimeout(
                        (function(x, sel) {
                            var ele_color = document.getElementById(x.toString());
                            //console.log(x.toString());
                            //console.log(ele_color);
                            for (i = 0; i < ele_color.childNodes.length; i++) {
                                ////console.log(color1);
                                ////console.log($(ele_color.childNodes[i]).css("background-color"));
                                if (ele_color.childNodes[i].innerHTML == sel && $(ele_color.childNodes[i]).css("background-color") == color1) {

                                    //console.log(color1);
                                    ele = ele_color.childNodes[i];
                                    break;
                                }
                            }
                            //console.log(ele);
                            document.getElementById(x.toString()).removeChild(ele);

                        }).bind(this, t, sel), 500 * i - 250);
                    //  else {
                    //                setTimeout(
                    //                    (function(x) {
                    //                        general_operation.dead(x);//

                    //                    }).bind(this, t), 500 * i - 250);

                    t++;
                    if (t == 53) {
                        t = 1;
                    }
                    if (t == 52 && color == "green") t = 101;
                    if (t == 13 && color == "red") t = 201;

                    if (t == 26 && color == "blue") t = 401;

                    if (t == 39 && color == "yellow") t = 301;
                    if (!(t > 405 || (t > 105 && t < 200) || (t > 205 && t < 300) || (t > 305 && t < 400))) {

                        setTimeout(function(y, color, sel) {
                            general_operation.make(y, color, sel);
                        }.bind(this, t, color, sel), 500 * i);
                    }
                }
            }

                setTimeout(
                    (function(turn1, t) {
            if (!(t > 405 || (t > 105 && t < 200) || (t > 205 && t < 300) || (t > 305 && t < 400))) {
                        if (document.getElementById(t).childNodes[1] != null)
                            var ele_2_die = document.getElementById(t).childNodes[1].innerHTML;
                        //us1p is like is for whether the player is playing or not
                        if (t == 1 || t == 14 || t == 27 || t == 40) {} else
                            for (sel1 = 1; sel1 <= 4; sel1++)

                                if (user1 && turn1 != 0 && t == user1.position_array[sel1])

                        {
                            general_operation.lose_part(t, ele_2_die, user1);
                        } else if (user2 && turn1 != 1 && t == user2.position_array[sel1])

                        {
                            general_operation.lose_part(t, ele_2_die, user2);
                        } else if (user3 && turn1 != 2 && t == user3.position_array[sel1])

                        {
                            general_operation.lose_part(t, ele_2_die, user3);
                        } else if (user4 && turn1 != 3 && t == user4.position_array[sel1])

                        {
                            general_operation.lose_part(t, ele_2_die, user4);
                        }
}  if (no != 6)
                game.next_player();
            if (no==6)allow=1;
                 no = 0;
                 allow_tousethechance_after_current_move=1;
                    }).bind(this, turn, t), 500 * i - 250);
            
            switch (turn) {
                case 0:
                    user1.position_array[sel] = t;
                    break;
                case 1:
                    user2.position_array[sel] = t;
                    break;
                case 2:
                    user3.position_array[sel] = t;
                    break;
                case 3:
                    user4.position_array[sel] = t;
                    break;
            }



           
            allow=0;
            sel = 1;
            console.log("hiii");
            x1 = 0;
           
            rolling_allow=1;
            setTimeout(function() {
                game.won();
                console.log(i);
            }, i * 500 + 500);
        }
    },
    next_player: function() {
       
        turn++;
        turn %= k;
    }




};
// games feature end


// general operations 
var general_operation = {
    make: function(y, color_, sel = 1, i = 0,add_click_handling=0) {
        //console.log(sel);
        var a = document.createElement("div");
        if (i == 0)
            $(a).addClass("circle").css("background-color", color_);
        if(add_click_handling==0)
        $(a).attr("onclick", "handler("+sel.toString()+",'"+color_+"')");
        else
        $(a).attr("onclick", "allow_handler("+sel.toString()+",'"+color_+"')");
        $(a).text(sel);
        var y_node = document.getElementById(y);

        if (y_node.childNodes[0] != null) {
            var first_element_i = y_node.childNodes[0];
            y_node.insertBefore(a, first_element_i);
        } else
            y_node.appendChild(a);
    },
    dead: function(x) {
        document.getElementById(x.toString()).removeChild(document.getElementById(x.toString()).firstElementChild);

    },
    dead_last: function(x) {
        document.getElementById(x.toString()).removeChild(document.getElementById(x.toString()).lastElementChild);

    },
    /*del_insert check whether is there a part of the current player which is no out if there then
     del it and produce a part in the starting postion for the player*/
    del_insert: function(user_name, index_=0) {
        if (user_name.parts_in != 0) {
            user_name.parts_in--;
            if(index_==0){
            for (i = 1; i <= 4; i++)
                if (document.getElementById(user_name.color_half + i).childNodes[0] != null) {
                    user_name.position_array[i + 4] = 1;
                    general_operation.dead(user_name.color_half + i);

                    general_operation.make(user_name.starting_position, user_name.color, i);
                    break;
                }}
            else{
                if (document.getElementById(user_name.color_half + index_).childNodes[0] != null) {
                    user_name.position_array[index_ + 4] = 1;
                    general_operation.dead(user_name.color_half + index_);
                    general_operation.make(user_name.starting_position, user_name.color, index_);
                }
            }


        }
    },
    lose_part: function(t, ele_2_die, user_name) {
        //console.log(t);
        general_operation.dead_last(t);
        user_name.position_array[ele_2_die] = 1;
        general_operation.make(user_name.color_half + ele_2_die, user_name.color, ele_2_die,0, 1);
        user_name.position_array[sel1 + 4] = 0;
        user_name.parts_in++;
    }
};
//general operations end


// Event Listener  are added 
$(document).ready(function() {
    document.querySelector("#roll_button").addEventListener("click", game.roll);
    document.querySelector("#assign_user").addEventListener("click", function(){
        game.user_assign();
            document.getElementById("user").value = "";
            document.getElementById("user").blur();
            //jk = "the number of players is selected";
    });
    document.querySelector("#body").addEventListener("keyup", game.uniKeyCode);
    

    //document.querySelector("#roll_crack").addEventListener("click", game.roll_cracked);
});
//EventListener end

function intr_handler(a=0){
    if (a==0)
    document.getElementById("intrs").style.display="none";
else if (a==1)
    document.getElementById("intrs").style.display="none";
}

function handler(selector,color_){
   if(token(color_)) game.choose(selector);
}

function allow_handler(index_, color_){
        if(token(color_)) socket.emit("allow_part",index_);
}
function token(color_){
    var color_array=["","green", "red", "blue", "yellow"];
    if(turn+1==player_id && allow_tousethechance_after_current_move)
        if(color_array[player_id]==color_)return 1;
            return 0;
}
