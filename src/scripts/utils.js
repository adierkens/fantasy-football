
function getNumberForPlayer(lastName, position, team, callback) {
    var searchObj = {
        position: position,
        lastName: lastName,
        team: team
    };

    $.ajax(herokuAppURL + 'player', {
        contentType: 'application/json',
        success: function(data) {
            if (data.status === 'success') {
                callback(data.data[0].number);
            }
        },
        dataType: 'json',
        method: 'POST',
        data: JSON.stringify(searchObj)
    });

}

function getPlayersForTeam(searchObj, callback) {

    $.ajax(herokuAppURL + 'player', {
        contentType: 'application/json',
        success: function(data) {
            console.log(data);
            if (data.status === 'success') {
                callback(data.data);
            }
        },
        dataType: 'json',
        method: 'POST',
        data: JSON.stringify(searchObj)
    });

}

function getStatsForFilter(filter, callback) {

    filter = {
        filter: filter
    };

    $.ajax(herokuAppURL + 'stat', {
        contentType: 'application/json',
        success: function(data) {
            console.log(data);
            if (data.status === 'success') {
                callback(data.data);
            } else {
                console.log(data);
            }
        },
        dataType: 'json',
        method: 'POST',
        data: JSON.stringify(filter)
    });
}