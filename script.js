
var jsfilepath = $("script[data-wsjs]")[0] ? $("script[data-wsjs]").first().attr("src").replace(/[^\/]+\.js/, "") : ""
  , cssfilepath = $("link[data-wscss]")[0] ? $("link[data-wscss]").first().attr("href").replace(/[^\/]+\.css/, "") : "";

!function() {
    "use strict";
    function t(o) {
        if (!o)
            throw new Error("No options passed to Waypoint constructor");
        if (!o.element)
            throw new Error("No element option passed to Waypoint constructor");
        if (!o.handler)
            throw new Error("No handler option passed to Waypoint constructor");
        this.key = "waypoint-" + e,
        this.options = t.Adapter.extend({}, t.defaults, o),
        this.element = this.options.element,
        this.adapter = new t.Adapter(this.element),
        this.callback = o.handler,
        this.axis = this.options.horizontal ? "horizontal" : "vertical",
        this.enabled = this.options.enabled,
        this.triggerPoint = null,
        this.group = t.Group.findOrCreate({
            name: this.options.group,
            axis: this.axis
        }),
        this.context = t.Context.findOrCreateByElement(this.options.context),
        t.offsetAliases[this.options.offset] && (this.options.offset = t.offsetAliases[this.options.offset]),
        this.group.add(this),
        this.context.add(this),
        i[this.key] = this,
        e += 1
    }
    var e = 0
      , i = {};
    t.prototype.queueTrigger = function(t) {
        this.group.queueTrigger(this, t)
    }
    ,
    t.prototype.trigger = function(t) {
        this.enabled && this.callback && this.callback.apply(this, t)
    }
    ,
    t.prototype.destroy = function() {
        this.context.remove(this),
        this.group.remove(this),
        delete i[this.key]
    }
    ,
    t.prototype.disable = function() {
        return this.enabled = !1,
        this
    }
    ,
    t.prototype.enable = function() {
        return this.context.refresh(),
        this.enabled = !0,
        this
    }
    ,
    t.prototype.next = function() {
        return this.group.next(this)
    }
    ,
    t.prototype.previous = function() {
        return this.group.previous(this)
    }
    ,
    t.invokeAll = function(t) {
        var e = [];
        for (var o in i)
            e.push(i[o]);
        for (var n = 0, r = e.length; r > n; n++)
            e[n][t]()
    }
    ,
    t.destroyAll = function() {
        t.invokeAll("destroy")
    }
    ,
    t.disableAll = function() {
        t.invokeAll("disable")
    }
    ,
    t.enableAll = function() {
        t.Context.refreshAll();
        for (var e in i)
            i[e].enabled = !0;
        return this
    }
    ,
    t.refreshAll = function() {
        t.Context.refreshAll()
    }
    ,
    t.viewportHeight = function() {
        return window.innerHeight || document.documentElement.clientHeight
    }
    ,
    t.viewportWidth = function() {
        return document.documentElement.clientWidth
    }
    ,
    t.adapters = [],
    t.defaults = {
        context: window,
        continuous: !0,
        enabled: !0,
        group: "default",
        horizontal: !1,
        offset: 0
    },
    t.offsetAliases = {
        "bottom-in-view": function() {
            return this.context.innerHeight() - this.adapter.outerHeight()
        },
        "right-in-view": function() {
            return this.context.innerWidth() - this.adapter.outerWidth()
        }
    },
    window.Waypoint = t
}(),
function() {
    "use strict";
    function t(t) {
        window.setTimeout(t, 1e3 / 60)
    }
    function e(t) {
        this.element = t,
        this.Adapter = n.Adapter,
        this.adapter = new this.Adapter(t),
        this.key = "waypoint-context-" + i,
        this.didScroll = !1,
        this.didResize = !1,
        this.oldScroll = {
            x: this.adapter.scrollLeft(),
            y: this.adapter.scrollTop()
        },
        this.waypoints = {
            vertical: {},
            horizontal: {}
        },
        t.waypointContextKey = this.key,
        o[t.waypointContextKey] = this,
        i += 1,
        n.windowContext || (n.windowContext = !0,
        n.windowContext = new e(window)),
        this.createThrottledScrollHandler(),
        this.createThrottledResizeHandler()
    }
    var i = 0
      , o = {}
      , n = window.Waypoint
      , r = window.onload;
    e.prototype.add = function(t) {
        var e = t.options.horizontal ? "horizontal" : "vertical";
        this.waypoints[e][t.key] = t,
        this.refresh()
    }
    ,
    e.prototype.checkEmpty = function() {
        var t = this.Adapter.isEmptyObject(this.waypoints.horizontal)
          , e = this.Adapter.isEmptyObject(this.waypoints.vertical)
          , i = this.element == this.element.window;
        t && e && !i && (this.adapter.off(".waypoints"),
        delete o[this.key])
    }
    ,
    e.prototype.createThrottledResizeHandler = function() {
        function t() {
            e.handleResize(),
            e.didResize = !1
        }
        var e = this;
        this.adapter.on("resize.waypoints", function() {
            e.didResize || (e.didResize = !0,
            n.requestAnimationFrame(t))
        })
    }
    ,
    e.prototype.createThrottledScrollHandler = function() {
        function t() {
            e.handleScroll(),
            e.didScroll = !1
        }
        var e = this;
        this.adapter.on("scroll.waypoints", function() {
            (!e.didScroll || n.isTouch) && (e.didScroll = !0,
            n.requestAnimationFrame(t))
        })
    }
    ,
    e.prototype.handleResize = function() {
        n.Context.refreshAll()
    }
    ,
    e.prototype.handleScroll = function() {
        var t = {}
          , e = {
            horizontal: {
                newScroll: this.adapter.scrollLeft(),
                oldScroll: this.oldScroll.x,
                forward: "right",
                backward: "left"
            },
            vertical: {
                newScroll: this.adapter.scrollTop(),
                oldScroll: this.oldScroll.y,
                forward: "down",
                backward: "up"
            }
        };
        for (var i in e) {
            var o = e[i]
              , n = o.newScroll > o.oldScroll
              , r = n ? o.forward : o.backward;
            for (var s in this.waypoints[i]) {
                var a = this.waypoints[i][s];
                if (null !== a.triggerPoint) {
                    var l = o.oldScroll < a.triggerPoint
                      , h = o.newScroll >= a.triggerPoint
                      , p = l && h
                      , u = !l && !h;
                    (p || u) && (a.queueTrigger(r),
                    t[a.group.id] = a.group)
                }
            }
        }
        for (var c in t)
            t[c].flushTriggers();
        this.oldScroll = {
            x: e.horizontal.newScroll,
            y: e.vertical.newScroll
        }
    }
    ,
    e.prototype.innerHeight = function() {
        return this.element == this.element.window ? n.viewportHeight() : this.adapter.innerHeight()
    }
    ,
    e.prototype.remove = function(t) {
        delete this.waypoints[t.axis][t.key],
        this.checkEmpty()
    }
    ,
    e.prototype.innerWidth = function() {
        return this.element == this.element.window ? n.viewportWidth() : this.adapter.innerWidth()
    }
    ,
    e.prototype.destroy = function() {
        var t = [];
        for (var e in this.waypoints)
            for (var i in this.waypoints[e])
                t.push(this.waypoints[e][i]);
        for (var o = 0, n = t.length; n > o; o++)
            t[o].destroy()
    }
    ,
    e.prototype.refresh = function() {
        var t, e = this.element == this.element.window, i = e ? void 0 : this.adapter.offset(), o = {};
        this.handleScroll(),
        t = {
            horizontal: {
                contextOffset: e ? 0 : i.left,
                contextScroll: e ? 0 : this.oldScroll.x,
                contextDimension: this.innerWidth(),
                oldScroll: this.oldScroll.x,
                forward: "right",
                backward: "left",
                offsetProp: "left"
            },
            vertical: {
                contextOffset: e ? 0 : i.top,
                contextScroll: e ? 0 : this.oldScroll.y,
                contextDimension: this.innerHeight(),
                oldScroll: this.oldScroll.y,
                forward: "down",
                backward: "up",
                offsetProp: "top"
            }
        };
        for (var r in t) {
            var s = t[r];
            for (var a in this.waypoints[r]) {
                var l, h, p, u, c, d = this.waypoints[r][a], f = d.options.offset, w = d.triggerPoint, y = 0, g = null == w;
                d.element !== d.element.window && (y = d.adapter.offset()[s.offsetProp]),
                "function" == typeof f ? f = f.apply(d) : "string" == typeof f && (f = parseFloat(f),
                d.options.offset.indexOf("%") > -1 && (f = Math.ceil(s.contextDimension * f / 100))),
                l = s.contextScroll - s.contextOffset,
                d.triggerPoint = Math.floor(y + l - f),
                h = w < s.oldScroll,
                p = d.triggerPoint >= s.oldScroll,
                u = h && p,
                c = !h && !p,
                !g && u ? (d.queueTrigger(s.backward),
                o[d.group.id] = d.group) : !g && c ? (d.queueTrigger(s.forward),
                o[d.group.id] = d.group) : g && s.oldScroll >= d.triggerPoint && (d.queueTrigger(s.forward),
                o[d.group.id] = d.group)
            }
        }
        return n.requestAnimationFrame(function() {
            for (var t in o)
                o[t].flushTriggers()
        }),
        this
    }
    ,
    e.findOrCreateByElement = function(t) {
        return e.findByElement(t) || new e(t)
    }
    ,
    e.refreshAll = function() {
        for (var t in o)
            o[t].refresh()
    }
    ,
    e.findByElement = function(t) {
        return o[t.waypointContextKey]
    }
    ,
    window.onload = function() {
        r && r(),
        e.refreshAll()
    }
    ,
    n.requestAnimationFrame = function(e) {
        var i = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || t;
        i.call(window, e)
    }
    ,
    n.Context = e
}(),
function() {
    "use strict";
    function t(t, e) {
        return t.triggerPoint - e.triggerPoint
    }
    function e(t, e) {
        return e.triggerPoint - t.triggerPoint
    }
    function i(t) {
        this.name = t.name,
        this.axis = t.axis,
        this.id = this.name + "-" + this.axis,
        this.waypoints = [],
        this.clearTriggerQueues(),
        o[this.axis][this.name] = this
    }
    var o = {
        vertical: {},
        horizontal: {}
    }
      , n = window.Waypoint;
    i.prototype.add = function(t) {
        this.waypoints.push(t)
    }
    ,
    i.prototype.clearTriggerQueues = function() {
        this.triggerQueues = {
            up: [],
            down: [],
            left: [],
            right: []
        }
    }
    ,
    i.prototype.flushTriggers = function() {
        for (var i in this.triggerQueues) {
            var o = this.triggerQueues[i]
              , n = "up" === i || "left" === i;
            o.sort(n ? e : t);
            for (var r = 0, s = o.length; s > r; r += 1) {
                var a = o[r];
                (a.options.continuous || r === o.length - 1) && a.trigger([i])
            }
        }
        this.clearTriggerQueues()
    }
    ,
    i.prototype.next = function(e) {
        this.waypoints.sort(t);
        var i = n.Adapter.inArray(e, this.waypoints)
          , o = i === this.waypoints.length - 1;
        return o ? null : this.waypoints[i + 1]
    }
    ,
    i.prototype.previous = function(e) {
        this.waypoints.sort(t);
        var i = n.Adapter.inArray(e, this.waypoints);
        return i ? this.waypoints[i - 1] : null
    }
    ,
    i.prototype.queueTrigger = function(t, e) {
        this.triggerQueues[e].push(t)
    }
    ,
    i.prototype.remove = function(t) {
        var e = n.Adapter.inArray(t, this.waypoints);
        e > -1 && this.waypoints.splice(e, 1)
    }
    ,
    i.prototype.first = function() {
        return this.waypoints[0]
    }
    ,
    i.prototype.last = function() {
        return this.waypoints[this.waypoints.length - 1]
    }
    ,
    i.findOrCreate = function(t) {
        return o[t.axis][t.name] || new i(t)
    }
    ,
    n.Group = i
}(),
function() {
    "use strict";
    function t(t) {
        this.$element = e(t)
    }
    var e = window.jQuery
      , i = window.Waypoint;
    e.each(["innerHeight", "innerWidth", "off", "offset", "on", "outerHeight", "outerWidth", "scrollLeft", "scrollTop"], function(e, i) {
        t.prototype[i] = function() {
            var t = Array.prototype.slice.call(arguments);
            return this.$element[i].apply(this.$element, t)
        }
    }),
    e.each(["extend", "inArray", "isEmptyObject"], function(i, o) {
        t[o] = e[o]
    }),
    i.adapters.push({
        name: "jquery",
        Adapter: t
    }),
    i.Adapter = t
}(),
function() {
    "use strict";
    function t(t) {
        return function() {
            var i = []
              , o = arguments[0];
            return t.isFunction(arguments[0]) && (o = t.extend({}, arguments[1]),
            o.handler = arguments[0]),
            this.each(function() {
                var n = t.extend({}, o, {
                    element: this
                });
                "string" == typeof n.context && (n.context = t(this).closest(n.context)[0]),
                i.push(new e(n))
            }),
            i
        }
    }
    var e = window.Waypoint;
    window.jQuery && (window.jQuery.fn.waypoint = t(window.jQuery)),
    window.Zepto && (window.Zepto.fn.waypoint = t(window.Zepto))
}();

/*! GENERIC - OBGIMG */
!function($) {
    "use strict";
    $.fn.bgimg = function() {
        var a = $(this), b = "", c = "", d = "", e = "", f, g;
        if (a.is("[data-bgimg]")) {
            f = a.is("[data-bgimg2x]") && $("html").hasClass("retina") && $(window).width() > 740 ? a.attr("data-bgimg2x") : a.attr("data-bgimg");
            f = encodeURI(f);
            f = f.replace(/[{(}]/g, "%28");
            f = f.replace(/[{)}]/g, "%29");
            b = "url(" + f + ")";
            if (f.match(/bg[nwesrpt]+-/g)) {
                c = function(a) {
                    return /bgnw-/.test(a) && "0 0" || /bgne-/.test(a) && "100% 0" || /bgsw-/.test(a) && "0 100%" || /bgse-/.test(a) && "100% 100%" || /bgn-/.test(a) && "50% 0" || /bgs-/.test(a) && "50% 100%" || /bge-/.test(a) && "100% 50%" || /bgw-/.test(a) && "0 50%" || /bgrpt-/.test(a) && "0 0" || ""
                }
                ;
                d = function(a) {
                    return /bgrpt-/.test(a) && "auto " || "cover"
                }
                ;
                e = function(a) {
                    return /bgrpt-/.test(a) && "repeat" || "no-repeat"
                }
                ;
                a.css({
                    backgroundImage: b,
                    backgroundPosition: c,
                    backgroundSize: d,
                    backgroundRepeat: e
                })
            } else
                a.css({
                    backgroundImage: b
                })
        }
        a.removeAttr("data-bgimg2x").removeAttr("data-bgimg")
    }
}(jQuery);

/*! GENERIC - ESCKEY */
jQuery.event.special.esckeydown = {
    delegateType: "keydown",
    bindType: "keydown",
    handle: function(a) {
        var b = a.handleObj
          , c = a.keyCode
          , d = null;
        if (27 === c) {
            a.type = b.origType;
            d = b.handler.apply(this, arguments);
            a.type = b.type
        }
        return d
    }
};

/*! ORACLE - PERFORMANCE */
var OraclePerformance = function(a) {
    "use strict";
    var b = {}
      , c = "performance"in a && "timing"in a.performance
      , d = "performance"in a && "mark"in a.performance && "measure"in a.performance
      , e = !1
      , f = function(a) {
        return +(Math.round(a / 1e3 + "e+2") + "e-2")
    }
      , g = function(b, c) {
        return !(!Array.isArray(b) || !b.length) && b.reduce(function(b, d) {
            var e = /https?:\/\//.test(d.name)
              , f = e ? /https?:\/\/(.*?)\//.exec(d.name)[1] : null
              , g = e ? d.name.slice(d.name.lastIndexOf("/") + 1).split("?")[0] : d.name;
            if (e) {
                b[f] = b[f] || {};
                b[f][g] = c ? c(d) : d.startTime;
                if (f === a.location.host) {
                    b.WS = b.WS || {};
                    b.WS = h(b.WS, g, c(d))
                }
            } else
                b[g] = c ? c(d) : d.startTime;
            return b
        }, {})
    }
      , h = function(b, c, d) {
        var e;
        /\.css$/.test(c) && (/-base(-styles)?\.css$/.test(c) ? b["base-css"] = d.duration : b["lib-css"] = d.duration);
        if (/\.js$/.test(c))
            if (/jquery/.test(c))
                b.jquery = d.duration;
            else if (/(-handlebars|-chat)\.js$/.test(c))
                ;
            else if (/-base\.js$/.test(c))
                b["base-js"] = d.duration;
            else {
                b["lib-js"] = d.duration;
                b.codebase = "OCOM"in a && OCOM.codebase.length && OCOM.codebase || (e = /(.*?(-lib)?)\.js$/.exec(c.slice(c.lastIndexOf("/") + 1))) && e[1]
            }
        return b
    }
      , i = function(a) {
        var b = "-"
          , c = "_"
          , d = "~"
          , g = "na"
          , h = [{
            name: "na",
            range: [Number.NEGATIVE_INFINITY, -.01]
        }, {
            name: "t0",
            range: [0, .49]
        }, {
            name: "t1",
            range: [.5, .99]
        }, {
            name: "t2",
            range: [1, 1.99]
        }, {
            name: "t3",
            range: [2, 4.99]
        }, {
            name: "t4",
            range: [5, 9.99]
        }, {
            name: "t5",
            range: [10, Number.POSITIVE_INFINITY]
        }]
          , i = function(a) {
            return h.filter(function(b) {
                return a >= b.range[0] && a <= b.range[1]
            }).shift().name
        }
          , j = function(a) {
            return function(b) {
                var c = new RegExp("-","g");
                return "codebase" === b ? a[b] && a[b].replace(c, "_") : a[b] ? i(f(a[b])) : "na"
            }
        }
          , k = function(a) {
            return a.map(function(a) {
                return "na"
            }).join("~")
        }
          , l = {
            page: function(a) {
                var b = ["domInteractive", "domContentLoaded", "domComplete"];
                return a ? b.map(j(a)).join("~") : k(b)
            },
            paint: function(a) {
                var b = ["first-paint", "first-contentful-paint", "first-styled-body-paint", "first-hero-image-paint"];
                return a ? b.map(j(a)).join("~") : k(b)
            },
            resource: function(a) {
                var b = ["codebase", "base-css", "lib-css", "jquery", "base-js", "lib-js"];
                return a ? b.map(j(a)).join("~") : k(b)
            },
            component: ""
        };
        a = "function" == typeof a ? a() : a;
        return !e && (e = !0) && {
            prop44: [l.page(a.page), l.paint(a.paint)].join("~"),
            prop46: l.resource(a.resource.WS)
        }
    }
      , j = function(b) {
        return d && a.performance.mark(b)
    }
      , k = function(e) {
        switch (e) {
        case "page":
            return {
                page: b.page || c && l()
            };
        case "resource":
            return {
                resource: b.resource || a.performance && m()
            };
        case "paint":
            return {
                paint: b.paint || a.performance && n()
            };
        case "component":
            return {
                component: b.component || d && q()
            };
        default:
            return Object.keys(b).length && b || (b = {
                page: c ? l() : null,
                resource: a.performance ? m() : null,
                paint: a.performance ? n() : null,
                component: d ? q() : null
            })
        }
    }
      , l = function() {
        var b = a.performance.timing;
        return {
            domInteractive: b.domInteractive - b.domLoading,
            domContentLoaded: b.domContentLoadedEventStart - b.domLoading,
            domComplete: b.domComplete - b.domLoading
        }
    }
      , m = function() {
        return g(a.performance.getEntriesByType("resource"), function(a) {
            return {
                startTime: a.startTime,
                size: a.decodedBodySize,
                totalSize: a.transferSize,
                duration: a.duration
            }
        })
    }
      , n = function() {
        var b = a.performance.getEntriesByType("paint")
          , c = o()
          , d = p();
        c && b.push(c);
        d && b.push(d);
        return g(b)
    }
      , o = function() {
        var b = document.querySelector('head link[href$="-base.css"]')
          , c = a.performance.getEntriesByType("resource").filter(function(a) {
            return b && a.name === b.href
        });
        return b && c.length && {
            name: "first-styled-body-paint",
            startTime: c[0].startTime + c[0].duration
        }
    }
      , p = function() {
        var b = document.querySelector('[class^="ch"], [class^="hp"]')
          , c = b && b.querySelector("img")
          , d = b && b.querySelector('[style*="background-image"]') || b && b.style.backgroundImage.length && b
          , e = d && /url\("?(.*?)"?\)/.exec(a.getComputedStyle(d, null).backgroundImage)
          , f = e && e[1]
          , g = a.performance.getEntriesByType("resource").filter(function(a) {
            var b = c ? c.src : f;
            return a.name === b
        });
        return (c || f) && g.length && {
            name: "first-hero-image-paint",
            startTime: g[0].startTime + g[0].duration
        }
    }
      , q = function() {
        var b = a.performance.getEntriesByType("mark")
          , c = {};
        b.filter(function(a) {
            return /\Start$/.test(a.name)
        }).map(function(c) {
            var d = /([\w-]+)(?:Start|End)/.exec(c.name)[1]
              , e = b.filter(function(a) {
                return new RegExp(d + "End$").test(a.name)
            })[0];
            void 0 !== e && void 0 !== e.name && a.performance.measure(d, c.name, e.name)
        });
        a.performance.getEntriesByType("measure").map(function(a) {
            var b = a.name.split("-");
            c[b[0]] = c[b[0]] || {};
            c[b[0]][b[1]] = {
                startTime: a.startTime,
                duration: a.duration
            }
        });
        return c
    };
    return {
        mark: j,
        measure: k,
        setAnalytics: i.bind(null, k)
    }
}(window)
  , oracleDataMenu = oracleDataMenu || {
    contentCache: []
};
oracleDataMenu.fetchMenuContent = function(a) {
    return a.length ? a instanceof jQuery && $.Deferred().resolve(a[0].outerHTML) || oracleDataMenu.contentCache[a.split("#")[0]] || (oracleDataMenu.contentCache[a.split("#")[0]] = jQuery.ajax({
        url: a,
        type: "GET",
        contentType: "text/plain; charset=UTF-8",
        crossDomain: !0,
        beforeSend: "undefined" != typeof beforeMenuContentFetch && beforeMenuContentFetch
    })) : $.Deferred().reject()
}
;

