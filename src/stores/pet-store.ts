import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PetState {
  name: string;
  hunger: number;
  happiness: number;
  energy: number;
  health: number;
  isSick: boolean;
  sickSince: Date | null;
  sickDuration: number;
  isDead: boolean;
  level: number;
  experience: number;
  isAirConditionerOn: boolean;
  ambientTemperature: number;
  age: number;
  birthDate: Date | null;
  weight: number;
  isDirty: boolean;
  playCount: number;
  isCold: boolean;
  isHot: boolean;
  thirst: number;
  discipline: string;
  isLightOn: boolean;
  isBedtime: boolean;
  feedHamburger: () => void;
  feedApple: () => void;
  feedIceCream: () => void;
  feedCarrot: () => void;
  feedNoodle: () => void;
  feedChickenLeg: () => void;
  feedWater: () => void;
  play: () => void;
  rest: () => void;
  giveMedicine: () => void;
  decreaseStats: () => void;
  gainExperience: (amount: number) => void;
  reset: () => void;
  setName: (name: string) => void;
  toggleAirConditioner: () => void;
  clean: () => void;
  study: () => void;
  disciplineAction: () => void;
  toggleLight: () => void;
  updateStatsTemp: () => void;
  updateBedtime: () => void;
}

const DISCIPLINE_ORDER = ["F", "E", "D", "C", "B", "B+", "A", "A+"];

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

      feedHamburger: () =>
        set((state) => {
          if (state.isSick) return state;
          state.gainExperience(5);
          return {
            hunger: Math.max(0, state.hunger - 12.5),
            weight: state.weight + 0.1,
          };
        }),

      feedApple: () =>
        set((state) => {
          if (state.isSick) return state;
          state.gainExperience(2);
          return {
            hunger: Math.max(0, state.hunger - 5),
          };
        }),

      feedIceCream: () =>
        set((state) => {
          if (state.isSick) return state;
          state.gainExperience(5);
          return {
            happiness: Math.min(100, state.happiness + 20),
            weight: state.weight + 0.2,
          };
        }),

      feedCarrot: () =>
        set((state) => {
          if (state.isSick) return state;
          state.gainExperience(2);
          return {
            hunger: Math.max(0, state.hunger - 5),
          };
        }),

      feedNoodle: () =>
        set((state) => {
          if (state.isSick) return state;
          state.gainExperience(2);
          return {
            hunger: Math.max(0, state.hunger - 10),
            weight: state.weight + 0.1,
          };
        }),

      feedChickenLeg: () =>
        set((state) => {
          if (state.isSick) return state;
          state.gainExperience(5);
          return {
            hunger: Math.max(0, state.hunger - 15),
            weight: state.weight + 0.2,
          };
        }),

      feedWater: () =>
        set((state) => {
          if (state.isSick) return state;
          state.gainExperience(2);
          return {
            thirst: Math.max(0, state.thirst - 20),
          };
        }),

      play: () =>
        set((state) => {
          if (state.isSick) {
            return { energy: Math.max(0, state.energy - 5) };
          }
          const newPlayCount = state.isDirty ? 10 : state.playCount + 1;
          const isDirty = newPlayCount === 10;
          state.gainExperience(10);
          return {
            happiness: Math.min(100, state.happiness + 15),
            energy: Math.max(0, state.energy - 10),
            hunger: Math.min(100, state.hunger + 10),
            isDirty,
            playCount: newPlayCount,
          };
        }),

      rest: () =>
        set((state) => {
          if (state.isSick) return state;
          state.gainExperience(3);
          return {
            energy: Math.min(100, state.energy + 30),
            happiness: Math.min(100, state.happiness + 5),
          };
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
          if (state.isDead) return state;

          const shouldDecreaseDiscipline = Math.random() < 0.5; // 50% chance to decrease discipline
          const currentIndex = DISCIPLINE_ORDER.indexOf(state.discipline);
          const newDiscipline =
            shouldDecreaseDiscipline && currentIndex > 0
              ? DISCIPLINE_ORDER[currentIndex - 1]
              : state.discipline;

          const hungerIncrease = state.isSick ? 10 : 5;
          const happinessDecrease = state.isSick ? 10 : 5;
          const energyDecrease = state.isSick ? 15 : 5;
          const thirstIncrease = state.isSick ? 10 : 5;
          let healthDecrease = state.isSick ? 20 : 10;

          if (state.isSick && state.sickSince) {
            const timeSinceSick =
              new Date().getTime() - new Date(state.sickSince).getTime();
            if (timeSinceSick > state.sickDuration) {
              healthDecrease = 5;
            }
          }

          const newHealth = Math.max(
            0,
            Math.min(
              100,
              state.hunger >= 90 || state.happiness <= 20 || state.thirst >= 90
                ? state.health - healthDecrease
                : state.health
            )
          );

          const shouldGetSick =
            !state.isSick &&
            (state.hunger >= 80 ||
              state.happiness <= 30 ||
              state.energy <= 20 ||
              state.thirst >= 80) &&
            Math.random() < 0.3;

          const newAge = state.birthDate
            ? Math.floor(
                (new Date().setHours(0, 0, 0, 0) -
                  new Date(state.birthDate).setHours(0, 0, 0, 0)) /
                  (1000 * 60 * 60 * 24)
              )
            : state.age;

          state.updateBedtime();

          return {
            hunger: Math.min(state.hunger + hungerIncrease, 100),
            happiness: Math.max(state.happiness - happinessDecrease, 0),
            energy: Math.max(state.energy - energyDecrease, 0),
            thirst: Math.min(state.thirst + thirstIncrease, 100),
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
          };
        }),

      gainExperience: (amount) =>
        set((state) => {
          const newExperience = state.experience + amount;
          if (newExperience >= 100) {
            return {
              level: state.level + 1,
              experience: newExperience - 100,
            };
          }
          return { experience: newExperience };
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
          const HAPPINESS_COST = 5; // Happiness decrease per study session
          const ENERGY_COST = 10; // Energy decrease per study session

          // Get the current and next discipline index
          const currentIndex = DISCIPLINE_ORDER.indexOf(state.discipline);
          const nextIndex = Math.min(
            currentIndex + 1,
            DISCIPLINE_ORDER.length - 1
          );

          // Update state with new discipline, happiness, and energy
          return {
            discipline: DISCIPLINE_ORDER[nextIndex],
            happiness: Math.max(0, state.happiness - HAPPINESS_COST),
            energy: Math.max(0, state.energy - ENERGY_COST),
          };
        }),

      disciplineAction: () =>
        set((state) => {
          const HAPPINESS_GAIN = 5; // Happiness increase per discipline action

          // Get the current and next discipline index
          const currentIndex = DISCIPLINE_ORDER.indexOf(state.discipline);
          const nextIndex = Math.min(
            currentIndex + 1,
            DISCIPLINE_ORDER.length - 1
          );

          // Update state with new discipline and happiness
          return {
            discipline: DISCIPLINE_ORDER[nextIndex],
            happiness: Math.min(100, state.happiness + HAPPINESS_GAIN),
          };
        }),

      toggleLight: () =>
        set((state) => ({
          isLightOn: !state.isLightOn,
        })),

      updateStatsTemp: () =>
        set((state) => {
          const temperatureChange = state.isAirConditionerOn ? -1 : 1;
          const newTemperature = Math.max(
            18,
            Math.min(35, state.ambientTemperature + temperatureChange)
          );

          const isCold = newTemperature === 18;
          const isHot = newTemperature === 35;

          return {
            ambientTemperature: newTemperature,
            isCold,
            isHot,
          };
        }),

      updateBedtime: () =>
        set(() => {
          const currentHour = new Date().getHours();
          const isBedtime = currentHour >= 20 || currentHour < 8;
          return { isBedtime };
        }),
    }),
    {
      name: "pet-storage",
    }
  )
);

export default usePetStore;
