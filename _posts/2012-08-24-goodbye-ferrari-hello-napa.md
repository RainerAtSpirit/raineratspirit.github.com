---
layout: post
title: "Goodbye Ferrari, hello Napa?"
description: ""
category: 'cutting Teeth'
tags: ['SharePoint 2013', 'Napa']
---
{% include JB/setup %}

Hey there!

If you've seen my series about the SharePoint **DVWP** in **`Ferrari`** mode ([Part 1], [Part 2],
[Part 3]) you remember that we ended up with a small HTML5/CSS3/JavaScript app that is running on [SP 2010] and
[SP 2013].

Today we take some of our lessons learned and try to apply them into the brave new world of SP 2013 apps
or to be more precise into the world of Napa apps. *Please note* that I'm not going to cover the whole
SharePoint 2013 App Model, but if you want to learn more about it, spend an hour and watch Jeremy Thake's
[screencast] about that topic.

[SP 2010]: http://www.spirit.de/demos/metro/zurbv3/MetroStyle.aspx
[SP 2013]: https://spirit2013preview-public.sharepoint.com/zurbv3/MetroStyle.aspx
[screencast]: http://www.made4the.net/archive/2012/08/17/introduction-to-sharepoint-2013-app-model-screencast.aspx

Why should we talk about Napa apps in the first place? One reason is that Napa apps are the lowest hanging fruits
 in SP2013 development at least in terms of required infrastructure. There's no need setting up an on
 premise SP2013 development  environment, nor does it require to have Visual studio 2012 installed. Still you are
 able to take whatever you did in Napa and open it up in VS 2012 if that requirement comes up.

With that said if you want to follow along and haven't Napa yet, this [Office 365 Developer] page will get you started.

[Office 365 Developer]: http://msdn.microsoft.com/en-us/library/fp179924(v=office.15).aspx

Just to get our feet wet let's create an OOTB app called 'SharePointApp1' and run the project without further
modification.

**Step 1** Add a new project
![Napa Development](/img/2012-08-24-NapaDevelopment.jpg)
**Step 2** Choose App for SharePoint and give it a name
![Napa Development](/img/2012-08-24-NapaChooseApp.jpg)
**Step 3** Press the Run project button and see how the system is doing its job to package, deploy and launch your app
![Napa Development](/img/2012-08-24-NapaDistribution.jpg)
**Step 4** Be impressed with the results of all your hard work :)
![Napa Development](/img/2012-08-24-NapaResult.jpg)


Take a quick glance at the [HTML source] of our impressive app. I say impressive because even though the
payload is just the User Name it has **644 lines** of code. The reason is that our small 'payload' is nicely embedded
 into SP2013, which comes with a price.

[Source]: https://gist.github.com/3436301#file_source_default.aspx
[JavaScript]: https://gist.github.com/3436301#file_app.js
[HTML source]: https://gist.github.com/3436301#file_result_default.aspx
[Part 1]: http://rainerat.spirit.de/2012/07/15/sharepoint-dvwp-from-workhorse-to-ferrari-in-7-steps/
[Part 2]: http://rainerat.spirit.de/2012/07/20/the-sharepoint-dvwp-in-ferrari-mode-strikes-again/
[Part 3]: http://rainerat.spirit.de/2012/08/01/the-ferrari-meets-jaydata/

{% highlight html linenos %}
<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>
<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" language="C#" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderId="PlaceHolderAdditionalPageHead" runat="server">
    <script src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.2.min.js" type="text/javascript"></script>

    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />

    <!-- Add your JavaScript to the following file -->
    <script type="text/javascript" src="../Scripts/App.js"></script>
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">

    <div>
        <p id="message">
            <!-- The following content will be replaced with the user name when you run the app - see App.js -->
            initializing...
        </p>
    </div>

</asp:Content>
{% endhighlight %}

Within the [Source] we see some familiar ASP.NET
directives with a link to a masterpage and then two `<asp:Content>` blocks.The `PlaceHolderAdditionalPageHead` is
used
 to load your app specific CSS and JavaScript. The CSS is of no interest
