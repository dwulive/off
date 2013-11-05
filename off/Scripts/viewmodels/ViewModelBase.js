define(["require", "exports"], function(require, exports) {
    

    var ViewModelBase = (function () {
        function ViewModelBase(app) {
            this.app = app;
        }
        ViewModelBase.prototype.onNavigatedFrom = function () {
        };
        ViewModelBase.prototype.onNavigatedTo = function (params) {
        };
        return ViewModelBase;
    })();

    
    return ViewModelBase;
});
