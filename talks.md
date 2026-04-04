---
layout: page
title: Talks
permalink: /talks/
---

Conference talks and presentations, mostly at [SLCPython](https://slcpy.com).

---

{% for talk in site.data.talks %}
### {{ talk.title }}

{{ talk.event }} &nbsp;·&nbsp; {{ talk.date | date: "%B %Y" }}

{{ talk.description }}

{% if talk.url and talk.url != nil %}
[Event page →]({{ talk.url }})
{% endif %}
{% if talk.slides and talk.slides != nil %}
&nbsp;·&nbsp; [Slides →]({{ talk.slides }})
{% endif %}

---
{% endfor %}
