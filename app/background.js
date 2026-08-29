importScripts("Datamanagement.js");
importScripts("dataprocessing.js");
const dataAccessForOlympRuns = new DataAccessForOlympRuns();
const dataAccessForSeasons = new DataAccessForSeasons();


function formatData(data) {
    let formatted = "";
    for (let index = 0; index < data.length; index++) {
        const element = data[index];

        if (formatted == "") {
            formatted = element.dateRunStarted + "\t" + element.timeStamp + "\t" + element.threshold + "\t" + element.room + "\t" + element.dificulty + "\t" + element.reward1 + "\t" + element.reward2 + "\t" + element.reward3;
        } else {
            formatted = formatted + "\n" + element.dateRunStarted + "\t" + element.timeStamp + "\t" + element.threshold + "\t" + element.room + "\t" + element.dificulty + "\t" + element.reward1 + "\t" + element.reward2 + "\t" + element.reward3;
        }
    }
    return formatted;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    for (let index = 0; index < 10000; index++) {
        const element = null;

    }

    switch (message.mdText) {
        case "clear":
            chrome.storage.local.set({ "arrayOfStartHorses": [] });
            chrome.storage.local.set({ "arrayOfRewards": [] });
            let timeStamp = new Date();
            chrome.storage.local.set({ "lastDeleted": timeStamp });
            sendResponse();
            break;
        case "downloadTable":
            downloadTable(sendResponse);
            break;
        case "downloadTable2":
            downloadTable2(sendResponse);
            break;

        /******************
         * new Datamanagement
         */
        case "addRunToDB":
            dataAccessForOlympRuns.addRunToDB(message.olympRun)
                .then(({ msg, result }) => {
                    sendResponse({ msg: msg });
                })
                .catch((e) => {
                    sendResponse({ msg: e });
                });
            break;
        case "addStartHorsesToRun":
            dataAccessForOlympRuns.addStartHorsesToRun(message.startHorsesFull, message.dateRunStarted)
                .then(({ msg, result }) => {
                    sendResponse({ msg: msg });
                })
                .catch((e) => {
                    sendResponse({ msg: e });
                });
            break;
        case "addFightToRun":
            dataAccessForOlympRuns.addFightToRun(message.fight, message.dateRunStarted)
                .then(({ msg, result }) => {
                    console.log(msg)
                    sendResponse({ msg: msg });
                })
                .catch((e) => {
                    console.log('error')
                    sendResponse({ msg: e });
                });
            break;
        case "addRewardsToRun":
            dataAccessForOlympRuns.addRewardsToRun(message.rewards, message.dateRunStarted)
                .then(({ msg, result }) => {
                    sendResponse({ msg: msg });
                })
                .catch((e) => {
                    sendResponse({ msg: e });
                });
            break;
        case "addHorseIdToReward":
            dataAccessForOlympRuns.addHorseIdToReward(message.horseID, message.dateRunStarted)
                .then(({ msg, result }) => {
                    sendResponse({ msg: msg });
                })
                .catch((e) => {
                    sendResponse({ msg: e });
                });
            break;
        case "addBossToRun":
            dataAccessForOlympRuns.addBossToRun(message.rewards, message.fight, message.dateRunStarted)
                .then(({ msg, result }) => {
                    sendResponse({ msg: msg });
                })
                .catch((e) => {
                    sendResponse({ msg: e });
                });
            break;
        case "addLostRunToBossRewards":
            dataAccessForOlympRuns.addLostRunToBossRewards(message.dateRunStarted)
                .then(({ msg, result }) => {
                    sendResponse({ msg: msg });
                })
                .catch((e) => {
                    sendResponse({ msg: e });
                });
            break;
        case "getAllRunsFromDB":
            console.log('getAllRunsFromDB');
            dataAccessForOlympRuns.getAllRuns()
                //dataAccessForOlympRuns.getRunFromTimestamp('Tue Nov 11 2025 02:41:16 GMT+0100 (Mitteleuropäische Normalzeit)')
                .then(({ msg, result }) => {
                    console.log("backgroundjs getAllRunsFromDB dann vor response:", result);
                    sendInChunks(result, sendResponse);
                    //sendResponse({msg: msg, result: result});
                })
                .catch((e) => {
                    sendResponse({ msg: e });
                });
            return true; // wichtig für asynchrone Antwort
            break;
        case "getRunFromTimestamp":
            dataAccessForOlympRuns.getRunFromTimestamp(message.dateRunStarted)
                .then(({ msg, result }) => {
                    sendResponse({ msg: msg, result: result });
                })
                .catch((e) => {
                    sendResponse({ msg: e });
                });
            break;
        case "deleteRunFromTimestamp":
            dataAccessForOlympRuns.deleteRunFromTimestamp(message.dateRunStarted)
                .then(({ msg, result }) => {
                    sendResponse({ msg: msg, result: result });
                })
                .catch((e) => {
                    sendResponse({ msg: e });
                });
            break;
        case "updateRunToDB":
            dataAccessForOlympRuns.updateRunToDB(message.olympRun)
                .then(({ msg, result }) => {
                    sendResponse({ msg: msg, result: result });
                })
                .catch((e) => {
                    sendResponse({ msg: e });
                });
            break;
        case "getKeys":
            dataAccessForOlympRuns.getKeys()
                .then(({ msg, result }) => {
                    sendResponse({ msg: msg, result: result });
                })
                .catch((e) => {
                    sendResponse({ msg: e });
                });
            break;
        case "getAllSeasonsFromDB":
            dataAccessForSeasons.getAllSeasons()
                .then(({ msg, result }) => {
                    sendResponse({ msg: msg, result: result });
                })
                .catch((e) => {
                    sendResponse({ msg: e });
                });
            break;
        case "addSeasonToDB":
            dataAccessForSeasons.addSeasonToDB(message.season)
                .then(({ msg, result }) => {
                    sendResponse({ msg: msg, result: result });
                })
                .catch((e) => {
                    sendResponse({ msg: e });
                });
            break;



        default:
            console.log(message, sender, sendResponse);
            if (sendResponse) {
                sendResponse(message);
            }
            break;
    }

    return true;
});