for us at the moment so let's take a look at `App.js` instead.

{% highlight javascript linenos %}
var context;
var web;
var user;

// This code runs when the DOM is ready. It ensures the SharePoint
// script file sp.js is loaded and then executes sharePointReady()
$(document).ready(function () {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', sharePointReady);
});

// This function creates a context object which is needed to use the SharePoint object model
function sharePointReady() {
    context = new SP.ClientContext.get_current();
    web = context.get_web();

    getUserName();
}

// This function prepares, loads, and then executes a SharePoint query to get the current users information
function getUserName() {
    user = web.get_currentUser();
    context.load(user);
    context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
}

// This function is executed if the above call is successful
// It replaces the contents of the 'helloString' element with the user name
function onGetUserNameSuccess() {
    $('#message').text('Hello ' + user.get_title());
}

// This function is executed if the above call fails
function onGetUserNameFail(sender, args) {
    alert('Failed to get user name. Error:' + args.get_message());
}
{% endhighlight %}

Beside the fact that the small code leaks more than half a dozen globals, which makes some of us laughing and some of
 us crying, we see that `getUserName()` retrieves the user information from the `AppWeb` via CSOM and finally
 `onGetUserNameSuccess()` renders the `Hello username` message.

**Checkpoint** So far everything was nice and easy I'd say and you shouldn't have an issue if you follow along.

Now let's switch gears by **first** getting rid of the SharePoint chrome. Simply copy [Source2] and replace your
 existing default.aspx content in Napa. Running the app will show that the [HTML
source2] for the page is down to **18 lines**.

By glancing through [Source2] you see that we are still using some ASP.NET directives,
just the reference to the masterpage has gone. In [Part 1] we stripped down the **DVWP** in a similar manner,
so we might call this mode the **`Naparari`** `:-)`.
*Please note* that at this time the JavaScript won't work as some required CSOM files are loaded via the
masterpage.

[Source2]: https://gist.github.com/3436332#file_source_default.aspx
[JavaScript2]: https://gist.github.com/3436332#file_app.js
[HTML source2]: https://gist.github.com/3436332#file_result_default.aspx

{% highlight html linenos %}
<%-- The following 5 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" Language="C#" %>

<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<!DOCTYPE HTML>
<html>
<head>
    <title>
        <SharePoint:ProjectProperty Property="Title" runat="server" />
    </title>
    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />
</head>
<body>
    <div id="message">
        <!-- The following content will be replaced with the user name when you run the app - see App.js -->
        initializing...
    </div>
    <script src="//ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="../Scripts/App.js"></script>
</body>
</html>
{% endhighlight %}

**Second** let's make some modification to app.js.

1. Goal: In addition to the username we want to retrieve the web title from the `HostWeb`
2. Goal: Instead of adding the required CSOM files, we are switching to `OData`
3. Goal: While on it let's get rid of the globals `;-)`.

As said above I'm not going to dicuss all options in the SharePoint App model, but they all have in common that
there's a clear separation between the `HostWeb`, the web where you install your app, and the `AppWeb`, the place
where your code is actually running.

Here's an example of my `HostWeb` URL:
https://spirit2013preview.sharepoint.com/sites/dev/

Whenever a Napa app is launched it runs at the following `AppWeb` URL.

https://spirit2013preview**-b0204c96e900db**.sharepoint.com/sites/dev/GoodbyeFerrariHelloNapa/Pages/Default.aspx

You see that a GUID like **-b0204c96e900db** is added to the host header,
so for our JavaScript code that is running
 in the `AppWeb` there's NO way to access information directly in the `HostWeb` due to cross site scripting
 restriction.


Let's see how our goals can be accomplished. The JavaScript below is based on code from [MSDN]. If you're
not familiar with the cross-domain library `SP.RequestExecutor.js` please check it out first.

