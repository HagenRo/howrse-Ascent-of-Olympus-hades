/**
 * Class to handle connections and operations with an IndexedDB database.
 */
class DatabaseConnection {
    /**
     * Creates an instance of DatabaseConnection.
     * @param {string} dbName - The name of the database.
     * @param {string} storeName - The name of the object store within the database.
     * @param {string} keyPathd - The key path for the object store.
     */
    constructor(dbName, storeName, keyPathd) {

        this.dbName = dbName;
        this.storeName = storeName;
        this.keyPathd = keyPathd;
        this.db = null;
    }
    /**
     * Initializes the database connection, creating the object store if it doesn't exist.
     * @returns {Promise<IDBDatabase>} - A promise that resolves with the database instance or rejects with an error message.
     */
    async init() {
        return new Promise((resolve, reject) => {

            console.log('indexedDB.open(this.dbName, 1);', this.dbName)

            const request = indexedDB.open(this.dbName, 2);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    console.log('this.storeName')
                    db.createObjectStore(this.storeName, { keyPath: this.keyPathd });
                }
            };

            request.onerror = (event) => {
                console.log('request.onerror')
                reject('Datenbankfehler: ' + event.target.errorCode);
            };

            request.onsuccess = (event) => {
                console.log('request.onsuccess')

                this.db = event.target.result;
                resolve(this.db);
            };
        });
    }
    /**
     * Inserts an item into the object store, or rejects if the item already exists.
     * @param {Object} item - The item to insert.
     * @returns {Promise<Object>} - A promise that resolves with a success message or rejects with an error message.
     */
    async insertOrErrorItem(item) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.add(item);

            request.onsuccess = () => {
                resolve({msg: 'success'});
            };

            request.onerror = (event) => {
                console.log(event);
                reject({msg: event.target.errorCode});
            };
        });
    }
/**
     * Inserts or updates an item in the object store.
     * @param {Object} item - The item to insert or update.
     * @returns {Promise<Object>} - A promise that resolves with a success message or rejects with an error message.
     */
    async insertOrOverrideItem(item) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(item);

            request.onsuccess = () => {
                resolve({msg: 'success'});
            };

            request.onerror = (event) => {
                console.log(event);
                reject({msg: event.target.errorCode});
            };
        });
    }
    /**
     * Retrieves an item by key from the object store.
     * @param {String} id - The key of the item to retrieve.
     * @returns {Promise<Object>} - A promise that resolves with the retrieved item or an error message.
     */
    async getItem(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(id);

            request.onsuccess = (event) => {
                resolve({msg: 'success', result: event.target.result});
            };

            request.onerror = (event) => {
                console.log(event);
                reject({msg: event.target.errorCode});
            };
        });
    }
    /**
     * Deletes an item by key from the object store.
     * @param {String} id - The key of the item to delete.
     * @returns {Promise<Object>} - A promise that resolves with a success message or rejects with an error message.
     */
    async deleteItem(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(id);

            request.onsuccess = () => {
                resolve({msg: 'success'});
            };

            request.onerror = (event) => {
                console.log(event);
                reject({msg: event.target.errorCode});
            };
        });
    }

    // async clearStore() {
    //     return new Promise((resolve, reject) => {
    //         const transaction = this.db.transaction(this.storeName, 'readwrite');
    //         const store = transaction.objectStore(this.storeName);
    //         const request = store.clear();

    //         request.onsuccess = () => {
    //             resolve('Store geleert');
    //         };

    //         request.onerror = (event) => {
    //             reject('Fehler beim Leeren des Stores: ' + event.target.errorCode);
    //         };
    //     });
    // }
    /**
     * Retrieves all keys from the object store.
     * @returns {Promise<Object>} - A promise that resolves with an array of keys or an error message.
     */
    async getAllKeys() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAllKeys();  // Alle Schlüssel abrufen

            request.onsuccess = (event) => {
                resolve({msg: 'success', result: event.target.result});
            };

            request.onerror = (event) => {
                console.log(event);
                reject({msg: event.target.errorCode});
            };
        });
    }
    /**
     * Retrieves all items from the object store.
     * @returns {Promise<Object>} - A promise that resolves with an array of items or an error message.
     */
    async getAllItems() {
        return new Promise((resolve, reject) => {

            const transaction = this.db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();  // Fetch all items
            console.log("getAllItems(), request",request);

            request.onsuccess = (event) => {
                resolve({msg: 'success', result: event.target.result});
            };

            request.onerror = (event) => {
                console.log(event);
                reject({msg: event.target.errorCode});
            };
        });

    }
    // async getItemsInKeyRange(keyRange) {
    //     return new Promise((resolve, reject) => {
    //         const transaction = this.db.transaction(this.storeName, 'readonly');
    //         const store = transaction.objectStore(this.storeName);
    //         const items = [];

    //         const request = store.openCursor(keyRange);

    //         request.onsuccess = (event) => {
    //             const cursor = event.target.result;
    //             if (cursor) {
    //                 items.push(cursor.value); // Collect the current cursor value
    //                 cursor.continue(); // Move to the next entry
    //             } else {
    //                 // No more entries, resolve with collected items
    //                 resolve(items);
    //             }
    //         };

    //         request.onerror = (event) => {
    //             reject('Fehler beim Abrufen der Elemente: ' + event.target.errorCode);
    //         };
    //     });
    // }

    // async getItemsByKeys(keys) {
    //     return new Promise((resolve, reject) => {
    //         const transaction = this.db.transaction(this.storeName, 'readonly');
    //         const store = transaction.objectStore(this.storeName);
    //         const items = [];

    //         const promises = keys.map(key => {
    //             return new Promise((res, rej) => {
    //                 const request = store.get(key);
    //                 request.onsuccess = () => res(request.result);
    //                 request.onerror = (event) => rej('Fehler beim Abrufen des Elements: ' + event.target.errorCode);
    //             });
    //         });

    //         Promise.all(promises)
    //             .then(results => {
    //                 resolve(results);
    //             })
    //             .catch(error => {
    //                 reject(error);
    //             });
    //     });
    // }
}
/**
 * A simple queue implementation for executing promises sequentially.
 */
