// TODO Everything haha 


// Animation timeline
var tl = new TimelineMax();


const body = document.body;


// Sidebar variables, self explanatory
const sidebar = document.getElementById("sidebar");
const openSidebarButton = document.getElementById("open-sidebar");
var sidebarOpen = true;


// Settings overlay
const settings = document.getElementById("settings");
var settingsOpen = false;
const eventSelect = document.getElementById("event-select");
// URL
const urlInput = document.getElementById("spreadsheet-url-input");
// Checks for previous url, if none has been saved, default to 2024 spreadsheet
if (localStorage.getItem("spreadsheet-url") == null || localStorage.getItem("spreadsheet-url") == "") {
    urlInput.value = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSNU7j8nCWSBK8qz4o6NB8_sZJqUn9vaEWMpdkmTp1Iith9ZZRqwclaj18yPjABa735rrI_3AMVkrQW/pub?gid=0&single=true&output=csv";
} else {
    urlInput.value = localStorage.getItem("spreadsheet-url");
}


// Breakdown constants
const breakdownLines = document.getElementById("breakdown-lines-container");
const breakdownGrid = document.getElementById("breakdown-grid");

// FIXME important these match up, probably could improve
const breakdownCategoryHeaders = ["Points"];
const sortIndexes = [1];

var firstbreakdown = true;


// Graphing variables
const graphContainer = document.getElementById("graph-container");
var firstGraph = true;


// Modal for team comments
const commentModal = document.getElementById("comment-modal");
const closeCommentModal = document.getElementById("close-comment-modal");
var previousTeamComment = -1;


// Modals used for sorting pick list teams
const sortPickListModal = document.getElementById("pick-list-sort-modal");
const closePickListModal = document.getElementById("close-pick-list-sort-modal");


// Side button setup
const sideButtons = document.getElementsByClassName("side-button");
setUpSideButtonEvents();


// HTML data table element, for raw and team data
const rawTable = document.getElementById("data-table");


// All data field names
var FIELDS = new Array();
// Fields that apply to teams, only numbers
var TEAM_FIELDS = new Array();
// Records, arranged in rows
var RECORDS = new Array();
// Records, arranged in columns
var COLUMNS = new Array();


// FIXME Very important this is set correctly!
const TEAM_INDEX = 0;
// Data arranged by team, in rows
var TEAM_ROWS = new Array();
// Data arranged by team, in columns
var TEAM_COLUMNS = new Array();
// List of all teams
var TEAMS = new Array();
// Array of how many times each team has flipped
var TEAMS_FLIPPED = new Array();
// Array of how many times each team has lost comms
var TEAMS_COMMS = new Array();
// Array of how many times each team has been disabled D:
var TEAMS_DISABLED = new Array();
// Array of how many times each team acted dumb/unintelligent
var TEAMS_DUMB = new Array();
// Array of how many times each team drove reckless
var TEAMS_RECKLESS = new Array();

const warningTypes = ["Flip/s", "Comm Issue/s", "Disabled", "Unintelligent", "Reckless"];


// TODO document this section
var PICK_LIST = new Array();
var PICK_LIST_TEAM_KEY = new Array();
var PICK_LIST_OBJECTS = new Array();
// TODO I forgot hwo this works double check
var PICK_LIST_ORDER = new Array();


// Container for entier pick list page, buttons and the list
const pickListContainer = document.getElementById("pick-list-container");
// Container for sortable pick list divs
const innerPickListContainer = document.getElementById("inner-pick-list-container");
// Team colors, green for good, red for bad, etc.
const teamColors = ["limegreen", "gold", "#fa1616"];
// Pick list div background colors for labeling
const pickListColors = ["#458a30", "#8a8130", "#8a3230"];
// Creates the sortable pick list
new Sortable(innerPickListContainer, {
    // Drag animation delay, ms
    animation: 150,
    ghostClass: 'sortable-ghost',
    onUpdate: function (event) {
        // When pick list is altered
        // event is the item that changed locations
        // has old index and new index
        console.log(event.oldIndex);

        // Old pick list object
        let oldObject = PICK_LIST_OBJECTS[event.oldIndex];
        // Old pick list key
        let oldKey = PICK_LIST_TEAM_KEY[event.oldIndex];

        // All green, yellow, red, and info buttons, as we now need to reset what item they alter
        let green = document.getElementsByClassName("pick-list-green-button");
        let yellow = document.getElementsByClassName("pick-list-yellow-button");
        let red = document.getElementsByClassName("pick-list-red-button");
        let info = document.getElementsByClassName("pick-list-info-button");

        for (var i = 0; i < Math.abs(event.oldIndex - event.newIndex); i++) {
            // Loops through all elements between the modified indicies, 
            // and bumps them up or down oen depending on direction
            if (event.oldIndex > event.newIndex) {
                PICK_LIST_OBJECTS[event.oldIndex - i] = PICK_LIST_OBJECTS[event.oldIndex - i - 1];
                PICK_LIST_TEAM_KEY[event.oldIndex - i] = PICK_LIST_TEAM_KEY[event.oldIndex - i - 1];
                green[event.oldIndex - i].id = parseInt(green[event.oldIndex - i].id) + 1;
                yellow[event.oldIndex - i].id = parseInt(yellow[event.oldIndex - i].id) + 1;
                red[event.oldIndex - i].id = parseInt(red[event.oldIndex - i].id) + 1;
                info[event.oldIndex - i].id = parseInt(info[event.oldIndex - i].id) + 1;
            } else {
                PICK_LIST_OBJECTS[event.oldIndex + i] = PICK_LIST_OBJECTS[event.oldIndex + i + 1];
                PICK_LIST_TEAM_KEY[event.oldIndex + i] = PICK_LIST_TEAM_KEY[event.oldIndex + i + 1];
                green[event.oldIndex + i].id = parseInt(green[event.oldIndex + i].id) - 1;
                yellow[event.oldIndex + i].id = parseInt(yellow[event.oldIndex + i].id) - 1;
                red[event.oldIndex + i].id = parseInt(red[event.oldIndex + i].id) - 1;
                info[event.oldIndex + i].id = parseInt(info[event.oldIndex + i].id) - 1;
            }
        }
        // Swap the objects & buttons
        PICK_LIST_OBJECTS[event.newIndex] = oldObject;
        PICK_LIST_TEAM_KEY[event.newIndex] = oldKey;
        green[event.newIndex].id = event.newIndex;
        yellow[event.newIndex].id = event.newIndex;
        red[event.newIndex].id = event.newIndex;
        info[event.newIndex].id = event.newIndex;
    }
});


localStorage.setItem("previousHighlightRow", -1);

const pickListScaleSlider = document.getElementById("pick-list-scale");
pickListScaleSlider.addEventListener("input", pickListSliderCallback
);

// TBA API constants, for finding events
var TBA_EVENT_KEYS;
var TBA_EVENT_NAMES = new Array();
var TBA_RECORDS;
var TBA_COLUMNS;
const tbaOptions = {
    headers: {
        'X-TBA-Auth-Key': 'sBluV8DKQA0hTvJ2ABC9U3VDZunUGUSehxuDPvtNC8SQ3Q5XHvQVt0nm3X7cvP7j'
    }
}
// Gets event list of current year
const Year = new Date().getFullYear();
getEventListTBA(`https://www.thebluealliance.com/api/v3/events/${Year}`);



// Sets up the buttons in side bar, callback
function setUpSideButtonEvents() {
    for (var i = 1; i < sideButtons.length - 1; i++) {
        sideButtons[i].addEventListener("click", function () {
            removeActive();
            // Gives orange highlight to correct side button
            this.classList.add("active");
        });
    }
}


// Removes orange highlight from side buttons
function removeActive() {
    for (let i = 0; i < sideButtons.length; i++) {
        sideButtons[i].classList = "side-button";
    }
}


// Initial data fetching
getData();


// Fetches pick list
function getPickList() {
    rawTable.innerHTML = "<h5>Fetching Pick List...</h5>";
    CSV.fetch({
        //url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQNEBYTlOcDv1NuaCd5U-55q2czmUc-HgvNKnaRDxkkL9J39MD_ht2-6GKY4jX3bipv7dONBcUVCpU_/pub?gid=1955868836&single=true&output=csv'
        url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQBOgllZqto92BsubFi-w9Fx0t8M3Qycv_1MhTDZ_bgGzw7KOACWde-AbUF6ujgTG9oGt7ZvUlP9RAZ/pub?gid=0&single=true&output=csv'
    }
    ).done(function (dataset) {
        var tempIndex = [];
        var tempNum = [];
        var tempColor = [];
        if (dataset.records.length != 0 && String(dataset.records[0][0]).includes(",")) {
            tempIndex = dataset.records[0][0].match(/\d+/g);
            tempNum = dataset.records[0][1].match(/\d+/g);
            tempColor = dataset.records[0][2].match(/\d+/g);
        } else if (dataset.records.length != 0 && !String(dataset.records[0][0]).includes(",")) {
            tempIndex = [dataset.records[0][0]];
            tempNum = [dataset.records[0][1]];
            tempColor = [dataset.records[0][2]];
        }
        PICK_LIST = [];
        for (var i = 0; i < tempIndex.length; i++) {
            PICK_LIST[i] = new Array(tempIndex[i], tempNum[i], tempColor[i]);
        }
        console.log(PICK_LIST);
        PICK_LIST_OBJECTS = [];
        PICK_LIST_TEAM_KEY = [];
        for (var i = 0; i < PICK_LIST.length; i++) {
            PICK_LIST_OBJECTS[i] = new PickListTeam(PICK_LIST[i][0], PICK_LIST[i][1], PICK_LIST[i][2]);
            PICK_LIST_TEAM_KEY.push(PICK_LIST[i][1]);
            PICK_LIST_ORDER.push(PICK_LIST[i][1]);
        }
        console.log(PICK_LIST_TEAM_KEY);
        if (PICK_LIST_OBJECTS.length != TEAMS.length || PICK_LIST_OBJECTS.length == 0) {
            var pickListTeamsIncluded = [];
            for (var p = 0; p < PICK_LIST_OBJECTS.length; p++) {
                pickListTeamsIncluded.push(PICK_LIST_OBJECTS[p].getTeam());
            }
            for (var i = 0; i < TEAMS.length; i++) {
                if (!pickListTeamsIncluded.includes(TEAMS[i])) {
                    PICK_LIST_OBJECTS.push(new PickListTeam(PICK_LIST_OBJECTS.length, TEAMS[i], 0));
                    PICK_LIST_TEAM_KEY.push(String(TEAMS[i]));
                    PICK_LIST_ORDER.push(String(TEAMS[i]));
                }
            }
        }
        console.log(PICK_LIST_OBJECTS);
        resetRaw();
    }).catch(error => {
        console.log(error);
        alert('Terrible Error :(.');
        let montyWindow = window.open("", "Error Report");
        montyWindow.document.body.innerHTML = `<h3>${error}</h3>`;
        if (error == "TypeError: Failed to fetch") {
            montyWindow.document.body.innerHTML = `<h3>Check Internet Connection: ${error}</h3>`;
        }
    });
}