/*! SHARED UTILITY FUNCTIONS */
oracleDataMenu.classSelector = function(a, b) {
    return Array.isArray(a) && a.map(function(a) {
        return Array.isArray(b) && b.map(function(b) {
            return Array.isArray(a) && "." + a.join(b + " .") + b || "." + a + b
        }).join() || Array.isArray(a) && "." + a.join(" .") + (b || "") || "." + a + (b || "")
    }).join() || Array.isArray(b) && b.map(function(b) {
        return "." + a + b
    }).join() || "." + a + (b || "")
}
;
oracleDataMenu.classList = function(a) {
    return Array.isArray(a) && a.filter(function(a) {
        return !!a
    }).join(" ") || a
}
;
oracleDataMenu.createElement = function(a, b, c) {
    var d = document.createElement(a);
    b = b || [];
    b = Array.isArray(b) ? b : [b];
    c = c || {};
    Object.keys(c).map(function(a) {
        d[a] = c[a]
    });
    return $(d).addClass(oracleDataMenu.classList(b))
}
;
oracleDataMenu.addAriaAttributes = function(a) {
    return a && this.each(function() {
        $(this).find("a").get().forEach(function(a) {
            var b = a;
            window.requestAnimationFrame(function() {
                if ("visible" === window.getComputedStyle(b, null).visibility) {
                    b.removeAttribute("aria-hidden");
                    b.setAttribute("tabindex", 0)
                }
            })
        })
    }) || this
}
;

/*! GENERIC - EQUALHEIGHT */
!function($) {
    "use strict";
    jQuery.fn.equalHeight = function(a) {
        var b = 0, c = -1, d = [], e = 0, f = this.length, g, h, i, j;
        a = a || !1;
        return f <= 1 ? this : this.each(function() {
            i = $(this)[0];
            i.style.height = "auto";
            j = i.offsetHeight;
            0 !== e && a || (g = parseInt($(i).offset().top / 10, 10));
            if (g !== h) {
                c++;
                d[c] = {
                    collection: []
                };
                h = g;
                b = j
            } else
                b = j > b ? j : b;
            d[c].collection.push(i);
            d[c].heightMatch = b;
            e++;
            e === f && d.forEach(function(a) {
                if (a.collection.length < 2)
                    return !1;
                a.collection.forEach(function(b) {
                    b.style.height = a.heightMatch + "px"
                })
            })
        })
    }
}(jQuery);

/*! GENERIC - GETURLVARS */
function getUrlVars() {
    var a = [], b, c = window.location.href;
    -1 != c.indexOf("#") && (c = c.split("#")[0]);
    for (var d = c.slice(window.location.href.indexOf("?") + 1).split("&"), e = 0; e < d.length; e++) {
        b = d[e].split("=");
        a.push(b[0]);
        a[b[0]] = b[1]
    }
    return a
}

/*! GENERIC - PDITLOCALEMAP */
var PDITLocaleMap = function($, a) {
    "use strict";
    var b = document.location.href
      , c = "";
    b.indexOf("/www-sites-stage") > -1 || b.indexOf("/www-stage") > -1 ? c = "" : (b.indexOf("localhost") > -1 || b.indexOf("/webstandards") > -1) && (c = "/pdit-locale-map.json");
    var d = +new Date(+new Date + 12096e5)
      , e = $.Deferred()
      , f = !1
      , g = "pditlocalemap"
      , h = getLocalStorage(g);
    function fetchLocaleMapJSON() {
        if (f)
            return e;
        e = $.getJSON(c).then(function(a) {
            return setLocalStorage(g, a)
        }).fail(function(a) {
            switch (a.status) {
            case 200:
                console.warn("PDITLocaleMap file " + c + " found, but with JSON errors");
                break;
            default:
                console.warn("PDITLocaleMap file " + c + " error: " + a.statusText)
            }
        });
        f = !0;
        return e
    }
    function generateLookup(a) {
        h = h || {};
        a.forEach(function(a) {
            h[a.siteid] = a
        });
        return h
    }
    function getLocalStorage(a) {
        var b = JSON.parse(localStorage.getItem(a));
        return !!(b && !!b.expires && b.expires > +new Date) && b
    }
    function setLocalStorage(a, b) {
        h = generateLookup(b);
        h.expires = d;
        localStorage.setItem(a, JSON.stringify(h));
        return h
    }
    function removeLocalStorage(a) {
        h = null;
        localStorage.setItem(a, !1)
    }
    function findEntryByKey(a) {
        a = a || {};
        return !h && [] || Object.keys(h).filter(function(b) {
            var c = !0;
            Object.keys(a).forEach(function(d) {
                h[b][d] !== a[d] && (c = !1)
            });
            return "expires" !== b && c
        }).map(function(a) {
            return h[a]
        })
    }
    function groupByKey(a) {
        return !h && {} || Object.keys(h).reduce(function(b, c) {
            if ("expires" !== c) {
                b[h[c][a]] = b[h[c][a]] || [];
                b[h[c][a]].push(h[c])
            }
            return b
            
        }, {})
    }
    return {
        init: function() {
            return h && $.Deferred().resolve(h) || fetchLocaleMapJSON()
        },
        find: findEntryByKey,
        group: groupByKey
    }
}(jQuery, window);

/*! GENERIC - XTRA HTML CLASSES */
"https:" == location.protocol ? document.getElementsByTagName("html")[0].classList.add("ishttps") : document.getElementsByTagName("html")[0].classList.add("ishttp");
location.href.indexOf("www-sites.oracle") > -1 && document.getElementsByTagName("html")[0].classList.add("iswsites");
function isStageSite() {
    "use strict";
    return document.documentElement.classList.contains("iswsites") || /localhost/.test(window.location.host)
}
jQuery(document).ready(function($) {
    var a = $(".f20")[0] ? 300 : 1200;
    setTimeout(function() {
        $("body").addClass("ready")
    }, a)
});

