
function loadTemplate(templateName, obj) {
    var templateScript = document.getElementById(templateName).innerHTML;
    var template = Handlebars.compile(templateScript);
    return template(obj);
}


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
}

function saveData() {
    savedData.teamImg = $('.games-univ-mod1 img')[0].src;
    savedData.teamName = $('.team-name').html().split('<')[0].trim();
}

function populateRoster() {
    var roster = {
        players: [],
        bench: []
    };

    _.forEach(rosterManager.slots, function(player, playerID) {
        var p = {
            firstName: player.player.firstName,
            lastName: player.player.lastName,
            playerID: player.player.playerId,
            position: player.abbrev,

        };

        if (player.isBench) {
            roster.bench.push(p);
        } else {
            roster.players.push(p);
        }

    });

    return roster;
    
}

window.onload = function() {
    saveData();
    document.body.innerHTML = loadTemplate('wrapper', {
        teamImage: savedData.teamImg,
        teamName: savedData.teamName,
        roster: populateRoster()
    });
    init();
};
