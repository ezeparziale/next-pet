import { SPRITES } from "@/lib/sprites"

type SpriteState = keyof typeof SPRITES

export const PixelScreen = ({
  state,
  frame,
  isLightOn,
}: {
  state: SpriteState
  frame: number
  isLightOn: boolean
}) => {
  const getPixelColor = (value: number) => {
    if (isLightOn) {
      return value === 1 ? "bg-black" : "bg-gray-200"
    } else {
      return value === 1 ? "bg-gray-200" : "bg-black"
    }
  }

  const currentSprite = SPRITES[state]?.[frame % SPRITES[state].length] || []

  return (
    <div className="grid h-64 w-80 grid-cols-[repeat(20,_1fr)] gap-0.5">
      {currentSprite.flat().map((pixel, index) => (
        <div key={index} className={`h-full w-full ${getPixelColor(pixel)}`}></div>
      ))}
    </div>
  )
}
