define(["require", "exports", 'knockout', 's-innovations/task'], function(require, exports, __ko__, __Task__) {
    var ko = __ko__;
    var Task = __Task__;

    var TaskManager = (function () {
        function TaskManager() {
            var _this = this;
            this.tasks = ko.observableArray([]);
            this.completedTasks = ko.observableArray([]);
            this.numberOfTasks = ko.computed(function () {
                return _this.tasks().length + _this.completedTasks().length;
            });
            this.canClose = ko.computed(function () {
                return _this.tasks().map(function (v) {
                    return v.task.canWindowBeDisposed();
                }).indexOf(false) === -1;
            }).extend({ throttle: 50 });
        }
        TaskManager.prototype.createFilter = function (key) {
            var _this = this;
            if (typeof (this[key]) === 'undefined') {
                this[key] = ko.computed(function () {
                    var arr = _this.tasks().filter(function (kv) {
                        return kv.key === key;
                    }).map(function (v) {
                        return v.task;
                    });
                    return arr;
                }).extend({ throttle: 50 });
            }
        };

        TaskManager.prototype.addTask = function (key, task) {
            var _this = this;
            var value = { key: key, task: task };
            this.tasks.unshift(value);
            this.createFilter(key);
            task.promise.done(function () {
                _this.tasks.remove(value);
                _this.completedTasks.unshift(value);
            });
        };

        TaskManager.prototype.getTasksByKey = function (key) {
            this.createFilter(key);
            return this[key];
        };
        return TaskManager;
    })();

    
    return TaskManager;
});
