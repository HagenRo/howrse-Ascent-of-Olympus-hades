document.addEventListener('DOMContentLoaded', getRunFromLog);


/**Gets a run logging object from chrome.storage.local arrayOfRuns.*/
function getRunFromLog() {
    let dateRunStarted = decodeURI(window.location.hash).slice(1);

    chrome.storage.local.get(["arrayOfRuns"], function (keyValuePairs) {
        if (keyValuePairs.arrayOfRuns) {//if array exists
            let index = getRunFromTimestamp(keyValuePairs.arrayOfRuns, dateRunStarted);
            olympRun = keyValuePairs.arrayOfRuns[index];
            console.log(keyValuePairs.arrayOfRuns[index]);
            document.getElementById('myTextArea').textContent = JSON.stringify(olympRun, undefined, 4);
        }
    });
}
$(document).on('click', '#save', function () {
    // Update the modified data and save it to the storage
    try {

        const updatedRun = JSON.parse(document.getElementById('myTextArea').value);
        if (updatedRun?.dateRunStarted == decodeURI(window.location.hash).slice(1)) {
            
            updateRun(updatedRun);
            console.log(updatedRun);
        }


    } catch (error) {
        alert('not a json');
        console.log(error);
    }
})

$(document).on('click', '#saveNew', function () {
    // Update the modified data and save it to the storage
    try {
        const updatedRun = JSON.parse(document.getElementById('myTextArea').value);
        //console.log(updatedRun);
        saveNewRun(updatedRun);

    } catch (error) {
        alert('not a json');
        console.log(error);
    }
})

$(document).on('click', '#addRuns', function () {
    // Update the modified data and save it to the storage
    try {
        const runs = JSON.parse(document.getElementById('myTextArea').value).arrayOfRuns;
        if (runs?.[0]?.dateRunStarted) {
            
            addRuns(runs);
            console.log(runs);
        }


    } catch (error) {
        alert('not a json');
        console.log(error);
    }
})


/**Function to find the index of a run in an array of runs based on a given timestamp.
@param {OlympRunLogging[]} arrayOfRuns - The array of runs to search in.
@param {string} timestamp - The timestamp of the run to find.
@returns {number} - The index of the run in the array, or undefined if not found. */
function getRunFromTimestamp(arrayOfRuns, timestamp) {
    //console.log(arrayOfRuns, timestamp);
    for (let index = 0; index < arrayOfRuns.length; index++) {
        const element = arrayOfRuns[index];
        if (element.dateRunStarted == timestamp) {
            return index;
        }
    }
}
/**Updates a run.
@param {OlympRunLogging} olympRunLogging - The run logging object to save. */
function updateRun(olympRunLogging) {
    chrome.storage.local.get(["arrayOfRuns"], function (keyValuePairs) {
        if (keyValuePairs.arrayOfRuns) {//if array exists
            let index = getRunFromTimestamp(keyValuePairs.arrayOfRuns, olympRunLogging.dateRunStarted);
            //console.log('test added rewards');
            if (typeof index === 'number') {
                keyValuePairs.arrayOfRuns[index] = olympRunLogging;
                chrome.storage.local.set({ "arrayOfRuns": keyValuePairs.arrayOfRuns }, function () {
                    console.log('Run updated');
                    $('#save').css("background-color", "green");

                });
            }
        }
    })

}

/**Save new run.
@param {OlympRunLogging} olympRunLogging - The run logging object to save. */
function saveNewRun(olympRunLogging) {
    chrome.storage.local.get(["arrayOfRuns"], function (keyValuePairs) {
        if (keyValuePairs.arrayOfRuns) {//if array exists
            let index = getRunFromTimestamp(keyValuePairs.arrayOfRuns, olympRunLogging.dateRunStarted);
            //console.log('test added rewards');
            if (index === undefined) {
                keyValuePairs.arrayOfRuns.push(olympRunLogging);
                chrome.storage.local.set({ "arrayOfRuns": keyValuePairs.arrayOfRuns }, function () {
                    console.log('Run saved');
                    $('#saveNew').css("background-color", "green");

                });
            }
        }
    })

}

/**Add runs.
@param {OlympRunLogging} olympRunLogging - The run logging object to save. */
function addRuns(ArrayOfOlympRunLoggings) {
    let count = 0;
    chrome.storage.local.get(["arrayOfRuns"], function (keyValuePairs) {
        if (keyValuePairs.arrayOfRuns) {//if array exists
            for (let index = 0; index < ArrayOfOlympRunLoggings.length; index++) {
                const olympRunLogging = ArrayOfOlympRunLoggings[index];
                let indexTimestamp = getRunFromTimestamp(keyValuePairs.arrayOfRuns, olympRunLogging.dateRunStarted);
                //console.log('test added rewards');
                if (indexTimestamp === undefined) {
                    keyValuePairs.arrayOfRuns.push(olympRunLogging);
                    count++;
                }
            }
            chrome.storage.local.set({ "arrayOfRuns": keyValuePairs.arrayOfRuns }, function () {
                console.log(count, ' Runs saved');
                $('#addRuns').css("background-color", "green");

            });

        }
        else{
            chrome.storage.local.set({ "arrayOfRuns": ArrayOfOlympRunLoggings }, function () {
                console.log(count, ' Runs saved');
                $('#addRuns').css("background-color", "green");

            });
        }
    })

}