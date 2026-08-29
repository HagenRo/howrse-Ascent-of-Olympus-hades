
$(document).on('click', '.btn--primary.mt--2.btn', function (event) {
    function untilityGetLocationHost(){
        if ($('#privateMessage.disabled').length>0) {
            return "co." + window.location.host;
        }
        return window.location.host;
    }
    let isGetObolusButton = event.currentTarget.parentElement.parentElement.children[1].firstChild.getAttribute('alt') == 'rowguenormalticket';

    if (isGetObolusButton) {
        saveObolusReceived(untilityGetLocationHost(), new Date().toString());
    }
})


/**Adds the given start horses to chrome.storage.local arrayOfStartHorses.
@param {StartHorses} stratHorses - The start horses to be saved.
@returns {void} */
function saveObolusReceived(url, timeStamp) {
    chrome.storage.local.get(["obolusReceived"], function (keyValuePairs) {
        if (keyValuePairs.obolusReceived) {//if array exists
            keyValuePairs.obolusReceived[url] = timeStamp;
            chrome.storage.local.set({ "obolusReceived": keyValuePairs.obolusReceived }, function () {
            });
        } else {
            let obolusReceived = {};
            obolusReceived[url] = timeStamp;
            chrome.storage.local.set({ "obolusReceived": obolusReceived }, function () {
            });
        }
    });
}