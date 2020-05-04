var bot = require("./bot"); //Don't change this
bot.hostURL = 'http://127.0.0.1:3000'; //Put the server url/IP adress here!
bot.key = "sg0397grmoa"; //Set your bot key to this string!

var lastDir = undefined
var reversals = 0
var task = 'normal'
var lastBaseTurn = 0

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
    //If the bot is far from base, prioritise returning home. This code activates when the walking distance to the base is 1.1 times the number of turns left in the game. 1.1 provides a 10% safety margin in case things go wrong, but it shouldn't be necessary. If we are at the base, go back to normal behavior.
    if (bot.findDistance(game.myBot.pos, game.myBase.pos) >= (1.5 * (game.totalTurns - game.turn)) || game.myBot.pollen > 500 || game.turn > 950) {
        task = 'returnToBase'
    }
    if (game.myBot.pos.toString() == game.myBase.pos.toString()) {//toString is necessary because arrays are compared by reference, but we want to compare by value.
        task = 'normal'
        lastBaseTurn = game.turn
    }
    /* ~~This code decides how to do it ~~ */
    if (task == 'normal') {
        let targets = [] //Every point on the grid gets an attractiveness score based on how advantageous or disadvantageous it would be to go there. For most points, this will be zero because there is nothing happening in most places.

        //Sort the enemy bots in order of increasing pollen, so ones with less pollen get avoided first.
        enemyBots.sort((a, b) => {
            if (a.pollen < b.pollen) { return -1 }
            else if (a.pollen > b.pollen) { return 1 }
            else { return 0 }
        })
        //Calculate the attractiveness of the other bees. This is the number of pollen that will be gained or lost divided by the distance. This is intentionally done after setting the attractiveness of the flowers in case the enemy bee is on a flower. The equation is the average of the two bots, minus my current pollen, divided by distance, or (((enemy pollen + my pollen) / 2) - my pollen) / distance. This can be expanded to ((enemy / 2) + (my / 2) - my) / distance, which simplifies to ((enemy / 2) - (my / 2)) / distance, then (enemy - my) / (2 * distance). Enemy bots with negative attractiveness are added to the avoid array. We do this first so other attractiveness values
        for (enemy of enemyBots) {
            let pollenNet = (enemy.pollen - game.myBot.pollen) / 2
            // if (pollenNet > 0) {
            //     let distance = bot.findDistance(game.myBot.pos, enemy.pos)
            //     targets.push({
            //         pos: enemy.pos,
            //         pollenNet: pollenNet,
            //         distance: distance,
            //         attractiveness: pollenNet / (distance)
            //     })
            // } else {
            //     bot.avoid(enemy.pos)    //I FOUND A WAY TO PROPERLY AVOID ENEMIES!!!
            // }
            if (pollenNet < 0) {
                bot.avoid(enemy.pos)
            }
        }

        //Map out the attractiveness of enemy bases
        for (base of enemyBases) {
            let distance = bot.findDistance(game.myBot.pos, base.pos)
            targets.push({
                pos: base.pos,
                pollenNet: base.pollen,
                distance: distance,
                attractiveness: 0.5 * base.pollen / distance
            }
            )
        }

        //Map out the attractiveness of each flower. This will be equivalent to pollen / walking distance because flowers with more pollen are better and closer flowers are better.
        for (let flower of game.flowers) {
            let distance = bot.findDistance(game.myBot.pos, flower.pos)
            targets.push({
                pos: flower.pos,
                pollenNet: flower.pollen,
                distance: distance,
                attractiveness: flower.pollen / (distance)
            })
        }

        //Calculate the attractiveness of my base. This is my pollen / distance to base. The amount of pollen I have is how much it will affect my score, and we divide by distance because we don't want to go back to base if it's too far away.
        if (game.turn >= lastBaseTurn + 5) {
            let baseDistance = bot.findDistance(game.myBot.pos, game.myBase.pos)
            targets.push({
                pos: game.myBase.pos,
                pollenNet: game.myBot.pollen,
                distance: baseDistance,
                attractiveness: 0.05 * game.myBot.pollen / (baseDistance)
            })
        }

        //Now, choose which target to go to
        targets.sort((a, b) => {
            if (a.attractiveness < b.attractiveness) { return -1 }
            else if (a.attractiveness > b.attractiveness) { return 1 }
            else { return 0 }
        })
        targets.reverse()   //Yes, I could have swapped -1 and 1 in the previous function to produce marginally faster code, but sort is expected to sort low to high, and I don't want to break that expectation.

        // myDir = bot.nextStep(game.myBot.pos, targets[0].pos)
        //Go to the first target on the list that is not blocked. A target is blocked if we can't find the next step.
        for (target of targets) {
            myDir = bot.nextStep(game.myBot.pos, target.pos)
            if (myDir == undefined) {
                if (game.myBot.pos.toString() == target.pos.toString()) {
                    break
                } else {
                    continue
                }
            } else {
                break
            }
        }
        //Don't let the bot reverse too many times
        lastDir = myDir
        if (
            myDir == 'north' && lastDir == 'south' ||
            myDir == 'south' && lastDir == 'north' ||
            myDir == 'west' && lastDir == 'east' ||
            myDir == 'east' && lastDir == 'west'
        ) {
            reversals++;
        } else {
            reversals = 0
        }
        if (reversals > 3) {
            myDir = {
                'north': 'south',
                'south': 'north',
                'west': 'east',
                'east': 'west'
            }[myDir]
            reversals = 0
        }
        console.log(`Going in ${myDir}`)
    } else {
        console.log('Going home')
        myDir = bot.nextStep(game.myBot.pos, game.myBase.pos)
    }
    return myDir;
}
//DO NOT CHANGE ANYTHING BELOW THIS LINE
bot();
