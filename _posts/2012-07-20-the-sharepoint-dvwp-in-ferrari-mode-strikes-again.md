---
layout: post
title: "The SharePoint DVWP in Ferrari mode strikes again"
description: ""
category: 'Good to know'
tags: [SharePoint, DVWP, MetroJS, 'Zurb Foundation 3']
---
{% include JB/setup %}
In the [last post] we disected the SharePoint DVWP up till the point where it delivered **clean HTML5**. If
you remember I call this  mode the **`Ferrari`**.
Now the bad news: For those who like to cut things down to the bare bones, that's it. You can't disect the
**DVWP** any further.

Now the good news: For those who think that this would be great starting point to build something new,
read on. In this post I'm going to show you my way of driving the **`Ferrari`**. Of course this is not the only
way, so feel free to do something completely different... and let me know about your progress.

First let's ask ourself some question:

1. What are we going to build?
2. Which technologies are we going to use?
3. How to effectively use our **`Ferrari`** in that landscape?


**Answer to Q1:** Let's build a new version of the [Metro style menu web part], that was initially build by [Peter
Collins]. Hey Rainer, why would you do that? It's already build, isn't it? Yeah, you're right,
but we are going to add some visual effects and some configuration options to the picture,
which wasn't in the first version. Simply think of our version as V2.0.

**Answer to Q2:** A **`Ferrari`** needs to be driven in adequate places like the N&uuml;rburgring [in Germany],
so let's try to find a technology stack that can cope with that ideal `;-)`.


###Technologies:

1. Accessing SharePoint data: [DVWP in ferrari mode]
2. Providing a modern HTML5/CSS3 Framework  [Zurb Foundation 3]
3. Metro styled live tiles by Drew Greenwell [MetroJS]
4. Alternative for SergoiUI (the metro font) [Open Sans Condensed]
5. Metro like icons by IconShock [Free Metro Icons]


The reasoning behind each selection is simple: I like them. I know that there are alternatives at each level,
but as said earlier it's up to you to decide what and how you're going to build.
Now without further explanation lets show you two screenshots of the finished result. Thanks to some feedback I got
on twitter from Marc D Anderson the second screenshot shows an optimized version for iPhones.

![Empty ASPX Page](/img/2012-07-20-dvwp-result.jpg)

![Empty ASPX Page](/img/2012-07-20-dvwp-iPhone.jpg)


