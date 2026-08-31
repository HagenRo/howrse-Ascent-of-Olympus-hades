/**Creates an instance of OlympRunLogging.
@param {string} dateRunStarted - The date the run started.
@param {string} domain - The domain.
@param {boolean} drachma - 
@param {Array} startHorses - The array of horses starting the race.
@property {Array} arrayOfFights - The array to store fight data.
@property {Array} arrayOfRewards - The array to store reward data. */
function OlympRunLogging(dateRunStarted, domain, drachma, startHorses = []) {
    this.dateRunStarted = dateRunStarted;
    this.domain = domain;
    this.drachma = drachma;
    this.startHorses = startHorses;
    this.arrayOfFights = [];
    this.arrayOfRewards = [];
}
/**Creates an instance of RewardsForLog.
@param {number} threshold - The threshold the rewards are from.
@param {string} room - The room the rewards are from.
@param {number} dificulty - The difficulty level of the room.
@param {Array} arrayOfRewards - An array of rewards (Horse, Booster, LevelUp, StaminaRefill).
@param {number} fragments - Number of fragment earnd.
@param {string} horse - The horse for which the frangments are. */
function RewardsForLog(threshold, room, dificulty, arrayOfRewards, fragments, horse) {
    this.threshold = threshold;
    this.room = room;
    this.dificulty = dificulty;
    this.arrayOfRewards = arrayOfRewards;
    this.fragments = fragments;
    this.horse = horse;
}
/**Creates an instance of Horse.
@param {string} name - The name of the horse.
@param {number} levelmax - The maximum level of the horse.
@param {number} currentlevel - The current level of the horse.
@param {string} skilla - The skill A of the horse.
@param {string} skillb - The skill B of the horse.
@param {string} skillc - The skill C of the horse.
@param {string} skilld - The skill D of the horse.
@param {number} currentstamina - The current stamina of the horse.
@param {number} id - The unique identifier of the horse.
@param {String[]} arrayOfTargetIds - An array of target IDs representing the Horse that will be removed.
@property {string} rewardType = 'Horse' */
function Horse(name, levelmax, currentlevel, skilla, skillb, skillc, skilld, currentstamina, id, arrayOfTargetIds) {
    this.rewardType = 'Horse';
    this.name = name;
    this.levelmax = levelmax;
    this.currentlevel = currentlevel;
    this.skilla = skilla;
    this.skillb = skillb;
    this.skillc = skillc;
    this.skilld = skilld;
    this.currentstamina = currentstamina;
    this.id = id;
    this.arrayOfTargetIds = arrayOfTargetIds;
}
/**Creates an instance of Booster.
@param {number} dataSkillA - The value of skill A.
@param {number} dataSkillB - The value of skill B.
@param {number} dataSkillC - The value of skill C.
@param {number} dataSkillD - The value of skill D.
@param {boolean} arrayOfTargetIds - true if this is the selected reward else false.
@param {string} skill - The Skill of the Booster 
@property {string} rewardType = 'Booster'*/
function Booster(dataSkillA, dataSkillB, dataSkillC, dataSkillD, arrayOfTargetIds) {
    this.rewardType = 'Booster';
    this.arrayOfTargetIds = arrayOfTargetIds;
    if (dataSkillA > 0) {
        this.boosterValue = dataSkillA;
        this.skill = 'A';
    }
    if (dataSkillB > 0) {
        this.boosterValue = dataSkillB;
        this.skill = 'B';
    }
    if (dataSkillC > 0) {
        this.boosterValue = dataSkillC;
        this.skill = 'C';
    }
    if (dataSkillD > 0) {
        this.boosterValue = dataSkillD;
        this.skill = 'D';
    }
}
/**Creates an instance of StaminRefill.
@param {number} numberStamina - The number of staminas to refill.
@param {number} numberHorses - The number of horses to refill stamina for.
@param {string[]} arrayOfTargetIds - The array of target IDs for which to refill stamina.
@property {string} rewardType = 'StaminaRifill' */
function StaminRefill(numberStamina, numberHorses, arrayOfTargetIds) {
    this.rewardType = 'StaminaRefill';
    this.numberStamina = numberStamina;
    this.numberHorses = numberHorses;
    this.arrayOfTargetIds = arrayOfTargetIds;
}
/**Creates an instance of LevelUp.
@param {number} numberLevel - The number of levels the Horse can level up.
@param {number} numberHorses - The number of horses to level up.
@param {String[]} arrayOfTargetIds - An array of target IDs of horses to level up.
@property {string} rewardType = 'LevelUp' */
function LevelUp(numberLevel, numberHorses, arrayOfTargetIds) {
    this.rewardType = 'LevelUp';
    this.numberLevel = numberLevel;
    this.numberHorses = numberHorses;
    this.arrayOfTargetIds = arrayOfTargetIds;
}
/**Creates a Fight object with the specified parameters.
@param {string} room - The room in which the fight takes place.
@param {string} difficulty - The difficulty level of the fight.
@param {number} threshold - The threshold value for determining the fight outcome.
@param {string} skillA - The first skill of the fight.
@param {string} skillB - The second skill of the fight.
@param {string} skillC - The third skill of the fight.
@param {string} skillD - The fourth skill of the fight.
@param {number} winrate - The win rate of the fight.
@param {String[]} arraySelectedHorseIds - The array of selected horse IDs for the fight.
@returns {Fight} The created Fight object. */
function Fight(room, difficulty, threshold, skillA, skillB, skillC, skillD, winrate, arraySelectedHorseIds) {
    this.room = room;
    this.difficulty = difficulty;
    this.threshold = threshold;
    this.skillA = skillA;
    this.skillB = skillB;
    this.skillC = skillC;
    this.skillD = skillD;
    this.winrate = winrate;
    this.arraySelectedHorseIds = arraySelectedHorseIds;
}



