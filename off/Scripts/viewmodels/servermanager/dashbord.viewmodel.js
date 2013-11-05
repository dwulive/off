define(["require", "exports", 's-innovations/sinnovations.filedropper', 'composite/WebsiteDeployment', 'composite/CompositeWebroleApi', 's-innovations/task.manager', 'knockout'], function(require, exports, __Dropper__, __Website__, __CompositeWebroleApi__, __TaskManager__, __ko__) {
    var Dropper = __Dropper__;
    var Website = __Website__;
    var CompositeWebroleApi = __CompositeWebroleApi__;
    var TaskManager = __TaskManager__;
    var ko = __ko__;

    var ServerManagerDashBoardViewModel = (function () {
        function ServerManagerDashBoardViewModel(serverApi, taskManager) {
            var _this = this;
            this.pageTitle = 'Dashboard';
            this.templateName = 'ServerManagerDashBoard';
            this.websites = ko.observableArray([]);
            this.deployedWebsites = ko.observableArray([]);
            this.progressStatus = ko.observable('');
            this.progressVal = ko.observableArray([]);
            this.progressWidth = ko.observableArray([]);
            this.subtitle = 'Drop Files here';
            this.leadText = 'Drop one or more zip files into this area and deploy';
            this.serverApi = serverApi;

            this.fileHandler = new Dropper(function (file) {
                if (file.type !== 'application/x-zip-compressed')
                    return;

                _this.websites.push(new Website({ file: file, taskManager: taskManager }));
            });
            serverApi.getDeployedWebsites().done(function (d) {
                console.log(d);
                for (var i = 0; i < d.length; ++i) {
                    _this.deployedWebsites.push(new Website({ data: d[i] }));
                }
            });
        }
        ServerManagerDashBoardViewModel.prototype.deploy = function () {
            var _this = this;
            var websites = this.websites();

            for (var i = 0; i < websites.length; i++) {
                var website = websites[i];
                this.serverApi.postWebsiteDeployment(website).done(function () {
                    _this.websites.remove(website);
                    _this.deployedWebsites.unshift(website);
                });
            }
        };
        return ServerManagerDashBoardViewModel;
    })();

    
    return ServerManagerDashBoardViewModel;
});
