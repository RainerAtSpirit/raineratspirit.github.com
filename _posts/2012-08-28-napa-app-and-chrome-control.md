---
layout: post
title: "Nappa apps and Chrome Control"
description: ""
category: 'Good to know'
tags: ['SharePoint 2013', 'Napa']
---
{% include JB/setup %}


Let's assume  you've

a) read Ted Pattison's blog [My first weekend in Napa] and got Microsoft's invite

> But then I think about this new breed of SharePoint developer that Mike Morton described to me. A developer that's
> never never used SharePoint before and has never seen a SharePoint dinosaur like me (except maybe in a museum).
> This developers has a very high IQ and has tons of experience with things like .NET, C#, JavaScript and jQuery

b) seen my [previous post] that turned the OOTB Nappa masterpage template into an easier to handle HTML5
template

[My first weekend in Napa]: http://blog.tedpattison.net/Lists/Posts/Post.aspx?List=9d54806e-14ca-456d-a62a-b903c9dda841&ID=17&utm_source=twitterfeed&utm_medium=twitter&Web=dbc8a5bc-c0d9-412c-8929-177a045a5351
[previous post]: http://rainerat.spirit.de/2012/08/24/goodbye-ferrari-hello-napa/


Just to recap. In the template we removed the reference to the masterpage, which is normally responsible to load the
chrome for Nappa apps, because we didn't like the overhead that comes with it.
According to the invite you've never seen SharePoint before (feel free to read on even if you have) and you're
wondering if
you're now supposed to turn the minimalistic Nappa template (see below) into something that looks like a SharePoint
app
on your
own.

![First Result](/img/2012-08-24-NapaRestResult.jpg)

Without the masterpage reference our current Nappa template
behaves more like a hosted HTML5 app and for that kind of app Microsoft offers **[the client chrome control]**
as answer to that challenge.

[the client chrome control]: http://msdn.microsoft.com/en-us/library/fp179916(v=office.15).aspx

For the eager of you here are the 5 steps that provide you access to a clean Nappa template that uses [the client chrome control]:

**Step 1:** Create a new Nappa app
![Create Nappe App](/img/2012-08-28-ChromeControl-New-App.jpg)
**Step 2:**  Replace default.aspx content with [this default.aspx content]
![default.aspx](/img/2012-08-28-ChromeControl-Default-Aspx.jpg)
**Step 3:**  Replace apps.js content with [this app.js content]
![app.js](/img/2012-08-28-ChromeControl-App-JS.jpg)
**Step 4:**  Change permission to allow read access to web
![permissions](/img/2012-08-28-ChromeControl-Permission.jpg)
**Step 5:** . Trust the app
![trust](/img/2012-08-28-ChromeControl-Trust.jpg)
**Step 6:** Party time: A clean Nappa App template with client chrome control
![result](/img/2012-08-28-ChromeControl-Result.jpg)



[this default.aspx content]: https://raw.github.com/gist/3436332/39aa1959e8a39b86509a387c1cba242b9d05e629/SourceDefault.aspx
[this app.js content]: https://raw.github.com/gist/3498247/2fa274af932028e97b6091226f360298670fff4e/app.js


The chrome configuration is done in the `renderChrome()` function and is following the settings in this MSDN [the
client chrome control] article. **Please note** that the MSDN settings assume that you create a couple of additional
pages otherwise the links won't work.

One minor issue that I've noticed it that without further modifications the MSDN version might lead to some
flash of unstyled content ([fouc]). One way to prevent that is to change our HTML in default.aspx to `<div
id="message" style="display: none">` to hide our message div by default. In our code we then bind to the load event of
the dynamically injected stylesheet and leverage `$('#message').show();` to show the message.

{% highlight javascript linenos %}
var nav = new SP.UI.Controls.Navigation(
                        "chrome_ctrl_placeholder",
                        options
                  );
nav.setVisible(true);
$('#chromeControl_stylesheet').on('load', function (event) {
    $('#message').show();
})
{% endhighlight %}

[fouc]: http://en.wikipedia.org/wiki/Flash_of_unstyled_content


With those modification you should have a nice clean starting template for your HTML5 Nappa apps.

Let's party!