Goal 1 and 2: The answer to both goals lives in the `execCrossDomainRequest()` function. As you can see we are
executing a call against the local `SPAppWebUrl` `/_api/SP.AppContextSite(@target)/` and passing in our `SPHostUrl` as
 `@target`. Effectivily this will provide us access to the remote `SPHostUrl/_api` endpoint. Here
 `/web?$expand=CurrentUser` is used to retrieve web and at the same time CurrentUser information.

Goal 3: There's more than one way to accomplish that, but here we simply wrap our code in an
Immediately-Invoked Function Expression [IIFE].  Read Ben Alman's article about [IIFE] why the more popular term
self-executing anonymous function might not be appropriate.

[MSDN]: http://msdn.microsoft.com/en-us/library/fp179927(v=office.15).aspx
[IIFE]: http://benalman.com/news/2010/11/immediately-invoked-function-expression/

{% highlight javascript linenos %}
(function () {
    var params = getParams(),
        scriptbase = params.SPHostUrl + "/_layouts/15/";


    // Load the js file and continue to the
    //   success event handler.
    $.getScript(scriptbase + "SP.RequestExecutor.js", execCrossDomainRequest);


    // Function to prepare and issue the request to get
    //  SharePoint data.
    function execCrossDomainRequest() {
        var executor = new SP.RequestExecutor(params.SPAppWebUrl);

        // Issue the call against the host web.
        // To get the title using REST we can hit the endpoint:
        //      app_web_url/_api/SP.AppContextSite(@target)/web/title?@target='siteUrl'
        // The response formats the data in the JSON format.
        // The functions successHandler and errorHandler attend the
        //      success and error events respectively.
        executor.executeAsync(
            {
                url:
                    params.SPAppWebUrl +
                    "/_api/SP.AppContextSite(@target)/web?$expand=CurrentUser&@target='" +
                    params.SPHostUrl + "'",
                method: "GET",
                headers: { "Accept": "application/json; odata=verbose" },
                success: successHandler,
                error: errorHandler
            }
        );
    }

    // Function to handle the success event.
    // Prints the host web's title to the page.
    function successHandler(data) {
        var jsonObject = JSON.parse(data.body);
        $('#message').html(jsonObject.d.CurrentUser.Title  +
                    '<br/>HostWeb: <b>' + jsonObject.d.Title + '</b>');
    }

    // Function to handle the error event.
    // Prints the error message to the page.
    function errorHandler(data, errorCode, errorMessage) {
        $('#message').html("Could not complete cross-domain call: " + errorMessage);
    }


    // Returning the params object
    function getParams() {
        var params = {};
        location.search.split('?')[1].split('&').forEach(function (param) {
            var key = param.split('=')[0],
                val = decodeURIComponent(param.split('=')[1]);
            params[key] = val;
        });
        return params;
    }

})();
{% endhighlight %}


Running the example right away won't work. The reason is that miss the most important configuration part for SP
2013 apps. Whenever your app requires acccess information in the `HostWeb` you have to configure the appropriate
permissions. In addition whenever a site admin installs an app, they have to decide if they trust our app or not.


It will be interesting to see how this new concept (new to SharePoint, you're probably familiar with it from mobile
apps) will pay off in the real world. For Napa apps there are just one additional step required
as developer, so let's walk trough that process quickly.

**Step 1** As a developer you have to explicitly ask for permission for your app
![Napa Development](/img/2012-08-24-NapaPermision.jpg)
**Step 2** As site admin you have to trust the app
![Napa Development](/img/2012-08-24-NapaTrust.jpg)
**Step 3** Finally the desired result: A User name and Web title.
![Napa Development](/img/2012-08-24-NapaRestResult.jpg)


That's it for today and I'm leaving you with this example, which -while visually not as impressive as the first
version- under the hood is clean as hell and hopefully well understood `;-)`.
Take it a starting point for your own Napa apps and let me know how it goes.

One question though: How do you feel about SP apps and the SP marketplace in general? Are
you already sold (can't wait for it to open, so that you can get ritch) or do you have some concerns compared to
traditional farm or sandbox solutions?

