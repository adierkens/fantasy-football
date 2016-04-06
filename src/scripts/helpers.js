function initHelpers() {
    
    Handlebars.registerHelper('header', function () {
        return new Handlebars.SafeString(loadTemplate('header', context));
    });
}