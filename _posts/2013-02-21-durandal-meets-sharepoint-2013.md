---
layout: post
title: "Durandal meets SharePoint 2013"
description: ""
category: 'Good to know'
tags: ['SharePoint 2013', 'SharePoint-hosted Apps', 'MV*', 'Durandal']
---
{% include JB/setup %}

One of the benefits of the new SharePoint 2013 app model is that we are nowadays allowed to living on the cutting edge
of technology. At least if you build Autohosted or Providerhosted apps. If that what you're doing make sure to read
Scott's [Announcing release of ASP.NET and Web Tools 2012.2 Update], install the bits and then explore some of the
new MVC4 [templates].

Next step would be to look at Ananu's blog [aanuwizard] as it has step-by-step instructions for you how to add a MVC4
 project to your solution.

But how can you survive building single page application (SPA) in SharePoint if you are

+ still running on SharePoint 2010 or
+ creating SharePoint-hosted SharePoint 2013 apps

Let me introduce you to [Durandal], a pretty young SPA framework, which is named after a famous French sword.
 As it states on the web site
>Your search for a SPA framework ends here.

Durandal claims to be **comfortable**
>We didn't try to re-invent the wheel. Durandal is built on libs you know and love like jQuery,
>Knockout and RequireJS. There's little to learn and building apps feels comfortable and familiar. Dive in and enjoy.


Durandal claims to run **Anyone and Everyone**
>In the end, Durandal is just a collection of JavaScript libraries, so you don't need anything special to use it. Hop
>on over to our github repo and fork away. You can just grab the contents of the App folder and use it to kickstart
>your own project.


Alright let's test these statements by throwing Durandal into a SharePoint-hosted SharePoint 2013 app and see how it
goes.

Before we start here's a screen shot of the final result as teaser. There's an [online version] as well
and the VS template can be forked form [github].

![Creating an App module](/img/2013-02-21--finalResult.jpg)

We are starting by opening up the MVC4 Durandal starter template and creating an OOTB SharePoint 2013 app of type
SharePoint-hosted.
Files in the MVC Content and Script folder can be copied straight away, because there are already corresponded modules
 in the SP template. Before coping files in the App folder we need to create a new module with a name of `App`.
 Make sure to exclude `App/Durandal/amd/optimizer.exe` from the project as by default SP won't allow
upload of `.exe` files.

![Creating an App module](/img/2013-02-21--App-Module.jpg)

In the next step we're copying the necessary bits from `Index.cshtml` and `_splash.cshtml` into our `Default.aspx` and
adjust them to the aspx syntax.

![Creating an App module](/img/2013-02-21--Default.aspx.jpg)


In order to substitute the MVC4 BundleConfig settings for CSS and JavaScript files you must have [Web Essentials 2012]
installed. If you don't have it already, install it now!

![Creating an App module](/img/2013-02-21--BundleConfig.jpg)
![Creating an App module](/img/2013-02-21--WebEssentials.jpg)

Hit F5, wait till the upload is finished and you should see something similar like this.

![Creating an App module](/img/2013-02-21--FirstStab.jpg)

Not that bad for a first stab I'd say, but there's still room for improvement. First Durandal's navigation bar is
overlaying the default SharePoint navigation and second the app is in its developer mode. That means that all AMD
files will be served individually. In addition we are getting a whole amount of logging messages in our console.

If you are already familiar with Durandal's app structure the next two steps are obvious. If not here are some
readings that get you started

+ [Durandal docs]
+ [John Papa]
+ [Stephen Walter]

In order to address the positioning of the navbar we remove the `navbar-fixed-top`class in `views/shell.html`.

![Creating an App module](/img/2013-02-21--Shell.html.jpg)

And now a scary moment. In order to produce an optimized version of our app, you have to go down to a command
line and
run `optimizer.exe`. Remember, that was the file that we excluded earlier in the process from our project,
but of course it's still sitting in the file system. As long as you stick with Durandal's defaults this tool will help
 you creating an optimized `main-built.js` file.

![Creating an App module](/img/2013-02-21--Optimizer.jpg)

Last step is to comment/uncomment the appropriate part in default.aspx that's responsible for loading
`main-build.js` and you should be good to go.

![Creating an App module](/img/2013-02-21--finalDefault.jpg)

Looks like we accomplished our mission for today and from my first impressions it looks like Durandal can fulfill the
promise of *Your search for a SPA framework ends here.*
In one of the upcoming blogs I'll add my trusted data abstraction tool [JayData] to see how
 they are playing along.

 Here's a final word of warning. Before diving into this new and mighty thing called Durandal,
 make sure that you read up the whole story about its eponym and you see that at the end the hero Roland is dead,
 just the sword survived `;-)`.


[Announcing release of ASP.NET and Web Tools 2012.2 Update]: http://weblogs.asp.net/scottgu/archive/2013/02/18/announcing-release-of-asp-net-and-web-tools-2012-2-update.aspx
[templates]: http://www.asp.net/single-page-application/overview/templates
[aanuwizard]: http://aanuwizard.com/2012/11/19/article-12-from-30-how-to-use-mvc-web-project-for-auto-hosted-and-provider-hosted-sharepoint-apps/
[Durandal]: http://durandaljs.com/
[JayData]: http://jaydata.org
[online version]: https://spirit2013preview-eb1020d742cee2.sharepoint.com/DurandalSharePoint-hosted/Pages/Default.aspx?SPHostUrl=https%3A%2F%2Fspirit2013preview-public.sharepoint.com&SPLanguage=en-US&SPClientTag=4&SPProductNumber=15.0.4454.1011&SPAppWebUrl=https%3A%2F%2FSpirit2013Preview-eb1020d742cee2.sharepoint.com%2FDurandalSharePoint-hosted
[github]: https://github.com/RainerAtSpirit/Durandal.SharePoint-hosted
[Web Essentials 2012]: http://visualstudiogallery.msdn.microsoft.com/07d54d12-7133-4e15-becb-6f451ea3bea6

[Durandal docs]: http://durandaljs.com/pages/docs
[John Papa]: http://www.johnpapa.net/hottowel/
[Stephen Walter]: http://stephenwalther.com/archive/2013/02/08/using-durandal-to-create-single-page-apps.aspx