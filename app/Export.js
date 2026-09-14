class HowrseDataCompressor {
    // Schemata definieren die Feldordnung
    static SCHEMAS = {
        root: ['arrayOfFights', 'arrayOfRewards', 'dateRunStarted', 'domain', 'drachma', 'startHorses'],
        horse: ['currentlevel', 'currentstamina', 'id', 'levelmax', 'name', 'rewardType', 'skilla', 'skillb', 'skillc', 'skilld'],
        fight: ['arraySelectedHorseIds', 'difficulty', 'room', 'skillA', 'skillB', 'skillC', 'skillD', 'threshold', 'winrate'],

        rewardSet: ['arrayOfRewards', 'dificulty', 'fragments', 'horse', 'room', 'threshold'],
        horseReward: ['arrayOfTargetIds', 'currentlevel', 'currentstamina', 'id', 'levelmax', 'name', 'rewardType', 'skilla', 'skillb', 'skillc', 'skilld',],
        levelUpReward: ['arrayOfTargetIds', 'numberHorses', 'numberLevel', 'rewardType'],
        staminaReward: ['arrayOfTargetIds', 'numberHorses', 'numberStamina', 'rewardType'],
        boosterReward: ['arrayOfTargetIds', 'boosterValue', 'rewardType', 'skill']
    };

    static getSchemaId(schemaName) {
        return Object.keys(this.SCHEMAS).indexOf(schemaName);
    }

    /**
     * Komprimiert ein Objekt in ein Array-Format
     */
    static compress(data) {
        return {
            data: this._compressValue(data, 'root')
        };
    }

    static _compressValue(value, schemaName) {
        if (value === null || value === undefined) return null;

        const schema = this.SCHEMAS[schemaName];
        if (!schema) return value; // Fallback für unbekannte Typen

        if (Array.isArray(value)) {
            // Array von Objekten mit gleichem Schema
            return value.map(item => this._compressObject(item, schemaName));
        }

        return this._compressObject(value, schemaName);
    }

    static _compressObject(obj, schemaName) {
        if (!obj || typeof obj !== 'object') return obj;

        const schema = this.SCHEMAS[schemaName];
        if (!schema) return obj;

        // Spezialbehandlung für verschiedene Reward-Typen und doppelbenennung von arrayOfRewards
        if (schemaName === 'rewardSet' && obj.rewardType === 'Horse') {
            return this._compressObject(obj, 'horseReward');
        }
        if (schemaName === 'rewardSet' && obj.rewardType === 'LevelUp') {
            return this._compressObject(obj, 'levelUpReward');
        }
        if (schemaName === 'rewardSet' && obj.rewardType === 'StaminaRefill') {
            return this._compressObject(obj, 'staminaReward');
        }
        if (schemaName === 'rewardSet' && obj.rewardType === 'Booster') {
            return this._compressObject(obj, 'boosterReward');
        }


        // Standard: Schema-ID + Werte-Array
        const compressed = [this.getSchemaId(schemaName)];

        schema.forEach(fieldName => {
            let value = obj[fieldName];

            // Nested Komprimierung
            if (fieldName === 'arrayOfRewards') {
                value = value?.map(item => this._compressObject(item, 'rewardSet'));
            } else if (fieldName === 'arrayOfFights') {
                value = value?.map(item => this._compressObject(item, 'fight'));
            } else if (fieldName === 'startHorses') {
                value = value?.map(item => this._compressObject(item, 'horse'));
            } else if (fieldName === 'arraySelectedHorseIds' || fieldName === 'arrayOfTargetIds') {
                // Arrays beibehalten
                value = value;
            }

            compressed.push(value ?? null);
        });

        return compressed;
    }

    /**
     * Dekomprimiert ein Array-Format zurück in ein Objekt
     */
    static decompress(compressedData) {
        return this._decompressValue(compressedData.data, 'root');
    }

    static _decompressValue(value, schemaName) {
        if (value === null || value === undefined) return null;

        const schema = this.SCHEMAS[schemaName];
        if (!schema) return value; // Fallback für unbekannte Typen

        if (Array.isArray(value) && value.length > 0) {
            // Prüfe ob es ein komprimiertes Objekt ist (erste Element ist Schema-ID)
            if (typeof value[0] === 'number' && this._getSchemaNameById(value[0])) {
                return this._decompressObject(value);
            }
            // Array von Objekten mit gleichem Schema
            return value.map(item => this._decompressValue(item, schemaName));
        }

        return this._decompressObject(value);
    }

    static _getSchemaNameById(id) {
        const schemaNames = Object.keys(this.SCHEMAS);
        return schemaNames[id] || null;
    }

    static _decompressObject(compressed) {
        if (!Array.isArray(compressed) || compressed.length === 0) return compressed;

        const schemaId = compressed[0];
        const schemaName = this._getSchemaNameById(schemaId);

        if (!schemaName) return compressed; // Fallback

        const schema = this.SCHEMAS[schemaName];
        const obj = {};

        // Werte aus dem Array in Objekt-Felder umwandeln
        schema.forEach((fieldName, index) => {
            let value = compressed[index + 1] ?? null;

            // Nested Dekomprimierung
            if (fieldName === 'arrayOfRewards' && Array.isArray(value)) {
                value = value.map(item => this._decompressValue(item, 'rewardSet'));
            } else if (fieldName === 'arrayOfFights' && Array.isArray(value)) {
                value = value.map(item => this._decompressValue(item, 'fight'));
            } else if (fieldName === 'startHorses' && Array.isArray(value)) {
                value = value.map(item => this._decompressValue(item, 'horse'));
            }

            //the boss reward has no arrayOfRewards
            if (!(fieldName === 'arrayOfRewards' && value === null)) {
                obj[fieldName] = value;

            }
        });

        return obj;
    }

}


