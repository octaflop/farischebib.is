!(function (e) {
  e.fn.readingTime = function (n) {
    if (!this.length) return this;
    var t = {
        readingTimeTarget: ".eta",
        wordCountTarget: null,
        wordsPerMinute: 270,
        round: !0,
        lang: "en",
        lessThanAMinuteString: "",
        prependTimeString: "",
        prependWordString: "",
        remotePath: null,
        remoteTarget: null,
      },
      i = this,
      r = e(this);
    i.settings = e.extend({}, t, n);
    var s = i.settings.readingTimeTarget,
      a = i.settings.wordCountTarget,
      g = i.settings.wordsPerMinute,
      u = i.settings.round,
      d = i.settings.lang,
      l = i.settings.lessThanAMinuteString,
      o = i.settings.prependTimeString,
      m = i.settings.prependWordString,
      f = i.settings.remotePath,
      h = i.settings.remoteTarget;
    if ("fr" == d)
      var T = l || "Moins d'une minute",
        v = "min";
    else if ("de" == d)
      var T = l || "Weniger als eine Minute",
        v = "min";
    else if ("es" == d)
      var T = l || "Menos de un minuto",
        v = "min";
    else if ("nl" == d)
      var T = l || "Minder dan een minuut",
        v = "min";
    else
      var T = l || "Less than a minute",
        v = "min";
    var M = function (e) {
      var n = e.split(" ").length,
        t = g / 60,
        i = n / t,
        d = Math.round(i / 60),
        l = Math.round(i - 60 * d);
      if (u === !0) r.find(s).text(d > 0 ? o + d + " " + v : o + T);
      else {
        var f = d + ":" + l;
        r.find(s).text(o + f);
      }
      "" !== a && void 0 !== a && r.find(a).text(m + n);
    };
    r.each(function () {
      null != f && null != h
        ? e.get(f, function (n) {
            M(e("<div>").html(n).find(h).text());
          })
        : M(r.text());
    });
  };
})(jQuery);
