// TODO Everything haha 


// Animation timeline
var tl = new TimelineMax();


const body = document.body;

// TODO CHANGE THIS PLEASE PLEASE PLEASE PLEASE PLEASE ON FRIDAY NIGHT PLEASE PLEASE PLEASE
const TEAM_MATCH_DATA = [
    {
        "Match": 7,
        "Red": [5148, 2506, 3630],
        "Blue": [8029, 3891, 3197]
    },
    {
        "Match": 16,
        "Red": [3197, 3734, 6574],
        "Blue": [1306, 1091, 2062]
    },
    {
        "Match": 22,
        "Red": [5148, 2202, 9676],
        "Blue": [2358, 3197, 706]
    },
    {
        "Match": 29,
        "Red": [537, 3381, 2220],
        "Blue": [3197, 5148, 6421]
    },
    {
        "Match": 45,
        "Red": [1792, 3197, 8802],
        "Blue": [9760, 930, 8744]
    },
    {
        "Match": 51,
        "Red": [93, 3197, 1714],
        "Blue": [1259, 3692, 1792]
    },
    {
        "Match": 57,
        "Red": [5096, 8029, 2830],
        "Blue": [3197, 8847, 9425]
    },
    {
        "Match": 64,
        "Red": [6381, 1781, 3197],
        "Blue": [1732, 6823, 4786]
    },
    {
        "Match": 81,
        "Red": [4531, 4787, 7103],
        "Blue": [2194, 6223, 3197]
    },
    {
        "Match": 89,
        "Red": [8802, 9535, 6223],
        "Blue": [3197, 5586, 4645]
    }
]

let badCompareValues = [5, 8, 10, 13];

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
const breakdownCategoryHeaders = ["Total Points", "Auto Points", "Tele Points", "Endgame points", "Tele Amp", "Tele Speaker"];
const sortIndexes = [4, 1, 2, 3, 14, 10];

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

var highlightTeamData;

localStorage.getItem("team-color-rank-highlight") != null ? highlightTeamData = JSON.parse(localStorage.getItem("team-color-rank-highlight")) : highlightTeamData = false;

const highlightSelect = document.getElementById("highlight-select");
highlightSelect.addEventListener('change', function () {
    highlightTeamData = JSON.parse(highlightSelect.value);
    localStorage.setItem("team-color-rank-highlight", highlightSelect.value);
});

highlightSelect.value = highlightTeamData;

const warningTypes = ["Too Tall/s", "Comm Issue/s", "Disabled", "Unintelligent", "Reckless"];


// TODO document this section
var PICK_LIST = new Array();
var PICK_LIST_TEAM_KEY = new Array();
var PICK_LIST_OBJECTS = new Array();
// TODO I forgot how this works double check
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
pickListScaleSlider.addEventListener("input", pickListSliderCallback);

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



