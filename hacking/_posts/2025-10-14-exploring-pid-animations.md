---
layout: post
title: exploring pid with animations
category: hacking
category_image: "/imgs/category/hacking.jpg"

image: "/imgs/posts/pid.png"
image2: "/imgs/posts/pid_car.png"
---

In my journey to branch out from web development, I've been exploring both game design, animation, and CNC programming.
Naturally, I've stumbled upon the concept of
a [PID Controller](https://en.wikipedia.org/wiki/Proportional%E2%80%93integral%E2%80%93derivative_controller) as I was
trying to understand how to implement a "natural" look of feedback in an animated vehicle.

For this demo, I've constructed a basic webgl space with a "train" (or car, if my models load correctly...) that
attempts to reach a spot on the track. During the loop, you can click on other parts of the track and change the PID
parameters to get a sense of how those inputs impact the feedback loop.

You can check out the demo at [pid.brain.run](https://pid.brain.run/)

