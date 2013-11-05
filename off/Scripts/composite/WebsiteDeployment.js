define(["require", "exports", 's-innovations/sinnovations.repository', 'knockout', 's-innovations/task.manager', 's-innovations/task'], function(require, exports, __repository__, __ko__, __TaskManager__, __Task__) {
    var repository = __repository__;
    var ko = __ko__;
    var TaskManager = __TaskManager__;
    var Task = __Task__;

    var Binding = (function () {
        function Binding() {
            var _this = this;
            this.hostname = ko.observable('');
            this.port = ko.observable();
            this.sslThumbprint = ko.observable();
            this.schema = ko.observable('http://');
            this.uri = ko.computed(function () {
                return _this.schema() + _this.hostname() + ':' + _this.port();
            }).extend({ throttle: 1 });
        }
        Binding.prototype.toggleSchema = function () {
            this.schema(this.schema() === 'http://' ? 'https://' : 'http://');
        };
        return Binding;
    })();

    var Website = (function () {
        function Website(options) {
            var _this = this;
            this.websiteName = ko.observable();
            this.tasks = ko.observable();
            this.writeback = ko.observable(true);
            this.websiteZipSize = ko.observable();
            this.containerName = ko.observable();
            this.bindings = new repository(Binding);
            if (typeof (options.taskManager) !== 'undefined') {
                this.websiteName.subscribe(function (v) {
                    var comparray = options.taskManager.getTasksByKey(v);
                    _this.tasks(comparray);
                });
            } else {
                this.tasks(ko.computed(function () {
                    return [];
                }));
            }

            if (typeof (options.data) !== 'undefined') {
                this.websiteName(options.data.name);
                this.containerName(options.data.storeName);
                this.writeback(options.data.writeBackToStore);

                for (var i = 0; i < options.data.bindings.length; ++i) {
                    var binding = new Binding();
                    binding.hostname(options.data.bindings[i].hostname === null ? '*' : options.data.bindings[i].hostname);
                    binding.port(options.data.bindings[i].port === null ? 80 : options.data.bindings[i].port);

                    binding.sslThumbprint(options.data.bindings[i].sslThumbprint);

                    binding.schema(options.data.bindings[i].sslThumbprint === null ? 'http://' : 'https://');
                    this.bindings.items.push(binding);
                }
                if (options.data.bindings.length === 0) {
                    var binding = new Binding();
                    binding.hostname('*');
                    binding.port(80);

                    binding.schema('http://');
                    this.bindings.items.push(binding);
                }
            }
            if (typeof (options.file) !== 'undefined') {
                this.file = options.file;
                this.websiteZipSize(options.file.size);

                var l = options.file.name.lastIndexOf('.');
                var websiteName = l != -1 ? options.file.name.substr(0, l) : options.file.name;

                var date = new Date();
                function twodigit(d) {
                    var dd = d.toString();
                    return dd.length == 1 ? '0' + dd : dd;
                }
                this.websiteName(websiteName.toLowerCase().replace(/[^a-z0-9]/gi, '-') + '-' + date.getFullYear().toString().substr(2, 2) + twodigit(date.getMonth()) + twodigit(date.getDay()) + '-' + twodigit(date.getHours()) + twodigit(date.getMinutes()) + twodigit(date.getSeconds()));
            }

            this.bindings.checkvalid = function (b, done) {
                return true;
            };
        }
        Website.prototype.toJSON = function () {
            var copy = ko.toJS(this);
            var data = {
                name: copy.websiteName,
                storeName: copy.containerName,
                bindings: copy.bindings.items,
                writeBackToStore: copy.writeback
            };

            return data;
        };
        return Website;
    })();

    
    return Website;
});