/**
 * Lädt eine Tabelle als CSV-Datei herunter.
 *
 * Diese Funktion ruft Belohnungs- und Startpferdedaten aus dem lokalen Speicher ab,
 * generiert einen CSV-String aus diesen Daten und initiiert den Download der CSV-Datei.
 * Wenn keine Belohnungsdaten vorhanden sind, wird eine entsprechende Nachricht zurückgegeben.
 *
 * @param {function} sendResponse - Callback-Funktion, um die Antwort an den Aufrufer zu senden.
 *                                  Diese Funktion wird aufgerufen, um das Ergebnis des Downloads
 *                                  oder eine Fehlermeldung zurückzugeben.
 *
 * @returns {void} - Es gibt keinen Rückgabewert. Die Funktion führt asynchrone Operationen durch,
 *                   um die Daten abzurufen und den Download zu initiieren.
 */
function downloadTable(sendResponse) {
    chrome.storage.local.get(["arrayOfRewards", "arrayOfStartHorses"], function (value) {
        if (!value.arrayOfRewards) {
            sendResponse({ mdText: "no Data" });
            return false;
        } else {
            chrome.offscreen.createDocument({
                url: chrome.runtime.getURL("app/offscreen.html"),
                reasons: ["BLOBS"],
                justification: "justification is required.",
            }, () => {
                let data = getCsvString(value.arrayOfRewards, value.arrayOfStartHorses);
                chrome.runtime.sendMessage({ mdText: data }, (response) => {
                    const url = response.url;
                    let timeStamp = new Date();
                    console.log("howrse_stats" + timeStamp.toLocaleDateString().replace('.', '-') + timeStamp.toLocaleTimeString().replace('.', '-') + ".csv")
                    chrome.downloads.download({
                        url: url,
                        filename: "howrse_stats" + '-' + timeStamp.toLocaleDateString().replaceAll('.', '-') + '-' + timeStamp.toLocaleTimeString().replaceAll(':', '-') + ".csv"
                    });
                    chrome.offscreen.closeDocument();
                });
            });
        }

    });
}

/**
 * Lädt eine Tabelle als CSV-Datei herunter.
 * 
 * Diese funktion stellt eine liste zur verfügung mit 3 Spalten: Gewinnwahrscheinlichkeit je Raum | Raum gewonnen Ja/Nein | Hauptgott
 *
 * @param {function} sendResponse - Callback-Funktion, um die Antwort an den Aufrufer zu senden.
 *                                  Diese Funktion wird aufgerufen, um das Ergebnis des Downloads
 *                                  oder eine Fehlermeldung zurückzugeben.
 *
 * @returns {void} - Es gibt keinen Rückgabewert. Die Funktion führt asynchrone Operationen durch,
 *                   um die Daten abzurufen und den Download zu initiieren.
 * 
 * Beispielaufruf:
 * chrome.runtime.sendMessage({ mdText: "downloadTable2" }, (response) => {
        alert(response.mdText);
    });
 */
