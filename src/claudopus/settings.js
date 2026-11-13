// Config: the texts in force and the settings, kept keys' names, and the Config tab's acts (its drawing is in ../../mods/claudopus/hooks/config.tsx)
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = this;
// ---- Config: the texts in force and the settings (the tab and its pure parts are in ./config) ----
// The person's own copy of one of the three texts the mod ships (TEXTS in ./config), each written at its own fixed place in the
// memory folder; the Config tab is the only writer, and nothing else is written there
function writeOwnText($, memory, path, text) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (path === 'rules/CLAUDE.md')
                return [2 /*return*/, $.fs.write("".concat(memory, "/rules/CLAUDE.md"), text)];
            if (path === 'roles/chat.md')
                return [2 /*return*/, $.fs.write("".concat(memory, "/roles/chat.md"), text)];
            if (path === 'roles/work.md')
                return [2 /*return*/, $.fs.write("".concat(memory, "/roles/work.md"), text)];
            throw new Error("".concat(path, " is not one of the texts the mod ships"));
        });
    });
}
// The text in force: the person's own copy when it holds anything, the shipped one otherwise
function inForce($, root, memory, path) {
    return __awaiter(this, void 0, void 0, function () {
        var own, _a, shipped, places, isStale;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!memory) return [3 /*break*/, 2];
                    return [4 /*yield*/, readOr($, "".concat(memory, "/").concat(path))];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = '';
                    _b.label = 3;
                case 3:
                    own = _a;
                    return [4 /*yield*/, readOr($, "".concat(root, "/").concat(path))
                        // A copy the same as what shipped is no change of the person's
                        // A copy made before an update can lack a place the shipped text now fills (a setting such as the models): it is stale
                    ];
                case 4:
                    shipped = _b.sent();
                    places = function (text) { var _a; return new Set((_a = text.match(/\{[a-z]+\}/gi)) !== null && _a !== void 0 ? _a : []); };
                    isStale = function (own) { return __spreadArray([], places(shipped), true).some(function (place) { return !places(own).has(place); }); };
                    if (own.trim() && own.trim() !== shipped.trim())
                        return [2 /*return*/, { text: own, path: "".concat(memory, "/").concat(path), isOwn: true, isStale: isStale(own) }];
                    return [2 /*return*/, { text: shipped, path: "".concat(root, "/").concat(path), isOwn: false, isStale: false }];
            }
        });
    });
}
function readConfig($, memory) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = parse;
                    return [4 /*yield*/, readOr($, "".concat(memory, "/config.json"))];
                case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
            }
        });
    });
}
// Sets one key, or with undefined puts it back to what shipped; every other key, ones this tab does not know included, is kept
function setConfig($, memory, key, value, role) {
    return __awaiter(this, void 0, void 0, function () {
        var path, text, config, models_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    path = "".concat(memory, "/config.json");
                    return [4 /*yield*/, readOr($, path)];
                case 1:
                    text = _b.sent();
                    config = (function () {
                        try {
                            return JSON.parse(text || '{}');
                        }
                        catch (_a) {
                            return undefined;
                        }
                    })();
                    // A file that does not parse is someone's edit under way: it is left as it is
                    if (!config || typeof config !== 'object' || Array.isArray(config))
                        throw new Error('config.json does not parse');
                    if (key === 'models' && role) {
                        models_1 = __assign({}, ((_a = config.models) !== null && _a !== void 0 ? _a : {}));
                        if (value === undefined)
                            delete models_1[role];
                        else
                            models_1[role] = value;
                        if (Object.keys(models_1).length)
                            config.models = models_1;
                        else
                            delete config.models;
                    }
                    else if (value === undefined)
                        delete config[key];
                    else
                        config[key] = value;
                    return [4 /*yield*/, $.fs.write("".concat(memory, "/config.json"), "".concat(JSON.stringify(config, null, 2), "\n"))];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function openedInEditor($, path) {
    return __awaiter(this, void 0, void 0, function () {
        var mac, other;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, $.process.run(['open', '-t', path]).catch(function (err) { return ({ exitCode: 1, stderr: String(err) }); })];
                case 1:
                    mac = _a.sent();
                    if (mac.exitCode === 0)
                        return [2 /*return*/, ''];
                    return [4 /*yield*/, $.process.run(['xdg-open', path]).catch(function (err) { return ({ exitCode: 1, stderr: String(err) }); })];
                case 2:
                    other = _a.sent();
                    return [2 /*return*/, other.exitCode === 0 ? '' : mac.stderr || other.stderr || 'no editor opened'];
            }
        });
    });
}
// Edit: the person's own copy, made from the shipped text the first time, opened in their editor
function editText($, root, memory, path) {
    return __awaiter(this, void 0, void 0, function () {
        var own, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    own = "".concat(memory, "/").concat(path);
                    return [4 /*yield*/, readOr($, own)];
                case 1:
                    if (!!(_c.sent()).trim()) return [3 /*break*/, 4];
                    _a = writeOwnText;
                    _b = [$, memory, path];
                    return [4 /*yield*/, readOr($, "".concat(root, "/").concat(path))];
                case 2: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent()]))];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4: return [2 /*return*/, openedInEditor($, own)];
            }
        });
    });
}
// Put back: the person's copy moves aside as .old, and the shipped text is in force again
function putBack($, memory, path) {
    return __awaiter(this, void 0, void 0, function () {
        var own, at, _a, r;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    own = "".concat(memory, "/").concat(path);
                    _a = Date.bind;
                    return [4 /*yield*/, $.clock.now()];
                case 1:
                    at = new (_a.apply(Date, [void 0, _b.sent()]))().toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '-');
                    return [4 /*yield*/, $.process.run(['mv', '-n', own, "".concat(own, ".").concat(at, ".old")]).catch(function (err) { return ({ exitCode: 1, stderr: String(err) }); })];
                case 2:
                    r = _b.sent();
                    return [2 /*return*/, r.exitCode === 0 ? '' : r.stderr || 'not put back'];
            }
        });
    });
}
// Save: what the person wrote in the tab becomes their own copy
function saveText($, root, memory, path, text) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = text.trim();
                    return [4 /*yield*/, readOr($, "".concat(root, "/").concat(path))];
                case 1:
                    if (!(_a === (_b.sent()).trim())) return [3 /*break*/, 3];
                    return [4 /*yield*/, readOr($, "".concat(memory, "/").concat(path))];
                case 2: return [2 /*return*/, (_b.sent()) ? putBack($, memory, path) : ''];
                case 3: return [4 /*yield*/, writeOwnText($, memory, path, text.endsWith('\n') ? text : "".concat(text, "\n"))];
                case 4:
                    _b.sent();
                    return [2 /*return*/, ''];
            }
        });
    });
}
// Kept keys stay out of every chat: a command that would read one from the keychain is refused, and once any key is kept, what a
// tool answers comes back with every kept value hidden. The values never reach the mod: `bin/secret --hide` swaps them in a pipe
var secrets = { at: -SECRETS_MS, names: [] };
function hideKept($, e, r) {
    return __awaiter(this, void 0, void 0, function () {
        var command, runner, now, listed_1, text, hidden, swapped, _a;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    command = e.tool === 'Bash' ? String((_b = e.command) !== null && _b !== void 0 ? _b : '') : '';
                    if (r.deny || OWN.includes(e.tool) || OWN_SERVERS.some(function (prefix) { return e.tool.startsWith(prefix); }))
                        return [2 /*return*/, r];
                    runner = "".concat($.plugin.root, "/bin/secret");
                    return [4 /*yield*/, $.clock.now()];
                case 1:
                    now = _d.sent();
                    if (!(now - secrets.at >= SECRETS_MS || command.includes('bin/secret'))) return [3 /*break*/, 3];
                    return [4 /*yield*/, $.process.run([runner, '--list']).catch(function () { return undefined; })];
                case 2:
                    listed_1 = _d.sent();
                    if ((listed_1 === null || listed_1 === void 0 ? void 0 : listed_1.exitCode) === 0)
                        secrets = { at: now, names: listed_1.stdout.split('\n').filter(Boolean) };
                    _d.label = 3;
                case 3:
                    if (!secrets.names.length)
                        return [2 /*return*/, r];
                    _d.label = 4;
                case 4:
                    _d.trys.push([4, 6, , 7]);
                    text = JSON.stringify({ result: r.result, context: r.context });
                    return [4 /*yield*/, $.process.run(__spreadArray([runner, '--hide', '--json'], secrets.names, true), { stdin: text })];
                case 5:
                    hidden = _d.sent();
                    if (hidden.exitCode !== 0 || hidden.isStdoutTruncated)
                        throw new Error('not hidden');
                    if (hidden.stdout === text)
                        return [2 /*return*/, r];
                    swapped = JSON.parse((_c = hidden === null || hidden === void 0 ? void 0 : hidden.stdout) !== null && _c !== void 0 ? _c : '');
                    return [2 /*return*/, __assign(__assign({}, r), { result: swapped.result, context: swapped.context })];
                case 6:
                    _a = _d.sent();
                    return [2 /*return*/, { deny: "".concat(e.tool, " ran, and what it answered was withheld: it could not be checked for kept keys.") }];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Config: each thing the person can set, what is in force, and a way to change it or put it back to what shipped
var CONFIG_PANE = 'config';
var CONFIG_TITLE = 'Config';
var configFailed = '';
var openConfig = function ($) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                presses += 1;
                configFailed = '';
                return [4 /*yield*/, front($, CONFIG_PANE, CONFIG_TITLE)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var configButton = function ($, ui) { return (<ui.Box key="config-button" flexShrink={0}>
    <ui.Button key={"config-open-".concat(presses)} label="Config" onPress={function () { return void openConfig($).catch(function (err) { return log($, "config not opened: ".concat(String(err))); }); }}/>
  </ui.Box>); };
var configShown = function ($) { return __awaiter(_this, void 0, void 0, function () {
    var _a;
    var _b;
    var _this = this;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = {};
                return [4 /*yield*/, Promise.all(TEXTS.map(function (text) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, isOwn, isStale, path, body;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, inForce($, $.plugin.root, dir, text.path)];
                                case 1:
                                    _a = _b.sent(), isOwn = _a.isOwn, isStale = _a.isStale, path = _a.path, body = _a.text;
                                    return [2 /*return*/, { text: text, isOwn: isOwn, isStale: isStale, path: path, body: body }];
                            }
                        });
                    }); }))];
            case 1:
                _b.texts = _c.sent();
                return [4 /*yield*/, readConfig($, dir)];
            case 2:
                _b.config = _c.sent();
                _a = configFailed;
                if (_a) return [3 /*break*/, 4];
                return [4 /*yield*/, readOr($, "".concat(dir, "/config.json")).then(function (text) {
                        try {
                            JSON.parse(text || '{}');
                            return '';
                        }
                        catch (_a) {
                            return "".concat(dir, "/config.json does not read as JSON, so every setting is as shipped. Fix it or remove it.");
                        }
                    })];
            case 3:
                _a = (_c.sent());
                _c.label = 4;
            case 4: return [2 /*return*/, (
                // A config.json that does not read is said at once: until it is fixed every setting is as shipped
                _b.failed = _a,
                    _b)
                // Each act says what failed under the tab, logs it, and reads the settings again so the chat goes on with what is in force
            ];
        }
    });
}); };
// Each act says what failed under the tab, logs it, and reads the settings again so the chat goes on with what is in force
var configAct = function ($, what, act) {
    presses += 1;
    void act()
        .then(function (failed) {
        configFailed = failed ? "".concat(what, ": ").concat(failed) : '';
    })
        .catch(function (err) {
        configFailed = "".concat(what, ": ").concat(String(err instanceof Error ? err.message : err));
    })
        .then(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!configFailed) return [3 /*break*/, 2];
                    return [4 /*yield*/, log($, "config: ".concat(configFailed))];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [4 /*yield*/, loadSettings($)];
                case 3:
                    _a.sent();
                    redraw($);
                    return [2 /*return*/];
            }
        });
    }); });
};
var configActs = function ($) { return ({
    open: function (text) { return configAct($, "".concat(text.name, " not opened"), function () { return editText($, $.plugin.root, dir, text.path); }); },
    // Edit opens the text in the tab itself; Save makes it the person's own copy
    edit: function (text, body) { return configAct($, '', function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, void Object.assign(editing, { key: text.key, draft: body })];
    }); }); }); },
    save: function (text, body) {
        return configAct($, "".concat(text.name, " not saved"), function () { return __awaiter(_this, void 0, void 0, function () {
            var failed, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!body.trim()) return [3 /*break*/, 2];
                        return [4 /*yield*/, saveText($, $.plugin.root, dir, text.path, body)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = 'the text was empty, so nothing changed';
                        _b.label = 3;
                    case 3:
                        failed = _a;
                        Object.assign(editing, { key: '', draft: '' });
                        return [2 /*return*/, failed];
                }
            });
        }); });
    },
    cancel: function () { return configAct($, '', function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, void Object.assign(editing, { key: '', draft: '' })];
    }); }); }); },
    putBack: function (text) { return configAct($, "".concat(text.name, " not reset"), function () { return putBack($, dir, text.path); }); },
    set: function (key, value, role) {
        return configAct($, 'Not saved', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, setConfig($, dir, key, value, role)
                        // Automatic updates turned back on look at once when a look is due, not at the next quarter hour
                    ];
                    case 1:
                        _a.sent();
                        // Automatic updates turned back on look at once when a look is due, not at the next quarter hour
                        if (key === 'updates' && value === undefined)
                            void selfUpdate($).catch(function (err) { return log($, "update not looked for: ".concat(String(err))); });
                        return [2 /*return*/];
                }
            });
        }); });
    },
}); };