function testAll(){
    console.log(testEncodeDecode(g_result));
}

function testEncodeDecode(obj) {

    const sortedObject = HowrseDataSchemaSorter.sort(obj);

    // Original speichern
    const originalJSON = JSON.stringify(sortedObject);
    const originalSize = originalJSON.length;

    // Encode → Decode
    const encoded1 = HowrseDataCompressor.compress(obj);
    const encodedJSON = JSON.stringify(encoded1);
    const encoded = DictionaryCompressor.compress(encodedJSON);
    const encodedSize = encoded.data.length + JSON.stringify(encoded.dictionary).length;

    const decoded1 = DictionaryCompressor.decompress(encoded);
    const decodedObject = JSON.parse(decoded1);
    const decoded = HowrseDataCompressor.decompress(decodedObject);
    const decodedJSON = JSON.stringify(decoded);

    // Ergebnis vergleichen
    const isEqual = originalJSON === decodedJSON;

    // Größenreduktion berechnen
    const reduction = originalSize - encodedSize;
    const reductionPercent = ((reduction / originalSize) * 100).toFixed(2);

    return {
        success: isEqual,
        original: originalJSON,
        encoded: encodedJSON,
        encodedDictionary: encoded,
        decodedDictionary: decoded1,
        decoded: decodedJSON,
        sizes: {
            original: originalSize ,
            encoded: encodedSize,
            saved: reduction,
            reductionPercent: reductionPercent + '%'
        },
        message: isEqual
            ? `✅ Encode/Decode erfolgreich\n📦 Größenreduktion: ${reductionPercent}% (${reduction} bytes gespart)`
            : '❌ Fehler - Resultat weicht vom Original ab'
    };
}

