// Made by build.mjs from imports.tsx: what the joined file imports, as globals for the parts, which share one scope as they do there
import * as M0 from 'claude-code/testing'
import * as M1 from 'claude-code'
import * as M2 from '../../../mods/claudopus/hooks/shared'
import * as M3 from '../../../mods/claudopus/hooks/stats'

declare global {
  export import expect = M0.expect
  export import mock = M0.mock
  export import test = M0.test
  export import TestBody = M0.TestBody
  export import On = M1.On
  export import headLine = M2.headLine
  export import headMood = M2.headMood
  export import OFF_LOOK = M2.OFF_LOOK
  export import offOf = M2.offOf
  export import openTake = M2.openTake
  export import opensOf = M2.opensOf
  export import shareable = M2.shareable
  export import stuckOf = M2.stuckOf
  export import trip = M2.trip
  export import timelineRows = M3.timelineRows
}
