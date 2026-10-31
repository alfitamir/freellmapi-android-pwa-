#!/usr/bin/env python3
"""Regenerate the PWA PNG icons in client/public/icons/ from the brand mark.

The PNGs are binary build assets (regenerable, and excluded from text-only
source snapshots). Run after cloning:

    pip install pillow
    python3 client/scripts/generate-pwa-icons.py

Artwork mirrors client/public/favicon.svg: dark rounded square, a broken
routing ring, and the brand dot.
"""
import pathlib

from PIL import Image, ImageDraw

OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "icons"


def draw_icon(size: int, maskable: bool = False, rounded: bool = True) -> Image.Image:
    S = 4  # supersample factor
    img = Image.new("RGBA", (size * S, size * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    bg = (9, 9, 11, 255)
    if rounded and not maskable:
        d.rounded_rectangle([0, 0, size * S - 1, size * S - 1], radius=int(size * S * 0.22), fill=bg)
    else:
        d.rectangle([0, 0, size * S, size * S], fill=bg)
    scale = 0.78 if maskable else 1.0  # keep art inside the maskable safe zone
    cx = cy = size * S / 2
    r_ring = size * S * 0.281 * scale
    w = max(2, int(size * S * 0.055 * scale))
    d.arc([cx - r_ring, cy - r_ring, cx + r_ring, cy + r_ring], start=35, end=309,
          fill=(250, 250, 250, 102), width=w)
    r_dot = size * S * 0.148 * scale
    d.ellipse([cx - r_dot, cy - r_dot, cx + r_dot, cy + r_dot], fill=(250, 250, 250, 255))
    return img.resize((size, size), Image.LANCZOS)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    draw_icon(192).save(OUT / "icon-192.png")
    draw_icon(512).save(OUT / "icon-512.png")
    draw_icon(512, maskable=True, rounded=False).save(OUT / "icon-maskable-512.png")
    draw_icon(180, rounded=False).save(OUT / "apple-touch-icon.png")
    print(f"Wrote PWA icons to {OUT}")


if __name__ == "__main__":
    main()
