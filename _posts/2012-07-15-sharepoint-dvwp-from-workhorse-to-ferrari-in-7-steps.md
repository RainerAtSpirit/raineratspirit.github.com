---
layout: post
title: "SharePoint DVWP: from workhorse to ferrari in 7 steps"
description: ""
category: 'Good to know'
tags: [SharePoint, DVWP]
---
{% include JB/setup %}
This is going to be intense and this is going to be fun..., if you are willing to follow till the end. I'm going to
take the good old Data Form Web Part, better known as **DVWP**, and turn the standard HTML,
which is delivered by this
reliable workhorse, in some highly optimized HTML5 code: I call it the **`Ferrari`** version.

But before we even start, here are some prerequisites:

- you worked with the **DVWP** before
- you're familiar with XML/XSLT
- you know who Marc D Anderson is and know his [posts about the DVWP] inside out
- you are familiar with SharePoint Designer,
    but you are not afraid using a text editor. Notepad will do, but some kind of syntax checking and highlighting
    would be beneficial. Before you ask: I'm using [WebStorm][] for overall web development and [Altova XML Spy][]
    for complex XML/XSLT.

Let's get started with something the **DVWP** was build for:
- accessing data via a data source
- (just to recap: _Database_, _SOAP_, _REST_, _XML Files_ and _Linked Data source_ are supported)
- converting the data using XSLT
- and finally display the result as part of a SharePoint page.

 Go ahead and:
 1. create a new site using the blank site template
 1. create a document library called `servicefiles` that is used to store our pages
 1. create a subfolder `servicefiles/xml`
 1. and finally create a `helloworld.xml` file with the following content

{% highlight xml linenos %}
<?xml version="1.0" encoding="utf-8" ?>
<root>
	<title>Hello World</title>
</root>
{% endhighlight %}

Nothing fancy so far, so let's move on:
1. Let's created a XML data source for this file
1. create a web part page called `WebPartPage.aspx`
1. Place a **DVWP** on it show us the standard content.

**Checkpoint:** As said, I assume that you know the **DVWP** inside out. But if not or you'd prefer not following along
 right now,
 don't worry. Each of the steps below can be accessed online, so sit back, relax and enjoy the ride. If you
 wanna get your hands dirty later, you find the [source code] at github.

 Ok, let's move on. By default SPD uses some baked in XSLT to perform the XML/XSLT conversion,
 which is clearly not the best starting point for us, so let's replace the xsl:stylesheet by our own.
{% highlight xslt linenos %}
<xsl:stylesheet version="1.0" exclude-result-prefixes="xsl msxsl ddwrt" xmlns:ddwrt="http://schemas.microsoft.com/WebParts/v2/DataView/runtime" xmlns:asp="http://schemas.microsoft.com/ASPNET/20" xmlns:__designer="http://schemas.microsoft.com/WebParts/v2/DataView/designer" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:SharePoint="Microsoft.SharePoint.WebControls" xmlns:ddwrt2="urn:frontpage:internal">
    <xsl:output method="html" indent="no"/>
    <xsl:template match="/" xmlns:asp="http://schemas.microsoft.com/ASPNET/20" xmlns:__designer="http://schemas.microsoft.com/WebParts/v2/DataView/designer" xmlns:SharePoint="Microsoft.SharePoint.WebControls">
        <h1><xsl:value-of select="root/title" /></h1>
    </xsl:template>
</xsl:stylesheet>
{% endhighlight %}

Asssuming nothing went wrong, you should see something like this in your browser.

![Empty ASPX Page](/img/2012-07-15-sharepoint-dvwp-step_0.jpg)

For your convienience you have access to the [Source](https://github
.com/RainerAtSpirit/DVWP-HTML5/blob/master/WebPartPage.aspx), see the rendered result [Live](http://www.spirit
.de/demos/gtk/dvwp/ServiceFiles/WebPartPage.aspx)
 and what's more important you can see the [HTML source](https://gist.github.com/3116685#file_web_part_page.aspx) of
 that page; and yes, right click on the rendered result, view source will work as well.

The size of HTML source will act as our _baseline_, and a quick look reveals that there are **772** lines of code,
which includes our _payload_ of `<h1>Hello world</h1>`. You can see that our _payload_ is nicely integrated into a
fully fledged SharePoint theme. As said above this scenario is exactly, what the **DVWP** was build for.


**Checkpoint** In a series of small step-by-step modifications this starting point now undergoes optimization,
with the goal of creating a slick HTML5 version that uses the same _payload_.

- Ready?
- 3
- 2
- 1
- go...
  
**Step 1**
Create an empty aspx page in the same folder (hint: right click is your friend) call it _step\_1.aspx_ and copy/paste
the existing **DVWP** from _WebPartPage.aspx_ into it.

