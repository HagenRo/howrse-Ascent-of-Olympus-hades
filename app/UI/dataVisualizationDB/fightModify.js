document.addEventListener('DOMContentLoaded', getRunFromLog);


/**Gets a run logging object from chrome.storage.local arrayOfRuns.*/
function getRunFromLog() {
    let dateRunStarted = decodeURI(window.location.hash).slice(1);
    chrome.runtime.sendMessage({ mdText: "getRunFromTimestamp", dateRunStarted: dateRunStarted }, ({msg, result}) => {
        if (msg === 'success') {
            console.log('getRunFromTimestamp:', msg, result);
            document.getElementById('myTextArea').textContent = JSON.stringify(result, undefined, 4);
        }else{
            console.log('getRunFromTimestamp:', msg);
        }
    });
}
$(document).on('click', '#save', function () {
    // Update the modified data and save it to the storage
    try {

        const olympRun = JSON.parse(document.getElementById('myTextArea').value);
        if (olympRun?.dateRunStarted == decodeURI(window.location.hash).slice(1)) {

            chrome.runtime.sendMessage({ mdText: "updateRunToDB", olympRun: olympRun }, ({msg, result}) => {
                if (msg === 'success') {
                    $('#save').css("background-color", "green");
                }
                console.log('updateRunToDB:', msg, result);                //console.log('loadedRun: ', JSON.stringify(response));
            });
        }


    } catch (error) {
        alert('not a json');
        console.log(error);
    }
})

$(document).on('click', '#saveNew', function () {
    // Update the modified data and save it to the storage
    try {
        const olympRun = JSON.parse(document.getElementById('myTextArea').value);
        //console.log(updatedRun);
        chrome.runtime.sendMessage({ mdText: "addRunToDB", olympRun: olympRun }, ({msg, result}) => {
            if (msg === 'success') {
                console.log('addRunToDB:', msg, result);
                $('#saveNew').css("background-color", "green");
            } else {
                console.log('addRunToDB:', msg);
            }
            //console.log('loadedRun: ', JSON.stringify(response));
        });
    } catch (error) {
        alert('not a json');
        console.log(error);
    }
})

$(document).on('click', '#addRuns', function () {
    // Update the modified data and save it to the storage
    try {
        const runs = JSON.parse(document.getElementById('myTextArea').value);
        console.log(runs);
        if (runs?.[0]?.dateRunStarted) {

            addRuns(runs);
            console.log(runs);
        }else{
            console.log('not the correct format')
        }


    } catch (error) {
        alert('not a json');
        console.log(error);
    }
})


// /**Function to find the index of a run in an array of runs based on a given timestamp.
// @param {OlympRunLogging[]} arrayOfRuns - The array of runs to search in.
// @param {string} timestamp - The timestamp of the run to find.
// @returns {number} - The index of the run in the array, or undefined if not found. */
// function getRunFromTimestamp(arrayOfRuns, timestamp) {
//     //console.log(arrayOfRuns, timestamp);
//     for (let index = 0; index < arrayOfRuns.length; index++) {
//         const element = arrayOfRuns[index];
//         if (element.dateRunStarted == timestamp) {
//             return index;
//         }
//     }
// }
// /**Updates a run.
// @param {OlympRunLogging} olympRunLogging - The run logging object to save. */
// function updateRun(olympRunLogging) {
//     chrome.storage.local.get(["arrayOfRuns"], function (keyValuePairs) {
//         if (keyValuePairs.arrayOfRuns) {//if array exists
//             let index = getRunFromTimestamp(keyValuePairs.arrayOfRuns, olympRunLogging.dateRunStarted);
//             //console.log('test added rewards');
//             if (typeof index === 'number') {
//                 keyValuePairs.arrayOfRuns[index] = olympRunLogging;
//                 chrome.storage.local.set({ "arrayOfRuns": keyValuePairs.arrayOfRuns }, function () {
//                     console.log('Run updated');
//                     $('#save').css("background-color", "green");

//                 });
//             }
//         }
//     })

// }

// /**Save new run.
// @param {OlympRunLogging} olympRunLogging - The run logging object to save. */
// function saveNewRun(olympRunLogging) {
//     chrome.storage.local.get(["arrayOfRuns"], function (keyValuePairs) {
//         if (keyValuePairs.arrayOfRuns) {//if array exists
//             let index = getRunFromTimestamp(keyValuePairs.arrayOfRuns, olympRunLogging.dateRunStarted);
//             //console.log('test added rewards');
//             if (index === undefined) {
//                 keyValuePairs.arrayOfRuns.push(olympRunLogging);
//                 chrome.storage.local.set({ "arrayOfRuns": keyValuePairs.arrayOfRuns }, function () {
//                     console.log('Run saved');
//                     $('#saveNew').css("background-color", "green");

//                 });
//             }
//         }
//     })

// }

/**Add runs.
@param {OlympRunLogging}[] ArrayOfOlympRunLoggings - The run logging object to save. */
function addRuns(ArrayOfOlympRunLoggings) {


    chrome.runtime.sendMessage({ mdText: "getKeys" }, ({ msg, result }) => {
        if (msg === 'success') {
            console.log('getKeys:', msg, result);

            ArrayOfOlympRunLoggings.forEach(olympRun => {
                if (!(olympRun.dateRunStarted in result)) {
                    chrome.runtime.sendMessage({ mdText: "addRunToDB", olympRun: olympRun }, ({ msg, result }) => {
                        console.log("addRunToDB:", msg, olympRun);
                    });
                }
            });

        } else {
            console.log('getKeys:', msg);
        }


    });

}