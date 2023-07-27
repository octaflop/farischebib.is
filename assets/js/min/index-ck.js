!(function (t) {
  "use strict";
  t(document).ready(function () {
    t(".post-content").fitVids(),
      t(".content").readingTime({
        readingTimeTarget: ".post-reading-time",
        wordCountTarget: ".post-word-count",
      }),
      t(".post-content img").each(function () {
        t(this).attr("alt") &&
          t(this)
            .wrap('<figure class="image"></figure>')
            .after("<figcaption>" + t(this).attr("alt") + "</figcaption>");
      });
  });
})(jQuery);
