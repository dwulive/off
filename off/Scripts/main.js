require.config({

    // Once you setup baseUrl
    // Relative urls continue to work normal (from source file).
    // However Non-relative URLs use this as base. 
    // By default this is the location of requirejs. 
    baseUrl: 'Scripts/',
    // Since I just used a relative url. This url is relative to this file.

    shim: {
        'sammy': {
            deps: ['jquery'],
            exports: 'Sammy',
        },
        'd3': { exports: 'd3' },
        "signalr": { deps: ["jquery"] },
        "signalr.hubs": { deps: ["signalr"] },
        "bootstrap": {
            deps: ["jquery"]
        },
        "jquery.activity-indicator": { deps: ["jquery"] },
        "chatjs": {
            deps: ["signalr.hubs", "jquery.activity-indicator", "chatjs.signalr", "jquery.autosize.min"]
        }
        //  'knockout': { deps: ['jquery'], exports: 'ko' },
        //'knockoutmapping': { deps: ['knockout'] },
        //  'knockout.validation': { deps: ['knockout'] },

    },
    paths: {
        'jquery': 'jquery-2.0.3.min',
        'toastr': 'toastr',
        'sammy': 'sammy-0.7.4.min',
        "knockout": 'knockout-2.3.0',
        'knockoutmapping': 'knockout.mapping-latest',
        "signalr": 'signalr/jquery.signalR-2.0.0-rc1.min',
        "signalr.hubs": "signalr/hubs?",
        "datejs": 'date',
        "base64": 'base64',
        "bootstrap": 'bootstrap.min',
        "d3": 'http://d3js.org/d3.v3.min'
    },


});


// Start the app: 
require(['knockout', './composite/WebroleManagementApp', 'bootstrap'], function (ko, App) {


    //Disbable cache for all jQuery AJAX requests
    $.ajaxSetup({ cache: false });

    var settings = {
        addExternalLoginUrl: "/api/Account/AddExternalLogin",
        changePasswordUrl: "/api/Account/changePassword",
        loginUrl: "/Token",
        logoutUrl: "/api/Account/Logout",
        registerUrl: "/api/Account/Register",
        registerExternalUrl: "/api/Account/RegisterExternal",
        removeLoginUrl: "/api/Account/RemoveLogin",
        setPasswordUrl: "/api/Account/setPassword",
        siteUrl: "/",
        userInfoUrl: "/api/Account/UserInfo"
    }

    var vm = new App(settings);

    //vm.addViewModel({ name: 'Splash', bindingMemberName: 'splash', viewModelName: './splash.viewmodel', viewName: 'splash', route: ['/', '#splash/:timeout'] });
    //vm.addViewModel({ name: 'Home', bindingMemberName: 'home', viewModelName: './home.viewmodel', viewName: 'home2', route: ['#home'], includeInServiceMenu: true });
    //vm.addViewModel({
    //    name: 'Chat Manager',
    //    bindingMemberName: 'chatManager',
    //    viewModelName: './chatmanager.viewmodel',
    //    viewName: 'chatmanager',
    //    route: ['#chatmanager'],
    //    includeInServiceMenu: true,
    //    navigatorFactory: function (_app, _settings) {
    //        return function () {
    //            location.hash = _app.authn.loggedIn() ? '#chatmanager' : '#user/login/chatmanager';
    //        }
    //    }
    //});
    //vm.addViewModel({
    //    name: 'Login',
    //    bindingMemberName: 'login',
    //    viewModelName: './login.viewmodel',
    //    viewName: 'login',
    //    route: ['#user', '#user/:controller/:action']
    //});
    //vm.addViewModel({ name: 'Events', bindingMemberName: 'events', viewModelName: './events.viewmodel', viewName: 'events', route: ['#events', '/'], includeInServiceMenu: true });
    //vm.addViewModel({ name: 'Server Manager', bindingMemberName: 'servermanager', viewModelName: './server-manager.viewmodel', viewName: 'servermanager', route: ['#manage/server'] });

    //vm.addViewModel({ name: 'Presentations', bindingMemberName: 'presentations', viewModelName: './presentations.viewmodel', viewName: 'presentations', route: ['#presentations', '#presentations/:id/:step'], includeInServiceMenu: true });


    vm.run();
    //  setTimeout(function(){vm.navigateToHome()},1000);

});

