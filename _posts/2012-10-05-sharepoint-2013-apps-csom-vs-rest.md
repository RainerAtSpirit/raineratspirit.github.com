---
layout: post
title: "SharePoint 2013 apps: CSOM vs. REST?"
description: ""
category: 'Good to know'
tags: ['SharePoint 2013', 'AutoHosted Apps', 'REST', 'TypeScript']
---
{% include JB/setup %}


Hi there,

Have your seen  Microsoft's [TypeScript] preview already? Are you curious how that will help you building
SharePoint 2013 apps? Eager to get your hands dirty? So the good news is that by simply following the steps
outlined in the [last blog], this time using the TypeScript [ToDoMVC example] as your *a la
carte* selection, you will be up and running in minutes.

![TypeScript SharePoint 2013 app](/img/2012-10-05-TypeScriptToDo.jpg)

Great starting point, but what's next? How can we access data that is stored inside SharePoint?
No server side code is allowed in the app model, so your options are CSOM or REST. Which one is the better
approach? Does the type of App you build has an influence? **Just to recap** you can choose between SharePoint-hosted,
Autohosted and Provider-hosted.
Other than the typical consultant answer *it depends*  `;-)` here are some reasons why I'm always using **REST**.

On the server side:

- SharePoint 2010 already provides `listdata.svc` (OData v2) -> Start building list-based CRUD solutions today
- SharePoint 2013 adds the new OData v3 `_api` endpoint -> Function support in OData v3 allows Microsoft to
expose the whole range of CSOM functionality via REST
- You can control access to external OData services by using [Business Connectivity Services]
- VS2012 makes it easier than ever to produce OData v2/v3 services based on your own data sources
- [LightSwitch] eases the creation of server side mash-ups and expose them via OData
- [OData ecosystem] provides access to data outside of the SharePoint context
- Earlier this year Microsoft announced that OData becomes an [OASIS Standard]

On the client side:

- HTML5/JavaScript apps are extremely popular nowadays and languages that compile into
JavaScript like [CoffeeScript] and [TypeScript] help to transition from server side languages to JavaScript
>CoffeeScript is to Ruby as TypeScript is to Java/C#/C++.
Luke Hoban (co-creator of TypeScript)

- SPAs are the perfect fit for mobile application
- Client side libraries like [data.js] or [jaydata.js] provide an abstraction layer for OData,
so you don't have to deal with the OData [URI Conventions] on your own.


So at the end of the day you learn OData and a couple of client side app pattern once,
and then you can reuse this knowledge over and over again... even outside of SharePoint.


With that said, we still need to figure out how to access
data that is stored in SharePoint from our remote hosted web, don't we?

The following drawing summarizes what's going on when you run an Autohosted or Provider-hosted app.

You end up with three places where data can be stored.

1. In the remote web
2. In the app web
3. In the host web


![Access data using SP.RequestExecutor](/img/2012-10-05-AccessData.jpg)


In a client-only application direct accessing data in the app web (2.) and host web (3.) from your remote app (1.) is
prohibited by [cross-site-script] restrictions. That where Microsoft's `SP.RequestExecutor.js` library comes into
play.
 As you can see in the drawing under the hood the system creates an IFrame in the remote web to a specific page in
 the app/host web
(AppWebProxy.aspx), so in effect you're "remote call" is a local call that tunnels through the IFrame to the remote
site.

Accessing data in the host web is further secured by OAuth, so in order to access information in the host web your
application has to be configured correctly using the AppManifest.xml file. Last but not least you are allowed to
configure the [App authorization policy type] e.g. if you app needs elevated privileges.

![appmanifest.xml](/img/2012-10-05-AppManifest.jpg)

In the default App for SharePoint 2013 Autohosted and Provider-hosted templates, Microsoft provides the `Tokenhelper.cs`
file to deal with the whole App authentication and authorization process. Good news is, you don't even have to deal
with that if you are creating a client side only app. Once you've access to the app web you can use the
`SP.AppContextSite(@hostweb)/` `_api` function to access information from the host web. `SP.AppContextSite()` will
then ensure that you are accessing the host data in compliance to the permissions you've configured.