// Fetches raw data table
function getData() {
    // Make raw data side button active
    removeActive();
    sideButtons[1].classList.add("active");

    // Hide other tabs
    breakdownLines.style.display = "none";
    graphContainer.style.display = "none";
    pickListContainer.style.display = "none";
    breakdownGrid.style.display = "none";

    rawTable.innerHTML = "<h5>Fetching Spreadsheet...</h5>";
    CSV.fetch({
        url: urlInput.value
    }
    ).done(function (dataset) {
        // Reset all variables
        rawTable.innerHTML = "";
        FIELDS = dataset.fields;
        RECORDS = dataset.records;
        TEAMS = [];

        //Delete time stamps
        for (let i = 0; i < RECORDS.length; i++) {
            RECORDS[i].splice(0, 1);
        }
        FIELDS.splice(0, 1);

        // Update teams array & sort
        for (let i = 0; i < RECORDS.length; i++) {
            if (!TEAMS.includes(RECORDS[i][0])) {
                TEAMS[TEAMS.length] = RECORDS[i][0];
            }
        }
        TEAMS.sort(function (a, b) { return a - b });
        console.log(TEAMS);

        localStorage.setItem("direction", 0);
        localStorage.setItem("column", -1);
        // Now, update pick list
        getPickList();
    }).catch(error => {
        // Oh no :(
        console.log(error);
        alert('Terrible Error :(.');
        let montyWindow = window.open("", "Error Report");
        montyWindow.document.body.innerHTML = `<h3>${error}</h3>`;
        if (error == "TypeError: Failed to fetch") {
            montyWindow.document.body.innerHTML = `<h3>Check Internet Connection: ${error}</h3>`;
        }
    });
}

// Opens raw data table, resets raw data table
function resetRaw() {
    breakdownLines.style.display = "none";
    graphContainer.style.display = "none";
    pickListContainer.style.display = "none";
    breakdownGrid.style.display = "none";

    rawTable.innerHTML = "";
    TEAMS_FLIPPED = [];
    TEAMS_COMMS = [];
    TEAMS_DISABLED = [];
    TEAMS_DUMB = [];
    TEAMS_RECKLESS = [];

    for (let h = 0; h < FIELDS.length; h++) {
        COLUMNS[h] = new Array();
        // Temp column
        let col = document.createElement("div");
        // Temp header
        let tempHeader = document.createElement("div");

        // Temp header text
        let tempHeaderText = document.createElement("h3");
        tempHeaderText.innerText = FIELDS[h];
        tempHeader.appendChild(tempHeaderText);
        tempHeader.className = "table-header-section-raw";

        // Sets data type to first character in the first row of desired column,
        // used to see if data can be sorted numerically 
        let dataType = 1;
        if (RECORDS.length > 0) {
            dataType = new String(RECORDS[0][h]).substring(0, 1);
        }
        // Stores the data type as the header id 
        // TODO there is probably a more stable and better way to do this
        tempHeader.id = dataType;
        // Adds column number to header class list
        tempHeader.classList.add(`${(h)}`);
        // FIXME Sorts the column, passes column number, if it's numerical, records, columns, fields, idk what else
        tempHeader.onclick = function () { sortColumn(this.classList[1], detectCharacter(this.id), RECORDS, COLUMNS, FIELDS, false, true) };

        col.className = "column";
        col.appendChild(tempHeader);
        rawTable.appendChild(col);
    }

    // Resets sort direction & column
    localStorage.setItem("direction", 0);
    localStorage.setItem("column", -1);

    for (let i = 0; i < RECORDS.length; i++) {
        for (let s = 0; s < RECORDS[i].length; s++) {
            // Updates teams flipped, comms, etc.
            if (FIELDS[s] == "Flip") {
                if (RECORDS[i][s] == "Yes") {
                    TEAMS_FLIPPED.push(RECORDS[i][TEAM_INDEX]);
                }
            }
            if (FIELDS[s] == "Lost Comms") {
                if (RECORDS[i][s] == "Yes") {
                    TEAMS_COMMS.push(RECORDS[i][TEAM_INDEX]);
                }
            }
            if (FIELDS[s] == "Disabled") {
                if (RECORDS[i][s] == "Yes") {
                    TEAMS_DISABLED.push(RECORDS[i][TEAM_INDEX]);
                }
            }
            if (FIELDS[s].includes("Unintelligent")) {
                if (RECORDS[i][s] == "Yes") {
                    TEAMS_DUMB.push(RECORDS[i][TEAM_INDEX]);
                }
            }
            if (FIELDS[s] == "Reckless") {
                if (RECORDS[i][s] == "Yes") {
                    TEAMS_RECKLESS.push(RECORDS[i][TEAM_INDEX]);
                }
            }
            // Adds to columns
            COLUMNS[s][i] = RECORDS[i][s];

            // Temp data value html element
            let tempDataValue = document.createElement("div");
            tempDataValue.className = "data-value";
            tempDataValue.id = i;
            // Adds the nice norizontal stripes, easier to read
            if (i % 3 == 0) {
                tempDataValue.style.backgroundColor = "#302f2b";
            }

            // If the pick list contains the team & it has a color assigned,
            // give the data cell the correct color border
            if (PICK_LIST_TEAM_KEY.indexOf(String(RECORDS[i][TEAM_INDEX])) != -1) {
                if (PICK_LIST_OBJECTS[PICK_LIST_TEAM_KEY.indexOf(String(RECORDS[i][TEAM_INDEX]))].getColor() != 0) {
                    tempDataValue.style.boxShadow = `inset 0px 0px 0.15vh 0.35vh ${teamColors[PICK_LIST_OBJECTS[PICK_LIST_TEAM_KEY.indexOf(String(RECORDS[i][TEAM_INDEX]))].getColor() - 1]}`;
                }
            } else {
                // Otherwise that's not good because it should be there uh oh!
                console.error("Team '" + String(RECORDS[i][TEAM_INDEX]) + "' not found in pick list :(");
            }

            // Special cases where clicking does another behavior, such as opening comments section
            if (FIELDS[s].includes("Comments")) {
                tempDataValue.innerText = "{ View }";
                tempDataValue.id = i;
                tempDataValue.classList.add(s);
                tempDataValue.onclick = function () { showCommentModal(RECORDS[this.id][this.classList[1]]) }
                tempDataValue.addEventListener("click", function () {
                    setRowHighlight(this.id, true);
                });
            } else {
                // Otherwise highlight the correct row
                tempDataValue.innerText = RECORDS[i][s];
                // id is the row the cell is in
                tempDataValue.addEventListener("click", function () {
                    setRowHighlight(this.id, false);
                });
            }
            rawTable.children[s].appendChild(tempDataValue);
        }
    }
}

// Shows team comment modal, sets correct text
function showCommentModal(text) {
    // Show modal
    commentModal.style.display = "block";
    // Set modal text to comment
    commentModal.children[0].children[1].innerText = text;
}

// Close comment modal if you click off of it
window.onclick = function (event) {
    if (event.target == commentModal) {
        commentModal.style.display = "none";
    }
}

// Close comment modal when close button is clicked
closeCommentModal.onclick = function () {
    commentModal.style.display = "none";
}

// Sets the row highlight in the team data table
function setTeamRowHighlight(row, always) {
    // Team column html elements
    let cols = document.getElementsByClassName("column");

    // Resets the column highlights back to normal every 3rd striped
    for (let c = 0; c < cols.length; c++) {
        for (let i = 1; i < cols[c].children.length; i++) {
            if ((i - 1) % 3 == 0) {
                cols[c].children[i].style.backgroundColor = "#302f2b";
            } else {
                cols[c].children[i].style.backgroundColor = "#474540";
            }
        }
    }

    // If the previously highlighted row was different than the currently highlighted row
    // Or it's a special always highlight (for comments and stuff)
    if (localStorage.getItem("previousHighlightRow") != row || always) {
        localStorage.setItem("previousHighlightRow", row);
        // Loop through the team rows and try to match the team number to the desired team number to highlight
        for (let i = 0; i < TEAM_ROWS.length; i++) {
            if (cols[0].children[i + 1].innerText == TEAMS[row]) {
                // When a match is found iterate through all columns highlighting the correct data cell
                for (let c = 0; c < cols.length; c++) {
                    cols[c].children[i + 1].style.setProperty("background-color", "#a8652d", "important");
                }
                // Now break because we already found the correct row to highlight
                break;
            }
        }
    } else {
        // Otherwise the highlight should be toggled off, reset previous highlight row
        localStorage.setItem("previousHighlightRow", -1);
    }
}

