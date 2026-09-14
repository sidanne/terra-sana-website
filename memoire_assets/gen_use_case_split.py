import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Rectangle

NAVY = "#12283F"
BLUE = "#205E99"
TEXT = "#1B1B1B"
GREY = "#666666"

EW, EH = 3.3, 0.9
ROW_GAP = 1.18

def usecase(ax, x, y, label, w=EW, h=EH, fontsize=13.5):
    box = FancyBboxPatch((x - w/2, y - h/2), w, h,
                          boxstyle="round,pad=0.05,rounding_size=0.45",
                          linewidth=1.8, edgecolor=NAVY, facecolor="white", zorder=4)
    ax.add_patch(box)
    ax.text(x, y, label, ha="center", va="center", fontsize=fontsize, color=NAVY,
             family="DejaVu Sans", zorder=5)
    return (x, y, w, h)

def actor(ax, x, y, label, scale=1.0, label_side="bottom"):
    lw = 2.1
    head_r = 0.23 * scale
    hy = y + 0.85 * scale
    circ = plt.Circle((x, hy), head_r, fill=False, edgecolor=NAVY, linewidth=lw, zorder=4)
    ax.add_patch(circ)
    body_top = hy - head_r
    body_bot = y + 0.15 * scale
    ax.plot([x, x], [body_top, body_bot], color=NAVY, linewidth=lw, zorder=4)
    ax.plot([x - 0.32*scale, x + 0.32*scale], [y + 0.5*scale, y + 0.5*scale], color=NAVY, linewidth=lw, zorder=4)
    ax.plot([x, x - 0.28*scale], [body_bot, y - 0.35*scale], color=NAVY, linewidth=lw, zorder=4)
    ax.plot([x, x + 0.28*scale], [body_bot, y - 0.35*scale], color=NAVY, linewidth=lw, zorder=4)
    if label_side == "bottom":
        ax.text(x, y - 1.05*scale, label, ha="center", va="top", fontsize=14.5,
                 fontweight="bold", color=NAVY, family="DejaVu Serif", zorder=5,
                 bbox=dict(boxstyle="round,pad=0.12", fc="white", ec="none", alpha=0.95))
    return (x, y)

def link(ax, p_actor, p_uc, color=NAVY, lw=1.3):
    ax.plot([p_actor[0], p_uc[0]], [p_actor[1], p_uc[1]], color=color, linewidth=lw,
             zorder=2, solid_capstyle="round", alpha=0.85)

def stereotype_arrow(ax, xy_from, xy_to, label, rad=0.0):
    a = FancyArrowPatch(xy_from, xy_to, arrowstyle="-|>", mutation_scale=16,
                         connectionstyle=f"arc3,rad={rad}", linewidth=1.8,
                         linestyle=(0, (4, 3)), color=BLUE, zorder=3, shrinkA=2, shrinkB=2)
    ax.add_patch(a)
    mx = (xy_from[0] + xy_to[0]) / 2
    my = (xy_from[1] + xy_to[1]) / 2
    ax.text(mx + 0.4, my, label, ha="left", va="center", fontsize=14, color=BLUE,
             style="italic", fontweight="bold", family="DejaVu Sans", zorder=6,
             bbox=dict(boxstyle="round,pad=0.22", fc="white", ec=BLUE, linewidth=1.3, alpha=1.0))

def initial_scatter(ax, x, y):
    ax.scatter([x], [y], s=260, color=NAVY, zorder=10, edgecolors="none", linewidths=0)

# ═══════════════════════════════════════════════════════════════════
# Diagramme 1 — Côté bénévole (Visiteur + Bénévole)
# ═══════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(9.5, 15.5))
ax.axis("off")
ax.set_aspect("equal")

N = 12
TOP = ROW_GAP * (N - 1) + 1.6
ax.set_xlim(-2.6, 7.4)
ax.set_ylim(-1.3, TOP + 1.7)

box_x0, box_x1 = 1.6, 6.4
box_y0, box_y1 = -0.6, TOP + 0.75
ax.add_patch(Rectangle((box_x0, box_y0), box_x1 - box_x0, box_y1 - box_y0,
                         fill=False, edgecolor=NAVY, linewidth=2.4, zorder=1))
ax.text((box_x0+box_x1)/2, box_y1 - 0.42, "Système — Côté bénévole",
         ha="center", va="center", fontsize=16.5, fontweight="bold", color=NAVY, family="DejaVu Serif")

