import { useEffect, useRef } from "react";

/**
 * Live WebGL backgrounds that follow the pointer (or drift on their own when nothing touches them,
 * so phones see the motion too). Half-ish resolution, paused off screen, one still frame with
 * reduced motion, and nothing drawn at all without WebGL (the section's own black shows).
 *   blueprint: engineering grid over a slowly moving stress-contour plot, like an ETABS / SAFE result.
 *   contours:  topographic lines in cream on black with one orange line.
 *   glow:      slow orange and maroon smoke under film grain.
 */
type Variant = "blueprint" | "contours" | "glow";

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const COMMON = `
#extension GL_OES_standard_derivatives : enable
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uScale;
const vec3 INK = vec3(0.039);
const vec3 PAPER = vec3(0.945, 0.937, 0.918);
const vec3 ACCENT = vec3(1.0, 0.353, 0.122);
// sin-free hash: the usual sin(dot()*43758) one collapses on phone GPUs with low-precision floats.
float hash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), u.x), mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ v += a*noise(p); p = p*2.02 + vec2(1.7, 9.2); a *= 0.5; } return v; }
`;

const BODY: Record<Variant, string> = {
  blueprint: `
void main(){
  vec2 px = gl_FragCoord.xy / uScale; vec2 res = uRes / uScale;
  vec2 uv = px / 600.0; float t = uTime * 0.06;
  vec2 q = vec2(fbm(uv + t), fbm(uv + vec2(5.2, 1.3) - t));
  float f = fbm(uv * 1.3 + 1.6 * q + vec2(t * 0.5, 0.0));
  f += 0.12 * exp(-length(px - uMouse) / 180.0);
  f = clamp((f - 0.25) / 0.55, 0.0, 1.0);
  // Site palette only (black -> maroon -> a little orange), so it never goes muddy on a small screen.
  float band = floor(f * 8.0) / 7.0;
  vec3 col = mix(vec3(0.035, 0.04, 0.055), vec3(0.32, 0.065, 0.03), band * band);
  col = mix(col, ACCENT * 0.85, smoothstep(0.78, 1.0, band) * 0.55);
  float v = f * 8.0; float w = fwidth(v); float e = fract(v);
  col = mix(col, PAPER, (1.0 - smoothstep(0.0, w * 1.6, min(e, 1.0 - e))) * 0.2);
  vec2 g = abs(fract(px / 24.0 + 0.5) - 0.5) * 24.0;
  vec2 G = abs(fract(px / 120.0 + 0.5) - 0.5) * 120.0;
  float minor = 1.0 - smoothstep(0.0, 1.0, min(g.x, g.y));
  float major = 1.0 - smoothstep(0.0, 1.2, min(G.x, G.y));
  col = mix(col, PAPER, minor * 0.05 + major * 0.14);
  vec2 c = px / res - 0.5; col *= 1.0 - dot(c, c) * 0.6;
  // Calmer behind the text at the bottom of the screen.
  col *= 0.6 + 0.4 * smoothstep(0.0, 0.45, px.y / res.y);
  gl_FragColor = vec4(col, 1.0);
}`,
  contours: `
void main(){
  vec2 px = gl_FragCoord.xy / uScale;
  vec2 uv = px / 700.0; float t = uTime * 0.025;
  vec2 q = vec2(fbm(uv * 1.5 + t), fbm(uv * 1.5 - t + 4.0));
  float f = fbm(uv * 1.2 + q * 1.2 + vec2(0.0, t));
  f += 0.07 * exp(-length(px - uMouse) / 160.0);
  float v = f * 22.0; float w = fwidth(v);
  float fr = fract(v); float d = min(fr, 1.0 - fr) / max(w, 1e-4);
  float line = 1.0 - smoothstep(0.5, 1.6, d);
  float idx = floor(v + 0.5);
  float major = step(mod(idx, 5.0), 0.5);
  float orange = step(abs(mod(idx, 11.0) - 7.0), 0.5);
  vec3 col = INK;
  col = mix(col, PAPER, line * (0.16 + major * 0.24) * (1.0 - orange));
  col = mix(col, ACCENT, line * orange * 0.95);
  gl_FragColor = vec4(col, 1.0);
}`,
  glow: `
void main(){
  vec2 px = gl_FragCoord.xy / uScale; vec2 res = uRes / uScale;
  vec2 uv = px / res.y; float t = uTime * 0.07;
  vec2 q = vec2(fbm(uv * 1.3 + t), fbm(uv * 1.3 - t + 3.0));
  float f = fbm(uv * 1.1 + q * 1.8 + t * 0.3);
  vec3 col = mix(INK, vec3(0.30, 0.04, 0.02), smoothstep(0.35, 0.6, f));
  col = mix(col, ACCENT, smoothstep(0.55, 0.8, f) * 0.9);
  col = mix(col, vec3(1.0, 0.75, 0.55), smoothstep(0.78, 0.95, f) * 0.5);
  col += ACCENT * 0.22 * exp(-length(px - uMouse) / 220.0);
  col += (hash(gl_FragCoord.xy + fract(uTime * 7.0) * 317.0) - 0.5) * 0.09;
  gl_FragColor = vec4(col, 1.0);
}`,
};

export default function ShaderBackground({ variant, className = "" }: { variant: Variant; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false });
    if (!gl) return;
    gl.getExtension("OES_standard_derivatives");

    const prog = gl.createProgram()!;
    for (const [type, src] of [
      [gl.VERTEX_SHADER, VERT],
      [gl.FRAGMENT_SHADER, COMMON + BODY[variant]],
    ] as const) {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return;
      gl.attachShader(prog, s);
    }
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uScale = gl.getUniformLocation(prog, "uScale");

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
      gl.uniform1f(uScale, scale);
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = [0, 0];
    let target = [0, 0];
    let lastInput = -1e9;
    let raf = 0;
    let visible = false;
    const start = performance.now();

    // The page content sits over the canvas, so listen on the window and map into canvas space.
    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      target = [e.clientX - r.left, r.height - (e.clientY - r.top)];
      lastInput = performance.now();
    };

    const draw = (now: number) => {
      const time = (now - start) / 1000;
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (now - lastInput > 2500) target = [cw * (0.5 + 0.32 * Math.sin(time * 0.5)), ch * (0.5 + 0.28 * Math.sin(time * 0.37 + 1))];
      mouse[0] += (target[0] - mouse[0]) * 0.08;
      mouse[1] += (target[1] - mouse[1]) * 0.08;
      gl.uniform1f(uTime, time + 20);
      gl.uniform2f(uMouse, mouse[0], mouse[1]);
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
      if (!visible || reduce) draw(performance.now());
    });
    ro.observe(canvas);
    window.addEventListener("pointermove", onPointer, { passive: true });
    resize();
    draw(performance.now());

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
    };
  }, [variant]);

  return <canvas ref={ref} aria-hidden className={`block size-full ${className}`} />;
}
