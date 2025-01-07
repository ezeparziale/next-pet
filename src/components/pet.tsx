"use client";

import usePetStore from "@/stores/pet-store";
import { Button } from "./ui/button";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState, useCallback } from "react";
import { Pencil } from "lucide-react"; // Import BookOpen icon
import { PixelScreen } from "./pixel-screen";
import { SPRITES } from "@/lib/sprites";
import { PetSkeleton } from "./pet-skeleton";

type PetStates = keyof typeof SPRITES;

const INTERVAL_MS_5_MINUTES = 300000;

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
  } = usePetStore();

  const [petState, setPetState] = useState<PetStates>("egg");
  const [frame, setFrame] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(name);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isInAction, setIsInAction] = useState(false);

  const updatePetState = useCallback(() => {
    if (isDead) {
      setPetState("dead");
    } else if (isSick && petState != "give_medicine") {
      setPetState("sick_1");
    } else if (isCold) {
      setPetState("shiver");
    } else if (isHot) {
      setPetState("angry");
    } else if (isDirty && petState != "baby_shower") {
      setPetState("baby_dirty");
    }
  }, [isDead, isSick, petState, isCold, isHot, isDirty]);

  useEffect(() => {
    updatePetState();
  }, [updatePetState]);

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
    ];

    const isStateExcluded = excludedStates.includes(petState);

    if (
      !isHot &&
      !isCold &&
      !isDirty &&
      !isSick &&
      !isDead &&
      !isStateExcluded
    ) {
      setPetState("baby_1");
    }
  }, [isHot, isCold, isDirty, isSick, isDead, petState]);

  // Decrease stats every 5 seconds
  useEffect(() => {
    const excludedStates = ["egg", "baby_bath"];

    const interval = setInterval(() => {
      if (!excludedStates.includes(petState)) {
        decreaseStats();
      }
    }, INTERVAL_MS_5_MINUTES);

    return () => clearInterval(interval);
  }, [decreaseStats, petState]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prevFrame) => prevFrame + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    setTimeout(() => {
      setPetState("baby_1");
    }, 23000);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      updateStatsTemp();
    }, 60000); // Update stats every minute

    return () => clearInterval(interval);
  }, [updateStatsTemp]);

  const handleNameEdit = () => {
    setIsEditingName(true);
  };

  const handleNameSave = () => {
    if (newName.trim() !== "") {
      setName(newName.trim());
    }
    setIsEditingName(false);
  };

  const handleFeedHamburger = () => {
    setIsInAction(true);
    setFrame(0);
    if (hunger === 0) {
      setPetState("no");
      setTimeout(() => {
        setPetState("baby_1");
        setIsInAction(false);
      }, 3000);
    } else {
      feedHamburger();
      setPetState("eating_hamburger");
      setTimeout(() => {
        if (isDirty) {
          setPetState("baby_dirty");
        } else {
          setPetState("baby_1");
        }
        setIsInAction(false);
      }, 6000);
    }
  };

  const handleFeedCarrot = () => {
    setIsInAction(true);
    setFrame(0);
    if (hunger === 0) {
      setPetState("no");
      setTimeout(() => {
        setPetState("baby_1");
        setIsInAction(false);
      }, 3000);
    } else {
      feedCarrot();
      setPetState("eating_carrot");
      setTimeout(() => {
        if (isDirty) {
          setPetState("baby_dirty");
        } else {
          setPetState("baby_1");
        }
        setIsInAction(false);
      }, 6000);
    }
  };

  const handleFeedChickenLeg = () => {
    setIsInAction(true);
    setFrame(0);
    if (hunger === 0) {
      setPetState("no");
      setTimeout(() => {
        setPetState("baby_1");
        setIsInAction(false);
      }, 3000);
    } else {
      feedChickenLeg();
      setPetState("eating_chicken_leg");
      setTimeout(() => {
        if (isDirty) {
          setPetState("baby_dirty");
        } else {
          setPetState("baby_1");
        }
        setIsInAction(false);
      }, 7000);
    }
  };

  const handleMedicine = () => {
    setIsInAction(true);
    if (isSick) {
      setFrame(0);
      setPetState("give_medicine");
      setTimeout(() => {
        giveMedicine();
        if (isDirty) {
          setPetState("baby_dirty");
        } else {
          setPetState("baby_1");
        }
        setIsInAction(false);
      }, 3000);
    } else {
      setFrame(0);
      setPetState("no");
      setTimeout(() => {
        if (isDirty) {
          setPetState("baby_dirty");
        } else {
          setPetState("baby_1");
        }
        setIsInAction(false);
      }, 4000);
    }
  };

  const handleFeedIceCream = () => {
    setIsInAction(true);
    feedIceCream();
    setFrame(0);
    setPetState("eating_ice_cream");
    setTimeout(() => {
      if (isDirty) {
        setPetState("baby_dirty");
      } else {
        setPetState("baby_1");
      }
      setIsInAction(false);
    }, 7000);
  };

  const handleFeedNoodle = () => {
    setIsInAction(true);
    setFrame(0);
    if (hunger === 0) {
      setPetState("no");
      setTimeout(() => {
        setPetState("baby_1");
        setIsInAction(false);
      }, 3000);
    } else {
      feedNoodle();
      setPetState("eating_noodle");
      setTimeout(() => {
        if (isDirty) {
          setPetState("baby_dirty");
        } else {
          setPetState("baby_1");
        }
        setIsInAction(false);
      }, 9000);
    }
  };

  const handleFeedWater = () => {
    setIsInAction(true);
    setFrame(0);
    if (thirst === 0) {
      setPetState("no");
      setTimeout(() => {
        setPetState("baby_1");
        setIsInAction(false);
      }, 3000);
    } else {
      feedWater();
      setPetState("drinking_water");
      setTimeout(() => {
        if (isDirty) {
          setPetState("baby_dirty");
        } else {
          setPetState("baby_1");
        }
        setIsInAction(false);
      }, 10000);
    }
  };

  const handleFeedApple = () => {
    setIsInAction(true);
    setFrame(0);
    if (hunger === 0) {
      setPetState("no");
      setTimeout(() => {
        setPetState("baby_1");
        setIsInAction(false);
      }, 3000);
    } else {
      feedApple();
      setPetState("eating_apple");
      setTimeout(() => {
        if (isDirty) {
          setPetState("baby_dirty");
        } else {
          setPetState("baby_1");
        }
        setIsInAction(false);
      }, 6000);
    }
  };

  const handleShower = () => {
    setIsInAction(true);
    if (isDirty) {
      setFrame(0);
      setPetState("baby_shower");
      setTimeout(() => {
        clean();
        setPetState("baby_1");
        setIsInAction(false);
      }, 7000);
    } else {
      setFrame(0);
      setPetState("no");
      setTimeout(() => {
        setPetState("baby_1");
        setIsInAction(false);
      }, 4000);
    }
  };

  const handleReset = () => {
    setIsInAction(true);
    reset();
    setFrame(0);
    setPetState("egg");
    setTimeout(() => {
      setPetState("baby_1");
      setIsInAction(false);
    }, 23000);
  };

  const handleStudy = () => {
    setIsInAction(true);
    study();
    setFrame(0);
    setPetState("studying");
    setTimeout(() => {
      setPetState("baby_1");
      setIsInAction(false);
    }, 3000);
  };

  const handleDiscipline = () => {
    setIsInAction(true);
    disciplineAction();
    setFrame(0);
    setPetState("discipline");
    setTimeout(() => {
      setPetState("baby_1");
      setIsInAction(false);
    }, 1000);
  };

  const handleAirConditioner = () => {
    setIsInAction(true);
    toggleAirConditioner();
    setFrame(0);
    updateStatsTemp();
    updatePetState();
    setIsInAction(false);
  };

  if (!isMounted) return <PetSkeleton />;

  return (
    <div className="p-4 border rounded-md" style={{ maxWidth: "460px" }}>
      <div className="flex justify-between items-center mb-4">
        {isEditingName ? (
          <div className="flex items-center">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="text-2xl font-bold w-[200px] border"
            />
            <Button onClick={handleNameSave} className="ml-2 p-1">
              Save
            </Button>
          </div>
        ) : (
          <h1 className="text-2xl font-bold flex items-center">
            🐾 {name}
            <Button onClick={handleNameEdit} variant="ghost" className="p-1">
              <Pencil className="p-0" />
            </Button>
          </h1>
        )}
        <div>
          <span className="font-bold">Lvl: {level}</span>
          <Progress value={experience} className="w-24 ml-2" />
        </div>
      </div>
      <div className="flex flex-col justify-center mb-4 items-center">
        <PixelScreen state={petState} frame={frame} isLightOn={isLightOn} />
      </div>
      <div className="mb-2">
        <div className="flex items-center">
          <span className="w-24 flex-shrink-0 whitespace-nowrap">
            🍖 Hunger
          </span>
          <div className="flex-grow mx-2">
            <Progress value={hunger} className="w-full" />
          </div>
          <span className="w-12 text-right text-sm">{hunger}%</span>
        </div>
      </div>
      <div className="mb-2">
        <div className="flex items-center">
          <span className="w-24 flex-shrink-0 whitespace-nowrap">
            💧 Thirst
          </span>
          <div className="flex-grow mx-2">
            <Progress value={thirst} className="w-full" />
          </div>
          <span className="w-12 text-right text-sm">{thirst}%</span>
        </div>
      </div>
      <div className="mb-2">
        <div className="flex items-center">
          <span className="w-24 flex-shrink-0 whitespace-nowrap">😄 Happy</span>
          <div className="flex-grow mx-2">
            <Progress value={happiness} className="w-full" />
          </div>
          <span className="w-12 text-right text-sm">{happiness}%</span>
        </div>
      </div>
      <div className="mb-2">
        <div className="flex items-center">
          <span className="w-24 flex-shrink-0 whitespace-nowrap">
            ⚡ Energy
          </span>
          <div className="flex-grow mx-2">
            <Progress value={energy} className="w-full" />
          </div>
          <span className="w-12 text-right text-sm">{energy}%</span>
        </div>
      </div>
      <div className="mb-2">
        <div className="flex items-center">
          <span className="w-24 flex-shrink-0 whitespace-nowrap">
            ❤️ Health
          </span>
          <div className="flex-grow mx-2">
            <Progress value={health} className="w-full" />
          </div>
          <span className="w-12 text-right text-sm">{health}%</span>
        </div>
      </div>
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="w-32 whitespace-nowrap">📚 Discipline</span>
            <div className="flex-grow mx-2">
              <span className="text-sm">{discipline}</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-1">
            <span className="w-20 whitespace-nowrap">💡 Light</span>
            <span className="text-sm w-10 text-right">
              <span className="bg-gray-100 p-1">
                {isLightOn ? "ON" : "OFF"}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="w-52 whitespace-nowrap">
              🌡️ Ambient Temperature
            </span>
            <div className="flex-grow mx-2">
              <span className="text-sm">{ambientTemperature}°C</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-1">
            <span className="w-16 whitespace-nowrap">🌬️ A/C</span>
            <span className="text-sm w-10 text-right">
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
            <div className="flex-grow mx-2">
              <span className="text-sm">{Math.floor(age)} days</span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="w-20 whitespace-nowrap">⚖️ Weight</span>
            <div className="flex-grow mx-2">
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
        <Button onClick={play} disabled={isDead || isInAction}>
          ⚽
        </Button>
        <Button onClick={rest} disabled={isDead || isInAction}>
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
        <Button onClick={toggleLight} disabled={isDead || isInAction}>
          💡
        </Button>
        {isDead && <Button onClick={handleReset}>🔄</Button>}
      </div>
      <div className="mt-4 text-center">
        <span className="text-sm">
          Current Time: {currentTime.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
