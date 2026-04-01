let isMusicPlaying = false
let musicFrame = null

export function toggleMusic(stage, musicBtn, equalizer) {
  if (isMusicPlaying) {
    isMusicPlaying = false
    musicFrame?.remove()
    musicFrame = null
    musicBtn.firstElementChild.textContent = 'Play Music'
    equalizer.style.display = 'none'
    return
  }

  musicFrame = document.createElement('iframe')
  musicFrame.src = 'https://www.youtube.com/embed/ApXoWvfEYVU?autoplay=1'
  musicFrame.allow = 'autoplay'
  musicFrame.width = '0'
  musicFrame.height = '0'
  musicFrame.style.position = 'absolute'
  musicFrame.style.opacity = '0'
  musicFrame.style.pointerEvents = 'none'
  stage.appendChild(musicFrame)
  isMusicPlaying = true
  musicBtn.firstElementChild.textContent = 'Stop Music'
  equalizer.style.display = 'inline-flex'
}