class DictionaryCompressor {
    static marker = "|";
    static defaultStringRegex = /"(?:\\.|[^"\\])*",?/g;

    static compress(
        input,
        minOccurrences = 1,
        stringRegex = DictionaryCompressor.defaultStringRegex
    ) {
        if (typeof input !== "string") {
            throw new TypeError("compress() erwartet einen String.");
        }

        const frequencies = this.countCandidates(input, stringRegex);

        const sortedFrequencies = [...frequencies.entries()].sort(
            ([valueA, frequencyA], [valueB, frequencyB]) => {
                if (frequencyA !== frequencyB) {
                    return frequencyB - frequencyA;
                }

                return valueB.length - valueA.length;
            }
        );

        const dictionary = new Map();
        let dictionaryIndex = 0;

        for (const [value, count] of sortedFrequencies) {
            if (count <= minOccurrences) {
                continue;
            }

            const token =
                this.marker + this.toBase(dictionaryIndex);

            if (token.length < value.length) {
                dictionary.set(value, token);
                dictionaryIndex++;
            }
        }

        let compressed = input;

        // Vorhandene Marker escapen.
        compressed = compressed.replaceAll(
            this.marker,
            this.marker + this.marker
        );

        for (const [value, token] of dictionary) {
            compressed = compressed.replaceAll(value, token);
        }

        return {
            data: compressed,
            dictionary: Object.fromEntries(dictionary)
        };
    }

    static decompress(compressedResult) {
        if (
            !compressedResult ||
            typeof compressedResult.data !== "string" ||
            !compressedResult.dictionary
        ) {
            throw new TypeError(
                "decompress() erwartet das Ergebnis von compress()."
            );
        }

        let result = compressedResult.data;

        const dictionaryEntries = Object.entries(
            compressedResult.dictionary
        );

        dictionaryEntries.sort(([, tokenA], [, tokenB]) => {
            return tokenB.length - tokenA.length;
        });

        for (const [originalValue, token] of dictionaryEntries) {
            result = result.replaceAll(token, originalValue);
        }

        // Ursprüngliche Marker wiederherstellen.
        result = result.replaceAll(
            this.marker + this.marker,
            this.marker
        );

        return result;
    }

    static countCandidates(input, stringRegex) {
        const frequencies = new Map();

        const jsonStrings = input.match(stringRegex) || [];

        for (const value of jsonStrings) {
            this.increment(frequencies, value);
        }

        const delimiter = "],[";
        const delimiterCount = this.countOccurrences(input, delimiter);

        if (delimiterCount > 0) {
            frequencies.set(delimiter, delimiterCount);
        }

        return frequencies;
    }

    static increment(map, key) {
        map.set(key, (map.get(key) || 0) + 1);
    }

    static countOccurrences(text, searchValue) {
        let count = 0;
        let position = 0;

        while (true) {
            const index = text.indexOf(searchValue, position);

            if (index === -1) {
                break;
            }

            count++;
            position = index + searchValue.length;
        }

        return count;
    }

    static toBase(number) {
        const alphabet =
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

        if (number === 0) {
            return alphabet[0];
        }

        let result = "";

        while (number > 0) {
            result = alphabet[number % alphabet.length] + result;
            number = Math.floor(number / alphabet.length);
        }

        return result;
    }
}

function testDictionaryCompressor(string) {
    if (typeof string !== "string") {
        throw new TypeError(
            "testDictionaryCompressor() erwartet einen String."
        );
    }

    const originalSize = string.length;

    const compressor1 = new DictionaryCompressor(
        1,
        /"(?:\\.|[^"\\])*",?/g
    );

    const compressor2 = new DictionaryCompressor(
        1,
        /"(?:\\.|[^"\\])*"/g
    );

    function runTest(name, compressor) {
        const encoded = compressor.compress(string);

        const dataSize = encoded.data.length;
        const dictionaryJSON = JSON.stringify(encoded.dictionary);
        const dictionarySize = dictionaryJSON.length;

        // Komprimierte Gesamtgröße:
        // data + Dictionary
        const compressedTotalSize =
            dataSize + dictionarySize;

        const savedBytes =
            originalSize - compressedTotalSize;

        const reductionPercent =
            originalSize === 0
                ? "0.00"
                : (
                    (savedBytes / originalSize) * 100
                ).toFixed(2);

        const decoded = compressor.decompress(encoded);
        const isEqual = string === decoded;

        return {
            name,
            success: isEqual,

            original: string,
            encoded: encoded.data,
            decoded,

            dictionary: encoded.dictionary,

            sizes: {
                original: originalSize + " bytes",
                compressedData: dataSize + " bytes",
                dictionary: dictionarySize + " bytes",
                compressedTotal: compressedTotalSize + " bytes",
                saved: savedBytes + " bytes",
                reductionPercent: reductionPercent + "%"
            },

            message: isEqual
                ? `✅ ${name}: Encode/Decode erfolgreich\n` +
                `📦 Gesamtgrößenreduktion: ${reductionPercent}% ` +
                `(${savedBytes} bytes gespart)\n` +
                `📏 Original: ${originalSize} bytes → ` +
                `Komprimiert: ${compressedTotalSize} bytes`
                : `❌ ${name}: Resultat weicht vom Original ab`
        };
    }

    const resultWithComma = runTest(
        'Regex mit optionalem Komma',
        compressor1
    );

    const resultWithoutComma = runTest(
        'Regex ohne Komma',
        compressor2
    );

    return {
        success:
            resultWithComma.success &&
            resultWithoutComma.success,

        tests: [
            resultWithComma,
            resultWithoutComma
        ],

        comparison: {
            compressedTotalWithComma:
                resultWithComma.sizes.compressedTotal,

            compressedTotalWithoutComma:
                resultWithoutComma.sizes.compressedTotal,

            dictionarySizeWithComma:
                resultWithComma.sizes.dictionary,

            dictionarySizeWithoutComma:
                resultWithoutComma.sizes.dictionary,

            decodedResultsAreEqual:
                resultWithComma.decoded ===
                resultWithoutComma.decoded
        }
    };
}
class HowrseDataSchemaSorter {
    static sort(data) {
        return this._sortValue(data, "root");
    }

