---
layout: post
title: "SharePoint 2013: Use the chrome control and the cross-domain library Cleanup"
description: ""
category: 'Good to know'
tags: ['SharePoint 2013', 'AutoHosted Apps', 'HTTP Error 405.0']
---
{% include JB/setup %}



At the time of this writting you've probably seen something like this, while browsing SharePoint 2013 blogs or the
documentation on MSDN.

>Disclaimer July 31 2012 – SharePoint 2013 is in preview at this stage, so some specifics and user experiences may
>change slightly between now and release time.

So we might expect having a rough ride while trying to get things working using the documentation/examples. To make
things worth Visual studio 2012 and Windows 8 were just released lately, so that most examples have been written
either on beta software themselves. So there's really nobody we can blaim if things are not running as expected
other than ourselves that we want to dig it this new terretory while it's still a desert. Maybe it's no coincidence
that this year SPC 2012 happens in Vegas `;-)`.

Me personally I'm exploring SharePoint 2013 from a very specific angle: How to use single page application within the
 SharePoint App infrastructure. A great bunch of examples can be found at [http://code.msdn.microsoft
 .com/officeapps/], which while being a good source for inspiration many of them are lacking one or another problem
 that needs to be addressed before they start working.

[http://code.msdn.microsoft.com/officeapps/]: http://code.msdn.microsoft.com/officeapps/

I concentrate on one of the examples [Use the chrome control and the cross-domain library (REST)] to address some
common issues you might see when trying to work with them.

>Disclaimer September 04 2012 – SharePoint 2013 is in preview at this stage. I'm running the example on Windows 8 and 
Visual 2012 RTM. You're experience may wary, welcome to the desert `;-)` 


###Issue 1: Mixed content

**Step 1:** Open downloaded example in Visual studio 2012 and add your SiteURL
![Create App](/img/2012-09-05-SiteURL.jpg)

**Step 2:** Run the example and launch the app
![Choose Autohosted](/img/2012-09-05-Launch.jpg)

**Step 3:** Hit continue if you see error messages in VS
![Defaults](/img/2012-09-05-VS$undefined.jpg)

**Step 4:** Switch to IE and "Confirm all content"
![Defaults](/img/2012-09-05-IEMessage.jpg)

So what's happening here? Based on the IE message we see that we have a mixed bag of https: and http: content on
our page, which is prevented by the default settings.

How to mitigate: Instead of simply switching the `src="http://ajax..."` attribute, which would reintroduce the issue
if we
switch from https: to http: as default protocol, let's get rid of the protocol all together so that it reads:
`src="//ajax..."`

{% highlight html linenos %}
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Chrome control host page</title>

    <script
        src="http://ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js"
        type="text/javascript">
    </script>
    <script
        type="text/javascript"
        src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.min.js">
    </script>
    <script
        type="text/javascript"
        src="ChromeLoader.js">
    </script>
        <script
        type="text/javascript"
        src="CrossDomainExec.js">
    </script>
</head>
{% endhighlight %}






