
function loadTemplate(templateName, obj) {
    var templateScript = document.getElementById(templateName).innerHTML;
    var template = Handlebars.compile(templateScript);
    return template(obj);
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var savedData = {};


function init() {
    window.hash = window.hash || '#MyTeam';

    if (window.hash != "#MyTeam") {
        $(".menu").find("li[data-target=" + window.hash + "]").trigger('click');
    }

    $(window).on("resize", function() {
        $(".main, .menu").height($(window).height() - $(".header-panel").outerHeight());
        $('.pages').height($(window).height());
    }).trigger("resize");

    $(".menu li").on('click', function() {
        if (!$(this).data("target")) return;
        if ($(this).is(".active")) return;

        window.hash = $(this).data("target");

        $(".menu li").not($(this)).removeClass("active");
        $(".page").not($(window.hash)).removeClass("active").hide();
        $(this).addClass('active');

        $(window.hash).show();
        var page = $(window.hash);
        $(window.hash).addClass('active');

        if (window.hash == '#Graphs') {
            initGraph();
        }

    });
}

const regexes = {
    acqusitions: /Acquisitions: (\d+)/,
    trades: /Trades: (\d+)/,
    waiver: /(\d+) of (\d+)/
};

function saveData() {
    savedData.teamImg = $('.games-univ-mod1 img')[0].src;
    savedData.teamName = $('.team-name').html().split('<')[0].trim();

    var count = 0;
    $('.games-btm-area li').each(function() {
        var text = $(this).text();

        if (count == 0) {
            // Acqusitions
            var match = text.match(regexes.acqusitions)[1];
            match = parseInt(match, 10);
            savedData.acqusitions = match;
        } else if (count === 1) {
            // Trades
            var match = text.match(regexes.trades)[1];
            match = parseInt(match, 10);
            savedData.trades = match;
        } else if (count === 2) {
            // Waiver Order
            var match = text.match(regexes.waiver);
            savedData.waiver = {
                order: parseInt(match[1], 10),
                total: parseInt(match[2], 10)
            };
        }

        count += 1;
    });
}


function populatePlayers(teamId, callback) {

    var roster = {
        players: [],
        bench: []
    };

    var tempRoster = {};

    var sent = 0;

    $.get('http://games.espn.go.com/ffl/api/v2/rosterInfo?leagueId=' + leagueId + '&includeProjectionText=true&teamIds=' + teamId + '&usePreviousSeasonRealStats=false&useCurrentSeasonRealStats=true&useCurrentPeriodRealStats=true&useCurrentPeriodProjectedStats=true&usePreviousPeriodRealStats=true&includeRankings=true&includeLatestNews=true',
        function (data) {
            var players = data.leagueRosters.teams[0].slots;

            for (var i = 0; i < players.length; i++) {
                var p = players[i].player;
                var slot = i;

                if (!proTeamIdMap[p.proTeamId] || proTeamIdMap[p.proTeamId] == '') {
                    console.log(p.lastName + ' ' + p.proTeamId);
                }

                var player = {
                    firstName: p.firstName,
                    lastName: p.lastName,
                    percentOwned: p.percentOwned.toFixed(2),
                    percentStarted: p.percentStarted.toFixed(2),
                    percentChange: p.percentChange.toFixed(2),
                    playerID: p.playerId,
                    positionRank: p.positionRank,
                    slot: slotMapping[slot],
                    proTeam: proTeamIdMap[p.proTeamId],
                    proTeamID: p.proTeamId,
                    projections: {
                        season: {
                            evaluation: ''
                        }
                    }
                };

                $.get('http://games.espn.go.com/ffl/api/v2/playerInfo?leagueId=' + leagueId + '&fromTeamId=' + teamId + '&playerId=' + p.playerId + '&useCurrentSeasonRealStats=true&useCurrentSeasonProjectedStats=true&usePreviousSeasonRealStats=false&useCurrentPeriodRealStats=true&useCurrentPeriodProjectedStats=true&usePreviousPeriodRealStats=true&useGameLog=true&includeProjectionText=true&include=gamesLog%7Cnews%7Cprojections%7CplayerInfos&',
                    function(playerData) {
                        var playerObj = playerData.playerInfo.players[0];

                        var player = tempRoster[playerObj.player.playerId];

                        var gameLog = playerObj.gameLog.games.reverse();
                        var last3GameCount = Math.min(3, gameLog.length);
                        var lastGamePoints = 0;
                        var last3GameAvg = 0;

                        for (var gameCount=0; gameCount<last3GameCount; gameCount++) {
                            var gameStat = gameLog[gameCount];
                            if (gameCount === 0) {
                                lastGamePoints = gameStat.appliedStatTotal;
                            }
                            last3GameAvg += gameStat.appliedStatTotal;
                        }

                        player.lastGamePoints = lastGamePoints;
                        player.last3GameAvg = (last3GameAvg/last3GameCount).toFixed(2);


                        console.log(player);

                        if (player.slot !== 'Bench') {
                            roster.players.push(player);
                        } else {
                            roster.bench.push(player);
                        }

                        sent -= 1;
                        if (sent === 0) {

                            var playerSort = function(player) {
                                var sortIndex = player.slot;
                                if (player.slot == 'Bench') {
                                    sortIndex = player.position;
                                }
                                return [
                                    'QB',
                                    'RB',
                                    'WR',
                                    'TE',
                                    'FLEX',
                                    'D/ST',
                                    'K'
                                ].indexOf(sortIndex);
                            };

                            roster.players = _.sortBy(roster.players, playerSort);
                            roster.bench = _.sortBy(roster.bench, playerSort);

                            return callback(roster);
                        }
                });

                sent += 1;

                if (player.slot === 'FLEX' || player.slot === 'Bench') {
                    for (var index=0; index< p.eligibleSlotCategoryIds.length; index++) {
                        var eligibleSlotCategoryId = p.eligibleSlotCategoryIds[index];
                        if (eligibleSlotCategoryId < 9 && eligibleSlotCategoryId !== 6) {
                            player.position = slotMapping[eligibleSlotCategoryId];
                            break;
                        }
                      }
                } else {
                    player.position = player.slot;
                }

                getNumberForPlayer(player.lastName, player.position, player.proTeam, function(number) {
                   player.number = number;
                });

                if (p.projections) {
                    if (p.projections.length > 0) {
                        var projection = p.projections[0];
                        if (projection.isSeasonProjection) {
                            player.projections.season.evaluation = projection.projectionEvaluation;
                        }
                    }
                }

                tempRoster[p.playerId] = player;


            }

        });
}

var context = {};

window.onload = function() {
    saveData();
    initHelpers();

    populatePlayers(getUrlParameter('teamId'), function(roster) {
        console.log(roster);
        context = {
            teamImage: savedData.teamImg,
            teamName: savedData.teamName,
            leagueId: leagueId,
            roster: roster,
            waiver: savedData.waiver,
            trades: savedData.trades,
            acqusitions: savedData.acqusitions,
            record: {
                overall: {
                    wins: 7,
                    losses: 3
                },
                division: {
                    wins: 4,
                    losses: 0
                }
            }
        };
        document.body.innerHTML = loadTemplate('wrapper', context);
        init();
    });
};