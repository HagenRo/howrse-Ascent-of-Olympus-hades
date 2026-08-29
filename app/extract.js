window.localStorage.setItem("takeNextClick", "false");//domain dependent when in content_script
function roomMapping(cryptRoom) {
    switch (cryptRoom) {
        case "top: 228px; left: 62px;":
            return "1m"
        case "top: 190px; left: 62px;":
            return "2m"
        case "top: 152px; left: 124px;":
            return "3r"
        case "top: 152px; left: 0px;":
            return "3l"
        case "top: 114px; left: 62px;":
            return "4m"
        case "top: 76px; left: 124px;":
            return "5r"
        case "top: 76px; left: 0px;":
            return "5l"
        case "top: 38px; left: 124px;":
            return "6r"
        case "top: 38px; left: 0px;":
            return "6l"
        case "top: 0px; left: 62px;":
            return "7m"

        case "top: 190px; left: 124px;":
            return "2r"
        case "top: 190px; left: 0px;":
            return "2l"
        case "top: 152px; left: 62px;":
            return "3m"
        case "top: 114px; left: 124px;":
            return "4r"
        case "top: 114px; left: 0px;":
            return "4l"
        case "top: 76px; left: 62px;":
            return "5m"
        case "top: 38px; left: 62px;":
            return "6m"
        default:
            break;
    }
}
function RewardsForRoom(dateRunStarted, timeStamp, threshold, room, dificulty, reward1, reward2, reward3) {
    this.dateRunStarted = dateRunStarted;
    this.timeStamp = timeStamp;
    this.threshold = threshold;
    this.room = room;
    this.dificulty = dificulty;
    this.reward1 = reward1;
    this.reward2 = reward2;
    this.reward3 = reward3;
}
RewardsForRoom.prototype.toString = function toString() {
    return `${this.threshold + "." + this.room + "; " + this.reward1 + "; " + this.reward2 + "; " + this.reward3}`;
};
/**Creates a new instance of StartHorses.
@param {Date} dateRunStarted - The date when the horse race started.
@param {string} horse1 - The rarity of the first horse.
@param {string} horse2 - The rarity of the second horse.
@param {string} horse3 - The rarity of the third horse. */
function StartHorses(dateRunStarted, horse1, horse2, horse3) {
    this.dateRunStarted = dateRunStarted;
    this.horse1 = horse1;
    this.horse2 = horse2;
    this.horse3 = horse3;
}
/**Retrieves the rewards from the current room run.
@returns {RewardsForRoom} The rewards for the current room run. */
function getRewards() {
    let extractedRewards = [];
    let dateRunStarted = window.localStorage.getItem("dateRunStarted");
    let timeStamp = new Date();
    let thresholdNumber = document.getElementsByClassName("floormap__title yanoneubibold align-center")[0].textContent.replace(/[^0-9]/g, '');
    const [room, difficulty] = getRoomAndDifficulty();
    if (!dateRunStarted) {//REMOVE
        console.log("this shouldnt have happened, somthing with $('#js-startrunbtn').on('click' went wrong");
        dateRunStarted = new Date(timeStamp.getTime() - 10 * 60000);
        window.localStorage.setItem("dateRunStarted", dateRunStarted);//domain dependent when in content_script
    }
    let htmlRewardBox = document.getElementsByClassName("block__content");
    for (let index = 0; index < 3; index++) {
        if (htmlRewardBox[index].children[2].tagName.toLowerCase() == "article") {
            let className = htmlRewardBox[index].children[2].className;
            if (className.includes("common")) {
                extractedRewards[index] = "common";
            }
            if (className.includes("rare")) {
                extractedRewards[index] = "rare";
            }
            if (className.includes("precious")) {
                extractedRewards[index] = "precious";
            }
            if (className.includes("divine")) {
                extractedRewards[index] = "divine";
            }
        }
        if (htmlRewardBox[index].children[2].tagName.toLowerCase() == "span") {
            let bonus = htmlRewardBox[index].children[2].firstChild.firstChild.textContent.replace(/(\r\n|\n|\r|\t)/gm, "");
            extractedRewards[index] = bonus;
        }
        if (htmlRewardBox[index].children[2].tagName.toLowerCase() == "form") {
            let firstNuber = htmlRewardBox[index].children[3].textContent.replace(/[^0-9]/g, '');
            let secondNumber = htmlRewardBox[index].children[4].textContent.replace(/[^0-9]/g, '');
            let text;
            if (htmlRewardBox[index].children[1].alt.includes("level")) {
                text = "level";
            } else {
                text = "energy";
            }
            extractedRewards[index] = firstNuber + " " + text + " for " + secondNumber;
        }
    }
    const reward = new RewardsForRoom(dateRunStarted.toString(), timeStamp.toString(), thresholdNumber, room, difficulty, extractedRewards[0], extractedRewards[1], extractedRewards[2]);
    console.log("reward:", reward.toString());
    return reward;
}
/**Retrieves the room and difficulty level of the current room.
@returns {Array} An array containing the room and difficulty level.
The first element in the array is the room, and the second element is the difficulty level. */
function getRoomAndDifficulty() {
    const [roomCoordinates, difficulty] = getRoomCoordinatesAndDifficulty();
    return [roomMapping(roomCoordinates), difficulty];

    function getRoomCoordinatesAndDifficulty() {
        let bonusdiv = document.getElementsByClassName("rgmap__room__pix rgmap__room__pix--bonus-choice")[0];
        let current = document.getElementsByClassName("rgmap__room__pix rgmap__room__pix--current")[0];
        if (bonusdiv) {

            return [bonusdiv.parentNode.style.cssText, bonusdiv.firstChild.alt];
        }
        if (current) {
            return [current.parentNode.style.cssText, current.firstChild.alt];
        }
    }
}
/**Retrieves the room of the current room.
@returns {string} The roomstring. (e.g. "1m", "6r") */
function getRoom() {
    const [roomCoordinates, _] = getRoomAndDifficulty();
    return roomCoordinates;
}
/**Adds the rewards to chrome.storage.local arrayOfRewards.
@param {RewardsForRoom} rewards - The rewards to be saved */
function saveRewards(rewards) {
    chrome.storage.local.get(["arrayOfRewards"], function (keyValuePairs) {
        if (keyValuePairs.arrayOfRewards) {//if array exists
            keyValuePairs.arrayOfRewards.push(rewards);
            chrome.storage.local.set({ "arrayOfRewards": keyValuePairs.arrayOfRewards }, function () {
            });
        } else {
            let newArrayOfRewards = [];
            newArrayOfRewards.push(rewards);
            chrome.storage.local.set({ "arrayOfRewards": newArrayOfRewards }, function () {
            });
        }
    });
}
/**Adds the given start horses to chrome.storage.local arrayOfStartHorses.
@param {StartHorses} stratHorses - The start horses to be saved.
@returns {void} */
function saveStartHorses(stratHorses) {
    chrome.storage.local.get(["arrayOfStartHorses"], function (keyValuePairs) {
        if (keyValuePairs.arrayOfStartHorses) {//if array exists
            keyValuePairs.arrayOfStartHorses.push(stratHorses);
            chrome.storage.local.set({ "arrayOfStartHorses": keyValuePairs.arrayOfStartHorses }, function () {
            });
        } else {
            let newArrayOfStartHorses = [];
            newArrayOfStartHorses.push(stratHorses);
            chrome.storage.local.set({ "arrayOfStartHorses": newArrayOfStartHorses }, function () {
            });
        }
    });
}
/**Retrieves the starting horses from the HTML.
@returns {StartHorses} The starting horses containing the date run started and the types of horses. */
function getStartHorses() {
    let htmlHorses = document.getElementById("js-rowgue__deck__cards");
    let dateRunStarted = window.localStorage.getItem("dateRunStarted");//domain dependent when in content_script
    let horses = [];
    for (let index = 0; index < 3; index++) {
        const className = htmlHorses.children[index].className;
        if (className.includes("common")) {
            horses[index] = "common";
        }
        if (className.includes("rare")) {
            horses[index] = "rare";
        }
        if (className.includes("precious")) {
            horses[index] = "precious";
        }
        if (className.includes("divine")) {
            horses[index] = "divine";
        }
    }
    return new StartHorses(dateRunStarted, horses[0], horses[1], horses[2]);
}

