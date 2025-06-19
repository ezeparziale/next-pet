import { create } from "zustand"
import { persist } from "zustand/middleware"

import { SpriteState } from "@/components/pixel-screen"

interface PetState {
  name: string
  hunger: number
  happiness: number
  energy: number
  health: number
  isSick: boolean
  sickSince: Date | null
  sickDuration: number
  isDead: boolean
  level: number
  experience: number
  isAirConditionerOn: boolean
  ambientTemperature: number
  age: number
  birthDate: Date | null
  weight: number
  isDirty: boolean
  playCount: number
  isCold: boolean
  isHot: boolean
  thirst: number
  discipline: string
  isLightOn: boolean
  isBedtime: boolean
  isSoundEnabled: boolean
  petState: SpriteState
  feedHamburger: () => void
  feedApple: () => void
  feedIceCream: () => void
  feedCarrot: () => void
  feedNoodle: () => void
  feedChickenLeg: () => void
  feedWater: () => void
  play: () => void
  rest: () => void
  giveMedicine: () => void
  decreaseStats: () => void
  gainExperience: (amount: number) => void
  reset: () => void
  setName: (name: string) => void
  toggleAirConditioner: () => void
  clean: () => void
  study: () => void
  disciplineAction: () => void
  toggleLight: () => void
  updateStatsTemp: () => void
  updateBedtime: () => void
  setIsSoundEnabled: (enabled: boolean) => void
  setPetState: (state: SpriteState) => void
}

const DISCIPLINE_ORDER = ["F", "E", "D", "C", "B", "B+", "A", "A+"]

