The angular-head module is designed to manipulate html header values on the fly.

Usage steps:

1. Install with bower:

$ bower install angular-head --save

2. Load javascript

<script type="text/javascript" src="bower_components/angular-head/angular-head.js"></script>

3. Inject in Angular

var app = angular.module("app", ["angular-head"]);

4. Configure during configuration phase

app.config(["HeadServiceProvider", 
    function (headServiceProvider) {

        headServiceProvider.setTitle("Test Application");
        headServiceProvider.setDefaultMetas([
            {
                name: "description", 
                content: "Test Application - Coolest Framework"
            }, 
            {
                name: "generator", 
                content: "Testing123"
            }, 
            {
                name: "keywords", 
                content: "angular,module"
            }
        ]);

    }
]);