// Sets row highlight in raw data table
function setRowHighlight(row, always) {
    //FIXME ROW IS A STRING FOR SOME REASON FIX!!!

    let cols = document.getElementsByClassName("column");
    for (let c = 0; c < cols.length; c++) {
        for (let i = 1; i < cols[c].children.length; i++) {
            if ((i - 1) % 3 == 0) {
                cols[c].children[i].style.backgroundColor = "#302f2b";
            } else {
                cols[c].children[i].style.backgroundColor = "#474540";
            }
        }
    }

    if (localStorage.getItem("previousHighlightRow") != row || always) {
        localStorage.setItem("previousHighlightRow", row);
        for (let c = 0; c < cols.length; c++) {
            // For now I'm just casting row as an integer ;)
            cols[c].children[parseInt(row) + 1].style.setProperty("background-color", "#a8652d", "important");
        }
    } else {
        localStorage.setItem("previousHighlightRow", -1);
    }
}

// Sets up compare tab
function setUpCompare() {
    getTeamData();

    rawTable.innerHTML = "";
    graphContainer.style.display = "none";
    pickListContainer.style.display = "none";
    breakdownGrid.style.display = "none";

    let compareContainer = document.createElement("div");
    compareContainer.id = "compare-container";

    let compareHeaderContainer = document.createElement("div");
    compareHeaderContainer.id = "compare-header-container";

    let teamSelects = [];
    for (var i = 0; i < 2; i++) {
        let tempTeamSelect = document.createElement("select");
        tempTeamSelect.className = "compare-team-select";
        for (var t = 0; t < TEAMS.length; t++) {
            let tempOption = document.createElement("option");
            tempOption.value = String(TEAMS[t]);
            tempOption.text = TEAMS[t];
            tempTeamSelect.appendChild(tempOption);

        }
        if (localStorage.getItem(`compare-team-${i}`) != null && localStorage.getItem(`compare-team-${i}`) != "") {
            tempTeamSelect.value = localStorage.getItem(`compare-team-${i}`);
        }
        teamSelects.push(tempTeamSelect);
        tempTeamSelect.addEventListener("change", function () { doCompare(teamSelects, statContainers) });

        compareHeaderContainer.appendChild(tempTeamSelect)
    }

    let compareDescriptionContainer = document.createElement("div");
    compareDescriptionContainer.innerHTML = `<p style="font-weight: bold">Categories</p>`;
    compareDescriptionContainer.id = "compare-description-container";
    compareHeaderContainer.insertBefore(compareDescriptionContainer, compareHeaderContainer.childNodes[1]);

    let statContainers = [];
    for (var i = 0; i < TEAM_FIELDS.length - 1; i++) {
        let tempStat = document.createElement("div");
        tempStat.className = "stat-compare-container";

        for (var t = 0; t < 2; t++) {
            let tempStatNumber = document.createElement("p");
            tempStatNumber.className = "compare-stat-number";
            tempStatNumber.innerText = "?";
            tempStat.appendChild(tempStatNumber);
        }

        let tempLineContainer = document.createElement("div");
        tempLineContainer.className = "compare-line-container";

        tempStatName = document.createElement("p");
        tempStatName.className = "compare-stat-description";
        tempStatName.innerText = TEAM_FIELDS[i + 1];
        tempLineContainer.appendChild(tempStatName);

        tempStat.insertBefore(tempLineContainer, tempStat.childNodes[1]);

        for (var l = 0; l < 2; l++) {
            let tempInnerLine = document.createElement("div");
            tempInnerLine.className = "compare-inner-line";
            tempLineContainer.appendChild(tempInnerLine);
        }

        compareContainer.appendChild(tempStat);
        statContainers.push(tempStat);
    }

    compareContainer.appendChild(compareHeaderContainer);
    rawTable.appendChild(compareContainer);

    doCompare(teamSelects, statContainers);
}

// Runs compare tab
function doCompare(teamSelects, statContainers) {
    let teamIndices = [];

    for (var i = 0; i < teamSelects.length; i++) {
        localStorage.setItem(`compare-team-${i}`, teamSelects[i].value);
        console.log(localStorage.getItem(`compare-team-${i}`));
        teamIndices.push(TEAMS.indexOf(parseInt(teamSelects[i].value)));
    }

    console.log(teamIndices);

    for (var i = 0; i < statContainers.length; i++) {
        let teamStats = [];

        let tempNumbers = statContainers[i].getElementsByClassName("compare-stat-number");

        for (var t = 0; t < tempNumbers.length; t++) {
            tempNumbers[t].innerText = TEAM_COLUMNS[i + 1][teamIndices[t]];

            if (TEAM_COLUMNS[i + 1][teamIndices[t]] == 0) {
                teamStats.push(0.1);
            } else {
                teamStats.push(TEAM_COLUMNS[i + 1][teamIndices[t]]);
            }
        }

        if (teamStats[0] < 0) {
            teamStats[1] += Math.abs(teamStats[0]);
            teamStats[0] = 0.1;
        }

        if (teamStats[1] < 0) {
            teamStats[0] += Math.abs(teamStats[1]);
            teamStats[1] = 0.1;
        }

        for (var l = 0; l < 2; l++) {
            let tempLine = statContainers[i].getElementsByClassName("compare-inner-line")[l];
            let minStat = JSON.parse(JSON.stringify(teamStats)).sort(function (a, b) { return b - a })[1];
            let width = (teamStats[l] / minStat) * 50;
            if (width >= 95) {
                width = 95;
            }
            if (width > 50) {
                tempLine.style.zIndex = 10;
                tempNumbers[l].style.backgroundColor = `rgba(50, 205, 50, ${(width - 50) / 50})`;
                tempNumbers[l].style.border = "solid 0.5vh limegreen";
                tempNumbers[l].style.fontWeight = "bold";
                tempNumbers[l].style.textShadow = "lime 0px 0px 0.75vh";
                //tempLine.classList.add(`compare-pulse-${l}`);
            } else {
                tempLine.style.zIndex = 0;
                tempNumbers[l].style.backgroundColor = "transparent";
                tempNumbers[l].style.fontWeight = "normal";
                tempNumbers[l].style.textShadow = "none";
                tempLine.classList = "compare-inner-line";
                tempNumbers[l].style.border = "solid 0.5vh transparent";
            }
            if (teamStats[0] == teamStats[1]) {
                console.log(width);
                tempLine.style.zIndex = 0;
                tempNumbers[l].style.backgroundColor = "#3d8eff";
                tempNumbers[l].style.fontWeight = "bold";
                tempNumbers[l].style.textShadow = "#006aff 0px 0px 0.75vh";
                tempNumbers[l].style.border = "solid 0.5vh #3d8eff";
            }
            tempLine.style.width = `${width}%`;

            if (l == 1) {
                tempLine.style.right = 0;
                tempLine.style.backgroundColor = "#ffc400";
            }
        }
    }
}

function setUpMatches() {
    rawTable.innerHTML = "";
    graphContainer.style.display = "none";
    pickListContainer.style.display = "none";
    breakdownGrid.style.display = "none";

    let matchSelect = document.createElement("select");

    let matches = [];
    matchSelect.id = "match-select";
    matchSelect.addEventListener("change", doMatch);

    for (var i = 0; i < RECORDS.length; i++) {
        if (!matches.includes(RECORDS[i][2])) {
            matches.push(parseInt(RECORDS[i][2]));
        }
    }

    matches.sort(function (a, b) { return a - b });

    for (var i = 0; i < matches.length; i++) {
        let tempOption = document.createElement("option");
        tempOption.value = String(matches[i]);
        tempOption.text = matches[i];
        matchSelect.appendChild(tempOption);
    }

    if (localStorage.getItem("match-number") != null) {
        matchSelect.value = localStorage.getItem("match-number");
    }

    let field = document.createElement("div");
    field.id = "match-field";

    rawTable.appendChild(matchSelect);
    rawTable.appendChild(field);

    doMatch();
}

function doMatch() {
    let matchSelect = document.getElementById("match-select");

    localStorage.setItem("match-number", matchSelect.value);
}

