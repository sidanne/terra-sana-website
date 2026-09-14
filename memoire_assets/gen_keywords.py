from PIL import Image, ImageDraw, ImageFont

def font(size, bold=True):
    names = ["segoeuib.ttf", "arialbd.ttf"] if bold else ["segoeui.ttf", "arial.ttf"]
    for n in names:
        try:
            return ImageFont.truetype(n, size)
        except Exception:
            continue
    return ImageFont.load_default()

F = font(30, True)
NAVY = (18, 40, 63)

def text_w(draw, text, fnt):
    b = draw.textbbox((0, 0), text, font=fnt)
    return b[2] - b[0]

def pill(draw, x, y, text, fill, text_color, outline=None):
    pad_x, h = 26, 62
    w = text_w(draw, text, F) + pad_x * 2
    draw.rounded_rectangle([x, y, x + w, y + h], radius=h // 2, fill=fill,
                             outline=outline, width=3 if outline else 0)
    bbox = draw.textbbox((0, 0), text, font=F)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text((x + (w - tw) / 2, y + (h - th) / 2 - bbox[1]), text, font=F, fill=text_color)
    return w

tech = [("Spring Boot", (109, 179, 63)), ("React", (32, 94, 153)), ("JWT", (123, 58, 176)), ("MySQL", (0, 117, 143))]
theme = ["Gestion associative", "Bénévolat", "Application web multilingue"]

# measure rows first
tmp = Image.new("RGB", (10, 10))
d = ImageDraw.Draw(tmp)
gap = 18

row1_w = sum(text_w(d, t, F) + 52 for t, _ in tech) + gap * (len(tech) - 1)
row2_w = sum(text_w(d, t, F) + 52 for t in theme) + gap * (len(theme) - 1)
W = int(max(row1_w, row2_w) + 40)
H = 62 * 2 + 26 + 40

im = Image.new("RGB", (W, H), (255, 255, 255))
d = ImageDraw.Draw(im)

x = (W - row1_w) / 2
y = 20
for label, color in tech:
    w = pill(d, x, y, label, color, (255, 255, 255))
    x += w + gap

x = (W - row2_w) / 2
y = 20 + 62 + 26
for label in theme:
    w = pill(d, x, y, label, (255, 255, 255), NAVY, outline=NAVY)
    x += w + gap

im.save("screenshots/mots_cles.png")
print("saved", im.size)
