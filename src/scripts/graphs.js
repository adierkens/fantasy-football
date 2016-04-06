
const stats = {
    points: 'Points',
    pass_completions: 'Pass Completions',
    pass_touchdowns: 'Pass Touchdowns',
    interceptions: 'Interceptions',
    rush_yards: 'Rushing Yards',
    rush_touchdowns: 'Rushing Touchdowns',
    receptions: 'Receptions',
    reception_touchdowns: 'Receiving Touchdowns',
    reception_yards: 'Receiving Yards',
    touchdowns: 'Touchdowns'
};

const statsPerPosition = {
    'QB': [
        stats.points,
        stats.pass_completions,
        stats.pass_touchdowns,
        stats.interceptions
    ],
    'RB': [
        stats.points,
        stats.rush_yards,
        stats.rush_touchdowns,
        stats.receptions,
        stats.reception_touchdowns
    ],
    'WR': [
        stats.points,
        stats.receptions,
        stats.reception_touchdowns,
        stats.reception_yards
    ],
    'TE': [
        stats.points,
        stats.receptions,
        stats.reception_touchdowns,
        stats.reception_yards
    ],
    'K': []
};

var graphData = {};

function initGraph() {
    google.charts.load('current', {'packages':['line']});
    google.charts.setOnLoadCallback(createEmptyGraph);
}

function createEmptyGraph() {
    graphData.dataTable = new google.visualization.DataTable();

}


function nameFromPlayerFilter(filter, callback) {

    // Stats are for a specific person
    if (filter._id || filter.playerNumber) {
        getNameForPlayer(filter, callback);
        return;
    }

    var name = "All players";

    if (filter.position) {
        name = filter.position;
    }

    name += " on ";

    if (filter.team) {
        name += filter.team;
    } else {
        name += " all teams";
    }

    callback(name);

}

function getStatsData(filter, callback) {

    $.ajax(herokuAppURL + 'player', {
        contentType: 'application/json',
        success: function(data) {
            if (data.status === 'success') {
                console.log(data.data);
                callback(data.data);
            }
        },
        dataType: 'json',
        method: 'POST',
        data: JSON.stringify({ filter: filter })
    });
}

function addDataToGraph(graphObj) {

    getStatsData(graphObj.filter, function(weeklyStats) {

    });

}
