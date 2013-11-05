define(["require", "exports", 'knockout', 'sammy'], function(require, exports, __ko__, __sammy__) {
    var ko = __ko__;
    var sammy = __sammy__;

    var App = (function () {
        function App(settings) {
            var _this = this;
            this.routes = sammy();
            this.serviceMenu = ko.observableArray();
            this.view = ko.observable();
            this.viewArguments = null;
            this.viewModel = null;
            this.viewTemplate = ko.observable();
            this.loading = ko.computed(function () {
                return _this.view() === App.Views.Loading;
            });
            this._settings = settings;
            this.view(App.Views.Loading);
            this.applicationTitle = settings.applicationTitle || 'S-Innovations SPA';
            this._settings.viewEngienBasePath = this._settings.viewEngienBasePath || '/views/';

            this.routes.notFound = function (verb) {
                console.log(arguments);
                if (verb !== 'post')
                    location.hash = '/';
            };
        }
        App.prototype.run = function () {
            ko.applyBindings(this);
            this.routes.run('/');
        };

        App.prototype.addViewModel = function (options) {
            var _this = this;
            var viewItem = App.Views[options.name] || {}, navigator;

            if (typeof (options.includeInServiceMenu) !== "undefined" && options.includeInServiceMenu) {
                this.serviceMenu.push(options);
            }

            App.Views[options.name] = viewItem;

            this[options.bindingMemberName] = ko.computed(function () {
                if (_this.view() !== viewItem) {
                    return null;
                }

                if (typeof (options.factory) !== "undefined") {
                    if (typeof (_this.viewModel) !== "undefined" && (_this.viewModel) !== null) {
                        console.log('navigating away from');
                        console.log(_this.viewModel);
                        console.log(typeof (_this.viewModel));
                        _this.viewModel.onNavigatedFrom();
                    }

                    _this.viewModel = new options.factory(_this, _this._settings);
                    _this.viewModel.onNavigatedTo(_this.viewArguments);
                    _this.viewTemplate(options.viewName);

                    return _this.viewModel;
                } else {
                    require([options.viewModelName, 'template!' + _this._settings.viewEngienBasePath + options.viewName + '.html'], function (factory) {
                        options.factory = factory;
                        _this.view(viewItem);
                    });
                    _this.view(App.Views.Loading);
                }
            });

            if (typeof (options.navigatorFactory) !== "undefined") {
                navigator = options.navigatorFactory(this, this._settings);
            } else {
                navigator = function () {
                    if (typeof (options.route) !== "undefined") {
                        location.hash = options.route[0];
                    } else {
                        _this.view(viewItem);
                    }
                };
            }

            this["navigateTo" + options.name.replace(" ", "")] = navigator;

            if (typeof (options.route) !== "undefined") {
                var self = this;
                for (var i = 0; i < options.route.length; i++) {
                    this.routes.get(options.route[i], function () {
                        self.viewArguments = this.params;
                        if (self.view() == viewItem) {
                            self.viewModel.onNavigatedTo(this.params);
                        } else {
                            self.view(viewItem);
                        }
                    });
                }
            }
        };

        App.prototype.archiveSessionStorageToLocalStorage = function () {
            var backup = {};

            for (var i = 0; i < sessionStorage.length; i++) {
                backup[sessionStorage.key(i)] = sessionStorage[sessionStorage.key(i)];
            }
            console.log(backup);
            localStorage["sessionStorageBackup"] = JSON.stringify(backup);
            sessionStorage.clear();
        };

        App.prototype.restoreSessionStorageFromLocalStorage = function () {
            var backupText = localStorage["sessionStorageBackup"], backup;
            console.log(backupText);

            if (backupText) {
                backup = JSON.parse(backupText);

                for (var key in backup) {
                    sessionStorage[key] = backup[key];
                }

                localStorage.removeItem("sessionStorageBackup");
            }
        };
        App.Views = {
            Loading: {}
        };
        return App;
    })();

    
    return App;
});
