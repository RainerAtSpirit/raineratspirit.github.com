---
layout: post
title: "Dynamic search in a static world"
description: ""
category: "cutting Teeth"
tags: ["AngularJS", "Jekyll"]
published: true
---
{% include JB/setup %}

While adding search to a new blog might not be the most important thing to do, it gave me perfect excuse to work a
little with Jekyll liquid and AngularJS. There was no need to reinvent the wheel as
[Edward Hotchkiss][1] already implemented something
pretty similiar.
[1]: http://edwardhotchkiss.com/blog/2012/03/11/jekyll-live-search-with-angular.js/
Therefore here are just the major differences, I expect that you're familiar with [Edward's post][1],
if not please read it first. AngularJS v1.0.1 is used and by using a small liquid condition scripts are only loaded on
the search page.

Here's the relevant excerpt from default.html.

<script src="https://gist.github.com/3076150.js?file=headerexcerp.html"> </script>

Edward is making an XHR call to retrieve the RSS-feed `feed.xml` and then parses the xml. This is a pretty
straight forward implementation, but I wanted to omit this extra XHR call and 'bootstrap' the information into the
initial page. Therefore a liquid helper is used to create an JavaScript array with the relevant post information.
This has the additional advantage that you can leverage liquid filter like
`strip_html | truncate : 120 ` (on the server side!) to clean up and cut down potentially large information.

One of my goal was to having a search box on every page, so the Controller was enhanced that the `$scope
.searchText = ''` can now be passed in via querystring as well.

BTW: You can give it a try on all blog pages, to see it in action.

{% highlight javascript linenos %}
/**
 * Setup Module with `highlight` filter
 */

var JekyllApp = angular.module('JekyllApp', [], function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(false);
});

JekyllApp.filter('highlight', function () {
    return function (text, filter) {
        if (filter === '') {
            return text;
        }
        else {
            return text.replace(new RegExp(filter, 'gi'), '<span class="match">$&</span>');
        }
    };
});

/**
 * Inject required $objects into our Controller
 */

JekyllSearchController.$inject = ['$scope', '$location', '$window'];

function JekyllSearchController($scope, $location, $window) {
    // Optionally passing in a search term via q=XXX
    // $location.search won't work without html5Mode false using window.location.search instead
    // $scope.searchText =  $location.search().q || "";
    // Todo: Consider switching back to $location.search once it supports html5Mode false
    $scope.searchText = '';
    var search = window.location.search;
    if (search.indexOf('?q=') > -1 || search.indexOf('&q=') > -1) {
        var params = {};
        angular.forEach(search.split('?')[1].split('&'), function (param) {
            params[param.split('=')[0]] = param.split('=')[1];
        });
        $scope.searchText = params.q || '';
    }

    $scope.externalLink = function () {
        // Todo: Figure out the correct AngularJS way for a page reload on href click
        // https://github.com/angular/angular.js/issues/1102
        $window.location.href = this.post.url;
    };
    $scope.posts = JekyllApp.posts;
}

{% endhighlight %}

There are a couple of things that I didn't grasp
fully at the moment I've to admit, like
- why `$location.search()` only works with `$locationProvider.html5mode(true)` or
- why AngularJS doesn't have an easy (to discover) method that allows a full page reload on href click

so I'd be happy if somebody could fill the gaps.
In the meantime workarounds are used, so querystring `q` is determined in a good old fashioned way and ther's a
thread on the
 [angular groups](https://groups.google.com/forum/#!msg/angular/zu5RMEWWyPQ/1yiOm9p5CCkJ) that discusses page reload.

{% highlight html linenos %}
<script type="text/javascript">
   // Using liquid to populate JeykllApp.posts array
   JekyllApp.posts = {{ "{% include Helper/JekyllAppPosts " }}%}
</script>

<div id="search-container" class="entrance" ng-app="JekyllApp" ng-controller="JekyllSearchController">
  <div class="entrance-item">
    <p><input id="searchText" type="search" placeholder="Live Search Posts..." ng-model-instant ng-model="searchText" />
  </div>
  <div class="entrance-item">
    <ul>
      <li ng-repeat="post in posts | filter:searchText">
         <span ng-bind-html-unsafe="post.date | date:'MMM d, y' | highlight:searchText"></span> &raquo;
        <a ng-href="{{ "{{ post.url " }}}}" ng-click="externalLink()"
           ng-bind-html-unsafe="post.title | highlight:searchText"></a>
          <div class="preview" ng-bind-html-unsafe="post.content | highlight:searchText"></div>
      </li>
    </ul>
  </div>
</div>
{% endhighlight %}


So where's the magic `include Helper/JekyllAppPosts` coming from? This is whers my first liquid expression kicks
in and returns an
array with title, url, date and content information, formatted in such a way that it can be easily consumed in
AngularJS.

<script src="https://gist.github.com/3076150.js?file=liquid helper"> </script>

All in all the implementation was pretty straight forward, even when there were a couple of gotchas.

On very last thing that I'd like to share is that on my local box jekyll is running with liquid 2.3 whatever,
which allows you to use `{{ "{% raw " }}%}`, while github is using liquid 2.2 whatever and therefore the older
`{{ "{% literal " }}%}` expression is used. After being hit by that one I finally understood Edward's LeftCurleys
setting in \_config.yml and **I feel his pain**.

Anyway a rule of thumb, don't use those tags for the time being and rewrite the code instead. There are some
instructions from
[Khaja Minhajuddin](http://stackoverflow.com/questions/3426182/how-to-escape-liquid-template-tags) that doesn't
require plug-ins.

