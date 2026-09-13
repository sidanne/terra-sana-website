import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, FancyArrowPatch

NAVY = "#000000"
TEXT = "#000000"
LABEL_BG = "#EAEAEA"

FONT_NAME = "DejaVu Serif"
FONT_MONO = "DejaVu Sans Mono"

LINE_H = 0.30
NAME_H = 0.42
PAD = 0.14

def class_box(ax, xc, y_top, name, attrs, methods, width, stereotype=None):
    n_attr, n_meth = len(attrs), len(methods)
    extra = 0.42 if stereotype else 0
    height = NAME_H + extra + PAD * 2 + n_attr * LINE_H + n_meth * LINE_H + (0.10 if n_attr and n_meth else 0.05)
    x0 = xc - width / 2
    y_bot = y_top - height
    ax.add_patch(Rectangle((x0, y_bot), width, height, facecolor="white",
                             edgecolor=NAVY, linewidth=1.6, zorder=4))
    y = y_top
    if stereotype:
        ax.text(xc, y - 0.22, stereotype, ha="center", va="center", fontsize=9.5,
                 color="#888888", style="italic", family=FONT_MONO, zorder=5)
        y -= 0.42
    ax.text(xc, y - NAME_H / 2, name, ha="center", va="center", fontsize=12.5,
             fontweight="bold", color=NAVY, family=FONT_NAME, zorder=5)
    y -= NAME_H
    if attrs:
        ax.plot([x0, x0 + width], [y, y], color=NAVY, linewidth=0.9, linestyle=(0, (4, 3)), zorder=5)
    y -= PAD * 0.5
    for a in attrs:
        y -= LINE_H
        ax.text(x0 + 0.14, y + LINE_H * 0.22, a, ha="left", va="center", fontsize=9.3,
                 color=TEXT, family=FONT_MONO, zorder=5)
    if attrs and methods:
        y -= PAD * 0.4
        ax.plot([x0, x0 + width], [y, y], color=NAVY, linewidth=0.9, linestyle=(0, (4, 3)), zorder=5)
        y -= PAD * 0.15
    for m in methods:
        y -= LINE_H
        ax.text(x0 + 0.14, y + LINE_H * 0.22, m, ha="left", va="center", fontsize=9.3,
                 color=TEXT, family=FONT_MONO, zorder=5)
    return dict(xc=xc, top=y_top, bot=y_bot, x0=x0, x1=x0 + width, w=width, h=height,
                mid=(y_top + y_bot) / 2)

def enum_box(ax, xc, y_top, name, values, width=2.3):
    height = 0.42 + 0.34 + len(values) * LINE_H + 0.16
    x0 = xc - width / 2
    y_bot = y_top - height
    ax.add_patch(Rectangle((x0, y_bot), width, height, facecolor="white",
                             edgecolor=NAVY, linewidth=1.5, zorder=4))
    ax.text(xc, y_top - 0.20, "«enumeration»", ha="center", va="center", fontsize=8.6,
             color="#888888", style="italic", family=FONT_MONO, zorder=5)
    ax.text(xc, y_top - 0.46, name, ha="center", va="center", fontsize=11,
             fontweight="bold", color=NAVY, family=FONT_NAME, zorder=5)
    y = y_top - 0.66
    ax.plot([x0, x0 + width], [y, y], color=NAVY, linewidth=0.9, linestyle=(0, (4, 3)), zorder=5)
    for v in values:
        y -= LINE_H
        ax.text(x0 + 0.14, y + LINE_H * 0.22, v, ha="left", va="center", fontsize=9.3,
                 color=TEXT, family=FONT_MONO, zorder=5)
    return dict(xc=xc, top=y_top, bot=y_bot, x0=x0, x1=x0 + width, w=width, h=height,
                mid=(y_top + y_bot) / 2)

def tag(ax, x, y, text, fontsize=9.5, color=TEXT, bold=False, rot=0):
    ax.text(x, y, text, ha="center", va="center", fontsize=fontsize, color=color,
             fontweight="bold" if bold else "normal", family="DejaVu Sans", zorder=7, rotation=rot,
             bbox=dict(boxstyle="round,pad=0.16", fc=LABEL_BG, ec="none", alpha=0.97))