function setUpGraph() {
    graphContainer.innerHTML = "";

    breakdownLines.style.display = "none";
    pickListContainer.style.display = "none";
    breakdownGrid.style.display = "none";

    if (TEAM_ROWS.length < 1) {
        getTeamData();
    }

    let tempSelectContainer = document.createElement("div");
    tempSelectContainer.style.width = "100vh";
    tempSelectContainer.style.display = "flex";

    //graphContainer.innerHTML = "";
    graphContainer.style.display = "flex";
    rawTable.innerHTML = "";

    let tempTwo = document.createElement("select");
    tempTwo.id = "graph-category-select-two";
    tempTwo.addEventListener("input", doGraph);
    tempTwo.style.width = "30vh";
    tempTwo.style.marginRight = "5vh";
    for (let i = 1; i < TEAM_FIELDS.length; i++) {
        let op = document.createElement("option");
        op.text = TEAM_FIELDS[i];
        op.value = i;
        tempTwo.append(op);
    }
    if (localStorage.getItem("graph-two") != null) {
        tempTwo.value = localStorage.getItem("graph-two");
    }
    tempSelectContainer.appendChild(tempTwo);

    let tempTeamSelect = document.createElement("select");
    tempTeamSelect.id = "graph-category-select-team";
    tempTeamSelect.addEventListener("input", doGraph);
    tempTeamSelect.style.width = "15vh";
    tempTeamSelect.style.marginRight = "5vh";
    for (let i = 0; i < TEAMS.length; i++) {
        let op = document.createElement("option");
        op.text = TEAMS[i];
        op.value = TEAMS[i];
        tempTeamSelect.append(op);
    }
    if (localStorage.getItem("graph-team") != null) {
        tempTeamSelect.value = localStorage.getItem("graph-team");
    }
    tempSelectContainer.appendChild(tempTeamSelect);

    let temp = document.createElement("select");
    temp.id = "graph-number-select";
    temp.style.width = "25vh";
    for (let i = 0; i < 3; i++) {
        let op = document.createElement("option");
        if (i == 0) {
            op.text = i + 1 + " Value";
        } else if (i == 1) {
            op.text = i + 1 + " Values";
        } else {
            op.text = "Consistency"
        }
        op.value = i + 1;
        temp.append(op);
    }

    if (localStorage.getItem("graph-mode") != null) {
        temp.value = localStorage.getItem("graph-mode");
    }

    temp.addEventListener("input", doGraph);
    tempSelectContainer.appendChild(temp);

    var tempT = document.createElement("select");
    tempT.id = "graph-category-select";
    tempT.addEventListener("input", doGraph);
    tempT.style.width = "30vh";
    tempT.style.marginLeft = "5vh";
    for (var i = 1; i < TEAM_FIELDS.length; i++) {
        var op = document.createElement("option");
        op.text = TEAM_FIELDS[i];
        op.value = i;
        tempT.append(op);
    }
    tempSelectContainer.appendChild(tempT);

    if (localStorage.getItem("graph-one") != null) {
        tempT.value = localStorage.getItem("graph-one");
    }

    graphContainer.appendChild(tempSelectContainer);

    let tempGraphCanvasContainer = document.createElement("div");
    tempGraphCanvasContainer.id = "graph-canvas-container";

    let tempGraphCanvas = document.createElement("canvas");
    tempGraphCanvas.id = "graph-canvas";
    tempGraphCanvasContainer.appendChild(tempGraphCanvas)

    graphContainer.appendChild(tempGraphCanvasContainer);

    rawTable.appendChild(graphContainer);

    doGraph();
}

function doGraph() {
    var graphCanvas = document.getElementById("graph-canvas");

    var graphMode = parseInt(document.getElementById("graph-number-select").value);

    document.getElementById("graph-category-select-team").style.display = "none";
    document.getElementById("graph-category-select-two").style.display = "none";

    if (graphMode == 2) {
        document.getElementById("graph-category-select-two").style.display = "block";
    }

    // Column to look at
    var graphColumn = document.getElementById("graph-category-select").value;

    // Sorted column
    var sortedGraphColumn = JSON.parse(JSON.stringify(TEAM_COLUMNS));

    if (graphMode == 1) {
        sortedGraphColumn = sortedGraphColumn[graphColumn].sort(function (a, b) { return a - b });

        // Sorted teams
        var teamsSorted = [];
        var newTeams = JSON.parse(JSON.stringify(TEAMS));
        for (let i = 0; i < sortedGraphColumn.length; i++) {
            for (let t = 0; t < newTeams.length; t++) {
                if (TEAM_ROWS[t][graphColumn] == sortedGraphColumn[i] && !teamsSorted.includes(newTeams[t])) {
                    teamsSorted.push(newTeams[t]);
                    newTeams.splice(t, 1);
                    i--;
                    break;
                }
            }
        }
    }

    if (graphMode == 2) {
        var secondGraphColumn = document.getElementById("graph-category-select-two").value;
        let secondSortedGraphColumn = JSON.parse(JSON.stringify(TEAM_COLUMNS));
        secondSortedGraphColumn = secondSortedGraphColumn[secondGraphColumn];

        sortedGraphColumn = sortedGraphColumn[graphColumn]

        var teamData2d = [];
        for (let i = 0; i < secondSortedGraphColumn.length; i++) {
            teamData2d.push({
                team: TEAMS[i],
                x: sortedGraphColumn[i],
                y: secondSortedGraphColumn[i]
            });
        }
    }

    // Creates a graph dot for every team, only used when comparing teams
    switch (graphMode) {
        case 1:
            showBarGraph(graphCanvas, sortedGraphColumn, teamsSorted, TEAM_FIELDS[graphColumn]);
            break;
        case 2:
            showScatterChart(graphCanvas, teamData2d, [TEAM_FIELDS[graphColumn], TEAM_FIELDS[secondGraphColumn]]);
            break;
        case 3:
            document.getElementById("graph-category-select-team").style.display = "block";
            break;
        default:
            console.error("Invalid graph mode :(");
            break;
    }

    localStorage.setItem("graph-mode", document.getElementById("graph-number-select").value);
    localStorage.setItem("graph-one", document.getElementById("graph-category-select").value);
    localStorage.setItem("graph-two", document.getElementById("graph-category-select-two").value);
    localStorage.setItem("graph-team", document.getElementById("graph-category-select-team").value);
}

// Sets up breakdown tab, only runs on first click
function setUpTeamBreakdowns() {

    // Reset stuff
    graphContainer.style.display = "none";
    pickListContainer.style.display = "none";
    breakdownGrid.style.display = "grid";

    breakdownLines.innerHTML = "";
    rawTable.innerHTML = "";
    breakdownGrid.innerHTML = "";

    // Creates the team select html element
    let tempTeamSelect = document.createElement("select");
    tempTeamSelect.id = "team-breakdown-select";
    tempTeamSelect.addEventListener("input", openTeamBreakdowns);

    // Creates & adds every team to the select
    for (let i = 0; i < TEAMS.length; i++) {
        let op = document.createElement("option");
        op.text = TEAMS[i];
        op.value = TEAMS[i];
        tempTeamSelect.append(op);
    }

    // If there was a previously selected team select them
    if (localStorage.getItem("breakdown-team") != null) {
        tempTeamSelect.value = localStorage.getItem("breakdown-team");
    }

    // Creates all breakdown line graph things
    for (let i = 0; i < breakdownCategoryHeaders.length; i++) {

        // Parent Container for each line
        let tempContainer = document.createElement("div");
        tempContainer.className = "line-container";

        // Line container
        let tempLine = document.createElement("div");
        tempLine.className = "breakdown-line";

        // The thing that pops up when you hover over the line 
        let tempPopup = document.createElement("div");
        tempPopup.className = "breakdown-popup";
        tempContainer.appendChild(tempPopup);

        // Actual line element
        let tempInnerLine = document.createElement("div");
        tempInnerLine.className = "inner-breakdown-line";
        tempInnerLine.style.height = `0 % `;

        // Label for 
        let temph4 = document.createElement("h4");
        temph4.innerText = breakdownCategoryHeaders[i];

        // Add them all to the correct container/s
        tempLine.appendChild(tempInnerLine);
        tempContainer.appendChild(tempLine);
        tempContainer.appendChild(temph4);
        breakdownLines.appendChild(tempContainer);
    }

    // Top bar that shows team statistics
    let breakdownData = document.createElement("div");
    breakdownData.id = "breakdown-data-container";

    // Container for issues, comments, auto, etc.
    let feedbackContainer = document.createElement("div");
    feedbackContainer.id = "feedback-container";

    breakdownGrid.appendChild(tempTeamSelect);
    breakdownGrid.appendChild(breakdownData);
    breakdownGrid.appendChild(breakdownLines);
    breakdownGrid.appendChild(feedbackContainer);
    document.body.appendChild(breakdownGrid);
}

