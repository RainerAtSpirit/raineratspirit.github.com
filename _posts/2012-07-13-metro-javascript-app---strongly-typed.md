---
layout: post
title: "Metro JavaScript App - strongly typed?"
description: ""
category: 'Good to know'
tags: ["JayData", "Win8", "WinJS"]
---
{% include JB/setup %}
Let's face it, even when I choose to build Metro style apps with HTML5, JavaScript and
CSS because I love the dynamic nature of this environment, there are times where I'm a little bit jealous of that
strong typed stuff that you get in that boring C#/XAML world ;-).

Let see if we can take an existing application like Jeremy Foster's excellent [A Metro Netflix browser in HTML/JS -
The Hub page][], add some magic ([JayData][]) to it and see if that helps reducing my jealousy .

Start by downloading Jeremy's code that is attached to the blog.
While on it don't miss to download and install [Fiddler 4][] and the [Windows 8 AppContainer Loopback Utility][].

Simply follow the Jeremy's instructions, fire up fiddler and run the code.

###Checkpoint: Make sure that you see some titles coming back from Netflix.
[ ![Image](/img/metro-javascript-app---strong-typed-fiddler.jpg "Fiddler Response") ]

Looking at fiddler you should see something like the above. Notice the response size of about 740K. At the moment we
 are not leveraging OData to its full extend. I know that if you're an OData expert you already spoted
 a way to reduce the response by using server side projection. But wait, maybe there are others that aren't experts
 yet, so we come back to this a little later.

Next download the latest version of `JayData` and `JaySvcUtil` from the [download area][].
Extract both files into two separate directories, we don't want all of them lingering around in our projcect
directory, we cherry pick instead the bare minimum.

So from the JayData directory add the following files into the project's **js** directory
- JayDat-vsdoc.js
- JayData.js
- datajs-1.0.2.js

Open up your preferred command line and navigate to the `JaySvcUtil` directory. 'JaySvcUtil.exe' is command line
utility that allows to converting OData $metada information into a strongly typed JavaScript object. While it has
several switches for fine tuning, we only require three of them.

- `-m` $metadata url of your service e.g http://odata.netflix.com/catalog/$metadata
- `-n` Namespace e.g. here Netflix
- `-o` output file e.g. Netflix.js
{% highlight bash %}
Rainer@METRORP ~/Downloads/JaySvcUtil
$ JaySvcUtil.exe -m 'http://odata.netflix.com/catalog/$metadata' -o Netflix.js -n 'Netflix'
{% endhighlight %}

If everything went smoothly the system should now generate your 'Netflix.js' file. Depending on the complexity of
your service you might receive a couple of warning message, which - most of the time - can be ignored.
Please add the newly created 'YourOutputFile.js' to the project as well.

Your default.html should now look like this:
{% highlight html linenos %}
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>NetflixBrowser</title>

    <!-- WinJS references -->
    <link href="//Microsoft.WinJS.1.0.RC/css/ui-dark.css" rel="stylesheet" />
    <script src="//Microsoft.WinJS.1.0.RC/js/base.js"></script>
    <script src="//Microsoft.WinJS.1.0.RC/js/ui.js"></script>

    <!-- NetflixBrowser references -->
    <link href="/css/default.css" rel="stylesheet" />
    <script src="/js/default.js"></script>
    <script src="/js/navigator.js"></script>

    <!-- JayData references -->
    <script src="/js/datajs-1.0.2.js"></script>
    <script src="/js/JayData.js"></script>
    <script src="/js/netflix.js"></script>

</head>
<body>
    <div id="contenthost" data-win-control="Application.PageControlNavigator" data-win-options="{home: '/pages/home/home.html'}"></div>
    <!-- <div id="appbar" data-win-control="WinJS.UI.AppBar">
        <button data-win-control="WinJS.UI.AppBarCommand" data-win-options="{id:'cmd', label:'Command', icon:'placeholder'}"></button>
    </div> -->
</body>
</html>
{% endhighlight %}


###Checkpoint: Run the app just to see if all files can be loaded and no error occurs.
[ ![Image](/img/metro-javascript-app---strong-typed-params.jpg "Netflix.js errors") ]

While doing that in my case Visual studio was complaining about some errors in `Netflix.js` and right so.
You can see that there are a couple of mistpyed `..., params : , ...` lingering around. If that the case for you as
well go ahead and remove them. Not quite sure if that's Netflix or an JayData issue,
but it's reported to JayData.

Alright almost done. Let's open up `js/home.js` and
1. get rid of the current WinJS.xhr call
2. add some references to the JayData files to get Intellisense support.

You're home.js should look like below. Remember that you need to compile once to get Intellisense picking
 up the changes.

{% highlight javascript linenos %}
/// <reference path="/js/jaydata.js" />
/// <reference path="/js/jaydata-vsdoc.js" />
/// <reference path="/js/netflix.js" />
(function () {
 "use strict";

 WinJS.UI.Pages.define("/pages/home/home.html", {
     // This function is called whenever a user navigates to this page. It
     // populates the page elements with the app's data.
     ready: function (element, options) {

         var titlesListGrouped = new WinJS.Binding.List().createGrouped(
             function (i) { return i.title.charAt(0).toUpperCase(); },
             function (i) { return { firstLetter: i.title.charAt(0).toUpperCase() }; }
         );

         var list = q("#list").winControl;
         list.itemDataSource = titlesListGrouped.dataSource;
         list.itemTemplate = q("#template");
         list.groupDataSource = titlesListGrouped.groups.dataSource;
         list.groupHeaderTemplate = q("#headertemplate");

     }
 });
})();
{% endhighlight %}

