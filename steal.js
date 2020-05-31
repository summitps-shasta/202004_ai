var bot = require("./bot"); //Don't change this
bot.hostURL = 'http://TEACHERWORKSPACENAME-TEACHERUSERNAME.c9users.io'; //Put the server url/IP adress here!
bot.key = "BOTKEYHERE"; //Set your bot key to this string!

/* TEST CODE */
bot.testHostURL = 'http://127.0.0.1:8080'; //Put the server url/IP adress here!
//  bot.testHostURL = 'http://STUDENTWORKSPACENAME-STUDENTUSERNAME.c9users.io';  //  stay tuned for this!
bot.testKey = "testrun"; //Do Not Change This Key!
bot.isTest = true;
/* End Test Code */
/***************************************************/
//Write your code in this function!!!
bot.direction = function(game) {
    
    /* ~~~ Determines and Organizes Data About The Game ~~~ */
    var enemyBots = [];
    var enemyBases = [];
    var myDir = "none";

    var dirs = ["north", "east", "south", "west"];

    for (let i = 0; i < game.players.length; i++) { //Adds all other bots to the enemyBots array.
        if (game.players[i].id != game.myBot.id) {
            enemyBases.push(game.bases[i]); //Adds all other bases to the enemyBases array
            enemyBots.push(game.players[i]);
        }
    }

    var mostFlower = game.flowers[0];
    
    // find enemy bot with most pollen
    var enemyMostPollen = enemyBots[0];
    for(i=0; i<enemyBots.length; i++){
        if(enemyBots[i].pollen>enemyMostPollen.pollen){
          enemyMostPollen=enemyBots[i];
        }
    };
    //find enemy's target flower
        var enemysMostFlower = game.flowers[0];
        for(i=0;i<game.flowers.length;i++){
            if(enemysMostFlower.pollen/bot.findDistance(enemyMostPollen.pos,enemysMostFlower.pos)
            <game.flowers[i].pollen/bot.findDistance(enemyMostPollen.pos,game.flowers[i].pos)){
                enemysMostFlower = game.flowers[i];
            }
        }
    
    for (var i = 0; i < game.flowers.length; i++) {
        if (mostFlower.pollen/bot.findDistance(mostFlower.pos,game.myBot.pos)
        < game.flowers[i].pollen/bot.findDistance(game.flowers[i].pos,game.myBot.pos)) {
            mostFlower = game.flowers[i];
        }
    }

    var stepsToBase = bot.findDistance(game.myBot.pos, game.myBase.pos);
    var turnsLeft = game.totalTurns - game.turn;

    /* ~~ This code decides what to do ~~ */
    var task = "flower"

    if (game.myBot.pollen >= 200) {
        task = "myBase";
    }
    else if (stepsToBase * game.players.length >= turnsLeft) {
        task = "myBase";
    }
    else if(game.myBot.pollen+20<enemyMostPollen.pollen &&
    bot.findDistance(game.myBot.pos,enemysMostFlower.pos)<bot.findDistance(enemyMostPollen.pos,enemysMostFlower.pos)){
        task = "stealBee";
        console.log("stealing");
    }


    /* ~~This code decides how to do it ~~ */
    if (task == "none") {
        console.log("Going random!")
        myDir = dirs[Math.floor(Math.random() * 4)];
    }
    else if (task == "flower") {
        console.log("Going to flower with the most pollen!")
        myDir = bot.nextStep(game.myBot.pos, mostFlower.pos);
    } 
    else if (task == "myBase") {
        myDir = bot.nextStep(game.myBot.pos, game.myBase.pos);
    } 
    else if (task == "stealBee"){
        myDir = bot.nextStep(enemyMostPollen.pos,enemysMostFlower.pos);
    }

    return myDir;
} //DO NOT CHANGE ANYTHING BELOW THIS LINE
bot();
