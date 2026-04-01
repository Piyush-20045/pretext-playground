const CANVAS_W = 200
const CANVAS_H = 300

/**
 * @param {HTMLElement} root
 */
export function initRiveCharacter(root) {
  const wrapper = document.createElement('div')
  wrapper.id = 'rive-wrapper'
  wrapper.style.position = 'fixed'
  wrapper.style.zIndex = '40'
  wrapper.style.width = `${CANVAS_W}px`
  wrapper.style.height = `${CANVAS_H}px`
  wrapper.style.pointerEvents = 'auto'
  wrapper.style.cursor = 'grab'

  const video = document.createElement('video')
  video.id = 'rive-canvas' // keep same id so main.js selectors still work
  video.src = '/character.webm'
  video.autoplay = true
  video.loop = true
  video.muted = true
  video.playsInline = true
  video.style.display = 'block'
  video.style.width = `${CANVAS_W}px`
  video.style.height = `${CANVAS_H}px`
  video.style.objectFit = 'contain'
  video.style.objectPosition = 'bottom center'
  video.style.pointerEvents = 'none'

  wrapper.appendChild(video)
  root.appendChild(wrapper)

  let dragging = false

  if (!document.getElementById('character-float-style')) {
    const style = document.createElement('style')
    style.id = 'character-float-style'
    style.textContent = `
      @keyframes characterFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-15px); }
      }
    `
    document.head.appendChild(style)
  }

  function homePosition() {
    const left = (window.innerWidth - CANVAS_W) / 2
    const top = window.innerHeight - CANVAS_H
    return { left, top }
  }

  function positionHomeNoTransition() {
    wrapper.style.transition = 'none'
    const { left, top } = homePosition()
    wrapper.style.left = `${left}px`
    wrapper.style.top = `${top}px`
    wrapper.style.bottom = 'auto'
    wrapper.style.right = 'auto'
    wrapper.style.transform = 'none'
    wrapper.style.animation = 'characterFloat 4s ease-in-out infinite'
  }

  positionHomeNoTransition()

  function getRect() {
    const r = wrapper.getBoundingClientRect()
    return { x: r.left, y: r.top, w: r.width, h: r.height }
  }

  function beginDrag() {
    wrapper.style.transition = 'none'
    wrapper.style.cursor = 'grabbing'
    wrapper.style.animation = 'none'
    wrapper.style.transform = 'none'
  }

  function endDrag() {
    wrapper.style.cursor = 'grab'
    wrapper.style.animation = 'characterFloat 4s ease-in-out infinite'
  }

  function onResize() {
    if (dragging) return
    // Remove positionHomeNoTransition here so resizing doesn't snap it back either
  }

  const api = {
    getRect,
    wrapper,
    canvas: video, // expose as `canvas` to keep API compatible with main.js
    beginDrag,
    endDrag,
    onResize,
    isDragging: () => dragging,
    setDragging: v => {
      dragging = v
    },
  }

  return new Promise((resolve, reject) => {
    // Video is ready once it can play
    video.addEventListener(
      'canplay',
      () => {
        resolve(api)
      },
      { once: true },
    )
    video.addEventListener(
      'error',
      e => {
        reject(new Error(`Failed to load /character.webm: ${e.message || 'unknown error'}`))
      },
      { once: true },
    )
    // Kick off loading
    video.load()
  })
}
