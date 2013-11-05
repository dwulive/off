define(["require", "exports", 'jquery', 's-innovations/sinnovations.chunkuploader', 's-innovations/task.manager', 's-innovations/task', 'composite/WebsiteDeployment', 'knockout'], function(require, exports, __$__, __FileChunkUploader__, __TaskManager__, __Task__, __Website__, __ko__) {
    var $ = __$__;
    var FileChunkUploader = __FileChunkUploader__;
    var TaskManager = __TaskManager__;
    var Task = __Task__;
    var Website = __Website__;
    var ko = __ko__;

    function ajax(settings) {
        if (typeof settings === "undefined") { settings = { headers: {} }; }
        var antiForgeryToken = $("#antiForgeryToken").val();
        if (antiForgeryToken) {
            settings.headers = settings.headers || {};
            $.extend(settings.headers, {
                'RequestVerificationToken': antiForgeryToken
            });
        }

        return $.ajax(settings);
    }

    var CompositeWebroleApi = (function () {
        function CompositeWebroleApi(_serviceEndpoint, accessToken, taskManager) {
            this._serviceEndpoint = _serviceEndpoint.charAt(_serviceEndpoint.length - 1) !== '/' ? _serviceEndpoint : _serviceEndpoint.substr(0, _serviceEndpoint.length - 1);

            this._accessToken = accessToken;
            this._taskmanager = taskManager;
        }
        CompositeWebroleApi.prototype.isAccessTokenExpired = function () {
            console.log(Date.parse(this._accessToken[".expires"]));
            console.log(new Date().getTime());

            return Date.parse(this._accessToken[".expires"]) < new Date().getTime();
        };

        CompositeWebroleApi.prototype.renewAccessToken = function () {
            var _this = this;
            return $.ajax(this._serviceEndpoint + '/Token', {
                type: 'POST',
                crossDomain: true,
                data: {
                    grant_type: "refresh_token",
                    'refresh_token': this._accessToken.refresh_token
                }
            }).done(function (data) {
                _this._accessToken = data;
            });
        };

        CompositeWebroleApi.prototype.ping = function () {
            var _this = this;
            var deferred = $.Deferred();

            var pingDefered = $.ajax(this._serviceEndpoint + '/Api/Ping', {
                cache: false,
                headers: this.getSecurityHeaders()
            }).done(deferred.resolve).fail(function () {
                _this.renewAccessToken().then(deferred.resolve, deferred.reject);
            });

            return deferred.promise();
        };

        CompositeWebroleApi.prototype.getDeployedWebsites = function () {
            return ajax({
                url: this._serviceEndpoint + '/Api/Deployment/',
                headers: this.getSecurityHeaders(),
                type: 'GET',
                cache: false
            });
        };
        CompositeWebroleApi.prototype.postWebsiteDeployment = function (website) {
            var _this = this;
            var websiteJson = ko.toJSON(website);
            var file = website.file;

            var defered = $.Deferred();

            var promise = this.post('/Api/Deployment', websiteJson);

            promise.done(function (d) {
                var path = d.uploadPath + '/' + d.id + '/' + file.name;
                var uploader = new FileChunkUploader(file, function (upl) {
                    return path;
                });
                var uploadPromise = uploader.start();
                _this._taskmanager.addTask(website.websiteName(), new Task("Uploading Zipfile", uploadPromise, true));

                uploadPromise.progress(defered.notify);
                uploadPromise.fail(defered.reject);
                uploadPromise.done(function () {
                    var completePromish = $.ajax({
                        url: path + '/done',
                        type: 'PUT',
                        headers: _this.getSecurityHeaders()
                    }).then(defered.resolve, defered.reject);
                });
            });

            return defered.promise();
        };

        CompositeWebroleApi.prototype.post = function (path, data) {
            return ajax({
                url: this._serviceEndpoint + path,
                type: 'post',
                data: data,
                cache: false,
                headers: this.getSecurityHeaders(),
                contentType: (typeof (data) === 'string') ? 'application/json' : 'application/x-www-form-urlencoded; charset=UTF-8'
            });
        };

        CompositeWebroleApi.prototype.oauth2GrantResourceOwner = function (username, password) {
            return $.ajax(this._serviceEndpoint + '/Token', {
                type: 'POST',
                crossDomain: true,
                data: {
                    grant_type: "password",
                    username: username,
                    password: password
                }
            }).done(function (data) {
                console.log(data);
            }).fail(function () {
                console.log(arguments);
            });
        };

        CompositeWebroleApi.prototype.getSecurityHeaders = function () {
            if (this._accessToken) {
                return { "Authorization": "Bearer " + this._accessToken.access_token };
            }

            return {};
        };
        return CompositeWebroleApi;
    })();

    
    return CompositeWebroleApi;
});
