# Introduction

The angular-head module is designed to manipulate html head values (title and meta tags) on the fly.

# Installation

The angular-head module can be installed using bower:

````
$ bower install angular-head --save
```

# Load script

```
<script type="text/javascript" src="bower_components/angular-head/angular-head.js"></script>
```

# Inject Angular dependency

```
var app = angular.module("app", ["angular-head"]);
```

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


