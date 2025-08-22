// json2.jsx — JSON support for ExtendScript
// Source: https://github.com/douglascrockford/JSON-js (MIT Licensed)

if (typeof JSON !== "object") {
    JSON = {};
}

(function () {
    "use strict";

    function f(n) { return n < 10 ? "0" + n : n; }

    if (typeof Date.prototype.toJSON !== "function") {
        Date.prototype.toJSON = function () {
            return isFinite(this.valueOf()) ?
                this.getUTCFullYear() + "-" +
                f(this.getUTCMonth() + 1) + "-" +
                f(this.getUTCDate()) + "T" +
                f(this.getUTCHours()) + ":" +
                f(this.getUTCMinutes()) + ":" +
                f(this.getUTCSeconds()) + "Z" : null;
        };
    }

    var cx, escapable, gap, indent, meta, rep;

    function quote(string) {
        escapable = /[\\\"\u0000-\u001F\u2028\u2029]/g;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === "string" ? c :
                    "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
    }

    function str(key, holder) {
        var i, k, v, length, mind = gap, partial, value = holder[key];
        if (value && typeof value === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key);
        }
        switch (typeof value) {
        case "string": return quote(value);
        case "number": return isFinite(value) ? String(value) : "null";
        case "boolean":
        case "null": return String(value);
        case "object":
            if (!value) return "null";
            gap += indent;
            partial = [];
            if (Object.prototype.toString.apply(value) === "[object Array]") {
                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || "null";
                }
                v = partial.length === 0 ? "[]" :
                    gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" :
                          "[" + partial.join(",") + "]";
                gap = mind;
                return v;
            }
            for (k in value) {
                if (Object.prototype.hasOwnProperty.call(value, k)) {
                    v = str(k, value);
                    if (v) partial.push(quote(k) + (gap ? ": " : ":") + v);
                }
            }
            v = partial.length === 0 ? "{}" :
                gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" :
                      "{" + partial.join(",") + "}";
            gap = mind;
            return v;
        }
    }

    if (typeof JSON.stringify !== "function") {
        meta = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", "\"" : "\\\"", "\\" : "\\\\" };
        JSON.stringify = function (value, replacer, space) {
            gap = "";
            indent = "";
            return str("", {"": value});
        };
    }

    if (typeof JSON.parse !== "function") {
        cx = /[\u0000-\u001F\u2028\u2029]/g;
        JSON.parse = function (text) {
            return eval("(" + text + ")");
        };
    }
}());