function downloadTable2(sendResponse) {
    dataAccessForOlympRuns.getAllRuns()
        .then(({ msg, result }) => {
            if (!result) {
                sendResponse({ mdText: "no Data" });
                return false;
            } else {
                chrome.offscreen.createDocument({
                    url: chrome.runtime.getURL("app/offscreen.html"),
                    reasons: ["BLOBS"],
                    justification: "justification is required.",
                }, () => {
                    let data = extractTable(result);
                    chrome.runtime.sendMessage({ mdText: data }, (response) => {
                        const url = response.url;
                        let timeStamp = new Date();
                        console.log("howrse_stats" + timeStamp.toLocaleDateString().replace('.', '-') + timeStamp.toLocaleTimeString().replace('.', '-') + ".csv")
                        chrome.downloads.download({
                            url: url,
                            filename: "howrse_stats" + '-' + timeStamp.toLocaleDateString().replaceAll('.', '-') + '-' + timeStamp.toLocaleTimeString().replaceAll(':', '-') + ".csv"
                        });
                        chrome.offscreen.closeDocument();
                    });
                });
            }

        });
    function extractTable(runs) {
        matrix = [];


        runs.forEach(run => {

            const date = run.dateRunStarted.substr(0, 24);


            let winProb = {}
            winProb.className = 'js-openRun';
            let winProbValue = 1;
            for (let index = 0; index < run.arrayOfFights.length; index++) {
                fight = [];
                const winProbValue = run.arrayOfFights[index].winrate;
                const winProbValueGerman = winProbValue.replace('.', ',');
                const bossDone = run.arrayOfRewards[run.arrayOfRewards.length - 1]?.room == 'boss' && !run.arrayOfRewards[run.arrayOfRewards.length - 1]?.lostRun && !isNaN(parseInt(run.arrayOfRewards[run.arrayOfRewards.length - 1].fragments));
                const won = bossDone || index + 1 < run.arrayOfFights.length;
                const wonNumber = won ? 1 : 0;

                fight.push(date);
                fight.push(winProbValueGerman);
                fight.push(wonNumber);

                matrix.push(fight);

            }
            // winProb.innerHTML = run.arrayOfFights.length == 0 ? '-' : (winProbValue * 100).toFixed(2) + "%";
            // winProb.id = run.arrayOfFights.length == 0 ? '-' : winProbValue;
            // winProb.sortCriteria = run.arrayOfFights.length == 0 ? 0 : winProbValue;//TODO: schauen wie - einträge zu behandeln sind
            // winProb.filterText = winProb.innerHTML.toUpperCase();
            // uIRun.push(winProb);





        });

        return buildCSV(matrix);

        function buildCSV(matrix) {
            let csvString = "";
            for (let index = 0; index < matrix.length; index++) {//rooms
                const array = matrix[index];
                for (let index = 0; index < array.length; index++) {//rewards per room
                    const element = array[index];
                    csvString += element + ";";
                }
                csvString += "\n";
            }
            return csvString;
        }
    }

}

// Funktion um das Array in Chunks zu senden
function sendInChunks(data, sendResponse) {
    const chunkSize = 1000; // Anzahl der Elemente pro Chunk
    let index = 0;

    function sendNextChunk() {
        const chunk = data.slice(index, index + chunkSize);
        // Sendet den Chunk
        chrome.runtime.sendMessage({ type: "data_chunk", data: chunk }, (response) => {
            // Überprüfe die Antwort vom Content-Script, falls nötig
            if (response && response.msg === 'chunk_received') {
                index += chunkSize; // Update den Index für den nächsten Chunk
                if (index < data.length) {
                    sendNextChunk(); // Sende den nächsten Chunk
                } else {
                    sendResponse({ msg: "success" }); // Alle Chunks gesendet
                }
            }
        });
    }

    sendNextChunk(); // Starte den ersten Chunk
}

/*******************************************************************************************************
 * Index DB access
 */

