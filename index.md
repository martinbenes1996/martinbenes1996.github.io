---
layout: default
title: Home
---
<h1>Hello world!</h1>

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a> ({{post.url}})
    </li>
  {% endfor %}
</ul>