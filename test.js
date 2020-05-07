var bot = require("./bot"); //Don't change this
bot.hostURL = 'http://127.0.0.1:3000'; //Put the server url/IP adress here!
bot.key = "sg0397grmoa"; //Set your bot key to this string!

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
    //Switch to returning home if we are too far away from base for the number of turns left, we are carrying too much pollen, or there are too few turns left.
    if (bot.findDistance(game.myBot.pos, game.myBase.pos) >= (3 * (game.totalTurns - game.turn)) || game.turn > 925) {
        task = 'returnToBase'
    } else if (game.myBot.pollen > 500) {
        task = 'returnToBaseAvoidBots'
    }
    //Go back to normal behavior once we reach base.
    if (game.myBot.pos.toString() == game.myBase.pos.toString()) {//toString is necessary because arrays are compared by reference, but we want to compare by value.
        task = 'normal'
        lastBaseTurn = game.turn
    }
    /* ~~This code decides how to do it ~~ */
    if (task == 'normal') {
        let targets = [] //Every point on the grid gets an attractiveness score based on how advantageous or disadvantageous it would be to go there. For most points, this will be zero because there is nothing happening in most places.

        //Avoid all of the bees that will cause us to lose pollen, ignore the ones that won't.
        for (enemy of enemyBots) {
            if (enemy.pollen < game.myBot.pollen) {
                bot.avoid(enemy.pos)
            }
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
        //Map out the attractiveness of enemy bases. Same as flowers, except multiplied by 0.5 because we don't get it all at once.
        for (base of enemyBases) {
            let distance = bot.findDistance(game.myBot.pos, base.pos)
            targets.push({
                pos: base.pos,
                pollenNet: base.pollen,
                distance: distance,
                attractiveness: 0.5 * base.pollen / distance
            })
        }

        //Calculate the attractiveness of my base. This is my pollen / distance to base, times 0.05. The amount of pollen I have is how much it will affect my score, and we divide by distance because we don't want to go back to base if it's too far away. We multiply by 0.5 because we rarely want to actually do this except for when the task code decides to do it. Also, we don't want to do it at all if we did it too recently.
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

        //Go to the first target on the list that is not blocked. A target is blocked if we can't find the next step and we aren't already there, meaning that we couldn't find the next step because of obstacles.
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
        console.log(`Going in ${myDir}`)
    } else if (task == 'returnToBaseAvoidBots') {
        console.log('Going home, but avoiding other bots')
        for (enemy of enemyBots) {
            if (enemy.pollen < game.myBot.pollen) {
                bot.avoid(enemy.pos)
            }
        }
        myDir = bot.nextStep(game.myBot.pos, game.myBase.pos)
    } else {
        console.log('Going home')
        myDir = bot.nextStep(game.myBot.pos, game.myBase.pos)
    }
    return myDir;
}
//DO NOT CHANGE ANYTHING BELOW THIS LINE
bot();
