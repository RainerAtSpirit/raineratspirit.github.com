---
layout: post
title: "The Ferrari meets JayData"
description: ""
category: 'Good to know'
tags: ['SharePoint', 'Knockout', 'JayData', 'RequireJS']
---
{% include JB/setup %}


Good morning, good afternoon, good evening to you.


Welcome back to a new episode in the **`Ferrari`** series. For
those of you who remember what I call the **`Ferrari`** read on; all other please make yourself familiar with
[Part 1] and [Part 2] in this series before moving on.

In [Part 2] we
ended up with a HTML5 app that shows a nice metro style tile view of SharePoint lists and libraries. This time we want
to enhance the solutions  so that it retrieves items through SharePoint's OData service. Sorry SP2007 we've to leave
you behind as this service was first introduced in
SP2010. Don't worry too much though; using REST is forward thinking as SP2013
 will expose a whole new [REST API] that will
 greatly expanding the existing capabilities.

In the simplest form you could make `XHR` calls to the service endpoint at `_vti_bin/listdata.svc`,
but we're not going down that route.
Instead we're using [JayData] for doing the heavy lifting. While being relatively new to the market JayData brings an
astonishing range of capabilities to the
table, one of them is the abstracting of underlying storage provider. Yes, you heard me right;
OData is just one of the supported storage provider, see [JayData provider] for a full list.
Once you learned a little bit about [JSLQ] the JavaScript Query Language you will (probably) never go back talking to
 any storage provider on your own.

After settling on [JayData] the next choice is about a client framework that helps us building our dynamic UI.
JayData comes with a bunch of modules that offers integration into various third party frameworks and `knockout` is one of them.
*A word of warning* take everything that you see me doing with `knockout` with some grain of salt,
as I haven't worked with it before.
The last piece of software that I want to bring to
the table is of course RequireJS. We are going to build a JavaScript app and based on my experience there's simply
no way of writing one without it.

So without further hassle  we are now going to build a pretty straight forward three tier navigation,
which BTW will align us nicely with the Metro-style design guides; and nah, we won't do Metro style left <-> right
scrolling, this is still a web app not Window 8 Metro ;-). For the eager of you here are the links to the live demos:


