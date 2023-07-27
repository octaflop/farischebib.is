!(function (t) {
  var e = function (t) {
    var n = new e.Index();
    return n.pipeline.add(e.stopWordFilter, e.stemmer), t && t.call(n, n), n;
  };
  (e.version = "0.4.3"),
    "undefined" != typeof module && (module.exports = e),
    (e.utils = {}),
    (e.utils.warn = (function (t) {
      return function (e) {
        t.console && console.warn && console.warn(e);
      };
    })(this)),
    (e.utils.zeroFillArray = (function () {
      var t = [0];
      return function (e) {
        for (; e > t.length; ) t = t.concat(t);
        return t.slice(0, e);
      };
    })()),
    (e.EventEmitter = function () {
      this.events = {};
    }),
    (e.EventEmitter.prototype.addListener = function () {
      var t = Array.prototype.slice.call(arguments),
        e = t.pop(),
        n = t;
      if ("function" != typeof e)
        throw new TypeError("last argument must be a function");
      n.forEach(function (t) {
        this.hasHandler(t) || (this.events[t] = []), this.events[t].push(e);
      }, this);
    }),
    (e.EventEmitter.prototype.removeListener = function (t, e) {
      if (this.hasHandler(t)) {
        var n = this.events[t].indexOf(e);
        this.events[t].splice(n, 1),
          this.events[t].length || delete this.events[t];
      }
    }),
    (e.EventEmitter.prototype.emit = function (t) {
      if (this.hasHandler(t)) {
        var e = Array.prototype.slice.call(arguments, 1);
        this.events[t].forEach(function (t) {
          t.apply(void 0, e);
        });
      }
    }),
    (e.EventEmitter.prototype.hasHandler = function (t) {
      return t in this.events;
    }),
    (e.tokenizer = function (t) {
      if (!arguments.length || null == t || void 0 == t) return [];
      if (Array.isArray(t))
        return t.map(function (t) {
          return t.toLowerCase();
        });
      for (var e = ("" + t).replace(/^\s+/, ""), n = e.length - 1; n >= 0; n--)
        if (/\S/.test(e.charAt(n))) {
          e = e.substring(0, n + 1);
          break;
        }
      return e.split(/\s+/).map(function (t) {
        return t.replace(/^\W+/, "").replace(/\W+$/, "").toLowerCase();
      });
    }),
    (e.Pipeline = function () {
      this._stack = [];
    }),
    (e.Pipeline.registeredFunctions = {}),
    (e.Pipeline.registerFunction = function (t, n) {
      n in this.registeredFunctions &&
        e.utils.warn("Overwriting existing registered function: " + n),
        (t.label = n),
        (e.Pipeline.registeredFunctions[t.label] = t);
    }),
    (e.Pipeline.warnIfFunctionNotRegistered = function (t) {
      var n = t.label && t.label in this.registeredFunctions;
      n ||
        e.utils.warn(
          "Function is not registered with pipeline. This may cause problems when serialising the index.\n",
          t,
        );
    }),
    (e.Pipeline.load = function (t) {
      var n = new e.Pipeline();
      return (
        t.forEach(function (t) {
          var i = e.Pipeline.registeredFunctions[t];
          if (!i) throw Error("Cannot load un-registered function: " + t);
          n.add(i);
        }),
        n
      );
    }),
    (e.Pipeline.prototype.add = function () {
      var t = Array.prototype.slice.call(arguments);
      t.forEach(function (t) {
        e.Pipeline.warnIfFunctionNotRegistered(t), this._stack.push(t);
      }, this);
    }),
    (e.Pipeline.prototype.after = function (t, n) {
      e.Pipeline.warnIfFunctionNotRegistered(n);
      var i = this._stack.indexOf(t) + 1;
      this._stack.splice(i, 0, n);
    }),
    (e.Pipeline.prototype.before = function (t, n) {
      e.Pipeline.warnIfFunctionNotRegistered(n);
      var i = this._stack.indexOf(t);
      this._stack.splice(i, 0, n);
    }),
    (e.Pipeline.prototype.remove = function (t) {
      var e = this._stack.indexOf(t);
      this._stack.splice(e, 1);
    }),
    (e.Pipeline.prototype.run = function (t) {
      for (
        var e = [], n = t.length, i = this._stack.length, o = 0;
        n > o;
        o++
      ) {
        for (
          var r = t[o], s = 0;
          i > s && ((r = this._stack[s](r, o, t)), void 0 !== r);
          s++
        );
        void 0 !== r && e.push(r);
      }
      return e;
    }),
    (e.Pipeline.prototype.toJSON = function () {
      return this._stack.map(function (t) {
        return e.Pipeline.warnIfFunctionNotRegistered(t), t.label;
      });
    }),
    (e.Vector = function (t) {
      this.elements = t;
    }),
    (e.Vector.prototype.magnitude = function () {
      if (this._magnitude) return this._magnitude;
      for (var t, e = 0, n = this.elements, i = n.length, o = 0; i > o; o++)
        (t = n[o]), (e += t * t);
      return (this._magnitude = Math.sqrt(e));
    }),
    (e.Vector.prototype.dot = function (t) {
      for (
        var e = this.elements, n = t.elements, i = e.length, o = 0, r = 0;
        i > r;
        r++
      )
        o += e[r] * n[r];
      return o;
    }),
    (e.Vector.prototype.similarity = function (t) {
      return this.dot(t) / (this.magnitude() * t.magnitude());
    }),
    (e.Vector.prototype.toArray = function () {
      return this.elements;
    }),
    (e.SortedSet = function () {
      (this.length = 0), (this.elements = []);
    }),
    (e.SortedSet.load = function (t) {
      var e = new this();
      return (e.elements = t), (e.length = t.length), e;
    }),
    (e.SortedSet.prototype.add = function () {
      Array.prototype.slice.call(arguments).forEach(function (t) {
        ~this.indexOf(t) || this.elements.splice(this.locationFor(t), 0, t);
      }, this),
        (this.length = this.elements.length);
    }),
    (e.SortedSet.prototype.toArray = function () {
      return this.elements.slice();
    }),
    (e.SortedSet.prototype.map = function (t, e) {
      return this.elements.map(t, e);
    }),
    (e.SortedSet.prototype.forEach = function (t, e) {
      return this.elements.forEach(t, e);
    }),
    (e.SortedSet.prototype.indexOf = function (t, e, n) {
      var e = e || 0,
        n = n || this.elements.length,
        i = n - e,
        o = e + Math.floor(i / 2),
        r = this.elements[o];
      return 1 >= i
        ? r === t
          ? o
          : -1
        : t > r
        ? this.indexOf(t, o, n)
        : r > t
        ? this.indexOf(t, e, o)
        : r === t
        ? o
        : void 0;
    }),
    (e.SortedSet.prototype.locationFor = function (t, e, n) {
      var e = e || 0,
        n = n || this.elements.length,
        i = n - e,
        o = e + Math.floor(i / 2),
        r = this.elements[o];
      if (1 >= i) {
        if (r > t) return o;
        if (t > r) return o + 1;
      }
      return t > r
        ? this.locationFor(t, o, n)
        : r > t
        ? this.locationFor(t, e, o)
        : void 0;
    }),
    (e.SortedSet.prototype.intersect = function (t) {
      for (
        var n = new e.SortedSet(),
          i = 0,
          o = 0,
          r = this.length,
          s = t.length,
          a = this.elements,
          l = t.elements;
        !(i > r - 1 || o > s - 1);

      )
        a[i] !== l[o]
          ? a[i] < l[o]
            ? i++
            : a[i] > l[o] && o++
          : (n.add(a[i]), i++, o++);
      return n;
    }),
    (e.SortedSet.prototype.clone = function () {
      var t = new e.SortedSet();
      return (t.elements = this.toArray()), (t.length = t.elements.length), t;
    }),
    (e.SortedSet.prototype.union = function (t) {
      var e, n, i;
      return (
        this.length >= t.length ? ((e = this), (n = t)) : ((e = t), (n = this)),
        (i = e.clone()),
        i.add.apply(i, n.toArray()),
        i
      );
    }),
    (e.SortedSet.prototype.toJSON = function () {
      return this.toArray();
    }),
    (e.Index = function () {
      (this._fields = []),
        (this._ref = "id"),
        (this.pipeline = new e.Pipeline()),
        (this.documentStore = new e.Store()),
        (this.tokenStore = new e.TokenStore()),
        (this.corpusTokens = new e.SortedSet()),
        (this.eventEmitter = new e.EventEmitter()),
        (this._idfCache = {}),
        this.on(
          "add",
          "remove",
          "update",
          function () {
            this._idfCache = {};
          }.bind(this),
        );
    }),
    (e.Index.prototype.on = function () {
      var t = Array.prototype.slice.call(arguments);
      return this.eventEmitter.addListener.apply(this.eventEmitter, t);
    }),
    (e.Index.prototype.off = function (t, e) {
      return this.eventEmitter.removeListener(t, e);
    }),
    (e.Index.load = function (t) {
      t.version !== e.version &&
        e.utils.warn(
          "version mismatch: current " + e.version + " importing " + t.version,
        );
      var n = new this();
      return (
        (n._fields = t.fields),
        (n._ref = t.ref),
        (n.documentStore = e.Store.load(t.documentStore)),
        (n.tokenStore = e.TokenStore.load(t.tokenStore)),
        (n.corpusTokens = e.SortedSet.load(t.corpusTokens)),
        (n.pipeline = e.Pipeline.load(t.pipeline)),
        n
      );
    }),
    (e.Index.prototype.field = function (t, e) {
      var e = e || {},
        n = { name: t, boost: e.boost || 1 };
      return this._fields.push(n), this;
    }),
    (e.Index.prototype.ref = function (t) {
      return (this._ref = t), this;
    }),
    (e.Index.prototype.add = function (t, n) {
      var i = {},
        o = new e.SortedSet(),
        r = t[this._ref],
        n = void 0 === n ? !0 : n;
      this._fields.forEach(function (n) {
        var r = this.pipeline.run(e.tokenizer(t[n.name]));
        (i[n.name] = r), e.SortedSet.prototype.add.apply(o, r);
      }, this),
        this.documentStore.set(r, o),
        e.SortedSet.prototype.add.apply(this.corpusTokens, o.toArray());
      for (var s = 0; o.length > s; s++) {
        var a = o.elements[s],
          l = this._fields.reduce(function (t, e) {
            var n = i[e.name].length;
            if (!n) return t;
            var o = i[e.name].filter(function (t) {
              return t === a;
            }).length;
            return t + (o / n) * e.boost;
          }, 0);
        this.tokenStore.add(a, { ref: r, tf: l });
      }
      n && this.eventEmitter.emit("add", t, this);
    }),
    (e.Index.prototype.remove = function (t, e) {
      var n = t[this._ref],
        e = void 0 === e ? !0 : e;
      if (this.documentStore.has(n)) {
        var i = this.documentStore.get(n);
        this.documentStore.remove(n),
          i.forEach(function (t) {
            this.tokenStore.remove(t, n);
          }, this),
          e && this.eventEmitter.emit("remove", t, this);
      }
    }),
    (e.Index.prototype.update = function (t, e) {
      var e = void 0 === e ? !0 : e;
      this.remove(t, !1),
        this.add(t, !1),
        e && this.eventEmitter.emit("update", t, this);
    }),
    (e.Index.prototype.idf = function (t) {
      if (this._idfCache[t]) return this._idfCache[t];
      var e = this.tokenStore.count(t),
        n = 1;
      return (
        e > 0 && (n = 1 + Math.log(this.tokenStore.length / e)),
        (this._idfCache[t] = n)
      );
    }),
    (e.Index.prototype.search = function (t) {
      var n = this.pipeline.run(e.tokenizer(t)),
        i = e.utils.zeroFillArray(this.corpusTokens.length),
        o = [],
        r = this._fields.reduce(function (t, e) {
          return t + e.boost;
        }, 0),
        s = n.some(function (t) {
          return this.tokenStore.has(t);
        }, this);
      if (!s) return [];
      n.forEach(function (t, n, s) {
        var a = (1 / s.length) * this._fields.length * r,
          l = this,
          h = this.tokenStore.expand(t).reduce(function (n, o) {
            var r = l.corpusTokens.indexOf(o),
              s = l.idf(o),
              h = 1,
              u = new e.SortedSet();
            if (o !== t) {
              var c = Math.max(3, o.length - t.length);
              h = 1 / Math.log(c);
            }
            return (
              r > -1 && (i[r] = a * s * h),
              Object.keys(l.tokenStore.get(o)).forEach(function (t) {
                u.add(t);
              }),
              n.union(u)
            );
          }, new e.SortedSet());
        o.push(h);
      }, this);
      var a = o.reduce(function (t, e) {
          return t.intersect(e);
        }),
        l = new e.Vector(i);
      return a
        .map(function (t) {
          return { ref: t, score: l.similarity(this.documentVector(t)) };
        }, this)
        .sort(function (t, e) {
          return e.score - t.score;
        });
    }),
    (e.Index.prototype.documentVector = function (t) {
      for (
        var n = this.documentStore.get(t),
          i = n.length,
          o = e.utils.zeroFillArray(this.corpusTokens.length),
          r = 0;
        i > r;
        r++
      ) {
        var s = n.elements[r],
          a = this.tokenStore.get(s)[t].tf,
          l = this.idf(s);
        o[this.corpusTokens.indexOf(s)] = a * l;
      }
      return new e.Vector(o);
    }),
    (e.Index.prototype.toJSON = function () {
      return {
        version: e.version,
        fields: this._fields,
        ref: this._ref,
        documentStore: this.documentStore.toJSON(),
        tokenStore: this.tokenStore.toJSON(),
        corpusTokens: this.corpusTokens.toJSON(),
        pipeline: this.pipeline.toJSON(),
      };
    }),
    (e.Store = function () {
      (this.store = {}), (this.length = 0);
    }),
    (e.Store.load = function (t) {
      var n = new this();
      return (
        (n.length = t.length),
        (n.store = Object.keys(t.store).reduce(function (n, i) {
          return (n[i] = e.SortedSet.load(t.store[i])), n;
        }, {})),
        n
      );
    }),
    (e.Store.prototype.set = function (t, e) {
      (this.store[t] = e), (this.length = Object.keys(this.store).length);
    }),
    (e.Store.prototype.get = function (t) {
      return this.store[t];
    }),
    (e.Store.prototype.has = function (t) {
      return t in this.store;
    }),
    (e.Store.prototype.remove = function (t) {
      this.has(t) && (delete this.store[t], this.length--);
    }),
    (e.Store.prototype.toJSON = function () {
      return { store: this.store, length: this.length };
    }),
    (e.stemmer = (function () {
      var t = {
          ational: "ate",
          tional: "tion",
          enci: "ence",
          anci: "ance",
          izer: "ize",
          bli: "ble",
          alli: "al",
          entli: "ent",
          eli: "e",
          ousli: "ous",
          ization: "ize",
          ation: "ate",
          ator: "ate",
          alism: "al",
          iveness: "ive",
          fulness: "ful",
          ousness: "ous",
          aliti: "al",
          iviti: "ive",
          biliti: "ble",
          logi: "log",
        },
        e = {
          icate: "ic",
          ative: "",
          alize: "al",
          iciti: "ic",
          ical: "ic",
          ful: "",
          ness: "",
        },
        n = "[^aeiou]",
        i = "[aeiouy]",
        o = n + "[^aeiouy]*",
        r = i + "[aeiou]*",
        s = "^(" + o + ")?" + r + o,
        a = "^(" + o + ")?" + r + o + "(" + r + ")?$",
        l = "^(" + o + ")?" + r + o + r + o,
        h = "^(" + o + ")?" + i;
      return function (n) {
        var r, u, c, f, p, d, m;
        if (3 > n.length) return n;
        if (
          ((c = n.substr(0, 1)),
          "y" == c && (n = c.toUpperCase() + n.substr(1)),
          (f = /^(.+?)(ss|i)es$/),
          (p = /^(.+?)([^s])s$/),
          f.test(n)
            ? (n = n.replace(f, "$1$2"))
            : p.test(n) && (n = n.replace(p, "$1$2")),
          (f = /^(.+?)eed$/),
          (p = /^(.+?)(ed|ing)$/),
          f.test(n))
        ) {
          var v = f.exec(n);
          (f = RegExp(s)), f.test(v[1]) && ((f = /.$/), (n = n.replace(f, "")));
        } else if (p.test(n)) {
          var v = p.exec(n);
          (r = v[1]),
            (p = RegExp(h)),
            p.test(r) &&
              ((n = r),
              (p = /(at|bl|iz)$/),
              (d = RegExp("([^aeiouylsz])\\1$")),
              (m = RegExp("^" + o + i + "[^aeiouwxy]$")),
              p.test(n)
                ? (n += "e")
                : d.test(n)
                ? ((f = /.$/), (n = n.replace(f, "")))
                : m.test(n) && (n += "e"));
        }
        if (((f = /^(.+?)y$/), f.test(n))) {
          var v = f.exec(n);
          (r = v[1]), (f = RegExp(h)), f.test(r) && (n = r + "i");
        }
        if (
          ((f =
            /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/),
          f.test(n))
        ) {
          var v = f.exec(n);
          (r = v[1]), (u = v[2]), (f = RegExp(s)), f.test(r) && (n = r + t[u]);
        }
        if (
          ((f = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/), f.test(n))
        ) {
          var v = f.exec(n);
          (r = v[1]), (u = v[2]), (f = RegExp(s)), f.test(r) && (n = r + e[u]);
        }
        if (
          ((f =
            /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/),
          (p = /^(.+?)(s|t)(ion)$/),
          f.test(n))
        ) {
          var v = f.exec(n);
          (r = v[1]), (f = RegExp(l)), f.test(r) && (n = r);
        } else if (p.test(n)) {
          var v = p.exec(n);
          (r = v[1] + v[2]), (p = RegExp(l)), p.test(r) && (n = r);
        }
        if (((f = /^(.+?)e$/), f.test(n))) {
          var v = f.exec(n);
          (r = v[1]),
            (f = RegExp(l)),
            (p = RegExp(a)),
            (d = RegExp("^" + o + i + "[^aeiouwxy]$")),
            (f.test(r) || (p.test(r) && !d.test(r))) && (n = r);
        }
        return (
          (f = /ll$/),
          (p = RegExp(l)),
          f.test(n) && p.test(n) && ((f = /.$/), (n = n.replace(f, ""))),
          "y" == c && (n = c.toLowerCase() + n.substr(1)),
          n
        );
      };
    })()),
    e.Pipeline.registerFunction(e.stemmer, "stemmer"),
    (e.stopWordFilter = function (t) {
      return -1 === e.stopWordFilter.stopWords.indexOf(t) ? t : void 0;
    }),
    (e.stopWordFilter.stopWords = new e.SortedSet()),
    (e.stopWordFilter.stopWords.length = 119),
    (e.stopWordFilter.stopWords.elements = [
      "",
      "a",
      "able",
      "about",
      "across",
      "after",
      "all",
      "almost",
      "also",
      "am",
      "among",
      "an",
      "and",
      "any",
      "are",
      "as",
      "at",
      "be",
      "because",
      "been",
      "but",
      "by",
      "can",
      "cannot",
      "could",
      "dear",
      "did",
      "do",
      "does",
      "either",
      "else",
      "ever",
      "every",
      "for",
      "from",
      "get",
      "got",
      "had",
      "has",
      "have",
      "he",
      "her",
      "hers",
      "him",
      "his",
      "how",
      "however",
      "i",
      "if",
      "in",
      "into",
      "is",
      "it",
      "its",
      "just",
      "least",
      "let",
      "like",
      "likely",
      "may",
      "me",
      "might",
      "most",
      "must",
      "my",
      "neither",
      "no",
      "nor",
      "not",
      "of",
      "off",
      "often",
      "on",
      "only",
      "or",
      "other",
      "our",
      "own",
      "rather",
      "said",
      "say",
      "says",
      "she",
      "should",
      "since",
      "so",
      "some",
      "than",
      "that",
      "the",
      "their",
      "them",
      "then",
      "there",
      "these",
      "they",
      "this",
      "tis",
      "to",
      "too",
      "twas",
      "us",
      "wants",
      "was",
      "we",
      "were",
      "what",
      "when",
      "where",
      "which",
      "while",
      "who",
      "whom",
      "why",
      "will",
      "with",
      "would",
      "yet",
      "you",
      "your",
    ]),
    e.Pipeline.registerFunction(e.stopWordFilter, "stopWordFilter"),
    (e.TokenStore = function () {
      (this.root = { docs: {} }), (this.length = 0);
    }),
    (e.TokenStore.load = function (t) {
      var e = new this();
      return (e.root = t.root), (e.length = t.length), e;
    }),
    (e.TokenStore.prototype.add = function (t, e, n) {
      var n = n || this.root,
        i = t[0],
        o = t.slice(1);
      return (
        i in n || (n[i] = { docs: {} }),
        0 === o.length
          ? ((n[i].docs[e.ref] = e), void (this.length += 1))
          : this.add(o, e, n[i])
      );
    }),
    (e.TokenStore.prototype.has = function (t) {
      if (!t) return !1;
      for (var e = this.root, n = 0; t.length > n; n++) {
        if (!e[t[n]]) return !1;
        e = e[t[n]];
      }
      return !0;
    }),
    (e.TokenStore.prototype.getNode = function (t) {
      if (!t) return {};
      for (var e = this.root, n = 0; t.length > n; n++) {
        if (!e[t[n]]) return {};
        e = e[t[n]];
      }
      return e;
    }),
    (e.TokenStore.prototype.get = function (t, e) {
      return this.getNode(t, e).docs || {};
    }),
    (e.TokenStore.prototype.count = function (t, e) {
      return Object.keys(this.get(t, e)).length;
    }),
    (e.TokenStore.prototype.remove = function (t, e) {
      if (t) {
        for (var n = this.root, i = 0; t.length > i; i++) {
          if (!(t[i] in n)) return;
          n = n[t[i]];
        }
        delete n.docs[e];
      }
    }),
    (e.TokenStore.prototype.expand = function (t, e) {
      var n = this.getNode(t),
        i = n.docs || {},
        e = e || [];
      return (
        Object.keys(i).length && e.push(t),
        Object.keys(n).forEach(function (n) {
          "docs" !== n && e.concat(this.expand(t + n, e));
        }, this),
        e
      );
    }),
    (e.TokenStore.prototype.toJSON = function () {
      return { root: this.root, length: this.length };
    }),
    (t.fn.ghostHunter = function (e) {
      var i = t.extend({}, t.fn.ghostHunter.defaults, e);
      return i.results ? (n.init(this, i), n) : void 0;
    }),
    (t.fn.ghostHunter.defaults = {
      results: !1,
      rss: "/rss",
      onKeyUp: !1,
      result_template:
        "<a href='{{link}}'><p><h2>{{title}}</h2><h4>{{pubDate}}</h4></p></a>",
      info_template: "<p>Number of posts found: {{amount}}</p>",
      displaySearchInfo: !0,
      zeroResultsInfo: !0,
    });
  var n = {
    isInit: !1,
    init: function (t, n) {
      var i = this;
      (this.target = t),
        (this.rss = n.rss),
        (this.results = n.results),
        (this.blogData = []),
        (this.result_template = n.result_template),
        (this.info_template = n.info_template),
        (this.zeroResultsInfo = n.zeroResultsInfo),
        (this.displaySearchInfo = n.displaySearchInfo),
        (this.index = e(function () {
          this.field("title", { boost: 10 }),
            this.field("description"),
            this.field("link"),
            this.field("pubDate"),
            this.ref("id");
        })),
        t.focus(function () {
          i.loadRSS();
        }),
        t.closest("form").submit(function (e) {
          e.preventDefault(), i.find(t.val());
        }),
        n.onKeyUp &&
          (i.loadRSS(),
          t.keyup(function () {
            i.find(t.val());
          }));
    },
    loadRSS: function () {
      if (this.isInit) return !1;
      var e = this.index,
        n = this.rss,
        i = this.blogData;
      t.get(n, function (n) {
        for (var o = t(n).find("item"), r = 0; o && r < o.length; r++) {
          var s = o.eq(r),
            a = {
              id: r + 1,
              title: s.find("title").text(),
              description: s.find("description").text(),
              pubDate: s.find("pubDate").text(),
              link: s.find("link").text(),
            };
          e.add(a), i.push(a);
        }
      }),
        (this.isInit = !0);
    },
    find: function (e) {
      var n = this.index.search(e),
        i = t(this.results);
      i.empty(),
        (this.zeroResultsInfo || n.length > 0) &&
          this.displaySearchInfo &&
          i.append(this.format(this.info_template, { amount: n.length }));
      for (var o = 0; o < n.length; o++) {
        var r = this.blogData[n[o].ref - 1];
        i.append(this.format(this.result_template, r));
      }
    },
    clear: function () {
      t(this.results).empty(), this.target.val("");
    },
    format: function (t, e) {
      return t.replace(/{{([^{}]*)}}/g, function (t, n) {
        var i = e[n];
        return "string" == typeof i || "number" == typeof i ? i : t;
      });
    },
  };
})(jQuery);
