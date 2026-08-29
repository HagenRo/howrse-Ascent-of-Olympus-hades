//importScripts('../jquery.js');
function filterTable() {


    let txtValue;
    let input = document.getElementById("filterInput");
    let filter = input.value.toUpperCase()
    let last = input.value.toUpperCase().slice(-1);
    if ((filter.split("'").length - 1) % 2 == 1 || last == '&' || last == "'" || last == '!' || last == '>' || last == '<') {
        let lastOccurrence = filter.lastIndexOf('&') == -1 ? 0 : filter.lastIndexOf('&');
        filter = filter.slice(0, lastOccurrence);
        console.log(lastOccurrence);
    }
    let filterList = filter.split('&');
    let table = document.getElementById("myTable");
    let tr = table.getElementsByClassName("js-filter");





    //reset table
    for (let i = 0; i < tr.length; i++) {
        tr[i].style.display = "";
    }

    console.log('---------------------')
    goThroughRowsPos:
    for (let i = 0; i < tr.length; i++) {
        let matchFoundI = [];
        let array_td = tr[i].getElementsByTagName("td");
        goThroughFilterPos:
        for (let filterIndex = 0; filterIndex < filterList.length; filterIndex++) {
            const filterI = filterList[filterIndex];
            matchFoundI[filterIndex] = false;
            [_, headline, filterHeadline] = filterI.split("'");

            if (filterI.slice(0, 1) == '!' || filterHeadline?.slice(0, 1) == '!') {
                matchFoundI[filterIndex] = true;
                continue goThroughFilterPos;
            }
            //console.log(headline, filterHeadline);
            if (filterHeadline) {
                //console.log(headline, filterHeadline);

                const td = array_td[parseInt(headline)];
                if (td) {
                    txtValue = td.textContent || td.innerText;
                    if (filterHeadline.slice(0, 1) == '>' && headline == 0) {
                        date = new Date(filterHeadline + ' GMT+0100 (Mitteleuropäische Normalzeit)');
                        matchFoundI[filterIndex] = date < new Date(txtValue);

                    } else if (filterHeadline.slice(0, 1) == '<' && headline == 0) {
                        date = new Date(filterHeadline + ' GMT+0100 (Mitteleuropäische Normalzeit)');
                        matchFoundI[filterIndex] = date > new Date(txtValue);

                    } else if (txtValue.toUpperCase().match(filterHeadline)) {
                        matchFoundI[filterIndex] = true;
                    }
                }

            } else {
                for (let index = 0; index < array_td.length; index++) {
                    const td = array_td[index];
                    if (td) {
                        txtValue = td.textContent || td.innerText;
                        if (txtValue.toUpperCase().match(filterI)) {
                            matchFoundI[filterIndex] = true;
                            break;
                        }
                    }
                }
            }

        }
        let matchFound = matchFoundI.every(v => v === true);
        if (matchFound) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }

    }
    console.log('2---------------------')
    goThroughRowsNeg:
    for (let i = 0; i < tr.length; i++) {
        let matchFoundI = [];
        let array_td = tr[i].getElementsByTagName("td");
        goThroughFilterNeg:
        for (let filterIndex = 0; filterIndex < filterList.length; filterIndex++) {
            let filterI = filterList[filterIndex];
            matchFoundI[filterIndex] = false;
            [_, headline, filterHeadline] = filterI.split("'");

            if (!(filterI.slice(0, 1) == '!' || filterHeadline?.slice(0, 1) == '!')) {
                matchFoundI[filterIndex] = false;
                continue goThroughFilterNeg;
            }

            console.log(headline, filterHeadline);
            if (filterHeadline) {
                //console.log(headline, filterHeadline);
                filterHeadline = filterHeadline.slice(1);
                const td = array_td[parseInt(headline)];
                if (td) {
                    txtValue = td.textContent || td.innerText;
                    if (txtValue.toUpperCase().match(filterHeadline)) {
                        matchFoundI[filterIndex] = true;
                        break goThroughFilterNeg;
                    }
                }

            } else {
                filterI = filterI.slice(1);
                for (let index = 0; index < array_td.length; index++) {
                    const td = array_td[index];
                    if (td) {
                        txtValue = td.textContent || td.innerText;
                        console.log(txtValue, filterI);
                        if (txtValue.toUpperCase().match(filterI)) {
                            console.log(txtValue, filterI);
                            matchFoundI[filterIndex] = true;
                            break goThroughFilterNeg;
                        }
                    }
                }
            }


        }

        let matchFound = matchFoundI.some(v => v === true);
        if (matchFound) {
            tr[i].style.display = "none";
        } else {
            //tr[i].style.display = "none";
        }

    }
    calculateAverage();
}
function calculateAverage() {
    let table = document.getElementById("myTable");
    let tr = table.getElementsByClassName("js-filter");
    let headlines = table.getElementsByTagName("th");
    //console.log(tr,headlines);

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
    //console.log(average);


    headline = headlines[3];
    sum = [0, 0, 0, 0];
    for (let j = 0; j < tr.length; j++) {
        if (tr[j].style.display != "none") {
            const row = tr[j];
            count++;
            sum = sum.map(function (num, idx) {
                return num + Array.from(row.cells[3].id.split(',')).map(Number)[idx];
            });

            //console.log(sum);
        }
    }
    headline.innerHTML = 'Startpferde' + ': ' + sum;

    //console.log(sum);


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
    //console.log((average*100).toFixed(2) + "%");


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

    //console.log((average*100).toFixed(2) + "%");

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
    //console.log(sum);


}

