# [farischebib.is](https://farischebib.is)

Repo of the build files (and open drafts of posts, in addition to their raw contents) for the online site [farischebib.is](https://farischebib.is).

## Installation

1. `gem install bundler --user-install`
2. `bundle install`
3. `bundle exec jekyll serve`

- Optionally, serve date-less draft posts (typically in `_drafts`) with `--drafts`

4. Set up python for thumbnailer:
1. `python3.11 -m venv .venv`
1. `. .venv/bin/activate`
1. `pip install -r requirements.txt`
1. `python scripts/webify_imgs.py` will create `thumbs` in the `imgs` directory and is by default in `3000px` and `1920px` width

### Writing

1. Create a post in one of the categories under `_posts`
2. Run `python scripts/webify_imgs.py`
3. Add front-matter referencing the updated images. Note `image2` is for mobile browsers. For example:

```markdown
---
layout: post
title: Leading Through Service
category: leading
category_image: "/imgs/moods/sailboat_wide.jpg"
image: "/imgs/thumbs/moods/pink_and_wilted_3000.jpg"
image2: "/imgs/thumbs/moods/pink_and_wilted_1920.jpg"
---
```

## TODO

- [x] Get some mood images going [in a `moods` folder](/imgs/moods/)
  - [ ] Get some videos uploaded
  - [ ] Get some audio captures up
- [ ] Play around with posts on-the-go
- [ ] Link to mastadon
- [ ] Show deprecation of twitter link
- [ ] Make a “meta” connection back to this repo
- [ ] Write more articles
  - [ ] Some ideas on education in the python space
  - [ ] Ideas on the role of libraries and how participate
  - [ ] “B” Corp vs Non-profit experiences
  - [ ] Expand on “Event Data Loops” vs Microservices
  - [ ] On Meetups
    - [ ] On Meetups… in 2023 (and post-COVID)