/*Checks for too few selected cards on button click (fight).
- The win rate is less than 100 percent.
- There are still selectable horses available on the screen.
- The user has not previously selected the option to choose less than the maximum number of cards.
 */
$("body")[0].addEventListener('click', function (event) {

    if ($('#js-rgproba__value')?.[0]?.textContent) {
        let winrate = $('#js-rgproba__value')[0].textContent;
        let selectLess = ('true' === window.localStorage.getItem('selectLessTry'));
        let selectableHorses = $('.rowguecard:not(.js-rowguecard--disabledclickable, .js-rowguecard--selectedfortry, .js-rowguecard--disabled)').length;
        let isButton = $(event.target).closest('.rgproba__btn.btn--primary.btn').length == 1 ? true : false;
        if (winrate < 100 && selectableHorses > 0 && isButton && !selectLess) {
            //console.log('blub')
            let ja = confirm('Willst du wirklich weniger anwählen als du könntest?');
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            if (ja) {
                window.localStorage.setItem('selectLessTry', 'true');
            } else {

            }

        }
    }

}, true)

$("body")[0].addEventListener('click', function (event) {
    let rewardIsNewCard = $('.js-rowgue-bonus-type-newCard.block.js-block--selected')?.[0]?true:false;
    console.log(event.target)
    let selectedHorseIsToGood = $(event.target).is('.rowguecard.rowguecard--precious[data-currentlevel]:not([data-currentlevel="1"]),.rowguecard.rowguecard--devine[data-currentlevel]:not([data-currentlevel="1"])');
    console.log(selectedHorseIsToGood)

    if (rewardIsNewCard && selectedHorseIsToGood) {
        let cutCard = ('true' === window.localStorage.getItem('cutCard'));
        if (!cutCard) {
            let yes = confirm('Willst du wirklich dieses Pferd entfernen?');
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            if (yes) {
                window.localStorage.setItem('cutCard', 'true');
            } else {

            }
        }
    }

}, true);


