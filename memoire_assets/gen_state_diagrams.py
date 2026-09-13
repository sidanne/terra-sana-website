import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, Circle
from matplotlib.patches import FancyArrowPatch

NAVY = "#12283F"
TEXT = "#1B1B1B"

def state_box(ax, x, y, w, h, label):
    box = FancyBboxPatch((x - w/2, y - h/2), w, h,
                          boxstyle="round,pad=0.08,rounding_size=0.18",
                          linewidth=2, edgecolor=NAVY, facecolor="white", zorder=3)
    ax.add_patch(box)
    ax.text(x, y, label, ha="center", va="center", fontsize=15, fontweight="bold",
             color=NAVY, zorder=4, family="DejaVu Serif")

def initial_state(ax, x, y):
    ax.scatter([x], [y], s=260, color=NAVY, zorder=10, edgecolors="none", linewidths=0)

def arrow(ax, xy_from, xy_to, label=None, rad=0.0, label_off=(0, 0.22), fontsize=11.5, color=NAVY):
    a = FancyArrowPatch(xy_from, xy_to, arrowstyle="-|>", mutation_scale=16,
                         connectionstyle=f"arc3,rad={rad}", linewidth=1.6,
                         color=color, zorder=2, shrinkA=2, shrinkB=2)
    ax.add_patch(a)
    if label:
        mx = (xy_from[0] + xy_to[0]) / 2 + label_off[0]
        my = (xy_from[1] + xy_to[1]) / 2 + label_off[1]
        if rad != 0:
            dx, dy = xy_to[0] - xy_from[0], xy_to[1] - xy_from[1]
            mx += -dy * rad * 0.5
            my += dx * rad * 0.5
        ax.text(mx, my, label, ha="center", va="center", fontsize=fontsize, color=TEXT,
                 family="DejaVu Sans", zorder=5,
                 bbox=dict(boxstyle="round,pad=0.15", fc="white", ec="none", alpha=0.92))

# ═══════════════════════════════════════════════════════════════
# Diagramme 1 — Cycle de vie d'un événement (Event / EventStatus)
# ═══════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(9.2, 6.6))
ax.set_xlim(0, 10.2)
ax.set_ylim(0, 7.4)
ax.axis("off")

OPEN = (2.6, 5.7)
FULL = (7.6, 5.7)
FINISHED = (2.6, 1.3)
CANCELLED = (7.6, 1.3)
BW, BH = 1.9, 0.95   # OPEN/FULL box size
BW2, BH2 = 2.3, 0.95  # FINISHED/CANCELLED box size (longer labels)

initial_state(ax, 0.45, 5.7)
arrow(ax, (0.85, 5.7), (OPEN[0] - BW/2 - 0.2, OPEN[1]), "créer\nl'événement")

state_box(ax, *OPEN, BW, BH, "OPEN")
state_box(ax, *FULL, BW, BH, "FULL")
state_box(ax, *FINISHED, BW2, BH2, "FINISHED")
state_box(ax, *CANCELLED, BW2, BH2, "CANCELLED")

# OPEN <-> FULL (horizontal, offset so the two arrows don't overlap)
arrow(ax, (OPEN[0] + BW/2 + 0.2, OPEN[1] + 0.16), (FULL[0] - BW/2 - 0.2, FULL[1] + 0.16),
      "inscriptions confirmées\n= maxPlaces  (RG-06)", label_off=(0, 0.48))
arrow(ax, (FULL[0] - BW/2 - 0.2, FULL[1] - 0.16), (OPEN[0] + BW/2 + 0.2, OPEN[1] - 0.16),
      "une place se libère\n(désinscription)", label_off=(0, -0.48))

# OPEN -> FINISHED / FULL -> FINISHED
arrow(ax, (OPEN[0] - 0.35, OPEN[1] - BH/2 - 0.22), (FINISHED[0] - 0.15, FINISHED[1] + BH2/2 + 0.22),
      "date dépassée —\ntâche planifiée / 5 min", rad=-0.06, label_off=(-1.6, 0.15))
arrow(ax, (FULL[0] - 0.1, FULL[1] - BH/2 - 0.22), (FINISHED[0] + BW2/2 + 0.25, FINISHED[1] + 0.25),
      "date dépassée —\ntâche planifiée / 5 min", rad=0.1, label_off=(1.7, -0.75))

