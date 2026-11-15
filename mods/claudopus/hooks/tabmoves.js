"use strict";
// Tab moves a press asks for in the terminal, done by that press's own hook. A button's onPress runs with the handle of the drawing
// it sits in, which the engine never counts as the person asking, so a narrow terminal (under 144 columns, a phone over ssh) left
// every tab a press opened undrawn. While a press of the mod's is answered, an open or close is handed here as data, and the press's
// `ui.press` hook, whose handle the engine counts as the person's, does it. Nothing here touches the engine: the hook passes in what
// does a move and what sleeps
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.tabMoveQueue = exports.TAB_MOVES_WAIT = void 0;
// The engine counts an open as the person's for 10 s from their press, and runs a hook under the same 10 s: a press's hook waits for
// coming opens at most this long after its onPress, leaving a margin for the onPress itself and the moves
exports.TAB_MOVES_WAIT = 8000;
var tabMoveQueue = function () {
    // Presses being answered: two may overlap (a double tap, x while a Details tab reads its card)
    var pressing = 0;
    // Opens a press started that read something before their move, counted until they settle
    var coming = 0;
    var queue = [];
    // Every press's hook waiting for a move or a coming open to settle: each is woken, so none is left waiting
    var waiting = new Set();
    var wake = function () {
        var all = __spreadArray([], waiting, true);
        waiting.clear();
        for (var _i = 0, all_1 = all; _i < all_1.length; _i++) {
            var one = all_1[_i];
            one();
        }
    };
    return {
        isPressing: function () { return pressing > 0; },
        // A move from a press: done by a press's hook, settling once it is done
        handOver: function (move) {
            return new Promise(function (done, failed) {
                queue.push({ move: move, done: done, failed: failed });
                wake();
            });
        },
        // An open that reads first, started by a press: the press's hook waits for its move
        coming: function (opening) {
            if (!pressing)
                return opening;
            coming += 1;
            return opening.finally(function () {
                coming -= 1;
                wake();
            });
        },
        begin: function () {
            pressing += 1;
        },
        // The press's hook, once its onPress has run: every move handed over, as they come, until none is on its way, waiting at most
        // TAB_MOVES_WAIT for an open still reading. The press ends in the same step as the last look, so no move is handed over after it
        // with nobody to do it
        finish: function (run, sleep) { return __awaiter(void 0, void 0, void 0, function () {
            var isLate, timer, one;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isLate = false;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 7, 8]);
                        _a.label = 2;
                    case 2:
                        if (!(queue.length || (coming > 0 && !isLate))) return [3 /*break*/, 6];
                        one = queue.shift();
                        if (!one) return [3 /*break*/, 4];
                        return [4 /*yield*/, run(one.move).then(one.done, one.failed)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 4:
                        timer !== null && timer !== void 0 ? timer : (timer = sleep(exports.TAB_MOVES_WAIT)
                            .then(function () {
                            isLate = true;
                            wake();
                        })
                            .catch(function () { return undefined; }));
                        return [4 /*yield*/, new Promise(function (woken) { return waiting.add(woken); })];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        pressing -= 1;
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        }); },
    };
};
exports.tabMoveQueue = tabMoveQueue;
