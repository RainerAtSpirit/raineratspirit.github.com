---
layout: post
title: "SharePoint 2013 and the notorious disclaimer"
description: ""
category: 'Good to know'
tags: ['SharePoint 2013', 'AutoHosted Apps']
---
{% include JB/setup %}

At the time of this writing you've probably seen something like the below, while browsing SharePoint 2013 blogs or the
documentation on MSDN.

>Disclaimer MONTH DAY 2012: SharePoint 2013 is in preview at this stage, so some specifics and user experiences may
>change slightly between now and release time.

With that in mind we expect having some fun time while trying to get things working using the
documentation/examples that are out there. To make things even more exciting Visual studio 2012 and Windows 8
were just released lately. In contrast most examples have been written using prerelease software.

Once you get started with SharePoint apps, you will be in need for examples and you know that [officeapps] is a great
starting point. Me, I'm primarily interested in SharePoint 2013
apps that use client side REST calls to access server side data. Luckily there are already a couple of examples at
[officeapps] that cover that area.

Unfortunately most of them fall under the above `Disclaimer` category and therefore need some tweaking before they
work to my liking.

[officeapps]: http://code.msdn.microsoft.com/officeapps/

Before moving on

>Notorious disclaimer September 05 2012: I'm running the example in a VMWare instance of Win8 plus VS2012,
>both RTM. Your experience may wary, but that's expected.

Sorry couldn't resist `:)`. With that said let's take a specific example like
[Use the chrome control and the cross-domain library (REST)] and see what might happen while you testing it out.

[Use the chrome control and the cross-domain library (REST)]: http://code.msdn.microsoft.com/officeapps/SharePoint-2013-Use-the-a759e9f8

###Issue 1: HTTPS/HTTP Mixed content

**Step 1:** Download the example, open in Visual studio 2012 and add your SiteURL
![Adding SiteURL](/img/2012-09-05-SiteURL.jpg)

**Step 2:** Run the example and launch the app
![Launch App](/img/2012-09-05-LaunchApp.jpg)

**Step 3:** If you see an error messages in VS, hit continue
![Continue on VS error](/img/2012-09-05-VS$undefined.jpg)

**Step 4:** Switch to IE and confirm "Show all content"
![IE message](/img/2012-09-05-IEMessage.jpg)

**Step 5:** Finally: Success!
![IE message](/img/2012-09-05-Success.jpg)

**What's the problem?** Based on the IE message we see that we have a mixed bag of `https`
and `http` content on our page, which is prevented by the default IE settings. Glancing through the html code reveals
that we are  loading files from a CDN via `http` while the web site is running on `https`.
{% highlight html linenos %}
    <script
        src="http://ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js"
        type="text/javascript">
    </script>
    <script
        type="text/javascript"
        src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.min.js">
    </script>
{% endhighlight %}

**How to mitigate:** Instead of simply changing the src attribute to `src="https://ajax..."`,
which would reintroduce the issue if we later switch the web site protocol from `https:` to `http:`,
let's get rid of the protocol all together so that it reads: `src="//ajax..."`. If that syntax doesn't look familiar
 to you, check out [3 reasons why you should let Google host jQuery for you] to learn more about it.

[3 reasons why you should let Google host jQuery for you]:http://encosia.com/3-reasons-why-you-should-let-google-host-jquery-for-you/



###Issue 2: Chrome control prevents scroll bar

![No scroll bar](/img/2012-09-05-NoScrollBar.jpg)

**What's the problem?** The chrome control dynamically loads some additional CSS from the `host web`. So it's not your
CSS that causes the issues, it's the remote CSS.

**How to mitigate:** The chrome control injects a `link id="...` element inside the `<head>` section,
which ensures that this CSS is evaluated first (see issue 4 for details). That allows us to overwrite
conflicting styles in our own CSS file. Let's create an app.css file and include it in the html file(s). While on it
you might want to clean up a little and get rid of the `script` element that loads `MicrosoftAjax.js`. Neither the
example nor the chrome control and cross-domain library rely on it.

