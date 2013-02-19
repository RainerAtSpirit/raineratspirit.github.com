---
layout: post
title: "More about REST in SharePoint 2010/2013"
description: ""
category: 'Good to know'
tags: ['SharePoint 2013', 'AutoHosted Apps', 'REST', 'OData']
---
{% include JB/setup %}

Hi there,

It's been a while since the last post about  SharePoint 2013 and why you should use REST when talking to it. I'm
still convinced that this holds true in the long run, but you should be aware of a couple of facts that I've learned in
the meantime.

At the time of this writing SharePoint 2013 only supports OData V2. **How comes?** During beta phase I got the
impression
that
`/_api` acts as an OData V3 provider, but in the release version Microsoft pulled the plug and removed $metadata
support. You can read more about that in this [thread], but here's the relevant paragraph from the [specs].

>OData services MUST expose a Metadata Document which defines all data exposed by the service. The Metadata Document
>URL SHOULD be the root URL of the service with "/$metadata" appended. To retrieve this document a client issues a GET
>request to the Metadata Document URL.

If you read a MUST in the specs you know that without it (whatever else your service delivers) it's definitively
not an OData v3 provider. What makes that so disappointing is that JayData won't work without having the $metadata
information exposed to it.

If you're like me and want to give JayData a try for abstracting the access to the underlying data provider,
you should be aware of another limiting factor. Like jQuery 2.0 that was just announced,
JayData is targeted to work with modern (mobile) browser.
IE8 and below definitively doesn't belong into that group and for JayData there's no way to _shim_ the missing required
capabilities in.

Not a big deal you say, IE8 is outdated anyway and nobody in my org is using it any longer. Lucky you,
go ahead and give the OData v2/JayData combo a try.
If on the other hand you want to create an app and put it in the app store...

Guess what one of the **MUST** have criteria is that allows it to be placed in the app store is? You guessed right
 IE8 support! Read more about this requirement and some other pitfalls you might encounter in
 [this post by Aidan Garnish].

Hopefully Microsoft will deliver two things in the near future:

  1. provide $metadata for `_api` -> this will make `_api` a real  OData v3 provider
  2. lift the requirements for the app store. Come on guys IE8 is outdated and you've already got two newer releases
  out there!

Regardless if Microsoft will fulfill my small wish list or not, luckily you can get JayData running on
SharePoint 2010 and SharePoint 2013 by using `_vti_bin/listdata.svc` as of today.

 In order to get you started here are links to two example sites that will allow you to get hands-on. Both require
 that you know your way around in a browser console :), so pick up your favorite one and give it a try.

[JavaScript language query playground]

![JSQL Playground example 13](/img/2013-01-18-JSQL-Example13.jpg)

This is a live version of the JSLQ101 document that will allow you to work with
a public OData v2 endpoint using JayData. Note that everything that you can do with the public OData v2 endpoint
can be done using `_vti_bin/listdata.svc` in SharePoint 2010/2013.



[JSQL SharePoint 2013 app]

**UserName**: odatademo@spirit2013preview.onmicrosoft.com

**Password**: OData!Demo


![SharePoint hosted JSLQ example 6](/img/2013-01-18--SP13-Example6.jpg)
This is a SharePoint-hosted app that allows you to use CRUD operation against the app web. The list structure
 is described in more detail by Chris O'Brien and consists of a simple project list and a custom time
 tracking  list that has a lookup to the project list. Make yourself familiar with this setup by
  reading [this post from Chris].

Note even if this  is an SharePoint hosted app running on SharePoint 2013, because it's using
`_vti_bin/listdata.svc` this would work on SP2010 as well.



[thread]: http://social.msdn.microsoft.com/Forums/en-US/appsforsharepoint/thread/9e10f90d-666b-4787-8775-4065d9d8af44/
[specs]: http://www.odata.org/media/30002/OData.html#metadatarequests
[this post by Aidan Garnish]: http://www.aidangarnish.net/post/Getting-a-SharePoint-2013-App-Submitted-to-the-Office-Store.aspx
[this post from Chris]: http://www.sharepointnutsandbolts.com/2012/08/create-lists-content-types-files-etc.html
[JavaScript language query playground]: http://jslq.spirit.de
[JSQL SharePoint 2013 app]: https://spirit2013preview-c3b1709654b2e8.sharepoint.com/sites/Demos/TypeScriptMeetsJayDataSharePointhosted/Pages/Default.aspx?SPHostUrl=https%3A%2F%2Fspirit2013preview%2Esharepoint%2Ecom%2Fsites%2FDemos&SPLanguage=en-US&SPClientTag=0&SPProductNumber=15%2E0%2E4433%2E1011&SPAppWebUrl=https%3A%2F%2FSpirit2013Preview-c3b1709654b2e8%2Esharepoint%2Ecom%2Fsites%2FDemos%2FTypeScriptMeetsJayDataSharePointhosted