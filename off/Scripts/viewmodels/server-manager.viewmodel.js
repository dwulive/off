var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'knockout', 'knockoutmapping', './ViewModelBase', 'composite/CompositeWebroleApi', 's-innovations/subpages.handler', 'composite/WebroleManagementApp', 'viewmodels/servermanager/dashbord.viewmodel', "template!/views/servermanager/ServerManagerDashBoard.html", "template!/views/servermanager/ServerManagerUsers.html", "template!/views/servermanager/ServerManagerLogging.html", "template!/views/shared/subpages.html"], function(require, exports, __ko__, __mapping__, __ViewModelBase__, __CompositeWebroleApi__, __SubPageHandler__, __WebroleManagementApp__, __ServerManagerDashBoardViewModel__) {
    var ko = __ko__;
    var mapping = __mapping__;
    var ViewModelBase = __ViewModelBase__;
    var CompositeWebroleApi = __CompositeWebroleApi__;
    var SubPageHandler = __SubPageHandler__;
    var WebroleManagementApp = __WebroleManagementApp__;

    var ServerManagerDashBoardViewModel = __ServerManagerDashBoardViewModel__;

    var userPage = { pageTitle: 'Users', templateName: 'ServerManagerUsers' };
    var logPage = { pageTitle: 'Logging', templateName: 'ServerManagerLogging' };

    var Server = (function () {
        function Server(options, parent) {
            var _this = this;
            this.host = ko.observable();
            this.username = ko.observable();
            this.accessToken = ko.observable();
            this.isConnected = ko.observable(false);
            this.connectionStatus = ko.observable('open-connection');
            this.url = ko.computed(function () {
                return '#manage/server/' + encodeURIComponent(_this.host());
            });
            console.log(options);
            if (typeof (options) !== 'undefined') {
                this.host(options.data.host);
                this.username(options.data.username);
                this.accessToken(options.data.accessToken);
                this.accessToken.subscribe(function (v) {
                    parent.saveServersToLocalStorage();
                });
                this.svc = new CompositeWebroleApi(this.host(), this.accessToken(), parent.app.taskManager);

                this.subpagesViewModel = new SubPageHandler({
                    title: 'Server',
                    subtitle: this.host,
                    viewName: 'subpages',
                    pages: [new ServerManagerDashBoardViewModel(this.svc, parent.app.taskManager), userPage, logPage]
                });

                if (this.svc.isAccessTokenExpired()) {
                    this.svc.renewAccessToken().done(function (token) {
                        _this.accessToken(token);

                        _this.svc.ping().done(function () {
                            return _this.connectionStatus('open-connection');
                        }).fail(function () {
                            return _this.connectionStatus('closed-connection');
                        });
                    });
                } else {
                    this.svc.ping().done(function () {
                        return _this.connectionStatus('open-connection');
                    }).fail(function () {
                        return _this.connectionStatus('closed-connection');
                    });
                }
            }
        }
        return Server;
    })();

    var ServersViewModel = (function (_super) {
        __extends(ServersViewModel, _super);
        function ServersViewModel(app, settings) {
            var _this = this;
            _super.call(this, app);
            this.servers = ko.observableArray([]);
            this.activeServer = ko.observable();
            this.tempAddingItem = ko.observable(new Server());
            this.tempAddingPass = ko.observable();

            if (typeof (localStorage["servers"]) !== 'undefined') {
                mapping.fromJSON(localStorage["servers"], {
                    'create': function (options) {
                        var s = new Server(options, _this);
                        return s;
                    }
                }, this.servers);
            }

            this.servers.subscribe(function (value) {
                _this.saveServersToLocalStorage();
            });
        }
        ServersViewModel.prototype.saveServersToLocalStorage = function () {
            localStorage["servers"] = ko.toJSON(this.servers());
        };

        ServersViewModel.prototype.onNavigatedTo = function (params) {
            var arr = this.servers();

            if (typeof (params["name"]) === 'undefined') {
                location.hash = 'manage/server/' + encodeURIComponent(arr.length > 0 ? arr[0].host() : 'add');
                return;
            }

            if (params["name"] === "add") {
                this.activeServer(this.tempAddingItem());
            } else {
                var target = decodeURIComponent(params["name"]);
                console.log(target);
                for (var i = 0; i < arr.length; ++i) {
                    console.log(arr[i].host());
                    if (arr[i].host() === target) {
                        this.activeServer(arr[i]);
                        return;
                    }
                }
            }
        };

        ServersViewModel.prototype.add = function () {
            var _this = this;
            var model = this.tempAddingItem();
            console.log(model.host());
            var svc = new CompositeWebroleApi(model.host()).oauth2GrantResourceOwner(model.username(), this.tempAddingPass()).done(function (data) {
                _this.tempAddingItem().accessToken(data);
                _this.servers.push(_this.tempAddingItem());
                _this.tempAddingItem(new Server());
            }).fail(function () {
            });
        };
        ServersViewModel.prototype.setActive = function (server) {
            this.activeServer(server);
        };
        return ServersViewModel;
    })(ViewModelBase);

    
    return ServersViewModel;
});
