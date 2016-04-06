'use scrict';

const LOCATIONS = {
    js: [
        chrome.extension.getURL('/dist/handlebars-latest.js'),
        'https://code.jquery.com/jquery-2.1.4.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/js/select2.full.min.js',
        'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/mustache.js/2.1.3/mustache.min.js',
        'http://fezvrasta.github.io/bootstrap-material-design/dist/js/material.js',
        'http://fezvrasta.github.io/bootstrap-material-design/dist/js/ripples.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.min.js',
        chrome.extension.getURL('/dist/fantasy-football.combined.js')
    ],
    css: [
        'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css',
        'http://fezvrasta.github.io/bootstrap-material-design/dist/css/bootstrap-material-design.css',
        'http://fezvrasta.github.io/bootstrap-material-design/dist/css/ripples.min.css',
        'http://fezvrasta.github.io/bootstrap-material-design/index.css',
        'https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.12.1/css/selectize.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.2/css/select2.min.css',
        chrome.extension.getURL('/dist/styles.css')
    ],
    templates: [
        'wrapper',
        'header'
    ]
};

for (var i in LOCATIONS.js) {
    var script = LOCATIONS.js[i];
    var ele = document.createElement('script');
    ele.src = script;
    document.head.appendChild(ele);
}

for (var i in LOCATIONS.css) {
    var css = LOCATIONS.css[i];
    var ele = document.createElement('link');
    ele.rel = 'stylesheet';
    ele.href = css;
    document.head.appendChild(ele);
}

for (var i in LOCATIONS.templates) {
    var template = LOCATIONS.templates[i];
    var client = new XMLHttpRequest();
    client.template = template;
    client.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            var templateContent = this.responseText;
            var scriptEle = document.createElement('script');
            scriptEle.type = 'text/x-handlebars-template';
            scriptEle.id = this.template;
            scriptEle.innerHTML = templateContent;

            document.head.appendChild(scriptEle);

        }
    };
    client.open('GET', chrome.extension.getURL('/dist/' + template + '.hbs'));
    client.send();
}