[Source],
[Live](http://www.spirit.de/demos/metro/Zurb/MetroStyle.aspx)

[Source]: https://github.com/RainerAtSpirit/ZurbMeetsMetroJS/blob/master/MetroStyle.aspx

I encourage you to take a look at the live version first, as there are some really cool animations going on. All
kudos to Drew Greenwell's [MetroJS] project.

Now let's dive a littler deeper into the code by looking at the [Source].
As you can see this is pretty straight forward foundation HTML5 template. Somewhere in the middle you see this `<div
id="metroTiles" class="twelve columns tiles">...</div>` and this is where the **DVWP** is included.
If you are looking very closely
you spot some differences from where we left the web part last time. This time the web part properties are
stripped down to the bare minimum and `<XslLink>XSLT/ListsAsTiles.xslt</XslLink>` is used for storing the XSLT in
 an external file. By storing the XSLT separately you get the benefits of syntax checking etc.
 As in the Peter Collin's version the DataSourceMode is set to `ListOfLists` in which the server returns information
 about all lists/libraries of the current site.

{% highlight html linenos %}
    <div id="metroTiles" class="twelve columns tiles">
        <!-- DVWP with DataSourceMode="ListOfLists" -->
        <WebPartPages:DataFormWebPart runat="server" AsyncRefresh="False" FrameType="None" SuppressWebPartChrome="True">
            <ParameterBindings></ParameterBindings>
            <DataFields></DataFields>
            <XslLink>XSLT/ListsAsTiles.xslt</XslLink>
            <Xsl></Xsl>
            <DataSources>
                <SharePoint:SPDataSource runat="server" DataSourceMode="ListOfLists" SelectCommand=""
                                         ID="dsLists"></SharePoint:SPDataSource>
            </DataSources>
        </WebPartPages:DataFormWebPart>
        <!-- DVWP with DataSourceMode="ListOfLists" -->
    </div>
{% endhighlight %}

I'm not going to talk about the [Zurb Foundation 3] specific configurations here (sass and compass based),
but from my first impression I can
say at least so much: "**It's hot! Real hot!**". A quantum leap compared to other prominent HTML5
frameworks. Don't take my word on it, check it out on your own and let me know what you think.

**Answer to Q3:** This one is pretty short **XSLT**.

**Checkpoint:** Up till now you should have a rough understanding how the various pieces of the solution fits
together. While it's certainly not rocket science it's nothing for beginners either. But now we are coming to the
heart of the solution. We have to fine tune the **`Ferrari`** so that it can deliver it's best performance. You
asked for it, so here it is:

_A word of warning_: There's no need to read on if you most likely never work with XSLT at all.
###XSLT deep dive

XSLT might not be everybody's darling, but let's face it, you can do a lot of smart things in SharePoint with it that
otherwise would require either third party tools or custom .Net development.

You have access to the complete code at [github](https://github
.com/RainerAtSpirit/ZurbMeetsMetroJS/blob/master/XSLT/ListsAsTiles.xslt) and I'm going to give you some background
information about the various part below.
Of course that
code only reflects my
coding style. If you pick up one or another XSLT trick that you find usefull, good. If not there's certainly more than
 one way to skin a cat, so I'd glad to hear from you how you are tackling things instead.

BTW before you ask: My favorite book ever on that topic is Jenni Tennison's [XSLT and XPath On the edge](http://www
.amazon.com/XSLT-XPath-Unlimited-Professional-Mindware/dp/0764547763).

With that here's what makes the **`Ferrari`** engine tick. After the usual `<xsl:stylesheet ..>` declaration there's
the `$Rows`
variable defined.
It's
used to filter out list/libaries that you don't want to render e.g.
like those with `(@__spHidden = 'True'` and ...

{% highlight xslt linenos %}
<xsl:variable name="Rows" select="/dsQueryResponse/Rows/Row[not(@__spHidden = 'True') and not(contains
(@__spDefaultViewUrl, '_catalogs')) and @__spTitle != 'ServiceFiles']"/>
{% endhighlight %}

I want the solution to be configurable. One of the easiest way to accomplish that is by defining a variable and
access it via `msxsl:node-set($VariableName)`. Here I'm using the `global` element to store global configuration
options and `tiles` to store configuration options based on the `BaseTemplate` e.g. Contacts,
DocumentLibrary and so on. As you can see there are options for color and icon, which control the visual apperance,
but also options like `data-mode` and
 `data-direction` that will be used by [MetroJS] to provide the slide and flip animations.

In a fully fledged solution you'd store those somewhere externally and then bring them in either via _Linked Data
source_, cookies, querystrings etc.

{% highlight xslt linenos %}
<!-- configMap allows configuration per BaseTemplate -->
<xsl:variable name="configMap">
    <global>
        <maxTiles>12</maxTiles>
        <wideTiles>3</wideTiles>
        <backTileTitle>Last updated</backTileTitle>
    </global>
    <tiles>
        <item BaseTemplate="Contacts" color="lime" icon="images/48/bomb.png"/>
        <item BaseTemplate="DocumentLibrary" color="teal" icon="images/48/file.png" data-mode="slide"
              data-direction="vertical"/>
        <item BaseTemplate="GenericList" color="green" icon="images/48/inventory2.png" data-mode="flip"
              data-direction="vertical"/>
        <item BaseTemplate="Tasks" color="red" icon="images/48/bomb.png" data-mode="flip"
              data-direction="horizontal"/>
        <item BaseTemplate="GanttTasks" color="purple" icon="images/48/hand_thumbsup.png"/>
        <item BaseTemplate="IssueTracking" color="pink" icon="images/48/clipboard.png" data-mode="slide"
              data-direction="vertical"/>
        <item BaseTemplate="Links" color="lime" icon="images/48/link.png"/>
        <item BaseTemplate="WebPageLibrary" color="brown" icon="images/48/clipboard.png"/>
        <item BaseTemplate="Events" color="mango" icon="images/48/clipboard.png"/>
        <item BaseTemplate="unknown" color="blue" icon="images/48/smiley_sad.png"/>
    </tiles>
