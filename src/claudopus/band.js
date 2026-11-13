// Above the prompt: the small octopus while work runs
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
var bandHooks = function (on) {
    // Above the prompt, while work runs: a small mark that it does, and nothing of what it is doing
    on('ui.render', { component: 'AbovePrompt' }, function ($, e, next) { return __awaiter(_this, void 0, void 0, function () {
        var cards, working, happy, _a, _b, ui, Box, Text, latest, lead, doing, others;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (e.props.hasSurvey)
                        return [2 /*return*/, next(e)];
                    return [4 /*yield*/, read($, todos)];
                case 1:
                    cards = _e.sent();
                    working = cards.filter(function (one) { return !one.parentId && one.status === 'working'; });
                    _a = isHappy;
                    _b = [cards];
                    return [4 /*yield*/, $.clock.now()];
                case 2:
                    happy = _a.apply(void 0, _b.concat([_e.sent()]));
                    if (!happy) return [3 /*break*/, 4];
                    return [4 /*yield*/, read($, tick)];
                case 3:
                    _e.sent();
                    _e.label = 4;
                case 4:
                    if (!working.length && !happy)
                        return [2 /*return*/, next(e)];
                    ui = $.ui.resolve(e);
                    Box = ui.Box, Text = ui.Text;
                    latest = function (one) { return __spreadArray([], one.entries, true).reverse().find(function (entry) { return entry.kind !== 'steer'; }); };
                    lead = __spreadArray([], working, true).sort(function (a, b) { var _a, _b, _c, _d; return ((_b = (_a = latest(b)) === null || _a === void 0 ? void 0 : _a.at) !== null && _b !== void 0 ? _b : b.startedAt) - ((_d = (_c = latest(a)) === null || _c === void 0 ? void 0 : _c.at) !== null && _d !== void 0 ? _d : a.startedAt); })[0];
                    doing = lead ? ((_c = lead.items.find(function (item) { return item.state === 'doing'; })) === null || _c === void 0 ? void 0 : _c.text) || lead.title || 'Working' : '✓ Finished';
                    others = working.length - 1;
                    return [2 /*return*/, (<Box flexDirection="row" alignItems="center" gap={1} height={1} overflow="hidden">
        {(_d = octopus(ui, 'band-mark', happy ? 'happySmall' : 'workingSmall', BAND_MARK, happy ? 'Claudopus, work finished' : 'Claudopus at work')) !== null && _d !== void 0 ? _d : <Text dimColor>•••</Text>}
        <Box flexShrink={1} minWidth={0}>
          <Text dimColor wrap="truncate-end">{oneLine(doing)}</Text>
        </Box>
        {others > 0 ? (<Box flexShrink={0}>
            <Text dimColor>{"\u00B7 +".concat(others, " more")}</Text>
          </Box>) : null}
      </Box>)];
            }
        });
    }); });
};