[Live on SP 2010 ](http://www.spirit.de/demos/metro/zurbv3/MetroStyle.aspx)

[Live on SP 2013 ](https://spirit2013preview-public.sharepoint.com/zurbv3/MetroStyle.aspx)

**First tier: ** Entry screen consists of a Tile View (green) and a Login View (yellow). The whole page can be
served anonymously, but in order to see the next tier you've to log on. You probably heard me saying that before "SharePoint
 OData service won't work anonymously".

![Tile View](/img/2012-08-01-TileView.jpg)

The following HTML is used as by Knockout to produce the Tile View.

{% highlight html linenos %}
<div class="row" id="tileVM">
    <div class="twelve columns tiles"
         data-bind="foreach: TileData, updateTilesOnce: true">
        <div class="live-tile" data-stops="100%" data-speed="750" data-delay="-1"
             data-bind="class: color + ' ' + size,
                        attr: {'data-mode': mode ? mode : '', 'data-direction': direction} ,
                        click: $root.goToDetail">
            <span class="tile-title" data-bind="text: title"></span>
            <span class="badge" data-bind="text: count"></span>

            <div>
                <img class="micon" data-bind="attr: {src: icon}"/>
            </div>
            <div>
                <h3 data-bind="text: backTitle"></h3>
                <span class="prettyDate" data-bind="attr: {title: prettyDate}"></span>
            </div>
        </div>
    </div>
</div>
{% endhighlight %}


And here's the `TileViewModel` as RequireJS module leveraging the revealing module pattern. I've seen John Papa
[mentioning this pattern](http://johnpapa.net/spapost2) more than once. BTW feel free to provide feedback about
your favorite way to structure knockout apps.

{% highlight javascript linenos %}
define (['knockout', 'helper'], function ( ko, fn ) {
    "use strict";

    return function () {
        // ko observables
        var userId = ko.observable ().subscribeTo ('userId'),
            selectedList = ko.observable ().subscribeTo ('selectedList'),
            TileData = ko.observableArray ([]),
        // functions
            goToDetail;

        // end of var declaration

        goToDetail = function ( tile, event ) {
            if ( userId () !== 'anonymous' ) {

                selectedList (fn.cleanup (tile.title));
                location.hash = '/view/' + selectedList ();
            }
            else {
                alert (' Make sure to log on.');
            }
        };

        // Bootstrap
        TileData (app.tilesData.tiles.tile);


        // Return public methods
        return{
            userId : userId,
            TileData : TileData,
            goToDetail : goToDetail
        };
    };
});
{% endhighlight %}

Our trusted DVWP produces the required `app.tilesData.tiles.tile` array that is used to bootstrap the `TileData`
observableArray. I'm not going to cover the required XSLT here as this is just a variation what we did in [Part 2],
but if you want to deep dive again take a look at this gist [DVWP's settings and XSLT](https://gist.github
.com/3227125#L150).

Here's the HTML for the login area and the related LogonViewModel.

{% highlight html linenos %}
 <div id="logonVM">
    <div data-bind="visible: userId() !== 'anonymous' " style="display: none;">
        You're logged on as: <span class="success label" data-bind="text: userId"></span>
    </div>
    <div data-bind="visible: userId() === 'anonymous' " style="display: none;">
        <a href="#" data-bind="attr: {href: loginURL}" class="button"> Sign
            in</a>
        with username: <span class="secondary label">ODataDemo</span> password: <span class="secondary label">OData!Demo</span>
    </div>
</div>
{% endhighlight %}


{% highlight javascript linenos %}
define (['knockout'], function ( ko ) {
    "use strict";

    return function () {
        var userId = ko.observable (app.configMap.userId).publishOn ('userId'),
            loginURL;

        loginURL = ko.computed (function () {
            return '../_layouts/Authenticate.aspx?Source=' + encodeURIComponent (location.pathname) + location.hash;
        });

        // Return public methods
        return {
            userId : userId,
            loginURL : loginURL
        }
    }
});
{% endhighlight %}


**Second tier: ** The Login View (yellow) will show your username once you're logged in and by clicking on one of the
tiles you'll see 10 items of the chosen list or library. Bear in mind that this is a demo, but adding paging,
sorting and filtering per data source **in the UI** would be a pretty straight forward as they are already
implemented in the ListingViewModel.

![Listing View](/img/2012-08-01-ListingView.jpg)

**Third tier: ** By clicking on one of the level 2 tiles you'll see the full detail information on the right. One of
the benefits of working with OData is that is allows you to get multiple related information in single call,
which greatly simplifies your life as client side app developer.

From the [OData website](http://www.odata.org/documentation/uri-conventions/#ExpandSystemQueryOption)

> A URI with a $expand System Query Option indicates that Entries associated with the Entry or Collection of Entries
> identified by the Resource Path section of the URI must be represented inline (i.e. eagerly loaded). For example,
> if you want to identify a category and its products, you could use two URIs (and execute two requests),
> one for /Categories(1) and one for /Categories(1)/Products. The '$expand' option allows you to identify related
> Entries with a single URI such that a graph of Entries could be retrieved with a single HTTP request.



![Detail View](/img/2012-08-01-DetailView.jpg)

For this demo I haven't separated the Listing and the Detail view and the Detail view is just an un-styled list of
properties for the current item.
For a larger application it would probably make sense to separate the views and work the detail view a little bit
 out `;-)`.

To see the full html and JS that is involved take  a look at [this gist](https://gist.github.com/3227125),
I'm going to concentrate on the parts that deal with the JayData configuration here.

But before we can do that, we need to take quick look how all the various VMs are integrated by RequireJS. As in
almost every standard
RequireJS app there's a `main.js` file that allows you to configure various aspects and then kick off your app.

{% highlight javascript linenos %}
require.config({
   //By default load any module IDs from js/lib
    baseUrl : 'libs',
    paths : {
       // Try loading from CDN first
       ...

require(['app'], function (app) {
    // we can safely kick of the app even before document.ready
    app.init();
});
{% endhighlight %}

Within app.js we define dependencies on the various VMs that you've seen earlier and within the `init` method we use
`ko.applyBindings()` to bind them to the corresponding element in the DOM. As said I'm new to knockout,
so I leave it to the experts if that's a recommend pattern or not.  At least it's working,
so it can't be totally wrong ;-).
  Path.js is used as a light alternative to sammy.js in order to setup some URL rules. As you can see Ryan Niemeyer's
  excellent [postbox] -a native ko pubsub sytem- is used to notify subscribers whenever changes occur.

[postbox]: http://www.knockmeout.net/2012/05/using-ko-native-pubsub.html

{% highlight javascript linenos %}
define (['jquery', 'knockout', 'LogonVM', 'TileVM', 'ListingVM', 'postbox', 'path', 'appData', 'kocBH' ],
    function ( $, ko, LogonVM, TileVM, ListingVM, postbox ) {
        "use strict";

        var init = function () {

            // Exposing ko as global
            window.ko = window.ko || ko;
            var $tileContainer = $ ('#tileVM');

            // Configuring JayData to use current site's Odata service
            app.context = new app.MetroStyleDataContext ({ name : 'oData', oDataServiceHost : '../_vti_bin/listdata.svc' });

            // binding ko to the appropriate container
            ko.applyBindings (new TileVM (), document.getElementById ('tileVM'));
            ko.applyBindings (new LogonVM (), document.getElementById ('logonVM'));
            ko.applyBindings (new ListingVM (), document.getElementById ('listingVM'));

            // Client-side routes. Path exposed as global via shim configuration
            function toggleTiles() {
                var isVisible = $tileContainer.css ('display') === 'block';
                isVisible ? $tileContainer.slideUp (300) : $tileContainer.slideDown (300);
            }

            Path.map ("#/view/:list").to (function () {
                postbox.publish ('selectedList', this.params.list);
            }).enter (toggleTiles);

            Path.map ("(#)").to (function () {
                postbox.publish ('selectedList', '');
            }).enter (toggleTiles);

            Path.listen ();
        };

        return {
            init : init
        }

    });
{% endhighlight %}


Boy, Rainer! All those talk about RequireJS and knockout basics. I'm already familiar with it,
so where's the beef? You promised to tell us about JayData, didn't you?

Yes I did and here you go.

**Part 1**: Retrieving ListingView date via OData service.

{% highlight javascript linenos %}
 postbox.subscribe ("selectedList", function ( newValue ) {
    if ( app.configMap.userId === 'anonymous' ) {
        return alert ('Make sure to log on.');
    }
    if ( newValue !== '' ) {
        // Clean out existing itemDetail
        itemDetail ([]);
        var base = app.context[newValue],
            myBase = _.extend ({}, base),
            sortExp = 'it.' + orderBy ();

        if ( orderAsc () ) {
            _.extend (myBase, myBase.orderBy (sortExp));
        }
        else {
            _.extend (myBase, myBase.orderByDescending (sortExp));
        }
        _.each (includeArray (), function ( inc ) {
            _.extend (myBase, myBase.include (inc));
        });
        myBase.map (chooseMap (newValue))
            .take (take ())
            .toArray (allItems);
    }
    else {
        // Clean out existing allItems
        allItems ([]);
        // Clean out existing itemDetail
        itemDetail ([]);
    }
});
{% endhighlight %}

Within ListingViewModel.js you find the above  `postbox.subscriber` that listen to any change in the
`selectedList` channel. After checking if there's a non empty value and that the user is already logged in [JayData]
takes over.

1. `app.context` knows about all lists and libraries, so here we use `base` to select a specific one
`var base = app.context[newValue]`

2. `orderBy()` or `orderByDescending()` are using the default sorting criteria . This can be modified during
runtime by updating the `OrderAsc` and `OrderBy` observables.

 3. `include()` in OData terms maps to the OData `$expand` verb. Default settings here are `CreatedBy` and
 `ModifiedBy`. There's a `includeArray()` observabelArray that is used to store the ones you're interested in.

 4. `map()` mapping or projection is another important feature that allows you to select specific fields instead
 of retrieving all information. The [`chooseMap()` method](https://gist.github.com/3237820#L43) is used to
 retrieve a small set of fields based on
 their availability e.g. `Title` vs. `Name` vs `URL`.

5. `take()` allows you to restrict the number of items returned by the system. Again a observable is used to store
the default.

6. `toArray()` and finally this method is used to update the `allItems` observableArray. For those of you that are
curious how that works under the cover, take a look at the [following blog post](http://jaydata
 .org/blog/how-to-use-jaydata-with-knockoutjs).

**Part 2**: Retrieving the Detail View data for a selected item.

{% highlight javascript linenos %}
 showDetails = function (currItem) {
    var currentList = selectedList();

    app.context[currentList]
        .single(function (item) {
            return item.Id == this.Id
        },
        {Id : currItem.Id},
        function (item) {
            var keyValue = [];
            _.each(item.toJSON(), function (val, key) {
                keyValue.push({"key" : key, "val" : val});
            });
            itemDetail([]);
            ko.utils.arrayPushAll(itemDetail(), keyValue);
            itemDetail.valueHasMutated();
        });
};
{% endhighlight %}

Come on, that's almost too easy isn't it? This time we're using [JSLQ]\`s `.single` method to retrieve ONE item based
 on a unique criteria, here the `currItem.Id`. Whenever the system returns the information it's converted to JSON.
 Underscore's  `each` method allows us to push the returned key/value pairs into the
 keyValue array. Whenever done we use `ko.utils.arrayPushAll` to update the `itemDetails()` observable and
 `valueHasMutated()` to notify it about the changes.


As you can see, we haven't dealt a bit with the native OData protocol and when you take a look at what's going over
the wire you'll be surprised how complex it can get. But luckily that is of no concern for us any longer as we only
have to deal with [JSLQ].

That's it for today, but before you ask I wanna cover two questions that I feel coming up:

Would you choose JayData for another project?

That's a clear YES. JayData is something that's better than sliced bread. Luckily it's already invented.

Would you choose knockout for another project?

Yes... most likely. After reading some of the stuff over at the [knockout site](http://knockoutjs.com/) itself,
but more
important over at [Ryan Niemeyer's blog](http://www.knockmeout.net/), I found it pretty straight forward to work with.
 By being the only overall framework that JayData supports as
module at the moment, it's the natural choice for the time being. With that said,
there are already Sencha and Titanium modules out there, so maybe there's a JayData backbone module one day... at
that point feel free to ask me that question again.

One last thing, you can find the code for the 2010 demo site on [github](https://github
.com/RainerAtSpirit/FerrariMeetsJayData).
You have to update the appdata.js in order to work in your environment. Checkout
[this post](http://localhost:4000/2012/07/13/metro-javascript-app---strongly-typed/) that guides you through the
required steps with `JaySvcUtil`.

[Part 1]: http://rainerat.spirit.de/2012/07/15/sharepoint-dvwp-from-workhorse-to-ferrari-in-7-steps/
[Part 2]: http://rainerat.spirit.de/2012/07/20/the-sharepoint-dvwp-in-ferrari-mode-strikes-again/
[REST API]: http://msdn.microsoft.com/en-us/library/fp142385(v=office.15).aspx
[JayData]: http://jaydata.org
[JayData provider]: http://jaydata.org/providers
[JSLQ]: http://jaydata.org/blog/javascript-language-query-jslq-101