const usePetStore = create<PetState>()(
  persist(
    (set) => ({
      name: "NextPet",
      hunger: 100,
      thirst: 100,
      happiness: 0,
      energy: 50,
      health: 100,
      isSick: false,
      sickSince: null,
      sickDuration: 0,
      isDead: false,
      level: 1,
      experience: 0,
      isAirConditionerOn: false,
      ambientTemperature: 25,
      age: 0,
      birthDate: null,
      weight: 1,
      isDirty: false,
      playCount: 0,
      isCold: false,
      isHot: false,
      discipline: "E",
      isLightOn: true,
      isBedtime: false,
      isSoundEnabled: true,
      petState: "egg",

      feedHamburger: () =>
        set((state) => {
          if (state.isSick) return state
          state.gainExperience(5)
          return {
            hunger: Math.max(0, state.hunger - 12.5),
            weight: state.weight + 0.1,
          }
        }),

      feedApple: () =>
        set((state) => {
          if (state.isSick) return state
          state.gainExperience(2)
          return {
            hunger: Math.max(0, state.hunger - 5),
          }
        }),

      feedIceCream: () =>
        set((state) => {
          if (state.isSick) return state
          state.gainExperience(5)
          return {
            happiness: Math.min(100, state.happiness + 20),
            weight: state.weight + 0.2,
          }
        }),

      feedCarrot: () =>
        set((state) => {
          if (state.isSick) return state
          state.gainExperience(2)
          return {
            hunger: Math.max(0, state.hunger - 5),
          }
        }),

      feedNoodle: () =>
        set((state) => {
          if (state.isSick) return state
          state.gainExperience(2)
          return {
            hunger: Math.max(0, state.hunger - 10),
            weight: state.weight + 0.1,
          }
        }),

      feedChickenLeg: () =>
        set((state) => {
          if (state.isSick) return state
          state.gainExperience(5)
          return {
            hunger: Math.max(0, state.hunger - 15),
            weight: state.weight + 0.2,
          }
        }),

      feedWater: () =>
        set((state) => {
          if (state.isSick) return state
          state.gainExperience(2)
          return {
            thirst: Math.max(0, state.thirst - 20),
          }
        }),

      play: () =>
        set((state) => {
          if (state.isSick) {
            return { energy: Math.max(0, state.energy - 5) }
          }
          const newPlayCount = state.isDirty ? 10 : state.playCount + 1
          const isDirty = newPlayCount === 10
          state.gainExperience(10)
          return {
            happiness: Math.min(100, state.happiness + 15),
            energy: Math.max(0, state.energy - 10),
            hunger: Math.min(100, state.hunger + 10),
            isDirty,
            playCount: newPlayCount,
          }
        }),

      rest: () =>
        set((state) => {
          if (state.isSick) return state
          state.gainExperience(3)
          return {
            energy: Math.min(100, state.energy + 30),
            happiness: Math.min(100, state.happiness + 5),
          }
        }),

      giveMedicine: () =>
        set((state) => ({
          health: Math.min(100, state.health + 30),
          hunger: 100,
          happiness: 0,
          energy: 0,
          isSick: false,
          sickSince: null,
          sickDuration: 0,
        })),

      decreaseStats: () =>
        set((state) => {
          state.updateBedtime()

          if (state.isDead) return state

          const shouldDecreaseDiscipline = Math.random() < 0.5 // 50% chance to decrease discipline
          const currentIndex = DISCIPLINE_ORDER.indexOf(state.discipline)
          const newDiscipline =
            shouldDecreaseDiscipline && currentIndex > 0
              ? DISCIPLINE_ORDER[currentIndex - 1]
              : state.discipline

          // Adjust stat changes based on whether the pet is sick or not
          let hungerCost = state.isSick ? 10 : 5
          let energyCost = state.isSick ? 15 : 5
          let thirstCost = state.isSick ? 10 : 5
          let healthCost = state.isSick ? 20 : 10
          let happinessCost = state.isSick ? 10 : 5

          if (!state.isBedtime && !state.isLightOn) {
            happinessCost += 10 // Additional happiness decrease if not bedtime and light is off
          }

          // Adjust stats if it is bedtime and the light is off
          if (state.isBedtime && !state.isLightOn) {
            hungerCost = 5
            energyCost = -5
            thirstCost = 5
            healthCost = -5
            happinessCost = -5
          }

          if (state.isSick && state.sickSince) {
            const timeSinceSick =
              new Date().getTime() - new Date(state.sickSince).getTime()
            if (timeSinceSick > state.sickDuration) {
              healthCost = 5
            }
          }

          const newHealth = Math.max(
            0,
            Math.min(
              100,
              state.hunger >= 90 || state.happiness <= 20 || state.thirst >= 90
                ? state.health - healthCost
                : state.health,
            ),
          )

          const shouldGetSick =
            !state.isSick &&
            !state.isBedtime && // Prevent getting sick if it is bedtime
            (state.hunger >= 80 ||
              state.happiness <= 30 ||
              state.energy <= 20 ||
              state.thirst >= 80) &&
            Math.random() < 0.3

          const newAge = state.birthDate
            ? Math.floor(
                (new Date().setHours(0, 0, 0, 0) -
                  new Date(state.birthDate).setHours(0, 0, 0, 0)) /
                  (1000 * 60 * 60 * 24),
              )
            : state.age

          return {
            hunger: Math.min(Math.max(state.hunger + hungerCost, 0), 100),
            happiness: Math.min(Math.max(state.happiness - happinessCost, 0), 100),
            energy: Math.min(Math.max(state.energy - energyCost, 0), 100),
            thirst: Math.min(Math.max(state.thirst + thirstCost, 0), 100),
            health: newHealth,
            isDead: newHealth === 0,
            isSick: state.isSick || shouldGetSick,
            sickSince:
              state.isSick || shouldGetSick
                ? state.sickSince || new Date()
                : state.sickSince,
            sickDuration: state.isSick || shouldGetSick ? 60000 : 0,
            age: newAge,
            discipline: newDiscipline,
          }
        }),

      gainExperience: (amount) =>
        set((state) => {
          const newExperience = state.experience + amount
          if (newExperience >= 100) {
            return {
              level: state.level + 1,
              experience: newExperience - 100,
            }
          }
          return { experience: newExperience }
        }),

      reset: () =>
        set(() => ({
          name: "NextPet",
          hunger: 100,
          thirst: 100,
          happiness: 50,
          energy: 50,
          health: 100,
          isSick: false,
          sickSince: null,
          sickDuration: 0,
          isDead: false,
          level: 1,
          experience: 0,
          isAirConditionerOn: false,
          ambientTemperature: 25,
          age: 0,
          birthDate: new Date(),
          weight: 5,
          isDirty: false,
          playCount: 0,
          isCold: false,
          isHot: false,
          discipline: "E",
          isLightOn: true,
          isBedtime: false,
          isSoundEnabled: true,
          petState: "egg",
        })),

      setName: (name: string) => set({ name }),

      toggleAirConditioner: () =>
        set((state) => ({
          isAirConditionerOn: !state.isAirConditionerOn,
        })),

      clean: () =>
        set(() => ({
          isDirty: false,
          playCount: 0,
        })),

      /**
       * Updates the current discipline of the pet, simulating a study action.
       * Decreases happiness and energy as a trade-off for improving discipline.
       */
      study: () =>
        set((state) => {
          const HAPPINESS_COST = 5 // Happiness decrease per study session
          const ENERGY_COST = 10 // Energy decrease per study session

          // Get the current and next discipline index
          const currentIndex = DISCIPLINE_ORDER.indexOf(state.discipline)
          const nextIndex = Math.min(currentIndex + 1, DISCIPLINE_ORDER.length - 1)

          // Update state with new discipline, happiness, and energy
          return {
            discipline: DISCIPLINE_ORDER[nextIndex],
            happiness: Math.max(0, state.happiness - HAPPINESS_COST),
            energy: Math.max(0, state.energy - ENERGY_COST),
          }
        }),

      disciplineAction: () =>
        set((state) => {
          const HAPPINESS_GAIN = 5 // Happiness increase per discipline action

          // Get the current and next discipline index
          const currentIndex = DISCIPLINE_ORDER.indexOf(state.discipline)
          const nextIndex = Math.min(currentIndex + 1, DISCIPLINE_ORDER.length - 1)

          // Update state with new discipline and happiness
          return {
            discipline: DISCIPLINE_ORDER[nextIndex],
            happiness: Math.min(100, state.happiness + HAPPINESS_GAIN),
          }
        }),

      toggleLight: () =>
        set((state) => ({
          isLightOn: !state.isLightOn,
        })),

      updateStatsTemp: () =>
        set((state) => {
          const temperatureChange = state.isAirConditionerOn ? -1 : 1
          const newTemperature = Math.max(
            18,
            Math.min(35, state.ambientTemperature + temperatureChange),
          )

          const isCold = newTemperature === 18
          const isHot = newTemperature === 35

          return {
            ambientTemperature: newTemperature,
            isCold,
            isHot,
          }
        }),

      updateBedtime: () =>
        set(() => {
          const currentHour = new Date().getHours()
          const isBedtime = currentHour >= 20 || currentHour < 8
          return { isBedtime }
        }),

      setIsSoundEnabled: (enabled: boolean) =>
        set(() => ({
          isSoundEnabled: enabled,
        })),

      setPetState: (state: string) => set({ petState: state }),
    }),
    {
      name: "pet-storage",
    },
  ),
)

export default usePetStore
