async function clientSide_injectTools(browserInstance) {
    return await browserInstance.executeAsync((done) => {
        // terser'ed compare-versions@4.1.3.js from https://github.com/omichelsen/compare-versions
        // prettier-ignore
        !function (r, t) { "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? module.exports = t() : window.compareVersions = t() }(this, (function () { var r = /^[v^~<>=]*?(\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+))?(?:-([\da-z\-]+(?:\.[\da-z\-]+)*))?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i; function t(r) { var t, e, n = r.replace(/^v/, "").replace(/\+.*$/, ""), i = (e = "-", -1 === (t = n).indexOf(e) ? t.length : t.indexOf(e)), o = n.substring(0, i).split("."); return o.push(n.substring(i + 1)), o } function e(r) { var t = parseInt(r, 10); return isNaN(t) ? r : t } function n(t) { if ("string" != typeof t) throw new TypeError("Invalid argument expected string"); var e = t.match(r); if (!e) throw new Error("Invalid argument not valid semver ('" + t + "' received)"); return e.shift(), e } function i(r, t) { var [n, i] = function (r, t) { return typeof r != typeof t ? [String(r), String(t)] : [r, t] }(e(r), e(t)); return n > i ? 1 : n < i ? -1 : 0 } function o(r, i) { [r, i].forEach(n); for (var o = t(r), f = t(i), a = 0; a < Math.max(o.length - 1, f.length - 1); a++) { var u = parseInt(o[a] || 0, 10), p = parseInt(f[a] || 0, 10); if (u > p) return 1; if (p > u) return -1 } var s = o[o.length - 1], d = f[f.length - 1]; if (s && d) { var c = s.split(".").map(e), v = d.split(".").map(e); for (a = 0; a < Math.max(c.length, v.length); a++) { if (void 0 === c[a] || "string" == typeof v[a] && "number" == typeof c[a]) return -1; if (void 0 === v[a] || "string" == typeof c[a] && "number" == typeof v[a]) return 1; if (c[a] > v[a]) return 1; if (v[a] > c[a]) return -1 } } else if (s || d) return s ? -1 : 1; return 0 } var f = [">", ">=", "=", "<", "<="], a = { ">": [1], ">=": [0, 1], "=": [0], "<=": [-1, 0], "<": [-1] }; return o.validate = function (t) { return "string" == typeof t && r.test(t) }, o.compare = function (r, t, e) { !function (r) { if ("string" != typeof r) throw new TypeError("Invalid operator type, expected string but got " + typeof r); if (-1 === f.indexOf(r)) throw new TypeError("Invalid operator, expected one of " + f.join("|")) }(e); var n = o(r, t); return a[e].indexOf(n) > -1 }, o.satisfies = function (r, t) { var e = t.match(/^([<>=~^]+)/), f = e ? e[1] : "="; if ("^" !== f && "~" !== f) return o.compare(r, t, f); var [a, u, p] = n(r), [s, d, c] = n(t); return 0 === i(a, s) && ("^" === f ? function (r, t) { for (var e = 0; e < Math.max(r.length, t.length); e++) { var n = i(r[e] || 0, t[e] || 0); if (0 !== n) return n } return 0 }([u, p], [d, c]) >= 0 : 0 === i(u, d) && i(p, c) >= 0) }, o }));
        done()
    })
}

module.exports = {
    clientSide_injectTools
}
