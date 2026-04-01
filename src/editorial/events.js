import { hitTestOrb } from './orbs.js'
import { spawnWebShot, explodeOrb } from './fx.js'

export function setupStageEvents(stage, context) {
  const { state, orbs, webLayer } = context

  stage.addEventListener('pointerdown', event => {
    if (event.target instanceof Element && event.target.closest('button')) return
    if (event.target instanceof Element && event.target.closest('#rive-wrapper')) return
    
    const orbIndex = hitTestOrb(orbs, event.clientX, event.clientY)
    if (orbIndex !== -1) {
      event.preventDefault()
      stage.setPointerCapture(event.pointerId)
      state.dragging = {
        kind: 'orb',
        index: orbIndex,
        x: event.clientX,
        y: event.clientY,
        startX: event.clientX,
        startY: event.clientY,
      }
      return
    }
    spawnWebShot(event.clientX, event.clientY, orbs, webLayer)
  })

  stage.addEventListener('pointermove', event => {
    if (state.dragging === null || state.dragging.kind !== 'orb') return
    state.dragging.x = event.clientX
    state.dragging.y = event.clientY
  })

  stage.addEventListener('pointerup', event => {
    if (state.dragging !== null && state.dragging.kind === 'orb') {
      const moved = Math.hypot(event.clientX - state.dragging.startX, event.clientY - state.dragging.startY)
      const idx = state.dragging.index
      state.dragging = null
      if (moved < 8) explodeOrb(idx, orbs)
    }
    if (stage.hasPointerCapture(event.pointerId)) {
      stage.releasePointerCapture(event.pointerId)
    }
  })

  stage.addEventListener('pointercancel', event => {
    if (state.dragging?.kind === 'orb') state.dragging = null
    if (stage.hasPointerCapture(event.pointerId)) {
      stage.releasePointerCapture(event.pointerId)
    }
  })
}

export function setupCharacterEvents(rive, context) {
  const { state } = context
  const RIVE_W = 200
  const RIVE_H = 300

  rive.wrapper.addEventListener('pointerdown', event => {
    event.stopPropagation()
    event.preventDefault()
    rive.beginDrag()
    rive.setDragging(true)
    const r = rive.wrapper.getBoundingClientRect()
    state.dragging = {
      kind: 'rive',
      offsetX: event.clientX - r.left,
      offsetY: event.clientY - r.top,
    }
    rive.wrapper.setPointerCapture(event.pointerId)
  })

  rive.wrapper.addEventListener('pointermove', event => {
    if (state.dragging === null || state.dragging.kind !== 'rive') return
    let x = event.clientX - state.dragging.offsetX
    let y = event.clientY - state.dragging.offsetY
    const maxX = window.innerWidth - RIVE_W
    const maxY = window.innerHeight - RIVE_H
    x = Math.max(0, Math.min(maxX, x))
    y = Math.max(0, Math.min(maxY, y))
    rive.wrapper.style.left = `${x}px`
    rive.wrapper.style.top = `${y}px`
  })

  rive.wrapper.addEventListener('pointerup', event => {
    if (state.dragging?.kind !== 'rive') return
    state.dragging = null
    rive.setDragging(false)
    rive.endDrag()
    if (rive.wrapper.hasPointerCapture(event.pointerId)) {
      rive.wrapper.releasePointerCapture(event.pointerId)
    }
  })

  rive.wrapper.addEventListener('pointercancel', event => {
    if (state.dragging?.kind === 'rive') {
      state.dragging = null
      rive.setDragging(false)
      rive.endDrag()
    }
    if (rive.wrapper.hasPointerCapture(event.pointerId)) {
      rive.wrapper.releasePointerCapture(event.pointerId)
    }
  })

  window.addEventListener('resize', () => rive.onResize())
}
