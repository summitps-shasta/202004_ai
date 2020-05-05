var bot = require("./bot"); //Don't change this
bot.hostURL = 'http://127.0.0.1:3000'; //Put the server url/IP adress here!
bot.key = "sg0397grmoa"; //Set your bot key to this string!

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
    if (bot.findDistance(game.myBot.pos, game.myBase.pos) >= (3 * (game.totalTurns - game.turn)) || game.turn > 925) {
        console.log('Going home')
        myDir = bot.nextStep(game.myBot.pos, game.myBase.pos)
    } else if (game.myBot.pollen > 1000) {
        console.log('Going home, but avoiding other bots')
        for (enemy of enemyBots) {
            if (enemy.pollen < game.myBot.pollen) {
                bot.avoid(enemy.pos)
            }
        }
        myDir = bot.nextStep(game.myBot.pos, game.myBase.pos)
    } else {
        let targets = [] //Every point on the grid gets an attractiveness score based on how advantageous or disadvantageous it would be to go there. For most points, this will be zero because there is nothing happening in most places.

        //Avoid all of the bees that will cause us to lose pollen, ignore the ones that won't.
        for (enemy of enemyBots) {
            if (enemy.pollen < game.myBot.pollen) {
                bot.avoid(enemy.pos)
            }
        }

        //Map out the attractiveness of enemy bases.
        for (base of enemyBases) {
            let distance = bot.findDistance(game.myBot.pos, base.pos)
            targets.push({
                pos: base.pos,
                pollenNet: base.pollen,
                distance: distance,
                attractiveness: base.pollen / (distance ** 2)
            })
        }

        //Now, choose which target to go to
        targets.sort((a, b) => {
            if (a.attractiveness < b.attractiveness) { return -1 }
            else if (a.attractiveness > b.attractiveness) { return 1 }
            else { return 0 }
        })
        targets.reverse()   //Yes, I could have swapped -1 and 1 in the previous function to produce marginally faster code, but sort is expected to sort low to high, and I don't want to break that expectation.

        // //If we don't want to go to any hives, pollinate flowers.
        // if (targets[0].attractiveness == 0) {
        //     console.log('Pollinating')
        //     for (let flower of game.flowers) {
        //         let distance = bot.findDistance(game.myBot.pos, flower.pos)
        //         targets.push({
        //             pos: flower.pos,
        //             pollenNet: flower.pollen,
        //             distance: distance,
        //             attractiveness: flower.pollen / (distance)
        //         })
        //     }
        //     targets.sort((a, b) => {
        //         if (a.attractiveness < b.attractiveness) { return -1 }
        //         else if (a.attractiveness > b.attractiveness) { return 1 }
        //         else { return 0 }
        //     })
        //     targets.reverse()
        // }

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
    }
    return myDir
}
//DO NOT CHANGE ANYTHING BELOW THIS LINE
bot();
