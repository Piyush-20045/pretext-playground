import { ORB_PALETTE, MAX_ORBS } from './constants.js'
import { createRandomOrb } from './orbs.js'
import { updateAddOrbButton } from './loop.js'

export function spawnOrb(bounds, context) {
  const { orbs, orbsLayer, addOrbBtn } = context
  if (orbs.length >= MAX_ORBS) return

  const color = ORB_PALETTE[Math.floor(Math.random() * ORB_PALETTE.length)]
  const r = 54 + Math.random() * 36
  const x = bounds.left + r + Math.random() * Math.max(1, bounds.right - bounds.left - 2 * r)
  const y = bounds.top + r + Math.random() * Math.max(1, bounds.bottom - bounds.top - 2 * r)
  
  orbs.push(createRandomOrb({ color, r, x, y }, orbsLayer))
  updateAddOrbButton(addOrbBtn, orbs.length)
}
