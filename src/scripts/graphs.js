
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

var graphData = {
};

function initGraph() {

    var data = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: "My Second dataset",
                fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,0.8)",
                highlightFill: "rgba(151,187,205,0.75)",
                highlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };

    

    var myBarChart = new Chart(document.getElementById("testChart").getContext("2d")).Bar(data, {});

}

function createEmptyGraph() {



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
