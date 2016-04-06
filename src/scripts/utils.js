
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
                console.log(data.data);
                 callback(data.data[0].number);
            }
        },
        dataType: 'json',
        method: 'POST',
        data: JSON.stringify(searchObj)
    });

}