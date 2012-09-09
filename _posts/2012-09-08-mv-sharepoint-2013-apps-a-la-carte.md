---
layout: post
title: "MV* SharePoint 2013 Apps a la carte"
description: ""
category: 'Good to know'
tags: ['SharePoint 2013', 'AutoHosted Apps', 'MV*']
---
{% include JB/setup %}

Hey there,

Welcome to our small SharePoint App restaurant, where we serve the best client side MV* *crossover* SharePoint apps
worldwide. So what make us so special and what do I mean when saying MV* *crossover* app?

As you already know you can use the Visual studio 2012 `App for SharePoint 2013` template to create app flavors
like `SharePoint-hosted`, `Autohosted` or `Provider-hosted`, which can be used as starting point for creating
your own apps.
And there is this world of client side single page application (SPA) that can be easily mixed into it. If you've
ever have written some SPA before, you'll know that you're in the need to structure your apps real soon, otherwise
you'll start writing unmaintainable Spaghetti code.

 That's where Model View Controller, Model View Presenter, Model View View Model or short MV* libraries like
 [Knockout], [backbone.js]... or frameworks like [dojo], [yui]... come into play. They help you,
 and I'm going to quote John Papa's words here:

>Turn your code from [Spaghetti to Ravioli].


With that said without further hassle, here's what we are going to serve today. Even better find all background
information needed to help you get started when cooking your own.

[backbone.js]: http://backbonejs.org/
[dojo]: http://dojotoolkit.org/
[yui]: http://yuilibrary.com/

![SharePoint 2013 ToDo App](/img/2012-09-08-ToDosApp.jpg)

If you haven't made up your mind yet, which MV* style is the right one for you, drop by [http://todomvc.com/].
>Developers these days are spoiled with choice when it comes to selecting an MV* framework for structuring and
>organizing their JavaScript web apps.
>
>Backbone, Ember, AngularJS, Spine... the list of new and stable solutions continues to grow,
>but just how do you decide on which to use in a sea of so many options?
>
>To help solve this problem, we created TodoMVC - a project which offers the same Todo application implemented using
>MV* concepts in most of the popular JavaScript MV* frameworks of today.


Want to find out what makes it a framework or library and if one or another better suits your needs? Make sure
that you don't miss Stephen Sanderson's [the Seven Frameworks] post.

[http://todomvc.com/]: http://todomvc.com/
[Spaghetti to Ravioli]: http://johnpapa.net/spapost6
[the Seven Frameworks]: http://blog.stevensanderson.com/2012/08/01/rich-javascript-applications-the-seven-frameworks-throne-of-js-2012/

Enough theory let's get hands-on to see *What needs to be done*. Each todo below has some instructions and screen
shots, but I won't dig into too much code today. Don't worry though, because

1. The [ToDoMVC example is available at github], so clone it and use it as starting point for your own apps
2. Each todo has an associated git tag that let you checkout the example at this specific point
3. Links to git diffs are available, whenever there's a need for some details

[ToDoMVC example is available at github]: https://github.com/RainerAtSpirit/ToDoMVC

###Todo 1: Create SharePoint 2013 Autohosted app
Let's start by creating an App for SharePoint 2013 in Visual Studio 2012 and use Autohosted for the hosting type.

![Create App for SharePoint](/img/2012-09-08-CreateApp.jpg)

![Create App for SharePoint](/img/2012-09-08-Autohosted.jpg)

![Create App for SharePoint](/img/2012-09-08-CleanTheStageBefore.jpg)

###Todo 2: Clean the stage
The defaults above don't do us any good as we are going to create a client side SPA.
Let's get rid of all Properties and References, and then delete the Pages directory and the TokenHelper.cs file.
This will leave us with a really clean stage, which we can build on. *Please note* that at this point the example
isn't doing anything.
![Create App for SharePoint](/img/2012-09-08-CleanTheStageAfter.jpg)

###Todo 3: Select from the ToDoMV* menu
Picking something from the ToDoMV* menu is completely up to your personal taste,
but it probably helps if you already have some experience with the library/framework you chose.

If you've seen/read [The Ferrari meets JayData], you're probably not astonished why my pick for today is the
Knockout + RequireJS  example from the labs section.

[The Ferrari meets JayData]: http://rainerat.spirit.de/2012/08/01/the-ferrari-meets-jaydata/

Regardless of what you've picked, here are the steps to get it working.

**Step 1:** Choose from the menu.
![Create App for SharePoint](/img/2012-09-08-ChooseFromTheMenu.jpg)

**Step2:** Copy the files into the web project.
![Create App for SharePoint](/img/2012-09-08-PickFiles.jpg)

**Step3:** Copy the asset directory that holds common files for all todo examples.
![Create App for SharePoint](/img/2012-09-08-PickAssets.jpg)

**Step4:** Update the appmanifest.xml so that it points to your index.html (or whatever start page you've
created/copied).
![Create App for SharePoint](/img/2012-09-08-UpdateAppManifest.jpg)

**Step 5:** When done press F5 start the app and enjoy the results.

**Please note**: If you are seeing a `405.0 error` instead, make sure to apply the settings described in this post
[SharePoint 2013 App HTTP Error 405.0](http://rainerat.spirit.de/2012/09/03/SharePoint-2013-App-HTTP-Error-405.0/)
![Create App for SharePoint](/img/2012-09-08-FirstResult.jpg)

###Todo 4: Add the chrome control
Adding the chrome control is a two-step process.

**Step 1:** Add the chrome_ctrl_placeholder div to index.html
[Todo 4 Step Diff 1](https://github.com/RainerAtSpirit/ToDoMVC/commit/df8de9a1644fc75fbfa9289d1a9440b04bcbcf9a#diff-1)
![Create App for SharePoint](/img/2012-09-08-index.jpg)

**Step 2:** Add the required chrome control JavaScript to your code.
[Todo 4 Step Diff 2](https://github.com/RainerAtSpirit/ToDoMVC/commit/df8de9a1644fc75fbfa9289d1a9440b04bcbcf9a#diff-3)
![Create App for SharePoint](/img/2012-09-08-addcode.jpg)

Depending on the example you've picked, running this right away might lead to some error messages,
which needs to be resolved before moving on. With the [Knockout] + [RequireJS]  example I'm running into this.
![Create App for SharePoint](/img/2012-09-08-MissingJQuery.jpg)

Reason is that this example doesn't use jQuery at all... up till now.  So let's add it following the [RequireJS] way
and while on it let's make sure that we try loading from a CDN first before serving our own local copy.

[Knockout]: http://knockoutjs.com/
[RequireJS]: http://requirejs.org/
![Create App for SharePoint](/img/2012-09-08-mainjs.jpg)

![Create App for SharePoint](/img/2012-09-08-Cosmetics.jpg)


###Todo 5: Cosmetic changes
There are only a couple of [minor tweaks] left like adding an AppIcon, changing the body and/or chrome-control width
before we're satisfied with the result.
![Create App for SharePoint](/img/2012-09-08-MissionAccomplished.jpg)

That's it for today, you've just cooked your **first MV* SharePoint 2013 app**.

Is there more to it? Sure! Here are a couple of suggestions that you might want to try out:

+ Store todos in a SharePoint list instead of local storage
+ Store todos in SQL azure
+ Store todos in your own provider-hosted data-store
+ ... fill in the blanks with your own ideas


As long as you like cooking/coding/building/architecting, I don't see any shortcoming of opportunities
while SharePoint 2013 is making it to the market.

[minor tweaks]: https://github.com/RainerAtSpirit/ToDoMVC/commit/76e784704f62b3399dfd251b7435ed841d9301b4