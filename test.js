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
    var task;
    //If the bot is far from base, prioritise returning home. This code activates when the walking distance to the base is 1.5 times the number of turns left in the game. This gives a safety margin in case of extra steps and may allow more pollen gathering afterwards.
    if (bot.findDistance(game.myBot.pos, game.myBase.pos) >= 1.5 * (game.totalTurns - game.turn)) {
        task = 'returnToBase'
    }
    //If we are not near the end of the game, behave normally.
    else {
        task = 'normal'
    }


    /* ~~This code decides how to do it ~~ */
    switch (task) {
        case 'normal':
            console.log('Behaving normally')
            //Every point on the grid gets an attractiveness score based on how advantageous or disadvantageous it would be to go there. For most points, this will be zero because there is nothing happening in most places.
            let attractivenessGrid = []                 //Initialize as an array
            for (x = 0; x < game.mapSize; x++) {         //Create the first dimension, which consists of many nested arrays
                attractivenessGrid.push([])             //Initialize each nested array
                for (y = 0; y < game.mapSize; y++) {     //Populate each nested array with zeroes
                    attractivenessGrid[x].push(0)
                }
            }

            //Map out the attractiveness of each flower. This will be equivalent to pollen / walking distance because flowers with more pollen are better and closer flowers are better.
            for (let flower of game.flowers) {
                //attractivenessGrid is accessed using x and y coordinates. The value of each coordinate pair will represent the attractiveness of the point at that index.
                attractivenessGrid[flower.pos[0]][flower.pos[1]] = flower.pollen / bot.findDistance(game.myBot.pos, flower.pos)
            }

            //Calculate the attractiveness of my base. This is 1.2 * my pollen / distance to base. We multiply by 1.2 because we want going to the base to be slightly more important than collecting pollen because that's what ultimately affects the final score. The amount of pollen I have is how much it will affect my score, and we divide by distance because we don't want to go back to base if it's too far away.
            //TODO update comments around here
            attractivenessGrid[game.myBase.pos[0]][game.myBase.pos[1]] = 0.3 * game.myBot.pollen / bot.findDistance(game.myBot.pos, game.myBase.pos)

            //Calculate the attractiveness of the other bees. This is the number of pollen that will be gained or lost divided by the distance. This is intentionally done after setting the attractiveness of the flowers in case the enemy bee is on a flower. The equation is the average of the two bots, minus my current pollen, divided by distance, or (((enemy pollen + my pollen) / 2) - my pollen) / distance. This can be expanded to ((enemy / 2) + (my / 2) - my) / distance, which simplifies to ((enemy / 2) - (my / 2)) / distance, then (enemy - my) / (2 * distance)
            for (enemy of enemyBots) {
                attractivenessGrid[enemy.pos[0]][enemy.pos[1]] = (enemy.pollen - game.myBot.pollen) / (2 * bot.findDistance(game.myBot.pos, enemy.pos))
            }

            //Create a list of where we want to try going, in the order of how much we want to go.
            let targets = []
            for (x = 0; x < game.mapSize; x++) {         //Create the first dimension, which consists of many nested arrays
                for (y = 0; y < game.mapSize; y++) {     //Populate each nested array with zeroes
                    targets.push({
                        pos: [x, y],
                        attractiveness: attractivenessGrid[x][y]
                    })
                }
            }
            targets.sort((a, b) => {
                if (a.attractiveness < b.attractiveness) {
                    return -1
                } else if (a.attractiveness > b.attractiveness) {
                    return 1
                } else {
                    return 0
                }
            })
            targets.reverse()   //Yes, I could have swapped -1 and 1 in the previous function to produce marginally faster code, but sort is expected to sort low to high, and I don't want to break that expectation.

            //Go to the first target on the list that is not blocked. A target is blocked if the magnitude of the attractiveness of least attractive target is greater than the magnitude of the attractiveness of the current target and the next step to go to both targets is the same. Loop until that is not the case, then break.
            let evil = targets[targets.length - 1]
            for (target of targets) {
                myDir = bot.nextStep(game.myBot.pos, target.pos)
                if (!(Math.abs(evil.attractiveness) > target.attractiveness && myDir == bot.nextStep(game.myBot.pos, evil.pos))) {
                    break
                }
            }
            console.log(`Going in ${myDir}`)
            if (myDir == undefined) {
                console.log('WARNING: MYDIR SHOULD NOT BE UNDEFINED')
                myDir = dirs[Math.floor(Math.random() * 4)];
            }
            break;
        case 'returnToBase':
            console.log('Going home')
            myDir = bot.nextStep(game.myBot.pos, game.myBase.pos)
            break;
        default:
            console.log("Going random!")
            myDir = dirs[Math.floor(Math.random() * 4)];
    }

    return myDir;
} //DO NOT CHANGE ANYTHING BELOW THIS LINE
bot();