Here's just some minimal code that will retrieve information from the app web and the host web.

{% highlight javascript linenos %}
function execCrossDomainRequest() {
    // executor: The RequestExecutor object
    // Initialize the RequestExecutor with the app web URL.
    var executor = new SP.RequestExecutor(appweburl);

    // Retrieve information from the app web
    executor.executeAsync(
      {
          url:
              appweburl +
              "/_api/web",
          method: "GET",
          headers: { "Accept": "application/json; odata=verbose" },
          success: successHandler,
          error: errorHandler
      }
    );

    // Retrieve information from the host web
    executor.executeAsync(
        {
            url:
                appweburl +
                "/_api/SP.AppContextSite(@hostweb)/web/?@hostweb='" + hostweburl + "'",
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: successHandler,
            error: errorHandler
        }
    );
}

function successHandler(data) {
    var result = JSON.parse(data.body).d;
    console.log('Title: ' + result.Title + ' Url: ' + result.Url);
}

{% endhighlight %}

Trying to run this code immediately won't work and the various error messages you might see can be tracked down to the
fact
that the `appweburl` is `undefined`.


![appweburl undefined](/img/2012-10-05-MissingAppWeb.jpg)

**How comes?** By default the Autohosted or Provider-hosted template have an empty app web. If the app web is empty
SharePoint doesn't create the app web for you. But as you can see in the diagram above without an app web,
there's no way to retrieve information for a client side solution. An NO, replacing `appweburl` through `hostweburl`to
 bypass the app web completely like in the following code example won't work.

![hostweb not allowed here](/img/2012-10-05-HostWeb.jpg)


Instead the system returns the following error message.


![Error message](/img/2012-10-05-Error.jpg)

**How to mitigate?** The solution is as simple as adding an `Empty Element` to the app web. This will force
SharePoint to create the app web and you've got your missing stepping stone into the host web.


![Mission accomplished](/img/2012-10-05-MissionAccomplished.jpg)

Mission accomplished and for those of you who made it till the end here's the link for today's [github repro].



[TypeScript]: http://www.typescriptlang.org/
[ToDoMVC example]: http://www.typescriptlang.org/Samples/#TodoMVC
[last blog]: http://rainerat.spirit.de/2012/09/08/mv-sharepoint-2013-apps-a-la-carte/
[MSDN]: http://msdn.microsoft.com/en-us/library/fp142382%28v=office.15%29.aspx
[LightSwitch]: http://lightswitchhelpwebsite.com/Blog/tabid/61/EntryId/133/A-LightSwitch-Netflix-OData-Mash-up.aspx
[OData ecosystem]: http://www.odata.org/ecosystem
[OASIS Standard]: http://www.microsoft.com/en-us/news/press/2012/may12/05-24ODataPR.aspx
[data.js]: http://datajs.codeplex.com/documentation
[upshot.js]: http://blog.stevensanderson.com/2012/03/06/single-page-application-packages-and-samples/
[jaydata.js]: http://jaydata.org/documentation
[CoffeeScript]: http://coffeescript.org/
[SharePoint 2013 series]: http://www.sharepointnutsandbolts.com/2012/08/sharepoint-2013-appsarchitecture.html
[Business Connectivity Services]: http://zimmergren.net/technical/sharepoint-2013-business-connectivity-services-bcs-improvements-introduction
[App authorization policy type]: http://msdn.microsoft.com/en-us/library/fp179892(v=office.15).aspx
[URI Conventions]: http://www.odata.org/documentation/uri-conventions
[cross-site-script]: http://en.wikipedia.org/wiki/Cross-site_scripting
[github repro]: https://github.com/RainerAtSpirit/TypeScript.Autohosted.App