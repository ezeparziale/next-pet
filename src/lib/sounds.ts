export const SOUNDS = {
  no: { freq: 110, duration: 0.18, type: "square" }, // A2
  eating_hamburger: { freq: 523, duration: 0.12, type: "square" }, // C5
  eating_ice_cream: { freq: 587, duration: 0.12, type: "square" }, // D5
  eating_apple: { freq: 554, duration: 0.12, type: "square" }, // C#5
  eating_carrot: { freq: 494, duration: 0.12, type: "square" }, // B4
  eating_chicken_leg: { freq: 466, duration: 0.12, type: "square" }, // A#4
  eating_noodle: { freq: 440, duration: 0.12, type: "square" }, // A4
  drinking_water: { freq: 659, duration: 0.09, type: "square" }, // E5
  baby_shower: { freq: 349, duration: 0.08, type: "triangle" }, // F4
  give_medicine: { freq: 220, duration: 0.18, type: "sawtooth" }, // A3
  discipline: { freq: 392, duration: 0.09, type: "square" }, // G4
  studying: { freq: 784, duration: 0.13, type: "triangle" }, // G5
  sleeping_action: { freq: 262, duration: 0.15, type: "triangle" }, // C4
  play: { freq: 880, duration: 0.12, type: "triangle" }, // A5
  rest: { freq: 330, duration: 0.15, type: "triangle" }, // E4
  reset: { freq: 130, duration: 0.2, type: "sawtooth" }, // C3
  clean: { freq: 370, duration: 0.08, type: "triangle" }, // F#4
  toggle_air_conditioner: { freq: 415, duration: 0.1, type: "square" }, // G#4
  toggle_light: { freq: 294, duration: 0.1, type: "triangle" }, // D4
  bedtime: { freq: 247, duration: 0.15, type: "triangle" }, // B3
  alert: { freq: 1047, duration: 0.18, type: "triangle" }, // C6
  birth: [
    { freq: 784, duration: 0.3, type: "triangle" }, // G5
    { freq: 988, duration: 0.3, type: "triangle" }, // B5
    { freq: 1047, duration: 0.3, type: "triangle" }, // C6
    { freq: 1319, duration: 0.3, type: "triangle" }, // E6
  ],
  toggle_sound: { freq: 350, duration: 0.12, type: "triangle" },
} as const

export type SoundType = keyof typeof SOUNDS
