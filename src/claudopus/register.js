"use strict";
// The hooks module's entry: the hooks of each part, in the order the engine runs them. The parts are the files beside it,
// each named for its job; build.mjs joins them into mods/claudopus/hooks/register.tsx, the one file the mod loads
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
var register = function (on) {
    chatHooks(on);
    promptHooks(on);
    workHooks(on);
    commandHooks(on);
    toolHooks(on);
    bandHooks(on);
    panelHooks(on);
    tabHooks(on);
    memoryHooks(on);
    serversTabHooks(on);
    workflowHooks(on);
};
exports.register = register;
