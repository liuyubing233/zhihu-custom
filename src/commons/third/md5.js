export default function md5(s) {
  function f1(t, e, n) {
    var r;
    !function (o) {
      "use strict";

      function i(t, e) {
        var n = (65535 & t) + (65535 & e);
        return (t >> 16) + (e >> 16) + (n >> 16) << 16 | 65535 & n
      }

      function a(t, e, n, r, o, a) {
        return i((u = i(i(e, t), i(r, a))) << (c = o) | u >>> 32 - c, n);
        var u, c
      }

      function u(t, e, n, r, o, i, u) {
        return a(e & n | ~e & r, t, e, o, i, u)
      }

      function c(t, e, n, r, o, i, u) {
        return a(e & r | n & ~r, t, e, o, i, u)
      }

      function s(t, e, n, r, o, i, u) {
        return a(e ^ n ^ r, t, e, o, i, u)
      }

      function l(t, e, n, r, o, i, u) {
        return a(n ^ (e | ~r), t, e, o, i, u)
      }

      function f(t, e) {
        var n, r, o, a, f;
        t[e >> 5] |= 128 << e % 32,
          t[14 + (e + 64 >>> 9 << 4)] = e;
        var d = 1732584193
          , p = -271733879
          , h = -1732584194
          , v = 271733878;
        for (n = 0; n < t.length; n += 16)
          r = d,
            o = p,
            a = h,
            f = v,
            d = u(d, p, h, v, t[n], 7, -680876936),
            v = u(v, d, p, h, t[n + 1], 12, -389564586),
            h = u(h, v, d, p, t[n + 2], 17, 606105819),
            p = u(p, h, v, d, t[n + 3], 22, -1044525330),
            d = u(d, p, h, v, t[n + 4], 7, -176418897),
            v = u(v, d, p, h, t[n + 5], 12, 1200080426),
            h = u(h, v, d, p, t[n + 6], 17, -1473231341),
            p = u(p, h, v, d, t[n + 7], 22, -45705983),
            d = u(d, p, h, v, t[n + 8], 7, 1770035416),
            v = u(v, d, p, h, t[n + 9], 12, -1958414417),
            h = u(h, v, d, p, t[n + 10], 17, -42063),
            p = u(p, h, v, d, t[n + 11], 22, -1990404162),
            d = u(d, p, h, v, t[n + 12], 7, 1804603682),
            v = u(v, d, p, h, t[n + 13], 12, -40341101),
            h = u(h, v, d, p, t[n + 14], 17, -1502002290),
            d = c(d, p = u(p, h, v, d, t[n + 15], 22, 1236535329), h, v, t[n + 1], 5, -165796510),
            v = c(v, d, p, h, t[n + 6], 9, -1069501632),
            h = c(h, v, d, p, t[n + 11], 14, 643717713),
            p = c(p, h, v, d, t[n], 20, -373897302),
            d = c(d, p, h, v, t[n + 5], 5, -701558691),
            v = c(v, d, p, h, t[n + 10], 9, 38016083),
            h = c(h, v, d, p, t[n + 15], 14, -660478335),
            p = c(p, h, v, d, t[n + 4], 20, -405537848),
            d = c(d, p, h, v, t[n + 9], 5, 568446438),
            v = c(v, d, p, h, t[n + 14], 9, -1019803690),
            h = c(h, v, d, p, t[n + 3], 14, -187363961),
            p = c(p, h, v, d, t[n + 8], 20, 1163531501),
            d = c(d, p, h, v, t[n + 13], 5, -1444681467),
            v = c(v, d, p, h, t[n + 2], 9, -51403784),
            h = c(h, v, d, p, t[n + 7], 14, 1735328473),
            d = s(d, p = c(p, h, v, d, t[n + 12], 20, -1926607734), h, v, t[n + 5], 4, -378558),
            v = s(v, d, p, h, t[n + 8], 11, -2022574463),
            h = s(h, v, d, p, t[n + 11], 16, 1839030562),
            p = s(p, h, v, d, t[n + 14], 23, -35309556),
            d = s(d, p, h, v, t[n + 1], 4, -1530992060),
            v = s(v, d, p, h, t[n + 4], 11, 1272893353),
            h = s(h, v, d, p, t[n + 7], 16, -155497632),
            p = s(p, h, v, d, t[n + 10], 23, -1094730640),
            d = s(d, p, h, v, t[n + 13], 4, 681279174),
            v = s(v, d, p, h, t[n], 11, -358537222),
            h = s(h, v, d, p, t[n + 3], 16, -722521979),
            p = s(p, h, v, d, t[n + 6], 23, 76029189),
            d = s(d, p, h, v, t[n + 9], 4, -640364487),
            v = s(v, d, p, h, t[n + 12], 11, -421815835),
            h = s(h, v, d, p, t[n + 15], 16, 530742520),
            d = l(d, p = s(p, h, v, d, t[n + 2], 23, -995338651), h, v, t[n], 6, -198630844),
            v = l(v, d, p, h, t[n + 7], 10, 1126891415),
            h = l(h, v, d, p, t[n + 14], 15, -1416354905),
            p = l(p, h, v, d, t[n + 5], 21, -57434055),
            d = l(d, p, h, v, t[n + 12], 6, 1700485571),
            v = l(v, d, p, h, t[n + 3], 10, -1894986606),
            h = l(h, v, d, p, t[n + 10], 15, -1051523),
            p = l(p, h, v, d, t[n + 1], 21, -2054922799),
            d = l(d, p, h, v, t[n + 8], 6, 1873313359),
            v = l(v, d, p, h, t[n + 15], 10, -30611744),
            h = l(h, v, d, p, t[n + 6], 15, -1560198380),
            p = l(p, h, v, d, t[n + 13], 21, 1309151649),
            d = l(d, p, h, v, t[n + 4], 6, -145523070),
            v = l(v, d, p, h, t[n + 11], 10, -1120210379),
            h = l(h, v, d, p, t[n + 2], 15, 718787259),
            p = l(p, h, v, d, t[n + 9], 21, -343485551),
            d = i(d, r),
            p = i(p, o),
            h = i(h, a),
            v = i(v, f);
        return [d, p, h, v]
      }

      function d(t) {
        var e, n = "", r = 32 * t.length;
        for (e = 0; e < r; e += 8)
          n += String.fromCharCode(t[e >> 5] >>> e % 32 & 255);
        return n
      }

      function p(t) {
        var e, n = [];
        for (n[(t.length >> 2) - 1] = void 0,
          e = 0; e < n.length; e += 1)
          n[e] = 0;
        var r = 8 * t.length;
        for (e = 0; e < r; e += 8)
          n[e >> 5] |= (255 & t.charCodeAt(e / 8)) << e % 32;
        return n
      }

      function h(t) {
        var e, n, r = "0123456789abcdef", o = "";
        for (n = 0; n < t.length; n += 1)
          e = t.charCodeAt(n),
            o += r.charAt(e >>> 4 & 15) + r.charAt(15 & e);
        return o
      }

      function v(t) {
        return unescape(encodeURIComponent(t))
      }

      function A(t) {
        return function (t) {
          return d(f(p(t), 8 * t.length))
        }(v(t))
      }

      function m(t, e) {
        return function (t, e) {
          var n, r, o = p(t), i = [], a = [];
          for (i[15] = a[15] = void 0,
            o.length > 16 && (o = f(o, 8 * t.length)),
            n = 0; n < 16; n += 1)
            i[n] = 909522486 ^ o[n],
              a[n] = 1549556828 ^ o[n];
          return r = f(i.concat(p(e)), 512 + 8 * e.length),
            d(f(a.concat(r), 640))
        }(v(t), v(e))
      }

      function g(t, e, n) {
        return e ? n ? m(e, t) : h(m(e, t)) : n ? A(t) : h(A(t))
      }

      void 0 === (r = function () {
        return g
      }
        .call(e, n, e, t)) || (t.exports = r)
    }()
  }
  var o = {}
  f1(o);
  return o.exports(s)
}