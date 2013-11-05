define(["require", "exports", 'knockout'], function(require, exports, __ko__) {
    var ko = __ko__;

    var SubPageHandler = (function () {
        function SubPageHandler(settings) {
            this.title = ko.observable('ds');
            this.subtitle = ko.observable('sds');
            this.pages = ko.observableArray(settings.pages);
            this.activePage = ko.observable(settings.pages[0]);
            this.title(settings.title);

            if (ko.isObservable(settings.subtitle))
                this.subtitle = settings.subtitle;
else
                this.subtitle(settings.subtitle);
        }
        SubPageHandler.prototype.navigate = function (page) {
            this.activePage(page);
        };
        return SubPageHandler;
    })();

    
    return SubPageHandler;
});