</xsl:variable>

<!-- shortcuts to globalConfig and tilesConfig -->
<xsl:variable name="globalConfig" select="msxsl:node-set($configMap)/global"/>
<xsl:variable name="tilesConfig" select="msxsl:node-set($configMap)/tiles"/>
{% endhighlight %}


The next variable `$itemInList` stores a result set that it sorted descending by `@__spItemCount`. This in combination
with `$globalConfig/wideTiles` will be used to show wide tiles based on the number of items in a given list or
library e.g. $wideTiles = 3 would show the 3 lists with the most items as wide tile.

{% highlight xslt linenos %}
<!-- itemsInList sorted by @__spItemCount descending. Used to distinguish between normal and wide tiles  -->
<xsl:variable name="itemsInList">
    <xsl:for-each select="$Rows">
        <xsl:sort select="@__spItemCount" order="descending" data-type="number"/>
        <item id="{@__spID}" count="{@__spItemCount}" pos="{position()}"/>
    </xsl:for-each>
</xsl:variable>
{% endhighlight %}

The above variables are all globally defined, so they can be accessed throughout the code in every template.
Next comes the root template and you can see that the result set is sorted by a _heavy_ **XPath** expression.
All we want to do here is having the lists/libraries sorted by the time they were last modified,
but unfortunately the system buries the only reliable UTC date somewhere down in the `@__spPropertiesXml`
attribute.


By testing against the configuration option `$globalConfig/maxTiles` you restrict the number of tiles rendered to
whatever you've configured, nothing fancy here.

{% highlight xslt linenos %}
<xsl:template match="/">
    <xsl:for-each select="$Rows">
        <!-- This complex sort criteria is required because __spModified is localized. Using information inside __spPropertiesXml instead -->
        <xsl:sort
                select="translate(substring-before(substring-after(@__spPropertiesXml, 'Modified=&quot;'), '&quot; LastDeleted'), ' :', '')"
                order="descending" data-type="number"/>
        <xsl:if test="position() &lt;= $globalConfig/maxTiles">
            <xsl:call-template name="Tile"/>
        </xsl:if>
    </xsl:for-each>
</xsl:template>
{% endhighlight %}

The next template starts building up the tile html, but as you can see this is divided into
multiple separate templates. The reasoning behind this is that I don't like having logic inside html templates.
That allows far easier restructuring of the html template later down the road.
So in the `Tile`
template we build up a helper variable `$t` using the `MetaData` template (logic),
which is passed to the `TileTemplate` (html).

{% highlight xslt linenos %}
<xsl:template name="Tile">
    <!-- Mashup of $configMap and $ itemsInList for the current item -->
    <xsl:variable name="coreMetaData">
        <xsl:call-template name="MetaData">
            <xsl:with-param name="baseTemplate" select="@__spBaseTemplate"/>
            <xsl:with-param name="spID" select="@__spID"/>
            <xsl:with-param name="spPropertiesXml" select="@__spPropertiesXml"/>
        </xsl:call-template>
    </xsl:variable>
    <!-- shortcut for accessing $coreMetaData -->
    <xsl:variable name="t" select="msxsl:node-set($coreMetaData)"/>

    <xsl:call-template name="TileTemplate">
        <xsl:with-param name="t" select="$t" />
    </xsl:call-template>
</xsl:template>
{% endhighlight %}

Alright prime time, we are bulding the required html that represents one tile.  We start by copying
the tile html from the [MetroJS] page. There are two data sources that we can access here.
1. `$Rows` attributes can be accessed directly e.g. `<xsl:value-of select="@__spItemCount"/>` or
   `data-target="{@__spDefaultViewUrl}"`.
2. Meta data can be accessed through `$t` with the same ease as e.g. ` <div class="live-tile
{$t/item/@color} {$t/size}"` or
`<img src="{$t/item/@icon}" class="micon"/>`.