class Queue {    
    /**
    * The array that holds the queued promises.
    * @type {Array<{promise: function, resolve: function, reject: function}>}
    */
    static queue = [];

    /**
     * A flag to indicate if a promise is currently being processed.
     * @type {boolean}
     */
    static pendingPromise = false;

    /**
     * Enqueues a promise to the queue.
     * This method returns a promise that resolves or rejects depending on the
     * outcome of the enqueued promise.
     *
     * @param {function(): Promise} promise - A function that returns a promise.
     * @returns {Promise} A promise that resolves or rejects based on the enqueued promise.
     */
    static enqueue(promise) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                promise,
                resolve,
                reject,
            });
            this.dequeue();
        });
    }
    /**
     * Dequeues a promise and executes it. 
     * It processes the next promise in the queue if one is present.
     *
     * @returns {boolean} Returns true if a promise was dequeued, otherwise false.
     */
    static dequeue() {
        if (this.workingOnPromise) {
            return false;
        }
        const item = this.queue.shift();
        if (!item) {
            return false;
        }
        try {
            this.workingOnPromise = true;
            item.promise()
                .then((value) => {
                    this.workingOnPromise = false;
                    item.resolve(value);
                    this.dequeue();
                })
                .catch(err => {
                    this.workingOnPromise = false;
                    item.reject(err);
                    this.dequeue();
                })
        } catch (err) {
            this.workingOnPromise = false;
            item.reject(err);
            this.dequeue();
        }
        return true;
    }
}
/**
 * Class responsible for accessing OlympRun data in a database.
 */
class DataAccessForOlympRuns {
    constructor() {
        this.databaseConnection = new DatabaseConnection('Olymp', 'Runs', 'dateRunStarted');
        this.promisQueue = Queue;
        this.initDataAccessForOlympRuns();
    }
    /**
     * Initializes data access for Olymp runs.
     * Enqueues the initialization of the database connection.
     */
    initDataAccessForOlympRuns() {
        this.promisQueue.enqueue(() => {
            return this.databaseConnection.init();
        });

    }

