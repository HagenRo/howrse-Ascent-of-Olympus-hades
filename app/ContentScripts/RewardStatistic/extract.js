const roomMapping = {
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
class RS_RewardsForRoom {
    constructor(
        dateRunStarted,
        timeStamp,
        threshold,
        room,
        dificulty,
        reward1,
        reward2,
        reward3
    ) {
        this.dateRunStarted = dateRunStarted;
        this.timeStamp = timeStamp;
        this.threshold = threshold;
        this.room = room;
        this.dificulty = dificulty;
        this.reward1 = reward1;
        this.reward2 = reward2;
        this.reward3 = reward3;
    }

    toString() {
        return `${this.threshold}.${this.room}; ${this.reward1}; ${this.reward2}; ${this.reward3}`;
    }
}
/**
 * Represents the starting horses.
 */
class RS_StartHorses {
    /**
     * @param {Date} dateRunStarted - The date when the horse race started.
     * @param {string} horse1 - The rarity of the first horse.
     * @param {string} horse2 - The rarity of the second horse.
     * @param {string} horse3 - The rarity of the third horse.
     */
    constructor(dateRunStarted, horse1, horse2, horse3) {
        this.dateRunStarted = dateRunStarted;
        this.horse1 = horse1;
        this.horse2 = horse2;
        this.horse3 = horse3;
    }
}

class RS_Extractor {
    //setzt den RS_shouldLog wert beim starten eines neuen runs. Damit nur Obolus geloggt werden.
    static registerNewRunStarted() {
        //checks if drachma
        $(document).on('click', '#js-startrunbtn', function () {
            RS_initNewRun();
        })
    }

    static registerSaveStartHorses() {
        //saves startHorses on entering the first Room and sets lastRoom to 'newRun'
        $(document).on('click', '#rowgue__enterbutton', function () {

            let threshold = document.getElementsByClassName("floormap__title yanoneubibold align-center")?.[0]?.textContent?.replace(/[^0-9]/g, '');
            let roomDone = $('.rgmap__room__pix--done').length;
            let shouldLog = ('true' === window.localStorage.getItem('RS_shouldLog'));
            let room = window.localStorage.getItem("RS_lastRoom");
            if (threshold == '1' && roomDone == '0' && shouldLog && room !== 'startHorses') {
                let startHorses = RS_Extractor.getStartHorses();
                RS_Extractor.saveStartHorses(startHorses);
                console.log("startHorses:", startHorses);
            }
            window.localStorage.setItem("RS_lastRoom", "startHorses");
        })
    }
    //auslesen und speichern der rewards eines raumes
    static registerSaveRewards() {
        $('body').on('click', function () {//
            try {
                let lastRoom = window.localStorage.getItem("RS_lastRoom");//domain dependent when in content_script
                let con1 = document.getElementById("js-bonuses");

                let shouldLog = ('true' === window.localStorage.getItem('RS_shouldLog'));
                if (con1 && lastRoom != RS_Extractor.getRoom() && shouldLog) {

                    let rewards = RS_Extractor.getRewards();
                    RS_Extractor.saveRewards(rewards);
                    window.localStorage.setItem("RS_lastRoom", RS_Extractor.getRoom());//domain dependent when in content_script
                }

            } catch (error) {
                console.log(error);
                alert("An Error occured, for more information take a look in the console. \nThis could corrupt the Data gathered from the addon, so make shure you download and clear befor you proceed.");
            }
        });
    }


    /**Retrieves the rewards from the current room run.
    @returns {RS_RewardsForRoom} The rewards for the current room run. */
    static getRewards() {
        let extractedRewards = [];
        let dateRunStarted = window.localStorage.getItem("RS_dateRunStarted");
        let timeStamp = new Date();
        let thresholdNumber = document.getElementsByClassName("floormap__title yanoneubibold align-center")[0].textContent.replace(/[^0-9]/g, '');
        const [room, difficulty] = RS_Extractor.getRoomAndDifficulty();
        const root = document.getElementById('js-bonuses');
        const htmlRewardBox = root.querySelectorAll('.block__content');
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
        const reward = new RS_RewardsForRoom(dateRunStarted.toString(), timeStamp.toString(), thresholdNumber, room, difficulty, extractedRewards[0], extractedRewards[1], extractedRewards[2]);
        console.log("reward:", reward.toString());
        return reward;
    }
    /**Retrieves the room and difficulty level of the current room.
    @returns {Array} An array containing the room and difficulty level.
    The first element in the array is the room, and the second element is the difficulty level. */
    static getRoomAndDifficulty() {
        const [roomCoordinates, difficulty] = getRoomCoordinatesAndDifficulty();
        return [roomMapping[roomCoordinates], difficulty];

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
    static getRoom() {
        const [roomCoordinates, _] = RS_Extractor.getRoomAndDifficulty();
        return roomCoordinates;
    }
    /**Adds the rewards to chrome.storage.local arrayOfRewards.
    @param {RS_RewardsForRoom} rewards - The rewards to be saved */
    static saveRewards(rewards) {
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
    @param {RS_StartHorses} stratHorses - The start horses to be saved.
    @returns {void} */
    static saveStartHorses(stratHorses) {
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
    @returns {RS_StartHorses} The starting horses containing the date run started and the types of horses. */
    static getStartHorses() {
        let htmlHorses = document.getElementById("js-rowgue__deck__cards");
        let dateRunStarted = window.localStorage.getItem("RS_dateRunStarted");//domain dependent when in content_script
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
        return new RS_StartHorses(dateRunStarted, horses[0], horses[1], horses[2]);
    }


    /**
     * Initializes a new run and stores its initial state in localStorage.
     *
     * @param {"true"|"false"} [shouldLog] - Whether logging should be enabled.
     * @param {string} [dateRunStarted] - The start date of the run as a date string,
     * e.g. `"Mon Aug 31 2026 17:39:08 GMT+0200 (Central European Summer Time)"`.
     * If omitted, the current date and time are used.
     * @returns {void}
     */
    static initNewRun(shouldLog, dateRunStarted) {
        window.localStorage.setItem("RS_dateRunStarted", dateRunStarted ? dateRunStarted : new Date());
        window.localStorage.setItem("RS_shouldLog", shouldLog ? shouldLog : !$('.form__field__input[value="rowgue-special-ticket"]').prop("checked"));
        window.localStorage.setItem("RS_lastRoom", "newRun");
    }

}

RS_Extractor.registerNewRunStarted();
RS_Extractor.registerSaveRewards();
RS_Extractor.registerSaveStartHorses();