{% highlight html linenos %}
<head>
   <title>Chrome control host page</title>
   <link rel="stylesheet" type="text/css" href="app.css" />
   <script 
       type="text/javascript" 
       src="//ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.min.js">
   </script>
   ...
</head>
{% endhighlight %}

**app.css:**
{% highlight css linenos %}
body {
    overflow-y: scroll
}
{% endhighlight %}



###Issue 3: Houston, We've Got a Problem

**Step 1:** Realize that we have a problem.
![No scroll bar](/img/2012-09-05-LeakingGlobals.jpg)


**What's the problem?** Do we really have a problem here? After the modification done above the example is working
and therefore allows grasping the essence of it:

>This code sample includes a remote webpage that hosts the chrome control and retrieves information from the host web
>using the cross domain library and Representational State Transfer (REST) in SharePoint 2013 Preview.

**So again. What's the problem?** If you are an experienced HTML5/CSS/JavaScript developer there's probably none.
You'd see that there are a couple of issues with the example like

1. leaking globals
2. script elements in header
3. waiting for $(document).ready before code execution

but you'd simply ignore them and make a mental note to fix them in your own code. You grasped the essence of it and
that's what count.

Chances are that you're coming from a different angle, let's say you're an experienced .NET or even SharePoint
developer and HTML5/CSS/JavaScript is not your prime area of expertise. You make the example work and  grasp the
essence of it. But because you don't know what you don't know, you will start replicating the code base... including
the issues.

But hey, we got the `notorious disclaimer`, so Microsoft may change things later down the road. Maybe they start
updating the examples closer to the release date. Yes maybe they do, but we better don't `wait for || rely on` it.

**How to mitigate:** Let's apply some JavaScript best practice rules and refactor the example. The goal is not to
bend it too much, just making it living to the rules without losing the essence.

**Step 1**: Move declared global vars and named functions inside `$(document).ready`. **Catchword:**
[Declared and implied globals].


[Declared and implied globals]: https://www.google.de/search?q=Declared+and++implied+globals&ie=utf-8&oe=utf-8&aq=t&rls=org.mozilla:en-US:official&client=firefox-a

**Before:**
{% highlight javascript linenos %}
var hostweburl;
var appweburl;

// Load the required SharePoint libraries
$(document).ready(function () {
...
});

// Function to prepare and issue the request to get
//  SharePoint data
function execCrossDomainRequest() {
..
{% endhighlight %}

**After:**

{% highlight javascript linenos %}
// Load the required SharePoint libraries
$(document).ready(function () {
var hostweburl;
var appweburl;
...
// Function to prepare and issue the request to get
//  SharePoint data
function execCrossDomainRequest() {
..

});
{% endhighlight %}


**Step 2**: Load scripts at the bottom of your html. **Catchword:** [High Performance Web Sites: Rule 6]

[High Performance Web Sites: Rule 6]: http://developer.yahoo.com/blogs/ydn/posts/2007/07/high_performanc_5/

{% highlight html linenos %}
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Chrome control host page</title>
    <link rel="stylesheet" type="text/css" href="app.css" />
</head>
<body>

    <!-- Chrome control placeholder -->
    <div id="chrome_ctrl_placeholder"></div>
    <h1 class="ms-accentText">Main content</h1>

    <!-- This is the placeholder for the announcements -->
    <div id="renderAnnouncements"></div>

    <!-- Script tags moved to bottom -->
    <script type="text/javascript" src="//ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.min.js"></script>
    <script type="text/javascript" src="ChromeLoader.js"></script>
    <script type="text/javascript" src="CrossDomainExec.js"></script>
</body>
</html>
{% endhighlight %}


**Step 3**: By loading scripts at the bottom, the need to wait for `$(document).ready` before we can kick off our code
vanishes away, so can speed up loading time by switching to an Immediately-Invoked Function Expression [IIFE] instead.

**Before:**
{% highlight javascript linenos %}
$(document).ready(function () {
...
});
{% endhighlight %}

**After:**

{% highlight javascript linenos %}
(function () {
...
})();
{% endhighlight %}


There are probably other things that you might want to improve, but with those minor tweaks above, we already covered a lot
of ground.


Further readings: [The Essentials of Writing High Quality JavaScript], [IIFE] and
<a href="http://en.wikipedia.org/wiki/Houston,_We've_Got_a_Problem">Okay, Houston, we've had a problem here</a>

[The Essentials of Writing High Quality JavaScript]:http://net.tutsplus.com/tutorials/javascript-ajax/the-essentials-of-writing-high-quality-javascript/
[IIFE]:http://benalman.com/news/2010/11/immediately-invoked-function-expression/




###Issue 4: Preventing flash of unstyled content

![No scroll bar](/img/2012-09-05-Fouc.jpg)


**What's the problem?** Loading the chrome control happens asynchronously using [$.getScript()] with `renderChrome()`
 as callback. Within `renderChrome` you first configure the control and then kick it off via `nav.setVisible(true) `.
  This will add the dynamic `link` element that finally loads the remote CSS. So there's a time frame after
  `document.ready` in which our static HTML content will not be aware of the remote CSS.

{% highlight javascript linenos %}
   ...
   // Load the js file and continue to the
    //   success handler
    $.getScript(scriptbase + "SP.UI.Controls.js", renderChrome)
});

