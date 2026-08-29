
function openIndexedDBHowrseOlympRunsStore() {
    return new Promise((resolve, reject) => {

        if (!indexedDB) {
            console.log("IndexedDB could not be found in this browser.");
            reject("IndexedDB could not be found in this browser.");
        }

        const requestOpen = indexedDB.open("HowrseOlympDatabase", 1);

        requestOpen.onupgradeneeded = function () {
            console.log("onupgradeneeded");

            const howrseOlympDatabase = requestOpen.result;


            const howrseOlympRunsStore = howrseOlympDatabase.createObjectStore("HowrseOlympRunsStore", { keyPath: "dateRunStarted" });

        };

        requestOpen.onerror = function (event) {
            console.error("An error occurred with IndexedDB");
            console.error(event);
            reject(event);
        };

        requestOpen.onsuccess = function (event) {
            console.log("onsuccess");

            const howrseOlympDatabase = event.target.result;
            const transaction = howrseOlympDatabase.transaction("HowrseOlympRunsStore", "readwrite");
            const howrseOlympRunsStore = transaction.objectStore("HowrseOlympRunsStore");
            console.log("onsuccess2");
            resolve(howrseOlympRunsStore);
        };
    })

}

function addRunToHowrseOlympRunsStore(run){
    console.log("addRunToHowrseOlympRunsStore");
    openIndexedDBHowrseOlympRunsStore().then(howrseOlympRunsStore => {
        console.log(run.dateRunStarted);
        howrseOlympRunsStore.add(run);
        console.log("add");

    })
}