

function getMatrixWithCountedRewards(data){
    let matrix = createMatrixFilledWithZeros(40,20);
    let arraydateRunStarted = [];
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (!arraydateRunStarted.includes(element.dateRunStarted)) {//TODO Funktioniert nicht--zählt irgendwie nur bis 1
            matrix[1][1] += 1;
            arraydateRunStarted.push(element.dateRunStarted);
        }
        matrix[indexMapping(element.threshold+"."+element.room)][1] +=1;//gesamt
        matrix[indexMapping(element.threshold+"."+element.room)][indexMapping(element.reward1.toString())] +=1;
        matrix[indexMapping(element.threshold+"."+element.room)][indexMapping(element.reward2.toString())] +=1;
        matrix[indexMapping(element.threshold+"."+element.room)][indexMapping(element.reward3.toString())] +=1;
    }
    return matrix;
}
function addStartHorsesToMatrix(matrix, arrayOfStartHorses){
    for (let index = 0; index < arrayOfStartHorses.length; index++) {
        const element = arrayOfStartHorses[index];
        matrix[1][indexMapping(element.horse1)] += 1;
        matrix[1][indexMapping(element.horse2)] += 1;
        matrix[1][indexMapping(element.horse3)] += 1;
    }
    return matrix;
}
function addSums(matrix){
    for (let col = 1; col < 20; col++) {
        let sum = 0;
        for (let row = 3; row < 13; row++) {
            sum += matrix[row][col];
        }
        matrix[2][col] = sum;
    }
    for (let col = 1; col < 20; col++) {
        let sum = 0;
        for (let row = 14; row < 25; row++) {
            sum += matrix[row][col];
        }
        matrix[13][col] = sum;
    }
    for (let col = 1; col < 20; col++) {
        let sum = 0;
        for (let row = 26; row < 40; row++) {
            sum += matrix[row][col];
        }
        matrix[25][col] = sum;
    }
    return matrix;
}
function addHeadlinesToTable(matrix){
    matrix[0][0] = "Begegnung / Anz.";
    matrix[0][1] = "Gesamt";
    matrix[0][2] = "2* Pferd";
    matrix[0][3] = "3* Pferd";
    matrix[0][4] = "4* Pferd";
    matrix[0][5] = "5* Pferd";
    matrix[0][6] = "1 Energie für 2";
    matrix[0][7] = "2 Energie für 1";
    matrix[0][8] = "1 Energie für 4";
    matrix[0][9] = "2 Energie für 2";
    matrix[0][10] = "1 Energie für 6";
    matrix[0][11] = "2 Energie für 3";
    matrix[0][12] = "3 Energie für 2";
    matrix[0][13] = "1 Lv für 1";
    matrix[0][14] = "1 Lv für 2";
    matrix[0][15] = "2 Lv für 1";
    matrix[0][16] = "Booster +4";
    matrix[0][17] = "Booster +6";
    matrix[0][18] = "Booster +8";
    matrix[0][19] = "Booster +10";
    matrix[1][0] = "Startpferde";
    matrix[2][0] = "Ebene 1";
    matrix[3][0] = "1m (grün)";
    matrix[4][0] = "2m (grün)";
    matrix[5][0] = "3l (grün)";
    matrix[6][0] = "3r (orange)";
    matrix[7][0] = "4m (orange)";
    matrix[8][0] = "5l (grün)";
    matrix[9][0] = "5r (orange)";
    matrix[10][0] = "6l (orange)";
    matrix[11][0] = "6r (rot)";
    matrix[12][0] = "7m (rot)";
    matrix[13][0] = "Ebene 2";
    matrix[14][0] = "1m (grün)";
    matrix[15][0] = "2l (grün)";
    matrix[16][0] = "2r (grün)";
    matrix[17][0] = "3l (orange)";
    matrix[18][0] = "3r (rot)";
    matrix[19][0] = "4m (rot)";
    matrix[20][0] = "5l (orange)";
    matrix[21][0] = "5r (orange)";
    matrix[22][0] = "6l (orange)";
    matrix[23][0] = "6r (rot)";
    matrix[24][0] = "7m (rot)";
    matrix[25][0] = "Ebene 3";
    matrix[26][0] = "1m (grün)";
    matrix[27][0] = "2l (orange)";
    matrix[28][0] = "2r (rot)";
    matrix[29][0] = "3m (rot)";
    matrix[30][0] = "4l (orange)";
    matrix[31][0] = "4m (orange)";
    matrix[32][0] = "4r (rot)";
    matrix[33][0] = "5l (orange)";
    matrix[34][0] = "5m (rot)";
    matrix[35][0] = "5r (rot)";
    matrix[36][0] = "6l (rot)";
    matrix[37][0] = "6m (rot)";
    matrix[38][0] = "6r (rot)";
    matrix[39][0] = "7m (rot)";
    return matrix;
}
/*
Input: 
Output: csv matrix of counted rewards
*/
function getCsvString(arrayOfRewards, arrayOfStartHorses){
    let matrix = getMatrixWithCountedRewards(arrayOfRewards);
    matrix = addStartHorsesToMatrix(matrix, arrayOfStartHorses);
    matrix = addHeadlinesToTable(matrix);
    matrix = addSums(matrix);
    let csvString = "";
    for (let index = 0; index < matrix.length; index++) {//rooms
        const array = matrix[index];
        for (let index = 0; index < array.length; index++) {//rewards per room
            const element = array[index];
            csvString += element+ "\t";
        }
        csvString += "\n";
    }
    return csvString;
}
/*
Input: Reward string or room string
Output: Index of matrix
*/
function indexMapping(string){
    let string1 = string.replace(/^\s+|\s+$/gm,'');
    switch (string1) {
        case "common":
            return 2;
        case "rare":
            return 3;
        case "precious":
            return 4;
        case "divine":
            return 5;
        case "1 energy for 2":
            return 6;
        case "2 energy for 1":
            return 7;
        case "1 energy for 4":
            return 8;                        
        case "2 energy for 2":
            return 9;
        case "1 energy for 6":
            return 10;
        case "2 energy for 3":
            return 11;
        case "3 energy for 2":
            return 12;
        case "1 level for 1":
            return 13;
        case "1 level for 2":
            return 14;
        case "2 level for 1":
            return 15;
        case "+4":
            return 16;
        case "+6":
            return 17;
        case "+8":
            return 18;
        case "+10":
            return 19;    
        
        //rows:
        case "1.1m":
            return 3;
        case "1.2m":
            return 4;
        case "1.3l":
            return 5;
        case "1.3r":
            return 6;
        case "1.4m":
            return 7;
        case "1.5l":
            return 8;
        case "1.5r":
            return 9;
        case "1.6l":
            return 10;
        case "1.6r":
            return 11;
        case "1.7m":
            return 12;
        case "2.1m":
            return 14;
        case "2.2l":
            return 15;
        case "2.2r":
            return 16;
        case "2.3l":
            return 17;
        case "2.3r":
            return 18;
        case "2.4m":
            return 19;
        case "2.5l":
            return 20;
        case "2.5r":
            return 21;
        case "2.6l":
            return 22;
        case "2.6r":
            return 23;
        case "2.7m":
            return 24;
        case "3.1m":
            return 26;
        case "3.2l":
            return 27;
        case "3.2r":
            return 28;
        case "3.3m":
            return 29;
        case "3.4l":
            return 30;
        case "3.4m":
            return 31;
        case "3.4r":
            return 32;
        case "3.5l":
            return 33;
        case "3.5m":
            return 34;
        case "3.5r":
            return 35;
        case "3.6l":
            return 36;
        case "3.6m":
            return 37;
        case "3.6r":
            return 38;
        case "3.7m":
            return 39;
        default:
            console.log("Wrong mapping for: " +string);
            break;
    }
}

function createMatrixFilledWithZeros(m, n){
    let matrix = [];
    for(let i=0; i<m; i++) {
        matrix[i] = [];
        for(let j=0; j<n; j++) {
            matrix[i][j] = 0;
        }
    }
    return matrix;
}
