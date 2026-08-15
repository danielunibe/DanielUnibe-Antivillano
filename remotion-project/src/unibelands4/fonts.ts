import { loadFont as loadTeko } from '@remotion/google-fonts/Teko';
import { loadFont as loadSpaceMono } from '@remotion/google-fonts/SpaceMono';

const tekoResult = loadTeko();
const spaceMonoResult = loadSpaceMono();

export const TEKO_FAMILY = tekoResult.fontFamily;
export const SPACE_MONO_FAMILY = spaceMonoResult.fontFamily;
