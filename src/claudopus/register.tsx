// The hooks module's entry: the hooks of each part, in the order the engine runs them. The parts are the files beside it,
// each named for its job; build.mjs joins them into mods/claudopus/hooks/register.tsx, the one file the mod loads

export const register: Register = on => {
  chatHooks(on)
  promptHooks(on)
  workHooks(on)
  stepHooks(on)
  commandHooks(on)
  toolHooks(on)
  bandHooks(on)
  panelHooks(on)
  tabHooks(on)
  memoryHooks(on)
  serversTabHooks(on)
  workflowHooks(on)
}