    /**
     * Adds a new run to the database.
     * @param {Object} olympRun - The Olympic run object to be added.
     * @returns {Promise} A Promise that resolves when the run is added.
     */
    addRunToDB(olympRun) {

        return this.promisQueue.enqueue(() => {
            return this.databaseConnection.insertOrErrorItem(olympRun);
        })
    }
    /**
     * Updates an existing run in the database.
     * @param {Object} olympRun - The Olympic run object to be updated.
     * @returns {Promise} A Promise that resolves when the run is updated.
     */
    updateRunToDB(olympRun) {

        return this.promisQueue.enqueue(() => {
            return this.databaseConnection.insertOrOverrideItem(olympRun);
        })
    }
    /**
     * Adds starting horses to an existing run in the database.
     * @param {Array} startHorsesFull - The array of starting horses to be added.
     * @param {string} dateRunStarted - The timestamp of the run to update.
     * @returns {Promise} A Promise that resolves when the horses are added.
     */
    addStartHorsesToRun(startHorsesFull, dateRunStarted) {

        return this.promisQueue.enqueue(() => {
            return this.databaseConnection.getItem(dateRunStarted)
                .then(({msg, result}) => {
                    result.startHorses = startHorsesFull;
                    return this.databaseConnection.insertOrOverrideItem(result);
                })
        });

    }
    /**
     * Adds a fight to an existing run in the database.
     * @param {Object} fight - The fight object to be added.
     * @param {string} dateRunStarted - The timestamp of the run to update.
     * @returns {Promise} A Promise that resolves when the fight is added or rejects if already exists.
     */
    addFightToRun(fight, dateRunStarted) {

        return this.promisQueue.enqueue(() => {
            return this.databaseConnection.getItem(dateRunStarted)
                .then(({msg, result}) => {
                    if (result.arrayOfFights.length == 0 || !(result.arrayOfFights[result.arrayOfFights.length-1].room === fight.room && result.arrayOfFights[result.arrayOfFights.length-1].threshold === fight.threshold) ) {
                        result.arrayOfFights.push(fight);
                        return this.databaseConnection.insertOrOverrideItem(result);
                    }
                    else{
                        return Promise.reject("figth already in database.");
                    }
                    
                })
        });

    }
    /**
     * Adds rewards to an existing run in the database.
     * @param {Object} rewards - The rewards object to be added.
     * @param {string} dateRunStarted - The timestamp of the run to update.
     * @returns {Promise} A Promise that resolves when the rewards are added or rejects if already exists.
     */
    addRewardsToRun(rewards, dateRunStarted) {

        return this.promisQueue.enqueue(() => {
            return this.databaseConnection.getItem(dateRunStarted)
                .then(({msg, result}) => {
                    if (result.arrayOfRewards.length == 0 || !(result.arrayOfRewards[result.arrayOfRewards.length-1].room === rewards.room && result.arrayOfRewards[result.arrayOfRewards.length-1].threshold === rewards.threshold)) {
                        result.arrayOfRewards.push(rewards);
                        return this.databaseConnection.insertOrOverrideItem(result);
                    }
                    else{
                        return Promise.reject("rewards already in database.");
                    }
                })
        });
    }
    /**
     * Adds a horse ID to the last reward in the run's rewards array.
     * @param {string} id - The horse ID to be added.
     * @param {string} dateRunStarted - The timestamp of the run to update.
     * @returns {Promise} A Promise that resolves when the horse ID is added.
     */
    addHorseIdToReward(id, dateRunStarted) {

        return this.promisQueue.enqueue(() => {
            return this.databaseConnection.getItem(dateRunStarted)
                .then(({msg, result}) => {
                    let lastRewards = result.arrayOfRewards[result.arrayOfRewards.length - 1].arrayOfRewards;
                    for (let i = 0; i < lastRewards.length; i++) {
                        const element = lastRewards[i];
                        if (element.arrayOfTargetIds) {
                            element.id = id;
                            break;
                        }
                    }
                    return this.databaseConnection.insertOrOverrideItem(result);
                })
        });
    }
    /**
     * Adds the boss fight and rewards to an existing run.
     * @param {Object} rewards - The rewards object to be added for the boss.
     * @param {Object} fight - The fight object to be added for the boss.
     * @param {string} dateRunStarted - The timestamp of the run to update.
     * @returns {Promise} A Promise that resolves when the boss fight and rewards are added or rejects if already exists.
     */
    addBossToRun(rewards, fight, dateRunStarted) {

        return this.promisQueue.enqueue(() => {
            return this.databaseConnection.getItem(dateRunStarted)
                .then(({msg, result}) => {
                        if (!(result.arrayOfRewards[result.arrayOfRewards.length-1].room === rewards.room && result.arrayOfRewards[result.arrayOfRewards.length-1].threshold === rewards.threshold)) {
                            result.arrayOfRewards.push(rewards);                    
                            result.arrayOfFights.push(fight);

                            return this.databaseConnection.insertOrOverrideItem(result);
                        }
                        else{
                            return Promise.reject("boss already in database.");
                        }
                })
        });

    }
    /**
     * Marks a run as lost for the last boss rewards.
     * @param {string} dateRunStarted - The timestamp of the run to update.
     * @returns {Promise} A Promise that resolves when the lost run is marked.
     */
    addLostRunToBossRewards(dateRunStarted) {

        return this.promisQueue.enqueue(() => {
            return this.databaseConnection.getItem(dateRunStarted)
                .then(({msg, result}) => {
                    let lastRewards = result.arrayOfRewards[result.arrayOfRewards.length - 1];
                    if (lastRewards.room == 'boss') {
                        lastRewards.lostRun = true;
                    }
                    return this.databaseConnection.insertOrOverrideItem(result);
                })
        });
    }
    /**
     * Fetches all runs from the database.
     * @returns {Promise} A Promise that resolves with an array of all runs.
     */
    getAllRuns() {
        return this.promisQueue.enqueue(() => {
            return this.databaseConnection.getAllItems();
        });

    }
    /**
     * Fetches a specific run from the database based on the timestamp.
     * @param {string} dateRunStarted - The timestamp of the run to fetch.
     * @returns {Promise} A Promise that resolves with the requested run data.
     */
    getRunFromTimestamp(dateRunStarted){
        return this.promisQueue.enqueue(() => {
            return this.databaseConnection.getItem(dateRunStarted);
        });
    }
    /**
     * Deletes a specific run from the database based on the timestamp.
     * @param {string} dateRunStarted - The timestamp of the run to delete.
     * @returns {Promise} A Promise that resolves when the run is deleted.
     */
    deleteRunFromTimestamp(dateRunStarted){
        return this.promisQueue.enqueue(() => {
            return this.databaseConnection.deleteItem(dateRunStarted);
        });
    }
    /**
     * Retrieves all keys from the database.
     * @returns {Promise} A Promise that resolves with an array of all keys.
     */
    getKeys(){
        return this.promisQueue.enqueue(() => {
            return this.databaseConnection.getAllKeys();
        });
    }
}

