/*
 * Angular Head Module
 * 
 * Copyright 2017 by Lars Boegild Thomsen <lbthomsen@gmail.com>
 * 
 */
(function () {

    var module = angular.module("angular-head", []);

    module.provider("HeadService", [
        function () {

            var that = this;
            that.title = "Unconfigured HeadService";
            that.metas = [];
            that.jonLd = {};
            that.useRoute = false;

            that.setTitle = function (title) {
                that.title = title;
            };

            that.setMetas = function (metas) {
                that.metas = metas;
            };

            that.setJsonLd = function (defaultJsonLd) {
                that.jsonLd = defaultJsonLd;
            };

            that.useRoute = function (useRoute) {
                that.useRoute = useRoute;
            };

            that.$get = ["$log", "$rootScope",
                function ($log, $rootScope) {
                    $log.debug("HeadService: starting");

                    var me = {
                        title: "",
                        metas: [],
                        jsonLd: {},
                        setTitle: function (title) {
                            if (title) {
                                me.title = title + " | " + that.title;
                            } else {
                                me.title = that.title;
                            }
                        },
                        setMeta: function (newMeta) {
                            $log.debug("HeadService: setting meta: %o", newMeta);
                            // See if we can find an old one
                            var meta = me.metas.find(function (meta) {
                                if (newMeta.name) {
                                    return meta.name === newMeta.name;
                                } else {
                                    return meta.property === newMeta.property;
                                }
                            });

                            if (meta) {
                                // Found one - replacing
                                angular.copy(newMeta, meta);
                            } else {
                                me.metas.push(newMeta);
                            }
                        },
                        addMeta: function (newMeta) {
                            me.metas.push(newMeta);
                        },
                        reset: function () {
                            me.title = that.title;
                            me.metas.length = 0;
                            for (var i = 0, len = that.metas.length; i < len; ++i) {
                                me.metas.push(that.metas[i]);
                            }
                            me.jsonLd = that.jsonLd;
                        }
                    };

                    $rootScope.$on("$routeChangeStart", function () {
                        $log.debug("HeadService: routeChangeStart - resetting header");
                        me.reset();
                    });

                    $rootScope.$on("$routeChangeSuccess", function (event, current, previous) {
                        $log.debug("HeadService: routeChangeSuccess - current: %o", current);

                        if (current.$$route.title) {
                            me.setTitle(current.$$route.title);
                        }

                        if (current.$$route.metas) {
                            for (var i = 0, len = current.$$route.metas.length; i < len; ++i) {
                                me.setMeta(current.$$route.metas[i]);
                            }
                        }

                    });

                    return me;

                }
            ];

        }
    ]);

    module.directive('head', ["$log",
        function ($log) {
            return {
                restrict: 'E',
                scope: false,
                controller: ["$log", "HeadService",
                    function ($log, headService) {
                        $log.debug("HeadController: starting");

                        var that = this;
                        that.headService = headService;
                    }
                ],
                controllerAs: "headCtrl"
            };
        }
    ]);

    module.directive('title', ["$log", "HeadService",
        function ($log, headService) {
            return {
                restrict: 'E',
                link: function (scope, elem, attrs) {
                    scope.title = elem[0];
                },
                controller: ["$log", "$scope", "$window", "HeadService",
                    function ($log, $scope, $window, headService) {
                        $log.debug("TitleController: starting - scope is: %o ", $scope);

                        var that = this;
                        that.headService = headService;

                        $scope.$watch(function () {
                            return headService.title;
                        }, function () {
                            $log.debug("TitleController: headService.title has changed - now: %o", headService.title);
                            $scope.title.innerText = headService.title;
                        });

                    }
                ],
                controllerAs: 'titleCtrl'
            };
        }
    ]);

    module.directive("dynamicMetas", ["$log",
        function ($log) {
            return {
                restrict: 'A',
                controller: ["$log", "HeadService",
                    function ($log, headService) {
                        $log.debug("DynamicMetasCtrl: starting");

                        var that = this;

                        that.headService = headService;
                    }
                ],
                controllerAs: "dynamicMetasCtrl",
                replace: true,
                template: '<meta data-ng-repeat="meta in dynamicMetasCtrl.headService.metas" data-ng-attr-name="{{meta.name}}" data-ng-attr-property="{{meta.property}}" data-ng-attr-content="{{meta.content}}"/>'
            };
        }
    ]);

    module.directive("jsonLd", ["$log",
        function ($log) {
            return {
                restrict: 'A',
                controller: ["$log", "HeadService",
                    function ($log, headService) {
                        $log.debug("JsonLdController: starting");

                        var that = this;

                        that.headService = headService;
                    }
                ],
                controllerAs: "jsonLdCtrl",
                replace: true,
                template: '<script type="application/ld+json" data-ng-bind="jsonLdCtrl.headService.jsonLd"></script>'
            };
        }
    ]);

    module.directive("setTitle", ["$log",
        function ($log) {
            return {
                restrict: 'E',
                scope: {
                    title: "@"
                },
                controller: ["$log", "$scope", "HeadService",
                    function ($log, $scope, headService) {
                        headService.setTitle($scope.title);
                    }
                ],
                replace: true,
                templateuRL: "views/empty.html"
            };
        }
    ]);

    module.directive("setMeta", ["$log",
        function ($log) {
            return {
                restrict: 'E',
                scope: {
                    name: "@",
                    property: "@",
                    content: "@"
                },
                controller: ["$log", "$scope", "HeadService",
                    function ($log, $scope, headService) {
                        if ($scope.name) {
                            headService.setMeta({name: $scope.name, content: $scope.content});
                        } else if ($scope.property) {
                            headService.setMeta({property: $scope.property, content: $scope.content});
                        }
                    }
                ],
                replace: true
            };
        }
    ]);

})();
/*
 * vim: ts=4 et nowrap autoindent
 */