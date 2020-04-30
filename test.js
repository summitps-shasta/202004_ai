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
        task = 'goToFlower'
    }


    /* ~~This code decides how to do it ~~ */
    switch (task) {
        case 'goToFlower':
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

            //TODO will calculate attractiveness of other bees, but that is not yet implemented.

            //Choose which point to go to based on weighted average of attractiveness values. This will approach actual attractive points as we get near them, while still giving us detours around repulsive points.
            //TODO maybe also try force vectors.
            //TODO change this comment
            /*
            let vectors = []
            for (x = 0; x < game.mapSize; x++) {
                vectors.push([])
                for (y = 0; y < game.mapSize; y++) {
                    force = attractivenessGrid[x][y]
                    theta = Math.atan((y - game.myBot.y) / (x - game.myBot.x))
                    vectors[x].push({
                        force: force,
                        theta: theta,
                        forceX: force * Math.cos(theta),
                        forceY: force * Math.sin(theta)
                    })
                }
            }
            let forceXnet
            let forceYnet
            for (x = 0; x < game.mapSize; x++) {
                for (y = 0; y < game.mapSize; y++) {
                    forceXnet += vectors[x][y].forceX
                    forceYnet += vectors[x][y].forceY
                }
            }
            //Now that we have a net force for x and y, use these to decide which way to go
            let canMoveX = (() => {
                if (forceXnet > 0) {
                    return !game.barricades.some(element => {
                        element[0] == game.myBot.pos[0] + 1
                    })
                } else if (forceXnet < 0) {
                    return !game.barricades.some(element => {
                        element[0] == game.myBot.pos[0] - 1
                    })
                } else {
                    return false
                }
            })()
            let canMoveY = (() => {
                if (forceYnet > 0) {
                    return !game.barricades.some(element => {
                        element[1] == game.myBot.pos[1] + 1
                    })
                } else if (forceYnet < 0) {
                    return !game.barricades.some(element => {
                        element[1] == game.myBot.pos[1] - 1
                    })
                } else {
                    return false
                }
            })()
            if (canMoveX && canMoveY) {
                if (Math.abs(forceXnet) > Math.abs(forceYnet)) {
                    myDir = (forceXnet > 0) ? 'east' : 'west'
                } else if (Math.abs(forceYnet) > Math.abs(forceXnet)) {
                    myDir = (forceYnet > 0) ? 'south' : 'north'
                } else if (Math.round(Math.random)) {
                    myDir = (forceXnet > 0) ? 'east' : 'west'
                } else {
                    myDir = (forceYnet > 0) ? 'south' : 'north'
                }
            } else if (canMoveX) {
                myDir = (forceXnet > 0) ? 'east' : 'west'
            } else if (canMoveY) {
                myDir = (forceYnet > 0) ? 'south' : 'north'
            } else {
                myDir = dirs[Math.floor(Math.random() * 4)];
            }
            */
            //TODO replace the comments here
            let target = [0, 0]
            let targetAttractiveness = 0
            for (x = 0; x < game.mapSize; x++) {         //Create the first dimension, which consists of many nested arrays
                for (y = 0; y < game.mapSize; y++) {     //Populate each nested array with zeroes
                    if (attractivenessGrid[x][y] > targetAttractiveness) {
                        targetAttractiveness = attractivenessGrid[x][y]
                        target = [x, y]
                    }
                }
            }

            // myDir = bot.nextStep(game.myBot.pos, flowerToUse.pos)
            myDir = bot.nextStep(game.myBot.pos, target)
            console.log(`Going in ${myDir} to (${target[0]}, ${target[1]}).`)
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
