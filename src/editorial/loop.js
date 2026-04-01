import {
  LINE_HEIGHT,
  TEXT_COLOR,
  BODY_FONT,
  MIN_SLOT_WIDTH,
  MAX_ORBS,
} from './constants.js'
import { tickOrbs, circleIntervalForBand, resolveOrbCollisions } from './orbs.js'
import { renderReflowFrame } from './reflow.js'

export function startAnimationLoop(context) {
  const { state, orbs, trailLayer, linesLayer, stats, rive, prepared } = context

  function animate(now) {
    const dt = Math.min((now - state.lastTime) / 1000, 0.04)
    state.lastTime = now
    state.fps = state.fps * 0.9 + (1 / Math.max(dt, 0.0001)) * 0.1

    const width = window.innerWidth
    const height = window.innerHeight

    const left = Math.max(20, Math.round(width * 0.05))
    const right = width - left
    const top = width <= 768 ? 120 : 160
    const bottom = height - 28

    if (state.dragging !== null && state.dragging.kind === 'orb') {
      const orb = orbs[state.dragging.index]
      orb.x = Math.max(left + orb.r, Math.min(right - orb.r, state.dragging.x))
      orb.y = Math.max(top + orb.r, Math.min(bottom - orb.r, state.dragging.y))
    }

    tickOrbs(
      orbs,
      dt,
      { left, right, top, bottom },
      state.dragging?.kind === 'orb' ? state.dragging.index : -1,
    )
    resolveOrbCollisions(orbs)

    const nowMs = performance.now()
    for (let i = 0; i < orbs.length; i++) {
      const orb = orbs[i]
      orb.pulsePhase += dt * (1.2 + i * 0.07)
      orb.trail.push({ x: orb.x, y: orb.y, t: nowMs })
      if (orb.trail.length > 10) orb.trail.shift()

      const burst = orb.explodeUntil > nowMs ? 1 + 0.5 * ((orb.explodeUntil - nowMs) / 260) : 1
      const pulse = 1 + 0.1 * Math.sin(orb.pulsePhase)
      orb.el.style.transform = `scale(${(burst * pulse).toFixed(3)})`
    }

    trailLayer.replaceChildren()
    for (let i = 0; i < orbs.length; i++) {
      const orb = orbs[i]
      if (!orb.trailEls.length) {
        for (let j = 0; j < 10; j++) {
          const dot = document.createElement('div')
          dot.style.position = 'absolute'
          dot.style.borderRadius = '999px'
          dot.style.pointerEvents = 'none'
          dot.style.background = orb.color
          trailLayer.appendChild(dot)
          orb.trailEls.push(dot)
        }
      }
      const cutoff = nowMs - 400
      for (let j = 0; j < orb.trailEls.length; j++) {
        const trail = orb.trail[orb.trail.length - 1 - j]
        const dot = orb.trailEls[j]
        if (!trail || trail.t < cutoff) {
          dot.style.display = 'none'
          continue
        }
        const age = (nowMs - trail.t) / 400
        dot.style.display = ''
        dot.style.width = `${6 - age * 3}px`
        dot.style.height = `${6 - age * 3}px`
        dot.style.left = `${trail.x - 3}px`
        dot.style.top = `${trail.y - 3}px`
        dot.style.opacity = `${1 - age}`
        trailLayer.appendChild(dot)
      }
    }

    const { lineCount, reflowMs } = renderReflowFrame({
      prepared,
      linesLayer,
      orbs,
      rectObstacles: rive && typeof rive.getRect === 'function' ? [rive.getRect()] : [],
      left,
      right,
      top,
      bottom,
      lineHeight: LINE_HEIGHT,
      textColor: TEXT_COLOR,
      bodyFont: BODY_FONT,
      minSlotWidth: MIN_SLOT_WIDTH,
      circleIntervalForBand,
    })

    let moving = state.dragging !== null || (rive?.isDragging?.() ?? false)
    if (!moving) {
      for (let i = 0; i < orbs.length; i++) {
        const speed = Math.hypot(orbs[i].vx, orbs[i].vy)
        if (speed > 8) {
          moving = true
          break
        }
      }
    }
    const spider = moving
      ? `<span style="display:inline-block;animation:spinSpider .7s linear infinite;">🕷️</span>`
      : '🕷️'
    
    stats.innerHTML = `Lines: ${lineCount}  Reflow: ${reflowMs.toFixed(2)}ms  FPS: ${state.fps.toFixed(1)}  Orbs: ${orbs.length}  ${spider}`
    requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
}

export function updateAddOrbButton(addOrbBtn, orbsLength) {
  const atMax = orbsLength >= MAX_ORBS
  addOrbBtn.disabled = atMax
  addOrbBtn.style.opacity = atMax ? '0.5' : '1'
  addOrbBtn.style.cursor = atMax ? 'not-allowed' : 'pointer'
}