/**Retrieves information about the starting horses from the HTML elements and creates an array of Horse objects.
@returns {Horse[]} - An array of Horse objects representing the starting horses. */
function getStartHorsesFull() {
    let arrayOfStartHorses = [];
    let jqueryArrayOfStartHorses = $('.rowguecard');
    for (let index = 0; index < jqueryArrayOfStartHorses.length; index++) {
        const element = jqueryArrayOfStartHorses.eq(index);
        let name = element.find('.rowguecard__title')[0].textContent;
        let levelmax = element.find('.rowguecard__ribbon__level')[0].children.length;
        let currentlevel = 1;
        let skilla = element.find('.js-rowguecard__skills__skill--skillA').get(0).textContent;
        let skillb = element.find('.js-rowguecard__skills__skill--skillB').get(0).textContent;
        let skillc = element.find('.js-rowguecard__skills__skill--skillC').get(0).textContent;
        let skilld = element.find('.js-rowguecard__skills__skill--skillD').get(0).textContent;
        let currentstamina = 4;
        let id = jqueryArrayOfStartHorses[index].getAttribute('data-cardid');

        arrayOfStartHorses[index] = new Horse(name, levelmax, currentlevel, skilla, skillb, skillc, skilld, currentstamina, id);
    }
    return arrayOfStartHorses;
}
/**Function to save rewards for logging.
Parses the reward options from the page and creates Reward objects.
Adds the rewards to the log. */
function saveRewardForLogging() {
    let rewardOptionsArray = [];
    let jqueryRewardsArray = $('.js-bonuses__bonus');

    for (let index = 0; index < 3; index++) {

        const jqueryReward = jqueryRewardsArray.eq(index);
        const domReward = jqueryReward.get(0);
        const rewardType = domReward.getAttribute('data-bonustype'); //newCard, booster, levelUp, staminaRefill
        //console.log(rewardType);
        switch (rewardType) {
            case 'newCard':
                let name = jqueryReward.find('.rowguecard__title').get(0).textContent;
                let levelmax = jqueryReward.find('.rowguecard__ribbon__level').get(0).children.length;
                let currentlevel = 1;
                let skilla = jqueryReward.find('.js-rowguecard__skills__skill--skillA').get(0).textContent;
                let skillb = jqueryReward.find('.js-rowguecard__skills__skill--skillB').get(0).textContent;
                let skillc = jqueryReward.find('.js-rowguecard__skills__skill--skillC').get(0).textContent;
                let skilld = jqueryReward.find('.js-rowguecard__skills__skill--skillD').get(0).textContent;
                let currentstamina = 4;
                let arrayOfTargetIdsH = false;
                if (domReward.classList.contains('js-block--selected')) {
                    arrayOfTargetIdsH = [$('.js-rowguecard--selectedforbonus')?.[0]?.getAttribute('data-cardid')];

                }
                let newHorse = new Horse(name, levelmax, currentlevel, skilla, skillb, skillc, skilld, currentstamina, 'id', arrayOfTargetIdsH);//id will be set after for loop
                //console.log(newHorse);
                rewardOptionsArray[index] = newHorse;
                break;
            case 'booster':

                let dataSkillA = jqueryReward.find('span.rgbooster').get(0).getAttribute('data-skilla');
                let dataSkillB = jqueryReward.find('span.rgbooster').get(0).getAttribute('data-skillb');
                let dataSkillC = jqueryReward.find('span.rgbooster').get(0).getAttribute('data-skillc');
                let dataSkillD = jqueryReward.find('span.rgbooster').get(0).getAttribute('data-skilld');
                let arrayOfTargetIdsB = false;
                if (domReward.classList.contains('js-block--selected')) {
                    arrayOfTargetIdsB = true;
                }
                let newBooster = new Booster(dataSkillA, dataSkillB, dataSkillC, dataSkillD, arrayOfTargetIdsB);
                //console.log(newBooster);
                rewardOptionsArray[index] = newBooster;
                break;
            case 'levelUp':
                //console.log(jqueryReward.find('.text--secondary.text--s.mb--3').get(0));
                let numberLevel = jqueryReward.find('.text--secondary.text--s.mb--3').get(0).textContent.replace(/[^0-9]/g, '');
                let numberHorses = jqueryReward.find('.bonuses__bonus__cardtext.text--primary.text--m.mb--0').get(0).textContent.replace(/[^0-9]/g, '');
                let arrayOfTargetIds = false;
                if (domReward.classList.contains('js-block--selected')) {
                    arrayOfTargetIds = [];
                    let jquerySelectedCards = $('.js-rowguecard--selectedforbonus');

                    for (let index = 0; index < jquerySelectedCards.length; index++) {
                        const element = jquerySelectedCards[index];
                        arrayOfTargetIds[index] = element.getAttribute('data-cardid');
                    }
                }

                rewardOptionsArray[index] = new LevelUp(numberLevel, numberHorses, arrayOfTargetIds);
                break;
            case 'staminaRefill':
                let numberStamina = jqueryReward.find('.text--secondary.text--s.mb--3').get(0).textContent.replace(/[^0-9]/g, '');
                let numberHorsesS = jqueryReward.find('.bonuses__bonus__cardtext.text--primary.text--m.mb--0').get(0).textContent.replace(/[^0-9]/g, '');
                let arrayOfTargetIdsS = false;
                if (domReward.classList.contains('js-block--selected')) {
                    arrayOfTargetIdsS = [];
                    let jquerySelectedCards = $('.js-rowguecard--selectedforbonus');

                    for (let index = 0; index < jquerySelectedCards.length; index++) {
                        const element = jquerySelectedCards[index];
                        arrayOfTargetIdsS[index] = element.getAttribute('data-cardid');
                    }
                }
                rewardOptionsArray[index] = new StaminRefill(numberStamina, numberHorsesS, arrayOfTargetIdsS);
                break;
            default:
                break;
        }
    }

    let [room, difficulty] = ['', ''];
    let threshold;
    if ($('.rgskills__skill.rgskills__skill--room')?.[0]?.children[0]?.textContent == '22') {//TODO: funktioniert das?
        [room, difficulty] = ['boss', 'difficulty4'];
        threshold = 'boss';
    } else {
        [room, difficulty] = getRoomAndDifficulty();
        threshold = document.getElementsByClassName("floormap__title yanoneubibold align-center")[0].textContent.replace(/[^0-9]/g, '');
    }

    let fragments = window.localStorage.getItem("OL_fragments");
    let horse = window.localStorage.getItem("OL_horse");
    let dateRunStarted = window.localStorage.getItem('OL_dateRunStarted');
    let rewardsForLog = new RewardsForLog(threshold, room, difficulty, rewardOptionsArray, fragments, horse);
    console.log("bevoreSendMessage")
    chrome.runtime.sendMessage({ mdText: "addRewardsToRun", rewards: rewardsForLog, dateRunStarted: dateRunStarted }, (response) => {
        console.log(response);
    });

}

