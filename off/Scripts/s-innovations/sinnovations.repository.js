define(["require", "exports", 'knockout'], function(require, exports, __ko__) {
    var ko = __ko__;

    var Repository = (function () {
        function Repository(ctor) {
            this.items = ko.observableArray([]);
            this.tempAddingItem = ko.observable();
            this.checkvalid = function () {
            };
            this.ctor = ctor;
            this.tempAddingItem(new ctor());
            console.log(this.tempAddingItem());
        }
        Repository.prototype.toJSON = function () {
            return { items: ko.toJS(this.items) };
        };

        Repository.prototype.add = function () {
            var _this = this;
            console.log(ko.toJS(this.tempAddingItem));

            var callback = function (valid) {
                console.log("callback");
                console.log(valid);
                if (!valid)
                    return;

                _this.items.push(_this.tempAddingItem());
                _this.tempAddingItem(new _this.ctor());
            };

            callback(this.checkvalid(this.tempAddingItem(), callback));
        };
        Repository.prototype.edit = function (item) {
            this.items.remove(item);
            this.tempAddingItem(item);
        };
        return Repository;
    })();

    
    return Repository;
});