def straight(ax, p1, p2, lw=1.3):
    ax.plot([p1[0], p2[0]], [p1[1], p2[1]], color=NAVY, linewidth=lw, zorder=2, solid_capstyle="round")

def polyline(ax, pts, lw=1.3):
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    ax.plot(xs, ys, color=NAVY, linewidth=lw, zorder=2, solid_capstyle="round", solid_joinstyle="round")

def dependency(ax, p1, p2, rad=0.0):
    a = FancyArrowPatch(p1, p2, arrowstyle="-|>", mutation_scale=13,
                         connectionstyle=f"arc3,rad={rad}", linewidth=1.2, linestyle=(0, (5, 3)),
                         color=NAVY, zorder=2, shrinkA=1, shrinkB=1)
    ax.add_patch(a)

# ─────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(16.5, 17.5))
ax.axis("off")
ax.set_aspect("equal")

admin = class_box(ax, 9.0, 24.5, "Admin",
    ["id : Long «PK»", "username : String", "password : String"],
    ["login() : String", "changePassword() : void", "forgotPassword() : void",
     "resetPassword() : void", "updateProfile() : void"], width=3.6)

project = class_box(ax, 1.9, 20.2, "Project",
    ["id : Long «PK»", "name : String", "description : String", "link : String",
     "documentationLink : String", "image : String", "category : String",
     "isActive : Boolean", "createdAt : LocalDateTime"],
    ["activate() : void", "deactivate() : void"], width=3.5)

blogpost = class_box(ax, 6.1, 20.2, "BlogPost",
    ["id : Long «PK»", "title : String", "content : String", "image : String",
     "isPublished : Boolean", "createdAt : LocalDateTime"],
    ["publish() : void", "unpublish() : void"], width=3.5)

contact = class_box(ax, 10.3, 20.2, "ContactMessage",
    ["id : Long «PK»", "name : String", "email : String", "message : String",
     "isRead : Boolean", "createdAt : LocalDateTime"],
    ["markAsRead() : void", "reply() : void"], width=3.5)

event = class_box(ax, 15.7, 20.15, "Event",
    ["id : Long «PK»", "title : String", "description : String", "eventDate : LocalDateTime",
     "location : String", "maxPlaces : Integer", "status : EventStatus",
     "imageUrl : String", "createdAt : LocalDateTime"],
    ["getAvailablePlaces() : Integer", "updateStatus() : void", "sendGroupEmail() : void",
     "isFull() : Boolean", "exportPDF() : byte[]"], width=3.9)

event_status = enum_box(ax, 15.7, 14.75, "EventStatus", ["OPEN", "FULL", "CANCELLED", "FINISHED"], width=2.5)

appuser = class_box(ax, 2.3, 13.0, "AppUser",
    ["id : Long «PK»", "firstName : String", "lastName : String", "email : String",
     "password : String", "phone : String", "birthDate : LocalDate", "gender : String",
     "city : String", "postalCode : String", "skills : String", "availability : String",
     "preferredLanguage : String", "isActive : Boolean", "level : Level",
     "resetToken : String", "resetTokenExpiry : LocalDateTime", "createdAt : LocalDateTime"],
    ["register() : void", "login() : String", "forgotPassword() : void", "resetPassword() : void",
     "updateProfile() : void", "getLevel() : String", "downloadAttestation() : byte[]"], width=4.0)

review = class_box(ax, 7.4, 12.8, "Review",
    ["id : Long «PK»", "rating : Integer", "comment : String", "createdAt : LocalDateTime"],
    ["submitReview() : void", "getAverageRating() : Double"], width=3.6)

level_enum = enum_box(ax, 2.3, 3.6, "Level", ["BRONZE", "ARGENT", "OR"], width=2.1)

registration = class_box(ax, 12.9, 9.6, "Registration",
    ["id : Long «PK»", "status : RegistrationStatus", "position : Integer",
     "createdAt : LocalDateTime", "{unique : par bénévole et événement}"],
    ["confirm() : void", "refuse() : void", "cancel() : void",
     "promoteFromWaiting() : void", "sendConfirmationEmail() : void"], width=4.4)