var intervalID;


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
    clearInterval(intervalID);
    console.log("Removed interval");
    intervalID = null;

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
        //console.log(PICK_LIST);
        PICK_LIST_OBJECTS = [];
        PICK_LIST_TEAM_KEY = [];
        for (var i = 0; i < PICK_LIST.length; i++) {
            PICK_LIST_OBJECTS[i] = new PickListTeam(PICK_LIST[i][0], PICK_LIST[i][1], PICK_LIST[i][2]);
            PICK_LIST_TEAM_KEY.push(PICK_LIST[i][1]);
            PICK_LIST_ORDER.push(PICK_LIST[i][1]);
        }
        //console.log(PICK_LIST_TEAM_KEY);
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
        //console.log(PICK_LIST_OBJECTS);
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
        //console.log(TEAMS);

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
            if (FIELDS[s] == "Too Tall") {
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

    if (localStorage.getItem("previousHighlightRawRow") != row || always) {
        localStorage.setItem("previousHighlightRawRow", row);
        for (let c = 0; c < cols.length; c++) {
            // For now I'm just casting row as an integer ;)
            cols[c].children[parseInt(row) + 1].style.setProperty("background-color", "#a8652d", "important");
        }
    } else {
        localStorage.setItem("previousHighlightRawRow", -1);
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
            console.log(badCompareValues.includes(i) + ", " + i + ", " + teamStats[l]);
            if (badCompareValues.includes(i)) {
                if (width > 50) {
                    tempLine.style.zIndex = 0;
                    tempNumbers[l].style.backgroundColor = "transparent";
                    tempNumbers[l].style.fontWeight = "normal";
                    tempNumbers[l].style.textShadow = "none";
                    tempLine.classList = "compare-inner-line";
                    tempNumbers[l].style.border = "solid 0.5vh transparent";
                    //tempLine.classList.add(`compare-pulse-${l}`);
                } else {
                    tempLine.style.zIndex = 10;
                    tempNumbers[l].style.backgroundColor = `rgba(50, 205, 50, ${(width - 50) / 50})`;
                    tempNumbers[l].style.border = "solid 0.5vh limegreen";
                    tempNumbers[l].style.fontWeight = "bold";
                    tempNumbers[l].style.textShadow = "lime 0px 0px 0.75vh";
                }
            } else {
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
    getTeamData();

    rawTable.innerHTML = "";
    graphContainer.style.display = "none";
    pickListContainer.style.display = "none";
    breakdownGrid.style.display = "none";

    let matchSelect = document.createElement("select");

    let matches = [];
    matchSelect.id = "match-select";
    matchSelect.addEventListener("change", doMatch);

    for (var i = 0; i < TEAM_MATCH_DATA.length; i++) {
        let tempOption = document.createElement("option");
        tempOption.value = i;
        tempOption.text = TEAM_MATCH_DATA[i].Match;
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

    let matchNumber = parseInt(matchSelect.value);

    let matchField = document.getElementById("match-field");
    matchField.innerHTML = "";



    // BLUE SECTION
    let blueContainer = document.createElement("div");
    blueContainer.id = "blue-match-container";

    let blueColumns = [];

    for (let i = 0; i < 7; i++) {
        let tempColumn = document.createElement("div");
        tempColumn.className = "match-column"
        blueColumns.push(tempColumn);
        blueContainer.appendChild(tempColumn);
    }
    blueColumns[0].appendChild(createMatchCell(true, "Categories", true));
    for (let i = 0; i < 3; i++) {
        blueColumns[0].appendChild(createMatchCell(true, TEAM_MATCH_DATA[matchNumber].Blue[i], true));
    }
    blueColumns[0].appendChild(createMatchCell(true, "Totals", true));

    blueColumns[1].appendChild(createMatchCell(true, "AutoPoints", true));
    blueColumns[2].appendChild(createMatchCell(true, "TelePoints", true));
    blueColumns[3].appendChild(createMatchCell(true, "EndgamePoints", true));
    blueColumns[4].appendChild(createMatchCell(true, "TotalPoints", true));
    blueColumns[5].appendChild(createMatchCell(true, "Amps", true));
    blueColumns[6].appendChild(createMatchCell(true, "Gamepieces", true));

    let dataIndicies = [1, 2, 3, 4, 13, -1];
    let blueTotals = [];

    for (let i = 0; i < dataIndicies.length; i++) {
        blueTotals.push(0);
        for (let t = 0; t < 3; t++) {
            let tempValue = 0;
            if (dataIndicies[i] != -1) {
                tempValue = TEAM_COLUMNS[dataIndicies[i]][TEAMS.indexOf(parseInt(TEAM_MATCH_DATA[matchNumber].Blue[t]))];
            } else {
                tempValue = TEAM_COLUMNS[5][TEAMS.indexOf(parseInt(TEAM_MATCH_DATA[matchNumber].Blue[t]))] + TEAM_COLUMNS[8][TEAMS.indexOf(parseInt(TEAM_MATCH_DATA[matchNumber].Blue[t]))] + TEAM_COLUMNS[10][TEAMS.indexOf(parseInt(TEAM_MATCH_DATA[matchNumber].Blue[t]))] + TEAM_COLUMNS[13][TEAMS.indexOf(parseInt(TEAM_MATCH_DATA[matchNumber].Blue[t]))];
            }
            tempValue = Math.round(tempValue * 10) / 10;
            if (isNaN(tempValue)) {
                tempValue = 0;
            }
            blueTotals[i] += tempValue;
            blueColumns[i + 1].appendChild(createMatchCell(true, tempValue, false));
        }
    }

    for (let i = 0; i < blueTotals.length; i++) {
        blueColumns[i + 1].appendChild(createMatchCell(true, Math.round(blueTotals[i] * 10) / 10, true));
    }

    matchField.appendChild(blueContainer);



    // RED SECTION
    let redContainer = document.createElement("div");
    redContainer.id = "red-match-container";

    let redColumns = [];

    for (let i = 0; i < 7; i++) {
        let tempColumn = document.createElement("div");
        tempColumn.className = "match-column"
        redColumns.push(tempColumn);
        redContainer.appendChild(tempColumn);
    }
    redColumns[0].appendChild(createMatchCell(false, "Categories", true));
    for (let i = 0; i < 3; i++) {
        redColumns[0].appendChild(createMatchCell(false, TEAM_MATCH_DATA[matchNumber].Red[i], true));
    }
    redColumns[0].appendChild(createMatchCell(false, "Totals", true));

    redColumns[1].appendChild(createMatchCell(false, "AutoPoints", true));
    redColumns[2].appendChild(createMatchCell(false, "TelePoints", true));
    redColumns[3].appendChild(createMatchCell(false, "EndgamePoints", true));
    redColumns[4].appendChild(createMatchCell(false, "TotalPoints", true));
    redColumns[5].appendChild(createMatchCell(false, "Amps", true));
    redColumns[6].appendChild(createMatchCell(false, "Gamepieces", true));

    let redTotals = [];

    for (let i = 0; i < dataIndicies.length; i++) {
        redTotals.push(0);
        for (let t = 0; t < 3; t++) {
            let tempValue = 0;
            if (dataIndicies[i] != -1) {
                tempValue = TEAM_COLUMNS[dataIndicies[i]][TEAMS.indexOf(parseInt(TEAM_MATCH_DATA[matchNumber].Red[t]))];
            } else {
                tempValue = TEAM_COLUMNS[5][TEAMS.indexOf(parseInt(TEAM_MATCH_DATA[matchNumber].Red[t]))] + TEAM_COLUMNS[8][TEAMS.indexOf(parseInt(TEAM_MATCH_DATA[matchNumber].Red[t]))] + TEAM_COLUMNS[10][TEAMS.indexOf(parseInt(TEAM_MATCH_DATA[matchNumber].Red[t]))] + TEAM_COLUMNS[13][TEAMS.indexOf(parseInt(TEAM_MATCH_DATA[matchNumber].Red[t]))];
            }
            tempValue = Math.round(tempValue * 10) / 10;
            if (isNaN(tempValue)) {
                tempValue = 0;
            }
            redTotals[i] += tempValue;
            redColumns[i + 1].appendChild(createMatchCell(false, tempValue, false));
        }
    }

    for (let i = 0; i < redTotals.length; i++) {
        redColumns[i + 1].appendChild(createMatchCell(false, Math.round(redTotals[i] * 10) / 10, true));
    }

    matchField.appendChild(redContainer);
}

function createMatchCell(blue, text, bold) {
    let tempCell = document.createElement("div");
    tempCell.innerText = text;
    tempCell.className = "match-data-cell";
    if (bold) {
        tempCell.style.fontWeight = "bold";
    }
    if (blue) {
        tempCell.id = "blue-match-data-cell";
        return tempCell;
    }
    tempCell.id = "red-match-data-cell";
    return tempCell;
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
    for (let i = 0; i < 4; i++) {
        let op = document.createElement("option");
        if (i == 0) {
            op.text = i + 1 + " Value";
        } else if (i == 1) {
            op.text = i + 1 + " Values";
        } else if (i == 2) {
            op.text = "Consistency Matrix"
        } else if (i == 3) {
            op.text = "Consistency Line"
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

    // Column to look at
    var graphColumn = document.getElementById("graph-category-select").value;

    // Sorted column
    var sortedGraphColumn = JSON.parse(JSON.stringify(TEAM_COLUMNS));

    switch (graphMode) {
        case 1:
            document.getElementById("graph-category-select").style.display = "block";
            sortedGraphColumn = sortedGraphColumn[graphColumn].sort(function (a, b) { return a - b });

            // Sorted teams
            var teamsSorted = [];
            console.log(TEAM_ROWS)
            for (let i = 0; i < sortedGraphColumn.length; i++) {
                for (let t = 0; t < TEAM_ROWS.length; t++) {
                    if (TEAM_ROWS[t][graphColumn] == sortedGraphColumn[i] && !teamsSorted.includes(TEAM_ROWS[t][0])) {
                        teamsSorted.push(TEAM_ROWS[t][0]);
                        console.log(i);
                        break;
                    }
                }
            }
            showBarGraph(graphCanvas, sortedGraphColumn, teamsSorted, TEAM_FIELDS[graphColumn]);
            break;
        case 2:
            document.getElementById("graph-category-select-two").style.display = "block";
            document.getElementById("graph-category-select").style.display = "block";
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
            showScatterChart(graphCanvas, teamData2d, [TEAM_FIELDS[graphColumn], TEAM_FIELDS[secondGraphColumn]]);
            break;
        case 3:
            document.getElementById("graph-category-select").style.display = "none";
            document.getElementById("graph-category-select-team").style.display = "block";
            let tempData = [];
            let tempTeamRows = [];

            let selectedTeam = document.getElementById("graph-category-select-team").value;
            let matchesSorted = [];

            for (let i = 0; i < RECORDS.length; i++) {
                if (parseInt(RECORDS[i][0]) == parseInt(selectedTeam)) {
                    // Filters to only numerical data
                    let filteredRecord = [];
                    for (let f = 0; f < RECORDS[i].length; f++) {
                        if (detectCharacter(new String(RECORDS[i][f]).substring(0, 1)) == 1) {
                            filteredRecord.push(RECORDS[i][f]);
                        }
                    }
                    tempTeamRows.push(filteredRecord);
                    // TODO: CHANGE TO MATCH NUMBER COLUMN IN 2024
                    matchesSorted.push(RECORDS[i][2]);
                }
            }
            matchesSorted = matchesSorted.sort(function (a, b) { return a - b });

            let sortedTeamRows = [];

            for (let i = 0; i < matchesSorted.length; i++) {
                for (let c = 0; c < tempTeamRows.length; c++) {
                    // TODO: CHANGE TO MATCH NUMBER COLUMN IN 2024
                    if (tempTeamRows[c][1] == matchesSorted[i]) {
                        sortedTeamRows.push(tempTeamRows[c]);
                        tempTeamRows.splice(c, 1);
                        c--;
                        break;
                    }
                }
            }

            // FIXME fix this embarassing nonesense sad excuse of a function

            // Now remove match numbers
            // Spagetti code im tired :(
            for (let i = 0; i < sortedTeamRows.length; i++) {
                // FIXME guess what is it
                // It's what all the other ones say
                // TODO ChAnGe To MaTcH nUmBeR cOlUmN iN 2024 -_-
                sortedTeamRows[i].splice(0, 2);
            }

            let formattedData = [];
            let includedFields = JSON.parse(JSON.stringify(TEAM_FIELDS));

            // Remove team number field, not needed
            includedFields.splice(0, 1);

            // NOW sort every data element & check indicies
            let indicies = [];

            // Now make some columns
            let tempSortedColumns = [];
            for (let c = 0; c < sortedTeamRows[0].length; c++) {
                let tempArray = [];
                for (let i = 0; i < sortedTeamRows.length; i++) {
                    tempArray.push(sortedTeamRows[i][c]);
                }
                tempSortedColumns.push(tempArray);
            }

            for (let i = 0; i < tempSortedColumns.length; i++) {
                let tempSortedRow = tempSortedColumns[i].toSorted((a, b) => a - b);
                let tempIndicies = [];
                for (let c = 0; c < tempSortedColumns[i].length; c++) {
                    // Special case, don't divide by 0 & make it bright if it's the only one
                    if (tempSortedRow.length != 0 && tempSortedRow.length != 1) {
                        tempIndicies.push(tempSortedRow.indexOf(tempSortedColumns[i][c]) / (tempSortedRow.length - 1));
                    } else {
                        tempIndicies.push(1);
                    }
                }
                indicies.push(tempIndicies);
            }

            // NO WAY this disaster of a function actually works :0 now time to document & clean it up
            // But first mason needs sleep

            for (let i = 0; i < sortedTeamRows.length; i++) {
                for (let c = 0; c < sortedTeamRows[0].length; c++) {
                    formattedData.push({
                        x: matchesSorted[i],
                        y: includedFields[c],
                        v: sortedTeamRows[i][c],
                        index: indicies[c][i]
                    });
                }
            }

            // FIXME remove so many nested for-loops but at least most of them are O(1)

            console.log(sortedTeamRows);

            // FIXME
            // TODO Add in the color-coding, probably just sort each row & pass an array of indexes into function
            showMatrixGraph(graphCanvas, formattedData, matchesSorted, includedFields, "Description");
            break;
        case 4:
            let teamSelect = document.getElementById("graph-category-select-team");
            let valueSelect = document.getElementById("graph-category-select");

            valueSelect.style.display = "block";
            teamSelect.style.display = "block";

            let matches = [];
            let teamFields = [];

            for (let i = 0; i < RECORDS.length; i++) {
                if (parseInt(RECORDS[i][0]) == parseInt(teamSelect.value) && !matches.includes(RECORDS[i][2])) {
                    matches.push(parseInt(RECORDS[i][2]));
                    teamFields.push(RECORDS[i][FIELDS.indexOf(TEAM_FIELDS[parseInt(valueSelect.value)])]);
                }
            }

            showConsistencyLineGraph(graphCanvas, matches, teamFields, [teamSelect.value]);
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
        if (TEAM_FIELDS[i] == "Auto Piece Selection") {
            continue;
        }

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

    let currentTeam = parseInt(document.getElementById("team-breakdown-select").value);

    // All of current team's rows
    let tempTeamRows = [];
    for (let i = 0; i < RECORDS.length; i++) {
        if (parseInt(RECORDS[i][0]) == currentTeam) {
            tempTeamRows.push(RECORDS[i]);
        }
    }

    let tempPercentGraphContainer = document.createElement("div");
    tempPercentGraphContainer.id = "breakdown-percentages-container";

    // Team's matches, pickups
    let tempTeamMatches = [];
    let tempTeamAutoPickups = [];

    // Auto speaker
    let tempAutoSpeakerTotal = 0;
    let tempAutoSpeakerMade = 0;

    // Tele speaker
    let tempTeleSpeakerTotal = 0;
    let tempTeleSpeakerMade = 0;
    for (let i = 0; i < tempTeamRows.length; i++) {
        tempAutoSpeakerTotal += parseInt(tempTeamRows[i][8] + tempTeamRows[i][9]);
        tempAutoSpeakerMade += parseInt(tempTeamRows[i][8]);
        tempTeamMatches.push(parseInt(tempTeamRows[i][2]));
        tempTeamAutoPickups.push(tempTeamRows[i][14]);

        tempTeleSpeakerTotal += parseInt(tempTeamRows[i][16] + tempTeamRows[i][17]);
        tempTeleSpeakerMade += parseInt(tempTeamRows[i][16]);
    }
    tempPercentGraphContainer.appendChild(getBreakdownPercentPie("Auto Speaker", tempAutoSpeakerTotal, tempAutoSpeakerMade));
    tempPercentGraphContainer.appendChild(getBreakdownPercentPie("Tele Speaker", tempTeleSpeakerTotal, tempTeleSpeakerMade));

    let tempTrapTotal = 0;
    let tempTrapMade = 0;
    for (let i = 0; i < tempTeamRows.length; i++) {
        if (tempTeamRows[i][22] == "Successful") {
            tempTrapTotal++;
            tempTrapMade++;
        } else if (tempTeamRows[i][22] == "Failed") {
            tempTrapTotal++;
        }
    }
    tempPercentGraphContainer.appendChild(getBreakdownPercentPie("Trap", tempTrapTotal, tempTrapMade));

    let tempClimbTotal = 0;
    let tempClimbMade = 0;
    for (let i = 0; i < tempTeamRows.length; i++) {
        if (tempTeamRows[i][21] == "Successful") {
            tempClimbTotal++;
            tempClimbMade++;
        } else if (tempTeamRows[i][21] == "Failed") {
            tempClimbTotal++;
        }
    }
    tempPercentGraphContainer.appendChild(getBreakdownPercentPie("Climb", tempClimbTotal, tempClimbMade));

    tempFeedbackContainer.appendChild(tempPercentGraphContainer);

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

    let tempAutoFloorContainer = document.createElement("div");
    tempAutoFloorContainer.id = "breakdown-auto-floor-container";



    // Auto floor section, includes select & field top-down image
    let tempFloorContainer = document.createElement("div");
    tempFloorContainer.id = "auto-floor-container";

    // Background image & notes
    let tempFloorImageContainer = document.createElement("div");
    tempFloorImageContainer.id = "floor-image-container";
    tempFloorImageContainer.style.backgroundImage = `url(img/${tempTeamRows[0][1].substring(0, 1) == "B" ? "blue" : "red"}field24.jpg)`;

    // Add notes in, two containers, one with 3 & one with 5
    let upperNoteContainer = document.createElement("div");
    upperNoteContainer.className = "horizontal-note-container";
    tempFloorImageContainer.appendChild(upperNoteContainer);

    // Lower, 3 notes
    let lowerNoteContainer = document.createElement("div");
    lowerNoteContainer.className = "horizontal-note-container";
    lowerNoteContainer.style.width = "55%";
    lowerNoteContainer.style.marginLeft = "5%";
    tempFloorImageContainer.appendChild(lowerNoteContainer);

    let tempTempNotes = [];
    // Add notes to upper container
    for (let i = 0; i < 5; i++) {
        let tempNote = document.createElement("div");
        tempNote.className = "breakdown-floor-note";
        tempNote.id = i;

        upperNoteContainer.appendChild(tempNote);

        tempTempNotes.push(tempNote);
    }

    // If the field is red, alter styling to mirror
    if (tempTeamRows[0][1].substring(0, 1) == "R") {
        upperNoteContainer.style.scale = -1;
        lowerNoteContainer.style.scale = -1;
        lowerNoteContainer.style.marginLeft = "40%";
    }

    // Add notes to lower container
    for (let i = 0; i < 3; i++) {
        let tempNote = document.createElement("div");
        tempNote.className = "breakdown-floor-note";

        tempNote.id = i + 5;

        lowerNoteContainer.appendChild(tempNote);

        tempTempNotes.push(tempNote);
    }

    console.log(tempTeamAutoPickups);
    // Initial floor notes
    let initialAutoNotes = [];

    if (tempTeamAutoPickups[0] != null) {
        initialAutoNotes = String(tempTeamAutoPickups[0]).split(",");
    }

    for (let i = 0; i < initialAutoNotes.length; i++) {
        if (initialAutoNotes[i] == null) {
            break;
        }
        console.log(tempTempNotes);
        tempTempNotes[parseInt(initialAutoNotes[i]) % 8].style.backgroundColor = parseInt(initialAutoNotes[i]) > 7 ? "rgba(255, 0, 0, 0.4)" : "rgba(0, 255, 0, 0.4)";
    }

    // Create sidebar
    let tempAutoFloorSidebarContainer = document.createElement("div");
    tempAutoFloorSidebarContainer.id = "auto-floor-sidebar-container";

    // Sidebar select for match numbers
    let tempAutoFloorMatchSelect = document.createElement("select");
    tempAutoFloorMatchSelect.style.width = "20vh";
    for (let i = 0; i < tempTeamMatches.length; i++) {
        let tempOption = document.createElement("option");
        tempOption.value = [tempTeamRows[i][1].substring(0, 1), String(tempTeamAutoPickups[i])];
        tempOption.innerText = tempTeamMatches[i];
        tempAutoFloorMatchSelect.appendChild(tempOption);
    }

    tempAutoFloorMatchSelect.addEventListener("change", function () {
        let tempNoteLocations = document.getElementsByClassName("breakdown-floor-note");

        for (let i = 0; i < tempNoteLocations.length; i++) {
            tempNoteLocations[i].style.backgroundColor = "transparent";
        }

        let tempLocationsArray = this.value.split(',');
        console.log(tempLocationsArray);

        let alliance = tempLocationsArray.splice(0, 1);

        if (alliance == "R") {
            upperNoteContainer.style.scale = -1;
            lowerNoteContainer.style.scale = -1;
            lowerNoteContainer.style.marginLeft = "40%";
        } else {
            upperNoteContainer.style.scale = 1;
            lowerNoteContainer.style.scale = 1;
            lowerNoteContainer.style.marginLeft = "5%";
        }

        tempFloorImageContainer.style.backgroundImage = `url(img/${alliance == "B" ? "blue" : "red"}field24.jpg)`;

        for (let i = 0; i < tempLocationsArray.length; i++) {
            if (tempLocationsArray[i] == "null" || tempLocationsArray[i] == "undefined") {
                break;
            }
            tempNoteLocations[parseInt(tempLocationsArray[i]) % 8].style.backgroundColor = parseInt(tempLocationsArray[i]) > 7 ? "rgba(255, 0, 0, 0.4)" : "rgba(0, 255, 0, 0.4)";
        }
    });

    tempAutoFloorSidebarContainer.appendChild(tempAutoFloorMatchSelect);


    // Add sidebar, then floor image
    tempFloorContainer.appendChild(tempAutoFloorSidebarContainer);
    tempFloorContainer.appendChild(tempFloorImageContainer);



    let tempCommentContainer = document.createElement("div");
    tempCommentContainer.id = "breakdown-comment-container";
    tempCommentContainer.innerHTML = "<span style='text-decoration: underline; width: 100%; display: block'>Feedback & Videos:</span>";

    // Fetches matches for team, adds to comment section
    getTeamMatchesTBA(`https://www.thebluealliance.com/api/v3/team/frc${document.getElementById("team-breakdown-select").value}/event/${document.getElementById("event-select").value}/matches`);

    let speakerRanges = [];
    let intakeMethods = [];
    let trapCounter = 0;
    let climbSpeeds = [];

    //let commentText = "Comments: ";
    for (var i = 0; i < tempTeamRows.length; i++) {
        let tempComment = document.createElement("h1");
        tempComment.className = "breakdown-comment";
        tempComment.innerHTML = `<span style='color: rgb(255, 221, 109)'>Qual ${tempTeamRows[i][2]}:</span> ${tempTeamRows[i][7]}`;
        tempCommentContainer.appendChild(tempComment);

        speakerRanges.push(tempTeamRows[i][26]);
        intakeMethods.push(tempTeamRows[i][27]);

        if (tempTeamRows[i][24] != "N/A") {
            climbSpeeds.push(tempTeamRows[i][24]);
        }

        if (tempTeamRows[i][22] == "Successful") {
            trapCounter++;
        }
    }

    let teamFeatureContainer = document.createElement("div");
    teamFeatureContainer.id = "team-feature-container";

    let tempRange = document.createElement("h1");
    tempRange.className = "team-feature";
    tempRange.innerHTML = `Speaker range: <span style='font-weight: bold; font-size: 3vh; margin-left: 1vh; color: #ffa552'>${mode(speakerRanges)}</span>`;
    teamFeatureContainer.appendChild(tempRange);

    let tempIntake = document.createElement("h1");
    tempIntake.className = "team-feature";
    tempIntake.innerHTML = `Intake method: <span style='font-weight: bold; font-size: 3vh; margin-left: 1vh; color: #ffa552'>${mode(intakeMethods)}</span>`;
    teamFeatureContainer.appendChild(tempIntake);

    let tempTrap = document.createElement("h1");
    tempTrap.className = "team-feature";
    tempTrap.innerHTML = `Trapped: <span style='font-weight: bold; font-size: 3vh; margin-left: 1vh; color: #ffa552'>${trapCounter == 0 ? "No" : `${trapCounter} Traps`}</span>`;
    teamFeatureContainer.appendChild(tempTrap);

    let tempClimbSpeed = document.createElement("h1");
    tempClimbSpeed.className = "team-feature";
    tempClimbSpeed.innerHTML = `Climb speed: <span style='font-weight: bold; font-size: 3vh; margin-left: 1vh; color: #ffa552'>${mode(climbSpeeds) == null ? "Didn't climb" : mode(climbSpeeds)}</span>`;
    teamFeatureContainer.appendChild(tempClimbSpeed);

    tempCommentContainer.insertBefore(teamFeatureContainer, tempCommentContainer.children[1]);

    tempAutoFloorContainer.appendChild(tempAutoContainer);
    tempAutoFloorContainer.appendChild(tempFloorContainer);

    tempFeedbackContainer.appendChild(tempAutoFloorContainer);
    tempFeedbackContainer.appendChild(tempCommentContainer);

    // Array of all team auto types
    let team_auto_types = [];
    // Array of number of auto successes, corresponds with team_auto_types
    let team_auto_success = [];

    for (let g = 0; g < RECORDS.length; g++) {
        if (RECORDS[g][TEAM_INDEX] == document.getElementById("team-breakdown-select").value) {
            let tempAuto = "A";
            // Auto speaker made & missed
            tempAuto += RECORDS[g][8] + RECORDS[g][9];

            // Auto amp made & missed
            tempAuto += RECORDS[g][11] + RECORDS[g][12];

            if (RECORDS[g][13] == "Yes") {
                tempAuto += "M";
            }

            console.log(tempAuto);

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

    //console.log(sortedRows);

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
        if (direction % 3 == 1) {
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
        if (direction % 3 == 1) {
            sortedColumn = sortedColumn[colNum].sort(function (a, b) { return a - b });
        } else if (direction % 3 == 0) {
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

            if (highlightTeamData) {
                let columnCopy = JSON.parse(JSON.stringify(TEAM_COLUMNS));
                for (let c = 0; c < TEAM_COLUMNS.length - 1; c++) {
                    let cols = document.getElementsByClassName("column")[c];

                    let filteredColumn = [...new Set(columnCopy[c].sort((a, b) => a - b))];
                    //console.log(filteredColumn);
                    for (let i = 0; i < TEAM_COLUMNS[c].length; i++) {
                        let color = filteredColumn.indexOf(parseFloat(cols.children[i + 1].innerText)) / (filteredColumn.length - 1);
                        cols.children[i + 1].style.boxShadow = `0px 0px 0px 100vh inset rgba(${(1 - color) * 255}, ${color * 255}, 0, ${Math.pow(Math.abs(color - 0.5) * 1.85, 2)})`;
                    }
                }
            }
        }

    } else {
        // Uh oh it's not a number :(
        console.error("Sad");
    }
}

function detectCharacter(val) {
    //console.log(val);
    return (val == "0" || val == "1" || val == "2" || val == "3" || val == "4" || val == "5" || val == "6" || val == "7" || val == "8" || val == "9") ? 1 : 0;
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
        //tl.to("#team-breakdown-select", { left: "0vh", duration: 0.5, ease: "power2" });
        tl.to(openSidebarButton, { scale: "1 1", duration: 0.5, ease: "power2" }, "-=0.5");
    } else {
        tl.to(sidebar, { left: "-27vh", duration: 0.5, ease: "power2" });
        //tl.to("#team-breakdown-select", { left: "34vh", duration: 0.5, ease: "power2" });
        tl.to(openSidebarButton, { scale: "-1 1", duration: 0.5, ease: "power2" }, "-=0.5");
    }
}

function refreshData() {
    rawTable.innerHTML = "";
    getData();
}

async function setUpPickList() {
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

        if (TEAM_ROWS[TEAMS.indexOf(PICK_LIST_OBJECTS[i].getTeam())][12] < 65) {
            let tempWarning = document.createElement("div");
            tempWarning.className = "warning-container";
            let tempWarningText = document.createElement("div");
            tempWarningText.className = "warning-popup";
            tempWarning.appendChild(tempWarningText);
            tempWarning.style.backgroundImage = "url('svg/target-bad.svg')";
            tempWarningText.innerText = "Tele Speaker Accuracy " + TEAM_ROWS[TEAMS.indexOf(PICK_LIST_OBJECTS[i].getTeam())][12] + "%";
            tempTeam.appendChild(tempWarning);
        }

        if (TEAM_ROWS[TEAMS.indexOf(PICK_LIST_OBJECTS[i].getTeam())][12] > 80) {
            let tempWarning = document.createElement("div");
            tempWarning.className = "warning-container";
            let tempWarningText = document.createElement("div");
            tempWarningText.className = "warning-popup";
            tempWarning.appendChild(tempWarningText);
            tempWarning.style.backgroundImage = "url('svg/target-good.svg')";
            tempWarningText.innerText = "Tele Speaker Accuracy " + TEAM_ROWS[TEAMS.indexOf(PICK_LIST_OBJECTS[i].getTeam())][12] + "%";
            tempTeam.appendChild(tempWarning);
        }

        if (TEAMS_FLIPPED.includes(PICK_LIST_OBJECTS[i].getTeam())) {
            let tempWarning = document.createElement("div");
            tempWarning.className = "warning-container";
            let tempWarningText = document.createElement("div");
            tempWarningText.className = "warning-popup";
            tempWarning.appendChild(tempWarningText);
            tempWarning.style.backgroundImage = "url('svg/too-tall.svg')";
            let counter = 0;
            for (let x = 0; x < TEAMS_FLIPPED.length; x++) {
                if (TEAMS_FLIPPED[x] == PICK_LIST_OBJECTS[i].getTeam()) {
                    counter++;
                }
            }
            tempWarningText.innerText = "Too tall to go under stage";
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

        let tempEndgamePoints = document.createElement("div");
        tempEndgamePoints.innerText = TEAM_ROWS[TEAM_COLUMNS[0].indexOf(PICK_LIST_OBJECTS[i].getTeam())][3];
        tempEndgamePoints.className = "pick-list-team-stat";
        tempTeam.appendChild(tempEndgamePoints);

        let tempTotalPoints = document.createElement("div");
        tempTotalPoints.innerText = TEAM_ROWS[TEAM_COLUMNS[0].indexOf(PICK_LIST_OBJECTS[i].getTeam())][4];
        tempTotalPoints.className = "pick-list-team-stat";
        tempTeam.appendChild(tempTotalPoints);

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

    await sleep(250);

    let userInterval = parseInt(document.getElementById("auto-download-input").value) * 1000;

    if (!intervalID) {
        intervalID = setInterval(dowlocalStoragePickListnloadPickList, 10000);
        console.log("Set interval");
    }
}

function localStoragePickList() {

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

function recoverPickList() {
    console.log(localStorage.getItem("pick-list-backup"));
    let fileText = JSON.parse(JSON.stringify(localStorage.getItem("pick-list-backup").split(",")));
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
        if (((detectCharacter(dataType) == 1) || (FIELDS[i] == "Tele Speaker %" || FIELDS[i] == "Auto Speaker %")) && FIELDS[i] != "Match Number" && FIELDS[i] != "Auto Piece Selection") {
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

    let tempCols = document.getElementsByClassName("column");

    // Iterates through every team (basically makes each row)
    for (let i = 0; i < TEAMS.length; i++) {
        TEAM_ROWS[i] = new Array();

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

        let autoSpeakerTotal = 0;
        let teleSpeakerTotal = 0;

        let autoSpeakerTotalMade = 0;
        let teleSpeakerTotalMade = 0;

        for (let q = 0; q < RECORDS.length; q++) {
            // Find all comments for current team, add to variable
            if (RECORDS[q][TEAM_INDEX] == TEAMS[i]) {
                tempComment += "Q" + RECORDS[q][2] + ":   " + RECORDS[q][FIELDS.indexOf("Comments")] + "\n\n";

                // Adds to auto & tele speaker totals, for percents
                autoSpeakerTotal += parseInt(RECORDS[q][8]) + parseInt(RECORDS[q][9]);
                autoSpeakerTotalMade += parseInt(RECORDS[q][8]);
                teleSpeakerTotal += parseInt(RECORDS[q][16]) + parseInt(RECORDS[q][17]);
                teleSpeakerTotalMade += parseInt(RECORDS[q][16]);
            }
        }

        if (autoSpeakerTotal == 0) {
            autoSpeakerTotal = 1;
        }

        if (teleSpeakerTotal == 0) {
            teleSpeakerTotal = 1;
        }

        TEAM_ROWS[i][7] = Math.round(autoSpeakerTotalMade / autoSpeakerTotal * 1000) / 10;
        TEAM_ROWS[i][12] = Math.round(teleSpeakerTotalMade / teleSpeakerTotal * 1000) / 10;

        TEAM_COLUMNS[7][i] = Math.round(autoSpeakerTotalMade / autoSpeakerTotal * 1000) / 10;
        TEAM_COLUMNS[12][i] = Math.round(teleSpeakerTotalMade / teleSpeakerTotal * 1000) / 10;

        console.log(dataToKeep.length);

        tempCols[7].children[i + 1].innerText = TEAM_COLUMNS[7][i];
        tempCols[12].children[i + 1].innerText = TEAM_COLUMNS[12][i];

        // Add comment text to correct position
        TEAM_ROWS[i].push(tempComment);
        TEAM_COLUMNS[dataToKeep.length].push(tempComment);
    }

    if (highlightTeamData) {
        let columnCopy = JSON.parse(JSON.stringify(TEAM_COLUMNS));
        for (let c = 0; c < TEAM_COLUMNS.length - 1; c++) {
            let cols = document.getElementsByClassName("column")[c];

            let filteredColumn = [...new Set(columnCopy[c].sort((a, b) => a - b))];
            console.log(filteredColumn);
            for (let i = 0; i < TEAM_COLUMNS[c].length; i++) {
                let color = filteredColumn.indexOf(TEAM_COLUMNS[c][i]) / (filteredColumn.length - 1);
                cols.children[i + 1].style.boxShadow = `0px 0px 0px 100vh inset rgba(${(1 - color) * 255}, ${color * 255}, 0, ${Math.pow(Math.abs(color - 0.5) * 1.85, 2)})`;
            }
        }
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
    //console.log(TEAMS);
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
                tempMatchText.text = json[i].comp_level.toUpperCase() + " " + json[i].match_number;
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
            //console.log(json.length);
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

// Sleep command for functions
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function setUpCategories() {
    getTeamData();

    let categoryContainer = document.createElement("div");
    categoryContainer.id = "category-container";

    rawTable.innerHTML = "";

    let tempTeamSelect = document.createElement("select");
    tempTeamSelect.className = "compare-team-select";
    tempTeamSelect.id = "category-team-select";

    let anyOption = document.createElement("option");
    anyOption.value = "Any";
    anyOption.innerText = "Any";
    tempTeamSelect.appendChild(anyOption);

    let tempSelectContainer = document.createElement("div");

    for (let t = 0; t < TEAMS.length; t++) {
        let tempOption = document.createElement("option");
        tempOption.value = String(TEAMS[t]);
        tempOption.innerText = TEAMS[t];
        tempTeamSelect.appendChild(tempOption);
    }
    tempTeamSelect.value = "Any";
    tempSelectContainer.appendChild(tempTeamSelect);



    let tempCategorySelect = document.createElement("select");
    tempCategorySelect.className = "compare-team-select";
    tempCategorySelect.id = "category-category-select";

    tempTeamSelect.addEventListener('change', runCategories);
    tempCategorySelect.addEventListener('change', runCategories);

    console.log(TEAM_FIELDS)

    for (let t = 1; t < TEAM_FIELDS.length; t++) {
        let tempOption = document.createElement("option");
        tempOption.value = String(t);
        tempOption.innerText = TEAM_FIELDS[t];
        tempCategorySelect.appendChild(tempOption);
    }
    tempSelectContainer.appendChild(tempCategorySelect);

    categoryContainer.appendChild(tempSelectContainer);
    rawTable.appendChild(categoryContainer);

    if (localStorage.getItem("category") != null) {
        tempCategorySelect.value = localStorage.getItem("category");
    }

    runCategories();
}

function runCategories() {
    let categoryContainer = document.getElementById("category-container");

    if (categoryContainer.children.length > 1) {
        for (let i = 0; i < 1; i++) {
            categoryContainer.removeChild(categoryContainer.lastChild);
        }
    }

    let columnNumber = parseInt(document.getElementById("category-category-select").value);

    localStorage.setItem("category", document.getElementById("category-category-select").value);

    let tempColumns = [];
    for (let i = 0; i < 3; i++) {
        let tempColumn = document.createElement("div");
        tempColumn.className = "column";
        tempColumn.style.marginRight = "2.5vh";
        tempColumns.push(tempColumn);
    }

    let valuesSorted = JSON.parse(JSON.stringify(TEAM_COLUMNS[columnNumber]));
    valuesSorted = valuesSorted.sort(function (a, b) { return b - a });

    let teams = [];

    let tempTeamColumn = JSON.parse(JSON.stringify(TEAM_COLUMNS[columnNumber]));
    let tempTeams = JSON.parse(JSON.stringify(TEAMS));

    for (let i = 0; i < TEAMS.length; i++) {
        let index = tempTeamColumn.indexOf(valuesSorted[i]);
        teams.push(tempTeams[index]);

        tempTeamColumn.splice(index, 1);
        tempTeams.splice(index, 1);
    }

    let tableContainer = document.createElement("div");
    tableContainer.id = "category-table-container";

    for (let i = 0; i < TEAM_COLUMNS[columnNumber].length; i++) {
        let tempPlace = document.createElement("div");
        tempPlace.innerText = i + 1;
        tempPlace.className = "category-data-value";
        tempColumns[0].appendChild(tempPlace);

        let tempTeam = document.createElement("div");
        tempTeam.innerText = teams[i];
        tempTeam.className = "category-data-value";
        tempColumns[1].appendChild(tempTeam);

        let tempValue = document.createElement("div");
        tempValue.innerText = valuesSorted[i];
        tempValue.className = "category-data-value";
        tempColumns[2].appendChild(tempValue);

        if (i % 3 == 1) {
            tempPlace.style.backgroundColor = "#302f2b";
            tempTeam.style.backgroundColor = "#302f2b";
            tempValue.style.backgroundColor = "#302f2b";
        }
    }

    for (let c = 0; c < tempColumns.length; c++) {
        tableContainer.appendChild(tempColumns[c]);
    }

    categoryContainer.appendChild(tableContainer);

    highlightCategory();
}

function highlightCategory() {
    let targetTeam = document.getElementById("category-team-select").value;

    if (targetTeam == "Any") {
        return;
    }
    targetTeam = parseInt(targetTeam);

    let columns = document.getElementsByClassName("column");
    console.log(columns[0]);

    for (let i = 0; i < columns[0].children.length; i++) {
        //console.log(columns[1][i]);
        if (parseInt(columns[1].children[i].innerText) == targetTeam) {
            columns[0].children[i].style.backgroundColor = "rgb(189, 95, 33)";
            columns[1].children[i].style.backgroundColor = "rgb(189, 95, 33)";
            columns[2].children[i].style.backgroundColor = "rgb(189, 95, 33)";
            return;
        }
    }
}

function dowlocalStoragePickListnloadPickList() {
    localStorage.setItem("pick-list-backup", JSON.parse(JSON.stringify(PICK_LIST_TEAM_KEY)));
}