// Runs team breakdowns
async function openTeamBreakdowns() {
    // If there is no team data, then get team data
    if (TEAM_COLUMNS.length < 1) {
        getTeamData();
    }

    // FIXME idk if firstBreakdown is even needed
    // Bad way to do this but if it's the first time then run setUpTeamBreakdowns
    if (firstbreakdown) {
        setUpTeamBreakdowns();
        firstbreakdown = false;
    }

    breakdownLines.style.display = "flex";
    graphContainer.style.display = "none";
    pickListContainer.style.display = "none";

    // Stores the percentiles for the given team, 0-1
    let breakdownData = [];

    localStorage.setItem("breakdown-team", document.getElementById("team-breakdown-select").value);

    // Iterates through every breakdown category
    for (let i = 0; i < breakdownCategoryHeaders.length; i++) {
        // 2d array, array of teams sorted in each cetegory
        let teamsSorted = [];
        for (let t = 0; t < getSortedIndex(sortIndexes[i], TEAM_ROWS, TEAM_COLUMNS).length; t++) {
            // Adds the orders to array
            teamsSorted[t] = getSortedIndex(sortIndexes[i], TEAM_ROWS, TEAM_COLUMNS)[t][0];
        }

        // Sort the column, return the index that was matched up with the data
        // Decimal 0-1, 1 being they had the highest, 0 the lowest
        breakdownData[i] = teamsSorted.indexOf(parseInt(document.getElementById("team-breakdown-select").value)) / parseFloat(TEAMS.length - 1);
    }

    // Iterates through lines & sets each line to correct height based on breakdownData
    for (let i = 0; i < breakdownCategoryHeaders.length; i++) {
        document.getElementsByClassName("inner-breakdown-line")[i].style.height = `${breakdownData[i] * 100}% `;
        document.getElementsByClassName("breakdown-popup")[i].innerText = `${(breakdownData[i] * (TEAMS.length - 1)) + 1} out of ${TEAMS.length} `;
    }

    // Container for the top values displayed in breakdowns
    let breakdownDataContainer = document.getElementById("breakdown-data-container");
    breakdownDataContainer.innerHTML = "";

    // Iterates through each column, but skips team number
    for (let i = 1; i < TEAM_COLUMNS.length - 1; i++) {
        // Rectangular container
        let tempDataContainer = document.createElement("div");
        tempDataContainer.className = "breakdown-data";

        // Text element, holds data
        let tempData = document.createElement("h8");
        tempData.innerText = TEAM_ROWS[TEAMS.indexOf(parseInt(document.getElementById("team-breakdown-select").value))][i];

        // Text element, holds team number
        let tempDataTitle = document.createElement("h9");
        tempDataTitle.innerText = TEAM_FIELDS[i];

        tempDataContainer.appendChild(tempDataTitle);
        tempDataContainer.appendChild(tempData);
        breakdownDataContainer.appendChild(tempDataContainer);
    }

    // Container for issues, autos, comments, etc.
    let tempFeedbackContainer = document.getElementById("feedback-container");
    tempFeedbackContainer.innerHTML = "";

    // Container for warnings, child of feedback container
    let tempWarningContainer = document.createElement("div");
    tempWarningContainer.id = "breakdown-warning-container";

    // Title
    let tempWarningTitle = document.createElement("p");
    tempWarningTitle.className = "breakdown-warning-text";
    tempWarningTitle.style.fontWeight = "bold";
    tempWarningTitle.style.scale = "1.5";
    tempWarningTitle.style.textDecoration = "underline";
    tempWarningTitle.innerText = "Issues:";
    tempWarningContainer.appendChild(tempWarningTitle);

    // 2d array of all team warning arrays
    let compiledWarnings = [TEAMS_FLIPPED, TEAMS_COMMS, TEAMS_DISABLED, TEAMS_DUMB, TEAMS_RECKLESS];

    // Goes through each warning type
    for (let w = 0; w < warningTypes.length; w++) {
        // By default, create new text element with 0 of current warning
        let tempWarningText = document.createElement("p");
        tempWarningText.className = "breakdown-warning-text";
        tempWarningText.innerText = "0 " + warningTypes[w];

        // Check if the team is in the current warning array
        if (compiledWarnings[w].includes(parseInt(document.getElementById("team-breakdown-select").value))) {
            // Uh oh they are, check how many times they are in this array
            let numOccurances = 0;
            for (let charlotteCovert = 0; charlotteCovert < compiledWarnings[w].length; charlotteCovert++) {
                if (compiledWarnings[w][charlotteCovert] == parseInt(document.getElementById("team-breakdown-select").value)) {
                    numOccurances++;
                }
            }
            // Now set the text to show how many times they have the issue
            tempWarningText.innerText = numOccurances + " " + warningTypes[w];
        }
        // Then add it to the correct container
        tempWarningContainer.appendChild(tempWarningText);
    }

    tempFeedbackContainer.appendChild(tempWarningContainer);

    // Auto container
    let tempAutoContainer = document.createElement("div");
    tempAutoContainer.id = "breakdown-auto-container";

    // Canvas for auto pie chart
    let autoPie = document.createElement("canvas");
    autoPie.id = "auto-pie-chart";
    tempAutoContainer.appendChild(autoPie);

    let tempCommentContainer = document.createElement("div");
    tempCommentContainer.id = "breakdown-comment-container";
    tempCommentContainer.innerHTML = "<span style='text-decoration: underline'>Comments & Videos:</span>";

    // Fetches matches for team, adds to comment section
    getTeamMatchesTBA(`https://www.thebluealliance.com/api/v3/team/frc${document.getElementById("team-breakdown-select").value}/event/${document.getElementById("event-select").value}/matches`);

    //let commentText = "Comments: ";
    for (var i = 0; i < RECORDS.length; i++) {
        if (RECORDS[i][TEAM_INDEX] == parseInt(document.getElementById("team-breakdown-select").value)) {
            let tempComment = document.createElement("h1");
            tempComment.className = "breakdown-comment";
            // FIXME COMMENT INDEX WILL NEED TO BE CHANGED
            tempComment.innerText = RECORDS[i][9];
            tempCommentContainer.appendChild(tempComment);
        }
    }

    tempFeedbackContainer.appendChild(tempAutoContainer);
    tempFeedbackContainer.appendChild(tempCommentContainer);

    // Array of all team auto types
    let team_auto_types = [];
    // Array of number of auto successes, corresponds with team_auto_types
    let team_auto_success = [];

    // TODO this will have to be changed for 2024
    for (let g = 0; g < RECORDS.length; g++) {
        if (RECORDS[g][TEAM_INDEX] == document.getElementById("team-breakdown-select").value) {
            let tempAuto = "A";
            // TODO CHANGE

            // FIXME ADD LETERS IN HERE TO SET AUTO BASED ON POINTS & STUFF
            team_auto_success.push(1);
            team_auto_types.push(tempAuto);
        }
    }

    runAutoPie(team_auto_types, team_auto_success);
}

// Sorts teams based on column
function getSortedIndex(colNum, records, columns) {
    var sortedColumn = JSON.parse(JSON.stringify(columns));
    sortedColumn = sortedColumn[colNum].sort(function (a, b) { return a - b });

    let sortedRows = [];
    var previousRows = [];
    var takenRows = [];
    var counter = 0;

    var tempColumns = JSON.parse(JSON.stringify(columns));

    for (var r = 0; r < records.length; r++) {
        for (var i = 0; i < tempColumns[0].length; i++) {
            //console.log(tempColumns[colNum][i]);
            //console.log(takenRows.includes(i));
            if (columns[colNum][i] == sortedColumn[r] && !takenRows.includes(i)) {
                sortedRows[counter] = records[i];
                previousRows[counter] = i;
                takenRows[counter] = i;
                counter++;
                break;
            }
        }
    }

    console.log(sortedRows);

    return sortedRows;
}

// TODO Document & clean up this function
function sortColumn(colNum, type, records, columns, field, team, useCols) {
    var direction = parseInt(localStorage.getItem("direction"));
    var previousColumn = parseInt(localStorage.getItem("column"));
    // set headers to color, then highlight current one
    let tempHeaders = document.getElementsByClassName("table-header-section-raw");
    for (let headerNum = 0; headerNum < tempHeaders.length; headerNum++) {
        tempHeaders[headerNum].style.backgroundColor = "#333333";
    }
    tempHeaders[colNum].style.backgroundColor = "#995303";

    localStorage.setItem("column", colNum);
    localStorage.setItem("direction", parseInt(direction) + 1);
    if (previousColumn != colNum) {
        direction = 0;
        localStorage.setItem("direction", 1);
    }

    if (useCols) {
        var cols = document.getElementsByClassName("column");
        for (var i = 0; i < cols.length; i++) {
            cols[i].style.background = "";
        }
        if (direction % 3 == 0) {
            cols[colNum].style.background = 'linear-gradient(180deg, rgba(18,18,18,1) 0%, rgba(255,158,0,1) 100%)';
            cols[colNum].style.animation = `column-sort-up ${2.5}s linear infinite`;
        } else {
            cols[colNum].style.background = 'linear-gradient(0deg, rgba(18,18,18,1) 0%, rgba(255,158,0,1) 100%)';
            cols[colNum].style.animation = `column-sort-down ${2.5}s linear infinite`;
        }
        cols[colNum].style.backgroundSize = "100vh 35vh";
    }

    if (type == 1) {
        var sortedColumn = JSON.parse(JSON.stringify(columns));
        //console.log(dir);
        if (direction % 3 == 0) {
            sortedColumn = sortedColumn[colNum].sort(function (a, b) { return a - b });
        } else if (direction % 3 == 1) {
            sortedColumn = sortedColumn[colNum].sort(function (a, b) { return b - a });
        } else {
            //console.log(team);
            if (team) {
                getTeamData();
            } else {
                resetRaw();
            }
            //originalSort(records, columns, field);
            return;
        }

        var sortedRows = [];
        var previousRows = [];
        var takenRows = [];
        var counter = 0;

        var tempColumns = JSON.parse(JSON.stringify(columns));

        for (var r = 0; r < records.length; r++) {
            for (var i = 0; i < tempColumns[0].length; i++) {
                //console.log(tempColumns[colNum][i]);
                //console.log(takenRows.includes(i));
                if (columns[colNum][i] == sortedColumn[r] && !takenRows.includes(i)) {
                    sortedRows[counter] = records[i];
                    previousRows[counter] = i;
                    takenRows[counter] = i;
                    counter++;
                    break;
                }
            }
        }

        //console.log(sortedColumn);

        var cols = document.getElementsByClassName("column");
        for (var i = 0; i < records.length; i++) {
            var sub = 0;
            if (team) {
                sub = 1;
            }
            for (var s = 0; s < records[i].length - sub; s++) {
                //console.log(RECORDS[i][s]);
                var tempCol = cols[s];
                var temp = tempCol.children[i + 1];
                if (team) {
                    temp.classList[1] = i;
                }

                if (field[s].includes("Comments")) {
                    temp.innerText = "{ View }";
                    temp.id = i;
                    temp.classList.add(s);
                    temp.onclick = function () { showCommentModal(sortedRows[this.id][this.classList[1]]) }
                    temp.addEventListener("click", function () {
                        setRowHighlight(this.id, true);
                    });
                } else {
                    if (team) {
                        if (s == 0) {
                            for (var q = 0; q < sortedRows.length; q++) {
                                if (sortedRows[i][0] == TEAMS[q]) {
                                    temp.id = q;
                                }
                            }
                        }
                    }
                    temp.innerText = sortedRows[i][s];
                }
                temp.style.boxShadow = "";
                //Lol
                if (true) {
                    //console.log(PICK_LIST_OBJECTS[PICK_LIST_TEAM_KEY.indexOf(String(sortedRows[i][0]))].color);
                    if (PICK_LIST_OBJECTS[PICK_LIST_TEAM_KEY.indexOf(String(sortedRows[i][0]))].getColor() != 0) {
                        temp.style.boxShadow = `inset 0px 0px 0.15vh 0.35vh ${teamColors[PICK_LIST_OBJECTS[PICK_LIST_TEAM_KEY.indexOf(String(sortedRows[i][0]))].getColor() - 1]}`;
                        //console.log(tempData.style.backgroundColor);
                    }
                }
            }
        }
        // This code is a mess

        if (team) {
            /*if (parseInt(localStorage.getItem("previousHighlightRow")) != -1) {
                var previousTeam = TEAMS[parseInt(localStorage.getItem("previousHighlightRow"))];
                var originalHighlight = localStorage.getItem("previousHighlightRow");
                console.log(previousTeam);
                for (var i = 0; i < sortedRows.length; i++) {
                    if (sortedRows[i][0] == previousTeam) {
                        setRowHighlight(i, true);
                        localStorage.setItem("previousHighlightRow", originalHighlight);
                    }
                }
            }*/
            for (let i = 0; i < sortedRows.length; i++) {
                for (let t = 0; t < TEAMS.length; t++) {
                    if (sortedRows[i][0] == TEAMS[t]) {
                        for (let c = 0; c < cols.length; c++) {
                            cols[c].children[i + 1].classList = "data-value";
                            cols[c].children[i + 1].classList.add(t);
                        }
                        break;
                    }
                }
            }
            if (parseInt(localStorage.getItem("previousHighlightRow")) != -1) {
                setTeamRowHighlight(localStorage.getItem("previousHighlightRow"), true);
            }
        }

    } else {
        // Uh oh it's not a number :(
        console.error("Sad");
    }
}

