
function loadTemplate(templateName, obj) {
    var templateScript = document.getElementById(templateName).innerHTML;
    var template = Handlebars.compile(templateScript);
    return template(obj);
}


function init() {
    window.hash = window.hash || '#MyTeam';

    if (window.hash != "#MyTeam") {
        $(".menu").find("li[data-target=" + window.hash + "]").trigger('click');
    }

    $(".menu li").on('click', function() {
        console.log($(this));
        if (!$(this).data("target")) return;
        if ($(this).is(".active")) return;

        window.hash = $(this).data("target");

        $(".menu li").not($(this)).removeClass("active");
        $(".page").not($(window.hash)).removeClass("active").hide();
        $(this).addClass('active');

        $(window.hash).show();
        var page = $(window.hash);
        
        var totop = setInterval(function() {
            $('.pages').animate({
                scrollTop: 0
            }, 0);
        }, 1);

        setTimeout(function() {
            page.addClass('active');
            setTimeout(function () {
                clearInterval(totop);
            }, 1000);
        }, 100);
    });
}

window.onload = function() {
    document.body.innerHTML = loadTemplate('wrapper', {});
    init();
};
