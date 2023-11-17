const loadingContext = document.getElementById('loadingCanvas').getContext('2d');

function drawLoadingText(text) {
  const canvas = loadingContext.canvas;

  loadingContext.fillStyle = 'rgb(142, 195, 227)';
  loadingContext.fillRect(0, 0, canvas.scrollWidth, canvas.scrollHeight);

  loadingContext.font = '2em arial';
  loadingContext.textAlign = 'center';
  loadingContext.fillStyle = 'rgb( 11, 86, 117 )';
  loadingContext.fillText(text, canvas.scrollWidth / 2, canvas.scrollHeight / 2);

  loadingContext.fillText('Powered By Emscripten.', canvas.scrollWidth / 2, canvas.scrollHeight / 4);
  loadingContext.fillText('Powered By LÖVE.', canvas.scrollWidth / 2, (canvas.scrollHeight / 4) * 3);
}

window.onload = () => {
  window.focus();
};

window.onclick = () => {
  window.focus();
};

const keysToPrevent = ['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

window.addEventListener(
  'keydown',
  (e) => {
    if (keysToPrevent.indexOf(e.key) > -1) {
      e.preventDefault();
    }
  },
  false
);

var Module = {
  arguments: ['./'],
  INITIAL_MEMORY: 16777216,
  printErr: console.error.bind(console),
  canvas: (function () {
    const canvas = document.getElementById('canvas');

    // As a default initial behavior, pop up an alert when webgl context is lost. To make your
    // application robust, you may want to override this behavior before shipping!
    // See http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.15.2
    canvas.addEventListener(
      'webglcontextlost',
      function (e) {
        alert('WebGL context lost. You will need to reload the page.');
        e.preventDefault();
      },
      false
    );

    return canvas;
  })(),
  setStatus: function (text) {
    if (text) {
      drawLoadingText(text);
    } else if (Module.remainingDependencies === 0) {
      document.getElementById('loadingCanvas').style.display = 'none';
      document.getElementById('canvas').style.display = 'block';
    }
  },
  totalDependencies: 0,
  remainingDependencies: 0,
  monitorRunDependencies: function (left) {
    this.remainingDependencies = left;
    this.totalDependencies = Math.max(this.totalDependencies, left);
    Module.setStatus(
      left
        ? 'Preparing... (' + (this.totalDependencies - left) + '/' + this.totalDependencies + ')'
        : 'All downloads complete.'
    );
  },
};

Module.setStatus('Downloading...');
window.onerror = function (event) {
  // TODO: do not warn on ok events like simulating an infinite loop or exitStatus
  Module.setStatus('Exception thrown, see JavaScript console');
  Module.setStatus = function (text) {
    if (text) Module.printErr('[post-exception status] ' + text);
  };
};

// const applicationLoad = function (e) {
//   Love(Module);
// };

let s = document.createElement('script');
s.type = 'text/javascript';
s.src = '/lumi2d/static/love/love.js';
s.async = true;
s.onload = () => {
  Love(Module);
};
document.body.appendChild(s);