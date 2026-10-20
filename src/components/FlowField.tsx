import { useEffect, useRef } from "react";

/**
 * Animated "liquid" background: domain-warped noise in the site's orange palette, shown through a
 * grid of tiny glyphs like an LED board. WebGL, half resolution, paused when off screen.
 * With reduced motion it draws a single still frame; without WebGL the CSS fallback colour shows.
 */
const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;      // canvas size in device pixels
uniform float uTime;
uniform float uCell;    // glyph cell width in device pixels
uniform sampler2D uGlyph;

// sin-free hash: the usual sin(dot()*43758) one collapses on phone GPUs with low-precision floats.
float hash(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++){ v += a * noise(p); p = p * 2.02 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}

void main(){
  vec2 cellSize = vec2(uCell, uCell * 1.35);
  vec2 cell = floor(gl_FragCoord.xy / cellSize);
  vec2 inCell = fract(gl_FragCoord.xy / cellSize);

  // Sample the flow at the centre of each cell so every glyph is one flat colour.
  vec2 uv = (cell + 0.5) * cellSize / max(uRes.x, uRes.y) * 1.6;
  float t = uTime * 0.05;
  vec2 q = vec2(fbm(uv + t), fbm(uv - t + 5.2));
  vec2 r = vec2(fbm(uv + 2.6 * q + vec2(1.7, 9.2) + t * 1.3), fbm(uv + 2.6 * q + vec2(8.3, 2.8) - t));
  float f = fbm(uv + 2.8 * r);
  f = smoothstep(0.32, 0.74, f);
  f = f * f * (3.0 - 2.0 * f);

  // Palette: deep maroon -> red -> site orange -> warm grey.
  vec3 c0 = vec3(0.13, 0.02, 0.02);
  vec3 c1 = vec3(0.62, 0.10, 0.04);
  vec3 c2 = vec3(1.00, 0.35, 0.12);
  vec3 c3 = vec3(0.80, 0.77, 0.74);
  vec3 col = f < 0.4 ? mix(c0, c1, f / 0.4) : f < 0.75 ? mix(c1, c2, (f - 0.4) / 0.35) : mix(c2, c3, (f - 0.75) / 0.25);

  float glyph = texture2D(uGlyph, vec2(inCell.x, 1.0 - inCell.y)).a;
  gl_FragColor = vec4(col * (0.45 + 0.55 * glyph), 1.0);
}`;

function glyphTexture(gl: WebGLRenderingContext) {
  const c = document.createElement("canvas");
  c.width = 32;
  c.height = 43;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.font = "600 34px ui-monospace, Menlo, Consolas, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("$", 16, 23);
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
}

export default function FlowField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    glyphTexture(gl);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uCell = gl.getUniformLocation(prog, "uCell");
    gl.uniform1i(gl.getUniformLocation(prog, "uGlyph"), 0);

    // Half the device resolution keeps it cheap; glyph cells stay about 6 CSS px wide.
    const scale = Math.min(window.devicePixelRatio || 1, 2) * 0.75;
    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * scale));
      const h = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uCell, 6 * scale);
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = false;
    const start = performance.now();
    const draw = () => {
      gl.uniform1f(uTime, (performance.now() - start) / 1000 + 20);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (visible && !reduce) raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    const ro = new ResizeObserver(() => {
      resize();
      if (!visible || reduce) draw();
    });
    ro.observe(canvas);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={`block size-full ${className}`} />;
}
