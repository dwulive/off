define(["require", "exports", 'knockout'], function(require, exports, __ko__) {
    var ko = __ko__;
    

    var Task = (function () {
        function Task(title, promise, isClientTask) {
            if (typeof isClientTask === "undefined") { isClientTask = false; }
            var _this = this;
            this.title = ko.observable();
            this.progessWidth = ko.observable();
            this.isComplete = ko.observable(false);
            this.isClientTask = ko.observable(false);
            this.isFaulted = ko.observable(false);
            this.canWindowBeDisposed = ko.computed(function () {
                return _this.isComplete() || !_this.isClientTask();
            });
            this.title(title);
            this.isClientTask(isClientTask);
            this.promise = promise;

            promise.done(function () {
                _this.isComplete(true);
            });
            promise.fail(function () {
                _this.isFaulted(true);
            });

            promise.progress(function (p) {
                _this.progessWidth(p + '%');
                console.log(p);
            });
        }
        return Task;
    })();
    
    return Task;
});
