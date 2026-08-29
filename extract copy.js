window.localStorage.setItem("takeNextClick", "false");//domain dependent when in content_script
function roomMapping(cryptRoom){
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
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function OlympRunLogging(dateRunStarted, domain, drachma, startHorses){
    this.dateRunStarted = dateRunStarted;
    this.domain = domain;
    this.drachma = drachma;
    this.startHorses = startHorses;
    this.arrayOfFights = [];
    this.arrayOfRewards = [];
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

function RewardsForLog(threshold, room, dificulty, arrayOfRewards, fragments, horse) {
    this.threshold = threshold;
    this.room = room;
    this.dificulty = dificulty;
    this.arrayOfRewards = arrayOfRewards;
    this.fragments = fragments;
    this.horse = horse;
}
RewardsForRoom.prototype.toString = function toString() {
    return `${this.threshold+"."+this.room+"; "+this.reward1+"; "+this.reward2+"; "+this.reward3}`;
};
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
/*Horse.prototype.toString = function(){
    switch (this.levelmax) {
        case 2:
            return 'common';
        case 3:
            return 'rare';
        case 4:
            return 'precious';
        case 5:
            return 'divine';  
        default:
            alert('wrong levelmax in getRarity!');
            return;
    }
};
*/
function Booster(dataSkillA, dataSkillB, dataSkillC, dataSkillD, arrayOfTargetIds) {
    this.rewardType = 'Booster';
    this.arrayOfTargetIds = arrayOfTargetIds;
    if (dataSkillA>0) {
        this.boosterValue = dataSkillA;
        this.skill = 'A';
    }
    if (dataSkillB>0) {
        this.boosterValue = dataSkillB;
        this.skill = 'B';
    }
    if (dataSkillC>0) {
        this.boosterValue = dataSkillC;
        this.skill = 'C';
    }
    if (dataSkillD>0) {
        this.boosterValue = dataSkillD;
        this.skill = 'D';
    }
}
function StaminRefill(numberStamina, numberHorses, arrayOfTargetIds){
    this.rewardType = 'StaminaRefill';
    this.numberStamina = numberStamina;
    this.numberHorses = numberHorses;
    this.arrayOfTargetIds = arrayOfTargetIds;
}/*
StaminRefill.prototype.toString = function(){
    return 'numberStamina: ' + this.numberStamina + '; numberHorses: ' + this.numberHorses + '; arrayOfTargetIds: ' + this.arrayOfTargetIds;
}*/
function LevelUp(numberLevel, numberHorses, arrayOfTargetIds){
    this.rewardType = 'LevelUp';
    this.numberLevel = numberLevel;
    this.numberHorses = numberHorses;
    this.arrayOfTargetIds = arrayOfTargetIds;
}
function StartHorses(dateRunStarted, horse1, horse2, horse3){
    this.dateRunStarted = dateRunStarted;
    this.horse1 = horse1;
    this.horse2 = horse2;
    this.horse3 = horse3;
}
/*Input: 
    Extracts the rewards from html
Output: Rewards object
*/
function getRewards(){//Cleaned
    let extractedRewards = [];
    let dateRunStarted = window.localStorage.getItem("dateRunStarted");
    let timeStamp = new Date();
    let thresholdNumber = document.getElementsByClassName("floormap__title yanoneubibold align-center")[0].textContent.replace(/[^0-9]/g, '');
    const [room, difficulty] = getRoomAndDifficulty();
    if (!dateRunStarted) {//REMOVE
        console.log("this shouldnt have happened, somthing with $('#js-startrunbtn').on('click' went wrong");
        dateRunStarted = new Date(timeStamp.getTime() - 10*60000);
        window.localStorage.setItem("dateRunStarted", dateRunStarted);//domain dependent when in content_script
    }
    let htmlRewardBox = document.getElementsByClassName("block__content");
    for (let index = 0; index < 3; index++) {
        if (htmlRewardBox[index].children[2].tagName.toLowerCase() == "article" ) {
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
            let bonus = htmlRewardBox[index].children[2].firstChild.firstChild.textContent.replace(/(\r\n|\n|\r|\t)/gm,"");
            extractedRewards[index] = bonus;
        }
        if (htmlRewardBox[index].children[2].tagName.toLowerCase() == "form") {
            let firstNuber = htmlRewardBox[index].children[3].textContent.replace(/[^0-9]/g, '');
            let secondNumber = htmlRewardBox[index].children[4].textContent.replace(/[^0-9]/g, '');
            let text;
            if (htmlRewardBox[index].children[1].alt.includes("level")) {
                text="level";
            }else{
                text = "energy";
            }
            extractedRewards[index] = firstNuber + " " + text + " for " + secondNumber;
        }
    }
    const reward = new RewardsForRoom(dateRunStarted.toString(), timeStamp.toString(), thresholdNumber, room, difficulty, extractedRewards[0], extractedRewards[1], extractedRewards[2]);
    console.log("reward:", reward.toString());
    return reward;
}
/*Input:
    Extracts the room (mapped) and difficulty from the page.
Output: Array of [Mapped roomCoordinates (e.g. "1m", "6r") ; difficulty]
*/
function getRoomAndDifficulty(){//Cleaned
    const [roomCoordinates, difficulty] = getRoomCoordinatesAndDifficulty();
    return [roomMapping(roomCoordinates), difficulty];

    function getRoomCoordinatesAndDifficulty(){
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
/*Input:
    Extracts the room from the page and maps it.
Output: Mapped roomCoordinates (e.g. "1m", "6r") 
*/
function getRoom(){//Cleaned
    const [roomCoordinates, _] = getRoomAndDifficulty();
    return roomCoordinates;
}
/*Input: Reward object
    Adds the Reward object to the chrome.storage.local array arrayOfRewards
*/
function saveRewards(rewards){//Cleaned
    chrome.storage.local.get(["arrayOfRewards"], function(keyValuePairs){
        if (keyValuePairs.arrayOfRewards) {//if array exists
            keyValuePairs.arrayOfRewards.push(rewards);
            chrome.storage.local.set({ "arrayOfRewards" : keyValuePairs.arrayOfRewards }, function(){
            });
        }else{
            let newArrayOfRewards = [];
            newArrayOfRewards.push(rewards);
            chrome.storage.local.set({ "arrayOfRewards" : newArrayOfRewards }, function(){
            });
        }
    });
}
/*Input: StartHorses object
    Adds the StartHorses object to the chrome.storage.local array arrayOfStartHorses
*/
function saveStartHorses(stratHorses){//Cleaned
    chrome.storage.local.get(["arrayOfStartHorses"], function(keyValuePairs){
        if (keyValuePairs.arrayOfStartHorses) {//if array exists
            keyValuePairs.arrayOfStartHorses.push(stratHorses);
            chrome.storage.local.set({ "arrayOfStartHorses" : keyValuePairs.arrayOfStartHorses }, function(){
            });
        }else{
            let newArrayOfStartHorses = [];
            newArrayOfStartHorses.push(stratHorses);
            chrome.storage.local.set({ "arrayOfStartHorses" : newArrayOfStartHorses }, function(){
            });
        }
    });
}
/*Input: 
    Extracts the startHorses rarity
Output: StartHorses object
*/
function getStartHorses(){//Cleaned
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
    return new StartHorses(dateRunStarted,horses[0],horses[1],horses[2]);
}

function getStartHorsesFull(){
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
//checks for too less selected cards (figth)
$(document).on('mousedown', '.rgproba__btn.btn--primary.btn.btn--ltr', function(){
//$('body').on('mousedown', function(event){
    let winrate = $('#js-rgproba__value')[0].textContent;
    let selectLess = ('true'=== window.localStorage.getItem('selectLessTry'));
    let selectableHorses = $('.rowguecard:not(.js-rowguecard--disabledclickable):not(.js-rowguecard--selectedfortry)').lenght;
    if (winrate < 100 && selectableHorses>0 && !selectLess) {
        
        let ja = confirm('Willst du wirklich weniger anwählen als du könntest?');
        if (ja) {
            window.localStorage.setItem('selectLessTry', 'true');
        }
        
    }
})
//log selected cards for try xy
$(document).on('click', '.rgproba__btn.btn--primary.btn.btn--ltr', function(){//todo: anhand der erhaltenen fragmente bestimmen, ob boss besiegt wurde (popup kommt direkt nach klick)
    //console.log('Submit pressed');
    //console.log($('.js-rowguecard--selectedfortry'));
    let skillA = $('.rgskills__skill.rgskills__skill--room')[0].children[0].textContent;
    let skillB = $('.rgskills__skill.rgskills__skill--room')[1].children[0].textContent;
    let skillC = $('.rgskills__skill.rgskills__skill--room')[2].children[0].textContent;
    let skillD = $('.rgskills__skill.rgskills__skill--room')[3].children[0].textContent;
    let [room, difficulty] = ['', ''];
    let threshold;
    if (skillA == '18') {
        [room, difficulty] = ['boss', 'difficulty4'];
        threshold = 'boss';

        sleep(1000).then(function() { 
            let fragments;
            let horse;
            if (document.getElementsByClassName("popupview--gift popupview popupview--s")?.[0]?.children?.[1]?.firstChild?.alt === "specialtoken") {
                let youWinText = document.getElementsByClassName("popupview--gift popupview popupview--s")[0].children[3].children[0].children[0].textContent;
                let fragmentsNow = document.getElementsByClassName("popupview--gift popupview popupview--s")[0].children[3].children[1].firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.textContent;
                
                let youWinTextOld = window.localStorage.getItem("youWinText");
                let fragmentsNowOld = window.localStorage.getItem("fragmentsNow");
                if (youWinText!=youWinTextOld || fragmentsNow != fragmentsNowOld) {
                    let fragmentsText = document.getElementsByClassName("popupview--gift popupview popupview--s")[0].children[3].children[0].children[0].textContent;
                    fragments = parseFloat(fragmentsText);
                    horse = $('.gaugespecialtoken__divine')?.[0]?.alt?$('.gaugespecialtoken__divine')?.[0]?.alt:fragmentsText;
                    window.localStorage.setItem("youWinText", youWinText);
                    window.localStorage.setItem("fragmentsNow",fragmentsNow);
                }
                
            }
            let rewardsForLog = new RewardsForLog(threshold, room, difficulty, undefined, fragments, horse);
            addRewardsToLog(rewardsForLog, dateRunStarted);
            console.log(rewardsForLog);
        });

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
    let dateRunStarted = window.localStorage.getItem('dateRunStarted');
    addFightToLog(fight, dateRunStarted);
    console.log(fight);
    window.localStorage.setItem('selectLessTry', 'false');
})

//checks if drachma and sets dateRunStarted und sets "wasSetThisRunStartHorses"='false'
$(document).on('click', '#js-startrunbtn', function(){
    let isDrachma;
    if ($('.form__field__input[value="rowgue-special-ticket"]').get(0).checked) {
        window.localStorage.setItem("drachma", "true");//domain dependent when in content_script
        isDrachma = true;
    }else {
        window.localStorage.setItem("drachma", "false");//domain dependent when in content_script
        isDrachma = false;
    }
    let dateRunStarted = new Date().toString();
    window.localStorage.setItem("dateRunStarted", dateRunStarted);//domain dependent when in content_script
    window.localStorage.setItem("wasSetThisRunStartHorses", 'false');
    console.log("olymp startbutton pressed");

    //add Run to Log
    let olympRun = new OlympRunLogging(dateRunStarted, window.location.host, isDrachma);
    saveRunToLog(olympRun);
    console.log(olympRun);


})

//saves startHorses on entering the first Room
$(document).on('click', '#rowgue__enterbutton', function() {

    //Start horses
    let takeNextClick =  ("true" === window.localStorage.getItem("takeNextClick"));
    let horsecon1 = document.getElementById("js-rowgue__deck__cards");
    let wasSetThisRunStartHorses = ("true" === window.localStorage.getItem("wasSetThisRunStartHorses"));
    let isDrachma = ('true'=== window.localStorage.getItem('drachma'));
    if (takeNextClick || !wasSetThisRunStartHorses && horsecon1 && !isDrachma) {
        window.localStorage.setItem("wasSetThisRunStartHorses", 'true');
        let startHorses = getStartHorses();
        saveStartHorses(startHorses);
        console.log("startHorses:", startHorses);

        //new Logging
        let startHorsesFull = getStartHorsesFull();
        let dateRunStarted = window.localStorage.getItem("dateRunStarted");
        addStartHorsesToLog(startHorsesFull, dateRunStarted);

        //let run = new OlympRun(dateRunStarted, domain, drachma, startHorses);
        console.log(startHorsesFull);
        //endnew Logging
    }



    window.localStorage.setItem("lastRoom", "newRun");
    //end startHorses
})

//checks for too less selected cards (rewards)
$(document).on('mousedown','.js-bonusvalidationbtn', function(){
    //$('body').on('mousedown', function(){
    let jquarySelectedReward = $('.js-block--selected');
    let rewardType = jquarySelectedReward[0].getAttribute('data-bonustype');
    let selectLess = ('true'=== window.localStorage.getItem('selectLess'));
    if ((rewardType =='levelUp' || rewardType == 'staminaRefill') && !selectLess) {
        let numberHorses = jquarySelectedReward.find('.bonuses__bonus__cardtext.text--primary.text--m.mb--0').get(0).textContent.replace(/[^0-9]/g, '');
        let selectableHorses = $('.rowguecard:not(.js-rowguecard--disabled):not(.rowguecard--s)').length;
        if ($('.js-rowguecard--selectedforbonus').length<numberHorses && selectableHorses>$('.js-rowguecard--selectedforbonus').length) {
            let ja = confirm('Willst du wirklich weniger anwählen als du könntest?');
            if (ja) {
                window.localStorage.setItem('selectLess', 'true');
            }
        }
    }
    
});

//Prints new Rewardlogging
$(document).on('click', '.js-bonusvalidationbtn', function(){
//$('body').on('click', function(){
    //console.log('hi!');
    saveRewardForLogging();
    
    window.localStorage.setItem('selectLess', 'false');

});
/*
$(document).on('click', '.js-rowgue__nextroom__btn', function() {
    let bonusHorse = $('.js-rowguecard--bonusnewanimation');
    if (bonusHorse.length>0) {
        let cardId = $('.js-rowguecard--bonusnewanimation')[0].getAttribute('data-cardid');
        console.log(cardId);
        //TODO: add id to savestate
    }
})
*/
function saveRewardForLogging() {
    let rewardOptionsArray = [];
    let jqueryRewardsArray = $('.js-bonuses__bonus');
    let chosenIndex = -1;
    let horseChosen = false;
    for (let index = 0; index < 3; index++) {
        
        const jqueryReward = jqueryRewardsArray.eq(index);
        const domReward = jqueryReward.get(0);
        const rewardType = domReward.getAttribute('data-bonustype'); //newCard, booster, levelUp, staminaRefill
        //console.log(rewardType);
        switch (rewardType) {//$('.js-bonuses__bonus').eq(2).get(0).getAttribute('data-bonustype')
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
                    chosenIndex = index;
                    horseChosen = true;
                    arrayOfTargetIdsH = [$('.js-rowguecard--selectedforbonus')?.[0]?.getAttribute('data-cardid')];
                    //$('.js-bonuses__bonus');//set the jquery object back
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
            case 'levelUp'://TODO: add the targets for 
                console.log(jqueryReward.find('.text--secondary.text--s.mb--3').get(0));
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
            case 'staminaRefill'://TODO: add the targets for 
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
    if ($('.rgskills__skill.rgskills__skill--room')?.[0]?.children[0]?.textContent == '18') {//TODO: funktioniert das?
        [room, difficulty] = ['boss', 'difficulty4'];
        threshold = 'boss';
    } else {
        [room, difficulty] = getRoomAndDifficulty();
        threshold = document.getElementsByClassName("floormap__title yanoneubibold align-center")[0].textContent.replace(/[^0-9]/g, '');
    }

    let fragments;
    let horse;
    if (document.getElementsByClassName("popupview--gift popupview popupview--s")?.[0]?.children?.[1]?.firstChild?.alt === "specialtoken") {
        let youWinText = document.getElementsByClassName("popupview--gift popupview popupview--s")[0].children[3].children[0].children[0].textContent;
        let fragmentsNow = document.getElementsByClassName("popupview--gift popupview popupview--s")[0].children[3].children[1].firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.textContent;
        
        let youWinTextOld = window.localStorage.getItem("youWinText");
        let fragmentsNowOld = window.localStorage.getItem("fragmentsNow");
        if (youWinText!=youWinTextOld || fragmentsNow != fragmentsNowOld) {
            let fragmentsText = document.getElementsByClassName("popupview--gift popupview popupview--s")[0].children[3].children[0].children[0].textContent;
            fragments = parseFloat(fragmentsText);
            horse = $('.gaugespecialtoken__divine')?.[0]?.alt?$('.gaugespecialtoken__divine')?.[0]?.alt:fragmentsText;
            window.localStorage.setItem("youWinText", youWinText);
            window.localStorage.setItem("fragmentsNow",fragmentsNow);
        }
        
    }
    if (horseChosen) {
        sleep(1000).then(function() { 
            let id = $('.js-rowguecard--bonusnewanimation')[0].getAttribute('data-cardid');
            rewardOptionsArray[chosenIndex].id = id;
            let dateRunStarted = window.localStorage.getItem('dateRunStarted');
            let rewardsForLog = new RewardsForLog(threshold, room, difficulty, rewardOptionsArray, fragments, horse);
            addRewardsToLog(rewardsForLog, dateRunStarted);
            console.log(rewardsForLog);
        });
    }else{
        
        let dateRunStarted = window.localStorage.getItem('dateRunStarted');
        let rewardsForLog = new RewardsForLog(threshold, room, difficulty, rewardOptionsArray, fragments, horse);
        addRewardsToLog(rewardsForLog, dateRunStarted);
        console.log(rewardsForLog);
    }
}
function getRunFromTimestamp(arrayOfRuns, timestamp) {
    console.log(arrayOfRuns, timestamp);
    for (let index = 0; index < arrayOfRuns.length; index++) {
        const element = arrayOfRuns[index];
        if (element.dateRunStarted == timestamp) {
            return index;
        }
    }
}
function addRewardsToLog(arrayOfRewards, dateRunStarted) {
    chrome.storage.local.get(["arrayOfRuns"], function(keyValuePairs){
        if (keyValuePairs.arrayOfRuns) {//if array exists
            let index = getRunFromTimestamp(keyValuePairs.arrayOfRuns, dateRunStarted);
            if (typeof index === 'number') {
                keyValuePairs.arrayOfRuns[index].arrayOfRewards.push(arrayOfRewards);
                chrome.storage.local.set({ "arrayOfRuns" : keyValuePairs.arrayOfRuns }, function(){
                    console.log('added rewards');
                });
            }
        }
    });
}
$(document).on('click', function(){
    //let startHorses =  getStartHorsesFull();
    //console.log('adding...');
    //addStartHorsesToLog(startHorses, window.localStorage.getItem('dateRunStarted'));
})
function addFightToLog(fight, dateRunStarted){
    chrome.storage.local.get(["arrayOfRuns"], function(keyValuePairs){
        if (keyValuePairs.arrayOfRuns) {//if array exists
            let index = getRunFromTimestamp(keyValuePairs.arrayOfRuns, dateRunStarted);
            if (typeof index === 'number') {
                keyValuePairs.arrayOfRuns[index].arrayOfFights.push(fight);
                chrome.storage.local.set({ "arrayOfRuns" : keyValuePairs.arrayOfRuns }, function(){
                    console.log('added fight');
                });
            }
        }
    });
}

function addStartHorsesToLog(startHorses, dateRunStarted){
    chrome.storage.local.get(["arrayOfRuns"], function(keyValuePairs){
        if (keyValuePairs.arrayOfRuns) {//if array exists
            let index = getRunFromTimestamp(keyValuePairs.arrayOfRuns, dateRunStarted);
            if (typeof index === 'number') {
                keyValuePairs.arrayOfRuns[index].startHorses = startHorses;
                chrome.storage.local.set({ "arrayOfRuns" : keyValuePairs.arrayOfRuns }, function(){
                    console.log('added starthorses');
                });
            }
        }
    });
}

function saveRunToLog(olympRunLogging) {
    chrome.storage.local.get(["arrayOfRuns"], function(keyValuePairs){
        if (keyValuePairs.arrayOfRuns) {//if array exists
            let index = getRunFromTimestamp(olympRunLogging, olympRunLogging.dateRunStarted);
            if (index) {
                dateRunStarted = new Date().toString();
                window.localStorage.setItem('dateRunStarted', dateRunStarted);
                console.log('wrong timestamp detected, using this one instead: ', dateRunStarted);
                olympRunLogging.dateRunStarted = dateRunStarted;
            }
            keyValuePairs.arrayOfRuns.push(olympRunLogging);
            chrome.storage.local.set({ "arrayOfRuns" : keyValuePairs.arrayOfRuns }, function(){
            });
        }else{
            let arrayOfRuns = [];
            arrayOfRuns.push(olympRunLogging);
            chrome.storage.local.set({ "arrayOfRuns" : arrayOfRuns }, function(){
            });
        }
    });
}
function getSelectedRewardWithTargetsAndSave(rewardOptionsArray){//depricated
    let jquarySelectedReward = $('.js-block--selected');
    let rewardType = jquarySelectedReward[0].getAttribute('data-bonustype');
    switch (rewardType) {//$('.js-block--selected')get(0).getAttribute('data-bonustype')
        case 'newCard':
            let name = jquarySelectedReward.find('.rowguecard__title').get(0).textContent;
            let levelmax = jquarySelectedReward.find('.rowguecard__ribbon__level').get(0).children.length;
            let currentlevel = 1;
            let skilla = jquarySelectedReward.find('.js-rowguecard__skills__skill--skillA').get(0).textContent;
            let skillb = jquarySelectedReward.find('.js-rowguecard__skills__skill--skillB').get(0).textContent;
            let skillc = jquarySelectedReward.find('.js-rowguecard__skills__skill--skillC').get(0).textContent;
            let skilld = jquarySelectedReward.find('.js-rowguecard__skills__skill--skillD').get(0).textContent;
            let currentstamina = 4;
            let arrayOfTargetIdsH = [$('.js-rowguecard--selectedforbonus')?.[0]?.getAttribute('data-cardid')];
            console.log('sleeeeep');
            
              
            sleep(1000).then(function() { 
                let id = $('.js-rowguecard--bonusnewanimation')[0].getAttribute('data-cardid');
                console.log('tada: ', new Horse(name, levelmax, currentlevel, skilla, skillb, skillc, skilld, currentstamina, id, arrayOfTargetIdsH));
                //TODO: dann hier offenbar den safe rein bauen
            });

            
            return new Horse(name, levelmax, currentlevel, skilla, skillb, skillc, skilld, currentstamina, 'undefined', arrayOfTargetIdsH);
        case 'booster':
            
            let dataSkillA = jquarySelectedReward.find('span.rgbooster').get(0).getAttribute('data-skilla');
            let dataSkillB = jquarySelectedReward.find('span.rgbooster').get(0).getAttribute('data-skillb');
            let dataSkillC = jquarySelectedReward.find('span.rgbooster').get(0).getAttribute('data-skillc');
            let dataSkillD = jquarySelectedReward.find('span.rgbooster').get(0).getAttribute('data-skilld');

            return new Booster(dataSkillA, dataSkillB, dataSkillC, dataSkillD);

        case 'levelUp':
            let numberLevel = jquarySelectedReward.find('.text--secondary.text--s.mb--3').get(0).textContent.replace(/[^0-9]/g, '');
            let numberHorses = jquarySelectedReward.find('.bonuses__bonus__cardtext.text--primary.text--m.mb--0').get(0).textContent.replace(/[^0-9]/g, '');
            let arrayOfTargetIds = [];
            let jquerySelectedCards = $('.js-rowguecard--selectedforbonus');
            
            for (let index = 0; index < jquerySelectedCards.length; index++) {
                const element = jquerySelectedCards[index];
                arrayOfTargetIds[index] = element.getAttribute('data-cardid');
            }

            return new LevelUp(numberLevel,numberHorses, arrayOfTargetIds);
        case 'staminaRefill':
            let numberStamina = jquarySelectedReward.find('.text--secondary.text--s.mb--3').get(0).textContent.replace(/[^0-9]/g, '');
            let numberHorsesS = jquarySelectedReward.find('.bonuses__bonus__cardtext.text--primary.text--m.mb--0').get(0).textContent.replace(/[^0-9]/g, '');
            let arrayOfTargetIdsS = [];
            let jquerySelectedCardsS = $('.js-rowguecard--selectedforbonus');
            
            for (let index = 0; index < jquerySelectedCardsS.length; index++) {
                const element = jquerySelectedCardsS[index];
                arrayOfTargetIdsS[index] = element.getAttribute('data-cardid');
            }
            return new StaminRefill(numberStamina,numberHorsesS, arrayOfTargetIdsS);
        default:
            break;
    }
}


$('body').on('click', function() {//
    try {
        //printLogging();
        let lastRoom = window.localStorage.getItem("lastRoom");//domain dependent when in content_script
        lastRoom = (lastRoom ? lastRoom : "Error with lastRoom")

        let con1 = document.getElementsByClassName("block__content").length >3;
    
        //let con2 = document.getElementsByClassName("rgskills rgskills--player clear")[0];
        

        /*fragments
        if (document.getElementsByClassName("popupview--gift popupview popupview--s")?.[0]?.children?.[1]?.firstChild?.alt === "specialtoken") {
            let youWinText = document.getElementsByClassName("popupview--gift popupview popupview--s")[0].children[3].children[0].children[0].textContent;
            let fragmentsNow = document.getElementsByClassName("popupview--gift popupview popupview--s")[0].children[3].children[1].firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.textContent;
            
            let youWinTextOld = window.localStorage.getItem("youWinText");
            let fragmentsNowOld = window.localStorage.getItem("fragmentsNow");
            if (youWinText!=youWinTextOld || fragmentsNow != fragmentsNowOld) {
                console.log(document.getElementsByClassName("popupview--gift popupview popupview--s")[0].children[3].children[0].children[0].textContent, window.location.hostname);
                window.localStorage.setItem("youWinText", youWinText);
                window.localStorage.setItem("fragmentsNow",fragmentsNow);
            }
            
        }
        *///end fragments
        
        //rewards
        let isDrachma = ('true'=== window.localStorage.getItem('drachma'));
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
function printLogging() {
    chrome.storage.local.get(["arrayOfRuns"], function(keyValuePairs){
       console.log(keyValuePairs.arrayOfRuns);
    });
}