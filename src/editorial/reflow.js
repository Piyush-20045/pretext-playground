import { layoutNextLine } from '@chenglou/pretext'

export function carveSlots(blocked, base, minSlotWidth) {
  let slots = [base]
  for (let i = 0; i < blocked.length; i++) {
    const b = blocked[i]
    const next = []
    for (let j = 0; j < slots.length; j++) {
      const s = slots[j]
      if (b.right <= s.left || b.left >= s.right) {
        next.push(s)
        continue
      }
      if (b.left > s.left) next.push({ left: s.left, right: b.left })
      if (b.right < s.right) next.push({ left: b.right, right: s.right })
    }
    slots = next
  }
  return slots.filter(s => s.right - s.left >= minSlotWidth).sort((a, b) => a.left - b.left)
}

export function renderReflowFrame({
  prepared,
  linesLayer,
  orbs,
  rectObstacles = [],
  left,
  right,
  top,
  bottom,
  lineHeight,
  textColor,
  bodyFont,
  minSlotWidth,
  circleIntervalForBand,
}) {
  const t0 = performance.now()
  const fragment = document.createDocumentFragment()
  let cursor = { segmentIndex: 0, graphemeIndex: 0 }
  let lineCount = 0

  for (let y = top; y + lineHeight <= bottom; y += lineHeight) {
    const blocked = []
    for (let i = 0; i < orbs.length; i++) {
      const orb = orbs[i]
      const interval = circleIntervalForBand(orb.x, orb.y, orb.r + 12, y, y + lineHeight)
      if (interval !== null) blocked.push(interval)
    }
    for (let i = 0; i < rectObstacles.length; i++) {
      const rect = rectObstacles[i]
      if (y + lineHeight <= rect.y || y >= rect.y + rect.h) continue
      blocked.push({ left: rect.x, right: rect.x + rect.w })
    }

    const slots = carveSlots(blocked, { left, right }, minSlotWidth)
    if (slots.length === 0) continue

    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i]
      const line = layoutNextLine(prepared, cursor, slot.right - slot.left)
      if (line === null) {
        linesLayer.replaceChildren(fragment)
        return { lineCount, reflowMs: performance.now() - t0 }
      }

      const lineEl = document.createElement('div')
      lineEl.textContent = line.text
      lineEl.style.position = 'absolute'
      lineEl.style.left = `${Math.round(slot.left)}px`
      lineEl.style.top = `${Math.round(y)}px`
      lineEl.style.font = bodyFont
      lineEl.style.lineHeight = `${lineHeight}px`
      lineEl.style.color = textColor
      lineEl.style.whiteSpace = 'pre'
      lineEl.style.textShadow = '0 1px 0 rgba(0,0,0,0.35)'
      fragment.appendChild(lineEl)

      cursor = line.end
      lineCount++
    }
  }

  linesLayer.replaceChildren(fragment)
  return { lineCount, reflowMs: performance.now() - t0 }
}
