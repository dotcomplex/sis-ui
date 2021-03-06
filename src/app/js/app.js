angular.module('sisui', ['ui.router', 'ui.bootstrap', 'sisconfig', 'smart-table'])
.config(function($stateProvider, $urlRouterProvider,
                 $rootScopeProvider) {
    "use strict";

    // HACKY - http://stackoverflow.com/questions/21958856/template-recursion-limitation-digest-loop-in-angularjs
    $rootScopeProvider.digestTtl(200);

    $urlRouterProvider
        .when("/docs", "/docs/index")
        .otherwise("/schemas");

    $stateProvider
        // root state
        .state("app", {
            url : "",
            templateUrl : "app/partials/app-root-state.html",
            abstract : true,
            resolve : {
                authData : function($location, $q, SisUser) {
                    // check for the search / login info
                    var d = $q.defer();
                    var searchObj = $location.search();
                    if (searchObj.username && searchObj.token) {
                        SisUser.loginWithToken(searchObj.username, searchObj.token)
                        .then(function(user) {
                            d.resolve(true);
                        }, function(err) {
                            d.resolve(false);
                        });
                        $location.search('username', null);
                        $location.search('token', null);
                    } else {
                        d.resolve(false);
                    }
                    return d.promise;
                }
            }
        })
        // user stuff
        .state("app.login", {
            url : "/login",
            templateUrl : "app/partials/user-login.html",
            controller : 'UserLoginController'
        })
        .state("app.users", {
            url : "/users",
            templateUrl : "app/partials/user-list.html",
            controller : "UserListController"
        })

        // schemas
        .state("app.schemas", {
            url : "/schemas",
            template : "<ui-view></ui-view>",
            abstract : true
        })
        .state("app.schemas.list", {
            url : "",
            templateUrl : "app/partials/schema-list.html",
            controller : "SchemaListController"
        })
        // TODO - turn this into optional params
        .state("app.schemas.add", {
            url : "/add",
            templateUrl : "app/partials/schema-mod.html",
            controller : "SchemaModController"
        })
        .state("app.schemas.edit", {
            url : "/edit/:schema",
            templateUrl : "app/partials/schema-mod.html",
            controller : "SchemaModController"
        })

        // entities
        .state("app.entities", {
            url : "/entities/:schema",
            template : "<ui-view></ui-view>",
            abstract : true
        })
        .state("app.entities.list", {
            url : "",
            templateUrl : "app/partials/entity-list.html",
            controller : "EntityListController"
        })
        // TODO - turn this into optional params
        .state("app.entities.add", {
            url : "/add",
            templateUrl : "app/partials/entity-mod.html",
            controller : "EntityModController"
        })
        .state("app.entities.edit", {
            url : "/edit/:eid",
            templateUrl : "app/partials/entity-mod.html",
            controller : "EntityModController"
        })
        .state("app.entities.view", {
            url : "/view/:eid",
            templateUrl : "app/partials/entity-view.html",
            controller : "EntityViewController"
        })

        // hooks
        .state("app.hooks", {
            url : "/hooks",
            template : "<ui-view></ui-view>",
            abstract : true
        })
        .state("app.hooks.list", {
            url : "",
            templateUrl : "app/partials/hook-list.html",
            controller : "HookListController"
        })
        .state("app.hooks.add", {
            url : "/add",
            templateUrl : "app/partials/entity-mod.html",
            controller : "HookModController"
        })
        .state("app.hooks.edit", {
            url : "/edit/:id",
            templateUrl : "app/partials/entity-mod.html",
            controller : "HookModController"
        })
        .state("app.hooks.view", {
            url : "/view/:id",
            templateUrl : "app/partials/entity-view.html",
            controller : "EntityViewController"
        })

        // scripts
        .state("app.scripts", {
            url : "/scripts",
            template : "<ui-view></ui-view>",
            abstract : true
        })
        .state("app.scripts.list", {
            url : "",
            templateUrl : "app/partials/script-list.html",
            controller : "ScriptListController"
        })
        .state("app.scripts.add", {
            url : "/add",
            templateUrl : "app/partials/entity-mod.html",
            controller : "ScriptModController"
        })
        .state("app.scripts.edit", {
            url : "/edit/:id",
            templateUrl : "app/partials/entity-mod.html",
            controller : "ScriptModController"
        })
        .state("app.scripts.view", {
            url : "/view/:id",
            templateUrl : "app/partials/entity-view.html",
            controller : "EntityViewController"
        })
    
        // tokens
        .state("app.tokens", {
            url : "/tokens",
            templateUrl : "app/partials/token-list.html",
            controller : "TokenListController"
        })
        // commits
        .state("app.commits", {
            url : "/commits",
            template : "<ui-view></ui-view>",
            abstract : true
        })
        // TODO - turn this into optional params
        .state("app.commits.entities", {
            url : "/entities/:schema/:id",
            templateUrl : "app/partials/commit-list.html",
            controller : "CommitListController"
        })
        .state("app.commits.sisobj", {
            url : "/:type/:id",
            templateUrl : "app/partials/commit-list.html",
            controller : "CommitListController"
        })

        // docs
        .state("docs", {
            url : "/docs/:doc",
            templateUrl : function(params) {
                var doc = params.doc;
                return "app/docs/" + doc;
            }
        })
        ;
})
// From http://stackoverflow.com/a/17472118/263895
.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
})
.run(function ($rootScope, $state, $stateParams, $location,
               $templateCache, SisDialogs) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.sisDlg = SisDialogs;
    var searchObj = $location.search();
    if (searchObj.embed == 'true') {
        $rootScope.embedded = true;
        $location.search('embed', null);
    }

    // modify the st pagination template
    var template = [
        '<div class="pagination" ng-if="pages.length >= 2"><ul class="pagination">',
        '<li><a ng-click="selectPage(1)">First</a></li>',
        '<li><a ng-click="selectPage(pages[0] - stDisplayedPages)" ng-if="pages[0] > stDisplayedPages">...</a></li>',
        '<li ng-repeat="page in pages" ng-class="{active: page==currentPage}"><a ng-click="selectPage(page)">{{page}}</a></li>',
        '<li><a ng-click="selectPage(pages[pages.length - 1] + 1)" ng-if="pages[pages.length - 1] < numPages">...</a></li>',
        '<li><a ng-click="selectPage(numPages)">Last</a></li>',
        '</ul></div>'
    ].join("");
    $templateCache.put('template/smart-table/pagination.html', template);
});
