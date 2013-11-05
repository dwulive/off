var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 's-innovations/app', 'knockout', 'knockout.validation', 'toastr', 's-innovations/task.manager'], function(require, exports, __App__, __ko__, __validation__, __toastr__, __TaskManager__) {
    var App = __App__;
    var ko = __ko__;
    var validation = __validation__;
    var toastr = __toastr__;
    var TaskManager = __TaskManager__;

    validation.configure({
        insertMessages: false,
        decorateElement: false,
        errorElementClass: 'error2',
        errorMessageClass: 'help-inline'
    });

    toastr.options = {
        positionClass: "toast-top-left",
        newestOnTop: true,
        toastClass: "col-xs-12"
    };

    var WebroleManagementApp = (function (_super) {
        __extends(WebroleManagementApp, _super);
        function WebroleManagementApp(settings) {
            var _this = this;
            _super.call(this, settings);
            this.isHelpVisible = ko.observable(false);
            this.taskManager = new TaskManager();

            this.applicationTitle = 'Composite Webrole Management';

            this.addViewModel({ name: 'Home', bindingMemberName: 'home', viewModelName: 'viewmodels/home.viewmodel', viewName: 'home', route: ['/', '#home'], includeInServiceMenu: true });
            this.addViewModel({ name: 'Server Manager', bindingMemberName: 'servermanager', viewModelName: 'viewmodels/server-manager.viewmodel', viewName: 'servermanager', route: ['#manage/server', '#manage/server/:name'] });

            var a = ko.computed(function () {
                return _this.taskManager.canClose() ? null : "Task is running";
            });
            window.onbeforeunload = function () {
                return a();
            };
        }
        WebroleManagementApp.prototype.toggleHelp = function () {
            this.isHelpVisible(!this.isHelpVisible());
        };

        WebroleManagementApp.prototype.onClose = function () {
            return "Hello";
        };
        return WebroleManagementApp;
    })(App);

    
    return WebroleManagementApp;
});
