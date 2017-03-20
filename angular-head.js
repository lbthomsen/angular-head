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
            that.metas = {};
            that.schema = {};
            that.useRoute = false;

            that.setTitle = function (title) {
                that.title = title;
            };

            that.setMetas = function (metas) {
                that.metas = metas;
            };

            that.setSchema = function (schema) {
                that.schema = schema;
            };

            that.$get = ["$log", "$rootScope",
                function ($log, $rootScope) {
                    $log.debug("HeadService: starting");

                    var me = {
                        defaultTitle: that.title,
                        defaultMetas: {},
                        defaultSchema: {},
                        title: "",
                        metas: {},
                        schema: {},
                        setTitle: function (title) {
                            if (title) {
                                me.title = title + " | " + that.title;
                            } else {
                                me.title = that.title;
                            }
                        },
                        setMeta: function (name, description) {
                            $log.debug("HeadService: setting meta: %o", name);
                            me.metas[name] = description;
                        },
                        reset: function () {
                            $log.debug("HeadService: reset");
                            me.title = me.defaultTitle;
                            angular.copy(me.defaultMetas, me.metas);
                            angular.copy(me.defaultSchema, me.schema);
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

                    angular.copy(that.metas, me.defaultMetas);
                    angular.copy(that.schema, me.defaultSchema);

                    me.reset();

                    return me;

                }
            ];

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

    module.directive('meta', ["$log",
        function ($log) {
            return {
                restrict: 'E',
                link: function (scope, elem, attrs) {
                    $log.debug("MetaDirective: link");
                    // Store the element in the scope
                    scope.meta = elem[0];
                },
                scope: {},
                controller: ["$log", "$scope", "$window", "HeadService",
                    function ($log, $scope, $window, headService) {
                        $log.debug("MetaController: starting - scope is: %o ", $scope);

                        $scope.$watch(function () {
                            return $scope.meta;
                        }, function () {
                            if ($scope.meta) {
                                if ($scope.meta.name) {
                                    $log.debug("MetaController: got name %s", $scope.meta.name);

                                    // Now let's watch the service for that name
                                    $scope.$watch(function () {
                                        return headService.metas[$scope.meta.name];
                                    }, function () {
                                        $log.debug("MetaController: headService.metas[%o] = %o", $scope.meta.name, headService.metas[$scope.meta.name]);
                                        $log.debug("MetaController: headService.metas = %o", headService.metas);
                                        if (headService.metas[$scope.meta.name]) {
                                            $scope.meta.content = headService.metas[$scope.meta.name];
                                        }
                                    });
                                }
                            }
                        });

                    }
                ]
            };
        }
    ]);

    module.directive("schemaOrg", ["$log",
        function ($log) {
            return {
                restrict: 'A',
                controller: ["$log", "$scope", "HeadService",
                    function ($log, $scope, headService) {
                        $log.debug("SchemaController: starting");

                        var that = this;
                        that.jsonLd = [];

                        $scope.$watch(function() {
                            return headService.schema;
                        }, function() {
                            that.jsonLd.length = 0;
                            Object.keys(headService.schema).forEach(function(key) {
                                that.jsonLd.push(headService.schema[key]);
                            });
                        });
                    }
                ],
                controllerAs: "schemaCtrl",
                replace: true,
                template: '<script type="application/ld+json" data-ng-bind="schemaCtrl.jsonLd"></script>'
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
                    content: "@"
                },
                controller: ["$log", "$scope", "HeadService",
                    function ($log, $scope, headService) {
                        headService.setMeta($scope.name, $scope.content);
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