document.getElementById("filterInput").addEventListener("input", filterTable);

let dir = "asc";//global??
function sortTable(n) {
    console.log('sorting');
    let table, rows, switching, i, x, y, shouldSwitch, switchcount = 0;
    table = document.getElementById("myTable");

    let headlines = table.getElementsByTagName("th");
    for (let index = 0; index < headlines.length; index++) {
        const element = headlines[index];
        element.classList.remove("sorted");
    }
    headlines[n].classList.add('sorted');
    
    switching = true;

    let stupid = 0;
    while (switching) {

        switching = false;
        //rows = table.getElementsByTagName("tr");
        rows = table.querySelectorAll("tr:not([style*='display: none'])");
        console.log("rows.length: ", rows.length);
        
        for (i = 1; i < (rows.length - 1); i++) {
            stupid++;
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("td")[n];
            y = rows[i + 1].getElementsByTagName("td")[n];

            switch (n) {
                case 0:
                    //console.log(new Date(x.innerHTML) < new Date(y.innerHTML));
                    if (dir == "asc") {
                        if (new Date(x.innerHTML) < new Date(y.innerHTML)) {
                            shouldSwitch = true;
                        }
                    } else if (dir == "desc") {
                        if (new Date(x.innerHTML) > new Date(y.innerHTML)) {
                            shouldSwitch = true;
                        }
                    }
                    break;
                case 4:
                    letWinProbX = x.id == '-' ? 0 : parseFloat(x.id);
                    letWinProbY = y.id == '-' ? 0 : parseFloat(y.id);

                    if (dir == "asc") {
                        if (letWinProbX > letWinProbY) {
                            shouldSwitch = true;
                        }
                    } else if (dir == "desc") {
                        if (letWinProbX < letWinProbY) {
                            shouldSwitch = true;
                        }
                    }
                    break;
                case 7:
                    if (dir == "asc") {
                        if (parseFloat(x.id) > parseFloat(y.id)) {
                            shouldSwitch = true;
                        }
                    } else if (dir == "desc") {
                        if (parseFloat(x.id) < parseFloat(y.id)) {
                            shouldSwitch = true;
                        }
                    }
                    break;

                default:
                    if (dir == "asc") {
                        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                            shouldSwitch = true;
                        }
                    } else if (dir == "desc") {
                        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                            shouldSwitch = true;
                        }
                    }
                    break;

            }
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                switchcount++;
            }

        }
        //console.log(switching)
        //s.log(dir)

        if (!switching && dir == "asc") {
            dir = "desc";
            //console.log(dir)
        } else if (!switching && dir == "desc") {
            dir = "asc";
            //console.log(dir)
        }



    }
    console.log(stupid);
    console.log(switchcount);
}

let header = document.querySelectorAll("th");

header.forEach(function (th, i) {
    th.addEventListener('click', function () {
        sortTable(i);
    });
});
function loadRuns() {
    chrome.storage.local.get(["arrayOfRuns"], function (keyValuePairs) {
        if (keyValuePairs.arrayOfRuns) {//if array exists
            globalArrayOfRuns = keyValuePairs.arrayOfRuns;

            addRunsToTable();
        }
    });
}

function sortByDate(a, b) {
    if (new Date(a.dateRunStarted) > new Date(b.dateRunStarted)) {
        return -1;
    } else if (new Date(a.dateRunStarted) < new Date(b.dateRunStarted)) {
        return 1;
    }
    // a must be equal to b
    return 0;
}

function addRunsToTable() {

    globalArrayOfRuns.sort(sortByDate);
    for (let index = 0; index < globalArrayOfRuns.length; index++) {
        const run = globalArrayOfRuns[index];
        //console.log(run);
        addTableRow(run);
    }
    console.log('hi1');

    calculateAverage();
}

