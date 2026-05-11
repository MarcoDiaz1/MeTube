import { IconType } from 'react-icons/lib'
import {
  GiGalaxy,
  GiGClef,
  GiGalea,
  GiGameConsole,
  GiGearHammer,
  GiGaze,
  GiGlassShot,
  GiGlassHeart,
  GiGoldShell,
  GiGooeyDaemon,
} from 'react-icons/gi'

export const icons: IconType[] = [
  GiGalaxy,
  GiGClef,
  GiGalea,
  GiGameConsole,
  GiGearHammer,
  GiGaze,
  GiGlassShot,
  GiGlassHeart,
  GiGoldShell,
  GiGooeyDaemon,
]

export function parsePexelsUrl(url: string) {
  const segment = url.split('/').filter(Boolean).pop()
  if (!segment) return null

  const parts = segment.split('-')
  parts.pop()

  return parts.join(' ')
}
