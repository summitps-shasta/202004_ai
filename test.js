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
let persistent = [  //Variables that need to last more than one turn. There are four sets of them so during test runs, each of the four bots can have its own independent ones. This will not matter during the real run.

    {
        lastDir: undefined,
        reversals: 0,
        task: 'normal'
    },
    {
        lastDir: undefined,
        reversals: 0,
        task: 'normal'
    },
    {
        lastDir: undefined,
        reversals: 0,
        task: 'normal'
    },
    {
        lastDir: undefined,
        reversals: 0,
        task: 'normal'
    }
]

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
    if (bot.findDistance(game.myBot.pos, game.myBase.pos) >= 1.1 * (game.totalTurns - game.turn)) {
        persistent[game.myBot.id].task = 'returnToBase'
    }
    if (game.myBot.pos.toString() == game.myBase.pos.toString()) {//toString is necessary because arrays are compared by reference, but we want to compare by value.
        persistent[game.myBot.id].task = 'normal'
    }
    /* ~~This code decides how to do it ~~ */
    if (persistent[game.myBot.id].task == 'normal') {
        let targets = [] //Every point on the grid gets an attractiveness score based on how advantageous or disadvantageous it would be to go there. For most points, this will be zero because there is nothing happening in most places.

        //Map out the attractiveness of each flower. This will be equivalent to pollen / walking distance because flowers with more pollen are better and closer flowers are better.
        for (let flower of game.flowers) {
            let distance = bot.findDistance(game.myBot.pos, flower.pos)
            targets.push({
                pos: flower.pos,
                pollenNet: flower.pollen,
                distance: distance,
                attractiveness: flower.pollen / distance
            })
        }

        //Calculate the attractiveness of my base. This is my pollen / distance to base. The amount of pollen I have is how much it will affect my score, and we divide by distance because we don't want to go back to base if it's too far away.
        let baseDistance = bot.findDistance(game.myBot.pos, game.myBase.pos)
        targets.push({
            pos: game.myBase.pos,
            pollenNet: game.myBot.pollen,
            distance: baseDistance,
            attractiveness: game.myBot.pollen / baseDistance
        })

        //Calculate the attractiveness of the other bees. This is the number of pollen that will be gained or lost divided by the distance. This is intentionally done after setting the attractiveness of the flowers in case the enemy bee is on a flower. The equation is the average of the two bots, minus my current pollen, divided by distance, or (((enemy pollen + my pollen) / 2) - my pollen) / distance. This can be expanded to ((enemy / 2) + (my / 2) - my) / distance, which simplifies to ((enemy / 2) - (my / 2)) / distance, then (enemy - my) / (2 * distance)
        for (enemy of enemyBots) {
            let pollenNet = (enemy.pollen - game.myBot.pollen) / 2
            let distance = bot.findDistance(game.myBot.pos, enemy.pos)
            targets.push({
                pos: enemy.pos,
                pollenNet: pollenNet,
                distance: distance,
                attractiveness: pollenNet / distance
            })
        }

        //Now, choose which target to go to
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
        //Don't let the bot reverse too many times
        persistent[game.myBot.id].lastDir = myDir
        if (
            myDir == 'north' && persistent[game.myBot.id].lastDir == 'south' ||
            myDir == 'south' && persistent[game.myBot.id].lastDir == 'north' ||
            myDir == 'west' && persistent[game.myBot.id].lastDir == 'east' ||
            myDir == 'east' && persistent[game.myBot.id].lastDir == 'west'
        ) {
            persistent[game.myBot.id].reversals++;
        } else {
            persistent[game.myBot.id].reversals = 0
        }
        if (persistent[game.myBot.id].reversals > 3) {
            myDir = {
                'north': 'south',
                'south': 'north',
                'west': 'east',
                'east': 'west'
            }[myDir]
            persistent[game.myBot.id].reversals = 0
        }
        console.log(`Going in ${myDir}`)
        if (myDir == undefined || myDir == 'none') {
            console.log('WARNING: MYDIR SHOULD NOT BE UNDEFINED')
            myDir = dirs[Math.floor(Math.random() * 4)];
        }
    } else {
        console.log('Going home')
        myDir = bot.nextStep(game.myBot.pos, game.myBase.pos)

    }
    return myDir;
}
//DO NOT CHANGE ANYTHING BELOW THIS LINE
bot();
