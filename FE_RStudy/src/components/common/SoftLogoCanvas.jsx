import { useEffect, useRef } from "react";
import logoSrc from "../../assets/images/logo-loader.webp";

// Logo như miếng cao su: nghiêng sang phải quanh chân phải chữ R, chỉ vùng góc chạm sàn bị ép rồi đàn hồi trở lại.
// CSS transform chỉ biến dạng được cả khối, nên vẽ từng điểm ảnh bằng ánh xạ ngược (đích -> nguồn) để uốn cục bộ phần góc,
// không có đường nối như cách chia lưới tam giác.
const CYCLE_MS = 1550;
const LOGO_W = 86;
const LOGO_H = LOGO_W / (256 / 219); // giữ đúng tỉ lệ ảnh logo-loader.webp
const CANVAS_W = 150;
const CANVAS_H = 124;
const FLOOR_Y = 108;
const CONTACT_U = 0.895; // chân phải chữ R, đo từ ảnh (điểm đặc ngoài cùng bên phải ở đáy)
const TILT = (17 * Math.PI) / 180;
const ROCK = (1 * Math.PI) / 180;
const LIFT = 6;
const SQUASH = LOGO_H * 0.14;
const RADIUS = LOGO_H * 0.42;
const SPREAD = 0.55;

// Nạp sẵn một lần khi import để lần đầu hiện loader không bị trống
const logo = typeof Image === "undefined" ? null : Object.assign(new Image(), { src: logoSrc, decoding: "async" });
let source = null;
const getSource = () => {
  if (!source) {
    const c = document.createElement("canvas");
    c.width = logo.naturalWidth;
    c.height = logo.naturalHeight;
    const x = c.getContext("2d");
    x.drawImage(logo, 0, 0);
    source = { data: x.getImageData(0, 0, c.width, c.height).data, w: c.width, h: c.height };
  }
  return source;
};

const easeInQuad = (t) => t * t;
const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);
const easeOutCubic = (t) => 1 - (1 - t) ** 3;
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

// p trong [0, 1): rơi nghiêng (tăng tốc như trọng lực) -> chạm và ép góc -> đứng dậy; đầu và cuối chu kỳ đều vận tốc 0 nên lặp liền mạch
const poseAt = (p) => {
  let theta;
  let lift;
  if (p < 0.4) {
    const k = easeInQuad(p / 0.4);
    theta = TILT * k;
    lift = LIFT * (1 - k);
  } else if (p < 0.62) {
    theta = TILT + ROCK * Math.sin(Math.PI * ((p - 0.4) / 0.22));
    lift = 0;
  } else {
    const s = (p - 0.62) / 0.38;
    theta = TILT * (1 - easeInOutCubic(s));
    lift = LIFT * easeOutQuad(s);
  }
  let squash = 0;
  if (p >= 0.4 && p < 0.78) {
    const q = (p - 0.4) / 0.38;
    if (q < 0.2) squash = easeOutCubic(q / 0.2);
    else {
      const r = (q - 0.2) / 0.8;
      squash = (1 - r) ** 1.6 * Math.cos(r * 1.5 * Math.PI); // dao động tắt dần, có nảy nhẹ ra ngoài
    }
  }
  return { theta, lift, squash };
};

const contactLocalX = CONTACT_U * LOGO_W - LOGO_W / 2;
const contactLocalY = LOGO_H / 2;
const contactWorldX = CANVAS_W / 2 + contactLocalX; // xoay quanh điểm chạm nên điểm này không trượt ngang

const placement = ({ theta, lift, squash }) => {
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  // Vật cứng lún xuống đúng bằng độ ép, phần biến dạng đẩy góc ngược lên nên góc luôn nằm trên mặt sàn
  const cx = contactWorldX - (contactLocalX * cos - contactLocalY * sin);
  const cy = FLOOR_Y - (contactLocalX * sin + contactLocalY * cos) - (lift - SQUASH * squash);
  return { cos, sin, cx, cy };
};