// FOR TEAMS --------------------------------------------------

/*function sortTeamColumn(colNum, type, col, dk) {
    var direction = parseInt(localStorage.getItem("direction"));
    console.log(direction);
    var previousColumn = parseInt(localStorage.getItem("column"));
    localStorage.setItem("column", colNum);
    localStorage.setItem("direction", parseInt(direction) + 1);
    if (previousColumn != colNum) {
        direction = 0;
        localStorage.setItem("direction", 1);
    }
 
    if (type == 1) {
        var sortedColumn = JSON.parse(JSON.stringify(TEAM_COLUMNS));
        //console.log(dir);
        console.log(sortedColumn);
        //console.log(dk)
        if (direction % 3 == 0) {
            sortedColumn = sortedColumn[colNum].sort(function (a, b) { return a - b });
        } else if (direction % 3 == 1) {
            sortedColumn = sortedColumn[colNum].sort(function (a, b) { return b - a });
        } else {
            originalSort(TEAM_ROWS, TEAM_COLUMNS);
            return;
        }
 
        console.log(sortedColumn);
 
        var sortedRows = [];
        var takenRows = [];
        var counter = 0;
 
        var tempColumns = JSON.parse(JSON.stringify(TEAM_COLUMNS));
 
        for (var r = 0; r < TEAMS.length; r++) {
            for (var i = 0; i < tempColumns[0].length; i++) {
                //console.log(tempColumns[colNum][i]);
                //console.log(takenRows.includes(i));
                if (TEAM_COLUMNS[colNum][i] == sortedColumn[r] && !takenRows.includes(i)) {
                    sortedRows[counter] = TEAM_ROWS[i];
                    takenRows[counter] = i;
                    counter++;
                    break;
                }
            }
        }
 
        var cols = document.getElementsByClassName("column");
        for (var i = 0; i < TEAMS.length; i++) {
            for (var s = 0; s < TEAM_COLUMNS.length; s++) {
                console.log(sortedRows);
                var tempCol = cols[s];
                var temp = tempCol.children[i + 1];
                temp.innerText = sortedRows[i][s];
            }
        }
 
    } else {
        console.log("Sad");
    }
}*/

function detectCharacter(val) {
    //console.log(val);
    if (val == "0" || val == "1" || val == "2" || val == "3" || val == "4" || val == "5" || val == "6" || val == "7" || val == "8" || val == "9") {
        return 1;
    }
    return 0;
}

function originalSort(record, column, field) {
    let cols = document.getElementsByClassName("column");
    for (let x = 0; x < record.length; x++) {
        for (let y = 0; y < record[x].length - 1; y++) {
            //console.log(RECORDS[i][s]);
            let tempCol = cols[y];
            let temp = tempCol.children[x + 1];
            temp.innerText = column[y][x];
        }
    }
}

function toggleSidebar() {
    sidebarOpen = !sidebarOpen;

    if (sidebarOpen) {
        tl.to(sidebar, { left: "0vh", duration: 0.5, ease: "power2" });
        //tl.to(rawTable, { marginLeft: "23vw", duration: 0.5, ease: "power2"}, "-=0.5");
        tl.to(openSidebarButton, { scale: "1 1", duration: 0.5, ease: "power2" }, "-=0.5");
    } else {
        tl.to(sidebar, { left: "-25vh", duration: 0.5, ease: "power2" });
        //tl.to(rawTable, { marginLeft: "3vw", duration: 0.5, ease: "power2"}, "-=0.5");
        tl.to(openSidebarButton, { scale: "-1 1", duration: 0.5, ease: "power2" }, "-=0.5");
    }
}

function refreshData() {
    rawTable.innerHTML = "";
    getData();
}

