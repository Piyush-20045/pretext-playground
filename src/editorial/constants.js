export const BODY_FONT = '16px Georgia, "Times New Roman", serif'
export const LINE_HEIGHT = 28
export const TEXT_COLOR = '#e8e4dc'
export const PAGE_BG = '#0a0a0a'
export const MIN_SLOT_WIDTH = 92
export const MAX_ORBS = 10
export const ORB_PALETTE = [
  'rgba(242, 188, 73, 0.95)', // gold
  'rgba(246, 138, 47, 0.95)', // orange
  'rgba(224, 72, 61, 0.95)', // red
  'rgba(144, 96, 232, 0.95)', // purple
  'rgba(46, 183, 171, 0.95)', // teal
]

export const ORB_DEFS = [
  { color: ORB_PALETTE[0], r: 95, x: 0.18, y: 0.32, vx: 0, vy: 0, type: 'sun' },
  { color: ORB_PALETTE[1], r: 75, x: 0.72, y: 0.26, vx: 0, vy: 0, type: 'moon' },
  { color: ORB_PALETTE[2], r: 85, x: 0.34, y: 0.62, vx: 0, vy: 0, type: 'star' },
]
