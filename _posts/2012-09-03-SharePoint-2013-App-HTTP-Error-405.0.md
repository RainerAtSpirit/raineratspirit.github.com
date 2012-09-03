---
layout: post
title: "SharePoint 2013 App HTTP Error 405.0"
description: ""
category: 'Good to know'
tags: ['SharePoint 2013', 'AutoHosted Apps', 'HTTP Error 405.0']
---
{% include JB/setup %}


Hi there!

Today's post is just a short one about an `HTTP Error 405.0` that I was seeing when trying to get an `Autohosted`
SharePoint app working with static files. If you're not sure what a SharePoint App is or what it's good for read Ted
Pattison's blog
[My first weekend in Napa] and the [Apps for Office and SharePoint blog] to get you started.

[Cloud9]: https://c9.io/
[My first weekend in Napa]: http://blog.tedpattison.net/Lists/Posts/Post.aspx?List=9d54806e-14ca-456d-a62a-b903c9dda841&ID=17&utm_source=twitterfeed&utm_medium=twitter&Web=dbc8a5bc-c0d9-412c-8929-177a045a5351
[Apps for Office and SharePoint blog]: http://blogs.msdn.com/b/officeapps/


So what happened? I wanted to replace the default files in an
`Autohosted` template with files coming from my
favorite HTML5 framework: [Zurb foundation](http://foundation.zurb.com/).


**Step 1:** Create an App for SharePoint
![Create App](/img/2012-09-03-NewProject.jpg)

**Step 2:** Choose Autohosted for hosting type
![Choose Autohosted](/img/2012-09-03-Autohosted.jpg)

**Step 3:** Get rid of the defaults files, references and properties
![Defaults](/img/2012-09-03-Defaults.jpg)
![Clean](/img/2012-09-03-Clean.jpg)

**Step 4:** Copy/paste you static HTML files and adjust AppManifest
![Source files](/img/2012-09-03-Files.jpg)
![AppManifest](/img/2012-09-03-AppManifest.jpg)

**Step 5:** Run the app, trust it and ... `HTTP Error 405.0`
![Trust](/img/2012-09-03-Trust.jpg)
![Error 405](/img/2012-09-03-Error.jpg)


I'm pretty sure you've been to [http://code.msdn.microsoft.com/office](http://code.msdn.microsoft.com/office) before
and seen many SharePoint 2013
examples with the following troubleshooting message.

![405 Recommendation](/img/2012-09-03-405Recommendation.jpg)

Unfortunately after applying the additional verbs to my
`applicationhost.config` file I  still got the same  error `:(`.

 For further troubleshooting I've added a new handler `StaticHTML` for `*.html
 files`,  which while leading to the same error at least proved that the new handler with all correctly configured
 verbs was used by the system.
 {% highlight xml linenos %}
 ..
 <handlers>
    ..
    <add name="StaticHTML" path="*.html" verb="GET,HEAD,POST,DEBUG,TRACE" modules="StaticFileModule" resourceType="File" requireAccess="Read" />
    <add name="StaticFile" path="*" verb="*" modules="StaticFileModule,DefaultDocumentModule,DirectoryListingModule" resourceType="Either" requireAccess="Read" />
 </handlers>
 {% endhighlight %}
 ![New error](/img/2012-09-03-error2.jpg)

After a moment of frustation Google-fu came to the rescue: [this post] talks about some intrinic of the
`StaticFileHandler` and
why static sometimes is
 not static enough. After following the recommendation of adding an `AspNetStaticFileHandler`
 everything was working as expected.

[this post]: http://www.paraesthesia.com/archive/2011/05/02/when-staticfilehandler-is-not-staticfilehandler.aspx

 {% highlight xml linenos %}
 ..
 <handlers>
    ...
    <add name="AspNetStaticFileHandler" path="*" verb="*" type="System.Web.StaticFileHandler" />
    <add name="StaticHTML" path="*.html" verb="GET,HEAD,POST,DEBUG,TRACE" modules="StaticFileModule" resourceType="File" requireAccess="Read" />
    <add name="StaticFile" path="*" verb="*" modules="StaticFileModule,DefaultDocumentModule,DirectoryListingModule" resourceType="Either" requireAccess="Read" />
 </handlers>
 {% endhighlight %}


**Finally:** SharePoint Autohosted App meets Zurb foundation
 ![Result](/img/2012-09-03-Result.jpg)