{% highlight xslt linenos %}
<xsl:template name="TileTemplate">
    <xsl:param name="t" />
    <div class="live-tile {$t/item/@color} {$t/size}"
         data-stops="100%"
         data-speed="750"
         data-delay="-1"
         data-mode="{$t/item/@data-mode}"
         data-direction="{$t/item/@data-direction}"
         data-target="{@__spDefaultViewUrl}"
         data-baseTemplate="{@__spBaseTemplate}">
        <span class="tile-title">
            <xsl:value-of select="@__spTitle"/>
            <span class="badge right">
                <xsl:value-of select="@__spItemCount"/>
            </span>
        </span>
        <div>
            <img src="{$t/item/@icon}" class="micon"/>
        </div>
        <div>
            <h3>
               <xsl:value-of select="$globalConfig/backTileTitle" />
            </h3>
            <span class="prettyDate" title="{$t/prettyDate}">
                <xsl:value-of select="$t/prettyDate"/>
            </span>
        </div>
    </div>
</xsl:template>
{% endhighlight %}

The last template builds an mashup for the current Row and `$tilesConfig`. In addition `<size>`
 and `<prettyDate>` elements are calculated here.

{% highlight xslt linenos %}
<xsl:template name="MetaData">
    <xsl:param name="spID"/>
    <xsl:param name="baseTemplate"/>
    <xsl:param name="spPropertiesXml"/>
    <!-- accessible via $t/item/@XXXX. Available attributes see $configMap/tiles/item/@XXXX -->
    <xsl:choose>
        <xsl:when test="$tilesConfig/item[@BaseTemplate = $baseTemplate]">
            <xsl:copy-of select="$tilesConfig/item[@BaseTemplate = $baseTemplate]"/>
        </xsl:when>
        <xsl:otherwise>
            <xsl:copy-of select="$tilesConfig/item[@BaseTemplate = 'unknown']"/>
        </xsl:otherwise>
    </xsl:choose>
    <!-- accessible via $t/size -->
    <size>
        <xsl:choose>
            <xsl:when test="msxsl:node-set($itemsInList)/item[@id = $spID]/@pos &lt;= $globalConfig/wideTiles">
                <xsl:text>wide</xsl:text>
            </xsl:when>
            <xsl:otherwise/>
        </xsl:choose>
    </size>
    <prettyDate>
        <xsl:variable name="DateRaw"
                      select="translate(substring-before(substring-after($spPropertiesXml, 'Modified=&quot;'), '&quot; LastDeleted'), ' ', 'T')"/>
        <xsl:value-of
                select="concat(substring($DateRaw, 1, 4), '-', substring($DateRaw, 5, 2), '-', substring($DateRaw, 7,2), substring($DateRaw, 9), 'Z')"/>
    </prettyDate>
</xsl:template>
{% endhighlight %}

That's it, you made it. Within SharePoint we've build a modern HTML5/CSS3/JavaScript solution powered by the
**`Ferrari`** and at its core **134 lines** of fully documented XSLT.

As always feedback welcome and bye for now.

[last post]: /2012/07/15/sharepoint-dvwp-from-workhorse-to-ferrari-in-7-steps/
[Metro style menu web part]:http://www.metaengine.com/2012/03/SharePoint-menu-web-part-with-Metro-style-using-a-DVWP
[Peter Collins]: https://plus.google.com/107337505738738118800/posts
[in Germany]: http://www.nuerburgring.de/


[DVWP in ferrari mode]: http://rainerat.spirit.de/2012/07/15/sharepoint-dvwp-from-workhorse-to-ferrari-in-7-steps/
[Live Preview]: http://www.spirit.de/demos/metro/Zurb/MetroStyle.aspx
[Zurb Foundation 3]: http://foundation.zurb.com/
[MetroJS]: http://drewgreenwell.com/projects/metrojs
[Free Metro Icons]: http://www.iconshock.com/windows8-icons/
[Open Sans Condensed]: http://www.google.com/webfonts#UsePlace:use/Collection:Open+Sans+Condensed
