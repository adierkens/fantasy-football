
var graphData = {
    data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10", "Week 11"],
        datasets: [],
        multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>"
    },
    selectedPosition: 'QB',
    savedGraphs: [],
    statFilters: []
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

function populateSelect() {

    $('#load-graph-select').select2({
        placeholder: 'Select a saved graph',
        disabled: true
    });

    fetchSavedGraphs(function (savedGraphs) {
        graphData.savedGraphs = savedGraphs;

        console.log(savedGraphs);

        _.each(savedGraphs, function(savedGraph) {
           _.each(savedGraph.statFilters, function(filter) {
               var player = filter.player;
               if (player._id && !playerIDToObjMap[player._id]) {
                   getPlayersForTeam({
                       _id: player._id
                   }, function(data) {
                       var player = data[0];
                        playerIDToObjMap[player._id] = player;
                   });
               }
           });
        });

        var loadGraphSelect = $('#load-graph-select');

        var data = _.map(graphData.savedGraphs, function(savedGraph) {
            return {
                id: graphData.savedGraphs.indexOf(savedGraph),
                text: savedGraph._id
            }
        });

        loadGraphSelect.empty();
        loadGraphSelect.append('<option></option>');
        loadGraphSelect.select2({
            placeholder: 'Select a saved graph',
            disabled: false,
            data: data
        });
    });
}

function initGraph() {
    populateSelect();

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
        placeholder: 'All Players'
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

function deleteDataSetFromGraph(index) {
    graphData.data.datasets.splice(index, 1);
    graphData.statFilters.splice(index, 1);
    
    if (graphData.data.datasets.length === 0) {
        clearGraph();
    } else {
        graphData.chart = new Chart(graphData.ctx).Line(graphData.data, {
            responsive: false
        });
        updateLegend();
    }
}

function updateLegend() {
    $('#legendDiv').empty();
    legend(document.getElementById('legendDiv'), graphData.data);

    $('.legend .title .glyphicon-remove').hide();

    $('.legend .title').mouseenter(function() {
        $(this).children('.glyphicon-remove').show().on('click', function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.stopImmediatePropagation();
            deleteDataSetFromGraph($(this).parent().index());
        });
    }).mouseleave(function() {
        $(this).children('.glyphicon-remove').hide();
    });
}

function addDataSetToGraph(dataSet) {
    dataSets = graphData.data.datasets.push(dataSet);

    graphData.chart = new Chart(graphData.ctx).Line(graphData.data, {
        responsive: false
    });

    updateLegend();

}

function getRandomGraphColors() {
    var randColor = randomColor();
    return {
        strokeColor: randColor,
        pointColor: randColor,
        pointStrokeColor: "black",
        fillColor: "rgba(220,220,220,0.2)",
    }
}


function addStatFilterToGraph(statFilter) {
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
            data: weekData,
            statFilter: statFilter
        };

        addDataSetToGraph(_.defaults(dataSet, getRandomGraphColors()));
        graphData.statFilters.push(statFilter);
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

    statFilter.fields = statsPerPosition[graphData.selectedPosition][$('#player-type-stat-select').val()];

    addStatFilterToGraph(statFilter);
}

function getClientID() {
    return leagueId + '-' + teamId;
}

function fetchSavedGraphs(callback) {

    var fetObj = {
        operation: 'GET',
        userID: getClientID()
    };

    $.ajax(herokuAppURL + 'userSave', {
        contentType: 'application/json',
        success: function(data) {
            console.log(data);
            if (data.status === 'success') {
                callback(data.data);
            }
        },
        dataType: 'json',
        method: 'POST',
        data: JSON.stringify(fetObj)
    });

}

function saveGraph(label) {
    var clientID = getClientID();

    var saveGameObj = {
        operation: 'ADD',
        savedGraph: {
            userID: clientID,
            _id: label,
            statFilters: graphData.statFilters
        }
    };

    $.ajax(herokuAppURL + 'userSave', {
        contentType: 'application/json',
        success: function() {
            setTimeout(function() {
                populateSelect();
            }, 500);

            $('#saved-message').show();
            setTimeout(function() {
                $('#saved-message').hide();
            }, 1000);
        },
        dataType: 'json',
        method: 'POST',
        data: JSON.stringify(saveGameObj)
    });

    graphData.savedGraphs.push(saveGameObj.savedGraph);

}

function delGraph(graphID) {

    var delGameObj = {
        operation: 'DELETE',
        savedGraphID: graphID
    };

    $.ajax(herokuAppURL + 'userSave', {
        contentType: 'application/json',
        success: function(data) {
            console.log('Del callback');
            populateSelect();
        },
        dataType: 'json',
        method: 'POST',
        data: JSON.stringify(delGameObj)
    });

}

function getSelectedGraphLabel() {
    var loadGraphSelect = $('#load-graph-select');
    return graphData.savedGraphs[loadGraphSelect.val()]._id;
}

function saveButtonClicked() {
    var saveGraphLabel = $('#savedGraphName');
    saveGraph(saveGraphLabel.val());
}

function clearGraph() {
    $('#legendDiv').empty();
    $('.chart-wrapper').empty();
    $('.chart-wrapper').append('<canvas id="testChart">');
    graphData.ctx = document.getElementById('testChart').getContext('2d');
    graphData.data.datasets = [];
}

function loadButtonClicked() {
    var saveGraphLabel = $('#savedGraphName');
    saveGraphLabel.val(getSelectedGraphLabel());
    var loadGraphSelect = $('#load-graph-select');
    clearGraph();
    var statFilters = graphData.savedGraphs[loadGraphSelect.val()].statFilters;
    _.each(statFilters, function(statFilter) {
        addStatFilterToGraph(statFilter);
    });

}

function delButtonClicked() {
    delGraph(getSelectedGraphLabel());
}