function addTableRow(run) {
    let table = document.getElementById("myTable");
    let row = table.insertRow(-1);
    row.className = "js-filter";
    row.id = run.dateRunStarted;

    let startTimeCell = row.insertCell(0);

    startTimeCell.innerHTML = run.dateRunStarted.substr(0, 24);

    let domainCell = row.insertCell(1);
    domainCell.className = 'js-openRun';
    domainCell.innerHTML = run.domain;

    let drachmaCell = row.insertCell(2);
    drachmaCell.className = 'js-openRun';
    drachmaCell.innerHTML = run.drachma;
    drachmaCell.id = run.drachma ? 1 : 0;

    let startHorsesCell = row.insertCell(3);
    startHorsesCell.className = 'js-openRun';
    let startHorsesTextContent = "";
    let startHorsesCount = [0, 0, 0, 0];
    for (let index = 0; index < run.startHorses.length; index++) {
        const horse = run.startHorses[index];
        switch (horse.levelmax) {
            case 2:
                startHorsesTextContent += "common";
                startHorsesCount[0] += 1;
                break;
            case 3:
                startHorsesTextContent += "rare";
                startHorsesCount[1] += 1;
                break;
            case 4:
                startHorsesTextContent += "precious";
                startHorsesCount[2] += 1;
                break;
            case 5:
                startHorsesTextContent += "devine";
                startHorsesCount[3] += 1;
                break;

            default:
                break;
        }
        startHorsesTextContent += " ";
    }
    startHorsesCell.innerHTML = startHorsesTextContent;
    startHorsesCell.id = startHorsesCount;

    let winProbCell = row.insertCell(4);
    winProbCell.className = 'js-openRun';
    let winProb = 1;
    for (let index = 0; index < run.arrayOfFights.length; index++) {
        const element = run.arrayOfFights[index].winrate;
        winProb *= element / 100;
    }
    winProbCell.innerHTML = run.arrayOfFights.length == 0 ? '-' : (winProb * 100).toFixed(2) + "%";
    winProbCell.id = run.arrayOfFights.length == 0 ? '-' : winProb;

    let bossCell = row.insertCell(5);
    bossCell.className = 'js-openRun';
    let bossDone = run.arrayOfRewards[run.arrayOfRewards.length - 1]?.room == 'boss' && run.arrayOfRewards[run.arrayOfRewards.length - 1].fragments && !isNaN(parseInt(run.arrayOfRewards[run.arrayOfRewards.length - 1].fragments));
    bossCell.innerHTML = bossDone ? "Ja" : "Nein";
    bossCell.id = bossDone ? 1 : 0;

    let lastRoomCell = row.insertCell(6);
    bossCell.className = 'js-openRun';
    let lastRoom = bossDone ? 22 : run.arrayOfFights.length-1;
    lastRoomCell.innerHTML = run.arrayOfRewards.length>run.arrayOfFights.length + 1 ? "-" : lastRoom;
    lastRoomCell.id = run.arrayOfRewards.length>run.arrayOfFights.length + 1 ? "-" : parseInt(lastRoom);

    let fragmentCell = row.insertCell(7);
    fragmentCell.className = 'js-openRun';

    let fragments = { 'alle': 0 };
    for (let index = 0; index < run.arrayOfRewards.length; index++) {
        const element = run.arrayOfRewards[index];
        if (!isNaN(Number(element.fragments))) {
            //console.log(element.fragments);
            if (fragments[element.horse]) {
                fragments[element.horse] += Number(element.fragments);
                fragments.alle += Number(element.fragments);
            } else {
                fragments[element.horse] = Number(element.fragments);
                fragments.alle += Number(element.fragments);
            }
        }
    }
    //console.log(fragments);
    let textContent = "";
    for (const [key, value] of Object.entries(fragments)) {
        textContent += `<div class="${key} tooltip" id="${value}">${key}: ${value};<span class="tooltiptext">Tooltip text</span></div>`;
    }
    fragmentCell.innerHTML = textContent;
    fragmentCell.id = fragments.alle;

}
let globalArrayOfRuns = [];
loadRuns();

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

$(document).on('click', '.js-openRun', function () {
    console.log('hi');
    let clickedBtnID = $(this.parentNode).attr('id');
    console.log(clickedBtnID);
    chrome.tabs.create({ url: `app/dataVisualization/fight.html#${clickedBtnID}`, active: true });
})
$(document).on('click', '#banner', function () {
    console.log('hi');
    let clickedBtnID = $(this.parentNode).attr('id');
    console.log(clickedBtnID);
    chrome.tabs.create({ url: `app/dataVisualizationDB/dataVisualization.html#`, active: true });
})