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

// Full-screen sky backdrop, top-to-bottom. Richer and darker than the
// horizon line so light UI text stays legible over it.
const SKY_PALETTES: Record<ConditionFamily, { day: [string, string]; night: [string, string] }> = {
  clear:  { day: ['#2E5A9E', '#6FA0D8'], night: ['#050813', '#101A33'] },
  cloudy: { day: ['#5B6B82', '#8B96A8'], night: ['#0C0F16', '#1E232E'] },
  fog:    { day: ['#7C8590', '#A9B0B9'], night: ['#111318', '#2A2E35'] },
  rain:   { day: ['#1F2B3B', '#3C5670'], night: ['#05070C', '#131D29'] },
  snow:   { day: ['#3E5876', '#8FAEC9'], night: ['#0A0F1A', '#1C2C42'] },
  storm:  { day: ['#161821', '#332C44'], night: ['#030308', '#150F22'] },
};

export function skyGradient(family: ConditionFamily, isDay: boolean): string {
  const [top, bottom] = isDay ? SKY_PALETTES[family].day : SKY_PALETTES[family].night;
  return `linear-gradient(180deg, ${top}, ${bottom})`;
}