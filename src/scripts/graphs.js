
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
    data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10", "Week 11", "Week 12", "Week 13", "Week 14", "Week 15"],
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [0]
            }
        ]
    }
};

function initGraph() {

    $('#player-type-selection').children().children().on('click', function() {
        $(this).parent().parent().children().removeClass('active');
        $(this).parent().addClass('active');
        positionSelectionChanged($(this).text());
    });

    $('#ifr').ready(function(){
        console.log(this);
    });

    $('#player-type-team-select').select2({
        disabled: true,
        placeholder: 'Select Team'
    });

    $('#player-type-player-select').select2({
        disabled: true,
        placeholder: 'Select Player'
    });

    var ctx = document.getElementById("testChart").getContext("2d");
    graphData.chart = new Chart(ctx).Line(graphData.data, {
        responsive: true
    });
}

function positionSelectionChanged(newPosition) {
    console.log(newPosition);
}


function redrawGraph() {
    graphData.chart.update();
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
