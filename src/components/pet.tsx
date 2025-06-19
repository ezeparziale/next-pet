"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import usePetStore from "@/stores/pet-store"
import { Pencil } from "lucide-react"

import { SOUNDS } from "@/lib/sounds"
import { SPRITES } from "@/lib/sprites"
import { Progress } from "@/components/ui/progress"

import { PetSkeleton } from "./pet-skeleton"
import { PixelScreen } from "./pixel-screen"
import { Button } from "./ui/button"

type PetStates = keyof typeof SPRITES

const INTERVAL_MS_5_MINUTES = 300000

export default function Pet() {
  const {
    name,
    hunger,
    happiness,
    energy,
    health,
    isSick,
    isDead,
    feedHamburger,
    feedIceCream,
    feedApple,
    feedCarrot,
    feedChickenLeg,
    feedNoodle,
    play,
    rest,
    giveMedicine,
    decreaseStats,
    reset,
    level,
    experience,
    setName,
    isAirConditionerOn,
    ambientTemperature,
    toggleAirConditioner,
    age,
    weight,
    isDirty,
    clean,
    isCold,
    isHot,
    thirst,
    feedWater,
    discipline,
    study,
    disciplineAction,
    toggleLight,
    isLightOn,
    updateStatsTemp,
    isBedtime,
    updateBedtime,
    petState,
    setPetState,
  } = usePetStore()

  const [frame, setFrame] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [newName, setNewName] = useState(name)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isInAction, setIsInAction] = useState(false)
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)

  const [prevIsDirty, setPrevIsDirty] = useState(isDirty)
  const [prevIsSick, setPrevIsSick] = useState(isSick)
  const [prevIsHot, setPrevIsHot] = useState(isHot)
  const [prevIsCold, setPrevIsCold] = useState(isCold)
  const [prevHunger, setPrevHunger] = useState(hunger)
  const [prevThirst, setPrevThirst] = useState(thirst)

  const playSound = useCallback(
    (sound: keyof typeof SOUNDS) => {
      if (!isSoundEnabled) return

      const AudioCtx =
        window.AudioContext ||
        (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return

      if (sound === "birth") {
        const sequence = SOUNDS.birth as Array<{
          freq: number
          duration: number
          type: OscillatorType
        }>
        let ctx: AudioContext | null = null
        let time = 0
        sequence.forEach(({ freq, duration, type }, idx) => {
          setTimeout(() => {
            ctx = new AudioCtx()
            const o = ctx.createOscillator()
            const g = ctx.createGain()
            o.type = type
            o.frequency.value = freq
            o.connect(g)
            g.connect(ctx!.destination)
            g.gain.value = 0.15
            o.start()
            o.stop(ctx!.currentTime + duration)
            o.onended = () => ctx && ctx.close()
          }, time * 1000)
          time += duration
        })
        return
      }

      const s = SOUNDS[sound] as {
        freq: number
        duration: number
        type: OscillatorType
      }
      const ctx = new AudioCtx()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      const { freq, duration, type } = s
      o.type = type
      o.frequency.value = freq
      o.connect(g)
      g.connect(ctx.destination)
      g.gain.value = 0.15
      o.start()
      o.stop(ctx.currentTime + duration)
      o.onended = () => ctx.close()
    },
    [isSoundEnabled],
  )

  const updatePetState = useCallback(() => {
    if (isDead) {
      setPetState("dead")
    } else if (isBedtime) {
      setPetState("sleeping")
    } else if (isSick && petState != "give_medicine") {
      setPetState("sick_1")
    } else if (isCold) {
      setPetState("shiver")
    } else if (isHot) {
      setPetState("angry")
    } else if (isDirty && petState != "baby_shower") {
      setPetState("baby_dirty")
    }
  }, [isDead, isBedtime, isSick, petState, isCold, isHot, isDirty, setPetState])

  useEffect(() => {
    updatePetState()
  }, [updatePetState])

  useEffect(() => {
    const excludedStates = [
      "egg",
      "baby_shower",
      "no",
      "eating_ice_cream",
      "eating_hamburger",
      "eating_apple",
      "eating_carrot",
      "eating_chicken_leg",
      "eating_noodle",
      "drinking_water",
      "studying",
      "discipline",
      "sleeping",
    ]

    const isStateExcluded = excludedStates.includes(petState)

    if (!isHot && !isCold && !isDirty && !isSick && !isDead && !isStateExcluded) {
      setPetState("baby_1")
    }
  }, [isHot, isCold, isDirty, isSick, isDead, petState])

  // Decrease stats every 5 seconds
  useEffect(() => {
    const excludedStates = ["egg", "baby_bath"]

    const interval = setInterval(() => {
      if (!excludedStates.includes(petState)) {
        decreaseStats()
      }
    }, INTERVAL_MS_5_MINUTES)

    return () => clearInterval(interval)
  }, [decreaseStats, petState])

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prevFrame) => prevFrame + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setIsMounted(true)
    if (petState === "egg") {
      const birthTimeout = setTimeout(() => {
        setPetState("baby_1")
        playSound("birth")
      }, 23000)
      return () => clearTimeout(birthTimeout)
    }
  }, [playSound, petState, setPetState])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      updateStatsTemp()
    }, 60000) // Update stats every minute

    return () => clearInterval(interval)
  }, [updateStatsTemp])

  useEffect(() => {
    const interval = setInterval(() => {
      updateBedtime()
    }, 60000) // Check bedtime every minute

    return () => clearInterval(interval)
  }, [updateBedtime])

  const handleNameEdit = () => {
    setIsEditingName(true)
  }

  const handleNameSave = () => {
    if (newName.trim() !== "") {
      setName(newName.trim())
    }
    setIsEditingName(false)
  }

  const PET_STATE_SOUNDS = useMemo<
    Partial<Record<PetStates, keyof typeof SOUNDS>>
  >(() => {
    const mapping: Partial<Record<PetStates, keyof typeof SOUNDS>> = {}
    Object.keys(SOUNDS).forEach((sound) => {
      mapping[sound as PetStates] = sound as keyof typeof SOUNDS
    })
    return mapping
  }, [])

  const setPetStateWithSound = useCallback(
    (state: PetStates) => {
      setPetState(state)
      const sound = PET_STATE_SOUNDS[state]
      if (sound) playSound(sound)
    },
    [PET_STATE_SOUNDS, playSound],
  )

  const handleFeedHamburger = () => {
    setIsInAction(true)
    setFrame(0)
    if (hunger === 0) {
      setPetStateWithSound("no")
      setTimeout(() => {
        setPetState("baby_1")
        setIsInAction(false)
      }, 3000)
    } else {
      feedHamburger()
      setPetStateWithSound("eating_hamburger")
      setTimeout(() => {
        if (isDirty) {
          setPetState("baby_dirty")
        } else {
          setPetState("baby_1")
        }
        setIsInAction(false)
      }, 6000)
    }
  }

  const handleFeedCarrot = () => {
    setIsInAction(true)
    setFrame(0)
    if (hunger === 0) {
      setPetStateWithSound("no")
      setTimeout(() => {
        setPetState("baby_1")
        setIsInAction(false)
      }, 3000)
    } else {
      feedCarrot()
      setPetStateWithSound("eating_carrot")
      setTimeout(() => {
        if (isDirty) {
          setPetState("baby_dirty")
        } else {
          setPetState("baby_1")
        }
        setIsInAction(false)
      }, 6000)
    }
  }

  const handleFeedChickenLeg = () => {
    setIsInAction(true)
    setFrame(0)
    if (hunger === 0) {
      setPetStateWithSound("no")
      setTimeout(() => {
        setPetState("baby_1")
        setIsInAction(false)
      }, 3000)
    } else {
      feedChickenLeg()
      setPetStateWithSound("eating_chicken_leg")
      setTimeout(() => {
        if (isDirty) {
          setPetState("baby_dirty")
        } else {
          setPetState("baby_1")
        }
        setIsInAction(false)
      }, 7000)
    }
  }

  const handleMedicine = () => {
    setIsInAction(true)
    if (isSick) {
      setFrame(0)
      setPetStateWithSound("give_medicine")
      setTimeout(() => {
        giveMedicine()
        if (isDirty) {
          setPetState("baby_dirty")
        } else {
          setPetState("baby_1")
        }
        setIsInAction(false)
      }, 3000)
    } else {
      setFrame(0)
      setPetStateWithSound("no")
      setTimeout(() => {
        if (isDirty) {
          setPetState("baby_dirty")
        } else {
          setPetState("baby_1")
        }
        setIsInAction(false)
      }, 4000)
    }
  }

  const handleFeedIceCream = () => {
    setIsInAction(true)
    feedIceCream()
    setFrame(0)
    setPetStateWithSound("eating_ice_cream")
    setTimeout(() => {
      if (isDirty) {
        setPetState("baby_dirty")
      } else {
        setPetState("baby_1")
      }
      setIsInAction(false)
    }, 7000)
  }

  const handleFeedNoodle = () => {
    setIsInAction(true)
    setFrame(0)
    if (hunger === 0) {
      setPetStateWithSound("no")
      setTimeout(() => {
        setPetState("baby_1")
        setIsInAction(false)
      }, 3000)
    } else {
      feedNoodle()
      setPetStateWithSound("eating_noodle")
      setTimeout(() => {
        if (isDirty) {
          setPetState("baby_dirty")
        } else {
          setPetState("baby_1")
        }
        setIsInAction(false)
      }, 9000)
    }
  }

  const handleFeedWater = () => {
    setIsInAction(true)
    setFrame(0)
    if (thirst === 0) {
      setPetStateWithSound("no")
      setTimeout(() => {
        setPetState("baby_1")
        setIsInAction(false)
      }, 3000)
    } else {
      feedWater()
      setPetStateWithSound("drinking_water")
      setTimeout(() => {
        if (isDirty) {
          setPetState("baby_dirty")
        } else {
          setPetState("baby_1")
        }
        setIsInAction(false)
      }, 10000)
    }
  }

  const handleFeedApple = () => {
    setIsInAction(true)
    setFrame(0)
    if (hunger === 0) {
      setPetStateWithSound("no")
      setTimeout(() => {
        setPetState("baby_1")
        setIsInAction(false)
      }, 3000)
    } else {
      feedApple()
      setPetStateWithSound("eating_apple")
      setTimeout(() => {
        if (isDirty) {
          setPetState("baby_dirty")
        } else {
          setPetState("baby_1")
        }
        setIsInAction(false)
      }, 6000)
    }
  }

  const handleShower = () => {
    setIsInAction(true)
    if (isDirty) {
      setFrame(0)
      setPetStateWithSound("baby_shower")
      setTimeout(() => {
        clean()
        setPetState("baby_1")
        setIsInAction(false)
      }, 7000)
    } else {
      setFrame(0)
      setPetStateWithSound("no")
      setTimeout(() => {
        setPetState("baby_1")
        setIsInAction(false)
      }, 4000)
    }
  }

  const handleReset = () => {
    setIsInAction(true)
    reset()
    setFrame(0)
    setPetState("egg")
    setTimeout(() => {
      setPetState("baby_1")
      setIsInAction(false)
    }, 23000)
  }

  const handleStudy = () => {
    setIsInAction(true)
    study()
    setFrame(0)
    setPetStateWithSound("studying")
    setTimeout(() => {
      setPetState("baby_1")
      setIsInAction(false)
    }, 3000)
  }

  const handleDiscipline = () => {
    setIsInAction(true)
    disciplineAction()
    setFrame(0)
    setPetStateWithSound("discipline")
    setTimeout(() => {
      setPetState("baby_1")
      setIsInAction(false)
    }, 1000)
  }

  const handlePlay = () => {
    setIsInAction(true)
    play()
    setFrame(0)
    playSound("play")
    setTimeout(() => {
      setPetState("baby_1")
      setIsInAction(false)
    }, 2000)
  }

  const handleRest = () => {
    setIsInAction(true)
    rest()
    setFrame(0)
    playSound("rest")
    setTimeout(() => {
      setPetState("baby_1")
      setIsInAction(false)
    }, 2000)
  }

  const handleAirConditioner = () => {
    setIsInAction(true)
    toggleAirConditioner()
    setFrame(0)
    playSound("toggle_air_conditioner")
    updateStatsTemp()
    updatePetState()
    setIsInAction(false)
  }

  const handleToggleLight = () => {
    toggleLight()
    playSound("toggle_light")
  }

  useEffect(() => {
    if (!isDead) {
      if (!prevIsDirty && isDirty) playSound("alert")
      if (!prevIsSick && isSick) playSound("alert")
      if (!prevIsHot && isHot) playSound("alert")
      if (!prevIsCold && isCold) playSound("alert")
      if (prevHunger > 20 && hunger <= 20) playSound("alert")
      if (prevThirst > 20 && thirst <= 20) playSound("alert")
    }
    setPrevIsDirty(isDirty)
    setPrevIsSick(isSick)
    setPrevIsHot(isHot)
    setPrevIsCold(isCold)
    setPrevHunger(hunger)
    setPrevThirst(thirst)
  }, [
    isDirty,
    isSick,
    isHot,
    isCold,
    hunger,
    thirst,
    prevIsDirty,
    prevIsSick,
    prevIsHot,
    prevIsCold,
    prevHunger,
    prevThirst,
    isDead,
    playSound,
  ])

  if (!isMounted) return <PetSkeleton />

  return (
    <div className="max-w-[460px] rounded-md border-0 p-4 md:border">
      <div className="mb-4 flex items-center justify-between">
        {isEditingName ? (
          <div className="flex items-center">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-[200px] border text-2xl font-bold"
            />
            <Button onClick={handleNameSave} className="ml-2 p-1">
              Save
            </Button>
          </div>
        ) : (
          <h1 className="flex items-center text-2xl font-bold">
            🐾 {name}
            <Button onClick={handleNameEdit} variant="ghost" className="p-1">
              <Pencil className="p-0" />
            </Button>
          </h1>
        )}
        <div>
          <span className="font-bold">Lvl: {level}</span>
          <Progress value={experience} className="ml-2 w-24" />
        </div>
      </div>
      <div className="mb-4 flex flex-col items-center justify-center">
        <PixelScreen state={petState} frame={frame} isLightOn={isLightOn} />
      </div>
      <div className="mb-2">
        <div className="flex items-center">
          <span className="w-24 flex-shrink-0 whitespace-nowrap">🍖 Hunger</span>
          <div className="mx-2 flex-grow">
            <Progress value={hunger} className="w-full" />
          </div>
          <span className="w-12 text-right text-sm">{hunger}%</span>
        </div>
      </div>
      <div className="mb-2">
        <div className="flex items-center">
          <span className="w-24 flex-shrink-0 whitespace-nowrap">💧 Thirst</span>
          <div className="mx-2 flex-grow">
            <Progress value={thirst} className="w-full" />
          </div>
          <span className="w-12 text-right text-sm">{thirst}%</span>
        </div>
      </div>
      <div className="mb-2">
        <div className="flex items-center">
          <span className="w-24 flex-shrink-0 whitespace-nowrap">😄 Happy</span>
          <div className="mx-2 flex-grow">
            <Progress value={happiness} className="w-full" />
          </div>
          <span className="w-12 text-right text-sm">{happiness}%</span>
        </div>
      </div>
      <div className="mb-2">
        <div className="flex items-center">
          <span className="w-24 flex-shrink-0 whitespace-nowrap">⚡ Energy</span>
          <div className="mx-2 flex-grow">
            <Progress value={energy} className="w-full" />
          </div>
          <span className="w-12 text-right text-sm">{energy}%</span>
        </div>
      </div>
      <div className="mb-2">
        <div className="flex items-center">
          <span className="w-24 flex-shrink-0 whitespace-nowrap">❤️ Health</span>
          <div className="mx-2 flex-grow">
            <Progress value={health} className="w-full" />
          </div>
          <span className="w-12 text-right text-sm">{health}%</span>
        </div>
      </div>
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="w-32 whitespace-nowrap">📚 Discipline</span>
            <div className="mx-2 flex-grow">
              <span className="text-sm">{discipline}</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-1">
            <span className="w-20 whitespace-nowrap">💡 Light</span>
            <span className="w-10 text-right text-sm">
              <span className="bg-gray-100 p-1">{isLightOn ? "ON" : "OFF"}</span>
            </span>
          </div>
        </div>
      </div>
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="w-52 whitespace-nowrap">🌡️ Ambient Temperature</span>
            <div className="mx-2 flex-grow">
              <span className="text-sm">{ambientTemperature}°C</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-1">
            <span className="w-16 whitespace-nowrap">🌬️ A/C</span>
            <span className="w-10 text-right text-sm">
              <span className="bg-gray-100 p-1">
                {isAirConditionerOn ? "ON" : "OFF"}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="w-20 whitespace-nowrap">🎂 Age</span>
            <div className="mx-2 flex-grow">
              <span className="text-sm">{Math.floor(age)} days</span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="w-20 whitespace-nowrap">⚖️ Weight</span>
            <div className="mx-2 flex-grow">
              <span className="text-sm">{weight.toFixed(1)} kg</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-8 gap-0.5">
        <Button onClick={handleFeedHamburger} disabled={isDead || isInAction}>
          🍔
        </Button>
        <Button onClick={handleFeedIceCream} disabled={isDead || isInAction}>
          🍦
        </Button>
        <Button onClick={handleFeedApple} disabled={isDead || isInAction}>
          🍎
        </Button>
        <Button onClick={handleFeedCarrot} disabled={isDead || isInAction}>
          🥕
        </Button>
        <Button onClick={handleFeedChickenLeg} disabled={isDead || isInAction}>
          🍗
        </Button>
        <Button onClick={handleFeedNoodle} disabled={isDead || isInAction}>
          🍝
        </Button>
        <Button onClick={handleFeedWater} disabled={isDead || isInAction}>
          💧
        </Button>
        <Button onClick={handlePlay} disabled={isDead || isInAction}>
          ⚽
        </Button>
        <Button onClick={handleRest} disabled={isDead || isInAction}>
          🛌
        </Button>
        <Button onClick={handleMedicine} disabled={isDead || isInAction}>
          💊
        </Button>
        <Button onClick={handleShower} disabled={isDead || isInAction}>
          🚿
        </Button>
        <Button onClick={handleAirConditioner} disabled={isDead || isInAction}>
          🌬️
        </Button>
        <Button onClick={handleStudy} disabled={isDead || isInAction}>
          📖
        </Button>
        <Button onClick={handleDiscipline} disabled={isDead || isInAction}>
          💗
        </Button>
        <Button onClick={handleToggleLight} disabled={isDead || isInAction}>
          💡
        </Button>
        <Button
          onClick={() => setIsSoundEnabled(!isSoundEnabled)}
          disabled={isDead || isInAction}
        >
          {isSoundEnabled ? "🔊" : "🔇"}
        </Button>
        {isDead && <Button onClick={handleReset}>🔄</Button>}
      </div>
      <div className="mt-4 text-center">
        <span className="text-sm">
          Current Time: {currentTime.toLocaleTimeString()}
        </span>
      </div>
    </div>
  )
}
