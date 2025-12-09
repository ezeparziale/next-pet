import { useState } from "react"

const detectOS = () => {
  if (typeof window === "undefined") {
    return "Unknown"
  }
  const userAgent = window.navigator.userAgent
  if (userAgent.indexOf("Win") !== -1) return "Windows"
  if (userAgent.indexOf("Mac") !== -1) return "MacOS"
  if (userAgent.indexOf("Linux") !== -1) return "Linux"
  if (userAgent.indexOf("Android") !== -1) return "Android"
  if (userAgent.indexOf("like Mac") !== -1) return "iOS"
  return "Unknown"
}

export function useOperatingSystem() {
  const [os] = useState<"Windows" | "MacOS" | "Linux" | "Android" | "iOS" | "Unknown">(
    detectOS,
  )

  return {
    os,
    isWindows: os === "Windows",
    isMacOS: os === "MacOS",
    isLinux: os === "Linux",
    isAndroid: os === "Android",
    isIOS: os === "iOS",
  }
}
