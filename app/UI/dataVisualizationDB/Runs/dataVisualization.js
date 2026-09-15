class Season {
    constructor({
        mainGodAltName,
        mainGodDisplayName,
        godRarity,
        seasonStartDate,
        seasonStartTime,
        seasonEndDate,
        seasonEndTime,

        horseAltName1,
        horseAltName2,
        horseAltName3,
        horseAltName4,

        horseDisplayName1,
        horseDisplayName2,
        horseDisplayName3,
        horseDisplayName4,

        horseRarity1,
        horseRarity2,
        horseRarity3,
        horseRarity4
    }) {
        this.mainGodAltName = mainGodAltName;
        this.mainGodDisplayName = mainGodDisplayName;
        this.godRarity = godRarity;

        this.startDate = new Date(seasonStartDate + "T" + seasonStartTime).getTime();

        this.endDate = seasonEndDate === "" ? "" : new Date(seasonEndDate + "T" + seasonEndTime).getTime();

        this.horseAltName1 = horseAltName1;
        this.horseAltName2 = horseAltName2;
        this.horseAltName3 = horseAltName3;
        this.horseAltName4 = horseAltName4;

        this.horseDisplayName1 = horseDisplayName1;
        this.horseDisplayName2 = horseDisplayName2;
        this.horseDisplayName3 = horseDisplayName3;
        this.horseDisplayName4 = horseDisplayName4;

        this.horseRarity1 = horseRarity1;
        this.horseRarity2 = horseRarity2;
        this.horseRarity3 = horseRarity3;
        this.horseRarity4 = horseRarity4;
    }
    stringify() {
        return JSON.stringify(this);
    }
}
class UIBackgroundCommunication {
    static chunkedRuns = [];
    static registerChunkReciever() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.type === "data_chunk") {
                // Verarbeite den Chunk wie benötigt...
                UIBackgroundCommunication.chunkedRuns = UIBackgroundCommunication.chunkedRuns.concat(request.data);

                // Bestätige den Empfang des Chunks
                sendResponse({ msg: 'chunk_received' });
            }
        });
    }
    /**
     * Lädt alle Runs aus der Datenbank über eine Chrome Runtime Message.
     * 
     * Die Methode sendet eine Nachricht an den Background-Service und wartet auf
     * die Antwort mit allen zusammengesammelten Runs. Nach erfolgreichem Laden
     * wird das `chunkedRuns` Array geleert.
     * 
     * @returns {Promise<Array>} Ein Promise, das sich mit einem Array aller Runs auflöst.
     *                            Bei Fehler wird das Promise mit einer Error abgelehnt.
     * 
     * @throws {Error} Wenn die Nachricht vom Background nicht mit 'allChunksSend' antwortet.
     * 
     * @example
     * // Runs laden und verarbeiten
     * UIBackgroundCommunication.loadRuns()
     *     .then(runs => {
     *         console.log("Runs geladen:", runs);
     *         UIBackgroundCommunication.processRuns(runs);
     *     })
     *     .catch(error => console.error("Fehler beim Laden:", error));
     * 
     * @example
     * // Mit async/await
     * const runs = await UIBackgroundCommunication.loadRuns();
     */
    static loadRuns() {
        console.log("am Anfang von loadRuns()");
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ mdText: "getAllRunsFromDB" }, ({ msg, result }) => {
                console.log("loadRuns(), vor dem if", msg, result);
                if (msg === 'allChunksSend') {
                    let allRuns = UIBackgroundCommunication.chunkedRuns;
                    UIBackgroundCommunication.chunkedRuns = [];
                    resolve(allRuns);
                } else {
                    console.log("loadRuns(), else", msg);
                    reject(new Error("Fehler beim Laden der Runs"));
                }
            });
        });
    }
    static exportRuns() {
        chrome.runtime.sendMessage({ mdText: "getAllRunsFromDB" }, ({ msg, result }) => {
            if (msg === 'allChunksSend') {
                UIBackgroundCommunication.runs = UIBackgroundCommunication.chunkedRuns;
                UIBackgroundCommunication.chunkedRuns = [];
            } else {
                console.log(msg);
            }

        });
    }
}
class UIInterface {
    static runs;
    static registerLiveFilter() {
        document.getElementById("filterInput").addEventListener("input", filterUIRuns);
    }
    static registerColumnSort() {
        let header = document.querySelectorAll("th");

        header.forEach(function (th, i) {
            th.addEventListener('click', function () {
                sortUIRuns(i);
            });
        });
    }
    static registerMousoverTooltip() {
        $(document).on('mouseover', '.tooltip', function () {
            let anzahlFragmente = 0;
            let horse = $(this).attr('class').split(' ')[0];
            let elements = document.getElementsByClassName(horse);
            for (let index = 0; index < elements.length; index++) {
                const element = elements[index];
                if (element.parentNode.parentNode.style.display != 'none') {
                    anzahlFragmente += Number(element.id);
                }


            }
            $(this).find('span').text(anzahlFragmente);
        })
    }
    static registerOpenRun() {
        $(document).on('click', '.js-openRun', function () {
            let clickedBtnID = $(this.parentNode).attr('id');
            chrome.tabs.create({ url: `app/UI/dataVisualizationDB/fight.html#${clickedBtnID}`, active: true });
        })
    }
    static registerLoadRunsBySeason() {
        $(document).on('click', '#loadRunsBySeasons', function () {
            let selectetdSeasons = multiSelectSeasonsFromDB.selectedItems;
            console.log(selectetdSeasons);
        })
    }