function setUpPickList() {
    getTeamData();

    breakdownLines.style.display = "none";
    graphContainer.style.display = "none";
    breakdownGrid.style.display = "none";
    rawTable.innerHTML = "";
    pickListContainer.style.display = "block";

    innerPickListContainer.innerHTML = "";
    for (var i = 0; i < TEAMS.length; i++) {
        var tempTeam = document.createElement("div");
        tempTeam.className = "pick-list-team";
        tempTeam.id = i;

        var tempTeamText = document.createElement("h7");
        tempTeamText.innerText = PICK_LIST_OBJECTS[i].getTeam();

        tempTeam.appendChild(tempTeamText);

        //console.log(TEAMS_FLIPPED)
        if (TEAMS_FLIPPED.includes(PICK_LIST_OBJECTS[i].getTeam())) {
            let tempWarning = document.createElement("div");
            tempWarning.className = "warning-container";
            let tempWarningText = document.createElement("div");
            tempWarningText.className = "warning-popup";
            tempWarning.appendChild(tempWarningText);
            tempWarning.style.backgroundImage = "url('svg/flip.svg')";
            let counter = 0;
            for (let x = 0; x < TEAMS_FLIPPED.length; x++) {
                if (TEAMS_FLIPPED[x] == PICK_LIST_OBJECTS[i].getTeam()) {
                    counter++;
                }
            }
            if (counter == 1) {
                tempWarningText.innerText = counter + " Flip";
            } else {
                tempWarningText.innerText = counter + " Flips";
            }
            tempTeam.appendChild(tempWarning);
        }

        if (TEAMS_COMMS.includes(PICK_LIST_OBJECTS[i].getTeam())) {
            let tempWarning = document.createElement("div");
            tempWarning.className = "warning-container";
            let tempWarningText = document.createElement("div");
            tempWarningText.className = "warning-popup";
            tempWarning.appendChild(tempWarningText);
            tempWarning.style.backgroundImage = "url('svg/comms.svg')";
            let counter = 0;
            for (let x = 0; x < TEAMS_COMMS.length; x++) {
                if (TEAMS_COMMS[x] == PICK_LIST_OBJECTS[i].getTeam()) {
                    counter++;
                }
            }
            if (counter == 1) {
                tempWarningText.innerText = counter + " Comm Lost";
            } else {
                tempWarningText.innerText = counter + " Comms Lost";
            }
            tempTeam.appendChild(tempWarning);
        }

        if (TEAMS_DISABLED.includes(PICK_LIST_OBJECTS[i].getTeam())) {
            let tempWarning = document.createElement("div");
            tempWarning.className = "warning-container";
            let tempWarningText = document.createElement("div");
            tempWarningText.className = "warning-popup";
            tempWarning.appendChild(tempWarningText);
            tempWarning.style.backgroundImage = "url('svg/disabled.svg')";
            let counter = 0;
            for (let x = 0; x < TEAMS_DISABLED.length; x++) {
                if (TEAMS_DISABLED[x] == PICK_LIST_OBJECTS[i].getTeam()) {
                    counter++;
                }
            }
            if (counter == 1) {
                tempWarningText.innerText = counter + " Time Disabled";
            } else {
                tempWarningText.innerText = counter + " Times Disabled";
            }
            tempTeam.appendChild(tempWarning)
        }

        if (TEAMS_DUMB.includes(PICK_LIST_OBJECTS[i].getTeam())) {
            let tempWarning = document.createElement("div");
            tempWarning.className = "warning-container";
            let tempWarningText = document.createElement("div");
            tempWarningText.className = "warning-popup";
            tempWarning.appendChild(tempWarningText);
            tempWarning.style.backgroundImage = "url('svg/dumb.svg')";
            let counter = 0;
            for (var x = 0; x < TEAMS_DUMB.length; x++) {
                if (TEAMS_DUMB[x] == PICK_LIST_OBJECTS[i].getTeam()) {
                    counter++;
                }
            }
            if (counter == 1) {
                tempWarningText.innerText = counter + " Dumb Report";
            } else {
                tempWarningText.innerText = counter + " Dumb Reports";
            }
            tempTeam.appendChild(tempWarning)
        }

        if (TEAMS_RECKLESS.includes(PICK_LIST_OBJECTS[i].getTeam())) {
            let tempWarning = document.createElement("div");
            tempWarning.className = "warning-container";
            let tempWarningText = document.createElement("div");
            tempWarningText.className = "warning-popup";
            tempWarning.appendChild(tempWarningText);
            tempWarning.style.backgroundImage = "url('svg/reckless.svg')";
            let counter = 0;
            for (var x = 0; x < TEAMS_RECKLESS.length; x++) {
                if (TEAMS_RECKLESS[x] == PICK_LIST_OBJECTS[i].getTeam()) {
                    counter++;
                }
            }
            if (counter == 1) {
                tempWarningText.innerText = counter + " Reckles Report";
            } else {
                tempWarningText.innerText = counter + " Reckless Reports";
            }
            tempTeam.appendChild(tempWarning)
        }

        let tempAutoPoints = document.createElement("div");
        tempAutoPoints.innerText = TEAM_ROWS[TEAM_COLUMNS[0].indexOf(PICK_LIST_OBJECTS[i].getTeam())][1];
        tempAutoPoints.className = "pick-list-team-stat";
        tempTeam.appendChild(tempAutoPoints);

        let tempTelePoints = document.createElement("div");
        tempTelePoints.innerText = TEAM_ROWS[TEAM_COLUMNS[0].indexOf(PICK_LIST_OBJECTS[i].getTeam())][2];
        tempTelePoints.className = "pick-list-team-stat";
        tempTeam.appendChild(tempTelePoints);

        let tempPoints = document.createElement("div");
        tempPoints.innerText = TEAM_ROWS[TEAM_COLUMNS[0].indexOf(PICK_LIST_OBJECTS[i].getTeam())][13];
        tempPoints.className = "pick-list-team-stat";
        tempTeam.appendChild(tempPoints);

        var tempControlPanel = document.createElement("div");
        tempControlPanel.className = "pick-list-control-panel";

        var toggleControlPanel = document.createElement("div");
        toggleControlPanel.className = "pick-list-toggle-control-panel";

        tempControlPanel.appendChild(toggleControlPanel);

        tempControlPanel.addEventListener("click", function (event) {
            if (event.target.className == "pick-list-control-panel") {
                var toggles = document.getElementsByClassName("pick-list-control-panel");
                for (var i = 0; i < toggles.length; i++) {
                    if (this != toggles[i]) {
                        //toggles[i].children[0].style.display = "none";
                        toggles[i].children[0].style.scale = 0;
                        toggles[i].style.marginLeft = "2vh";
                    }
                }
                if (this.children[0].style.scale != 1) {
                    this.children[0].style.scale = 1;
                    this.style.marginLeft = "17vh";
                } else {
                    //this.children[0].style.display = "none";
                    this.children[0].style.scale = 0;
                    this.style.marginLeft = "2vh";
                }
            } else {

            }
        });

        var tempGreemButton = document.createElement("div");
        tempGreemButton.className = "pick-list-green-button";
        tempGreemButton.innerText = "";
        tempGreemButton.id = i;
        if (PICK_LIST_OBJECTS[i].getColor() == 1) {
            tempGreemButton.style.backgroundColor = teamColors[0];
        }
        tempGreemButton.onclick = function () {
            document.getElementsByClassName("pick-list-yellow-button")[this.id].style.backgroundColor = "";
            document.getElementsByClassName("pick-list-red-button")[this.id].style.backgroundColor = "";
            if (PICK_LIST_OBJECTS[this.id].getColor() == 1) {
                PICK_LIST_OBJECTS[this.id].setColor(0);
                this.style.backgroundColor = "";
            } else {
                PICK_LIST_OBJECTS[this.id].setColor(1);
                this.style.backgroundColor = teamColors[0];
            }
            let tempClickedTeam = document.getElementsByClassName("pick-list-team")[this.id];
            if (PICK_LIST_OBJECTS[this.id].getColor() == 0) {
                tempClickedTeam.style.backgroundColor = "#5b5b5b";
            } else {
                tempClickedTeam.style.setProperty("background-color", pickListColors[PICK_LIST_OBJECTS[this.id].getColor() - 1], "important");
            }
            console.log(this.id);
        }
        toggleControlPanel.appendChild(tempGreemButton);

        var tempYellowButton = document.createElement("div");
        tempYellowButton.className = "pick-list-yellow-button";
        tempYellowButton.innerText = "";
        tempYellowButton.id = i;
        if (PICK_LIST_OBJECTS[i].getColor() == 2) {
            tempYellowButton.style.backgroundColor = teamColors[1];
        }
        tempYellowButton.onclick = function () {
            document.getElementsByClassName("pick-list-green-button")[this.id].style.backgroundColor = "";
            document.getElementsByClassName("pick-list-red-button")[this.id].style.backgroundColor = "";
            if (PICK_LIST_OBJECTS[this.id].getColor() == 2) {
                PICK_LIST_OBJECTS[this.id].setColor(0);
                this.style.backgroundColor = "";
            } else {
                PICK_LIST_OBJECTS[this.id].setColor(2);
                this.style.backgroundColor = teamColors[1];
            }
            let tempClickedTeam = document.getElementsByClassName("pick-list-team")[this.id];
            if (PICK_LIST_OBJECTS[this.id].getColor() == 0) {
                tempClickedTeam.style.backgroundColor = "#5b5b5b";
            } else {
                tempClickedTeam.style.setProperty("background-color", pickListColors[PICK_LIST_OBJECTS[this.id].getColor() - 1], "important");
            }
        }
        toggleControlPanel.appendChild(tempYellowButton);

        var tempRedButton = document.createElement("div");
        tempRedButton.className = "pick-list-red-button";
        tempRedButton.innerText = "";
        tempRedButton.id = i;
        if (PICK_LIST_OBJECTS[i].getColor() == 3) {
            tempRedButton.style.backgroundColor = teamColors[2];
        }
        tempRedButton.onclick = function () {
            document.getElementsByClassName("pick-list-yellow-button")[this.id].style.backgroundColor = "";
            document.getElementsByClassName("pick-list-green-button")[this.id].style.backgroundColor = "";
            if (PICK_LIST_OBJECTS[this.id].getColor() == 3) {
                PICK_LIST_OBJECTS[this.id].setColor(0);
                this.style.backgroundColor = "";
            } else {
                PICK_LIST_OBJECTS[this.id].setColor(3);
                this.style.backgroundColor = teamColors[2];
            }
            let tempClickedTeam = document.getElementsByClassName("pick-list-team")[this.id];
            if (PICK_LIST_OBJECTS[this.id].getColor() == 0) {
                tempClickedTeam.style.backgroundColor = "#5b5b5b";
            } else {
                tempClickedTeam.style.setProperty("background-color", pickListColors[PICK_LIST_OBJECTS[this.id].getColor() - 1], "important");
            }
        }
        toggleControlPanel.appendChild(tempRedButton);

        tempTeam.appendChild(tempControlPanel);

        var tempInfoButton = document.createElement("div");
        tempInfoButton.className = "pick-list-info-button";
        tempInfoButton.innerText = "i";
        tempInfoButton.id = i;
        tempInfoButton.onclick = function () {
            removeActive();
            sideButtons[2].classList.add("active");
            getTeamData();
            console.log(TEAMS);
            setRowHighlight(TEAMS.indexOf(parseInt(PICK_LIST_OBJECTS[this.id].getTeam())), true);
        }
        tempTeam.appendChild(tempInfoButton);

        if (PICK_LIST_OBJECTS[i].getColor() != 0) {
            tempTeam.style.setProperty("background-color", pickListColors[PICK_LIST_OBJECTS[i].getColor() - 1], "important");
        }

        innerPickListContainer.appendChild(tempTeam);
    }
}