![Step 1](/img/2012-07-15-sharepoint-dvwp-step_1.jpg)

[Source](https://github.com/RainerAtSpirit/DVWP-HTML5/blob/master/step_1.aspx),
[Live](http://www.spirit.de/demos/gtk/dvwp/ServiceFiles/step_1.aspx),
[HTML source](https://gist.github.com/3116685#file_step_1.aspx)

By placing the **DVWP** onto it's own empty aspx page we a) removed almost all visible SharePoint chrome and b)
reduced the
HTML source size to **160** lines. Make a copy of the current page _(step\_1.aspx)_ and save as next page _(step\_2
.aspx)_; repeat the same process for the following steps.

**Step 2**
Getting rid of the Web
part properties bar is straight forward and
frankly could have been done in
our original page
as well. Simply open the web part properties and change the Chrome Type to `none`,
which will bring us down to **154** lines.

![Step 2](/img/2012-07-15-sharepoint-dvwp-step_2.jpg)

[Source](https://github.com/RainerAtSpirit/DVWP-HTML5/blob/master/step_2.aspx),
[Live](http://www.spirit.de/demos/gtk/dvwp/ServiceFiles/step_2.aspx),
[HTML source](https://gist.github.com/3116685#file_step_2.aspx)

**Step 3**
After that easy passage in **step 2** let's get a little bit more agressive by getting rid of the
 `asp:ScriptManager` tag. You can either delete it in the code view or in design view. If the latter, make sure that
 you've turned on  Visual  Aids otherwise you won't see it.

![Step 3](/img/2012-07-15-sharepoint-dvwp-step_3.jpg)

You should test this modification immediately in the browser and you'll see this error message.

![Step 3 error](/img/2012-07-15-sharepoint-dvwp-step_3error.jpg)

[Source](https://github.com/RainerAtSpirit/DVWP-HTML5/blob/master/step_3.aspx),
[Live](http://www.spirit.de/demos/gtk/dvwp/ServiceFiles/step_3.aspx)

How comes? The page looks still good in SPD, doesn't it? Somehow the web part seems to have a dependency on the
`asp:ScriptManager` that only shows up in the browser. Being at this point before, you remember that the
ScriptManager is responsible for loading all kind of JavaScript files, some of them `Async` in nature. So by
carefully exploring the **DVWP** settings, you come accross the following `AsyncRefresh=True` property.
Modifying this to `AsyncRefresh=False` will ensure that the error message goes away and brings the html down to
**124** lines.

![Step 3 error](/img/2012-07-15-sharepoint-dvwp-step_3async.jpg)

[Source](https://github.com/RainerAtSpirit/DVWP-HTML5/blob/master/step_3a.aspx),
[Live](http://www.spirit.de/demos/gtk/dvwp/ServiceFiles/step_3a.aspx),
[HTML source](https://gist.github.com/3116685#file_step_3a.aspx)


**Checkpoint** Up till now we've used SPD to make modifications, but from
this point on SPD is no longer your best friend for dealing with the **DVWP**. This is not the fault of SPD
though, we are simply driving the **DVWP** behind the point that's supported inside SPD. Therefore
 I'd suggest that you now grab your favorite XML/XSLT HTML editor and make further modifications directly in the source
 code.

**One additional warning** By making modifications beyond this point, you will no longer be able to save your site as
 a site template and create new sites from it, at least not reliable.
Most of the time this is not an issue, remember we are going to build a **`Ferrari`** and you probably just need one
not
thousands `;-)`. But if there's ever a need to move your **`Ferrari`** around, you can still manually copy the aspx
pages or turn them into a Visual studio feature.

**Step 4**
Looking at the source code of the result in step 3 will immediately trigger our attention to the next optimization
target. There is
that huge `input` that hosts the viewstate. All nice and well if you are doing server side stuff,
but we don't want that, so simply remove the `<form ...>`and `</forms>` tags in the source.

Yeah, I know that might sound a little bit drastic, but give it a try before you judge; and
you'll be rewarded by seeing the HTML source cutting down to **51** lines.

![Step 3a source](/img/2012-07-15-sharepoint-dvwp-step_3asource.jpg)

[Source](https://github.com/RainerAtSpirit/DVWP-HTML5/blob/master/step_4.aspx),
[Live](http://www.spirit.de/demos/gtk/dvwp/ServiceFiles/step_4.aspx),
[HTML source](https://gist.github.com/3116685#file_step_4.aspx)

**Step 5**
Let's see if we can still use some SharePoint controls at the server side after our drastic **step 4**; and in
addition let's cleanup the current header.

- change the static title to a dynamic one (see below)
- update the doctype `<!DOCTYPE html>` and `<html>` tag
- remove existing `<style>` tag

{% highlight html linenos %}
<title><SharePoint:ListItemProperty Property="BaseName" maxlength="40" runat="server"/></title>`
{% endhighlight %}


As you can see below the `<title>` information is correctly showing the current's page name; and by cleaning up we
are down  to **20** lines.

![Step 5](/img/2012-07-15-sharepoint-dvwp-step_5.jpg)

[Source](https://github.com/RainerAtSpirit/DVWP-HTML5/blob/master/step_5.aspx),
[Live](http://www.spirit.de/demos/gtk/dvwp/ServiceFiles/step_5.aspx),
[HTML source](https://gist.github.com/3116685#file_step_5.aspx)


**Step 6**
Now have a look at the HTML5 source after all the optimization. Not too bad I'd say,
but still there's room for improvement. See the highlighted namespaces in the _payload_. This will be our next target.

![Step 5 source](/img/2012-07-15-sharepoint-dvwp-step_5source.jpg)

Truth told, we might have tackled those namespaces earlier,
but now that our HTML becomes smaller, it is far easier to spot that they are not required.


This one is pretty straight forward, just modify the XSLT slightly. Here's the reformatted version that defines
all `exclude-result-prefixes` correctly and removes the namespaces in `<xsl:template match="/"`.

{% highlight xslt linenos %}
<xsl:stylesheet version="1.0"
exclude-result-prefixes="ddwrt asp __designer xsl msxsl SharePoint ddwrt2"
xmlns:ddwrt="http://schemas.microsoft.com/WebParts/v2/DataView/runtime"
xmlns:asp="http://schemas.microsoft.com/ASPNET/20"
xmlns:__designer="http://schemas.microsoft.com/WebParts/v2/DataView/designer"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
xmlns:msxsl="urn:schemas-microsoft-com:xslt"
xmlns:SharePoint="Microsoft.SharePoint.WebControls"
xmlns:ddwrt2="urn:frontpage:internal">
    <xsl:output method="html" indent="no"/>
    <xsl:template match="/">
        <h1><xsl:value-of select="root/title" /></h1>
    </xsl:template>
</xsl:stylesheet>
{% endhighlight %}

[Source](https://github.com/RainerAtSpirit/DVWP-HTML5/blob/master/step_6.aspx),
[Live](http://www.spirit.de/demos/gtk/dvwp/ServiceFiles/step_6.aspx),
[HTML source](https://gist.github.com/3116685#file_step_6.aspx)


**Step 7**
Not much room for optimation left, correct? But there's one thing that annoys me most,
when looking at the current state of things.
Take a look at our XSLT stylesheet above, there's cleary **NO** `<table class"....></table>` in there,
this code is injected by the **DVWP** instead.

![Step 6 source](/img/2012-07-15-sharepoint-dvwp-step_6source.jpg)

The not that well known property `SuppressWebPartChrome` ([see MSDN][]) will help us getting rid of
this extra `WebPartChrome`. _Please note_ that this only works if the **DVWP** lives outside a web part zone,
so you can't use this for standard implemenations like our initial `WebPartPage.aspx`.


You reach the finishing line by adding  `SuppressWebPartChrome="True"` to the web part properties, which brings us to

**16** lines of **clean HTML5** code or The **`Ferrari`** version

![Step 7 source](/img/2012-07-15-sharepoint-dvwp-step_7.jpg)

[Source](https://github.com/RainerAtSpirit/DVWP-HTML5/blob/master/step_7.aspx),
[Live](http://www.spirit.de/demos/gtk/dvwp/ServiceFiles/step_7.aspx),
[HTML source](https://gist.github.com/3116685#file_step_7.aspx)


Boy, that was probably just another **TL;DR**, but if you made it till here, you might have picked up one or two
things about the **DVWP** that you'd consider 'Good to know'.

I'd be glad to hear from you about the experiences you make, while testing this out.

BTW if you are looking for inspiration, where to go from here, take a look at this
Metro demo, which is a HTML5 client app that was build using two **DVWPs**..., but's that's worth another story, so
stay tuned!

![Metro demo](/img/2012-07-15-sharepoint-dvwp-metro.jpg)
[Live](http://www.spirit.de/demos/metro/ServiceFiles/DynMetroStyle.aspx)

[posts about the DVWP]: http://sympmarc.com/tag/dvwp/
[source code]: https://github.com/RainerAtSpirit/DVWP-HTML5
[WebStorm]: http://www.jetbrains.com/webstorm/
[see MSDN]: http://msdn.microsoft.com/en-us/library/microsoft.sharepoint.webpartpages.webpart.suppresswebpartchrome.aspx
[Altova XML Spy]: http://www.altova.com/xmlspy.html