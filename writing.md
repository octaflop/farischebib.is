---
layout: page
title: Writing
permalink: /writing/
---

Full technical posts live at **[faris.ai](https://faris.ai)** — genomics, ML, Python, and
data engineering. Excerpts and links are collected here.

---

### Recent posts on faris.ai

*[See all posts at faris.ai →](https://faris.ai)*

---

### Posts here

{% assign posts = site.posts %}
{% if posts.size > 0 %}
<ul class="post-list">
{% for post in posts %}
  <li>
    <span class="post-date">{{ post.date | date: "%Y-%m-%d" }}</span>
    &nbsp;
    <a href="{{ post.url }}">{{ post.title }}</a>
    {% if post.category %}
      <small>&nbsp;·&nbsp;{{ post.category }}</small>
    {% endif %}
  </li>
{% endfor %}
</ul>
{% else %}
*No posts yet.*
{% endif %}
