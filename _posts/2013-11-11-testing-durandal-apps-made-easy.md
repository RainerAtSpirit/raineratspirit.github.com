---
layout: post
title: "Testing Durandal apps made easy"
description: ""
category: 'Catch fish'
tags: ['Grunt', 'Testing', 'Durandal']
---
{% include JB/setup %}

Hi there,

The today's post is targeted to a very dedicated audience, so let's see if the following is for you.

1. You belong to the growing number of [Durandal] developer?
2. You have a need to make your apps better?
3. You don't know yet how to test a Durandal app?

If you answered one or multiple of these questions with a yes, read on.

Hey, even you answered the last two questions with a **no** read on to see if [Grunt] can make your life easier. When
you haven't heard of [Grunt] yet, head over to smashingmagazine for a nice [Grunt intro].


##Prerequisites

Clone the following repo [https://github.com/RainerAtSpirit/HTMLStarterKitPro], which is the [Grunt] enabled version of
 the Durandal "HTML Starter kit" (at the time of this writing Durandal 2.0.1). Follow the steps in the readme,
 obviously skipping things you've already installed on your machine.

### Quick start

1. install node from http://nodejs.org
2. install grunt using `npm install -g grunt-cli`
3. download/clone this repo
4. run `npm install` in repo's root directory to install grunt's dependencies
5. run `grunt` to run the default task, which opens the resultant `_specrunner.html` in the browser... and waits for
 you to write some tests


When everything runs smoothly you should see something like the following while running `grunt`.

{% highlight bash linenos %}
    $ grunt
    Running "jshint:all" (jshint) task
    >> 8 files lint free.

    Running "jasmine:dev" (jasmine) task
    Testing jasmine specs via phantom
    ..............
    14 specs in 0.113s.
    >> 0 failures

    Running "connect:dev:livereload" (connect) task
    Started connect web server on 127.0.0.1:8999.

    Running "open:dev" (open) task

    Running "watch:dev" (watch) task
    Waiting...
{% endhighlight %}

![Specrunner](/img/2013-11-11-SpecRunner.jpg)

**Note**: If you are seeing an error message like following instead...

{% highlight bash linenos %}
    $ grunt
    Loading "Gruntfile.js" tasks...ERROR
    >> Error: Cannot find module 'connect-livereload'
    Warning: Task "default" not found. Use --force to continue.
Aborted due to warnings.

{% endhighlight %}

then reread the instructions, you probably missed step 4 `;-)`.

### Ready for  your first test? Time for some myth busting...
##Durandal's AMD modules are hard to grok

Hmh, not really. From a Durandal perspective an AMD module should either return a singleton or a constructor
function. Here are two simple examples:

**singleton.js**
{% highlight javascript linenos %}
define(function () {
    'use strict';

    return {
       type: 'I\'m a singleton'
    };
});
{% endhighlight %}

**constructor.js**
{% highlight javascript linenos %}
define(function () {
    'use strict';

    return function(){
       this.type =  'I\'m a constructor function';
    };
});
{% endhighlight %}

**On a side note** When a module has dependencies than there are two ways to declare them.

**singleton.js regular** syntax
{% highlight javascript linenos %}
define(['knockout'], function (ko) {
    'use strict';

    return {
       type: 'I\'m a singleton',
       observable: ko.observable('')
    };
});
{% endhighlight %}

**singleton.js [sugar]** syntax
{% highlight javascript linenos %}
define(function (require) {
    'use strict';
    var ko = require('knockout');

    return {
       type: 'I\'m a singleton',
       observable: ko.observable('')
    };
});
{% endhighlight %}

You'll find both in the wild and it's a question of personal style, which one to use. Before you ask,
I tend to use the sugar syntax lately, but now back to the track.

When I say Durandal's perspective I mean that the `module` gets loaded by using `system.resolveObject`,
where Durandal differentiate between modules that return a function and ... the rest. Of course Durandal wouldn't be
Durandal if this couldn't be customized, but that's another story and you have to read it on your
own (see [customizing system]).

{% highlight javascript linenos %}
resolveObject: function(module) {
    if (system.isFunction(module)) {
        return new module();
    } else {
        return module;
    }
},
{% endhighlight %}


Ok so how can we use our testing environment to figure out what is returned by our modules.
Let's face it just because I assume that one returns a constructor  and the other a singleton doesn't necessarily
mean that it's true.

Start by copying `flickr.spec.js` to `singleton.spec.js` and update the spec to the following.

{% highlight javascript linenos %}
/*global jasmine, describe, beforeEach, it, expect, require */
describe('viewmodels/singleton', function() {
    "use strict";

    var singleton = require('viewmodels/singleton');

    it('should have a "type" property', function() {
        expect(singleton.type).toBeDefined();
    });

});
{% endhighlight %}

On save you'll see the `grunt watch` task kicking  in, running the specs updating the browser via `livereload`.
Hopefully all is green, so let's move on.

Copy `singleton.spec.js` to `constructor.spec.js` and update the spec so that it loads `constructor.js` instead:
{% highlight javascript linenos %}
/*global jasmine, describe, beforeEach, it, expect, require */
describe('viewmodels/constructor', function() {
    "use strict";

    var constructor = require('viewmodels/constructor');

    it('should have a "type" property', function() {
        expect(constructor.type).toBeDefined();
    });

});
{% endhighlight %}


This time you should see a nice red warning message at the command prompt telling you that's something wrong.

{% highlight bash linenos %}
>> File "test\specs\dev\constructor.spec.js" changed.

Running "jasmine:dev" (jasmine) task
Testing jasmine specs via phantom
x...............
viewmodels/constructor:: should have a "type" property: failed
  Expected undefined to be defined. (1)
16 specs in 0.011s.
>> 1 failures
Warning: Task "jasmine:dev" failed. Use --force to continue.

Aborted due to warnings.
{% endhighlight %}

Now having a browser that allows us investigating what's going on becomes pretty handy. Luckily in our case we
don't even need that. We already know that `constructor.js` returns a
constructor function and not an object, so let's rewrite the test to take that into account, which should bring
us back to "all green". 

{% highlight javascript linenos %}
describe('viewmodels/constructor', function() {
    "use strict";

    var Constructor = require('viewmodels/constructor'),
        instance = new Constructor();

    it('should be a Constructor function', function() {
          var a = new Constructor();
          expect(a.constructor).toEqual(Constructor);
      });

    it('should have a "type" property', function() {
        expect(instance.type).toBeDefined();
    });

});

{% endhighlight %}


That's it for today, pretty straight forward, so it can be easily applied/adapted to your own Durandal projects. It's
 the first post in the "Catch fish" category, hopefully more to come.

>Give a man a fish, and you feed him for a day; show him how to catch fish, and you feed him for a lifetime.

Let me know what kind of *fish* you can come up with.



[Durandal]: http://www.durandaljs.com
[Grunt]: http://gruntjs.com/
[Grunt intro]: http://coding.smashingmagazine.com/2013/10/29/get-up-running-grunt/
[https://github.com/RainerAtSpirit/HTMLStarterKitPro]: https://github.com/RainerAtSpirit/HTMLStarterKitPro

[stackoverflow]: http://stackoverflow.com/questions/tagged/durandal
[google groups]: https://groups.google.com/forum/#!overview

[sugar]: http://requirejs.org/docs/whyamd.html#sugar
[customizing system]: http://durandaljs.com/documentation/Customizing-System/