col_x = 4.0
labels = [
    "Consulter le site\nvitrine",
    "Consulter les\névénements",
    "Créer un compte",
    "Se connecter",
    "Réinitialiser son\nmot de passe",
    "Gérer son profil",
    "S'inscrire à un\névénement",
    "Rejoindre la liste\nd'attente",
    "Se désinscrire",
    "Consulter son\nhistorique",
    "Télécharger une\nattestation",
    "Laisser un avis",
]

row_top_y = TOP - 0.35
pos = [usecase(ax, col_x, row_top_y - i * ROW_GAP, lab) for i, lab in enumerate(labels)]

actor_x = -1.3
visiteur_y = row_top_y - 1 * ROW_GAP
benevole_y = row_top_y - 7 * ROW_GAP

actor(ax, actor_x, visiteur_y, "Visiteur")
actor(ax, actor_x, benevole_y, "Bénévole")

gen = FancyArrowPatch((actor_x, benevole_y + 1.15), (actor_x, visiteur_y - 0.2),
                        arrowstyle="-|>", mutation_scale=22, linewidth=1.9,
                        edgecolor=NAVY, facecolor="white", zorder=3)
ax.add_patch(gen)
ax.text(actor_x - 0.34, (benevole_y + visiteur_y) / 2 + 0.15, "« est un »",
         ha="center", va="center", fontsize=11, color=GREY, rotation=90, family="DejaVu Sans")

for i in range(3):
    link(ax, (actor_x, visiteur_y), (pos[i][0] - EW/2, pos[i][1]))
for i in range(3, 12):
    link(ax, (actor_x, benevole_y), (pos[i][0] - EW/2, pos[i][1]))

p_inscrire, p_rejoindre = pos[6], pos[7]
stereotype_arrow(ax, (p_rejoindre[0], p_rejoindre[1] + EH/2), (p_inscrire[0], p_inscrire[1] - EH/2), "«extend»")

plt.tight_layout()
plt.savefig("screenshots/diagramme_cas_utilisation_benevole.png", dpi=190, bbox_inches="tight", facecolor="white")
plt.close()
print("saved bénévole diagram")

# ═══════════════════════════════════════════════════════════════════
# Diagramme 2 — Administration
# ═══════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(9.5, 14.5))
ax.axis("off")
ax.set_aspect("equal")

N2 = 11
TOP2 = ROW_GAP * (N2 - 1) + 1.6
ax.set_xlim(-1.6, 8.4)
ax.set_ylim(-1.3, TOP2 + 1.7)

box_x0, box_x1 = 0.6, 5.4
box_y0, box_y1 = -0.6, TOP2 + 0.75
ax.add_patch(Rectangle((box_x0, box_y0), box_x1 - box_x0, box_y1 - box_y0,
                         fill=False, edgecolor=NAVY, linewidth=2.4, zorder=1))
ax.text((box_x0+box_x1)/2, box_y1 - 0.42, "Système — Administration",
         ha="center", va="center", fontsize=16.5, fontweight="bold", color=NAVY, family="DejaVu Serif")

col_x2 = 3.0
labels2 = [
    "Se connecter\n(admin)",
    "Réinitialiser son mot\nde passe (admin)",
    "Gérer son profil\n(admin)",
    "Gérer les\névénements",
    "Valider / refuser les\ninscriptions",
    "Envoyer un email de\nconfirmation",
    "Envoyer des emails\ngroupés",
    "Gérer les bénévoles",
    "Consulter le tableau\nde bord",
    "Exporter la liste\ndes inscrits",
    "Consulter les avis",
]

row_top_y2 = TOP2 - 0.35
pos2 = [usecase(ax, col_x2, row_top_y2 - i * ROW_GAP, lab) for i, lab in enumerate(labels2)]

actor_x2 = 7.1
admin_y = row_top_y2 - 5 * ROW_GAP
actor(ax, actor_x2, admin_y, "Administrateur")

for i in range(11):
    link(ax, (actor_x2, admin_y), (pos2[i][0] + EW/2, pos2[i][1]))

p_valider, p_email = pos2[4], pos2[5]
stereotype_arrow(ax, (p_valider[0], p_valider[1] - EH/2), (p_email[0], p_email[1] + EH/2), "«include»")

plt.tight_layout()
plt.savefig("screenshots/diagramme_cas_utilisation_admin.png", dpi=190, bbox_inches="tight", facecolor="white")
plt.close()
print("saved admin diagram")
