var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './ViewModelBase', 'composite/WebroleManagementApp'], function(require, exports, __ViewModelBase__, __WebroleManagementApp__) {
    
    var ViewModelBase = __ViewModelBase__;
    var WebroleManagementApp = __WebroleManagementApp__;

    var HomeViewModel = (function (_super) {
        __extends(HomeViewModel, _super);
        function HomeViewModel(app, settings, params) {
            _super.call(this, app);
        }
        return HomeViewModel;
    })(ViewModelBase);

    
    return HomeViewModel;
});