//reset the too few selected cards variable.
$(document).on('click', '.rgproba__btn.btn--primary.btn', function () {
    window.localStorage.setItem('selectLessTry', 'false');
    window.localStorage.setItem('cutCard', 'false');
})

//checks if drachma and sets "wasSetThisRunStartHorses"='false'
$(document).on('click', '#js-startrunbtn', function () {
    if ($('.form__field__input[value="rowgue-special-ticket"]').get(0).checked) {
        window.localStorage.setItem("drachma", "true");//domain dependent when in content_script
    } else {
        window.localStorage.setItem("drachma", "false");//domain dependent when in content_script
    }
    window.localStorage.setItem("wasSetThisRunStartHorses", 'false');
})

//saves startHorses on entering the first Room and sets lastRoom to 'newRun'
$(document).on('click', '#rowgue__enterbutton', function () {

    let threshold = document.getElementsByClassName("floormap__title yanoneubibold align-center")?.[0]?.textContent?.replace(/[^0-9]/g, '');
    let roomDone = $('.rgmap__room__pix--done').length;
    let isDrachma = ('true' === window.localStorage.getItem('drachma'));
    if (threshold == '1' && roomDone == '0' && !isDrachma) {
        let startHorses = getStartHorses();
        saveStartHorses(startHorses);
        console.log("startHorses:", startHorses);
    }
    window.localStorage.setItem("lastRoom", "newRun");
})

/*checks for too less selected cards (rewards)
*/
$("body")[0].addEventListener('click', function (event) {

    let isButton = $(event.target).closest('.js-bonusvalidationbtn').length == 1 ? true : false;
    let selectLess = ('true' === window.localStorage.getItem('selectLess'));
    if (!selectLess && isButton) {
        let selectableHorses = $('.rowguecard:not(.js-rowguecard--disabled, .js-rowguecard--selectedforbonus, .rowguecard--s)').length;
        if (selectableHorses > 0) {
            let ja = confirm('Willst du wirklich weniger anwählen als du könntest?');
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            if (ja) {
                window.localStorage.setItem('selectLess', 'true');
            }
        }
    }
}, true)

//resets selectLess boolean
$(document).on('click', '.js-bonusvalidationbtn', function () {

    window.localStorage.setItem('selectLess', 'false');

});




//für excel reward logging
$('body').on('click', function () {//
    try {
        //printLogging();
        let lastRoom = window.localStorage.getItem("lastRoom");//domain dependent when in content_script
        lastRoom = (lastRoom ? lastRoom : "Error with lastRoom")

        let con1 = document.getElementsByClassName("block__content").length > 3;

        //rewards
        let isDrachma = ('true' === window.localStorage.getItem('drachma'));
        if (con1 && lastRoom != getRoom() && !isDrachma) {


            let rewards = getRewards();
            saveRewards(rewards);


            lastRoom = getRoom();
            window.localStorage.setItem("lastRoom", lastRoom);//domain dependent when in content_script


            console.log("---------------------------------------------------");
        }
        //end rewards



    } catch (error) {
        console.log(error);
        alert("An Error occured, for more information take a look in the console. \nThis could corrupt the Data gathered from the addon, so make shure you download and clear befor you proceed.");
    }

    window.localStorage.setItem("takeNextClick", "false");

});


/*****************************************************************************************************************************************
* Neue Methode um sich in die howrse methoden einzuklinken
*

doPickBonus = (function(){
    var cached_doPickBonus = doPickBonus;

    return function() {
        
        
        console.log('bevoreDoPickBonus')
        cached_doPickBonus.apply(this); // use .apply() to call it

        console.log('afterDoPickBonus')

    };
})();
doRoomTry = (function(){
    var cached_doRoomTry = doRoomTry;

    return function() {
        
        
        console.log('bevoreDoRoomTry')
        cached_doRoomTry.apply(this); // use .apply() to call it

        console.log('afterDoRoomTry')

    };
})();

doStartRun = (function(){
    var cached_doStartRun = doStartRun;

    return function() {
        
        
        console.log('bevoreDoStartRun')
        cached_doStartRun.apply(this); // use .apply() to call it

        console.log('afterDoStartRun')

    };
})();
*/