# OPEN -> CANCELLED / FULL -> CANCELLED
arrow(ax, (OPEN[0] + 0.35, OPEN[1] - BH/2 - 0.22), (CANCELLED[0] - BW2/2 - 0.25, CANCELLED[1] + 0.25),
      "admin : annulation\nexplicite (RG-06)", rad=0.06, label_off=(-1.7, -0.75))
arrow(ax, (FULL[0] + 0.25, FULL[1] - BH/2 - 0.22), (CANCELLED[0] - 0.05, CANCELLED[1] + BH2/2 + 0.22),
      "admin : annulation\nexplicite (RG-06)", rad=0.08, label_off=(1.55, 0.15))

ax.text(5.1, 6.85, "Cycle de vie d'un événement (EventStatus)", ha="center", fontsize=14.5,
         fontweight="bold", color=NAVY, family="DejaVu Serif")

plt.tight_layout()
plt.savefig("screenshots/diagramme_etat_event.png", dpi=200, bbox_inches="tight", facecolor="white")
plt.close()
print("saved event state diagram")

# ═══════════════════════════════════════════════════════════════
# Diagramme 2 — Cycle de vie d'une inscription (Registration)
# ═══════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(9.8, 6.6))
ax.set_xlim(0, 10.8)
ax.set_ylim(0, 7.4)
ax.axis("off")

WAITING = (2.6, 5.7)
CONFIRMED = (8.0, 5.7)
REFUSED = (8.0, 1.5)
DESINSCRIT = (2.6, 1.5)
WW, WH = 2.1, 0.95
CW, CH = 2.3, 0.95
RW, RH = 2.1, 0.95
CIRC_R = 0.34

initial_state(ax, 0.45, 5.7)
arrow(ax, (0.85, 5.7), (WAITING[0] - WW/2 - 0.2, WAITING[1]), "s'inscrire à\nun événement")

state_box(ax, *WAITING, WW, WH, "WAITING")
state_box(ax, *CONFIRMED, CW, CH, "CONFIRMED")
state_box(ax, *REFUSED, RW, RH, "REFUSED")

# final pseudostate: registration row deleted (désinscription)
ax.add_patch(Circle(DESINSCRIT, CIRC_R, facecolor="white", edgecolor=NAVY, linewidth=2, zorder=3))
ax.add_patch(Circle(DESINSCRIT, 0.15, facecolor=NAVY, edgecolor=NAVY, zorder=3))
ax.text(DESINSCRIT[0], DESINSCRIT[1] - CIRC_R - 0.32, "désinscription\n(suppression)", ha="center",
         fontsize=10.5, color=TEXT, family="DejaVu Sans")

# WAITING -> CONFIRMED
arrow(ax, (WAITING[0] + WW/2 + 0.2, WAITING[1] + 0.05), (CONFIRMED[0] - CW/2 - 0.2, CONFIRMED[1] + 0.05),
      "admin : confirme\n(RG-11) — email (RG-12)", label_off=(0, 0.42))

# WAITING -> REFUSED (diagonal, exits bottom-right of WAITING, enters top-left of REFUSED)
arrow(ax, (WAITING[0] + 0.55, WAITING[1] - WH/2 - 0.22), (REFUSED[0] - RW/2 - 0.22, REFUSED[1] + 0.5),
      "admin : refuse\n(RG-11) — email (RG-12)", rad=-0.1, label_off=(0.35, 0.0))

# WAITING -> désinscription (final state), exits bottom of WAITING
arrow(ax, (WAITING[0] - 0.25, WAITING[1] - WH/2 - 0.22), (DESINSCRIT[0] + 0.05, DESINSCRIT[1] + CIRC_R + 0.18),
      "désinscription libre\n(quitte la liste d'attente)", rad=-0.08, label_off=(-1.7, -0.4))

# CONFIRMED -> désinscription (final state), exits bottom of CONFIRMED
arrow(ax, (CONFIRMED[0] - 0.6, CONFIRMED[1] - CH/2 - 0.3), (DESINSCRIT[0] + 0.42, DESINSCRIT[1] + 0.34),
      "désinscription (RG-14) —\npromotion du suivant (RG-13)", rad=0.08, label_off=(1.75, 1.55))

ax.text(5.4, 6.85, "Cycle de vie d'une inscription (Registration)", ha="center", fontsize=14.5,
         fontweight="bold", color=NAVY, family="DejaVu Serif")

plt.tight_layout()
plt.savefig("screenshots/diagramme_etat_registration.png", dpi=200, bbox_inches="tight", facecolor="white")
plt.close()
print("saved registration state diagram")
