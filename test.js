var bot = require("./bot"); //Don't change this
bot.hostURL = 'http://TEACHERWORKSPACENAME-TEACHERUSERNAME.c9users.io'; //Put the server url/IP adress here!
bot.key = "BOTKEYHERE"; //Set your bot key to this string!

/* TEST CODE */
bot.testHostURL = 'http://127.0.0.1:3000'; //Put the server url/IP adress here!
//  bot.testHostURL = 'http://STUDENTWORKSPACENAME-STUDENTUSERNAME.c9users.io';  //  stay tuned for this!
bot.testKey = "testrun"; //Do Not Change This Key!
bot.isTest = true;
/* End Test Code */
/***************************************************/
//Write your code in this function!!!
bot.direction = function (game) {


    /* ~~~ Determines and Organizes Data About The Game ~~~ */
    var enemyBots = [];
    var enemyBases = [];
    for (let i = 0; i < game.players.length; i++) { //Adds all other bots to the enemyBots array.
        if (game.players[i].id != game.myBot.id) {
            enemyBases.push(game.bases[i]); //Adds all other bases to the enemyBases array
            enemyBots.push(game.players[i]);
        }
    }

    var myDir = "none";
    var dirs = ["north", "east", "south", "west"];


    /* ~~ This code decides what to do ~~ */
    var task = 'goToFlower'


    /* ~~This code decides how to do it ~~ */
    switch (task) {
        case 'goToFlower':
            console.log('Going to flower with highest pollen:distance ratio')
            //Choose the flower with the largest value of pollen / distance
            let flowerToUse;
            for (let flower of game.flowers) {
                if (flowerToUse == undefined || flower.pollen / bot.findDistance(game.myBot.pos, flower.pos) > flowerToUse.pollen / bot.findDistance(game.myBot.pos, flowerToUse.pos)) {
                    flowerToUse = flower
                }
            }
            console.log(`Going to flower at (${flowerToUse.pos[0]}, ${flowerToUse.pos[1]}) with ${flowerToUse.pollen} pollen.`)
            myDir = bot.nextStep(game.myBot.pos, flowerToUse.pos)
            break;
        default:
            console.log("Going random!")
            myDir = dirs[Math.floor(Math.random() * 4)];
    }

    return myDir;
} //DO NOT CHANGE ANYTHING BELOW THIS LINE
bot();
