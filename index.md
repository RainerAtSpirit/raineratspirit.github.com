---
layout: page
title: Hi there, it's me RainerAtSpirit
# tagline: Supporting tagline
---
{% include JB/setup %}
Thanks for stepping by. Find below a list of posts mainly written as a braindump while facing technical challenges.

Enjoy

Rainer

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>