const OL_roomMapping = {
    "top: 228px; left: 62px;": "1m",
    "top: 190px; left: 62px;": "2m",
    "top: 152px; left: 124px;": "3r",
    "top: 152px; left: 0px;": "3l",
    "top: 114px; left: 62px;": "4m",
    "top: 76px; left: 124px;": "5r",
    "top: 76px; left: 0px;": "5l",
    "top: 38px; left: 124px;": "6r",
    "top: 38px; left: 0px;": "6l",
    "top: 0px; left: 62px;": "7m",

    "top: 190px; left: 124px;": "2r",
    "top: 190px; left: 0px;": "2l",
    "top: 152px; left: 62px;": "3m",
    "top: 114px; left: 124px;": "4r",
    "top: 114px; left: 0px;": "4l",
    "top: 76px; left: 62px;": "5m",
    "top: 38px; left: 62px;": "6m"
};
/**Retrieves the room and difficulty level of the current room.
@returns {Array} An array containing the room and difficulty level.
The first element in the array is the room, and the second element is the difficulty level. */
function getRoomAndDifficulty() {
    const [roomCoordinates, difficulty] = getRoomCoordinatesAndDifficulty();
    return [OL_roomMapping[roomCoordinates], difficulty];

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

class OL_Extractor {
    static registerFightLogging() {
        //log selected cards for room and log the boss rewards
        $(document).on('click', '.rgproba__btn.btn--primary.btn', function () {

            //store fragments and horse for reward
            let fragments = $('.pix__quantity__value')?.[0]?.textContent;
            let horse = $('.pix__popover__btn')?.[0]?.getAttribute('href')?.split('qName=')[1];
            window.localStorage.setItem("OL_fragments", fragments);
            window.localStorage.setItem("OL_horse", horse);
            //end store fragments and horse for reward

            let dateRunStarted = window.localStorage.getItem('OL_dateRunStarted');


            let skillA = $('.rgskills__skill.rgskills__skill--room')[0].children[0].textContent;
            let skillB = $('.rgskills__skill.rgskills__skill--room')[1].children[0].textContent;
            let skillC = $('.rgskills__skill.rgskills__skill--room')[2].children[0].textContent;
            let skillD = $('.rgskills__skill.rgskills__skill--room')[3].children[0].textContent;
            let [room, difficulty] = ['', ''];
            let threshold;
            let rewardsForLog;
            if (skillA != '0' && skillB != '0' && skillC != '0' && skillD != '0') {
                [room, difficulty] = ['boss', 'difficulty4'];
                threshold = 'boss';
                rewardsForLog = new RewardsForLog(threshold, room, difficulty, undefined, fragments, horse);

            } else {
                [room, difficulty] = getRoomAndDifficulty();
                threshold = document.getElementsByClassName("floormap__title yanoneubibold align-center")[0].textContent.replace(/[^0-9]/g, '');
            }

            let winrate = $('#js-rgproba__value')[0].textContent;
            let arraySelectedHorseIds = [];
            let jqueryArrayOfSelectedCards = $('.js-rowguecard--selectedfortry');
            for (let index = 0; index < jqueryArrayOfSelectedCards.length; index++) {
                const element = jqueryArrayOfSelectedCards[index];
                arraySelectedHorseIds[index] = element.getAttribute('data-cardid');
            }
            let fight = new Fight(room, difficulty, threshold, skillA, skillB, skillC, skillD, winrate, arraySelectedHorseIds);
            if (skillA != '0' && skillB != '0' && skillC != '0' && skillD != '0') {

                chrome.runtime.sendMessage({ mdText: "addBossToRun", rewards: rewardsForLog, fight: fight, dateRunStarted: dateRunStarted }, (response) => {
                    console.log(response);
                });

            } else {

                chrome.runtime.sendMessage({ mdText: "addFightToRun", fight: fight, dateRunStarted: dateRunStarted }, (response) => {
                    console.log(response);
                });

            }

        })
    }
    static registerInitRun() {
        //sets dateRunStarted and adds Run to Log
        $(document).on('click', '#js-startrunbtn', function () {
            initNewRun();
        })
    }
    static initNewRun(isObolus, dateRunStarted) {
        dateRunStarted = dateRunStarted ? dateRunStarted : new Date().toString();
        window.localStorage.setItem("OL_dateRunStarted", dateRunStarted);

        let isDrachma = $('.form__field__input[value="rowgue-special-ticket"]')?.get(0)?.checked;
        let olympRun = new OlympRunLogging(dateRunStarted, untilityGetLocationHost(), isObolus ? isObolus==='false' : isDrachma);

        chrome.runtime.sendMessage({ mdText: "addRunToDB", olympRun: olympRun }, (response) => {
            console.log(response);
        });

        function untilityGetLocationHost() {

            if ($('#privateMessage.disabled').length > 0) {
                return "co." + window.location.host;
            }
            return window.location.host;
        }
    }
    static registerStartHorsesLogging() {
        $(document).on('click', '#rowgue__enterbutton', function () {

            let threshold = document.getElementsByClassName("floormap__title yanoneubibold align-center")?.[0]?.textContent?.replace(/[^0-9]/g, '');
            let roomDone = $('.rgmap__room__pix--done').length;//Start horses
            if (threshold == '1' && roomDone == '0') {

                let startHorsesFull = getStartHorsesFull();
                let dateRunStarted = window.localStorage.getItem("OL_dateRunStarted");

                chrome.runtime.sendMessage({ mdText: "addStartHorsesToRun", startHorsesFull: startHorsesFull, dateRunStarted: dateRunStarted }, (response) => {
                    console.log(response);
                });
            }
        })
    }
    static registerRewardLogging() {
        //saves rewards to Log
        $(document).on('click', '.js-bonusvalidationbtn', function () {

            console.log("startRewardLogging")
            saveRewardForLogging();

        });

        $("body")[0].addEventListener('click', function (event) {

            let isButton = $(event.target).closest('.js-rowgue__nextroom__btn').length == 1 ? true : false;
            if (isButton) {
                let id = $('.js-rowguecard--bonusnewanimation')?.[0]?.getAttribute('data-cardid');
                //console.log('id: ', id);
                if (id) {
                    dateRunStarted = window.localStorage.getItem('OL_dateRunStarted');
                    chrome.runtime.sendMessage({ mdText: "addHorseIdToReward", horseID: id, dateRunStarted: dateRunStarted }, (response) => {
                        console.log(response);
                    });
                }
            }
        }, true)
    }

    static registerBossResultLogging() {
        let firstTime = true;//REMOVE
        $("body")[0].addEventListener('click', function (event) {//das ist der versuch mit mouseover damit die seite noch geladen ist und das content script noch existiert wenn das hier ausgeführt wird

            if (firstTime) {

                let isButton = $(event.target).closest('.js-rowgue__roomresult__btn[href="/rowgue/"]').length == 1 ? true : false;
                if (isButton) {
                    let success = $('.alert--success').length;
                    let lose = $('.js-rowgue__roomresult--run-lost').length;
                    if (success == 1) {
                        firstTime = false;
                    } else if (lose == 1) {
                        /*
                        *new Datamanagment
                        */
                        dateRunStarted = window.localStorage.getItem('OL_dateRunStarted');
                        chrome.runtime.sendMessage({ mdText: "addLostRunToBossRewards", dateRunStarted: dateRunStarted }, (response) => {
                            console.log(response);
                        });
                        /*
                        *end new Datamanagment
                        */
                        removeBossRewardFromLog();

                        firstTime = false;
                    }
                }

            }
        }, true)
    }

}
OL_Extractor.registerBossResultLogging();
OL_Extractor.registerFightLogging();
OL_Extractor.registerInitRun();
OL_Extractor.registerRewardLogging();
OL_Extractor.registerStartHorsesLogging();