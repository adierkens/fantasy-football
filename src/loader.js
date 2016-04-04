'use scrict';

const LOCATIONS = {
  js: [
    chrome.extension.getURL('/dist/handlebars-latest.js'),
    chrome.extension.getURL('/dist/fantasy-football.combined.js'),
    'https://code.jquery.com/jquery-2.1.4.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/mustache.js/2.1.3/mustache.min.js'
  ],
  css: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css',
    'http://fezvrasta.github.io/bootstrap-material-design/dist/css/bootstrap-material-design.css'
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
