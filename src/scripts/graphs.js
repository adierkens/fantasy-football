
var graphData = {
    data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10", "Week 11", "Week 12", "Week 13"],
        datasets: [

        ],
        legendTemplate : '<table>'
        +'<% for (var i=0; i<datasets.length; i++) { %>'
        +'<tr><td><div class=\"boxx\" style=\"background-color:<%=datasets[i].fillColor %>\"></div></td>'
        +'<% if (datasets[i].label) { %><td><%= datasets[i].label %></td><% } %></tr><tr height="5"></tr>'
        +'<% } %>'
        +'</table>',
        multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>"
    },
    selectedPosition: 'QB'
};

var playerIDToObjMap = {};

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
            placeholder: 'All Teams',
            disabled: false,
            allowClear: true
        });
    });

    $('#player-type-team-select').select2({
        disabled: true,
        placeholder: 'All Teams',
        allowClear: true,
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

            _.each(players, function(p) {
                if (!playerIDToObjMap[p._id]) {
                    playerIDToObjMap[p._id] = p;
                }
            });

            playerSelection.select2({
                disabled: false,
                placeholder: 'All Players',
                allowClear: true,
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
        allowClear: true,
        placeholder: 'Select Player'
    }).on('change', function() {

    });

    graphData.ctx = document.getElementById("testChart").getContext("2d");
    graphData.chart = new Chart(graphData.ctx).Line({
        labels: graphData.data.labels,
        data: [
            {
                label: "Temp",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [0]
            }
        ]
    }, {
        responsive: false
    });
    graphData.chart.datasets.pop();
    graphData.chart.update();
}

function getTitleForStatFilter(filter) {

    var playerName = 'All ' + filter.player.position + 's';
    var teamName = 'All Teams';

    if (filter.player._id) {
        playerName = playerIDToObjMap[filter.player._id].firstName + ' ' + playerIDToObjMap[filter.player._id].lastName;
    }

    var rtnStr = filter.fields.label + " for " + playerName;

    if (!filter.player._id) {
        if (filter.player.team) {
            teamName = filter.player.team;
        }
        rtnStr += ' on ' + teamName;
    }

    return rtnStr;
}

function addDataSetToGraph(dataSet) {
    dataSets = graphData.data.datasets.push(dataSet);

    graphData.chart = new Chart(graphData.ctx).Line(graphData.data, {
        responsive: false
    });

    document.getElementById("legendDiv").innerHTML = graphData.chart.generateLegend();
}

function getRandomGraphColors() {
    return {
        strokeColor: "rgba(151,187,205,1)",
        pointColor: randomColor(),
        pointStrokeColor: randomColor(),
        fillColor: "rgba(220,220,220,0.2)"
    }
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

    statFilter.fields = statsPerPosition[graphData.selectedPosition][$('#player-type-stat-select').val()]

    getStatsForFilter(statFilter, function(weeks) {
        console.log(weeks);

        // Turn this into the thing we're actually gonna graph

        var weekData = [];

        for (var week=1; week<16; week++) {

            var statLabel = weeks.filter.fields.label;
            var statObj = _.pick(weeks.weeks[week], weeks.filter.fields.fields);
            var statSum = _.reduce(Object.values(statObj), function(sum, n) {
                return sum + n;
            }, 0);

            weekData.push(statSum);
        }

        var dataSet = {
            label: getTitleForStatFilter(weeks.filter),
            data: weekData
        };

        addDataSetToGraph(_.defaults(dataSet, getRandomGraphColors()));

    });
}