export function initDOM(app) {
  // DOM is now natively rendered in index.html! We simply grab the handles.
  return {
    app,
    stage: document.getElementById('stage'),
    linesLayer: document.getElementById('lines-layer'),
    orbsLayer: document.getElementById('orbs-layer'),
    trailLayer: document.getElementById('trail-layer'),
    webLayer: document.getElementById('web-layer'),
    stats: document.getElementById('stats'),
    musicBtn: document.getElementById('music-btn'),
    equalizer: document.getElementById('equalizer'),
    addOrbBtn: document.getElementById('add-orb-btn'),
  }
}
