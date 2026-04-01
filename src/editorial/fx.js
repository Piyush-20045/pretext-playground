export function spawnWebShot(x, y, orbs, webLayer) {
  if (orbs.length === 0) return
  let nearest = orbs[0]
  let best = Infinity
  for (let i = 0; i < orbs.length; i++) {
    const dx = orbs[i].x - x
    const dy = orbs[i].y - y
    const d = dx * dx + dy * dy
    if (d < best) {
      best = d
      nearest = orbs[i]
    }
  }
  const dx = nearest.x - x
  const dy = nearest.y - y
  const len = Math.hypot(dx, dy)
  const angle = Math.atan2(dy, dx) * (180 / Math.PI)
  const line = document.createElement('div')
  line.style.position = 'absolute'
  line.style.left = `${x}px`
  line.style.top = `${y}px`
  line.style.width = `${len}px`
  line.style.height = '1px'
  line.style.background = 'rgba(255,255,255,.9)'
  line.style.transformOrigin = '0 50%'
  line.style.transform = `rotate(${angle}deg)`
  line.style.opacity = '1'
  line.style.transition = 'opacity .5s linear'
  webLayer.appendChild(line)
  requestAnimationFrame(() => {
    line.style.opacity = '0'
  })
  setTimeout(() => line.remove(), 520)
}

export function explodeOrb(index, orbs) {
  const source = orbs[index]
  source.explodeUntil = performance.now() + 260
  for (let i = 0; i < orbs.length; i++) {
    if (i === index) continue
    const target = orbs[i]
    const dx = target.x - source.x
    const dy = target.y - source.y
    const dist = Math.max(1, Math.hypot(dx, dy))
    if (dist > 260) continue
    const push = (260 - dist) * 1.8
    target.vx += (dx / dist) * push
    target.vy += (dy / dist) * push
  }
}