reg_status = enum_box(ax, 18.3, 10.2, "RegistrationStatus", ["CONFIRMED", "WAITING", "REFUSED"], width=2.7)

# ═════════════════ Associations : Admin's 4 direct children ═════════════════
straight(ax, (8.0, admin['bot']), (2.9, project['top']))
tag(ax, 7.75, admin['bot'] - 0.25, "1")
tag(ax, 3.2, project['top'] + 0.25, "0..*")
tag(ax, 5.0, 20.62, "gère", bold=True)

straight(ax, (8.4, admin['bot']), (6.1, blogpost['top']))
tag(ax, 8.5, admin['bot'] - 0.25, "1")
tag(ax, 6.3, blogpost['top'] + 0.25, "0..*")
tag(ax, 7.0, 20.62, "publie", bold=True)

straight(ax, (9.6, admin['bot']), (9.8, contact['top']))
tag(ax, 9.35, admin['bot'] - 0.25, "1")
tag(ax, 9.85, contact['top'] + 0.22, "0..*")
tag(ax, 9.15, 20.85, "reçoit", bold=True)

straight(ax, (10.6, admin['bot']), (15.0, event['top']))
tag(ax, 10.55, admin['bot'] - 0.28, "1")
tag(ax, 14.3, event['top'] + 0.25, "0..*")
tag(ax, 12.75, 20.9, "crée", bold=True)

# ── Admin -valide-> Registration : elbow, corridor x=13.2 (clear of Event/EventStatus) ──
polyline(ax, [(10.8, 21.0), (13.2, 21.0), (13.2, 9.8), (12.9, registration['top'])])
tag(ax, 11.55, 21.18, "0..1")
tag(ax, 13.55, 9.9, "0..*")
tag(ax, 13.45, 15.5, "valide", bold=True)

# ═════════════════ AppUser / Review / Registration cluster ═════════════════
straight(ax, (appuser['x1'], 12.4), (review['x0'], 12.4))
tag(ax, appuser['x1'] + 0.25, 12.4, "1")
tag(ax, review['x0'] - 0.3, 12.4, "0..*")
tag(ax, 4.95, 12.68, "rédige", bold=True)

# ── Event -concerne-> Review : elbow, corridor x=13.9 (clear of EventStatus) ──
polyline(ax, [(14.0, event['bot']), (14.0, 13.7), (8.9, 13.7), (8.9, review['top'])])
tag(ax, 14.25, event['bot'] - 0.25, "1")
tag(ax, 8.65, review['top'] + 0.25, "0..*")
tag(ax, 11.4, 13.95, "concerne", bold=True)

# ── Event -accueille-> Registration : elbow, corridor x=14.3 (clear of EventStatus) ──
polyline(ax, [(14.3, event['bot']), (14.3, 9.9), (13.6, registration['top'])])
tag(ax, 14.55, event['bot'] - 0.25, "1")
tag(ax, 13.9, 9.95, "0..*")
tag(ax, 14.6, 11.15, "accueille", bold=True, rot=90)

# ── AppUser -effectue-> Registration : elbow along open band below Review ──
polyline(ax, [(appuser['x1'], 7.3), (10.5, 7.3), (registration['x0'], 7.3)])
tag(ax, appuser['x1'] + 0.25, 7.3, "1")
tag(ax, registration['x0'] - 0.3, 7.3, "0..*")
tag(ax, 7.9, 7.55, "effectue", bold=True)

# ═════════════════ Dependencies to enumerations (dashed) ═════════════════
dependency(ax, (16.3, event['bot']), (15.7, event_status['top']))
dependency(ax, (1.0, appuser['bot']), (2.3, level_enum['top']))
dependency(ax, (registration['x1'], 7.9), (reg_status['x0'], 9.0))

plt.tight_layout()
plt.savefig("screenshots/diagramme_classes.png", dpi=180, bbox_inches="tight", facecolor="white")
plt.close()
print("saved class diagram")