const renderLogo = (image, dpr, pose) => {
  const { data: out, width: ow, height: oh } = image;
  out.fill(0);
  const { data: src, w: sw, h: sh } = getSource();
  const { cos, sin, cx, cy } = placement(pose);
  const amount = SQUASH * pose.squash;
  const sx = sw / LOGO_W;
  const sy = sh / LOGO_H;
  const half = Math.hypot(LOGO_W, LOGO_H) / 2 + SQUASH;
  const x0 = Math.max(0, Math.floor((cx - half) * dpr));
  const x1 = Math.min(ow, Math.ceil((cx + half) * dpr));
  const y0 = Math.max(0, Math.floor((cy - half) * dpr));
  const y1 = Math.min(oh, Math.ceil((cy + half) * dpr));

  for (let py = y0; py < y1; py++) {
    const y = (py + 0.5) / dpr;
    for (let px = x0; px < x1; px++) {
      const x = (px + 0.5) / dpr;
      let rx = x - cx;
      let ry = y - cy;
      let lx = rx * cos + ry * sin;
      let ly = -rx * sin + ry * cos;
      if (amount !== 0) {
        const d = Math.hypot(lx - contactLocalX, ly - contactLocalY);
        if (d < RADIUS) {
          // Nghịch đảo bậc một của trường dịch chuyển: lấy màu tại điểm trước khi bị đẩy (lên trên và tỏa ngang)
          const w = (1 - (d / RADIUS) ** 2) ** 2;
          rx = x - SPREAD * amount * w * ((x - contactWorldX) / RADIUS) - cx;
          ry = y + amount * w - cy;
          lx = rx * cos + ry * sin;
          ly = -rx * sin + ry * cos;
        }
      }
      const u = (lx + LOGO_W / 2) * sx - 0.5;
      const v = (ly + LOGO_H / 2) * sy - 0.5;
      if (u < -1 || v < -1 || u >= sw || v >= sh) continue;
      const ix = Math.floor(u);
      const iy = Math.floor(v);
      const fx = u - ix;
      const fy = v - iy;
      // Nội suy song tuyến trên màu đã nhân alpha để viền không bị sẫm
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let k = 0; k < 4; k++) {
        const qx = ix + (k & 1);
        const qy = iy + (k >> 1);
        if (qx < 0 || qy < 0 || qx >= sw || qy >= sh) continue;
        const weight = (k & 1 ? fx : 1 - fx) * (k >> 1 ? fy : 1 - fy);
        const i = (qy * sw + qx) * 4;
        const wa = (src[i + 3] / 255) * weight;
        r += src[i] * wa;
        g += src[i + 1] * wa;
        b += src[i + 2] * wa;
        a += wa;
      }
      if (a <= 0) continue;
      const o = (py * ow + px) * 4;
      out[o] = r / a;
      out[o + 1] = g / a;
      out[o + 2] = b / a;
      out[o + 3] = a * 255;
    }
  }
};

const drawShadow = (ctx, pose, color) => {
  const { cx } = placement(pose);
  const tiltRatio = pose.theta / TILT;
  const near = 1 - Math.min(1, Math.max(0, pose.lift / LIFT));
  const press = Math.max(0, pose.squash);
  const radius = LOGO_W * 0.42 * (1 - 0.08 * tiltRatio) + 3 * press;
  ctx.save();
  ctx.globalAlpha = 0.28 + 0.2 * near + 0.08 * press;
  ctx.translate(cx + (contactWorldX - cx) * 0.25 * tiltRatio, FLOOR_Y + 1);
  ctx.scale(1, (4 + 1.5 * press) / radius);
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, "transparent");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

export default function SoftLogoCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !logo) return undefined;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(CANVAS_W * dpr);
    canvas.height = Math.round(CANVAS_H * dpr);
    const layer = document.createElement("canvas");
    layer.width = canvas.width;
    layer.height = canvas.height;
    const layerCtx = layer.getContext("2d");
    const image = layerCtx.createImageData(layer.width, layer.height);
    const shadowColor = getComputedStyle(document.documentElement).getPropertyValue("--color-ink-strong").trim() || "black";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = (pose) => {
      renderLogo(image, dpr, pose);
      layerCtx.putImageData(image, 0, 0);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawShadow(ctx, pose, shadowColor);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(layer, 0, 0);
    };

    let frame = 0;
    let start = 0;
    let cancelled = false;
    const tick = (now) => {
      if (!start) start = now;
      draw(poseAt(((now - start) % CYCLE_MS) / CYCLE_MS));
      frame = requestAnimationFrame(tick);
    };
    const begin = () => {
      if (cancelled) return;
      if (reduceMotion) draw(poseAt(0));
      else frame = requestAnimationFrame(tick);
    };
    if (logo.complete && logo.naturalWidth) begin();
    else logo.addEventListener("load", begin, { once: true });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      logo.removeEventListener("load", begin);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" style={{ width: CANVAS_W, height: CANVAS_H }} />;
}