/*! GENERIC - MULI LINE CHARACTER CLAMPING */
!function($) {
    "use strict";
    $.fn.charClamp = function(a) {
        var b = $.extend({
            size: 75,
            omission: "...",
            ignore: !0
        }, a);
        return this.each(function() {
            var a, c, d = $(this), e = /[!-\/:-@\[-`{-~]$/;
            !function() {
                d.each(function() {
                    a = $(this).html();
                    if (a.length > b.size) {
                        c = $.trim(a).substring(0, b.size).split(" ").slice(0, -1).join(" ");
                        b.ignore && (c = c.replace(e, ""));
                        $(this).html(c + b.omission)
                    }
                })
            }()
        })
    }
}(jQuery);

/*! GENERIC - HORIZONTAL SCROLL */
!function($) {
    "use strict";
    $.fn.hScroll = function(a) {
        a = a || 60;
        $(this).bind("DOMMouseScroll mousewheel", function(b) {
            var c = b.originalEvent
              , d = c.detail ? c.detail * -a : c.wheelDelta
              , e = $(this).scrollLeft();
            if (Math.abs(d) > a / 2) {
                e += d > 0 ? -a : a;
                $(this).scrollLeft(e)
            }
            b.preventDefault()
        })
    }
}(jQuery);

/*!
	JAVASCRIPT/CSS/LESS FILES $IMPORT UTILITY
	https://github.com/w3core/import.js/
	@version 1.0.0
	@license BSD License
	@author Max Chuhryaev
*/
!new function(e, n) {
    function t(e, n, t, r) {
        if (n.addEventListener) {
            n.addEventListener(e, t, r)
        } else if (n.attachEvent) {
            n.attachEvent(e, t, r);
        }
    }
    function r(e, n, t, r) {
        if (n.removeEventListener) {
            n.removeEventListener(e, t, r)
        } else if (el.removeEvent) {
            el.removeEvent(e, t, r);
        }
    }
    function a(n) {
        return n && "object" == typeof n && "number" == typeof n.length && !n.nodeName && n != e
    }
    function u(e, t) {
        var r = n.createEvent("HTMLEvents")
        return r.data = t,
        r.initEvent(e, !0, !0),
        !n.dispatchEvent(r)
    }
    function o(e) {
        var n = /^(\s*\[\s*(\!?)\s*([a-zA-Z0-9\.\-_]*)\s*\:?\s*([a-zA-Z]*)\s*\])?\s*([^\s]+)\s*$/g.exec(e)
          , t = /^[^#?]+\.([a-zA-Z0-9]+)([?#].*)?$/g.exec(e)
        return n ? {
            reload: !!n[2],
            name: n[3] ? [n[3]] : [],
            type: n[4] || t ? (n[4] || t[1]).toLowerCase() : null,
            url: n[5]
        } : null
    }
    function l(e, n) {
        var n = "string" == typeof n ? o(n) : n
        if (n) {
            for (var t, r = 0; r < e.length; r++)
                if (e[r].url == n.url) {
                    if (n.reload && (e[r].reload = !0),
                    n.type && !e[r].type && (e[r].type = n.type),
                    n.name.length)
                        for (var a = 0; a < n.name.length; a++)
                            e[r].name.indexOf(n.name[a]) < 0 && e[r].name.push(n.name[a])
                    t = !0
                    break
                }
            t || e.push(n)
        }
    }
    function f(e) {
        var n, t = [], r = []
        if ("function" == typeof e)
            t.push(e)
        else if ("string" == typeof e) {
            n = e.split(",")
            for (var u = 0; u < n.length; u++)
                l(r, n[u])
        } else if (e && "object" == typeof e) {
            var o = a(e)
            for (var u in e) {
                n = f(e[u])
                for (var i = 0; i < n.src.length; i++)
                    o || n.src[i].name.push(u),
                    l(r, n.src[i])
                for (var s = 0; s < n.callback.length; s++)
                    t.push(n.callback[s])
            }
        }
        return {
            src: r,
            callback: t
        }
    }
    function i(e) {
        return !e || "js" == e
    }
    function s(e) {
        return i(e) ? "script" : "link"
    }
    function c(e) {
        return i(e) ? "src" : "href"
    }
    function p(e, u) {
        var o = n.createElement("img")
          , l = "load"
          , f = "error"
          , p = i(e.type)
          , h = n.createElement(s(e.type))
        h.queue = [u],
        h[c(e.type)] = e.url,
        h[p ? "type" : "rel"] = p ? "text/javascript" : "less" == e.type ? "stylesheet/less" : "stylesheet"
        var v = function(n) {
            if (r(l, h, v),
            r(f, h, v),
            a(h.queue) && h.queue.length)
                for (; h.queue.length > 0; ) {
                    var t = h.queue.shift()
                    "function" == typeof t && t(h, e, n)
                }
        }
        return t(l, p ? h : o, v),
        t(f, p ? h : o, v),
        m.push(h),
        y.appendChild(h),
        p || (o.src = e.url),
        h
    }
    function h(e, t) {
        for (var r = c(e), a = n.getElementsByTagName(s(e)), u = 0; u < a.length; u++)
            if (a[u][r] == t)
                return a[u]
    }
    function v(e, n) {
        var t = h(e, n)
        if (t)
            return a(t.queue) || (t.queue = [],
            m.push(t)),
            t
        for (var r = c(e), u = 0; u < m.length; u++)
            if (m[u][r] == n)
                return m[u]
    }
    function g(e, n) {
        var t = f([].slice.call(arguments))
          , e = t.src
          , n = t.callback
          , r = 0
          , a = function(e) {
            return e.parentNode || y.appendChild(e),
            e
        }
          , o = function() {
            for (var t = 0; t < n.length; t++)
                n[t](e)
            for (var t = 0; t < e.length; t++) {
                u("@import", e[t])
                for (var r = 0; r < e[t].name.length; r++)
                    u("@import:" + e[t].name[r], e[t])
            }
        }
        if (!e.length)
            return o()
        for (var l = function() {
            r++,
            r == e.length && o()
        }, i = 0; i < e.length; i++) {
            var s = e[i].type
              , c = e[i].url
              , h = v(s, c)
            h ? (e[i].node = a(h),
            h.queue.length ? h.queue.push(l) : l()) : e[i].node = p(e[i], l)
        }
    }
    var m = []
      , y = n.getElementsByTagName("head")[0]
    e.$import = g
}
(window,document);

/*! CORE VIDEO */
var vod_playerid = "VkKNQZg6x"
  , live_playerid = "B1nEzzGqe"
  , mini_playerid = "9jYHuR8jl"
  , vloco = document.location.href
  , vod_pkey = "BCpkADawqM1pW2-ioZdHgeOcY68cw0JSS05kIrwkV2y41a0Far9G-VzxhorxiMYmQNJqbjdZTfJNO8DfjreigQD2g0ikp_jGrofJCVAUNFU1xgsl6dBYsY6L_yI"
  , betavideo = !1
  , videoinfo = !1
  , pglang = jQuery('meta[name="Language"]').attr("content") ? jQuery('meta[name="Language"]').attr("content") : "en";
vloco.indexOf("videoinfo=true") > -1 && (videoinfo = []);
if (vloco.indexOf("betavideo=") > -1) {
    var bvid = vloco.split("betavideo=")[1].split("&")[0];
    vod_playerid = "true" == bvid ? "Bk2kPOcu" : bvid;
    betavideo = "BC VIDEO: loading single/playlist beta player -> " + vod_playerid
}
if (vloco.indexOf("betavideolive=") > -1) {
    var bvid = vloco.split("betavideolive=")[1].split("&")[0];
    live_playerid = "true" != bvid ? bvid : live_playerid;
    var pkmsg = "BC VIDEO: loading live beta player -> " + live_playerid;
    betavideo = betavideo ? betavideo + "\n" + pkmsg : pkmsg
}
if (vloco.indexOf("betavideopkey=") > -1) {
    vod_pkey = vloco.split("betavideopkey=")[1].split("&")[0];
    var pkmsg = "BC VIDEO: loading beta policy key ->" + vod_pkey;
    betavideo = betavideo ? betavideo + "\n" + pkmsg : pkmsg
}
var bc_errors = {
    1: {
        headline: {
            en: "The video download was cancelled."
        },
        description: {
            en: "You aborted the media playback"
        }
    },
    2: {
        headline: {
            en: "The video connection was lost, please confirm you're connected to the internet"
        },
        description: {
            en: "A network error caused the media download to fail part-way."
        }
    },
    3: {
        headline: {
            en: "The video is bad or in a format that can't be played on your browser"
        },
        description: {
            en: "The media playback was aborted due to a corruption problem or because the media used features your browser did not support."
        }
    },
    4: {
        headline: {
            en: "This video is either unavailable or not supported in this browser"
        },
        description: {
            en: "The media could not be loaded, either because the server or network failed or because the format is not supported."
        }
    },
    5: {
        headline: {
            en: "The video you're trying to watch is encrypted and we don't know how to decrypt it"
        },
        description: {
            en: "The media is encrypted and we do not have the keys to decrypt it."
        }
    },
    unknown: {
        headline: {
            en: "There was an error"
        },
        description: {
            en: "An unanticipated problem was encountered. Check back soon and try again."
        }
    },
    VIDEO_CLOUD_ERR_NOT_PLAYABLE: {
        headline: {
            en: "There was an error"
        },
        description: {
            en: "The video is not available."
        }
    }
}
  , bc_config = {
    account: "1460825906",
    pk: vod_pkey,
    bckey: "AQ~~,AAAAAFcSbzI~,OkyYKKfkn3wagZQIWBO967-6Frb9WeJM",
    playlist: {
        playerid: vod_playerid,
        bcidtype: "data-playlist-id",
        video: '<video data-embed="default" class="video-js" controls playsinline></video>',
        appendHTML: '<div class="playlist-wrapper"><ol class="vjs-playlist vjs-csspointerevents vjs-mouse"></ol></div>'
    },
    single: {
        playerid: vod_playerid,
        bcidtype: "data-video-id",
        video: '<video data-embed="default" class="video-js" controls playsinline></video>'
    },
    background: {
        playerid: "B13U1lbKg",
        bcidtype: "data-video-id",
        video: '<video data-embed="default" class="video-js" playsinline></video>'
    },
    live: {
        playerid: live_playerid,
        bcidtype: "data-video-id",
        video: '<video data-embed="default" class="video-js" controls playsinline></video>'
    },
    mini: {
        playerid: mini_playerid,
        bcidtype: "data-video-id",
        video: '<video data-embed="default" class="video-js" controls playsinline></video>'
    }
};
function embedBrightcove(a, b, c, d, e, f) {
    b = b ? "data-autoplay=true" : "";
    f = f ? "data-share=" + f : "";
    c = c.indexOf("live-") > -1 ? "live" : "single";
    document.write('<div class="bcembed bcvideo" data-bcid="' + d + '" data-type="' + c + '" ' + b + " " + f + "></div>")
}
jQuery(document).ready(function() {
    bc_embedsetup(jQuery(document));
    jQuery("body").append('<div class="bcvideo vidcsstest" style="width:0 !important"></div>');
    "rgba(0, 0, 0, 0)" != jQuery("div.bcvideo.vidcsstest").css("background-color") && "transparent" != jQuery("div.bcvideo.vidcsstest").css("background-color") || void 0 === cssfilepath || $import(cssfilepath + "oracle-video.css");
    jQuery("div.bcvideo.vidcsstest").remove()
});
function bc_embedsetup(a) {
    a.find(".responsiveVid").removeClass("responsiveVid");
    a.find('a[rel^="brightcoveLightBox"],a[rel^="vbox"]').each(function() {
        var a = jQuery(this);
        a.attr("rel", "vbox");
        a.attr("href", a.attr("href").replace(/.*videoplayer-ocom.html/g, "").replace(/bctid/g, "bcid").replace(/ /g, ""));
        !a.is("[data-lbl]") && a.is("[title]") ? a.attr("data-lbl", "lighbox-open-" + a.attr("title").toLowerCase().replace(/ /g, "-")) : !a.is("[data-lbl]") && a.text() ? a.attr("data-lbl", "lighbox-open-" + a.text().toLowerCase().replace(/ /g, "-")) : a.is("[data-lbl]") ? a.attr("data-lbl", a.attr("data-lbl")) : a.attr("data-lbl", "lighbox-open");
        a.is("[data-trackas]") || a.attr("data-trackas", "lightbox")
    });
    a.find("div[data-embedbc]").each(function() {
        var a = jQuery(this).attr("data-embedbc").split(",")[3].replace(/['" ]*/g, "");
        jQuery(this).after('<div class="bcembed bcvideo" data-bcid="' + a + '" data-type="single"></div>');
        jQuery(this).remove()
    });
    a.find(".bcembed.bcload").each(function() {
        bc_loadplayer(jQuery(this))
    });
    a.find("div.bcembed").each(function() {
        jQuery(this).waypoint(function() {
            bc_loadplayer(jQuery(this.element));
            this.destroy()
        }, {
            offset: "105%"
        })
    })
}
function bc_loadplayer(a) {
    var b = "";
    betavideo && console.log(betavideo);
    void 0 !== a.attr("data-bcid") && a.attr("data-bcid", a.attr("data-bcid").replace(/ /g, ""));
    a.removeClass("bcembed");
    a.ptype = a.is("div[data-type]") ? a.attr("data-type") : "single";
    var c = !("background" != a.ptype || !a.closest(".cw55")[0])
      , d = !!a.hasClass("bcthumbnail")
      , e = !!a.hasClass("bcgallery")
      , f = void 0 !== a.attr("data-playlistid")
      , g = "true" == a.attr("data-videotimes")
      , h = a.ptype.indexOf("playlist") > -1
      , i = void 0 === a.attr("data-options") ? "" : a.attr("data-options");
    if ("live-iframe" == a.ptype || c || d || e || f)
        if (c) {
            a.vid = "bcvid-" + a.attr("data-bcid").replace(/,/g, "-") + "-" + Math.floor(999999 * Math.random() + 2);
            a.attr("class", "bcvideo bcvideo-noflash showembed");
            a.html('<div class="video-js"><video preload="auto" class="vjs-tech" id="' + a.vid + '"></video></div>');
            document.all && !window.atob ? a.addClass("bgloaderror") : jQuery.ajax({
                headers: {
                    Accept: "application/json;pk=" + bc_config.pk
                },
                beforeSend: function(a) {
                    a.setRequestHeader("Accept", "application/json;pk=" + bc_config.pk)
                },
                url: "" + bc_config.account + "/videos/" + a.attr("data-bcid"),
                method: "GET",
                dataType: "json",
                crossDomain: !0,
                success: function(b) {
                    for (var c = 0; b.sources[c]; ) {
                        if (b.sources[c].container = "MP4") {
                            var d = jQuery("#" + a.vid);
                            d[0].poster = b.poster;
                            var e = new XMLHttpRequest;
                            e.open("GET", b.sources[c].src, !0);
                            e.responseType = "blob";
                            e.onload = function() {
                                if (200 === this.status) {
                                    var a = this.response;
                                    try {
                                        var b = URL.createObjectURL(a);
                                        d[0].src = b;
                                        d.closest(".bcvideo").addClass("bgloaded")
                                    } catch (a) {
                                        d.closest(".bcvideo").addClass("bgloaderror")
                                    }
                                }
                            }
                            ;
                            e.onerror = function() {
                                d.closest(".bcvideo").addClass("bgloaderror")
                            }
                            ;
                            e.send();
                            c = 100
                        }
                        c++
                    }
                },
                error: function() {
                    a.addClass("bgloaderror")
                }
            })
        } else if (f) {
            var j = a, k = j.attr("data-playlistid"), l = !1, m = {
                framework: '<div class="col-framework col-gutters col4 col-multi cwidth"><div class="col-w1"></div></div>'
            }, n = window.location.href, o;
            o = n.indexOf("oracle.com") > -1 && n.indexOf("webstandards") < 0 ? "//edge.api.brightcove.com/playback/v1/accounts/" + bc_config.account + "/playlists/" + k : "/ws-lib/helper-scripts/bc-midman.php?account=" + bc_config.account + "&playlist=" + k;
            jQuery.when(vd01loadplayslist(j, o)).done(function(b) {
                var c, d, e, f, g, h, k, l, n, o, p, q = vd01GetBreakpoint(), r = j.attr("data-viewmore"), s = j.attr("data-viewless"), t = 4, u = void 0 !== j.attr("data-pagesize") && +j.attr("data-pagesize") > 0 ? +j.attr("data-pagesize") : 12, v;
                j.append($(m.framework));
                if (i.indexOf("bccol3") >= 0) {
                    j.find(".col4").removeClass("col4").addClass("col3");
                    t = 3
                }
                v = vd01itemsPer(u, t);
                videoList = b.videos;
                j.find(".col-framework").inView();
                for (var w = 0; w < videoList.length; w++) {
                    d = videoList[w];
                    p = w >= v && r && s ? " bchidden" : "";
                    e = d.hasOwnProperty("custom_fields") && d.custom_fields && d.custom_fields.editorialtitledescription ? d.custom_fields.editorialtitledescription : d.name;
                    e = d.hasOwnProperty("custom_fields") && d.custom_fields && d.custom_fields.secondary_rel_url ? "Highlight: " + e : e;
                    n = d.hasOwnProperty("description") ? '<div class="bcdesc">' + d.description + "</div>" : "";
                    if ("duration"in d) {
                        f = 0;
                        g = Math.floor(d.duration / 6e4);
                        h = Math.floor(d.duration / 1e3 % 60);
                        h < 10 && (h = "0" + h.toString());
                        if (g > 59) {
                            f = Math.floor(g / 60);
                            g %= 60
                        }
                        g < 10 && (g = "0" + g.toString());
                        e += f ? " (" + f + ":" + g.toString() + ":" + h.toString() + ")" : " (" + +g + ":" + h.toString() + ")"
                    }
                    c = j.attr("data-shareonly") ? "&shareonly=" + a.attr("data-shareonly") : "",
                    playlistElWidth = j.outerWidth();
                    k = d.thumbnail && playlistElWidth < 300 ? d.thumbnail : d.poster;
                    l = '<div class="col-item' + p + '"><div class="col-item-w1"><a href="?bcid=' + d.id + c + '" class="bclink" title="' + e.replace(/\d?\d-\d?\d-\d\d\d\d/g, "").replace(/--/g, "&ndash;") + '"><button class="vjs-big-play-button"></button></a><img class="bcimg" src="' + k + '" /></div><div class="col-item-w2"><div class="bcfgallery-title"><h3>' + e.replace(/\d?\d-\d?\d-\d\d\d\d/g, "").replace(/--/g, "&ndash;") + "</h3>";
                    i.indexOf("bcdesc") >= 0 && (l += n);
                    i.indexOf("bcspkr") >= 0 && (l += vd01appendSpeakers(d));
                    l += vd01appendFulllengthKeynote(d, j) + "</div></div></div>";
                    j.find(".col-w1").append(l)
                }
                vd01speakerVis(j);
                if (r && s) {
                    vd01injectBtn(j, r);
                    vd01viewMore(j, u, r, s)
                }
                j.find("div.bcfgallery-speakers").each(function(a) {
                    $(this).hide();
                    o = $(this).attr("data-lsstxt");
                    $(this).after('<div class="bcfgallery-showless"><a class="bcfgallery-showless icn-img icn-min-cs" href="#hide" title="Show less">' + o + "</a></div>");
                    j.find("div.bcfgallery-showless").hide()
                })
            }).fail(function(a) {
                console.log("Error.")
            })
        } else if (d) {
            var p = a.attr("data-bcid")
              , q = a.attr("data-shareonly") ? "&shareonly=" + a.attr("data-shareonly") : ""
              , r = a.outerWidth()
              , s = a.closest(".clickvideo-overlay")[0] ? "&w10overlay=true" : "";
            jQuery.ajax({
                headers: {
                    Accept: "application/json;pk=" + bc_config.pk
                },
                beforeSend: function(a) {
                    a.setRequestHeader("Accept", "application/json;pk=" + bc_config.pk)
                },
                url: "" + bc_config.account + "/videos/" + a.attr("data-bcid"),
                method: "GET",
                dataType: "json",
                crossDomain: !0,
                success: function(b) {
                    var c = b.thumbnail & r < 300 ? b.thumbnail : b.poster;
                    a.append('<a href="?bcid=' + p + q + s + '" class="bclink" title="' + b.name + '"><button class="vjs-big-play-button"></button></a>');
                    "" == s && a.append('<img class="bcimg" src="' + c + '" />')
                }
            });
            b = a.html();
            a.html(b.replace(/&nbsp;/g, ""))
        } else if (e)
            a.html('<div data-experience="' + a.attr("data-bcid") + '"></div><script src="' + bc_config.account + "/experience_" + a.attr("data-bcid") + '/live.js"><\/script>');
        else {
            a.attr("class", "");
            a.html('<iframe class="bciframe" id="bcIframe" src="' + bc_config.bckey + "&bctid=" + a.attr("data-bcid") + '&width=100%25&height=100%25&includeAPI=true&templateLoadHandler=onTemplateLoaded&templateReadyHandler=onTemplateReady&secureConnections=true&secureHTMLConnections=true&wmode=transparent"></iframe>')
        }
    else {
        a.jspath = "//players.brightcove.net/" + bc_config.account + "/" + bc_config[a.ptype].playerid + "_default/index.min.js?s";
        a.vid = "bcvid-" + a.attr("data-bcid").replace(/,/g, "-") + "-" + Math.floor(999999 * Math.random() + 2);
        a.attr("data-bcobjid", a.vid);
        var t = jQuery(bc_config[a.ptype].video).attr("data-player", bc_config[a.ptype].playerid).attr("data-account", bc_config.account).attr("id", a.vid);
        a.attr("data-bcid").indexOf(",") < 0 && t.attr(bc_config[a.ptype].bcidtype, a.attr("data-bcid"));
        h && jQuery("ol.vjs-playlist").addClass("vjs-playlist-tmp").removeClass("vjs-playlist");
        a.append(t);
        bc_config[a.ptype].prependHTML && a.append(bc_config[a.ptype].prependHTML);
        bc_config[a.ptype].appendHTML && a.append(bc_config[a.ptype].appendHTML);
        $import(a.jspath, function() {
            a.addClass("showembed");
            var b = videojs(a.vid);
            b.preload(!0);
            if ("background" == a.ptype) {
                b.volume(0);
                a.find("video").prop("muted", !0)
            }
            videoinfo && videoinfo.push(b);
            if (h) {
                jQuery("ol.vjs-playlist-tmp").addClass("vjs-playlist").removeClass("vjs-playlist-tmp");
                $("ol.vjs-playlist").each(function(a, b) {
                    var c = [];
                    g && (c[a] = window.setInterval(function() {
                        if ($(b).find(".vjs-selected cite")[0]) {
                            g && $(b).find(".vjs-playlist-item time").wrap('<div class="bctimew1"></div>');
                            clearInterval(c[a])
                        }
                    }, 50))
                })
            }
            a.is('[data-autoplay="true"]') && b.autoplay(!0);
            a.is('[data-loopvideo="true"]') && b.loop(!0);
            a.is('[data-share="none"]') && a.addClass("bcnosocial");
            if (a.is("[data-autocaption]")) {
                var c = a.attr("data-autocaption")
                  , d = b.textTracks();
                b.on("play", function(a) {
                    for (var b = 0; b < d.length; b++) {
                        var e = d[b];
                        "captions" === e.kind && e.language === c && (e.mode = "showing")
                    }
                })
            }
            if ("function" == typeof b.social && !a.is('[data-share="none"]')) {
                var e = document.location.href.replace(/[\?\&]bcid=[\d]+/gi, "").replace(/[\?\&]playerType=[^\&\#]+/gi, "").replace(/\#.*/gi, "").replace(/[\?\&]shareURL=[^\&\#]+/gi, "").replace(/\#.*/gi, "");
                if (a.is("[data-share]") && "none" != a.data("share") && a.data("share").indexOf("playvid") < 0)
                    e = a.attr("data-share");
                else if (!h) {
                    e = e.indexOf("?") > -1 ? e + "&bcid=" + a.attr("data-bcid") : e + "?bcid=" + a.attr("data-bcid");
                    e = "single" != a.ptype ? e + "&playerType=" + a.ptype : e
                }
                var f = {
                    url: e
                };
                a.is('[data-autoshare="true"]') && !h && (f.displayAfterVideo = !0);
                b.social(f)
            }
            b.ready(function() {
                var a, c, d = document.createElement("div");
                d.className = "vjs-error-w1";
                d.innerHTML = '<div class="vjs-error-w2"><h1></h1><p></p></div><div class="vjs-error-logo"></div>';
                var e = {};
                e.content = d;
                var f = videojs.getComponent("ModalDialog")
                  , g = new f(b,e);
                b.addChild(g);
                var h = g.descEl_.id;
                b.on("error", function(a) {
                    var d = b.error().code
                      , e = b.duration()
                      , f = b.errors.getAll()
                      , i = ""
                      , j = "";
                    if (isNaN(e)) {
                        b.errorDisplay.hide();
                        $("#" + h).siblings("button.vjs-close-button").hide();
                        c = bc_errors[d] ? bc_errors[d].headline[pglang] : bc_errors.unknown.headline[pglang];
                        if (b.error().message)
                            j = b.error().message;
                        else if (d)
                            if ("VIDEO_CLOUD_ERR_NOT_PLAYABLE" == d)
                                j = bc_errors[d].description[pglang];
                            else {
                                for (var k in f)
                                    if (d == f[k].type) {
                                        j = f[k].headline;
                                        break
                                    }
                                j || (j = bc_errors.unknown.description[pglang])
                            }
                        else
                            j = bc_errors.unknown.description[pglang];
                        g.open();
                        $("#" + h).siblings(".vjs-modal-dialog-content").find(".vjs-error-w2 h1").text(c);
                        $("#" + h).siblings(".vjs-modal-dialog-content").find(".vjs-error-w2 p").text(j)
                    }
                })
            });
            if (h && a.attr("data-bcid").indexOf(",") > -1) {
                var i = a.attr("data-bcid").split(",")
                  , j = videojs(a.find("video")[0].id);
                bc_getdata(j, i, function(a) {
                    j.playlist(a)
                })
            }
        })
    }
    a.on("focus", ".vjs-play-control", function(b) {
        if ("webkit-tablet" == vd01GetBreakpoint(!0)) {
            $(b.currentTarget).blur();
            a.off("focus", ".vjs-play-control")
        }
    })
}
jQuery(document).keydown(function(a) {
    27 == a.which && (jQuery(".w10.w10yt")[0] ? yt_closelightbox() : jQuery("#w10")[0] && bc_closelightbox())
});
function bc_loadlightbox(a, b, c, d, e, f, g, h) {
    bc_pauseAll();
    if (b) {
        c = b.split("bcid=")[1].split("&")[0];
        d = b.indexOf("playerType=") > -1 ? b.split("playerType=")[1].split("&")[0] : "single";
        e = b.indexOf("shareURL=") > -1 && b.split("shareURL=")[1].split("&")[0];
        aCapt = b.indexOf("autoCaption=") > -1 && b.split("autoCaption=")[1].split("&")[0];
        h = "object" == typeof a && $(a.currentTarget).closest(".clickvideo-overlay")[0] ? " w10overlay" : "";
        f = f || b.indexOf("bigscreen=true") > -1 ? " w10big" : "";
        g = b.indexOf("shareonly=") > -1 ? "data-shareonly=" + b.split("shareonly=")[1].split("&")[0] : ""
    }
    d = d.indexOf("live-") > -1 ? "live" : d;
    d = bc_config[d] ? d : "single";
    e = e ? "data-share=" + e : "";
    aCapt = aCapt ? "data-autocaption=" + aCapt : "";
    injectionContent = '<div class="w10 w10fadein' + f + h + '" id="w10"><div class="w10w1"><div class="w10w2"><a id="w10close" href="#close" data-trackas="lightbox" data-lbl="lightbox-close"><em>Close</em></a><div class="bcembed bcvideo bc' + d + '" data-bcid="' + c + '" data-type="' + d + '" ' + e + " " + aCapt + ' data-autoplay="true" ' + g + '></div></div><div class="w10w3"></div></div></div>';
    h ? jQuery($(a.currentTarget).closest(".clickvideo-overlay")).append(injectionContent) : jQuery("body").append(injectionContent);
    jQuery("#w10").addClass("w10" + d);
    setTimeout(function() {
        jQuery("#w10").removeClass("w10fadein");
        jQuery("#w10close").removeClass("hidden");
        h || jQuery("body").addClass("lightbox-noscroll")
    }, 10);
    bc_loadplayer(jQuery("#w10").find("div.bcembed"))
}
function yt_loadlightbox(a, b, c, d, e, f, g, h, i, j, k, l) {
    var m, n, o;
    if (a) {
        n = {
            bigs: c || a.indexOf("bigscreen=true") > -1 ? " w10big" : "",
            end: a.indexOf("end=") > -1 ? a.split("end=")[1].split("&")[0] : "",
            feature: a.indexOf("feature=") > -1 ? a.split("feature=")[1].split("&")[0] : "",
            loop: a.indexOf("loop=") > -1 ? a.split("loop=")[1].split("&")[0] : 0,
            modestbranding: a.indexOf("modestbranding=") > -1 ? a.split("modestbranding=")[1].split("&")[0] : 1,
            playlist: a.indexOf("playlist=") > -1 ? a.split("playlist=")[1].split("&")[0] : "",
            rel: a.indexOf("rel=") > -1 ? a.split("rel=")[1].split("&")[0] : 0,
            showinfo: a.indexOf("showinfo=") > -1 ? a.split("showinfo=")[1].split("&")[0] : "",
            start: a.indexOf("start=") > -1 ? a.split("start=")[1].split("&")[0] : "",
            ytid: a.split("ytid=")[1].split("&")[0]
        };
        for (var p in n)
            if ("" != n[p]) {
                if ("bigs" == p)
                    continue;
                o += " data-" + p + '="' + n[p] + '"'
            }
    }
    jQuery("body").append('<div class="w10 w10fadein w10yt' + n.bigs + '" id="w10"><div class="w10w1"><div class="w10w2"><a id="w10close" href="#close" data-trackas="lightbox" data-lbl="lightbox-close"><em>Close</em></a><div class="ytembed ytvideo" data-autoplay="true"' + o + '></div></div><div class="w10w3"></div></div></div>');
    setTimeout(function() {
        jQuery("#w10").removeClass("w10fadein");
        jQuery("#w10close").removeClass("hidden");
        jQuery("body").addClass("lightbox-noscroll")
    }, 10);
    window.VD03.execute(jQuery("#w10").find("div.ytembed"))
}
function bc_closelightbox() {
    jQuery("#w10").addClass("w10fadeout");
    var a = jQuery("#w10").find("[data-bcobjid]");
    if ("undefined" == typeof videojs) {
        jQuery("#w10").remove();
        jQuery("body").removeClass("lightbox-noscroll");
        return !1
    }
    var b = videojs(a.attr("data-bcobjid"));
    function bc_fadevolume() {
        try {
            var a = b.volume() - .08;
            if (a > 0) {
                b.volume(a);
                setTimeout(bc_fadevolume, 50)
            } else
                b.volume(0)
        } catch (a) {}
    }
    bc_fadevolume(b.volume());
    setTimeout(function() {
        try {
            b.stop();
            b.dispose();
            jQuery("#w10").remove();
            jQuery("body").removeClass("lightbox-noscroll")
        } catch (a) {
            jQuery("#w10").remove();
            jQuery("body").removeClass("lightbox-noscroll")
        }
    }, 1300)
}
function yt_closelightbox() {
    jQuery("#w10").addClass("w10fadeout");
    setTimeout(function() {
        jQuery("#w10").remove();
        jQuery("body").removeClass("lightbox-noscroll")
    }, 500)
}
jQuery(document).on("click", '.bclink[href*="bcid="]', function(a) {
    a.preventDefault();
    a.stopPropagation();
    bc_pauseAll();
    var b = jQuery(this).attr("href");
    slipwrap = jQuery(this).parent();
    b && (bcid = b.split("bcid=")[1].split("&")[0]);
    var c = '<div class="bcembed bcvideo bcslipload" data-bcid="' + bcid + '" data-autoplay="true"></div>'
      , d = jQuery(this)
      , e = d.closest(".col-item-w1")[0] && d.closest("div.bcgallery[data-playlistid]")[0] ? d.closest(".col-item-w1") : jQuery(this).parent("[data-bcid='" + bcid + "']")
      , f = jQuery(window).width() > 1600 ? 1600 : jQuery(window).width();
    if (!(d.outerWidth() >= 600 || d.outerWidth() > .7 * f) || jQuery(this).closest(".lightboxonly")[0] || jQuery(this).closest(".clickvideo")[0])
        bc_loadlightbox(a, this.href);
    else if (!e.hasClass("sliploaded")) {
        e.addClass("sliploaded");
        e.append(c);
        bc_loadplayer(e.find("div.bcembed"))
    }
});
jQuery(document).on("click", 'a[rel^="vbox"][href*="bcid="]', function(a) {
    bc_loadlightbox(a, this.href);
    a.preventDefault()
});
jQuery(document).on("click", 'a[rel^="vbox"][href*="ytid="]', function(a) {
    yt_loadlightbox(this.href);
    a.preventDefault()
});
jQuery(document).on("click", "#w10close, .w10w3", function(a) {
    jQuery(a.currentTarget).closest(".w10").find(".ytshowembed")[0] ? yt_closelightbox() : bc_closelightbox();
    a.preventDefault()
});
jQuery(document).on("click", ".vjs-close-button", function(a) {
    jQuery("#w10close").removeClass("hidden")
});
jQuery(document).on("touchstart", ".vjs-close-button", function(a) {
    jQuery("#w10close").removeClass("hidden")
});
jQuery(document).on("click", "button.vjs-share-control", function(a) {
    $("#w10close").addClass("hidden")
});
jQuery(document).on("touchstart", "button.vjs-share-control", function(a) {
    $("#w10close").addClass("hidden")
});
jQuery(document).on("click", ".clickvideo", function(a) {
    $(a.currentTarget).hasClass("clickvideo-overlay") || jQuery(this).find("div.ytthumbnail,a.bclink").click()
});
function bc_pauseAll(a, b) {
    b || (b = jQuery(document));
    "function" == typeof videojs && b.find("div.vjs-playing").each(function() {
        if (!jQuery(this).closest('[data-loopvideo="true"]')[0]) {
            var b = jQuery(this).attr("id")
              , c = videojs(b);
            if (a && a != b || !a)
                try {
                    c.pause()
                } catch (a) {}
        }
    })
}
function bc_getdata(a, b, c) {
    var d = 0
      , e = b.length
      , f = [];
    getVideo(a);
    function getVideo(a) {
        d < e ? a.catalog.getVideo(b[d], pushData) : c(f)
    }
    function pushData(b, c) {
        f.push(c);
        d++;
        getVideo(a)
    }
}
jQuery(document).ready(function() {
    var a = document.location.href;
    (a.indexOf("bcid=") > -1 || a.indexOf("playvid=") > -1) && bc_loadlightbox(!1, a.replace(/['"<>]/gi, "").replace(/playvid/gi, "bcid"))
});
jQuery(document).on("click", ".vjs-playlist-item", function(a) {
    if (jQuery(this).closest(".bcplaylist").find("div.vjs-social-overlay")[0] && !jQuery(this).closest(".bcplaylist").find("div.vjs-social-overlay").hasClass("vjs-hidden")) {
        jQuery(this).closest(".bcplaylist").find("div.vjs-social-overlay").addClass("vjs-hidden");
        jQuery(this).closest(".bcplaylist").find("div.vjs-dock-text,div.vjs-dock-shelf").removeClass("vjs-hidden");
        jQuery(this).closest(".bcplaylist").find("div.vjs-controls-disabled").removeClass("vjs-controls-disabled").addClass("vjs-controls-enabled")
    }
    if (jQuery(this).closest("[data-bcobjid]")[0] && !jQuery(this).closest("[data-autoplay]")[0]) {
        var b = jQuery(this).closest("[data-bcobjid]");
        b.attr("data-autoplay", "true");
        videojs(b.attr("data-bcobjid")).autoplay(!0)
    }
});
jQuery(document).on("click", ".bcplaylist button.vjs-share-control", function(a) {
    var b = jQuery(this).closest("div.bcplaylist")
      , c = videojs(b.data("bcobjid"))
      , d = document.location.href.replace(/[\?\&]bcid=[\d]+/gi, "").replace(/[\?\&]playerType=[^\&\#]+/gi, "").replace(/\#.*/gi, "").replace(/[\?\&]shareURL=[^\&\#]+/gi, "").replace(/\#.*/gi, "");
    d = d.indexOf("?") > -1 ? d + "&bcid=" + c.catalog.data.videos[c.playlist.currentItem()].id : d + "?bcid=" + c.playlistMenu.items[c.playlist.currentItem()].item.id;
    var e = {
        url: d,
        services: setSocialLinks.call(b)
    };
    c.social(e)
});
jQuery("button.vjs-share-control").on("touchstart click", function(a) {
    a.preventDefault();
    if ("touchstart" == a.type) {
        var b = jQuery(this).closest("div.bcvideo")
          , c = videojs(b.data("bcobjid"))
          , d = {
            services: setSocialLinks.call(b)
        };
        c.social(d);
        jQuery("#w10close").removeClass("hidden")
    } else if ("click" == a.type) {
        var b = jQuery(this).closest("div.bcvideo")
          , c = videojs(b.data("bcobjid"))
          , d = {
            services: setSocialLinks.call(b)
        };
        c.social(d);
        jQuery("#w10close").removeClass("hidden")
    }
});
function setSocialLinks() {
    var a = {
        facebook: !0,
        google: !0,
        twitter: !0,
        tumblr: !0,
        pinterest: !0,
        linkedin: !0
    }, b, c;
    if (this.data("shareonly")) {
        b = this.data("shareonly").split(",");
        for (c in a)
            a[c] = b.some(function(a) {
                return a.toLowerCase() === c
            })
    }
    return a
}
jQuery(document).ready(function() {
    jQuery("video").bind("contextmenu", function() {
        return !1
    })
});
jQuery(document).ready(function() {
    jQuery("iframe.bciframe").each(function() {
        bciframeResize(jQuery(this));
        jQuery(this).addClass("bciframesized")
    });
    jQuery("iframe.bciframe")[0] && jQuery(window).on("resize", function() {
        jQuery("iframe.bciframe").each(function() {
            bciframeResize(jQuery(this))
        })
    })
});
function bciframeResize(a) {
    a.css("height", .5625 * a.width() - 1)
}
function convertBCscripts2div(a) {
    var b = /embedBrightcove\([\S\s]*?\)/g
      , c = /"/gi;
    a = a.replace(b, function(a, b) {
        return a.replace(c, "'")
    });
    return a.replace(/embedBrightcove\([^)]+,[ ']*([^'),]+)[ ']*\)/gi, '•<div class="bcembed bcvideo" data-bcid="$1"></div>•').replace(/<\/[^>]*script[^>]*>/gi, "°<\/script>").replace(/(<[^\/>]*script[^>]*>)/gi, "$1°").replace(/<[^\/>]*script[^>]*>°[^°•]+•/gi, "").replace(/<\/div>•[^°]+°<\/[^>]*script[^>]*>/gi, "</div>")
}
function vd01GetBreakpoint(a) {
    var b = 1 == a ? ".bcvideo[data-bcid]" : ".bcgallery[data-playlistID]";
    return window.getComputedStyle(document.querySelector(b), ":before").getPropertyValue("content").replace(/\"/g, "")
}
var VD03 = function($) {
    var a = {}
      , b = ""
      , c = ""
      , d = "hqdefault.jpg"
      , e = "maxresdefault.jpg"
      , f = {}
      , g = {
        autoplay: 0,
        end: "",
        feature: "",
        loop: 0,
        modestbranding: 1,
        playlist: "",
        rel: 0,
        showinfo: "",
        start: "",
        ytid: "",
        thumbq: ""
    }
      , h = function(a) {
        jQuery(a).prepend('<button class="vjs-big-play-button"></button>')
    }
      , i = function(a, c) {
        var d;
        d = "lightbox" == a ? void 0 !== c ? "?ytid=" + jQuery(c).attr("data-ytid") + "&" : "?ytid=" + f.ytid + "&" : void 0 !== c ? b + jQuery(c).attr("data-ytid") + "?" : b + f.ytid + "?";
        if (void 0 !== c)
            for (var e in g) {
                var h = jQuery(c).attr("data-" + e)
                  , i = g[e];
                if ("ytid" != e)
                    if ("" === h || null == h) {
                        if ("" === i)
                            continue;
                        d += e + "=" + i + "&"
                    } else
                        d += e + "=" + h + "&"
            }
        else
            for (var e in f)
                "ytid" != e && "" !== f[e] && (d += e + "=" + f[e] + "&");
        return d.replace(/&$/, "")
    }
      , j = function(a, b, c) {
        var d = jQuery('<iframe frameborder="0" width="' + a + '" height="' + b + '" allowfullscreen></iframe>')
          , e = i("", c);
        d.addClass("ytembed");
        d.attr("src", e);
        return d
    }
      , k = function(a) {
        for (var b in g)
            f[b] = jQuery(a).attr("data-" + b) ? jQuery(a).attr("data-" + b) : g[b]
    }
      , l = function(a) {
        var b = jQuery("<img></img>"), g = $(a).attr("data-thumbq"), h;
        h = "max" == g ? c + e : c + d;
        jQuery(b).attr("src", h.replace("[YTID]", f.ytid));
        jQuery(a).prepend(b)
    }
      , m = function(a) {
        var b, c, d, e, f = jQuery('<div class="ytvideo ytshowembed"><div></div></div>');
        jQuery(a).after(f);
        jQuery(a).remove();
        e = jQuery(f).children("div");
        b = j("100%", "100%", a);
        jQuery(e).append(b)
    }
      , n = function(a) {
        jQuery(a).waypoint(function() {
            m(a);
            this.destroy()
        }, {
            offset: "105%"
        })
    }
      , o = function(a) {
        jQuery(a).on("click", function(b) {
            var c = jQuery(window).width() > 1600 ? 1600 : jQuery(window).width()
              , d = jQuery(b.currentTarget);
            if (!(d.outerWidth() >= 600 || d.outerWidth() > .7 * c) || jQuery(this).closest(".lightboxonly")[0] || jQuery(this).closest(".clickvideo")[0]) {
                window.yt_loadlightbox(i("lightbox", a));
                b.stopPropagation();
                b.preventDefault()
            } else
                m(a)
        })
    };
    a.defaults = function() {
        return g
    }
    ;
    a.initialize = function() {
        jQuery("[data-ytid]").not(".ytthumbnail").each(function(a, b) {
            k(b);
            n(b)
        });
        jQuery(".ytthumbnail[data-ytid]").each(function(a, b) {
            k(b);
            jQuery(b).find("img")[0] || l(b);
            h(b);
            o(b)
        })
    }
    ;
    a.execute = function(a) {
        if (jQuery(a).is("[data-ytid]")) {
            k(a);
            n(a)
        }
    }
    ;
    return a
}(jQuery);
jQuery(function() {
    VD03.initialize()
});
"onwebkitfullscreenchange"in document && jQuery(document).on("webkitfullscreenchange", function(a) {
    var b = document.webkitFullscreenElement
      , c = b && b.parentElement.classList.contains("bcvideo") && b.parentElement;
    return c && (c.style.zIndex = 20) && jQuery(document).one("webkitfullscreenchange", function(a) {
        return c.style.zIndex = ""
    })
});
function vd01loadplayslist(a, b) {
    return $.ajax({
        headers: {
            Accept: "application/json;pk=" + bc_config.pk
        },
        beforeSend: function(a) {
            a.setRequestHeader("Accept", "application/json;pk=" + bc_config.pk)
        },
        url: b,
        method: "GET",
        dataType: "json",
        crossDomain: !0
    })
}
function vd01appendSpeakers(a) {
    var b = ""
      , c = a.hasOwnProperty("custom_fields") && a.custom_fields && a.custom_fields.speakers ? a.custom_fields.speakers : "";
    if (c) {
        var d = c.split(";");
        b = "<h4>" + d[0] + "</h4>";
        for (var e = "", f = 1; f < d.length; f++) {
            e += "<h4>" + d[f] + "</h4>"
        }
        d.length > 1 && (b += '<div class="bcfgallery-speakers" data-lsstxt="Show less" style="display: none;">' + e + '</div><a class="bcfgallery-showmore icn-img icn-plus-cs" href="#show">Show all speakers</a>')
    }
    return b
}
function vd01appendFulllengthKeynote(a, b) {
    var c = ""
      , d = a.hasOwnProperty("custom_fields") && a.custom_fields && a.custom_fields.secondary_rel_url ? a.custom_fields.secondary_rel_url : "";
    if (d) {
        var e = a.custom_fields.secondary_rel_text ? a.custom_fields.secondary_rel_text : "Watch full-length keynote";
        c = '<div><a class="icn-img bcfullkeynote" href="?bcid=' + d + '" rel="vbox" data-lbl="lightbox-open-' + e.toLowerCase().replace(/ /g, "-") + '" data-trackas="lightbox">' + e + "</a></div>"
    }
    return c
}
function vd01speakerVis(a) {
    a.on("click", "div.bcfgallery-showless, a.bcfgallery-showmore", function(a) {
        a.preventDefault();
        var b = $(this).closest("div.bcfgallery-title")
          , c = $(b).find("div.bcfgallery-speakers")
          , d = $(b).find("div.bcfgallery-showless")
          , e = $(b).find("a.bcfgallery-showmore");
        $(b).toggleClass("bcfgalleryactive");
        if ($(b).hasClass("bcfgalleryactive")) {
            $(e).hide();
            $(d).fadeIn();
            $(c).slideDown()
        } else {
            $(d).hide();
            $(e).fadeIn();
            $(c).slideUp()
        }
    })
}
function vd01injectBtn(a, b) {
    var c = $('<div class="obttns obttn-center vd01expand"><div><a>' + b + "</a></div></div>");
    $(a).find(".bchidden")[0] && $(a).append(c)
}
function vd01itemsPer(a, b) {
    var c = vd01GetBreakpoint()
      , d = {};
    d = 3 == b ? {
        desktop: a,
        tablet: Math.floor(a * (2 / 3)),
        mobile: Math.floor(a * (1 / 3))
    } : {
        desktop: a,
        tablet: Math.floor(.75 * a),
        mobile: Math.floor(.5 * a)
    };
    return d[c]
}
function vd01debounce(a, b, c) {
    var d, e;
    return function() {
        var f = this, g = arguments, h, i;
        h = function() {
            d = null;
            c || (e = a.apply(f, g))
        }
        ;
        i = c && !d;
        clearTimeout(d);
        d = setTimeout(h, b);
        i && (e = a.apply(f, g));
        return e
    }
}
function vd01viewMore(a, b, c, d, e) {
    var f = $(a).find(".col-item").length;
    $(a).on("click", ".vd01expand a", function(f) {
        var g = vd01itemsPer(b, e);
        f.preventDefault();
        if ($(a).find(".bchidden")[0]) {
            $(a).find(".col-item.bchidden").each(function(a, b) {
                a < g && $(b).removeClass("bchidden")
            });
            $(a).find(".bchidden")[0] || $(f.currentTarget).text(d)
        } else if ($(a).find(".col-item").length > g) {
            vd01viewReset(a, b, c, d, e);
            $(f.currentTarget).text(c);
            $("html, body").animate({
                scrollTop: $(a).offset().top
            }, 250, "linear")
        }
    })
}
function vd01viewReset(a, b, c, d, e) {
    var f = $(a).find(".col-item").length, g;
    g = vd01itemsPer(b, e);
    $(a).find(".col-item").each(function(a, b) {
        a >= g ? $(b).addClass("bchidden") : $(b).removeClass("bchidden")
    });
    $(a).find(".vd01expand a").text(c);
    g < f ? $(a).find(".vd01expand").show() : $(a).find(".vd01expand").hide()
}
var vd01resize = vd01debounce(function() {
    $(".bcgallery[data-playlistid]").each(function(a, b) {
        var c = $(b).attr("data-pagesize"), d = $(b).attr("data-viewmore"), e = $(b).attr("data-viewless"), f;
        if (d && e) {
            f = $(b).find(".col3")[0] ? 3 : 4;
            vd01viewReset(b, c, d, e, f)
        }
    })
}, 100);
jQuery(".bcgallery[data-playlistid]")[0] && window.addEventListener("resize", vd01resize);
!function(doc, win) {
    if ("function" != typeof doc.createEvent)
        return !1;
    var pointerId, currX, currY, cachedX, cachedY, timestamp, target, dblTapTimer, longtapTimer, pointerEvent = function(type) {
        var lo = type.toLowerCase()
          , ms = "MS" + type;
        return navigator.msPointerEnabled ? ms : !!window.PointerEvent && lo
    }, touchEvent = function(name) {
        return "on" + name in window && name
    }, defaults = {
        useJquery: !win.IGNORE_JQUERY && "undefined" != typeof jQuery,
        swipeThreshold: win.SWIPE_THRESHOLD || 100,
        tapThreshold: win.TAP_THRESHOLD || 150,
        dbltapThreshold: win.DBL_TAP_THRESHOLD || 200,
        longtapThreshold: win.LONG_TAP_THRESHOLD || 1e3,
        tapPrecision: win.TAP_PRECISION / 2 || 30,
        justTouchEvents: win.JUST_ON_TOUCH_DEVICES
    }, wasTouch = !1, touchevents = {
        touchstart: touchEvent("touchstart") || pointerEvent("PointerDown"),
        touchend: touchEvent("touchend") || pointerEvent("PointerUp"),
        touchmove: touchEvent("touchmove") || pointerEvent("PointerMove")
    }, isTheSameFingerId = function(e) {
        return !e.pointerId || void 0 === pointerId || e.pointerId === pointerId
    }, setListener = function(elm, events, callback) {
        for (var eventsArray = events.split(" "), i = eventsArray.length; i--; )
            elm.addEventListener(eventsArray[i], callback, !1)
    }, getPointerEvent = function(event) {
        return event.targetTouches ? event.targetTouches[0] : event
    }, getTimestamp = function() {
        return (new Date).getTime()
    }, sendEvent = function(elm, eventName, originalEvent, data) {
        var customEvent = doc.createEvent("Event");
        if (customEvent.originalEvent = originalEvent,
        data = data || {},
        data.x = currX,
        data.y = currY,
        data.distance = data.distance,
        defaults.useJquery && (customEvent = jQuery.Event(eventName, {
            originalEvent: originalEvent
        }),
        jQuery(elm).trigger(customEvent, data)),
        customEvent.initEvent) {
            for (var key in data)
                customEvent[key] = data[key];
            customEvent.initEvent(eventName, !0, !0),
            elm.dispatchEvent(customEvent)
        }
        for (; elm; )
            elm["on" + eventName] && elm["on" + eventName](customEvent),
            elm = elm.parentNode
    }, onTouchStart = function(e) {
        if (isTheSameFingerId(e) && (pointerId = e.pointerId,
        "mousedown" !== e.type && (wasTouch = !0),
        "mousedown" !== e.type || !wasTouch)) {
            var pointer = getPointerEvent(e);
            cachedX = currX = pointer.pageX,
            cachedY = currY = pointer.pageY,
            longtapTimer = setTimeout(function() {
                sendEvent(e.target, "longtap", e),
                target = e.target
            }, defaults.longtapThreshold),
            timestamp = getTimestamp(),
            tapNum++
        }
    }, onTouchEnd = function(e) {
        if (isTheSameFingerId(e)) {
            if (pointerId = void 0,
            "mouseup" === e.type && wasTouch)
                return void (wasTouch = !1);
            var eventsArr = []
              , now = getTimestamp()
              , deltaY = cachedY - currY
              , deltaX = cachedX - currX;
            if (clearTimeout(dblTapTimer),
            clearTimeout(longtapTimer),
            deltaX <= -defaults.swipeThreshold && eventsArr.push("swiperight"),
            deltaX >= defaults.swipeThreshold && eventsArr.push("swipeleft"),
            deltaY <= -defaults.swipeThreshold && eventsArr.push("swipedown"),
            deltaY >= defaults.swipeThreshold && eventsArr.push("swipeup"),
            eventsArr.length) {
                for (var i = 0; i < eventsArr.length; i++) {
                    var eventName = eventsArr[i];
                    sendEvent(e.target, eventName, e, {
                        distance: {
                            x: Math.abs(deltaX),
                            y: Math.abs(deltaY)
                        }
                    })
                }
                tapNum = 0
            } else
                cachedX >= currX - defaults.tapPrecision && cachedX <= currX + defaults.tapPrecision && cachedY >= currY - defaults.tapPrecision && cachedY <= currY + defaults.tapPrecision && timestamp + defaults.tapThreshold - now >= 0 && (sendEvent(e.target, tapNum >= 2 && target === e.target ? "dbltap" : "tap", e),
                target = e.target),
                dblTapTimer = setTimeout(function() {
                    tapNum = 0
                }, defaults.dbltapThreshold)
        }
    }, onTouchMove = function(e) {
        if (isTheSameFingerId(e) && ("mousemove" !== e.type || !wasTouch)) {
            var pointer = getPointerEvent(e);
            currX = pointer.pageX,
            currY = pointer.pageY
        }
    }, tapNum = 0;
    setListener(doc, touchevents.touchstart + (defaults.justTouchEvents ? "" : " mousedown"), onTouchStart),
    setListener(doc, touchevents.touchend + (defaults.justTouchEvents ? "" : " mouseup"), onTouchEnd),
    setListener(doc, touchevents.touchmove + (defaults.justTouchEvents ? "" : " mousemove"), onTouchMove),
    win.tocca = function(options) {
        for (var opt in options)
            defaults[opt] = options[opt];
        return defaults
    }
}(document, window);
$(document).on("blur", ".o-hf", function() {
    $(this).removeClass("o-hf")
});
$(document).on("mousedown touchstart", "a,button,span[tabindex],li[tabindex],div[tabindex]", function() {
    $(this).addClass("o-hf")
});

/*! ORACLE - TRUSTE */
jQuery(document).ready(function() {
    return !jQuery("#consent_blackbar").length && jQuery("body").prepend('<div id="consent_blackbar"></div>')
});
var oracle = oracle || {};
oracle.truste = {};
oracle.truste.api = {};
(function() {
    var a = "notice_gdpr_prefs"
      , b = "truste.eu.cookie.notice_preferences"
      , c = "truste.eu.cookie.notice_gdpr_prefs";
    this.getCookieName = function() {
        return "notice_preferences"
    }
    ;
    this.getStorageItemName = function() {
        return b
    }
    ;
    this.getGdprCookieName = function() {
        return "notice_gdpr_prefs"
    }
    ;
    this.getGdprStorageItemName = function() {
        return c
    }
}
).apply(oracle.truste);
(function() {
    var b = oracle.truste;
    function getCookie(a) {
        for (var b = a + "=", c = document.cookie.split(";"), d = 0; d < c.length; d++) {
            for (var e = c[d]; " " == e.charAt(0); )
                e = e.substring(1);
            if (0 == e.indexOf(b))
                return e.substring(b.length, e.length)
        }
        return null
    }
    function getLocalStorageItem(a) {
        return "undefined" != typeof Storage ? localStorage.getItem(a) : null
    }
    function getTRUSTeLocalStorageValue(a) {
        var b = getLocalStorageItem(a);
        if (null != b) {
            return JSON.parse(b).value
        }
        return null
    }
    this.getConsentCode = function() {
        var a = getTRUSTeLocalStorageValue(b.getStorageItemName()) || getCookie(b.getCookieName());
        return null == a ? -1 : parseInt(a) + 1
    }
    ;
    this.getGdprConsentCode = function() {
        var c = getTRUSTeLocalStorageValue(b.getGdprStorageItemName()) || getCookie(b.getGdprCookieName());
        if (null == c)
            return -1;
        var d = new Array;
        d = c.split(",");
        for (a in d)
            d[a] = parseInt(d[a], 10) + 1;
        return d.toString()
    }
    ;
    this.getConsentDecision = function() {
        var a = this.getConsentCode();
        if (-1 == a) {
            var b = '{"consentDecision": 0, "source": "implied"}';
            return JSON.parse(b)
        }
        var b = '{"consentDecision": ' + parseInt(a) + ', "source": "asserted"}';
        return JSON.parse(b)
    }
    ;
    this.getGdprConsentDecision = function() {
        var a = this.getGdprConsentCode();
        if (-1 == a) {
            var b = '{"consentDecision": [0], "source": "implied"}';
            return JSON.parse(b)
        }
        var b = '{"consentDecision": [' + a + '], "source": "asserted"}';
        return JSON.parse(b)
    }
}
).apply(oracle.truste.api);

/*! ORACLE - PROFILE V2 */
var USER = new getUserInfo;
function existsUCMCookie(a) {
    return "ORA_UCM_INFO" == a && null != ORA_UCM_INFO.version && null != ORA_UCM_INFO.guid && null != ORA_UCM_INFO.username
}
function isUCMRegistered() {
    if (1 == existsUCMCookie("ORA_UCM_INFO")) {
        orainfo_exists = !0;
        otnnm_exists = !0;
        return !0
    }
    return !1
}
function isUCMAnonymous() {
    return null != ORA_UCM_INFO.version && null != ORA_UCM_INFO.guid && 0 == isUCMRegistered()
}
function getUCMCookies() {
    ORA_UCM_INFO = new private_ORA_UCM_INFO
}
function getCookieData(a) {
    for (var b = a.length, c = document.cookie.length, d = 0, e; d < c; ) {
        var f = d + b;
        if (document.cookie.substring(d, f) == a) {
            e = document.cookie.indexOf(";", f);
            -1 == e && (e = document.cookie.length);
            f++;
            return cleanCookieContent(decodeURIComponent(document.cookie.substring(f, e).replace(/\+/g, "%20")))
        }
        d++
    }
    return ""
}
function cleanCookieContent(a) {
    var b = void 0 === a ? "NoData" : a;
    if ("NoData" != b) {
        var c = b.length;
        for (i = 0; i < c; i++)
            if ("." != b.substr(i, 1) && "?" != b.substr(i, 1) && "<>".search(b.substr(i, 1)) > -1) {
                b = "Invalid";
                i = c + 1
            }
    }
    return b
}
function getUserInfo() {
    var a = new Object;
    this.value_enc = getCookieData("ORA_UCM_INFO");
    this.array = this.value_enc.split("~");
    a.version = this.array[0];
    a.guid = this.array[1];
    a.firstname = this.array[2];
    a.lastname = this.array[3];
    a.username = this.array[4];
    return a
}
function invalidateAuthCookie() {
    null != getCookieData("ORASSO_AUTH_HINT") && (document.cookie = "ORASSO_AUTH_HINT=INVALID; Max-Age=0; domain=.oracle.com; path=/;")
}
function sso_sign_out() {
    var a = escape(window.location.href.replace(/^http:/gi, "https:"));
    -1 != a.indexOf("/secure") && (a = window.location.href.indexOf("/opn/") > -1 ? "http://www.oracle.com/opn/" : "http://www.oracle.com/partners/");
    invalidateAuthCookie();
    window.location.host.indexOf("-stage") > -1 ? window.location = "" + a : window.location = "" + a
}
function private_UCMCookieDecode(a) {
    var b = " !\"#$&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~."
      , c = unescape(a)
      , d = ""
      , e = "";
    for (i = 0; i < c.length; i++) {
        e = c.charAt(i);
        j = b.indexOf(e);
        if (-1 != j) {
            j += 2;
            j > b.length - 1 && (j -= b.length);
            d += b.charAt(j)
        } else
            d += e
    }
    return d
}
function private_ORA_UCM_INFO() {
    this.value_enc = getCookieData("ORA_UCM_INFO");
    this.array = this.value_enc.split("~");
    this.version = this.array[0];
    this.guid = this.array[1];
    this.firstname = this.array[2];
    this.lastname = this.array[3];
    this.username = this.array[4];
    var a = ["3", this.guid, this.firstname, this.lastname, this.username]
      , b = a.join("~")
}

/*! ORACLE - TRACKING URL */
jQuery(document).ready(function() {
    jQuery("a[data-cxdtrack],a[data-adbtrack]").each(function() {
        var a = ""
          , b = "us" != $("meta[name=siteid]").attr("content") ? "_" + $("meta[name=siteid]").attr("content") : ""
          , c = jQuery(this).attr("href")
          , d = -1 != c.indexOf("go.oracle.com") ? "src1" : "source"
          , e = -1 != c.indexOf("?") ? "&" : "?";
        jQuery(this).attr("data-cxdtrack") && -1 == c.indexOf(d + "=") && (a = d + "=" + jQuery(this).attr("data-cxdtrack") + b);
        jQuery(this).attr("data-adbtrack") && -1 == c.indexOf("intcmp=") && ("" == a ? a = "intcmp=" + jQuery(this).attr("data-adbtrack") + b : a += "&intcmp=" + jQuery(this).attr("data-adbtrack") + b);
        jQuery(this).attr("href", c + e + a)
    });
    var a = getUrlVars().source
      , b = "";
    void 0 != a && (b = a);
    "" != b && jQuery(document).on("mousedown", 'a:not([href^="#"])', function(a) {
        var c = jQuery(this).attr("href")
          , d = b.split("+")[0];
        if (void 0 == c || -1 != c.indexOf("source=" + d) || -1 != c.indexOf("src1=" + d) || -1 != c.indexOf("sourceType=" + d) || -1 != c.indexOf("elqSignOut") || -1 != c.indexOf("learn.oracle.com"))
            return !0;
        var e = {}, f, g = c.split("?"), h = "", i = 0, j = !1;
        do {
            h += g.shift() + "?"
        } while (g.length > 1);var k = g.shift()
          , l = -1 != c.indexOf("go.oracle.com") ? "src1" : "source";
        l = -1 != c.indexOf("myservices.us.oraclecloud.com") ? "sourceType" : l;
        qs2 = void 0 == k ? [] : k.split("&");
        for (var m = 0; m < qs2.length; m++) {
            f = qs2[m].split("=");
            e[f[0]] = f[1]
        }
        e[l] = void 0 == e[l] ? b : b.split("+")[0].split("%2B")[0] + "%2B" + e[l];
        qsSource = h;
        jQuery.each(e, function(a, b) {
            if (a != l) {
                qsSource += a + "=" + b;
                if ("nexturl" == a) {
                    i = 1;
                    qsSource += "?" + l + "=" + e[l]
                }
                "iframe" == a && (j = !0);
                qsSource += "&"
            }
        });
        0 == i && (qsSource += l + "=" + e[l] + "&");
        qsSource = qsSource.slice(0, -1);
        if (j) {
            var n = "";
            jQuery.each(getUrlVars(), function(a, b) {
                "source" != b && (n += "&" + b + (getUrlVars()[b] ? "=" + getUrlVars()[b] : ""))
            });
            qsSource += n;
            j = !1
        }
        jQuery(this).attr("href", qsSource)
    })
});

/*! U28 */
$(document).ready(function() {
    if ($(".u28")[0]) {
        var a = !1
          , b = window.location.href;
        if (b.indexOf("www-stage") > -1 || b.indexOf("www-portal-stage") > -1 || b.indexOf("www.stage") > -1 || b.indexOf("www-sites") > -1)
            var a = !0;
        var c;
        $(".u28ham").first().attr("href") && (c = $(".u28ham").first().attr("href"));
        c && getMegaMenuData(c);
        function getMegaMenuData(a) {
            var b = "u20ham"
              , c = jQuery.Deferred();
            c.promise().then(asyncrWait).then(oracleDataMenu.fetchMenuContent(a).then(function(a) {
                buildMegaMenu(a.replace(/<([^h\/>]*)h5/g, '<a class="u20ham"').replace(/<\/h5>/g, "</a>"))
            }));
            c.resolve()
        }
        function asyncrWait() {
            var a = $.Deferred();
            setTimeout(function() {
                a.resolve("generating async wait")
            }, 0);
            return a.promise()
        }
        function u28acscheck() {
            $(".u24show")[0] && $(".u24close").click()
        }
        function u28scrolllock() {
            $("body").hasClass("u28disable-scroll") ? $("body").removeClass("u28disable-scroll") : $("body").addClass("u28disable-scroll")
        }
        function buildMegaMenu(a) {
            var b = $("<div>").append($.parseHTML(a))
              , c = $(".u28navw1", b)
              , d = $(".u28w7", b);
            $("#u28nav").append(c[0]);
            $("#u28nav .u28navw1").addClass("cwidth");
            $(".u28w6").append(d[0]);
            u28rotatingsuggest();
            u28buildmobilenav();
            $(".mclose").on("click", function(a) {
                $(a.target).toggleClass("open");
                $(a.target).siblings("ul").slideToggle(300)
            });
            addAccessibility();
            setTimeout(function() {
                adjustDropdown()
            }, 2e3)
        }
        function addAccessibility() {
            $("[tabindex]").each(function() {
                $(this).attr("tabindex") > 0 && $(this).attr("tabindex", "0")
            });
            $(".u28-searchicon").attr("tabindex", "-1");
            $("#askoracleinput").attr("role", "").attr("type", "text");
            $(".u28ham").attr("aria-controls", "u28navw1").attr("aria-expanded", "false").attr("aria-haspopup", "true");
            $("#u28nav").attr("aria-role", "menu").attr("tabindex", "-1");
            $(".u28-profile").attr("tabindex", "-1");
            $(".u28-profilew1").attr("tabindex", "-1").attr("id", "u28-profilew1");
            $(".u28-profilew1 a[data-lbl]").each(function() {
                $(this).attr("tabindex", "-1")
            });
            var a = $(".u28prof > span")[0].innerText;
            $(".u28prof").attr("aria-controls", "u28-profilew1").attr("aria-label", a).attr("aria-expanded", "false").attr("aria-haspopup", "true");
            $(".u28prof > span").remove();
            $("#u28nav").find('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])').last()[0].addEventListener("keydown", trapTabKeyNav);
            $(".u28-profilew1").find('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])').last()[0].addEventListener("keydown", trapTabKeyProfile)
        }
        function trapTabKeyNav(a) {
            if (9 === a.keyCode) {
                $("#askoracleinput").attr("tabindex", "0");
                $(".u28b1").attr("tabindex", "0");
                $("#u28nav").attr("tabindex", "-1");
                d.toggleClass("u28navactive u28cover");
                k.toggleClass("u28fadeIn");
                $(".u28prof").attr("tabindex", "0");
                $(".u28ham").attr("aria-expanded", "false");
                setTimeout(function() {
                    $(".u28ham").focus()
                }, 50)
            }
        }
        function trapTabKeyProfile(a) {
            if (9 === a.keyCode) {
                $(".u28prof").attr("aria-expanded", "false");
                $("#u28-profilew1").attr("tabindex", -1);
                $("#u28-profilew1 a[data-lbl]").each(function() {
                    $(this).attr("tabindex", "-1")
                });
                m.toggleClass("u28fadeIn");
                d.toggleClass("profactive");
                setTimeout(function() {
                    $(".u28prof").focus()
                }, 50)
            }
        }
        var d = $("#u28"), e = !1, f = $("#askoracle"), g = $("#askoracleinput"), h = 0, i = $(".u28w4"), j = $(".u28w8"), k = $(".u28nav"), l = $(".u28-profile"), m = $(".u28-profilew1"), n, o = !1, p = !1, q = [], r = 0, t = !1, u = g.data("prefix");
        if (!u)
            var t = !0
              , u = "";
        var v, w = 0, x = d.outerHeight(), y = x;
        if (USER.guid) {
            USER.username && USER.username;
            USER.firstname && "NOT_FOUND" != USER.firstname && USER.lastname && "NOT_FOUND" != USER.lastname ? $(".u28l-in").prepend('<li><a href="' + b + '" data-lbl="profile:user-account">' + USER.firstname + " " + USER.lastname + "</a></li>") : USER.firstname && "NOT_FOUND" != USER.firstname && $(".u28l-in").prepend('<li><a href="' + b + '" data-lbl="profile:user-account">' + USER.firstname + "</a></li>");
            l.addClass("loggedin")
        }
        $(document).keyup(function(a) {
            if ("Escape" === a.key && d.hasClass("u28navactive")) {
                d.removeClass("u28navactive u28cover");
                k.removeClass("u28fadeIn");
                d.removeClass("u28-up");
                d.addClass("u28-down");
                removeInputFocus()
            }
            if ("Escape" === a.key && d.hasClass("dropdownactive")) {
                g.val("");
                closedropdown()
            }
        });
        function u28hasScrolled() {
            if (!d.hasClass("dropdownactive") || !d.hasClass("u28navactive")) {
                var a = $(document).scrollTop();
                a <= 1 && d.removeClass("u28-down u28-up").addClass("u28-top");
                if (Math.abs(w - a) <= y)
                    return;
                if (a > w && a > x) {
                    if (!d.hasClass("u28-up")) {
                        d.removeClass("u28-top u28-down").addClass("u28-up");
                        setTimeout(function() {
                            d.hasClass("u28-past") || d.addClass("u28-past")
                        }, 400)
                    }
                } else
                    Math.abs(a) + $(window).height() < $(document).height() && !d.hasClass("u28-down") && a > 0 && d.removeClass("u28-top u28-up").addClass("u28-down");
                w = a
            }
        }
        var z = function scrollToTop() {
            var a = document.documentElement.scrollTop || document.body.scrollTop;
            if (a > 0) {
                window.requestAnimationFrame(scrollToTop);
                window.scrollTo(0, a - a / 8)
            }
        };
        $(".u28input").append('<div class="u28placeholder"><span></span></div>');
        $(".u28w2").append('<div class="u28suggestw1"></div>');
        $(".u28suggestw1").append('<ul class="u28suggest"></ul>');
        d.prepend('<span class="u28cover"></span>');
        d.prepend('<span class="u28bttop"></span>');
        j.append('<ul class="u28skel"></ul>');
        for (var A = [], B = 0; B < 10; B++)
            A.push("<li></li>");
        $(".u28skel").html(A.join(""));
        function u28delay(a, b) {
            var c = 0;
            return function() {
                clearTimeout(c);
                for (var d = arguments.length, e = new Array(d), f = 0; f < d; f++)
                    e[f] = arguments[f];
                c = setTimeout(a.bind.apply(a, [this].concat(e)), b || 0)
            }
        }
        var C = 600;
        g.on("click", function(a) {
            u28acscheck();
            addInputFocus();
            d.removeClass("u28navactive u28cover");
            k.removeClass("u28fadeIn");
            m.removeClass("u28fadeIn");
            d.removeClass("profactive")
        });
        function closeprof() {
            if ("false" == $(".u28prof").attr("aria-expanded")) {
                $(".u28prof").attr("aria-expanded", "true");
                $("#u28-profilew1").attr("tabindex", 0);
                $("#u28-profilew1 a[data-lbl]").each(function() {
                    $(this).attr("tabindex", "0")
                })
            } else {
                $(".u28prof").attr("aria-expanded", "false");
                $("#u28-profilew1").attr("tabindex", -1);
                $("#u28-profilew1 a[data-lbl]").each(function() {
                    $(this).attr("tabindex", "-1")
                })
            }
            m.toggleClass("u28fadeIn");
            d.toggleClass("profactive");
            d.removeClass("u28-up");
            d.addClass("u28-down");
            removeInputFocus();
            d.removeClass("u28navactive u28cover");
            k.removeClass("u28fadeIn")
        }
        $(".u28prof, .u28actbck").on("click", function(a) {
            closeprof();
            a.preventDefault();
            return !1
        });
        $(document.body).click(function(a) {
            m.hasClass("u28fadeIn") && closeprof()
        });
        $(".u28ham, .mnavback, .u28cover").click(function(a) {
            u28acscheck();
            d.toggleClass("u28navactive u28cover");
            k.toggleClass("u28fadeIn");
            d.removeClass("u28-up");
            d.addClass("u28-down");
            removeInputFocus();
            if ("false" == $(".u28ham").attr("aria-expanded")) {
                $(".u28ham").attr("aria-expanded", "true");
                $("#askoracleinput").attr("tabindex", "-1");
                $(".u28prof").attr("tabindex", "-1");
                $(".u28b1").attr("tabindex", "-1");
                $("#u28nav").attr("tabindex", "0")
            } else {
                $(".u28ham").attr("aria-expanded", "false");
                $("#askoracleinput").attr("tabindex", "0");
                $(".u28prof").attr("tabindex", "0");
                $(".u28b1").attr("tabindex", "0");
                $("#u28nav").attr("tabindex", "-1")
            }
            a.preventDefault();
            return !1
        });
        p || $(".u28ham").on("mouseover touchstart", function(a) {
            p = !0;
            k.addClass("bgload")
        });
        $(".u28-searchicon").on("click", function(a) {
            addInputFocus();
            a.preventDefault();
            return !1
        });
        function u28rotatingsuggest() {
            $(".u28w7 li").each(function() {
                var a = $(this).text();
                q.push(a)
            });
            $(".u28placeholder span").hide();
            t ? $(".u28placeholder span").text(u + " " + q[0]) : $(".u28placeholder span").text(u + ' "' + q[0] + '"');
            $(".u28placeholder span").fadeIn(400);
            !function animate() {
                $(".u28placeholder span").delay(2e3).fadeOut(400, function() {
                    h = (h + 1) % q.length;
                    t ? $(".u28placeholder span").text(q[h]) : $(".u28placeholder span").text(u + ' "' + q[h] + '"')
                }).fadeIn(400, animate)
            }()
        }
        function u28buildmobilenav() {
            $(".u28navw1>ul>li>h3").each(function() {
                $(this).not(":has(a)").css("opacity", "0.6");
                $(this).siblings("ul").length && $(this).parent().prepend('<span class="mclose"></span>')
            })
        }
        function u28videocheck() {
            $(".u28w8 .bcembed")[0] && $(".u28w8 .bcembed").each(function() {
                bc_loadplayer($(this))
            })
        }
        function u28lockpage() {
            $("html, body").css({
                overflow: "hidden",
                height: "100%"
            })
        }
        function u28unlockpage() {
            $("html, body").css({
                overflow: "inherit",
                height: "auto"
            })
        }
        $(".u28 a.u28-back").on("click", function(a) {
            a.preventDefault();
            g.val("");
            closedropdown();
            d.removeClass("u28navactive u28cover u28-up");
            d.addClass("u28-down");
            k.removeClass("u28fadeIn");
            return !1
        });
        function opendropdown() {
            if (!d.hasClass("dropdownactive")) {
                d.addClass("dropdownactive");
                i.addClass("u28dropfadeIn");
                g.removeAttr("placeholder");
                adjustDropdown();
                setTimeout(function() {
                    i.addClass("dropdownopen")
                }, 501)
            }
        }
        function closedropdown() {
            $(".u28suggest").removeClass("active");
            $(".u28w3").removeClass("u28typing");
            j.addClass("hidden");
            $(".u28placeholder").removeClass("u28hidden");
            d.removeClass("dropdownactive");
            i.addClass("u28move");
            setTimeout(function() {
                i.removeClass("u28move");
                i.removeClass("u28dropfadeIn");
                i.removeClass("dropdownopen")
            }, 401)
        }
        function removeInputFocus() {
            d.removeClass("u28focus")
        }
        function addInputFocus() {
            d.addClass("u28focus")
        }
        $(".u28w2").on("click", "a.u28complete", function(a) {
            a.preventDefault();
            var b = $(a.currentTarget).text();
            g.val(b);
            $(".u28suggest").html("");
            $(".u28suggest").removeClass("active");
            j.removeClass("hidden");
            f.submit();
            return !1
        });
        j.on("click", ".u28w7 li", function(a) {
            var b = $(this).text();
            g.val(b);
            f.submit()
        });
        function buildResults(b) {
            if (!b)
                var b = 0;
            var c = 0
              , e = $(".u28w3 input[name=Ntt]").val().toLowerCase()
              , e = encodeURIComponent(e)
              , f = $(".u28w2 input[name=Nty]").val()
              , h = $(".u28w2 input[name=Ntk]").val()
              , i = $(".u28w2 input[name=Dy]").val()
              , k = $(".u28w2 input[name=cty]").val()
              , l = $(".u28w2 input[name=lang]").val()
              , m = g.data("filtertxt")
              , n = g.data("ctytxt");
            if (b <= 0) {
                j.addClass("loading");
                j.removeClass("u28found")
            }
            if (a)
                if (o)
                    var p = "" + b + "&Ntt=" + e + "&Dy=" + i + "&Nty=" + f + "&Ntk=" + h + "&format=json";
                else if (k && l)
                    if ("us" === k && "en" === l)
                        var p = "" + b + "&Ntt=" + e + "&Dy=" + i + "&Nty=" + f + "&Ntk=" + h + "&format=json";
                    else
                        var p = "" + b + "&Ntt=" + e + "&Dy=" + i + "&Nty=" + f + "&Ntk=" + h + "&cty=" + k + "&lang=" + l + "&format=json";
                else
                    var p = "" + b + "&Ntt=" + e + "&Dy=" + i + "&Nty=" + f + "&Ntk=" + h + "&format=json";
            else if (o)
                var p = "/search/results-nodim?No=" + b + "&Ntt=" + e + "&Dy=" + i + "&Nty=" + f + "&Ntk=" + h + "&format=json";
            else if (k && l)
                if ("us" === k && "en" === l)
                    var p = "/search/results-nodim?No=" + b + "&Ntt=" + e + "&Dy=" + i + "&Nty=" + f + "&Ntk=" + h + "&format=json";
                else
                    var p = "/search/results-nodim?No=" + b + "&Ntt=" + e + "&Dy=" + i + "&Nty=" + f + "&Ntk=" + h + "&cty=" + k + "&lang=" + l + "&format=json";
            else
                var p = "/search/results-nodim?No=" + b + "&Ntt=" + e + "&Dy=" + i + "&Nty=" + f + "&Ntk=" + h + "&format=json";
            var q = 0
              , t = ""
              , u = !1
              , v = !1
              , w = !1;
            jQuery.getJSON(p, function(a) {
                d.removeClass("u28navactive");
                for (var e = 0; e < a.contents.length; e++) {
                    if ("ResultsList" === a.contents[e]["@type"] && !u) {
                        u = !0;
                        var f = a.contents[e].records
                    }
                    if ("TopHeaderContent" === a.contents[e]["@type"] && !v) {
                        v = !0;
                        var g = a.contents[e].url
                    }
                    if (!u && !v) {
                        if ("ResultsList" === a.contents[0].mainContent[0].contents[0]["@type"] && !u) {
                            u = !0;
                            var f = a.contents[0].mainContent[0].contents[0].records
                        }
                        if (a.contents[0].mainContentTop[1].contents.length > 0 && "TopHeaderContent" === a.contents[0].mainContentTop[1].contents[0]["@type"] && !v) {
                            v = !0;
                            var g = a.contents[0].mainContentTop[1].contents[0].url
                        }
                    }
                }
                var h = ""
                  , i = ""
                  , k = ""
                  , l = ""
                  , q = !1;
                if (f.length > 0) {
                    for (var r = 0; r < f.length; r++) {
                        var t = !1
                          , x = b + r
                          , y = f[r].attributes.Title
                          , z = f[r].attributes.Description
                          , A = f[r].attributes.DisplayURL
                          , B = f[r].attributes.SiteLink;
                        if (void 0 !== B && b <= 0 && 0 == r) {
                            var C = !0
                              , t = !0
                              , y = f[r].attributes.Title;
                            i += '<div class="u28sitelinkw1" data-lbl="sitelinks-' + y + '">';
                            i += '<div class="u28sitelinks u28result u28sitelinksp">';
                            i += '<h4><a href="' + A + '">' + y + "</a></h4>";
                            i += '<cite><a href="' + A + '">' + A + "</a></cite>";
                            void 0 !== z && (i += '<p data-lbl="sitelinks:' + y + '">' + z + "</p>");
                            i += "</div>";
                            for (var D = 0; D < B.length; D++) {
                                for (var E = B[D].split("~"), F = [0], G = [0], H = [0], I = 0; I < E.length; I++)
                                    for (var J = parseInt(E.length / 3), K = E[I].split("=")[0], L = E[I].substring(E[I].indexOf("=") + 1), M = 0; M <= J; ) {
                                        var N = "siteLinkTitles" + M
                                          , O = "siteLinkDescriptions" + M
                                          , P = "siteLinkUrls" + M;
                                        K === N && (F[M - 1] = L);
                                        K === O && (G[M - 1] = L);
                                        K === P && (H[M - 1] = L);
                                        M++
                                    }
                                if (F.length === J && G.length === J && H.length === J)
                                    for (var Q = 0; Q < J + 1; ) {
                                        if (G[Q] && F[Q] && H[Q]) {
                                            var R = H[Q]
                                              , S = G[Q]
                                              , T = F[Q];
                                            if (R && S && T) {
                                                i += '<div class="u28sitelinks u28result u28sitelinksc">';
                                                i += '<div class="u28rw1">';
                                                i += '<div class="u28rw2">';
                                                i += '<h4><a href="' + R + '" data-lbl="sitelinks:' + T + '">' + T + "</a></h4>";
                                                i += '<p data-lbl="sitelinks:' + T + '">' + S + "</p>";
                                                i += "</div>";
                                                i += "</div>";
                                                i += "</div>"
                                            }
                                        }
                                        Q++
                                    }
                                D++
                            }
                            i += "</div>"
                        }
                        if (void 0 !== g && b <= 0 && !w) {
                            w = !0;
                            var U = g.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
                            k += U
                        }
                        if (void 0 != y && void 0 != A && !t) {
                            if (null == f[r].attributes.SourceTag)
                                var V = !1;
                            else {
                                var V = !0;
                                if ("video" === f[r].attributes.SourceTag.toString().toLowerCase()) {
                                    q = !0;
                                    var W = f[r].attributes.Id[0]
                                } else
                                    q = !1
                            }
                            l += q ? '<div class="u28result u28video" data-lbl="search-row:' + x + '">' : '<div class="u28result" data-lbl="search-row:' + x + '">';
                            l += '<div class="u28rw1">';
                            l += '<div class="u28rw2">';
                            q && (l += '<div class="bcembed bcthumbnail" data-bcid="' + W + '"></div>');
                            l += '<div class="u28rw3">';
                            l += '<h4><a href="' + A + '">' + y + "</a></h4>";
                            l += V ? q ? '<cite><a href="' + A + '">' + A + "</a></cite>" : '<cite><div class="u28type"><span>' + f[r].attributes.SourceTag + '</span><a href="' + A + '">' + A + "</a></div></cite>" : '<cite><a href="' + A + '">' + A + "</a></cite>";
                            void 0 !== z && (l += "<p>" + z + "</p>");
                            l += "</div>";
                            l += "</div>";
                            l += "</div>";
                            l += "</div>";
                            var q = !1
                              , V = !1;
                            c++
                        }
                    }
                    b <= 0 && j.find("*").not(".u28skel").not(".u28skel li").remove();
                    setTimeout(function() {
                        if (m && n && !o) {
                            h += '<div class="ctryfilter filter' + b + '">';
                            h += '<div class="ctryfilterw1">';
                            h += '<a class="filtertxt" href="' + m + '">' + m + "</a>";
                            h += '<span class="ctytxt">' + n + "</span>";
                            h += '<span class="clrctry"></span>';
                            h += "</div>";
                            h += "</div>";
                            j.append(h);
                            $(".clrctry").on("click", function(a) {
                                o = !0;
                                j.find("*").not(".u28skel").not(".u28skel li").remove();
                                buildResults(0)
                            })
                        }
                        j.append(i);
                        j.append(k);
                        j.append(l);
                        j.removeClass("hidden").addClass("u28found");
                        u28videocheck();
                        $(".cb19v2").length && $(".cb19v2").each(function() {
                            $(this).find("img, .bcthumbnail").length && $(this).closest(".cb19v2").addClass("u28proimg")
                        });
                        removeInputFocus();
                        var a = document.getElementById("askoracleinput");
                        if (b <= 0)
                            try {
                                s.prop3 = s.pageName + ":Search>" + a.value;
                                s.prop4 = "Search>" + a.value;
                                s.prop6 = "0";
                                s.prop8 = s.pageName;
                                s.eVar26 = "search:askoracle";
                                s.prop26 = s.eVar26;
                                s.channel = "askoraclesearch";
                                s.eVar52 = p;
                                s.pageName = s_account[1] + ":" + s_account[2] + ":askoraclesearch";
                                s_Ping(!0);
                                s.pageName = s.prop8
                            } catch (a) {}
                        a.selectionEnd = a.selectionStart;
                        a.blur();
                        adjustDropdown();
                        j.removeClass("loading")
                    }, 100)
                } else if (b <= 0)
                    setTimeout(function() {
                        if (!$(".u28w8 .u28noresults")[0]) {
                            j.removeClass("loading hidden");
                            j.addClass("u28found");
                            $(".u28w9").clone(!0, !0).contents().appendTo(j);
                            $(".u28w7").clone().appendTo(".u28w8 .u28noresults .u28rw2");
                            adjustDropdown()
                        }
                    }, 200);
                else {
                    j.removeClass("loading hidden");
                    j.addClass("u28found");
                    adjustDropdown()
                }
            }).done(function(a) {
                var b = !0;
                j.addClass("u28loaded");
                setTimeout(function() {
                    $(".u28w4").scroll(function() {
                        var a = j.offset().top
                          , c = j.height();
                        if ($(window).height() + $(".u28w4").scrollTop() > a + c && b) {
                            r >= 0 && (r += 10);
                            buildResults(r);
                            b = !1
                        }
                    })
                }, 200)
            })
        }
        f.submit(function(a) {
            opendropdown();
            j.find("*").not(".u28skel").not(".u28skel li").remove();
            r = 0;
            buildResults(0);
            d.removeClass("u28navactive u28cover");
            k.removeClass("u28fadeIn");
            setTimeout(function() {
                j.addClass("u28fadeIn").siblings(".u28trgt").removeClass("u28fadeIn");
                $(".u28suggest").removeClass("active")
            }, 200);
            a.preventDefault()
        });
        function updateLinks(a) {
            var b = window.location.host
              , c = encodeURI(window.location.href.replace(/^http:/gi, "https:")).replace(/^https:\/\/www-content/gi, "http://www-content");
            a.find('a[href*="nexturl="]').each(function() {
                var a = $(this);
                a.attr("href", a.attr("href").replace(/nexturl=/gi, "nexturl=" + c))
            });
            window.frameElement && $(document).find("#u28 a").attr("target", "_top")
        }
        updateLinks($(".u28l-out"));
        function adjustDropdown() {
            var a = $(".u28w1").outerHeight()
              , b = $(".u28w2").offset()
              , c = $(".u28s2").position()
              , d = $(".u28s2").outerWidth()
              , f = $(".u28w3").outerWidth()
              , g = window.innerHeight
              , h = window.innerWidth;
            e = h <= 974;
            var i = $(".u28prof")
              , k = i.outerWidth()
              , l = h - (i.offset().left + k)
              , n = new MutationObserver(function(a) {
                a.forEach(function(a) {
                    e && (a.target.classList.contains("u28navactive") || a.target.classList.contains("dropdownactive") || a.target.classList.contains("profactive") ? $("body").addClass("u28disable-scroll") : $("body").removeClass("u28disable-scroll"))
                })
            }
            )
              , o = document.getElementById("u28");
            n.observe(o, {
                attributes: !0
            });
            l + k <= m.outerWidth() - 10 && m.addClass("right");
            l + k > m.outerWidth() - 10 && m.removeClass("right");
            if (!e)
                if ($("body").is(".f11")) {
                    j.css("width", d).css({
                        left: c.left + "px"
                    });
                    $(".u28w2 ul.u28suggest li a, .u28w2 ul.u28suggest li cite").each(function() {
                        $(this).css({
                            "margin-left": c.left + "px",
                            "max-width": d + "px"
                        })
                    })
                } else {
                    j.css("width", d).css({
                        left: b.left + "px"
                    });
                    $(".u28w2 ul.u28suggest li a, .u28w2 ul.u28suggest li cite").each(function() {
                        $(this).css({
                            "margin-left": b.left + "px",
                            "max-width": d + "px"
                        })
                    })
                }
            a + Math.max.apply(null, $(".u28navw1>ul").map(function() {
                return this.clientHeight
            })) + 88 >= g ? $(".u28nav").addClass("u28shortnav") : $(".u28nav").removeClass("u28shortnav")
        }
        function showsuggest() {
            setTimeout(function() {
                $(".u28suggest").addClass("active");
                j.removeClass("hidden")
            }, 300);
            $(".u28navactive .u28nav").removeClass("u28fadeIn");
            d.removeClass("u28navactive");
            "0" != g.css("opacity") && "hidden" != g.css("visibility") || g.css("opacity", 0).css("visibility", "visible").delay(300).animate({
                opacity: 1
            }, 300)
        }
        $(window).resize(function() {
            adjustDropdown()
        });
        $(window).on("orientationchange", function(a) {
            adjustDropdown()
        });
        setTimeout(function() {
            $(window).scroll(function(a) {
                v = !0;
                $(document).scrollTop() <= 1 && d.hasClass("u28-past") && d.removeClass("u28-down u28-up u28-past").addClass("u28-top")
            });
            setInterval(function() {
                if (v) {
                    u28hasScrolled();
                    v = !1
                }
            }, 50);
            d.addClass("dropdownloaded")
        }, 200);
        Autocomplete = {
            init: function(a) {
                inputField = a.inputField;
                lastComplete = null
            },
            clearTypeAhead: function(a) {},
            onload: function() {
                Autocomplete.init({
                    inputField: $("#askoracleinput")
                });
                inputField.on("input", function() {
                    if (this.value.length > 0) {
                        $(".u28placeholder").addClass("u28hidden");
                        $(".u28w3").addClass("u28typing")
                    }
                });
                inputField.keydown(function(a) {
                    var b = a.keyCode
                      , c = $(".u28suggest li");
                    if (40 === b || 9 === b && 0 == a.shiftKey) {
                        if ($(".u28suggest").hasClass("active")) {
                            if (n) {
                                n.attr("aria-selected", "false");
                                next = n.next();
                                n = next.length > 0 ? next.attr("aria-selected", "true") : c.eq(0).attr("aria-selected", "true")
                            } else {
                                n = $(".u28suggest li[aria-selected!='true']").eq(0).attr("aria-selected", "true");
                                n.siblings().attr("aria-selected", "false")
                            }
                            if (n) {
                                var d = n.find("a").text();
                                g.val(d)
                            }
                            return !1
                        }
                    } else if (38 === b || a.shiftKey && 9 === b) {
                        if (n) {
                            n.attr("aria-selected", "false");
                            next = n.prev();
                            n = next.length > 0 ? next.attr("aria-selected", "true") : c.last().attr("aria-selected", "true")
                        } else
                            n = c.last().attr("aria-selected", "true");
                        if (n) {
                            var d = n.find("a").text();
                            g.val(d)
                        }
                        return !1
                    }
                });
                inputField.keyup(u28delay(function(b) {
                    var c = this.value
                      , d = b.keyCode
                      , e = this.value.length
                      , f = !1
                      , h = $(".u28suggest li")
                      , i = "";
                    if (a)
                        var k = "" + this.value
                          , l = "" + this.value + "*";
                    else
                        var k = "/search/askoraclesuggest/json?Ntx=all&Ntt=" + this.value
                          , l = "" + this.value + "*";
                    if (8 == d || 46 == d)
                        return !1;
                    if (13 == d) {
                        $(".u28suggestlnk").each(function() {
                            if ("true" == $(this).parent().attr("aria-selected") && $(".u28suggest").is(":visible")) {
                                closedropdown();
                                $(".u28suggest").hide();
                                var a = $(this).attr("href");
                                window.location = a;
                                return !1
                            }
                        });
                        z();
                        $(".u28suggest").removeClass("active");
                        return !1
                    }
                    if (40 === d || 9 === d)
                        return !1;
                    if (38 === d)
                        return !1;
                    if (39 === d || 9 === d) {
                        9 === d && b.preventDefault();
                        if (lastComplete) {
                            Autocomplete.clearTypeAhead();
                            inputField.val(lastComplete)
                        }
                    }
                    if (0 === e || "" === inputField.val()) {
                        Autocomplete.clearTypeAhead("u28typeahead");
                        $(".u28w3").removeClass("u28typing")
                    }
                    e > 0 && addInputFocus();
                    if (e > 2 && !j.hasClass("loading")) {
                        var m = !1
                          , n = !1
                          , o = jQuery.ajax({
                            dataType: "json",
                            url: k,
                            async: !0,
                            error: function() {
                                console.log("Autosuggest fail")
                            }
                        })
                          , p = jQuery.ajax({
                            dataType: "json",
                            url: l,
                            async: !0,
                            error: function() {
                                console.log("Autocomplete fail")
                            }
                        });
                        jQuery.when(o, p).then(function(a, b) {
                            $(".u28suggest").html("");
                            if (a[0].contents[0].numResults > 0) {
                                jQuery.each(a[0].contents[0].records, function(a, b) {
                                    if (a <= 2) {
                                        var d = b.attributes.Title
                                          , e = b.attributes.aoDestinationURL
                                          , f = b.attributes.aoDestinationType
                                          , g = "u28-globe"
                                          , h = d.toString()
                                          , i = h.replace(new RegExp(c,"gi"), function(a) {
                                            return "<b>".concat(a, "</b>")
                                        });
                                        if (f) {
                                            if ("Video" === f[0])
                                                var g = "icn-video";
                                            if ("Coversation" === f[0])
                                                var g = "icn-chat"
                                        }
                                        $(".u28suggest").append('<li aria-selected="false"><a class="' + g + ' u28suggestlnk" href="' + e + '" data-trackas="header:search:suggestlnk" data-lbl="keyword:' + c + ":suggest:" + d + '">' + i + "</a><cite>" + e + "</cite></li>")
                                    }
                                });
                                var d = !0
                            }
                            if (b[0].contents[0].autoSuggest[0].totalNumResults > 0) {
                                jQuery.each(b[0].contents[0].autoSuggest[0].dimensionSearchGroups[0].dimensionSearchValues, function(a, b) {
                                    var d = new RegExp(c,"gi")
                                      , e = b.label.replace(d, "<b>" + c + "</b>");
                                    $(".u28suggest").append('<li aria-selected="false"><a class="u28-search u28complete" href="#" data-trackas="header:search" data-lbl="keyword:' + c + ":suggest:" + b.label + '">' + e + "</a></li>")
                                });
                                var f = !0
                            }
                            if (d || f) {
                                if ($(".u28suggest li:first a").length > 0) {
                                    var h = $(".u28suggest li:first")
                                      , i = $(".u28suggest li:first a").text();
                                    if (0 === i.indexOf(c)) {
                                        var j = i
                                          , k = j;
                                        if (null === j)
                                            Autocomplete.clearTypeAhead("u28typeahead");
                                        else {
                                            $(".u28suggest li a").each(function() {
                                                c === $(this).text() && ($(this).hasClass("u28suggestlnk") || $(this).parent().remove())
                                            });
                                            $('<li aria-selected="false"><a class="u28-search u28complete" href="#">' + c + "</a></li>").insertAfter(h);
                                            var l = j.substr(0, e)
                                              , m = j.substr(e)
                                              , n = document.getElementById("askoracleinput")
                                              , o = e + m.length;
                                            g.val(l + m);
                                            n.focus();
                                            n.setSelectionRange(e, o);
                                            h.attr("aria-selected", "true");
                                            setTimeout(function() {
                                                adjustDropdown()
                                            }, 100)
                                        }
                                    } else {
                                        Autocomplete.clearTypeAhead("u28typeahead");
                                        h.attr("aria-selected", "false");
                                        $(".u28suggest").prepend('<li aria-selected="true"><a class="u28-search u28complete" href="#">' + c + "</a></li>")
                                    }
                                    adjustDropdown();
                                    opendropdown()
                                }
                            } else {
                                $(".u28suggest").append('<li aria-selected="true"><a class="u28-search u28complete" href="#">' + c + "</a></li>");
                                adjustDropdown();
                                opendropdown()
                            }
                            showsuggest()
                        })
                    }
                }, 600))
            }
        };
        $(Autocomplete.onload)
    }
});
!function backDection(a) {
    var $ = a
      , b = "undefined" != typeof window && window
      , c = {
        frameLoaded: 0,
        frameTry: 0,
        frameTime: 0,
        frameDetect: null,
        frameSrc: null,
        frameCallBack: null,
        frameThis: null,
        frameNavigator: window.navigator.userAgent,
        frameDelay: 0,
        frameDataSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
    };
    $.fn.backDetect = function detectBackClick(a, b) {
        c.frameThis = this;
        c.frameCallBack = a;
        null !== b && (c.frameDelay = b);
        c.frameNavigator.indexOf("MSIE ") > -1 || c.frameNavigator.indexOf("Trident") > -1 ? setTimeout(function loadFrameIE() {
            $('<iframe src="' + c.frameDataSrc + '?loading" style="display:none;" id="backDetectFrame" onload="jQuery.fn.frameInit();""></iframe>').appendTo(c.frameThis)
        }, c.frameDelay) : setTimeout(function loadFrame() {
            $("<iframe src='about:blank?loading' style='display:none;' id='backDetectFrame' onload='jQuery.fn.frameInit();'></iframe>").appendTo(c.frameThis)
        }, c.frameDelay)
    }
    ;
    $.fn.frameInit = function initFrame() {
        c.frameDetect = document.getElementById("backDetectFrame");
        c.frameLoaded > 1 && 2 === c.frameLoaded && c.frameCallBack.call(this);
        c.frameLoaded += 1;
        1 === c.frameLoaded && (c.frameTime = setTimeout(function beginFrameSetup() {
            a.fn.setupFrames()
        }, 500))
    }
    ;
    $.fn.setupFrames = function frameSetup() {
        clearTimeout(c.frameTime);
        c.frameSrc = c.frameDetect.src;
        1 === c.frameLoaded && -1 === c.frameSrc.indexOf("historyLoaded") && (c.frameNavigator.indexOf("MSIE ") > -1 || c.frameNavigator.indexOf("Trident") > -1 ? c.frameDetect.src = c.frameDataSrc + "?historyLoaded" : c.frameDetect.src = "about:blank?historyLoaded")
    }
}(jQuery);

/*! U10 */
jQuery(document).ready(function($) {
    if ($(".u10")[0] || $("#u10")[0]) {
        var a;
        $("#u10cmenu a").first().attr("href") && (a = $("#u10cmenu a").first().attr("href"));
        $('[id="u10"]').addClass("u10").not(".u10v0").removeAttr("id");
        $(".u10w3").append('<div class="u10btn"></div>');
        $("ul.u10-links li").last().addClass("u10last");
        $(".u10w6.icn-googleplus").closest(".u10w2").remove();
        $("#teconsent > a").removeAttr("role");
        $(".u10").on("click", ".u10w3 h5, .u10btn", function() {
            var a = $(this).parents("div.u10w3")
              , b = $("div.u10active");
            a.toggleClass("u10active");
            b.not(a).removeClass("u10active")
        });
        window.frameElement && $(document).find(".u10 a").attr("target", "_top");
        $(".scl-icons a").text(" ");
        $(".u10w3 .u10btn").replaceWith('<a class="u10btn"></a>');
        $(".u10w3").on("click keydown", ".u10btn", function(a) {
            a.preventDefault()
        });
        var b = $(".u10-links li:first-child").clone().addClass("last");
        $(".u10-links li:nth-child(3)").after('<li class="u10break"></li>');
        $(".u10last").after(b);
        $(".u10last").after('<li class="u10break"></li>');
        a && getCountryData(a);
        $("body #u10cmenu").on("click", function(a) {
            $("body").removeClass("u10hide");
            if ($(window).width() < 770) {
                if (!$(".u10modal").length) {
                    var b = $("#u10cmenu").clone(!0);
                    b.find(".u10pttl-li").append('<div class="closeModal"></div>');
                    $("body").addClass("noScroll").append('<div class="u10modal show"></div>');
                    void 0 == menuData ? $(".u10modal").html(b) : $(".u10modal").html(menuData);
                    $(".u10modal #u10cmenu").addClass("u10opened mobile")
                }
            } else if ($(".u10.u10v6 #u10countrymenu").length) {
                if (!a.target.classList.contains("u10clink")) {
                    $(this).addClass("u10opened");
                    "u10ticon" !== a.target.classList[0] && a.target.href && (window.location = a.target.href)
                }
            } else {
                var c = "u10cmenu-l1"
                  , d = "u10currentcr"
                  , e = "u10cmenu-l2";
                $(".u10.u10v6 #u10cmenu").html(menuData).addClass("u10opened");
                var f = $(".u10").find(oracleDataMenu.classSelector([c, [d, e]]));
                f.equalHeight(!0)
            }
            menuData = $(this)
        });
        $("body").on("click", "a.u10ticon", function(a) {
            a.preventDefault();
            a.stopImmediatePropagation()
        })
    }
}, !0);
function asyncrWait() {
    var a = $.Deferred();
    setTimeout(function() {
        a.resolve("generating async wait")
    }, 0);
    return a.promise()
}
function loadGlobalVar() {
    var a = $.Deferred();
    "" !== GLOBAL_COUNTRY_HTML && a.resolve("loaded country data");
    return a.promise()
}
function getCountryData(a) {
    var b = "u10clink"
      , c = jQuery.Deferred();
    c.promise().then(asyncrWait).then(oracleDataMenu.fetchMenuContent(a).then(function(a) {
        buildCountryMenu(a.replace(/<([^h\/>]*)h5/g, '<a class="u10clink"').replace(/<\/h5>/g, "</a>").replace(/u02/g, "u10"))
    }));
    c.resolve()
}
function buildCountryMenu(a) {
    var b = "u10regn"
      , c = "u10countrymenu"
      , d = "u10cmenu-l1"
      , e = "u10cmenu-l2"
      , f = "u10ticon"
      , g = "u10clink"
      , h = "u10currentcr"
      , i = "u10currentcc"
      , j = "u10currentdr"
      , k = "u10toolpop"
      , l = "uu10ooverride"
      , m = "u10v6"
      , n = "u10menupop"
      , o = "selected-region"
      , p = !1
      , q = function(a) {
        var b = $("body").find(oracleDataMenu.classSelector([d, [h, e]]))
          , f = $("body").find(oracleDataMenu.classSelector("u10menupop")).width() > 340 || !!a;
        clearTimeout($("body").find(oracleDataMenu.classSelector(c)).data("cmenuTimeout"));
        return $("body").find(oracleDataMenu.classSelector([d, e], '[style*="height"]')).css("height", "") && f && b.equalHeight(!0) || 1
    }
      , r = function() {
        var a = $(oracleDataMenu.classSelector("u10menupop", " a:not(.u10clink):not(.u10blink)"))
          , b = $('meta[name="siteid"]').attr("content")
          , c = "data-currentcc";
        return void 0 === PDITLocaleMap || null == b || PDITLocaleMap.init().then(function(f) {
            var g = a.attr(c, function() {
                var a = 0;
                a += +(this.textContent === f[b].englishcountryname);
                a += +(this.textContent === f[b].countryname);
                a += +(0 === this.textContent.localeCompare(f[b].countryname));
                a += +new RegExp("/" + b + "/","i").test(this.href);
                return a
            }).filter(function() {
                return +$(this).attr(c) > 0
            }).sort(function(a, b) {
                var d = +$(a).attr(c)
                  , e = +$(b).attr(c);
                return d > e ? -1 : d < e ? 1 : 0
            }).eq(0);
            return a.removeAttr(c) && g.length && $(oracleDataMenu.classSelector("u10menupop")).find(oracleDataMenu.classSelector([h, j, i])).removeClass(oracleDataMenu.classList([h, j, i])) && g.addClass(i).closest(oracleDataMenu.classSelector([e])).addClass(o).closest(oracleDataMenu.classSelector([d], "> li")).addClass(oracleDataMenu.classList([h, j])) && q(!0)
        })
    };
    addAriaTree = function() {
        var a = $(".u10").find(oracleDataMenu.classSelector(b)).find("span");
        $(".u10").find(oracleDataMenu.classSelector(c)).attr("role", "tree");
        $(".u10").find(oracleDataMenu.classSelector(g)).attr({
            role: "treeitem",
            "aria-selected": "false",
            "aria-expanded": "false",
            "aria-labelledby": a.text()
        });
        $(".u10").find(oracleDataMenu.classSelector(h, "> a")).attr({
            role: "treeitem",
            "aria-selected": "true",
            "aria-expanded": "true",
            "aria-labelledby": a.text()
        });
        $(".u10").find(oracleDataMenu.classSelector(e)).find("a").attr("role", "treeitem")
    }
    ;
    if ($(".u10").hasClass("u10v6")) {
        var s = $(".u10").find(oracleDataMenu.classSelector(b)), t = s.length && s.attr("href"), u = $(".u10").find("#u10cmenu"), v = oracleDataMenu.createElement("div", ["u10menupop", k]), w, x;
        w = t && t.split("#")[1] || c;
        x = $("#" + w, a);
        x.find(oracleDataMenu.classSelector(c, " > ul")).prepend(oracleDataMenu.createElement("li", "u10pttl-li").html(oracleDataMenu.createElement("h5", "u10pttl").text(u.find(oracleDataMenu.classSelector(f)).text())));
        x.find(oracleDataMenu.classSelector(h)).addClass(j);
        u.append(!u.find(oracleDataMenu.classSelector(k)).length && v).find(oracleDataMenu.classSelector("u10menupop")).html(x).end().find("h5.u10pttl, .u10ticon > span").text(function(a, b) {
            return x.data("toollabel") || b
        });
        u.find(oracleDataMenu.classSelector("u10menupop", " .u10cmenu-simple")).length ? u.find(oracleDataMenu.classSelector("u10menupop")).addClass("u10menupop-simple") : u.find(oracleDataMenu.classSelector("u10menupop")).removeClass("u10menupop-simple");
        u.find(oracleDataMenu.classSelector(b)).attr("href", "#" + w).addClass(function() {
            return l
        });
        q(!0);
        r();
        $(".u10currentcc").closest(".u10cmenu-l2").addClass("selected-region");
        addAriaTree();
        $("body").on("click", ".u10.u10v6 .u10clink", function(a) {
            var b = $(this);
            $(".u10").find(oracleDataMenu.classSelector(h)).removeClass(h);
            b.closest("li").addClass(h);
            addAriaTree();
            q(!0);
            $(".u10cmenu-l2").removeClass("selected-region");
            b.next(".u10cmenu-l2").addClass("selected-region")
        });
        $("body").on("touchend click", ".u10modal .u10clink", function(a) {
            a.stopPropagation();
            a.preventDefault();
            var b = $(this);
            $(".u10modal").find(oracleDataMenu.classSelector(g)).not(b).each(function() {
                $(this).closest("li").removeClass(h)
            });
            b.closest("li").toggleClass(h);
            $(".u10modal .u10cmenu-l2").removeClass("selected-region");
            b.next(".u10modal .u10cmenu-l2").addClass("selected-region")
        });
        $("body").on("click", ".u10modal .closeModal", function(a) {
            a.preventDefault();
            $("body").removeClass("noScroll");
            menuData = $(".u10modal #u10cmenu").clone(!0).addClass("u10opened");
            $(".u10modal").remove();
            $(".u10.u10v6 #u10cmenu").removeClass("u10opened")
        })
    }
    jQuery(function() {
        var a;
        $(window).on("resize", function() {
            clearTimeout(a);
            a = setTimeout(function() {
                $(window).trigger("resize-end")
            }, 200)
        })
    });
    jQuery(window).on("resize-end", function() {
        if ($(window).width() < 770) {
            if ($("#u10cmenu").hasClass("u10opened") && !$(".u10modal").length) {
                var a = $("#u10cmenu").clone(!0);
                0 == $(".closeModal").length && a.find(".u10pttl-li").append('<div class="closeModal"></div>');
                $("body").addClass("noScroll").append('<div class="u10modal show"></div>');
                $(".u10modal").html(a);
                $(".u10modal #u10cmenu").addClass("u10opened mobile");
                $(".u10.u10v6 #u10cmenu .u10menupop.u10toolpop").empty().removeClass("u10opened")
            }
        } else if ($(".u10modal").length) {
            var b = "u10cmenu-l1"
              , c = "u10currentcr"
              , d = "u10cmenu-l2"
              , e = $(".u10modal #u10cmenu .u10menupop.u10toolpop").clone(!0);
            $("body").removeClass("u10hide");
            $(".u10.u10v6 #u10cmenu .u10menupop.u10toolpop").remove();
            $(".u10.u10v6 #u10cmenu").append(e);
            var f = $(".u10").find(oracleDataMenu.classSelector([b, [c, d]]));
            f.equalHeight(!0);
            $("body").removeClass("noScroll");
            $(".u10modal").empty().remove();
            $("#u10cmenu").addClass("u10opened")
        }
    })
}
jQuery(document).on("mouseup touchend", function(a) {
    jQuery(window).width() > 770 && 0 === jQuery(a.target).closest(".u10.u10v6 #u10cmenu").length && jQuery("body").addClass("u10hide")
});
var menuData;

/*! U24 - ACS */
jQuery(document).ready(function($) {
    var a = document.location.href + "&"
      , b = a.indexOf("activecountry&") > -1;
    a = a.replace(/\&$/, "");
    function exitACS(a, c) {
        b && console.log("ACS:" + a);
        c && "undefined" != typeof s_setAccount && navTrack(s_setAccount()[1], s_setAccount()[2], "active-country-select", a);
        return !1
    }
    var c;
    try {
        c = oracle.truste.api.getConsentDecision();
        c = c.consentDecision > -1 ? c.consentDecision : -1
    } catch (a) {
        c = -1
    }
    -1 == c ? exitACS("truste-failed", !0) : activeCountrySelect();
    function activeCountrySelect() {
        var b = readCookie("ORA_COUNTRYSELECT");
        if ("" !== b && null !== b)
            return exitACS("cookie-exist");
        var d, e, f = !!$('meta[name="siteid"]').attr("content") && $('meta[name="siteid"]').attr("content"), g = !!$('meta[name="countryid"]').attr("content") && $('meta[name="countryid"]').attr("content").toLowerCase(), h = !!$('meta[name="country"]').attr("content") && $('meta[name="country"]').attr("content"), i = !!$('meta[name="Language"]').attr("content") && $('meta[name="Language"]').attr("content"), j = $('link[hreflang="en-US"]')[0] ? ",us" : "", k = $('meta[name="altpages"]').attr("content") ? "," + $('meta[name="altpages"]').attr("content") + j + "," : "";
        if (!(f && g && h && i))
            return exitACS("no-metadata");
        var l = ",at,be,bg,hr,cy,cz,dk,ee,fi,fr,de,gr,hu,ie,it,lt,lv,lu,mt,nl,pl,pt,ro,sk,si,se,se,uk,co,kr,gb,"
          , m = "middleeast-ar,bh-ar,lu,cz,dk,fi,de,ch-de,ae,ke,apac,emea,in,jo,kw,lb,om,qa,it,dz,gh,ma,sn,ar,bz,md,ua,br,ca-en,ca-fr,hk,kh,id,my,pk,ph,sg,kr,nl,no,cn,pl,pt,sa,ye,africa,middleeast,asiasouth,us,np,bg,be,hr,mn,me,ee,py,pe,pr,uy,ve,nz,tw,rs,ch-fr,si,bd,at,ro,sk,za,es,se,tr,bt,bn,la,mv,ng,ec,gt,eg-ar,iq-ar,jo-ar,kw-ar,lb-ar,om-ar,qa-ar,sa-ar,ae-ar,ye-ar,il-en,hn,mx,ni,pa,ie,lt,lv,mt,gr,fr,hu,il,jp,lad,be-fr,be-nl,eg,iq,ba,uk,cy,bo,cl,co,cr,lk,th,vn,ru,au";
        if ($(".hp10")[0] || a.indexOf("/corporate/contact/index") > -1) {
            k = m.replace(/,emea/, "");
            k = "," + k + ","
        }
        if ("" == k)
            return exitACS("no-altpages");
        var n = function() {
            var b = a.split("://")[1].replace(/^[^\/]+/, "");
            jQuery.each(m.split(","), function() {
                if (0 == b.indexOf("/" + this + "/")) {
                    b = b.replace(new RegExp("^/" + this + "/","g"), "/");
                    return !1
                }
            });
            return b
        }();
        if (a.indexOf("activecountryid=") > 0)
            d = a.split("activecountryid=")[1].split("&")[0];
        else {
            function getViCountryId(a) {
                var b = $.ajax({
                    type: "GET",
                    url: a,
                    dataType: "json",
                    global: !1,
                    async: !1,
                    success: function(a) {
                        return a
                    },
                    error: function() {
                        return !1
                    }
                }).responseText;
                return (!b || b.indexOf("<") < 0) && JSON.parse(b)
            }
            var o = a.indexOf("www-sites") > -1 || a.indexOf("developer.oracle.com") > -1 ? "" : "/visitorinfo/"
              , p = getViCountryId(o);
            if (p.country_code && 0 == c && l.indexOf("," + p.country_code.toLowerCase() + ",") > -1)
                return exitACS("truste-implied-failed");
            if (!p.country_code) {
                createCookie("ORA_COUNTRYSELECT", "true", .04);
                return exitACS("visitorinfo-failed", !0)
            }
            d = p.country_code.toLowerCase()
        }
        if (d == g) {
            createCookie("ORA_COUNTRYSELECT", "true", .04);
            return exitACS("user-is-local")
        }
        var q = !1, r = [], s, t = "";
        a.indexOf("/www-sites-stage") > -1 || a.indexOf("/www-stage") > -1 ? t = "" : (a.indexOf("localhost") > -1 || a.indexOf("/webstandards") > -1) && (t = "/pdit-locale-map.json");
        function getpditlocal() {
            var a = $.ajax({
                url: t,
                method: "GET",
                dataType: "json",
                async: !1,
                crossDomain: !0,
                cache: !0,
                contentType: "text/plain; charset=UTF-8",
                success: function(a) {
                    s = a;
                    $.each(a, function(a, b) {
                        r[b.siteid] = [b.countrycode, b.countryname, b.englishcountryname];
                        b.countrycode.toLowerCase() == d && (e = b.siteid)
                    });
                    e = "default" == e ? "us" : e;
                    k.indexOf("," + e + ",") < 0 && (q = "no-localpage-available")
                }
            }).fail(function(a) {
                q = "pditlocalemap-failed"
            })
        }
        getpditlocal();
        if (q) {
            if (q.indexOf("pdit") > -1) {
                createCookie("ORA_COUNTRYSELECT", "true", .04);
                return exitACS(q, !0)
            }
            return exitACS(q)
        }
        var u = !1
          , v = ""
          , w = ""
          , x = ""
          , y = ""
          , z = ""
          , A = a.indexOf("betamode=webstandards") > -1 ? "" : "";
        function translationCheck() {
            $.ajax({
                url: A,
                type: "GET",
                dataType: "json",
                crossDomain: !0,
                cache: !0,
                contentType: "text/plain; charset=UTF-8",
                async: !1
            }).done(function(a) {
                var b = a;
                $.each(b.languages, function(a, b) {
                    $.each(b, function(a, b) {
                        if (f == b[0].site_id && i == a) {
                            v = b[0].visit;
                            w = b[0].seepage;
                            x = b[0].nothanks;
                            y = b[0].question;
                            z = b[0].country
                        }
                        if (!b[0].site_id && i == a && "" == v) {
                            v = b[0].visit;
                            w = b[0].seepage;
                            x = b[0].nothanks;
                            y = b[0].question;
                            z = b[0].country
                        }
                    })
                });
                "" == v && $.each(b.languages, function(a, b) {
                    $.each(b, function(a, b) {
                        if ("en" == a) {
                            v = b[0].visit;
                            w = b[0].seepage;
                            x = b[0].nothanks;
                            y = b[0].question;
                            z = b[0].country
                        }
                    })
                })
            }).fail(function() {
                u = "translation-json-failed"
            })
        }
        translationCheck();
        if (u)
            return exitACS(u, !0);
        if ("" == v)
            return exitACS("no-translation-found");
        var B = "";
        $("body").prepend($("<div/>").addClass("u24 u24v0 darktheme").attr("data-trackas", "active-country-select"));
        if ($(".f20")[0])
            $(".u24").prepend($("<div/>").addClass("u24w1 rw-globe"));
        else {
            B = "icn-none";
            $(".u24").prepend($("<div/>").addClass("u24w1 icn-globe"))
        }
        $(".u24w1").prepend($("<div/>").addClass("u24w2"));
        $(".u24w2").prepend($("<div/>").addClass("u24w4wrap"));
        $(".u24w4wrap").prepend('<div class="u24w5"></div>');
        $(".u24w4wrap").prepend('<div class="u24w4 icn-cv-down">' + w + "</div>");
        $(".u24w4").prepend("<i></i>");
        $(".u24w2").prepend($("<div/>").addClass("obttns u24stay"));
        $(".u24 .u24stay").prepend($("<div/>").addClass("obttn5 u24nothanks"));
        $(".u24").append('<a href="#" data-lbl="close" class="u24close u24closebtn icn-close"></a>');
        $(".u24w5").append('<div class="u24w6"></div>');
        $(".u24w2").prepend($("<strong>" + y + "</strong>"));
        $(".u24w2 strong").after($("<div/>").addClass("obttns u24visit"));
        $(".u24visit").prepend($("<div/>").addClass("obttn1"));
        $(".u24 .obttn1").prepend('<div class="u24w3"><i></i></div>');
        $(".u24w3").prepend($("<ul/>"));
        $(".u24 .u24nothanks").prepend('<a data-lbl="u24nothanks" href="#close" class="u24close thankstrans ' + B + '">' + x + "</a>");
        $(".u24w6").prepend('<span class="u24w6Title">' + z + "</span>");
        var C = 0;
        $.each(s, function(a, b) {
            if (r[b.siteid][0].toLowerCase() != d || "default" == b.siteid)
                ;
            else {
                C++;
                if (C > 1) {
                    $(".u24btnlnk").remove();
                    $(".u24 .u24visit").addClass("u24addlang")
                }
                var c = "us" == b.siteid ? "" : "/" + b.siteid;
                $(".u24 .obttn1").prepend($("<a/>").addClass("u24btnlnk icn-cv-down").attr("data-lbl", "suggested-" + b.siteid).attr("href", c + n).text(v + " " + b.countryname));
                var e = b.siteid.substr(b.siteid.indexOf("-") + 1);
                "en" === e && $(".u24w3 ul").prepend('<li><a href="/' + b.siteid + n + '">' + b.countryname + " - English</a></li>");
                "fr" === e && $(".u24w3 ul").prepend('<li><a href="/' + b.siteid + n + '">' + b.countryname + " - Français</a></li>");
                "de" === e && $(".u24w3 ul").prepend('<li><a href="/' + b.siteid + n + '">' + b.countryname + " - German</a></li>");
                "nl" === e && $(".u24w3 ul").prepend('<li><a href="/' + b.siteid + n + '">' + b.countryname + " - Dutch</a></li>");
                if ("ar" === e) {
                    $(".u24w3 ul").prepend($('<li><a href="/' + b.siteid + n + ">" + b.countryname + "</a></li>"));
                    $(".u24 .u24visit").removeClass("u24addlang");
                    $(".u24w3").remove()
                }
                if ("middleeast" === b.siteid) {
                    $(".u24 .u24visit").removeClass("u24addlang");
                    $(".u24w3").remove()
                }
                if ("cn" === b.siteid) {
                    $(".u24 .u24visit").removeClass("u24addlang");
                    $(".u24w3").remove()
                }
            }
        });
        var D = [["americas", "Americas", ["ar", "bz", "bo", "br", "ca-en", "ca-fr", "cl", "co", "cr", "ec", "gt", "hn", "lad", "mx", "ni", "pa", "py", "pe", "pr", "us", "uy", "ve"]], ["asia", "Asia", ["apac", "asiasouth", "au", "bd", "bt", "bn", "kh", "cn", "hk", "in", "id", "jp", "kr", "la", "my", "mv", "mn", "np", "nz", "pk", "ph", "sg", "lk", "tw", "th", "vn"]], ["europe", "Europe", ["emea", "at", "be", "be-fr", "be-nl", "ba", "bg", "hr", "cy", "cz", "dk", "ee", "fi", "fr", "de", "gr", "hu", "ie", "it", "lv", "lt", "lu", "mt", "md", "me", "nl", "no", "pl", "pt", "ro", "ru", "rs", "sk", "si", "es", "se", "ch-fr", "ch-de", "tr", "ua", "uk"]], ["middleeast", "Middle East and Africa", ["africa", "dz", "bh-ar", "eg", "eg-ar", "gh", "il-en", "il", "iq", "iq-ar", "jo", "jo-ar", "ke", "kw", "kw-ar", "lb", "lb-ar", "middleeast", "middleeast-ar", "ma", "ng", "om", "om-ar", "qa", "qa-ar", "sa", "sa-ar", "sn", "za", "ae", "ae-ar", "ye", "ye-ar"]]];
        $.each(D, function(a, b) {
            var c = ""
              , d = "u24-l2visible"
              , e = "u24regioncr";
            $.each(b[2], function(a, b) {
                if (k.indexOf("," + b + ",") > -1) {
                    var d = b.indexOf("-") > -1 ? getNameWithLang(b) : r[b][1];
                    c += d || "us" !== b ? '<li><a href="/' + b + n + '">' + d + "</a></li>\n" : '<li><a href="' + n + '">United States</a></li>\n'
                }
            });
            if ("" != c) {
                if ($(".u24w6 ul")[0]) {
                    d = "";
                    e = ""
                }
                $(".u24w6").append('<a href="#" class="u24region ' + b[0] + " " + e + '">' + b[1] + '</a><ul class="' + b[0] + "-l2 u24-l2 " + d + '"><li class="l2Title">' + b[1] + "</li>" + c + "</ul>")
            }
        });
        function getNameWithLang(a) {
            "ca" == a.split("-")[0] && "en" == a.split("-")[1] ? lang = " - English" : "ca" == a.split("-")[0] && "fr" == a.split("-")[1] ? lang = " - Français" : lang = "";
            return r[a][1] + lang
        }
        $(function($) {
            var a = 2
              , b = $(".u24-l2")
              , c = "li"
              , d = "u24-l2sub";
            b.each(function() {
                for (var a = new Array, b = $(this).find("li"), c = Math.floor(b.length / 2), e = b.length - 2 * c, f = 0; f < 2; f++)
                    a[f] = f < e ? c + 1 : c;
                for (var f = 0; f < 2; f++) {
                    $(this).append($("<ul ></ul>").addClass(d));
                    for (var g = 0; g < a[f]; g++) {
                        for (var h = 0, i = 0; i < f; i++)
                            h += a[i];
                        $(this).find(".u24-l2sub").last().append(b[g + h])
                    }
                }
            })
        });
        setTimeout(function() {
            $("body").addClass("u24show");
            "undefined" != typeof s_setAccount && navTrack(s_setAccount()[1], s_setAccount()[2], "active-country-select", "acs-loaded")
        }, 2e3);
        $(document).on("click", "a.u24region", function(a) {
            $(".u24region").removeClass("u24regioncr");
            $(".u24-l2visible").removeClass("u24-l2visible");
            $(this).addClass("u24regioncr").next("ul").addClass("u24-l2visible");
            return !1
        });
        $(document).on("mouseenter", ".u24addlang", function() {
            $(".u24w3").addClass("u24w3open")
        });
        $(document).on("mouseleave", ".u24addlang", function() {
            $(".u24w3").removeClass("u24w3open")
        });
        $(document).on("click touchstart", ".u24w2 .u24addlang a.u24w3open", function() {
            $(".u24w3").addClass("u24w3open");
            return !1
        });
        $(document).on("focus", ".u24w2 .u24addlang a", function() {
            $(".u24w3").addClass("u24w3open")
        });
        $(document).on("blur", ".u24w2 .u24addlang a", function() {
            $(".u24w3").removeClass("u24w3open")
        });
        $(document).on("click touchstart", ".l2Title", function() {
            $(".u24-l2visible").removeClass("u24-l2visible");
            $(".u24region").removeClass("u24regioncr");
            return !1
        });
        $(document).on("mouseenter", ".u24w4wrap", function() {
            $(".u24w5").addClass("u24w5open");
            $(".u24w4").addClass("u24w4open")
        });
        $(document).on("mouseleave", ".u24w5.u24w5open,.u24w4wrap", function() {
            $(".u24w5").removeClass("u24w5open");
            $(".u24w4").removeClass("u24w4open")
        });
        $(document).on("click touchstart", ".u24w4 a.u24w3open", function() {
            $(".u24w5").addClass("u24w5open");
            $(".u24w4").addClass("u24w4open");
            return !1
        });
        $(document).on("focus", ".u24w4 a", function() {
            $(".u24w5").addClass("u24w5open");
            $(".u24w5").addClass("u24w4open")
        });
        $(document).keyup(function(a) {
            if (27 === a.keyCode && $("body").hasClass("u24show")) {
                $(".u24closebtn").click();
                a.preventDefault()
            }
        });
        $(document).on("click", ".u24close", function(a) {
            $("body").removeClass("u24show");
            createCookie("ORA_COUNTRYSELECT", "true", 1);
            a.preventDefault()
        });
        $(document).on("click", ".u24addlang a.u24btnlnk", function(a) {
            a.preventDefault()
        });
        $(document).on("click", "a.u24btnlnk", function(a) {
            $(this).closest(".u24addlang")[0] || createCookie("ORA_COUNTRYSELECT", "true", 1)
        });
        $(document).on("click", ".u24w3 a,ul.u24-l2sub a", function(a) {
            createCookie("ORA_COUNTRYSELECT", "true", 1)
        })
    }
});
function createCookie(a, b, c) {
    if (c) {
        var d = new Date;
        d.setTime(d.getTime() + 24 * c * 60 * 60 * 1e3);
        var e = "; expires=" + d.toGMTString()
    } else
        var e = "";
    document.cookie = a + "=" + b + e + "; path=/"
}
function readCookie(a) {
    for (var b = a + "=", c = document.cookie.split(";"), d = 0; d < c.length; d++) {
        for (var e = c[d]; " " == e.charAt(0); )
            e = e.substring(1, e.length);
        if (0 == e.indexOf(b))
            return e.substring(b.length, e.length)
    }
    return null
}
function eraseCookie(a) {
    createCookie(a, "", -1)
}

/*! RH02 */
$(document).ready(function() {
    "use strict";
    var a = $(".rh02")
      , b = $(".rh02").next()
      , c = a.is("[data-backlbl]") ? a.attr("data-backlbl") : "Back";
    a.find(".rh02w3").append('<a class="rh02back" href="#back">' + c + "</a>");
    a.find(".rh02w1").append('<a class="rh02blurout" href="#close"></a>');
    a.find(".rh02panel").each(function() {
        $(this).find(".rh02w2").first().each(function() {
            $(this).find("button.rh02-pcontent")[0] && $(this).addClass("rh02defpanel")
        })
    });
    a.find(".rh02carousel").each(function() {
        this.swiping = !1;
        this.moved = !1;
        var b = 0
          , c = $('<ul class="rh02nav rh02navloading"></ul>')
          , d = $(this);
        d.find(".rh02w2").each(function() {
            b++;
            $(this).addClass("rh02-slide" + b);
            c.append('<li><a href="#' + b + '" title="View Slide ' + b + '"><b>View Slide ' + b + "</b></a></li>")
        });
        d.append(c);
        setTimeout(function() {
            a.find(".rh02nav").removeClass("rh02navloading")
        }, 600);
        var e = 1;
        d.is(".rh02random") && (e = Math.floor(Math.random() * (d.find(".rh02w2").length - 1 + 1)) + 1);
        d.find(".rh02w2:nth-of-type(" + e + ")").addClass("rh02current");
        d.find(".rh02nav li:nth-of-type(" + e + ") a").addClass("rh02cnav");
        d.addClass("rh02carouselinit");
        d.is("[data-auto]") && setTimeout(function() {
            rh02automove(d, d.attr("data-auto"))
        }, 1e3 * d.attr("data-auto"))
    });
    a.find(".rh02w2[data-bgimg]").each(function() {
        $(this).bgimg()
    });
    $(document).on("swipeleft", ".rh02carousel", function(a) {
        this.swiping = !0;
        this.moved = !0;
        rh02move(!1, $(this), 1)
    });
    $(document).on("swiperight", ".rh02carousel", function(a) {
        this.swiping = !0;
        this.moved = !0;
        rh02move(!1, $(this), -1)
    });
    $(document).on("click", ".rh02nav a", function(a) {
        var b = parseInt($(this).closest(".rh02nav").find(".rh02cnav").first()[0].href.split("#")[1])
          , c = parseInt(this.href.split("#")[1])
          , d = c < b ? -1 : 1;
        if (b != c) {
            rh02move(c, $(this).closest(".rh02carousel"), d);
            $(this).closest(".rh02carousel")[0].moved = !0
        }
        a.preventDefault()
    });
    function rh02automove(a, b) {
        a.is(".rh02pause") || a.is(".rh02open") || a[0].moved ? a[0].moved = !1 : rh02move(!1, a, 1);
        setTimeout(function() {
            rh02automove(a, b)
        }, 1e3 * b)
    }
    function rh02move(a, b, c) {
        b[0].swiping && setTimeout(function() {
            b[0].swiping = !1
        }, 600);
        if (!$(".rh02menuopen")[0]) {
            c < 0 ? b.addClass("rh02carouselback") : b.removeClass("rh02carouselback");
            setTimeout(function() {
                if (!a) {
                    a = parseInt(b.find(".rh02cnav")[0].href.split("#")[1]) + c;
                    a > b.find(".rh02w2").length ? a = 1 : a < 1 && (a = b.find(".rh02w2").length)
                }
                if (a && !b.find(".rh02current.rh02-slide" + a)[0] && !b.is(".rh02moving")) {
                    b.find(".rh02current").addClass("rh02out").removeClass("rh02current");
                    b.find(".rh02-slide" + a).addClass("rh02current");
                    b.addClass("rh02moving");
                    a--;
                    b.find(".rh02cnav").removeClass("rh02cnav");
                    $(b.find(".rh02nav a")[a]).addClass("rh02cnav");
                    setTimeout(function() {
                        b.find(".rh02out").removeClass("rh02out");
                        b.find(".rh02outdef").removeClass("rh02outdef");
                        b.removeClass("rh02moving");
                        b.removeClass("rh02carouselback")
                    }, 600)
                }
            }, 10)
        }
    }
    $(document).on("mouseenter click", "button.rh02-pcontent", function() {
        var a = $(this);
        if (!rh02ismobile() && !a.closest(".rh02panel")[0].swiping) {
            $(".rh02menuopen").removeClass("rh02menuopen");
            $(".rh02open").removeClass("rh02open");
            $("body").addClass("rh02menuopen");
            a.closest(".rh02panel").addClass("rh02open").addClass("rh02opening");
            setTimeout(function() {
                a.closest(".rh02panel").removeClass("rh02opening")
            }, 600)
        }
    });
    $(document).on("focus", ".rh02-pcontent", function() {
        if (!rh02ismobile() && !$(this).closest(".rh02open")[0]) {
            $(".rh02menuopen").removeClass("rh02menuopen");
            $(".rh02open").removeClass("rh02open")
        }
    });
    $(document).on("mouseleave", ".rh02panel", function() {
        if (!rh02ismobile()) {
            $(this)[0].moved = !0;
            $(".rh02menuopen").removeClass("rh02menuopen");
            $(this).removeClass("rh02open")
        }
    });
    $(document).on("focus", ".rh02blurout", function() {
        if ($(".rh02open")[0]) {
            $(".rh02menuopen").removeClass("rh02menuopen");
            $(".rh02open").removeClass("rh02open");
            b.find("a").first().focus()
        }
    });
    $(".rh02-pcontent").keypress(function(a) {
        if (13 == a.which && !$(this).closest(".rh02open")[0]) {
            $(".rh02menuopen").removeClass("rh02menuopen");
            $(".rh02open").removeClass("rh02open");
            $("body").addClass("rh02menuopen");
            $(this).closest(".rh02panel").addClass("rh02open");
            a.preventDefault()
        }
    });
    $(document).on("mouseenter touchstart", ".rh02panel", function() {
        $(this).addClass("rh02pause")
    });
    $(document).on("mouseleave touchend", ".rh02panel", function() {
        $(this).removeClass("rh02pause")
    });
    $(document).on("click", "button.rh02-pcontent", function() {
        if (rh02ismobile() && !$(this).closest(".rh02open")[0] && !$(this).closest(".rh02panel")[0].swiping) {
            $(".rh02menuopen").removeClass("rh02menuopen");
            $(".rh02open").removeClass("rh02open");
            $("body").addClass("rh02menuopen");
            $(this).closest(".rh02panel").addClass("rh02open")
        }
    });
    $(document).on("click", ".rh02back", function(a) {
        if (rh02ismobile()) {
            $(".rh02menuopen").removeClass("rh02menuopen");
            $(this).closest(".rh02panel").removeClass("rh02open");
            a.preventDefault()
        }
    });
    function rh02ismobile() {
        return 0 == parseInt(a.css("margin-top"))
    }
});
$(document).on("click", "a.sharelink", function(a) {
    a.preventDefault();
    var b = window.location.href;
    if ($(this).is("[data-esubject]"))
        if ($(this).attr("data-esubject").indexOf("%PAGETITLE%") > -1)
            var c = document.title
              , d = $(this).attr("data-esubject").replace(/%PAGETITLE%/g, c);
        else
            var d = $(this).attr("data-esubject");
    var e = $(this).attr("data-ebody")
      , f = window.location.protocol + "//"
      , g = window.location.host;
    $(this).is("[data-url]") && 0 == $(this).attr("data-url").indexOf("/") ? b = f + g + $(this).attr("data-url") : $(this).is("[data-url]") && $(this).attr("data-url").indexOf("http") > -1 ? b = $(this).attr("data-url") : $(this).is("[data-url]") && $(this).attr("data-url").indexOf("//") > -1 ? b = f + $(this).attr("data-url") : $(this).is("[data-url]") && 0 != $(this).attr("data-url").indexOf("/") ? b = document.location.href.replace(/\/[^\/]+$/, "") + "/" + $(this).attr("data-url") : $(this).is("[data-url]") && (b = $(this).attr("data-url"));
    var h = 22;
    b = encodeURIComponent(b);
    if ("facebook" == $(this).attr("data-sharetype"))
        window.open("" + b, "fb-share", "height=300,width=400");
    else if ("twitter" == $(this).attr("data-sharetype")) {
        var i = $(this).is("[data-via]") ? $(this).attr("data-via").length + 6 : 0
          , j = $(this).is("[data-via]") ? "&via=" + $(this).attr("data-via") : ""
          , k = "";
        if ($(this).is("[data-text]")) {
            var l = $(this).is("[data-text]") ? $(this).attr("data-text").length + 2 : 0;
            k = 140 - (22 + l + i) < 0 ? "&text=" + $(this).attr("data-text").slice(0, 137 - (22 + l + i)) + "%E2%80%A6 %E2%80%93" : "&text=" + $(this).attr("data-text") + " %E2%80%93"
        }
        window.open("" + b + j + k, "twitter-share", "height=550,width=420")
    } else
        "linkedin" == $(this).attr("data-sharetype") ? window.open("http://www.linkedin.com/shareArticle?url=" + b, "linkedin-share", "height=550,width=420") : "googleplus" == $(this).attr("data-sharetype") ? window.open("" + b, "googleplus-share", "height=620,width=500") : "weibo" == $(this).attr("data-sharetype") ? window.open("http://service.weibo.com/share/share.php?url=" + b, "weibo-share", "height=620,width=900") : "email" == $(this).attr("data-sharetype") && $(this).is("[data-esubject]") && $(this).is("[data-ebody]") ? location.assign("mailto:?subject=" + d + "&body=" + e + "%0A%0A" + b, "email-share") : "email" == $(this).attr("data-sharetype") && $(this).is("[data-ebody]") ? location.assign("mailto:?&body=" + e + "%0A%0A" + b, "email-share") : "email" == $(this).attr("data-sharetype") && $(this).is("[data-esubject]") ? location.assign("mailto:?subject=" + d + "&body=" + b, "email-share") : "email" == $(this).attr("data-sharetype") && location.assign("mailto:?body=" + b, "email-share")
});
$(document).on("click", "a.sharewidget", function(a) {
    a.preventDefault();
    if ($(".shareopen")[0]) {
        $(".shareopen").removeClass("shareopen");
        $(".sharewidgetw2").addClass("shareoc");
        setTimeout(function() {
            $(".shareoc").remove()
        }, 400)
    }
    var b = $(this)
      , c = "facebook,twitter,linkedin,googleplus,email";
    $(this).is("[data-share]") && (c = $(this).attr("data-share").replace(/ /gi, ""));
    var d = ""
      , e = "";
    $(this).is("[data-url]") ? d = ' data-url="' + $(this).attr("data-url") + '"' : 0 !== $(this).attr("href").indexOf("#") && (d = ' data-url="' + $(this).attr("href") + '"');
    var f = "";
    c = c.split(",");
    for (i = 0; i < c.length; ++i) {
        var g = "";
        $(this).is("[data-esubject]") && "email" == c[i] && (g = ' data-esubject="' + $(this).attr("data-esubject") + '"');
        var h = "";
        $(this).is("[data-ebody]") && "email" == c[i] && (h = ' data-ebody="' + $(this).attr("data-ebody") + '"');
        var j = $(this).is("[data-via]") && "twitter" == c[i] ? ' data-via="' + $(this).attr("data-via") + '"' : ""
          , k = $(this).is("[data-text]") && "twitter" == c[i] ? ' data-text="' + $(this).attr("data-text") + '"' : "";
        f += '<a class="sharelink" data-sharetype="' + c[i] + '"' + d + j + k + g + h + '><div class="icn-img icn-sicons icn-' + c[i] + '"><em>' + c[i] + "</em></div></a>"
    }
    if (!b.next(".sharewidgetw2")[0]) {
        $(this).closest(".cmps-bttns")[0] || $(this).closest("div.sharewidget")[0] || $(this).closest("span.sharewidgetw1")[0] || $(this).wrapAll('<span class="sharewidgetw1"></span>');
        $(this).hasClass("rightshare") && $(this).closest(".cmps-share,div.sharewidget,span.sharewidgetw1").addClass("rightshare");
        $(this).hasClass("topshare") && $(this).closest(".cmps-share,div.sharewidget,span.sharewidgetw1").addClass("topshare");
        ($(this).closest(".cmps-bttns")[0] || $(this).closest("div.sharewidget")[0] || $(this).closest("span.sharewidgetw1")[0]) && $(this).closest("div").addClass("shareopen");
        b.after('<div class="sharewidgetw2 shareoc">' + f + "<i></i></div>");
        setTimeout(function() {
            b.next(".shareoc").removeClass("shareoc")
        }, 1)
    }
});
$(document).on("mousedown", function(a) {
    if (!$(a.target).closest(".sharewidgetw2")[0] && !$(a.target).closest(".sharewidget")[0] && $(".shareopen")[0]) {
        $(".shareopen").removeClass("shareopen");
        $(".sharewidgetw2").addClass("shareoc");
        setTimeout(function() {
            $(".shareoc").remove()
        }, 400)
    }
});
$(document).on("click", "a.qrcode", function(a) {
    a.preventDefault();
    if ($(".qropen")[0]) {
        $(".qropen").removeClass("qropen");
        $(".qrcodew2").addClass("qroc");
        setTimeout(function() {
            $(".qroc").remove()
        }, 400)
    }
    var b = $(this)
      , c = $(b).attr("data-qrcode")
      , d = $(this).offset();
    if (!b.next(".qrcodew2")[0]) {
        $(this).closest(".cmps-bttns")[0] || $(this).closest("div.qrcode")[0] || $(this).closest("span.qrcodew1")[0] || $(this).wrapAll('<span class="qrcodew1"></span>');
        ($(this).closest(".cmps-bttns")[0] || $(this).closest("div.qrcode")[0] || $(this).closest("span.qrcodew1")[0]) && $(this).closest("div").addClass("qropen");
        b.after('<div class="qrcodew2 qroc"><img class="" src="' + c + '"></div>');
        setTimeout(function() {
            b.next(".qroc").removeClass("qroc")
        }, 1);
        d.left < 26 && b.next(".qroc").css({
            left: 0,
            right: "auto"
        })
    }
    return !1
});
$(document).on("mousedown", function(a) {
    if (!$(a.target).closest(".qrcodew2")[0] && !$(a.target).closest(".qrcode")[0] && $(".qropen")[0]) {
        $(".qropen").removeClass("qropen");
        $(".qrcodew2").addClass("qroc");
        setTimeout(function() {
            $(".qroc").remove()
        }, 400)
    }
});

/*! W11 - LIGHTBOX */
jQuery(document).ready(function($) {
    "use strict";
    var a = ['a[rel^="lightBox"]', 'a[rel^="LightBox"]', 'a[rel^="lightbox"]', 'a[rel^="Lightbox"]', 'a[rel^="mbox"]', 'a[class^="mbox-simple"]', "[data-lightbox]"], b = "", c = !1, d = !1, e = !1, f = !1, g = "body", h = "body", i = window.location, j = {}, k = null, l = null, m = null, n = "dark", o = "lbdefault", p = "", q = "#fff", r = null, s, t, u, v, w, x, y;
    $(document).on("click", a.join(","), onLinkClicked);
    openLightboxByQueryStr();
    function onLinkClicked(a) {
        var i = $(this), k = this.href, l, m, o;
        a.preventDefault();
        c = !1;
        d = !1;
        e = !1;
        f = !1;
        y = a.currentTarget;
        l = getLightboxType(i) || "iframe";
        m = i.data("width") || .8 * window.innerWidth;
        o = i.data("height") || .8 * window.innerHeight;
        switch (l) {
        case "image":
            e = !0;
            if (k && j[k]) {
                b = j[k];
                loadExternalContent(!0)
            } else {
                b = document.createElement("img");
                b.title = i[0].title;
                b.src = k;
                k && (j[k] = b);
                loadExternalContent()
            }
            break;
        case "ajax":
            c = !0;
            if (k && j[k]) {
                b = j[k];
                loadExternalContent(!0)
            } else
                $.ajax({
                    type: "GET",
                    url: k,
                    dataType: "html text"
                }).done(function(a) {
                    b = $(a).find(u)[0] || $(a).find("body");
                    k && (j[k] = b);
                    loadExternalContent()
                }).fail(function(a) {});
            break;
        case "iframe":
            d = !0;
            v = o / m;
            w = parseInt(m, 10);
            x = parseInt(o, 10);
            if (k && j[k]) {
                b = j[k];
                loadExternalContent()
            } else {
                b = document.createElement("iframe");
                b.title = i[0].title;
                b.setAttribute("frameborder", 0);
                b.setAttribute("allowfullscreen", !0);
                b.setAttribute("allow", "fullscreen");
                b.src = k;
                j[k] = b;
                loadExternalContent()
            }
            break;
        case "inpage":
            b = $(u).html();
            break;
        case "inline":
            b = decodeURI(k.slice(k.indexOf(",") + 1));
            break;
        case "component":
            b = $(t, h).clone();
            break;
        case "gallery":
            f = !0;
            n = "light";
            b = i.closest("[data-zoom]").clone();
            loadExternalContent();
            break;
        default:
            console.error("W11 Lightbox: Content not specified or error finding content.");
            return
        }
        lightbox(b);
        $("> .w11", g).on("click", ".w11close, .w11w3, .w11closelink, .w11closeexit", closew11.bind($("> .w11", g)));
        $(document).on("esckeydown", closew11.bind($("> .w11", g)))
    }
    function openLightboxByQueryStr() {
        var a = getUrlParams()
          , b = a.PF_QS ? $("<a>").attr({
            rel: "lightbox",
            style: "display:none",
            "data-iframe": !0,
            "data-width": 1800,
            "data-height": 800,
            "data-theme": "pathfactory"
        }).appendTo("body") : $("#" + a.lightbox);
        return a.lightbox && b.length && b.attr("href", function() {
            var b = a.PF_QS;
            return b && delete a.PF_QS && (a["lb-mode"] = "overlay") && "" + b + objToQueryParams(a)
        }).trigger("click")
    }
    function getUrlParams() {
        return i.search.slice(1).split("&").reduce(function(a, b) {
            var c = b.split("=");
            c[0] && (a[c[0]] = !c[1] || c[1]);
            return a
        }, {})
    }
    function objToQueryParams(a) {
        return Object.keys(a).reduce(function(b, c) {
            b += b.length > 1 ? "&" : "";
            b += [c, a[c]].join("=");
            return b
        }, "?")
    }
    function getLightboxType(a) {
        var b = a.attr("href"), c = new RegExp(i.origin + i.pathname,"i"), d = "zoom-gallery" === a.data("lbl"), f, j, k, l;
        b = b ? b.replace(c, "") : "";
        if (/^https?:\/\//i.test(b)) {
            l = b.split("//")[1].split("/")[0];
            l == i.origin.split("//")[1] && (k = !0)
        } else
            k = !0;
        f = b.match(/\?(.*?)(?=#|$)/gi);
        u = b.match(/#(.*?)(?=\?|$)/gi);
        e = /(gif|jpe?g|png|svg)$/i.test(b);
        j = /^data:/.test(b);
        u && (u = u.filter(function(a) {
            return /^#[a-z0-9\-_]+$/i.test(a)
        }).shift());
        f && mapQueryToData(f, a);
        n = a.data("theme") || "dark";
        o = a.data("ltbxsize") || "lbdefault";
        p = a.data("ltbxclass") || "";
        t = a.data("content");
        g = a.data("container") || "body";
        h = a.data("context") || "body";
        h = "this" === h ? a : h;
        return a.data("iframe") ? "iframe" : k && u && !$(u)[0] ? "ajax" : e ? "image" : t && $(t, h)[0] ? "component" : d ? "gallery" : u && $(u)[0] ? "inpage" : !!j && "inline"
    }
    function mapQueryToData(a, b) {
        a.forEach(function(a) {
            a.split("&").forEach(function(a) {
                var c = a.replace(/(\?|amp;)/, "").split("=")
                  , d = c[0]
                  , e = c[1];
                b.data(d, e)
            })
        })
    }
    function lightbox(a) {
        var b = '<div class="w11 w11fadein ' + p + '" id="w11" data-theme="' + n + '" data-trackas="lightbox"><div class="w11w1"><div class="w11w2 ' + o + '" style="background-color:' + q + '"><a class="icn-close w11close" href="#close" data-lbl="lightbox-close"><em>Close</em></a><div class="w11w4"><div class="w11w5"><div class="w11w6"></div></div></div></div><div class="w11w3"></div></div></div>';
        if ($(g).find("> .w11")[0]) {
            clearTimeout(l);
            $("> .w11", g).removeClass("w11fadeout");
            $("> .w11 .w11close", g).show()
        } else
            $(g).append(b);
        if (c || d || e || f)
            setTimeout(function() {
                $("> .w11 .w11w3", g).addClass("loading")
            }, 0);
        else {
            $("> .w11 .w11w6", g).html(a);
            setTimeout(lightboxFadeIn, 10)
        }
        if (d) {
            $("> .w11", g).addClass("iframe");
            $("> .w11 .w11w5", g)[0].style.paddingBottom = 100 * v + "%";
            $("> .w11 .w11w5", g)[0].style.setProperty("--iframePadding", 100 * v + "%");
            $("> .w11 .w11w2", g)[0].style.maxWidth = w + "px"
        }
    }
    function loadExternalContent(a) {
        if ($("> .w11 .w11w6", g)[0]) {
            d && $(b).one("load", onExternalContentLoaded);
            $("> .w11 .w11w6", g).html(b);
            e && $("#w11").addClass("w11imgbox");
            if (c || e) {
                "function" != typeof run_setup || a || run_setup(".w11w6", !1, !1);
                "undefined" != typeof OCOM && OCOM.runFoundComponents(".w11w6");
                setTimeout(lightboxFadeIn, 50)
            }
            f && loadGallery()
        } else
            setTimeout(function() {
                loadExternalContent(a)
            }, 50)
    }
    function onExternalContentLoaded(a) {
        var b = $("> .w11 .w11w6 iframe", g), c = $("> .w11 .w11w4", g), e = $("> .w11 .w11w5", g), f, h, i, j, k, l, m, n;
        if (!d)
            return lightboxFadeIn();
        try {
            h = b.contents().find("html");
            if (h[0]) {
                f = $(b[0].contentWindow.document);
                h.addClass("iframecontent");
                i = h.find("body");
                "auto" !== i[0].style.height && (i[0].style.height = "auto");
                e[0].style.setProperty("--iframeWidth", "100%");
                j = window.getComputedStyle(i[0]);
                k = window.getComputedStyle(c[0]);
                m = Math.ceil(parseInt(j.height, 10));
                l = Math.ceil(parseInt(j.width, 10)) + wrapperPadding(c).width;
                n = Math.ceil(parseInt(k.width, 10));
                l > n && e[0].style.setProperty("--iframeWidth", l + "px");
                window.MutationObserver || (m = x > m ? x : m);
                e[0].style.setProperty("--iframeHeight", m + "px");
                e[0].style.setProperty("--iframePadding", 0);
                if (!window.CSS) {
                    e[0].style.minHeight = m + "px";
                    e[0].style.padding = 0
                }
                b[0].setAttribute("scrolling", "no");
                $(window).on("resize", onWindowResized);
                f.on("fullscreenchange mozfullscreenchange webkitfullscreenchange msfullscreenchange", function() {
                    e[0].style.setProperty("--iframeWidth", "100%")
                });
                if (null === r && window.MutationObserver) {
                    registerObserver(i[0]);
                    b.one("load", disconnectObserver.bind(this, onExternalContentLoaded))
                }
            }
        } catch (a) {
            console.error("W11 Lightbox: " + a)
        }
        lightboxFadeIn()
    }
    function loadGallery() {
        var a = b.find('[class*="slider"]')
          , c = b.find('[class*="imgslides"]')
          , d = b.data("imgindex")
          , e = parseInt(c.find("li").css("width"), 10);
        a.animate({
            scrollLeft: d * e
        });
        b.find('[data-lbl="imagethumbs"]').remove();
        b.find(".mbox-simple").remove();
        setTimeout(lightboxFadeIn, 50)
    }
    function lightboxFadeIn() {
        $("> .w11", g).removeClass("w11fadein").trigger("open.lightbox", y);
        $(g).addClass("lightbox-noscroll")
    }
    function closew11(a) {
        var b = this;
        !!$(a.target).hasClass("w11closeexit") || a.preventDefault();
        b.addClass("w11fadeout");
        l = setTimeout(function() {
            b.trigger("close.lightbox").remove();
            $(g).removeClass("lightbox-noscroll")
        }, "light" === n ? 500 : 800);
        $("> .w11 .w11close", g).hide();
        disconnectObserver();
        b.off("click", ".w11close, .w11w3", closew11);
        $(document).off("esckeydown", closew11)
    }
    function onWindowResized(a) {
        var b = a;
        clearTimeout(k);
        k = setTimeout(function() {
            $(window).off("resize", onWindowResized);
            return $("> .w11", g).length && onExternalContentLoaded(b)
        }, 500)
    }
    function registerObserver(a) {
        r = new MutationObserver(function(a) {
            clearTimeout(m);
            m = setTimeout(onExternalContentLoaded, 100)
        }
        );
        s = {
            attributes: !0,
            childList: !0,
            characterData: !1,
            subtree: !0
        };
        r.observe(a, s)
    }
    function disconnectObserver(a) {
        if (r) {
            r.disconnect();
            r = null
        }
        return a && a()
    }
    function wrapperPadding(a) {
        var b = window.getComputedStyle(a[0])
          , c = parseInt(b.paddingLeft, 10)
          , d = parseInt(b.paddingRight, 10)
          , e = parseInt(b.paddingTop, 10)
          , f = parseInt(b.paddingBottom, 10);
        return {
            width: c + d,
            height: e + f,
            left: c,
            right: d,
            top: e,
            bottom: f
        }
    }
});

/*! GENERIC-LIGHTBOX-GALLERY */
jQuery(document).ready(function($) {
    "use strict";
    if (!$(".lightbox-gallery").length)
        return !1;
    var a = $('<div class="slick-nav"><a class="slick-prev slick-arrow" data-lbl="prev-slide" aria-label="Previous" aria-disabled="false">Previous</a><div class="slick-pagination"></div><a class="slick-next slick-arrow" data-lbl="next-slide" aria-label="Next" aria-disabled="false">Next</a></div>');
    $(".lightbox-gallery").each(function() {
        var b = $(this)
          , c = $("body")
          , d = b.find('a[rel="lightbox"]')
          , e = d.get().map(function(a) {
            return a.href
        })
          , f = e.length
          , g = [];
        d.data("container", b);
        b.on("open.lightbox", function(d, f) {
            var g = e.indexOf(f.href);
            b.find(".w11w4").append(a).end().off("click.lightbox").on("click.lightbox", ".slick-arrow", onNavClicked);
            $(document).off("keydown.lightbox").on("keydown.lightbox", onKeydown);
            return c.addClass("lightbox-noscroll") && changeImage(0) && preloadImgs(f.href) && updateNav(g)
        }).on("close.lightbox", function() {
            return c.removeClass("lightbox-noscroll") && b.off("click.lightbox") && $(document).off("keydown.lightbox")
        });
        function onNavClicked() {
            return changeImage("next-slide" === $(this).data("lbl") ? 1 : -1)
        }
        function onKeydown(a) {
            return 37 === a.keyCode && changeImage(-1) || 39 === a.keyCode && changeImage(1) || 1
        }
        function changeImage(a) {
            var c = b.find(".w11w6")
              , d = c.find("img")
              , f = e.indexOf(d.attr("src")) + a;
            return null != e[f] && preloadImgs(e[f]) && d.removeClass("w11fadein") && c.css("backgroundImage", "url(" + d.attr("src") + ")") && d.attr("src", function() {
                return e[f]
            }) && setTimeout(d.addClass.bind(d, "w11fadein"), 50) && updateNav(f)
        }
        function preloadImgs(a) {
            var b = e.indexOf(a);
            g.push(a);
            return ![e[b - 1], e[b + 1]].forEach(function(a) {
                return null != a && g.indexOf(a) < 0 && g.push(a) && ((new Image).src = a)
            })
        }
        function updateNav(a) {
            var c = a + 1 <= e.length - 1
              , d = a - 1 >= 0;
            return b.find(".slick-next").toggleClass("slick-disabled", !c).attr("aria-disabled", !c).end().find(".slick-prev").toggleClass("slick-disabled", !d).attr("aria-disabled", !d).end().find(".slick-pagination").text([a + 1, f].join(" / "))
        }
    })
});
