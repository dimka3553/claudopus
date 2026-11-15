// What the joined test file imports: the engine's test kit and types, and the mod's pure files. These lines go at the top of
// each area's file in mods/claudopus/hooks/tests/ as they stand (./ becoming ../); build.mjs makes globals.d.ts from them for the parts
import { expect, mock, test as kitTest } from 'claude-code/testing'
import type { TestBody } from 'claude-code/testing'
import type { On, Plugin } from 'claude-code'
import { headLine, headMood, OFF_LOOK, offOf, openTake, opensOf, shareable, stuckOf, trip } from './shared'
import { timelineRows } from './stats'
