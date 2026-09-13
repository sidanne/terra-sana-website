from PIL import Image, ImageDraw, ImageFont

W, H = 1720, 980
BG = (255, 255, 255)
NAVY = (18, 40, 63)
GREY = (90, 90, 90)

im = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(im)

def font(size, bold=True):
    names = ["segoeuib.ttf", "arialbd.ttf"] if bold else ["segoeui.ttf", "arial.ttf"]
    for n in names:
        try:
            return ImageFont.truetype(n, size)
        except Exception:
            continue
    return ImageFont.load_default()

f_group = font(30, True)
f_name = font(30, True)
f_sub = font(19, False)

def text_center(draw, xy, text, fnt, fill):
    bbox = draw.textbbox((0, 0), text, font=fnt)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    draw.text((xy[0] - w/2, xy[1] - h/2 - bbox[1]), text, font=fnt, fill=fill)

def badge(draw, x, y, w, h, color, name, sub=None, text_color=(255,255,255)):
    draw.rounded_rectangle([x, y, x+w, y+h], radius=16, fill=color)
    cy = y + h/2 - (10 if sub else 0)
    text_center(draw, (x + w/2, cy), name, f_name, text_color)
    if sub:
        text_center(draw, (x + w/2, y + h/2 + 22), sub, f_sub, text_color)

groups = [
    ("BACKEND", [
        ("Java 21", (237, 139, 0)),
        ("Spring Boot", (109, 179, 63)),
        ("Spring Security", (65, 138, 46)),
        ("Spring Data JPA", (89, 179, 122)),
    ]),
    ("FRONTEND", [
        ("React 18", (32, 94, 153), (10,25,40)),
        ("Chart.js", (255, 99, 132)),
    ]),
    ("DONNÉES & SÉCURITÉ", [
        ("MySQL", (0, 117, 143)),
        ("jjwt (JWT)", (123, 58, 176)),
        ("BCrypt", (52, 73, 94)),
    ]),
    ("DOCUMENTS & OUTILS", [
        ("iText7 (PDF)", (198, 40, 40)),
        ("Spring Mail", (77, 144, 195)),
        ("WAMP Server", (241, 148, 24)),
    ]),
]

pad_x = 70
pad_y = 60
group_gap = 46
badge_w, badge_h = 258, 108
badge_gap = 22

y = pad_y
for gname, items in groups:
    d.text((pad_x, y), gname, font=f_group, fill=NAVY)
    d.line([(pad_x, y + 44), (pad_x + 210, y + 44)], fill=(46, 90, 140), width=4)
    y_row = y + 62
    x = pad_x
    for item in items:
        name = item[0]
        color = item[1]
        tcol = item[2] if len(item) > 2 else (255, 255, 255)
        badge(d, x, y_row, badge_w, badge_h, color, name, text_color=tcol)
        x += badge_w + badge_gap
    y = y_row + badge_h + group_gap

im.save("screenshots/tech_stack.png")
print("saved", im.size)
