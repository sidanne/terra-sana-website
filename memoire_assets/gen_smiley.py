from PIL import Image, ImageDraw

W = 500
im = Image.new("RGBA", (W, W), (255, 255, 255, 0))
d = ImageDraw.Draw(im)

NAVY = (18, 40, 63, 255)
BLUE = (32, 94, 153, 255)
GOLD = (46, 90, 140, 255)

pad = 18
d.ellipse([pad, pad, W - pad, W - pad], outline=NAVY, width=14, fill=(255, 255, 255, 255))

eye_w, eye_h = 34, 46
eye_y = W * 0.36
for cx in (W * 0.335, W * 0.665):
    d.ellipse([cx - eye_w / 2, eye_y - eye_h / 2, cx + eye_w / 2, eye_y + eye_h / 2], fill=NAVY)

d.arc([W * 0.24, W * 0.30, W * 0.76, W * 0.78], start=25, end=155, fill=BLUE, width=16)

cheek_r = 22
for cx in (W * 0.20, W * 0.80):
    d.ellipse([cx - cheek_r, W * 0.58 - cheek_r, cx + cheek_r, W * 0.58 + cheek_r], fill=(46, 90, 140, 60))

im.save("screenshots/smiley.png")
print("saved smiley")
