import { prepareWithSegments } from '@chenglou/pretext'
import { ARTICLE } from './src/editorial/article.js'
import { BODY_FONT, ORB_DEFS } from './src/editorial/constants.js'
import { createOrbs, seedOrbs } from './src/editorial/orbs.js'
import { initRiveCharacter } from './src/editorial/riveCharacter.js'

import { initDOM } from './src/editorial/dom.js'
import { toggleMusic } from './src/editorial/music.js'
import { setupStageEvents, setupCharacterEvents } from './src/editorial/events.js'
import { startAnimationLoop, updateAddOrbButton } from './src/editorial/loop.js'
import { spawnOrb } from './src/editorial/spawn.js'

const app = document.querySelector('#app')
if (!(app instanceof HTMLDivElement)) {
  throw new Error('#app is required')
}

// 1. Initialize DOM Layers & UI Elements
const dom = initDOM(app)
const { stage, linesLayer, orbsLayer, trailLayer, webLayer, stats, musicBtn, equalizer, addOrbBtn } = dom

// 2. Initialize Game Entities
const orbs = createOrbs(ORB_DEFS, orbsLayer)
seedOrbs(orbs, ORB_DEFS, window.innerWidth, window.innerHeight)

await document.fonts.ready
const prepared = prepareWithSegments(ARTICLE, BODY_FONT)

let rive = null
try {
  rive = await initRiveCharacter(app)
} catch (e) {
  rive = null
  console.warn('Character could not be loaded:', e)
}

// 3. Setup Application State
const state = {
  dragging: null,
  fps: 60,
  lastTime: performance.now()
}

// context bag for easiest wiring
const context = {
  state, orbs, rive, prepared,
  stage, linesLayer, orbsLayer, trailLayer, webLayer, stats, addOrbBtn
}

// 4. Wire Global Callbacks and UI Interactions
musicBtn.addEventListener('click', () => toggleMusic(stage, musicBtn, equalizer))

addOrbBtn.addEventListener('click', () => {
  const width = window.innerWidth
  const height = window.innerHeight
  const left = Math.max(20, Math.round(width * 0.05))
  const right = width - left
  const top = width <= 768 ? 120 : 160
  const bottom = height - 28
  spawnOrb({ left, right, top, bottom }, context)
})

updateAddOrbButton(addOrbBtn, orbs.length)

// 5. Connect Input Systems
setupStageEvents(stage, context)
if (rive) {
  setupCharacterEvents(rive, context)
}

// 6. Launch Primary Engine Loop
startAnimationLoop(context)
