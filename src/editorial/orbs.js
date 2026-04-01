export function createOrbs(orbDefs, layer) {
  return orbDefs.map(def => {
    const el = document.createElement('div')
    el.style.position = 'absolute'
    el.style.pointerEvents = 'auto'
    el.style.touchAction = 'none'
    el.style.display = 'flex'
    el.style.alignItems = 'center'
    el.style.justifyContent = 'center'
    el.style.fontSize = `${def.r * 1.5}px`
    
    // Add text shadow for extra glowing effect on the emoji
    el.style.filter = `drop-shadow(0 0 20px ${def.color.replace('0.95', '0.7')}) drop-shadow(0 0 50px ${def.color.replace('0.95', '0.3')})`

    const emojiMap = {
      sun: '☀️',
      moon: '🌙',
      star: '⭐',
      orb: '🔮'
    }
    
    el.textContent = emojiMap[def.type] || '🔮'

    layer.appendChild(el)
    return {
      x: 0,
      y: 0,
      r: def.r,
      vx: def.vx,
      vy: def.vy,
      color: def.color,
      type: def.type || 'orb',
      pulsePhase: Math.random() * Math.PI * 2,
      explodeUntil: 0,
      el,
      trail: [],
      trailEls: [],
    }
  })
}

export function seedOrbs(orbs, defs, width, height) {
  for (let i = 0; i < orbs.length; i++) {
    orbs[i].x = width * defs[i].x
    orbs[i].y = height * defs[i].y
  }
}

export function tickOrbs(orbs, dt, bounds, draggedIndex = -1) {
  const { left, right, top, bottom } = bounds
  for (let i = 0; i < orbs.length; i++) {
    const orb = orbs[i]
    if (i === draggedIndex) {
      orb.el.style.width = `${orb.r * 2}px`
      orb.el.style.height = `${orb.r * 2}px`
      orb.el.style.left = `${orb.x - orb.r}px`
      orb.el.style.top = `${orb.y - orb.r}px`
      continue
    }
    orb.x += orb.vx * dt
    orb.y += orb.vy * dt

    if (orb.x - orb.r < left) {
      orb.x = left + orb.r
      orb.vx = Math.abs(orb.vx)
    }
    if (orb.x + orb.r > right) {
      orb.x = right - orb.r
      orb.vx = -Math.abs(orb.vx)
    }
    if (orb.y - orb.r < top) {
      orb.y = top + orb.r
      orb.vy = Math.abs(orb.vy)
    }
    if (orb.y + orb.r > bottom) {
      orb.y = bottom - orb.r
      orb.vy = -Math.abs(orb.vy)
    }

    orb.el.style.width = `${orb.r * 2}px`
    orb.el.style.height = `${orb.r * 2}px`
    orb.el.style.left = `${orb.x - orb.r}px`
    orb.el.style.top = `${orb.y - orb.r}px`
  }
}

export function resolveOrbCollisions(orbs, restitution = 0.95) {
  for (let i = 0; i < orbs.length; i++) {
    const a = orbs[i]
    for (let j = i + 1; j < orbs.length; j++) {
      const b = orbs[j]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.hypot(dx, dy)
      const minDist = a.r + b.r
      if (dist === 0 || dist >= minDist) continue

      const nx = dx / dist
      const ny = dy / dist
      const overlap = minDist - dist
      a.x -= nx * (overlap * 0.5)
      a.y -= ny * (overlap * 0.5)
      b.x += nx * (overlap * 0.5)
      b.y += ny * (overlap * 0.5)

      const rvx = b.vx - a.vx
      const rvy = b.vy - a.vy
      const alongNormal = rvx * nx + rvy * ny
      if (alongNormal > 0) continue

      const impulse = -(1 + restitution) * alongNormal / 2
      const ix = impulse * nx
      const iy = impulse * ny
      a.vx -= ix
      a.vy -= iy
      b.vx += ix
      b.vy += iy
    }
  }
}

export function hitTestOrb(orbs, x, y) {
  for (let i = orbs.length - 1; i >= 0; i--) {
    const orb = orbs[i]
    const dx = x - orb.x
    const dy = y - orb.y
    if (dx * dx + dy * dy <= orb.r * orb.r) return i
  }
  return -1
}

export function createRandomOrb({ color, x, y, r }, layer) {
  const types = ['sun', 'moon', 'star', 'orb']
  const type = types[Math.floor(Math.random() * types.length)]
  const [orb] = createOrbs([{ color, x: 0, y: 0, vx: 0, vy: 0, r, type }], layer)
  orb.x = x
  orb.y = y
  return orb
}

export function circleIntervalForBand(cx, cy, r, bandTop, bandBottom) {
  if (bandBottom <= cy - r || bandTop >= cy + r) return null
  const nearestY = cy < bandTop ? bandTop : cy > bandBottom ? bandBottom : cy
  const dy = nearestY - cy
  const inside = r * r - dy * dy
  if (inside <= 0) return null
  const dx = Math.sqrt(inside)
  return { left: cx - dx, right: cx + dx }
}
