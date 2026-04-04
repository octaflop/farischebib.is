---
layout: page
title: Projects
permalink: /projects/
---

Selected work in data, ML, and teaching. Full list on [GitHub](https://github.com/octaflop).

---

{% for project in site.data.projects %}
{% if project.status != "archived" %}
### [{{ project.title }}]({{ project.url }})

{{ project.description }}

{% if project.tags %}
<small>{{ project.tags | join: " · " }}</small>
{% endif %}

{% endif %}
{% endfor %}