Now here's the magic moment :), type in `Netflix.context.` and you should see Intellisene kicking in. Before we move
on let's celebrate by leaving the computer and doing whatever you prefer to do when you celebrate.

[ ![Image](/img/metro-javascript-app---strong-typed-Intellisense.jpg "Intellisense") ]

Alright, back to work! Your first goal would be to come up with an equivalent of the original WinJS.xhr call

{% highlight javascript linenos %}
WinJS.xhr({ url: "http://odata.netflix.com/Catalog/Titles?$format=json&$top=200" })
    .then(function (xhr) {
        var titles = JSON.parse(xhr.response).d;
        titles.forEach(function (i) {
            titlesListGrouped.push({
                title: i.ShortName,
                imageUrl: i.BoxArt.LargeUrl
            });
        });
    });
{% endhighlight %}

Converting this is pretty straight forward. `Netflix.context` is already aware of the URL and JayData will add the
appropriate Request-Header, so that the service returns Json. That leaves us with teaching the system that we would
like to retrieve 200 Titles.
By looking at the available methods for `Netflix.context.Titles` we notice
the `take()`method, which might sound familiar to many of you. There are several other like `include()`, `filter()`,
`orderBy()`, `skip()`, `map()` and `forEach` that are all part of the JavaScript Language Query.
If you never heard of any of those, don't worry you can check them out at [(JSLQ) 101][] and come back later.

The last thing we need to do is reusing the logic of the original forEach loop.

{% highlight javascript linenos %}
Netflix.context.Titles
    .take(200)
    .forEach(function(item) {
        titlesListGrouped.push({
            title: item.title,
            imageUrl: item.BoxArt.LargeUrl
        });
    })
{% endhighlight %}

_Please note_ that at the time of this writing, while there is an JayData deferred.js adapter available for jQuery
there's  NO WinJS aware adapter... yet. So at the moment you won't be able to create promises and use `
.then` or `.done`.

Alright how does that feel so far? Without being an OData expert you just conducted a OData query,
without leaving the comfort zone of Visual Studio and its Intellisene. Not too shabby I'd say. But let's take it a
step further and let's try making our OData request a little bit more precise.

Can we do that? Of course we can by using the `.map` method; and there's even an additional benefit to it.
_Please note_ that I couldn't
 bring Intellisense to show me available properties for `item`, but when you look at the Json returned by
 the service in Fiddler, you can see that we map `title: item.ShortName` and `BoxArt: item.BoxArt` and return that
 as an anonymous object. So in the forEach loop we access those as `item.title` and `item.BoxArt`.

{% highlight javascript linenos %}
Netflix.context.Titles
    .map(function(item) {
        return {
            title: item.ShortName,
            BoxArt: item.BoxArt
        };
    })
    .take(200)
    .forEach(function(item) {
        titlesListGrouped.push({
            title: item.title,
            imageUrl: item.BoxArt.LargeUrl
        });
    })
{% endhighlight %}

[ ![Image](/img/metro-javascript-app---strong-typed-fiddler140k.jpg "Fiddler 140K") ]
If you are now running the application and watch Fiddler you can see that the return set is way smaller than before. We
are down from **740K** to about **140K**. So by using the strongly typed Netflix object you not only gained the
benefits of
Intellisense support, you somehow became an OData expert at no cost as well ;-).
Closer watching the URL in Fiddler reveals that there's a new `$select=ShortName,BoxArt` parameter that was added by
JayData, so now the projection is accomplished at the server side and no longer at the client.


That's it for today and I wanna leave you with a choice.

1. You can can get rid of all JayData files you've added and apply your new knowledge about the `$select` parameter
to enhance the original WinJS code manually. You will see the same performance benefits that we got here.

   Just so that you know, there's nothing wrong about that, really.
2. But maybe you want to stay a little with JayData and see how it pays off.

For those of you, who are on the fence line, it might be good to know that JayData supports a couple of other formats
that
can be all accessed using the same JSQL you started to get familiar with.
> Facebook Query Language, SqlLite, Yahoo Open Data Tables, InMemoryDB, WebSQL, IndexedDb
and there are more in the pipeline

I'd be glad to hear from you about your decission and the reasoning behind it.


PS: For the impatient ones that wants to start immediately with JayData version of Jeremy's Metro example feel free to
[clone this repo][].


[A Metro Netflix browser in HTML/JS - The Hub page]: http://codefoster.com/post/2012/06/13/netflixstage1.aspx
[JayData]: http://jaydata.org/
[Fiddler 4]: http://www.fiddler2.com/fiddler2/version.asp
[Windows 8 AppContainer Loopback Utility]: http://www.fiddler2.com/Fiddler2/extensions.asp
[download area]: http://jaydata.org/download
[clone this repo]:https://github.com/RainerAtSpirit/JayData-Netflix
[(JSLQ) 101]:http://jaydata.org/blog/javascript-language-query-jslq-101