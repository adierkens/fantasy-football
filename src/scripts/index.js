
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

const slotMapping = {
    0: 'QB',
    1: 'RB',
    2: 'RB',
    3: 'WR',
    4: 'WR',
    5: 'TE',
    6: 'FLEX',
    7: 'D/ST',
    8: 'K',
    9: 'Bench',
    10: 'Bench',
    11: 'Bench',
    12: 'Bench',
    13: 'Bench',
    14: 'Bench',
    15: 'Bench'
};



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
    });
}

function saveData() {
    savedData.teamImg = $('.games-univ-mod1 img')[0].src;
    savedData.teamName = $('.team-name').html().split('<')[0].trim();

    var count = 0;
    $('.games-btm-area li').each(function() {
        var text = $(this).text();

        if (count == 0) {
            // Acqusitions

            // Trades

            // Waiver Order
        }

        count += 1;
    });
}

function populatePlayers(callback) {

    var roster = {
        players: [],
        bench: []
    };


    $.get('http://games.espn.go.com/ffl/api/v2/rosterInfo?leagueId=' + leagueId + '&includeProjectionText=true&teamIds=' + getUrlParameter('teamId') + '&usePreviousSeasonRealStats=false&useCurrentSeasonRealStats=true&useCurrentPeriodRealStats=true&useCurrentPeriodProjectedStats=true&usePreviousPeriodRealStats=true&includeRankings=true&includeLatestNews=true',
        function (data) {
            var players = data.leagueRosters.teams[0].slots;

            for (var i = 0; i < players.length; i++) {
                var p = players[i].player;
                var slot = i;
                var player = {
                    firstName: p.firstName,
                    lastName: p.lastName,
                    percentOwned: p.percentOwned,
                    percentStarted: p.percentStarted,
                    playerID: p.playerId,
                    positionRank: p.positionRank,
                    slot: slotMapping[slot],
                    proTeamID: p.proTeamId,
                    projections: {
                        season: {
                            evaluation: ''
                        }
                    }
                };

                if (p.projections) {
                    if (p.projections.length > 0) {
                        var projection = p.projections[0];
                        if (projection.isSeasonProjection) {
                            player.projections.season.evaluation = projection.projectionEvaluation;
                        }
                    }
                }

                if (slot < 9) {
                    roster.players.push(player);
                } else {
                    roster.bench.push(player);
                }

            }

            return callback(roster);
        });
}

window.onload = function() {
    saveData();

    populatePlayers(function(roster) {
        console.log(roster);
        document.body.innerHTML = loadTemplate('wrapper', {
            teamImage: savedData.teamImg,
            teamName: savedData.teamName,
            roster: roster,
            waiver: {
                order: 7,
                total: 10
            },
            trades: 8,
            acqusitions: 8,
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
        });
        init();
    });
};
