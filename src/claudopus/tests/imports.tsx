// What the joined test file imports: the engine's test kit and types, and the mod's pure files. These lines go at the top of
// mods/claudopus/hooks/register.test.tsx as they stand; build.mjs makes globals.d.ts from them for the parts
import { expect, mock, test } from 'claude-code/testing'
import type { On } from 'claude-code'
import { headLine, headMood, OFF_LOOK, offOf, openTake, opensOf, shareable, stuckOf, trip } from './shared'
