console.log(decodeURI(window.location.hash));

let olympRun;

/**Function to find the index of a run in an array of runs based on a given timestamp.
@param {OlympRunLogging[]} arrayOfRuns - The array of runs to search in.
@param {string} timestamp - The timestamp of the run to find.
@returns {number} - The index of the run in the array, or undefined if not found. */
function getRunFromTimestamp(arrayOfRuns, timestamp) {
    //console.log(arrayOfRuns, timestamp);
    for (let index = 0; index < arrayOfRuns.length; index++) {
        const element = arrayOfRuns[index];

        if ('#' + element.dateRunStarted == timestamp) {
            console.log(element.dateRunStarted);

            return index;
        }
    }
}

/**Gets a run logging object from chrome.storage.local arrayOfRuns.
@param {string} dateRunStarted - The timstamp of the run */
function getRunFromLog(dateRunStarted) {
    chrome.storage.local.get(["arrayOfRuns"], function (keyValuePairs) {
        if (keyValuePairs.arrayOfRuns) {//if array exists
            let index = getRunFromTimestamp(keyValuePairs.arrayOfRuns, dateRunStarted);
            olympRun = keyValuePairs.arrayOfRuns[index];
            console.log(keyValuePairs.arrayOfRuns[index]);
            fillH3(olympRun);
        }
    });
}

function fillH3(run) {
    const h3Elements = document.querySelectorAll('.sidebar h3');

    h3Elements.forEach((h3) => {
        switch (h3.previousElementSibling.innerText) {
            case 'Startzeit':
                h3.innerText = run.dateRunStarted.substr(0, 24);
                break;
            case 'Domain':
                h3.innerText = run.domain;
                break;
            case 'Drachme':
                h3.innerText = run.drachma;
                break;
            case 'Startpferde':
                let startHorsesTextContent = "";
                for (let index = 0; index < run.startHorses.length; index++) {
                    const horse = run.startHorses[index];
                    switch (horse.levelmax) {
                        case 2:
                            startHorsesTextContent += "common";
                            break;
                        case 3:
                            startHorsesTextContent += "rare";
                            break;
                        case 4:
                            startHorsesTextContent += "precious";
                            break;
                        case 5:
                            startHorsesTextContent += "devine";
                            break;

                        default:
                            break;
                    }
                    startHorsesTextContent += " ";
                }

                h3.innerText = startHorsesTextContent;
                break;
            case 'Gewinnwahrscheinlichkeit':
                let winProb = 1;
                for (let index = 0; index < run.arrayOfFights.length; index++) {
                    const element = run.arrayOfFights[index].winrate;
                    winProb *= element / 100;
                }
                h3.innerText = (winProb * 100).toFixed(2) + "%";
                break;
            case 'Boss geschafft':
                let bossDone = run.arrayOfRewards[run.arrayOfRewards.length - 1].room == 'boss' && run.arrayOfRewards[run.arrayOfRewards.length - 1].fragments;
                h3.innerText = bossDone ? "Ja" : "Nein";
                break;
            case 'Fragmente':
                let fragments = {};
                for (let index = 0; index < run.arrayOfRewards.length; index++) {
                    const element = run.arrayOfRewards[index];
                    if (!isNaN(Number(element.fragments))) {
                        //console.log(Number(element.fragments));
                        if (fragments[element.horse]) {
                            fragments[element.horse] += Number(element.fragments);
                        } else {
                            fragments[element.horse] = Number(element.fragments);
                        }
                    }
                }
                //console.log(fragments);
                let textContent = "";
                for (const [key, value] of Object.entries(fragments)) {
                    //console.log(`${key}: ${value}; `);
                    textContent += `${key}: ${value}<br>`;
                }
                h3.innerHTML = textContent;
                break;
            default:
                h3.innerText = 'Unknown';
                break;
        }
    });
}

getRunFromLog(decodeURI(window.location.hash));

document.getElementsByTagName("embed")[0].src = `fightModify.html${window.location.hash}`

/**Delete a run logging object from chrome.storage.local arrayOfRuns.
@param {string} dateRunStarted - The timstamp of the run */
function deleteRunFromLog(dateRunStarted) {
    chrome.storage.local.get(["arrayOfRuns"], function (keyValuePairs) {
        if (keyValuePairs.arrayOfRuns) {//if array exists
            let index = getRunFromTimestamp(keyValuePairs.arrayOfRuns, dateRunStarted);
            //console.log(keyValuePairs.arrayOfRuns);
            //console.log(index);
            olympRun = keyValuePairs.arrayOfRuns.splice(index, 1);
            //console.log(keyValuePairs.arrayOfRuns);
            chrome.storage.local.set({ "arrayOfRuns": keyValuePairs.arrayOfRuns }, function () {
                console.log('deleted run: ', olympRun);
            });
        }
    });
}

$(document).on('click', '#delete', function () {
    const dateRunStarted = decodeURI(window.location.hash);
    let bool = confirm('Eintritt streng verboten!')
    if (bool) {
        bool = confirm('Eintritt strengstens verboten!')
        if (bool) {
            bool = confirm('Eintritt allerstrengstens verboten!')
            if (bool) {
                deleteRunFromLog(dateRunStarted);
            }
        }
    }

})