    static initializeRuns() {
        UIBackgroundCommunication.loadRuns()
            .then(runs => {
                UIInterface.runs = runs;


                UIInterface.UIRuns = buildArrayOfUIRuns(runs);
                UIInterface.UIRuns.sort(sortUIRunsDesc);

                console.log("processRuns(), success", UIInterface.UIRuns);
                buildTableForUIRuns(UIInterface.UIRuns);
                calculateAverage();
            })
            .catch(error => console.error("Fehler:", error));

    }
}

UIBackgroundCommunication.registerChunkReciever();
UIInterface.registerLiveFilter();
UIInterface.registerColumnSort();
UIInterface.registerMousoverTooltip();
UIInterface.registerOpenRun();
UIInterface.registerLoadRunsBySeason();
UIInterface.initializeRuns();

function filterUIRuns() {
    let uIRunFilters = [{//jeder Filter kann genau einen Filter einer art enthalten
        "columnIndex": null,//null um alle spalten zu durchsuchen
        "filterType": "",//"","!","<",">"
        "filterText": "",
    }]
    uIRunFilters = [];

    let input = document.getElementById("filterInput").value.toUpperCase();

    let filterList = input.split('&');
    filterList.forEach(filter => {
        let uIRunFilter = {};
        if (uIRunFilter.columnIndex = /^'(\d+)'([!<>]?)([^!<>].*)$/g.test(filter)) {
            let result = /^'(\d+)'([!<>]?)([^!<>].*)$/g.exec(filter);
            uIRunFilter.columnIndex = result[1];
            uIRunFilter.filterType = result[2];
            uIRunFilter.filterText = result[3];


            if (uIRunFilter.filterType == '<' || uIRunFilter.filterType == '>') {
                try {
                    uIRunFilter.filterText = new Date(uIRunFilter.filterText + ' GMT+0100 (Mitteleuropäische Normalzeit)');

                } catch (error) {//falls bei der nutzung kein korektes datum eingegeben wurde filter abbrechen
                    return;
                }
            }
            uIRunFilters.push(uIRunFilter);

        } else if (uIRunFilter.columnIndex = /^(!?)([^!'].*)$/g.test(filter)) {
            let result = /^(!?)([^!].*)/g.exec(filter);
            uIRunFilter.columnIndex = null;
            uIRunFilter.filterType = result[1];
            uIRunFilter.filterText = result[2];
            uIRunFilters.push(uIRunFilter);

        }


    });


    filteredUIRuns = UIInterface.UIRuns.filter((uIRun) => {
        return uIRunFilters.every(filter => {
            switch (filter.filterType) {
                case "":
                    if (filter.columnIndex) {//filter mit spaltenabhängigkeit
                        const cellText = uIRun[filter.columnIndex].filterText;
                        return cellText.toUpperCase().match(filter.filterText);
                    } else {//filter wird auf ganze zeile angewendet
                        return uIRun.some((column) => {
                            return column.filterText.match(filter.filterText);
                        });
                    }

                case "!":
                    if (filter.columnIndex == -1) {//filter wird auf ganze zeile angewendet

                        return !uIRun.some((column) => {
                            return column.filterText.toUpperCase().match(filter.filterText);
                        });


                    } else {//filter mit spaltenabhängigkeit
                        const cellText = uIRun[filter.columnIndex].filterText;

                        return !cellText.toUpperCase().match(filter.filterText);//wenn ein match gefunden wurde : false
                    }

                case ">":
                    return uIRun[0].sortCriteria > filter.filterText;

                case "<":
                    return uIRun[0].sortCriteria < filter.filterText;

                default:
                    return true;

            }

        });
    })
    buildTableForUIRuns(filteredUIRuns);
}

function calculateAverage() {
    let table = document.getElementById("myTable");
    let tr = table.getElementsByClassName("js-filter");
    let headlines = table.getElementsByTagName("th");

    headlines[0].innerHTML = "Startzeit / Anzahl: " + $(".js-filter:visible").length;

    let headline = headlines[2];
    let sum = 0;
    let count = 0;
    for (let j = 0; j < tr.length; j++) {
        if (tr[j].style.display != "none") {
            const row = tr[j];
            count++;
            sum += Number(row.cells[2].id);
        }
    }
    let average = sum / count;
    headline.innerHTML = 'Drachme' + ': ' + (average * 100).toFixed(2) + "%";


    headline = headlines[3];
    sum = [0, 0, 0, 0];
    for (let j = 0; j < tr.length; j++) {
        if (tr[j].style.display != "none") {
            const row = tr[j];
            count++;
            sum = sum.map(function (num, idx) {
                return num + Array.from(row.cells[3].id.split(',')).map(Number)[idx];
            });

        }
    }
    headline.innerHTML = 'Startpferde' + ': ' + sum;



    headline = headlines[4];
    sum = 0;
    count = 0;
    for (let j = 0; j < tr.length; j++) {
        if (tr[j].style.display != "none" && tr[j].cells[4].id != '-') {
            const row = tr[j];
            count++;
            sum += parseFloat(row.cells[4].id);
        }
    }
    average = sum / count;
    headline.innerHTML = 'Gewinnwahrscheinlichkeit' + ': ' + (average * 100).toFixed(2) + "%";


    headline = headlines[5];
    sum = 0;
    count = 0;
    for (let j = 0; j < tr.length; j++) {
        if (tr[j].style.display != "none") {
            const row = tr[j];
            count++;
            sum += parseFloat(row.cells[5].id);
        }
    }
    average = sum / count;
    headline.innerHTML = 'Boss geschafft' + ': ' + (average * 100).toFixed(2) + "%";


    headline = headlines[6];
    sum = 0;
    count = 0;
    for (let j = 0; j < tr.length; j++) {
        if (tr[j].style.display != "none" && tr[j].cells[6].id != '-') {
            const row = tr[j];
            count++;
            sum += parseFloat(row.cells[6].id);
        }
    }
    average = sum / count;
    headline.innerHTML = 'Raum geschafft' + ': ' + (average).toFixed(2) + " / 22";


    headline = headlines[7];
    sum = 0;
    count = 0;
    for (let j = 0; j < tr.length; j++) {
        if (tr[j].style.display != "none") {
            const row = tr[j];
            count++;
            sum += Number(row.cells[7].id);
        }
    }
    headline.innerHTML = 'Fragmente' + ': ' + sum;


}



let g_collumToSort = 0;
let asc = true;
function sortUIRuns(collumToSort) {
    if (collumToSort == g_collumToSort && asc) {
        asc = false;
        UIInterface.UIRuns.sort(sortUIRunsAsc);

    } else {
        g_collumToSort = collumToSort;
        UIInterface.UIRuns.sort(sortUIRunsDesc);
        asc = true
    }


    buildTableForUIRuns(UIInterface.UIRuns);

}




function sortUIRunsAsc(a, b) {
    if (a[g_collumToSort].sortCriteria > b[g_collumToSort].sortCriteria)
        return 1;
    if (a[g_collumToSort].sortCriteria < b[g_collumToSort].sortCriteria)
        return -1;
    return 0;
}
function sortUIRunsDesc(a, b) {
    return sortUIRunsAsc(a, b) * -1;
}









function buildArrayOfUIRuns(runs) {
    uIRuns = [];


    runs.forEach(run => {

        let uIRun = [];
        uIRun.isVisible = true;
        uIRun.id = run.dateRunStarted;

        let startTime = {}
        startTime.innerHTML = run.dateRunStarted.substr(0, 24);
        //startTime.id = new Date(run.dateRunStarted);
        startTime.sortCriteria = new Date(run.dateRunStarted);
        startTime.filterText = startTime.innerHTML.toUpperCase();
        uIRun.push(startTime);

        let domain = {}
        domain.className = 'js-openRun';
        domain.innerHTML = run.domain;
        domain.sortCriteria = run.domain;
        domain.filterText = domain.innerHTML.toUpperCase();
        uIRun.push(domain);

        let drachma = {}
        drachma.className = 'js-openRun';
        drachma.innerHTML = run.drachma;
        drachma.id = run.drachma ? 1 : 0;
        drachma.sortCriteria = run.drachma;
        drachma.filterText = run.drachma.toString().toUpperCase();
        uIRun.push(drachma);

        let startHorses = {}
        startHorses.className = 'js-openRun';

        let startHorsesTextContent = "";
        let startHorsesCount = [0, 0, 0, 0];
        let startHorsesSortCriteria = 0;
        for (let index = 0; index < run.startHorses.length; index++) {
            const horse = run.startHorses[index];
            switch (horse.levelmax) {
                case 2:
                    startHorsesTextContent += "common";
                    startHorsesCount[0] += 1;
                    startHorsesSortCriteria += 1;
                    break;
                case 3:
                    startHorsesTextContent += "rare";
                    startHorsesCount[1] += 1;
                    startHorsesSortCriteria += 2;
                    break;
                case 4:
                    startHorsesTextContent += "precious";
                    startHorsesCount[2] += 1;
                    startHorsesSortCriteria += 3;

                    break;
                case 5:
                    startHorsesTextContent += "devine";
                    startHorsesCount[3] += 1;
                    startHorsesSortCriteria += 4;

                    break;

                default:
                    break;
            }
            startHorsesTextContent += " ";
        }

        startHorses.innerHTML = startHorsesTextContent;
        startHorses.id = startHorsesCount;
        startHorses.sortCriteria = startHorsesSortCriteria;
        startHorses.filterText = startHorses.innerHTML.toUpperCase();
        uIRun.push(startHorses);

        let winProb = {}
        winProb.className = 'js-openRun';
        let winProbValue = 1;
        for (let index = 0; index < run.arrayOfFights.length; index++) {
            const element = run.arrayOfFights[index].winrate;
            winProbValue *= element / 100;
        }
        winProb.innerHTML = run.arrayOfFights.length == 0 ? '-' : (winProbValue * 100).toFixed(2) + "%";
        winProb.id = run.arrayOfFights.length == 0 ? '-' : winProbValue;
        winProb.sortCriteria = run.arrayOfFights.length == 0 ? 0 : winProbValue;//TODO: schauen wie - einträge zu behandeln sind
        winProb.filterText = winProb.innerHTML.toUpperCase();
        uIRun.push(winProb);

        let boss = {}
        boss.className = 'js-openRun';
        let bossDone = run.arrayOfRewards[run.arrayOfRewards.length - 1]?.room == 'boss' && !run.arrayOfRewards[run.arrayOfRewards.length - 1]?.lostRun && !isNaN(parseInt(run.arrayOfRewards[run.arrayOfRewards.length - 1].fragments));
        boss.innerHTML = bossDone ? "Ja" : "Nein";
        boss.id = bossDone ? 1 : 0;
        boss.sortCriteria = bossDone ? "Ja" : "Nein";//TODO: schauen wie - einträge zu behandeln sind
        boss.filterText = boss.innerHTML.toUpperCase();
        uIRun.push(boss);

        let lastRoom = {}
        lastRoom.className = 'js-openRun';
        let lastRoomValue = bossDone ? 22 : run.arrayOfFights.length - 1;
        lastRoom.innerHTML = run.arrayOfRewards.length > run.arrayOfFights.length + 1 ? "-" : lastRoomValue;
        lastRoom.id = run.arrayOfRewards.length > run.arrayOfFights.length + 1 ? "-" : parseInt(lastRoomValue);
        lastRoom.sortCriteria = run.arrayOfRewards.length > run.arrayOfFights.length + 1 ? 0 : parseInt(lastRoomValue);//TODO: schauen wie - einträge zu behandeln sind
        lastRoom.filterText = toString(lastRoom.innerHTML)//.toUpperCase();
        uIRun.push(lastRoom);

        let fragment = {}
        fragment.className = 'js-openRun';

        let fragments = { 'alle': 0 };
        for (let index = 0; index < run.arrayOfRewards.length; index++) {
            const element = run.arrayOfRewards[index];
            if (!isNaN(Number(element.fragments)) && !element.lostRun) {
                if (fragments[element.horse]) {
                    fragments[element.horse] += Number(element.fragments);
                    fragments.alle += Number(element.fragments);
                } else {
                    fragments[element.horse] = Number(element.fragments);
                    fragments.alle += Number(element.fragments);
                }
            }
        }
        let textContent = "";
        let filterText = "";
        for (const [key, value] of Object.entries(fragments)) {
            textContent += `<div class="${key} tooltip" id="${value}">${key}: ${value};<span class="tooltiptext">Tooltip text</span></div>`;
            filterText += key + ": " + value + ";";
        }

        fragment.innerHTML = textContent;
        fragment.id = fragments.alle;
        fragment.sortCriteria = fragments.alle;
        fragment.filterText = filterText.toUpperCase();
        uIRun.push(fragment);

        uIRuns.push(uIRun);

    });

    return uIRuns;
}

function buildTableForUIRuns(uIRuns) {
    $("#myTable > tbody").html("");


    let table = document.getElementById("myTableBody");
    uIRuns.forEach(uIRun => {
        if (uIRun.isVisible) {


            let row = table.insertRow(-1);
            row.className = "js-filter";//TODO eventuell raus?
            row.id = uIRun.id;

            for (let index = 0; index < uIRun.length; index++) {

                let cell = row.insertCell(index);
                const uIRunProperty = uIRun[index];
                cell.className = uIRunProperty.className;
                cell.innerHTML = uIRunProperty.innerHTML;
                cell.id = uIRunProperty.id;
            }
        }
    });

    calculateAverage();

}

//TODO: anpassen an neu definierte Season klasse
function addSeasonToDB(startDateOfSeason) {
    let date = new Date(startDateOfSeason);
    let season = {
        seasonStartDate: date.getTime(),
        seasonStartDateHumanReadable: date.toString()
    };
    chrome.runtime.sendMessage({ mdText: "addSeasonToDB", season: season }, ({ msg, result }) => {
        if (msg === 'success') {
            console.log(msg, result);
        } else {
            console.log(msg);
        }

    });
}



//---------------------------------------------------------------------------------------
// temp code for new version 

function sortByDate(a, b) {
    if (new Date(a.dateRunStarted) > new Date(b.dateRunStarted)) {
        return -1;
    } else if (new Date(a.dateRunStarted) < new Date(b.dateRunStarted)) {
        return 1;
    }
    // a must be equal to b
    return 0;
}

let arrayOfRunsOrgVersion;
function compareVersions() {
    chrome.storage.local.get(["arrayOfRuns"], function (keyValuePairs) {
        console.log(keyValuePairs)
        if (keyValuePairs.arrayOfRuns) {//if array exists
            arrayOfRunsOrgVersion = keyValuePairs.arrayOfRuns;
            console.log(arrayOfRunsOrgVersion);

            arrayOfRunsOrgVersion.sort(sortByDate);
            UIInterface.UIRuns.sort(sortUIRunsDesc);

            let orgIndex = 0;
            for (let index = 0; index < UIInterface.UIRuns.length; index++) {
                let run = UIInterface.UIRuns[index];
                let runOrg = arrayOfRunsOrgVersion[orgIndex];
                while (new Date(run.id) < new Date(runOrg.dateRunStarted)) {
                    orgIndex++;
                    runOrg = arrayOfRunsOrgVersion[orgIndex];
                }
                if (run.id == runOrg.dateRunStarted) {
                    if (run[1].innerHTML == runOrg.domain && (run[6].innerHTML == runOrg.arrayOfFights.length - 1 || run[6].innerHTML == runOrg.arrayOfFights.length && run[5].innerHTML == 'Ja' || runOrg.arrayOfFights.length == 0 && run[6].innerHTML == '-')) {
                        document.getElementById(run.id).style.backgroundColor = 'green';
                    }
                    else {
                        console.log("Die Bedingungen sind erfüllt:");
                        console.log("run[1]:", run[1].innerHTML);
                        console.log("runOrg.domain:", runOrg.domain);
                        console.log("run[6]:", run[6].innerHTML);
                        console.log("runOrg.arrayOfFights.length:", runOrg.arrayOfFights.length);
                        document.getElementById(run.id).style.backgroundColor = 'red';
                    }
                }
                else {
                    document.getElementById(run.id).style.backgroundColor = 'yellow';
                }

                //console.log(run);
                //test if run are equal
            }



        }
    });
}