//Function to prepare the options and render the control
function renderChrome() {
...
{% endhighlight %}


[$.getScript()]: http://api.jquery.com/jQuery.getScript/

**How to mitigate:** Switching from `SP.UI.Controls.js` to `SP.UI.Controls.debug.js` let step us into `nav
.setVisible(true)`, where we see how MS constructs the link to `defaultcss.ashx` and sets up an event listener to
determine when the CSS is loaded.

{% highlight javascript linenos %}
...
if (visible && !this.$s_0) {
            var $v_0 = (document.getElementsByTagName('head'))[0];
            var $v_1 = document.createElement('link');

            $v_1.setAttribute('id', SP.UI.Controls.Navigation.$2 + SP.UI.Controls.Navigation.$12);
            $v_1.setAttribute('rel', 'stylesheet');
            $v_1.setAttribute('type', 'text/css');
            $v_1.setAttribute('href', this.$3_0 + SP.UI.Controls.Navigation.getVersionedLayoutsUrl('defaultcss.ashx'));

            if ($v_1.addEventListener) {
                        var $$t_5 = this;

                        $v_1.addEventListener('load', function() {
                            SP.UI.Controls.Navigation.$z($$t_5, visible);
                        }, false);
                    }
...
{% endhighlight %}

What's good for MS is good for us, so we add a `style="display: none"` to the body tag and add our
own event handler that changes the style attribute to `display: block` when the CSS is loaded. As we are already using
jQuery this is pretty straight forward.

{% highlight javascript linenos %}
...
    nav.setVisible(true);
    $('#chromeControl_stylesheet').on('load', function (event) {
        $('body').show();
    })
{% endhighlight %}


That's it for today and as a benefit for people who really  made it till the end of this TL;DR,
here's a link to [github],
where the code for today's post is available. While there take a look at the [commit history] and you'll see that for
every issue described above there's a commit available.

Feel free to clone and send me a pull request if you find other issues.

![Commit history](/img/2012-09-05-CommitHistory.jpg)

You are working on another example, but find applying the above modifications beneficial? Good, make sure to share.
I'm using the shortened URL from [officeapps] as git repository name. Create a git repro using this naming
convention and link to your repro from the [officeapps] example Q&A section.

![Naming convention](/img/2012-09-05-OfficeAppsUrl.jpg)

[github]: https://github.com/RainerAtSpirit/SharePoint-2013-Use-the-a759e9f8
[commit history]: https://github.com/RainerAtSpirit/SharePoint-2013-Use-the-a759e9f8/commits/master


