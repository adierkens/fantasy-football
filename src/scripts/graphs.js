
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
    },
    selectedPosition: 'QB'
};

var playerTeamSelectData = _.map(Object.values(teamAliasMapping), function(obj) {
   return {
       id: parseInt(obj.id, 10),
       text: obj.alias
   }
});

function getSelectionDataForPosition(position) {
    var positionStatOptions = statsPerPosition[position];
    var rtnData = [];

    for (var i=0; i<positionStatOptions.length; i++) {
        var stObj = positionStatOptions[i];
        rtnData.push({
            id: i,
            text: stObj.label
        });
    }

    return rtnData;
}

function initGraph() {

    $('#player-type-selection').children().children().on('click', function() {
        $(this).parent().parent().children().removeClass('active');
        $(this).parent().addClass('active');
        graphData.selectedPosition = $(this).text();

        var statSelection = $('#player-type-stat-select');
        statSelection.empty();
        statSelection.append('<option></option>');

        statSelection.select2({
            disabled: false,
            placeholder: 'Select a Stat to Graph',
            data: getSelectionDataForPosition(graphData.selectedPosition)
        });

    });

    $('#player-type-stat-select').select2({
        placeholder: 'Select a Stat to Graph',
        data: getSelectionDataForPosition('QB')
    }).on('change', function() {
        $('#player-type-team-select').select2({
            disabled: false
        });
    });

    $('#player-type-team-select').select2({
        disabled: true,
        placeholder: 'All Teams',
        data: playerTeamSelectData
    }).on('change', function() {
        var selectedTeamId = $(this).val();
        var selectedTeam = proTeamIdMap[selectedTeamId];
        console.log('Selected team ' + selectedTeam);

        getPlayersForTeam({
            team: selectedTeam,
            position: graphData.selectedPosition
        }, function(players) {

            var playerSelection = $('#player-type-player-select');
            playerSelection.empty();
            playerSelection.append('<option></option>');

            playerSelection.select2({
                disabled: false,
                placeholder: 'All Players',
                data: _.map(players, function(player) {
                    return {
                        id: player.number,
                        text: player.firstName + " " + player.lastName + " - #" + player.number
                    };
                })
            });
        });
    });

    $('#player-type-player-select').select2({
        disabled: true,
        placeholder: 'Select Player'
    }).on('change', function() {

    });

    var ctx = document.getElementById("testChart").getContext("2d");
    graphData.chart = new Chart(ctx).Line(graphData.data, {
        responsive: true
    });
}

function addToGraph() {

    // create the filter

    var statFilter = {
        player: {
            position: graphData.selectedPosition
        }
    };

    var playerSelect = $('#player-type-player-select');
    var teamSelect = $('#player-type-team-select');

    if (teamSelect.val()) {
        var selectedTeamId = teamSelect.val();
        var selectedTeam = proTeamIdMap[selectedTeamId];
        statFilter.player.team = selectedTeam;

        if (playerSelect.val()) {
            var selectedPlayerNumber = playerSelect.val();
            var selectedPlayer = selectedTeam + selectedPlayerNumber;
            statFilter.player._id = selectedPlayer;
        }
    }

    statFiler.fields = statsPerPosition[graphData.selectedPosition][$('#player-type-stat-select').val()]

    getStatsForFilter(statFilter, function(weeks) {
        console.log(weeks);




    });
}