function downloadPickList() {
    let fileText = JSON.parse(JSON.stringify(PICK_LIST_TEAM_KEY));
    for (let i = 0; i < fileText.length; i++) {
        fileText[i] += "\n";
    }
    const element = document.createElement("a");
    const file = new Blob(fileText, {
        type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "PicklistRaw.txt";
    document.body.appendChild(element);
    element.click();
}

function showPickListSort() {
    sortPickListModal.style.display = "block";
}

function sortPickList(colNum) {
    var sortedColumn = JSON.parse(JSON.stringify(TEAM_COLUMNS));
    var sortedRows = [];
    var previousRows = [];
    var takenRows = [];
    var counter = 0;

    sortedColumn = sortedColumn[colNum].sort(function (a, b) { return b - a });

    var tempColumns = JSON.parse(JSON.stringify(TEAM_COLUMNS));

    for (var r = 0; r < TEAM_ROWS.length; r++) {
        for (var i = 0; i < tempColumns[0].length; i++) {
            if (TEAM_COLUMNS[colNum][i] == sortedColumn[r] && !takenRows.includes(i)) {
                sortedRows[counter] = TEAM_ROWS[i];
                previousRows[counter] = i;
                takenRows[counter] = i;
                counter++;
                break;
            }
        }
    }

    var newPickList = [];
    var newPickListTeamKey = [];
    console.log(PICK_LIST_TEAM_KEY)
    for (var i = 0; i < sortedRows.length; i++) {
        for (var t = 0; t < PICK_LIST_OBJECTS.length; t++) {
            if (TEAM_ROWS[TEAMS.indexOf(PICK_LIST_OBJECTS[t].getTeam())] == sortedRows[i]) {
                newPickList.push(PICK_LIST_OBJECTS[t]);
                newPickListTeamKey.push(String(PICK_LIST_OBJECTS[t].getTeam()));
                break;
            }
        }
    }
    PICK_LIST_OBJECTS = newPickList;
    PICK_LIST_TEAM_KEY = newPickListTeamKey;
    setUpPickList();
}

function closePickListSortModal() {
    sortPickListModal.style.display = "none";
}

function getTeamData() {
    // Hide all other tabs, resets arrays
    breakdownLines.style.display = "none";
    graphContainer.style.display = "none";
    pickListContainer.style.display = "none";
    breakdownGrid.style.display = "none";

    rawTable.innerHTML = "";
    TEAM_COLUMNS = [];
    TEAM_ROWS = [];
    TEAM_FIELDS = [];

    // Updates array of teams
    getTeamList();

    // Data that is numerical & will be included in team data grid
    let dataToKeep = [];

    // Iterate through all fields, if the data is numerical, add field index to dataToKeep array
    for (let i = 0; i < FIELDS.length; i++) {
        let dataType = 1;
        if (RECORDS.length > 0) {
            dataType = new String(RECORDS[0][i]).substring(0, 1);
        }
        // Special case is match number, that would obviously be useless to round & use haha
        if (detectCharacter(dataType) == 1 && FIELDS[i] != "Match Number") {
            dataToKeep.push(i - 1);
            TEAM_FIELDS.push(FIELDS[i]);
        }
    }

    // Iterates through all fields (columns), creates field headers & columns
    for (let i = 0; i < dataToKeep.length; i++) {
        // Creates column html element
        let tempColumn = document.createElement("div");
        tempColumn.className = "column";

        // Temp header html element
        let tempHeader = document.createElement("div");

        let text = document.createElement("h3");
        text.innerText = FIELDS[dataToKeep[i] + 1];
        tempHeader.appendChild(text);
        tempHeader.className = "table-header-section-raw";
        tempHeader.classList.add(`${(i)}`);
        tempColumn.appendChild(tempHeader);

        rawTable.appendChild(tempColumn);
    }
    // Where in the world did I set the highlight I'm falling asleep :(

    // Creates new 2d arrays
    for (let g = 0; g < dataToKeep.length + 1; g++) {
        TEAM_COLUMNS[g] = new Array();
    }
    for (let t = 0; t < TEAMS.length; t++) {
        TEAM_ROWS[t] = new Array();
    }

    // Iterates through every team (basically makes each row)
    for (let i = 0; i < TEAMS.length; i++) {
        // List of every row of raw data for team
        let teamRows = [];

        // If the record team equals current team, add the raw data row index to array
        for (let t = 0; t < RECORDS.length; t++) {
            if (RECORDS[t][TEAM_INDEX] == TEAMS[i]) {
                teamRows.push(t);
            }
        }

        // Iterates through every column
        for (let c = 0; c < dataToKeep.length; c++) {
            // Average for the current column/field
            let average = 0;

            // Adds all of the team's rows in current column together, so we can everage it later
            for (let r = 0; r < teamRows.length; r++) {
                average += parseInt(RECORDS[teamRows[r]][dataToKeep[c] + 1]);
            }

            // Temp data value html element
            let tempData = document.createElement("div");
            tempData.className = "data-value";
            tempData.classList.add(i);
            tempData.id = i;

            // Averages each data value, sets the text
            average = Math.floor(average / teamRows.length * 10) / 10;
            tempData.innerText = average;

            // If it's the team data value, then show comment modal on click, otherwise just do normal highlight toggle
            if (c == 0) {
                tempData.addEventListener("click", function () {
                    // Always highlight, so it's easy to see what team you clicked on
                    setTeamRowHighlight(parseInt(this.classList[1]), true);
                    showCommentModal(TEAM_ROWS[this.id][TEAM_COLUMNS.length - 1]);
                });
            } else {
                tempData.addEventListener("click", function () {
                    // Toggle highlight
                    setTeamRowHighlight(parseInt(this.classList[1]), false);
                });
            }

            // Adds row stripes
            if ((i) % 3 == 0) {
                tempData.style.backgroundColor = "#302f2b";
            }

            // If pick list contains team & team has color, set the border to correct color
            if (PICK_LIST_TEAM_KEY.indexOf(String(TEAMS[i])) != -1) {
                if (PICK_LIST_OBJECTS[PICK_LIST_TEAM_KEY.indexOf(String(TEAMS[i]))].getColor() != 0) {
                    tempData.style.boxShadow = `inset 0px 0px 0.15vh 0.35vh ${teamColors[PICK_LIST_OBJECTS[PICK_LIST_TEAM_KEY.indexOf(String(TEAMS[i]))].getColor() - 1]}`;
                }
            }

            rawTable.children[c].appendChild(tempData);

            // Average out the data
            TEAM_COLUMNS[c][i] = average;
            TEAM_ROWS[i][c] = average;
        }

        // Temp comment text
        let tempComment = "";
        for (let q = 0; q < RECORDS.length; q++) {
            // Find all comments for current team, add to variable
            if (RECORDS[q][TEAM_INDEX] == TEAMS[i]) {
                tempComment += RECORDS[q][FIELDS.indexOf("Comments")] + "\n";
            }
        }

        // Add comment text to correct position
        TEAM_ROWS[i].push(tempComment);
        TEAM_COLUMNS[dataToKeep.length].push(tempComment);
    }

    // Adds click listeners to each header
    for (let i = 0; i < dataToKeep.length; i++) {
        document.getElementsByClassName("column")[i].children[0].onclick = function () {
            sortColumn(this.classList[1], detectCharacter(1), TEAM_ROWS, TEAM_COLUMNS, TEAM_FIELDS, true, true);
        };
    }

    // Sets highlight to what it was before
    if (localStorage.getItem("previousHighlightRow") != -1) {
        setRowHighlight(parseInt(localStorage.getItem("previousHighlightRow")), true);
    }
}

// Helper function, updates list of teams
function getTeamList() {
    TEAMS = [];

    for (let i = 0; i < RECORDS.length; i++) {
        if (!TEAMS.includes(RECORDS[i][TEAM_INDEX]) && RECORDS[i][TEAM_INDEX] != null && RECORDS[i][TEAM_INDEX] != "?") {
            TEAMS.push(RECORDS[i][TEAM_INDEX]);
        }
    }

    // Sorts teams by ascending number
    TEAMS.sort((a, b) => a - b);
    console.log(TEAMS);
}

// Fetches all matches from specified event, adds video link if available
function getTeamMatchesTBA(url) {
    fetch(url, tbaOptions)
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
            let tempCommentContainer = document.getElementById("breakdown-comment-container");
            let tempLinkContainer = document.createElement("div");
            tempLinkContainer.id = "team-link-container";
            for (let i = 0; i < json.length; i++) {
                let tempMatchText = document.createElement("a");
                tempMatchText.className = "breakdown-comment";
                tempMatchText.text = "Qual " + json[i].match_number;
                if (json[i].videos.length > 0) {
                    tempMatchText.href = `https://www.youtube.com/watch?v=${json[i].videos[0].key}`;
                } else {
                    tempMatchText.text = tempMatchText.text + "(No Video Found)";
                }
                if (i < json.length - 1) {
                    tempMatchText.text = tempMatchText.text + ",";
                }
                tempMatchText.target = "_blank";
                tempLinkContainer.appendChild(tempMatchText);
            }
            tempCommentContainer.appendChild(tempLinkContainer);
        });
}

// Gets all events & populates event select with them
function getEventListTBA(url) {
    fetch(url, tbaOptions)
        .then((response) => response.json())
        .then((json) => {
            console.log(json.length);
            eventSelect.innerHTML = "";
            // Sorts the array (smartly called 'json' for some reason) by object property name
            json = json.sort((a, b) => (a.name > b.name ? 1 : -1));
            for (var i = 0; i < json.length; i++) {
                TBA_EVENT_NAMES[i] = json[i].name;
                var tempOption = document.createElement("option");
                tempOption.innerText = json[i].name;
                tempOption.value = json[i].key;
                if (json[i].key == localStorage.getItem("event-key")) {
                    tempOption.selected = "selected";
                }
                eventSelect.appendChild(tempOption);

                // Shorten event name if it's ridiculously long
                if (TBA_EVENT_NAMES[i].length > 25) {
                    TBA_EVENT_NAMES[i] = TBA_EVENT_NAMES[i].substring(0, 25);
                }
            }

        });
}

// Toggles settings tab
function toggleSettings() {
    settingsOpen = !settingsOpen;
    if (settingsOpen) {
        settings.style.display = "flex";
        body.style.overflow = "hidden";
    } else {
        settings.style.display = "none";
        body.style.overflow = "auto";
        localStorage.setItem("event-key", eventSelect.value);
        localStorage.setItem("spreadsheet-url", urlInput.value);
    }
}

function pickListSliderCallback() {
    var pickListTeams = document.getElementsByClassName("pick-list-team");
    var warnings = document.getElementsByClassName("warning-container");
    //innerPickListContainer.style.scale = pickListScaleSlider.value;
    for (var i = 0; i < pickListTeams.length; i++) {
        pickListTeams[i].style.height = pickListScaleSlider.value + "vh";
    }

    for (var i = 0; i < warnings.length; i++) {
        warnings[i].style.height = pickListScaleSlider.value + "vh";
        warnings[i].style.width = pickListScaleSlider.value + "vh";
    }
}