    static _sortValue(value, schemaName) {
        if (value === null || value === undefined) {
            return value;
        }

        if (Array.isArray(value)) {
            return value.map(item => {
                if (item && typeof item === "object" && !Array.isArray(item)) {
                    return this._sortObject(item, schemaName);
                }

                return item;
            });
        }

        if (typeof value === "object") {
            return this._sortObject(value, schemaName);
        }

        return value;
    }

    static _sortObject(obj, schemaName) {
        if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
            return obj;
        }

        const schema = HowrseDataCompressor.SCHEMAS[schemaName];

        if (!schema) {
            return this._sortUnknownObject(obj);
        }

        const effectiveSchemaName = this._getEffectiveSchemaName(
            obj,
            schemaName
        );

        const effectiveSchema =
            HowrseDataCompressor.SCHEMAS[effectiveSchemaName];

        const sortedObject = {};

        // Bekannte Felder in Schema-Reihenfolge einfügen
        for (const fieldName of effectiveSchema) {
            if (!Object.prototype.hasOwnProperty.call(obj, fieldName)) {
                continue;
            }

            let value = obj[fieldName];

            value = this._sortNestedValue(
                value,
                fieldName,
                effectiveSchemaName
            );

            sortedObject[fieldName] = value;
        }

        // Unbekannte Felder am Ende behalten
        for (const fieldName of Object.keys(obj)) {
            if (!effectiveSchema.includes(fieldName)) {
                sortedObject[fieldName] = obj[fieldName];
            }
        }

        return sortedObject;
    }

    static _sortNestedValue(value, fieldName, parentSchemaName) {
        if (value === null || value === undefined) {
            return value;
        }

        switch (fieldName) {
            case "arrayOfFights":
                return this._sortArray(value, "fight");

            case "arrayOfRewards":
                return this._sortArray(value, "rewardSet");

            case "startHorses":
                return this._sortArray(value, "horse");

            case "arraySelectedHorseIds":
            case "arrayOfTargetIds":
                // Primitive Arrays unverändert lassen
                return Array.isArray(value)
                    ? [...value]
                    : value;

            default:
                return value;
        }
    }

    static _sortArray(value, schemaName) {
        if (!Array.isArray(value)) {
            return value;
        }

        return value.map(item => {
            if (item === null || item === undefined) {
                return item;
            }

            if (typeof item !== "object") {
                return item;
            }

            return this._sortObject(item, schemaName);
        });
    }

    static _getEffectiveSchemaName(obj, schemaName) {
        if (schemaName !== "rewardSet") {
            return schemaName;
        }

        switch (obj.rewardType) {
            case "Horse":
                return "horseReward";

            case "LevelUp":
                return "levelUpReward";

            case "StaminaRefill":
                return "staminaReward";

            case "Booster":
                return "boosterReward";

            default:
                return "rewardSet";
        }
    }

    static _sortUnknownObject(obj) {
        const sortedObject = {};

        for (const key of Object.keys(obj).sort()) {
            const value = obj[key];

            if (Array.isArray(value)) {
                sortedObject[key] = value.map(item => {
                    if (item && typeof item === "object") {
                        return this._sortUnknownObject(item);
                    }

                    return item;
                });
            } else if (value && typeof value === "object") {
                sortedObject[key] = this._sortUnknownObject(value);
            } else {
                sortedObject[key] = value;
            }
        }

        return sortedObject;
    }
}



