---
layout: post
title: "WinJS.Namespace.define gotcha"
description: ""
category: 'Good to know'
tags: ["Win8", "JavaScript", "WinJS"]
---
{% include JB/setup %}

So you are following MS best practice and already started namespacing your Metro projects nicely. Good :).
Now here's the challenge: "**spot the issue** with the following code":

**Problematic Version**: using `WinJS.Namespace.define`
{% highlight javascript %}
WinJS.Namespace.define('MyApp', {
    version : '0.0.1'
});

WinJS.Namespace.define('Myapp.Helper', {
    think: function(input) {
        // do something
    }
});

console.log(typeof MyApp.Helper.think);  // -> 0x800a138f - JavaScript runtime error: Unable to get property 'think' of
undefined or null reference

{% endhighlight %}

Yeah, I know you spotted the mistyped namespace `Myapp.Helper` immediately. But what if `Myapp.Helper` would have been defined in
another file, maybe by another coder? You might have been suprised a little, at least I was, when first faced with it;-).

**Better version**: using `WinJS.Namespace.defineWithParent`

{% highlight javascript %}
WinJS.Namespace.define('MyApp', {
    version : '0.0.1'
});

WinJS.Namespace.defineWithParent(MyApp, 'Helper', {
    think: function (input) {
        // do something
    }
});

console.log(typeof MyApp.Helper.think); // -> "function"

{% endhighlight %}

Using `defineWithParent` won't have that issue as you are passing in the parent object as first parameter, so VS
immediately starts yelling if this object doesn't exist.
Probably worth making a rule like only using `define` for root namespaces and from that point on using `defineWithParent`.

Love to hear about your experiences with `WinJS.Namespace`.