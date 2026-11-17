// The Claudopus octopus in 3D, built from the same cells as the flat mark: a head of small cubes and eight arms that move.
// createOcto(canvas) returns { draw({ t, yaw, pitch, zoom, color, look }), tips } or null where the browser has no WebGL 2.
// draw() is a pure function of what it is given, so a page can drive it from a clock or from a fixed time.
(function () {
  'use strict'
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255)
  const PURPLE = hex('#8A63F0'), DARK = hex('#151419'), WHITE = hex('#F3F2EF')
  const ARMS = 8, HEAD = []

  // the head: a box with rounded corners, flat underneath, with two eyes on its front
  for (let x = -6; x < 6; x++) for (let y = 0; y < 10; y++) for (let z = -5; z < 5; z++) {
    const a = (x + .5) / 6.4, b = (y + .5 - 3.6) / 6.6, c = (z + .5) / 5.5
    if (a ** 4 + b ** 4 + c ** 4 <= 1) HEAD.push([x, y, z])
  }
  const frontOf = (x, y) => Math.max(...HEAD.filter(v => v[0] === x && v[1] === y).map(v => v[2]))
  const EYES = [[-4, 5], [-3, 5], [-4, 6], [-3, 6], [2, 5], [3, 5], [2, 6], [3, 6]].map(([x, y]) => [x, y, frontOf(x, y)])

  // one arm: out from under the head, down, then up again to a tip that holds something
  const armCells = (k, t, out) => {
    const base = (k + .5) / ARMS * Math.PI * 2, seen = new Set()
    let tip = null
    for (let i = 0; i <= 44; i++) {
      const s = i / 44
      const ang = base + .14 * Math.sin(t * .9 + k * 1.7) * s
      const r = 3.2 + 14 * s
      const up = k % 2 ? 1.2 : 8.5   // every other arm is held high, so what the arms hold sits on two rings
      const y = -.5 - 5.2 * Math.sin(Math.PI * Math.min(1, s * 1.08)) + up * s * s + 1.1 * Math.sin(t * 1.5 + k * .8 - s * 3.2) * s
      const x = Math.round(Math.sin(ang) * r - .5), z = Math.round(Math.cos(ang) * r - .5), yy = Math.round(y)
      tip = [Math.sin(ang) * (r + 3.5), y + 1.5, Math.cos(ang) * (r + 3.5)]
      for (let d = 0; d < (s < .5 ? 2 : 1); d++) {
        const key = x + ',' + (yy - d) + ',' + z
        if (seen.has(key)) continue
        seen.add(key)
        out.push(x, yy - d, z, s > .93 ? 1 : 0)
      }
    }
    return tip
  }

  // 4x4 matrices, column-major
  const mul = (a, b) => { const o = new Float32Array(16); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3]; return o }
  const persp = (fov, asp, n, f) => { const s = 1 / Math.tan(fov / 2); return new Float32Array([s / asp, 0, 0, 0, 0, s, 0, 0, 0, 0, (f + n) / (n - f), -1, 0, 0, 2 * f * n / (n - f), 0]) }
  const rotY = a => { const c = Math.cos(a), s = Math.sin(a); return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]) }
  const rotX = a => { const c = Math.cos(a), s = Math.sin(a); return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]) }
  const move = (x, y, z) => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1])

  const VS = `#version 300 es
in vec3 aPos; in vec3 aNor; in vec4 iCell; in vec3 iCol;
uniform mat4 uMVP; uniform mat4 uRot; uniform float uBob;
out vec3 vCol;
void main(){
  vec3 n = normalize((uRot * vec4(aNor, 0.)).xyz);
  float top = max(n.y, 0.), front = max(n.z, 0.), side = abs(n.x);
  float l = .42 + .58 * top + .36 * front + .14 * side - .1 * max(-n.y, 0.);
  vCol = iCol * min(l, 1.12);
  gl_Position = uMVP * vec4(iCell.xyz + aPos * .5 + .5 + vec3(0., uBob, 0.), 1.);
}`
  const FS = `#version 300 es
precision mediump float; in vec3 vCol; out vec4 o; void main(){ o = vec4(vCol, 1.); }`

  window.createOcto = function (canvas) {
    const gl = canvas.getContext('webgl2', { antialias: true, alpha: true, premultipliedAlpha: false, preserveDrawingBuffer: true })
    if (!gl) return null
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s }
    const prog = gl.createProgram()
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null
    gl.useProgram(prog)
    // a cube: six faces, each with its own normal
    const faces = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]], verts = []
    for (const n of faces) {
      const u = n[0] ? [0, 1, 0] : [1, 0, 0], v = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]]
      for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, -1], [1, 1], [-1, 1]]) verts.push(n[0] + u[0] * a + v[0] * b, n[1] + u[1] * a + v[1] * b, n[2] + u[2] * a + v[2] * b, ...n)
    }
    const vao = gl.createVertexArray(); gl.bindVertexArray(vao)
    const cube = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, cube); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW)
    const at = name => gl.getAttribLocation(prog, name)
    gl.enableVertexAttribArray(at('aPos')); gl.vertexAttribPointer(at('aPos'), 3, gl.FLOAT, false, 24, 0)
    gl.enableVertexAttribArray(at('aNor')); gl.vertexAttribPointer(at('aNor'), 3, gl.FLOAT, false, 24, 12)
    const inst = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, inst)
    gl.enableVertexAttribArray(at('iCell')); gl.vertexAttribPointer(at('iCell'), 4, gl.FLOAT, false, 28, 0); gl.vertexAttribDivisor(at('iCell'), 1)
    gl.enableVertexAttribArray(at('iCol')); gl.vertexAttribPointer(at('iCol'), 3, gl.FLOAT, false, 28, 16); gl.vertexAttribDivisor(at('iCol'), 1)
    const uMVP = gl.getUniformLocation(prog, 'uMVP'), uRot = gl.getUniformLocation(prog, 'uRot'), uBob = gl.getUniformLocation(prog, 'uBob')
    gl.enable(gl.DEPTH_TEST); gl.enable(gl.CULL_FACE)
    const data = new Float32Array(4000 * 7)
    const api = { tips: [] }

    api.draw = function ({ t = 0, yaw = 0, pitch = .3, zoom = 1, color = PURPLE, look = [0, 0], arms = 1 } = {}) {
      const w = canvas.width, h = canvas.height
      gl.viewport(0, 0, w, h); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      const col = typeof color === 'string' ? hex(color) : color
      const lift = col.map(c => Math.min(1, c * 1.25 + .08))
      let n = 0
      const put = (x, y, z, c) => { data.set([x, y, z, 0, c[0], c[1], c[2]], n * 7); n++ }
      const eyeKeys = new Set(EYES.map(e => e.join(',')))
      for (const v of HEAD) if (!eyeKeys.has(v.join(','))) put(v[0], v[1], v[2], col)
      // each eye is a dark square with one light cell that looks where it is told
      const lx = look[0] > .25 ? 1 : 0, ly = look[1] > .25 ? 1 : 0
      for (const e of EYES) { const left = e[0] < 0, ox = e[0] - (left ? -4 : 2), oy = e[1] - 5; put(e[0], e[1], e[2], ox === lx && oy === ly ? WHITE : DARK) }
      const cells = []
      const tips = []
      for (let k = 0; k < ARMS; k++) tips.push(armCells(k, t, cells))
      for (let i = 0; i < cells.length; i += 4) put(cells[i], cells[i + 1] * arms, cells[i + 2], cells[i + 3] ? lift : col)
      const bob = Math.round(Math.sin(t * 1.2) * 2) / 4
      const rot = mul(rotX(pitch), rotY(yaw))
      const view = mul(move(0, 0, -78 / zoom), mul(rot, move(0, -1.5, 0)))
      const mvp = mul(persp(.5, w / h, 1, 200), view)
      gl.uniformMatrix4fv(uMVP, false, mvp); gl.uniformMatrix4fv(uRot, false, rot); gl.uniform1f(uBob, bob)
      gl.bindBuffer(gl.ARRAY_BUFFER, inst); gl.bufferData(gl.ARRAY_BUFFER, data.subarray(0, n * 7), gl.DYNAMIC_DRAW)
      gl.drawArraysInstanced(gl.TRIANGLES, 0, 36, n)
      // where each arm's tip lands on the canvas, 0 to 1 across and down, with its depth (larger is nearer)
      api.tips = tips.map(p => {
        const x = p[0], y = p[1] + bob, z = p[2]
        const cx = mvp[0] * x + mvp[4] * y + mvp[8] * z + mvp[12], cy = mvp[1] * x + mvp[5] * y + mvp[9] * z + mvp[13], cw = mvp[3] * x + mvp[7] * y + mvp[11] * z + mvp[15]
        return { x: (cx / cw + 1) / 2, y: (1 - cy / cw) / 2, near: 78 / zoom / cw }
      })
    }
    return api
  }
})()