/**
 * Class responsible for accessing season data in a database.
 * jede season hat start und ensdatum, dass über ui vom benutzer definiert wird uhrzeit ist immer 14:00 
 * zusätzlich als anzeigenamen hauptgottname, raritygott, startdatum, enddatum, pferd1, pferd2, pferd3, pferd4, rarity1, rarity2, rarity3, rarity4(für color coding)
 * optional eine berechnung der season statistik hier zusätzlich ablegen???
 */
class DataAccessForSeasons {
    /**
     * Creates an instance of DataAccessForSeasons.
     * Initializes the database connection and sets up the promise queue.
     */
    constructor() {
        this.databaseConnection = new DatabaseConnection('OlympSeasons', 'Seasons', 'seasonStartDate');
        this.promisQueue = Queue;
        console.log('DataAccessForSeasons: constructor')
        this.initDataAccessForSeasons();
    }
    /**
     * Initializes the data access for seasons by connecting to the database.
     * This method is called within the constructor.
     */
    initDataAccessForSeasons() {
        this.promisQueue.enqueue(() => {
            return this.databaseConnection.init();
        });

    }

    /**
     * Adds a new season to the database.
     * 
     * @param {Object} season - The season object to be added to the database.
     * @returns {Promise} - A promise that resolves when the season has been added or rejects if there is an error.
     */
    addSeasonToDB(season) {

        return this.promisQueue.enqueue(() => {
            return this.databaseConnection.insertOrErrorItem(season);
        })
    }
    /**
     * Retrieves all seasons from the database.
     * 
     * @returns {Promise<Array>} - A promise that resolves with an array of all seasons.
     */
    getAllSeasons() {
        return this.promisQueue.enqueue(() => {
            return this.databaseConnection.getAllItems();
        });

    }
    /**
     * Retrieves a season based on its start date.
     * 
     * @param {Date} dateRunStarted - The start date of the season to be retrieved.
     * @returns {Promise<Object>} - A promise that resolves with the season data or rejects if there is an error.
     */
    getSeasonFromStartDate(dateRunStarted){
        return this.promisQueue.enqueue(() => {
            return this.databaseConnection.getItem(dateRunStarted);
        });
    }
    /**
     * Retrieves all keys associated with the seasons in the database.
     * 
     * @returns {Promise<Array>} - A promise that resolves with an array of keys.
     */
    getKeys(){
        return this.promisQueue.enqueue(() => {
            return this.databaseConnection.getAllKeys();
        });
    }
}
