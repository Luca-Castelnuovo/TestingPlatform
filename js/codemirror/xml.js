! function (t) {
	"object" == typeof exports && "object" == typeof module ? t(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], t) : t(CodeMirror)
}(function (t) {
	"use strict";
	var e = {
			autoSelfClosers: {
				area: !0,
				base: !0,
				br: !0,
				col: !0,
				command: !0,
				embed: !0,
				frame: !0,
				hr: !0,
				img: !0,
				input: !0,
				keygen: !0,
				link: !0,
				meta: !0,
				param: !0,
				source: !0,
				track: !0,
				wbr: !0,
				menuitem: !0
			},
			implicitlyClosed: {
				dd: !0,
				li: !0,
				optgroup: !0,
				option: !0,
				p: !0,
				rp: !0,
				rt: !0,
				tbody: !0,
				td: !0,
				tfoot: !0,
				th: !0,
				tr: !0
			},
			contextGrabbers: {
				dd: {
					dd: !0,
					dt: !0
				},
				dt: {
					dd: !0,
					dt: !0
				},
				li: {
					li: !0
				},
				option: {
					option: !0,
					optgroup: !0
				},
				optgroup: {
					optgroup: !0
				},
				p: {
					address: !0,
					article: !0,
					aside: !0,
					blockquote: !0,
					dir: !0,
					div: !0,
					dl: !0,
					fieldset: !0,
					footer: !0,
					form: !0,
					h1: !0,
					h2: !0,
					h3: !0,
					h4: !0,
					h5: !0,
					h6: !0,
					header: !0,
					hgroup: !0,
					hr: !0,
					menu: !0,
					nav: !0,
					ol: !0,
					p: !0,
					pre: !0,
					section: !0,
					table: !0,
					ul: !0
				},
				rp: {
					rp: !0,
					rt: !0
				},
				rt: {
					rp: !0,
					rt: !0
				},
				tbody: {
					tbody: !0,
					tfoot: !0
				},
				td: {
					td: !0,
					th: !0
				},
				tfoot: {
					tbody: !0
				},
				th: {
					td: !0,
					th: !0
				},
				thead: {
					tbody: !0,
					tfoot: !0
				},
				tr: {
					tr: !0
				}
			},
			doNotIndent: {
				pre: !0
			},
			allowUnquoted: !0,
			allowMissing: !0,
			caseFold: !0
		},
		n = {
			autoSelfClosers: {},
			implicitlyClosed: {},
			contextGrabbers: {},
			doNotIndent: {},
			allowUnquoted: !1,
			allowMissing: !1,
			allowMissingTagName: !1,
			caseFold: !1
		};
	t.defineMode("xml", function (r, o) {
		function a(t, e) {
			function n(n) {
				return e.tokenize = n, n(t, e)
			}
			var r = t.next();
			if ("<" == r) return t.eat("!") ? t.eat("[") ? t.match("CDATA[") ? n(l("atom", "]]>")) : null : t.match("--") ? n(l("comment", "--\x3e")) : t.match("DOCTYPE", !0, !0) ? (t.eatWhile(/[\w\._\-]/), n(u(1))) : null : t.eat("?") ? (t.eatWhile(/[\w\._\-]/), e.tokenize = l("meta", "?>"), "meta") : (N = t.eat("/") ? "closeTag" : "openTag", e.tokenize = i, "tag bracket");
			if ("&" == r) {
				return (t.eat("#") ? t.eat("x") ? t.eatWhile(/[a-fA-F\d]/) && t.eat(";") : t.eatWhile(/[\d]/) && t.eat(";") : t.eatWhile(/[\w\.\-:]/) && t.eat(";")) ? "atom" : "error"
			}
			return t.eatWhile(/[^&<]/), null
		}

		function i(t, e) {
			var n = t.next();
			if (">" == n || "/" == n && t.eat(">")) return e.tokenize = a, N = ">" == n ? "endTag" : "selfcloseTag", "tag bracket";
			if ("=" == n) return N = "equals", null;
			if ("<" == n) {
				e.tokenize = a, e.state = s, e.tagName = e.tagStart = null;
				var r = e.tokenize(t, e);
				return r ? r + " tag error" : "tag error"
			}
			return /[\'\"]/.test(n) ? (e.tokenize = function (t) {
				var e = function (e, n) {
					for (; !e.eol();)
						if (e.next() == t) {
							n.tokenize = i;
							break
						}
					return "string"
				};
				return e.isInAttribute = !0, e
			}(n), e.stringStartCol = t.column(), e.tokenize(t, e)) : (t.match(/^[^\s\u00a0=<>\"\']*[^\s\u00a0=<>\"\'\/]/), "word")
		}

		function l(t, e) {
			return function (n, r) {
				for (; !n.eol();) {
					if (n.match(e)) {
						r.tokenize = a;
						break
					}
					n.next()
				}
				return t
			}
		}

		function u(t) {
			return function (e, n) {
				for (var r; null != (r = e.next());) {
					if ("<" == r) return n.tokenize = u(t + 1), n.tokenize(e, n);
					if (">" == r) {
						if (1 == t) {
							n.tokenize = a;
							break
						}
						return n.tokenize = u(t - 1), n.tokenize(e, n)
					}
				}
				return "meta"
			}
		}

		function d(t) {
			t.context && (t.context = t.context.prev)
		}

		function c(t, e) {
			for (var n;;) {
				if (!t.context) return;
				if (n = t.context.tagName, !v.contextGrabbers.hasOwnProperty(n) || !v.contextGrabbers[n].hasOwnProperty(e)) return;
				d(t)
			}
		}

		function s(t, e, n) {
			return "openTag" == t ? (n.tagStart = e.column(), f) : "closeTag" == t ? m : s
		}

		function f(t, e, n) {
			return "word" == t ? (n.tagName = e.current(), z = "tag", h) : v.allowMissingTagName && "endTag" == t ? (z = "tag bracket", h(t, e, n)) : (z = "error", f)
		}

		function m(t, e, n) {
			if ("word" == t) {
				var r = e.current();
				return n.context && n.context.tagName != r && v.implicitlyClosed.hasOwnProperty(n.context.tagName) && d(n), n.context && n.context.tagName == r || !1 === v.matchClosing ? (z = "tag", g) : (z = "tag error", p)
			}
			return v.allowMissingTagName && "endTag" == t ? (z = "tag bracket", g(t, e, n)) : (z = "error", p)
		}

		function g(t, e, n) {
			return "endTag" != t ? (z = "error", g) : (d(n), s)
		}

		function p(t, e, n) {
			return z = "error", g(t, 0, n)
		}

		function h(t, e, n) {
			if ("word" == t) return z = "attribute", x;
			if ("endTag" == t || "selfcloseTag" == t) {
				var r = n.tagName,
					o = n.tagStart;
				return n.tagName = n.tagStart = null, "selfcloseTag" == t || v.autoSelfClosers.hasOwnProperty(r) ? c(n, r) : (c(n, r), n.context = new function (t, e, n) {
					this.prev = t.context, this.tagName = e, this.indent = t.indented, this.startOfLine = n, (v.doNotIndent.hasOwnProperty(e) || t.context && t.context.noIndent) && (this.noIndent = !0)
				}(n, r, o == n.indented)), s
			}
			return z = "error", h
		}

		function x(t, e, n) {
			return "equals" == t ? b : (v.allowMissing || (z = "error"), h(t, 0, n))
		}

		function b(t, e, n) {
			return "string" == t ? k : "word" == t && v.allowUnquoted ? (z = "string", h) : (z = "error", h(t, 0, n))
		}

		function k(t, e, n) {
			return "string" == t ? k : h(t, 0, n)
		}
		var w = r.indentUnit,
			v = {},
			T = o.htmlMode ? e : n;
		for (var y in T) v[y] = T[y];
		for (var y in o) v[y] = o[y];
		var N, z;
		return a.isInText = !0, {
			startState: function (t) {
				var e = {
					tokenize: a,
					state: s,
					indented: t || 0,
					tagName: null,
					tagStart: null,
					context: null
				};
				return null != t && (e.baseIndent = t), e
			},
			token: function (t, e) {
				if (!e.tagName && t.sol() && (e.indented = t.indentation()), t.eatSpace()) return null;
				N = null;
				var n = e.tokenize(t, e);
				return (n || N) && "comment" != n && (z = null, e.state = e.state(N || n, t, e), z && (n = "error" == z ? n + " error" : z)), n
			},
			indent: function (e, n, r) {
				var o = e.context;
				if (e.tokenize.isInAttribute) return e.tagStart == e.indented ? e.stringStartCol + 1 : e.indented + w;
				if (o && o.noIndent) return t.Pass;
				if (e.tokenize != i && e.tokenize != a) return r ? r.match(/^(\s*)/)[0].length : 0;
				if (e.tagName) return !1 !== v.multilineTagIndentPastTag ? e.tagStart + e.tagName.length + 2 : e.tagStart + w * (v.multilineTagIndentFactor || 1);
				if (v.alignCDATA && /<!\[CDATA\[/.test(n)) return 0;
				var l = n && /^<(\/)?([\w_:\.-]*)/.exec(n);
				if (l && l[1])
					for (; o;) {
						if (o.tagName == l[2]) {
							o = o.prev;
							break
						}
						if (!v.implicitlyClosed.hasOwnProperty(o.tagName)) break;
						o = o.prev
					} else if (l)
						for (; o;) {
							var u = v.contextGrabbers[o.tagName];
							if (!u || !u.hasOwnProperty(l[2])) break;
							o = o.prev
						}
				for (; o && o.prev && !o.startOfLine;) o = o.prev;
				return o ? o.indent + w : e.baseIndent || 0
			},
			electricInput: /<\/[\s\w:]+>$/,
			blockCommentStart: "\x3c!--",
			blockCommentEnd: "--\x3e",
			configuration: v.htmlMode ? "html" : "xml",
			helperType: v.htmlMode ? "html" : "xml",
			skipAttribute: function (t) {
				t.state == b && (t.state = h)
			}
		}
	}), t.defineMIME("text/xml", "xml"), t.defineMIME("application/xml", "xml"), t.mimeModes.hasOwnProperty("text/html") || t.defineMIME("text/html", {
		name: "xml",
		htmlMode: !0
	})
});
