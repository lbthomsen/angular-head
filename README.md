# Introduction

The angular-head module is designed to manipulate html head values (title and meta tags) on the fly.

# Installation

The angular-head module can be installed using bower:

````
$ npm install angular-head-lbthomsen --save
```

# Load script

```
<script type="text/javascript" src="node_modules/angular-head-lbthomsen/angular-head.js"></script>
```

# Inject Angular dependency

```
var app = angular.module("app", ["angular-head"]);
```

# Configure Module

The angular-head module should be configured during the configuration phase
of the application.

```
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
```

# Define head

The `<head` section of the html, but include a `<title>` tag and if meta tags
are used also a special meta tag:

```
<html>
<head>
    <title>What is here will be changed</title>
    <meta data-dynamic-metas />
</head>
<body>
...
</body>
</html>
```

# Adjusting values

The tags can be updated in three different ways:

## Using Template Tags

The title and meta tags can be configured in the Angular templates using the 
tags `<set-title>` and `<set-meta>`:

```
<set-title title="This will be the page title"/>
<set-meta name="description" content="This will be the page description"/>
... rest of the template
```

## Programmatically in controller

```
module.controller("SomeController", ["HeadService", 
    function(headService) {
        headService.setTitle("This is a title");
        headService.setMeta({name: "description", content: "This is a page description});
    }
]);
```

## Using ngRoute

```
    module.config(['$routeProvider', function($routeProvider) {

        $routeProvider
        .when('/about', {
            templateUrl: "/views/about.html", 
            controller: "AboutController", 
            controllerAs: "aboutCtrl", 
            title: "About", 
            metas: [{name: "description", content: "About This Service"}]
        });
    
    }]);
```
