---
layout: post
title: "Durandal SP3: Developing SharePoint SPAs made easy"
description: ""
category: 'Good to know'
tags: ['SharePoint', 'SPServices', 'Durandal']
---
{% include JB/setup %}


Hi there,

In the last post I introduced you to [Durandal] a SPA Framework, which can be used to create SPAs on top of
the SharePoint infrastructure. This time we're going to leverage Marc Anderson's [SPServices] as a data service for
our SPA.

The obvious advantage is that web services are around for a long time, so one SPA (same code base) runs in
SharePoint (2003), 2007, 2010 and 2013.


The obvious disadvantage is that web services are deprecated in 2013, so they might go away with the next major
release. If you are already running on 2010/2013 and don't have to support older browser versions you might want
looking into using REST services with [JayData] or [Breeze] instead... but that's worth another story.

Seeing is believing so here a couple of screen shots using IE versions that roughly matches the SP release time.

####SharePoint 2013 | IE 10:

![SP2013 IE10 demo](/img/2013-04-08-SP2013Demo.jpg)

####SharePoint 2010 | IE 8:

![SP2010 IE8 demo](/img/2013-04-08-SP2010Demo.jpg)

####SharePoint 2007 | IE 7:

In SP2007 you'll notice some issues with the CSS that is used in the SPA otherwise it's fully functional.  That is
less an issue with IE7, but more with SP2007 that is running pages in Quirks mode. A quick workaround would be to
apply a DOCTYPE to the pages that host your SPA.

![SP2007 IE6 demo](/img/2013-04-08-SP2007Demo.jpg)

####SharePoint 2003 | IE 6:

Sorry, I'm out of historic SharePoint VMs. Please give me a shot if somebody has still access to a
SP2003 environment. I'd love to add the missing screen shot.

Now, after hopefully getting you excited, here's the bad news. The demo is using the alpha release **2013.01ALPHA5** of
[SPServices], so I won't make the demo code available through Github as usual. I'll update this post once the next
official version of SPServices has been released and tested with Durandal SP3.

The good news is that there are two public available pages that allows you to go hands-on. Both are best viewed with
your favorite console open.

1. [development version:](http://www.spirit.de/demos/metro/DurandalSP3/index.html#/)
2. [optimized build:]

<<<<<<< HEAD
=======
**Update 2013/04/11: ** The life demo was updated based on some feedback I got. The list overview now produces a
configurable row view of lists with meta information like ItemCount and Last Modified. Step 2 and 3 are performed
once you select a list.

>>>>>>> c34478dc0444bf9eb2b5314d8e88b92e1eaab270
Without going into the details let see what the Promises demo app is doing when you activate the list route (/#lists).

1. Retrieve information about the lists in the current site via SPServices `GetListCollection` method (with caching)
2. Retrieve detail information about the selected list via SPServices `GetList` method and build a mapping that can
be used in SPServices `SPXmlToJson` method (with caching)
3. Retrieve item information via SPServices `GetListItems` (NO caching)

**Update 2013/04/11: ** The life demo was updated based on some feedback I got. The list overview now produces a
configurable row view of lists with meta information like ItemCount and Last Modified. Step 2 and 3 are performed
once you select a list.

By opening up the [optimized build] and filtering the network tab for XHR you can see the three POST requests to
`lists.asmx` nicely
lined up. Once you start selecting other lists, you'll noticed that the number of XHR requests decrease as more and
more cached information becomes available.

![Optimized build](/img/2013-04-08-OptimizedBuild.jpg)

 The development version on the other side shows far more details via the console. That allows you to get familiar
 with Durandal's application life cycle and to inspect the Json result of some `spdata` methods.

![Development](/img/2013-04-08-Development.jpg)


After reading so far and hopefully seen the Promises demo in action by yourself, I hope that you share my excitement
of the upcoming promise support in [SPServices]. Once it's part of an official release [SPServices] will become a
perfect fit for Durandal's life cycle methods.



[last post]: /2013/02/21/durandal-meets-sharepoint-2013
[Durandal]: http://www.durandaljs.com
[JayData]: http://jaydata.org
[Breeze]: http://www.breezejs.com
[SPServices]: http://spservices.codeplex.com/
[optimized build]: http://www.spirit.de/demos/metro/DurandalSP3/WebPartPage2010.aspx#/
[release announcement]: http://sympmarc.com/2013/03/09/spservices-2013-01alpha4-returns-a-deferred-object-promise/
[spdata.js]: https://gist.github.com/RainerAtSpirit/5336223#file-spdata-js
