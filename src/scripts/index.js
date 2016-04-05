
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
    });

    $('.projection').readmore();
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

                if (!proTeamIdMap[p.proTeamId] || proTeamIdMap[p.proTeamId] == '') {
                    console.log(p.lastName + ' ' + p.proTeamId);
                }

                var player = {
                    firstName: p.firstName,
                    lastName: p.lastName,
                    percentOwned: p.percentOwned,
                    percentStarted: p.percentStarted,
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
        });
        init();
    });
};
