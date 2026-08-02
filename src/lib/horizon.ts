import type { ConditionFamily } from './weatherCodes';

// Each condition family has a day palette and a night palette.
// The horizon line reads left-to-right as "now" only — it is not a
// timeline, just a two-stop gradient that carries the mood of the sky.
const PALETTES: Record<ConditionFamily, { day: [string, string]; night: [string, string] }> = {
  clear:  { day: ['#3E5C8A', '#C4923F'], night: ['#1B2540', '#3E5C8A'] },
  cloudy: { day: ['#7C8494', '#B7BCC6'], night: ['#2B303B', '#5B6270'] },
  fog:    { day: ['#9AA1AC', '#D8DBE0'], night: ['#2A2E36', '#565C66'] },
  rain:   { day: ['#33475C', '#5F82A6'], night: ['#141B26', '#33475C'] },
  snow:   { day: ['#6C8CAE', '#E6EEF5'], night: ['#22303F', '#6C8CAE'] },
  storm:  { day: ['#2B2E3D', '#8A6FB0'], night: ['#0F1017', '#4A3F66'] },
};

export function horizonGradient(family: ConditionFamily, isDay: boolean): string {
  const [from, to] = isDay ? PALETTES[family].day : PALETTES[family].night;
  return `linear-gradient(90deg, ${from}, ${to})`;
}
