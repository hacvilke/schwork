"""
Starter Matplotlib SVG diagrams for the Schwork Sample Lesson.

Generates:
  1. template/vector-addition.svg       — Parallelogram / Triangle Law of Vector Addition
  2. template/right-triangle-trig.svg   — Right-Angled Triangle (Pythagoras & SOH-CAH-TOA)
"""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Arc, Polygon, Rectangle

from schwork_mpl import (
    CYAN,
    CYAN_SOFT,
    INK_LIGHT,
    INK_MUTED,
    LIME,
    NAVY_BG,
    NAVY_DARK,
    NAVY_GRID,
    apply_schwork_style,
    save_svg,
)


def build_vector_addition() -> str:
    apply_schwork_style()
    fig, ax = plt.subplots(figsize=(6.8, 4.4))

    # Subtle coordinate grid
    ax.set_xlim(-0.8, 7.6)
    ax.set_ylim(-0.7, 5.2)
    ax.set_aspect("equal")
    ax.grid(True, linestyle="-", alpha=0.75, zorder=0)
    ax.set_axisbelow(True)

    # Clean axes lines through origin
    ax.axhline(0, color=INK_MUTED, linewidth=1.0, alpha=0.55, zorder=1)
    ax.axvline(0, color=INK_MUTED, linewidth=1.0, alpha=0.55, zorder=1)

    # Vectors a = (4, 1), b = (2, 3), r = a + b = (6, 4)
    a = np.array([4.0, 1.0])
    b = np.array([2.0, 3.0])
    r = a + b

    # Soft parallelogram fill
    para = Polygon(
        [[0, 0], a, r, b],
        closed=True,
        facecolor=CYAN,
        alpha=0.10,
        edgecolor="none",
        zorder=1,
    )
    ax.add_patch(para)

    # Dashed projection edges completing parallelogram
    ax.plot([a[0], r[0]], [a[1], r[1]], linestyle="--", color=CYAN_SOFT, linewidth=1.6, alpha=0.8, zorder=2)
    ax.plot([b[0], r[0]], [b[1], r[1]], linestyle="--", color=CYAN_SOFT, linewidth=1.4, alpha=0.55, zorder=2)

    arrow_kw = dict(head_width=0.22, head_length=0.28, length_includes_head=True, zorder=4)

    # Vector a
    ax.arrow(0, 0, a[0], a[1], fc=CYAN, ec=CYAN, linewidth=2.6, **arrow_kw)
    # Vector b (from origin and tail-to-tip from a)
    ax.arrow(0, 0, b[0], b[1], fc=CYAN_SOFT, ec=CYAN_SOFT, linewidth=2.2, **arrow_kw)
    ax.arrow(a[0], a[1], b[0], b[1], fc=CYAN_SOFT, ec=CYAN_SOFT, linewidth=2.0, linestyle="--", **arrow_kw)

    # Resultant r in Acid Lime (intentional clash highlight!)
    ax.arrow(0, 0, r[0], r[1], fc=LIME, ec=LIME, linewidth=3.2, **arrow_kw)

    # Angle arc between vector a and resultant r
    ang_a = np.degrees(np.arctan2(a[1], a[0]))
    ang_r = np.degrees(np.arctan2(r[1], r[0]))
    arc = Arc((0, 0), 2.3, 2.3, angle=0, theta1=ang_a, theta2=ang_r, color=LIME, linewidth=1.8, zorder=3)
    ax.add_patch(arc)
    ax.text(1.38, 0.65, r"$\theta$", color=LIME, fontsize=12, fontweight="bold", zorder=5)

    # Key vertices
    for pt, lbl, offset in [
        ((0, 0), "O(0, 0)", (-0.55, -0.42)),
        (a, "A(4, 1)", (0.18, -0.35)),
        (b, "B(2, 3)", (-0.65, 0.25)),
        (r, "R(6, 4)", (0.16, 0.18)),
    ]:
        ax.scatter(*pt, color=LIME if lbl.startswith("R") else INK_LIGHT, s=36, zorder=6)
        ax.text(
            pt[0] + offset[0],
            pt[1] + offset[1],
            lbl,
            fontsize=9.5,
            color=LIME if lbl.startswith("R") else INK_MUTED,
            fontweight="bold" if lbl.startswith("R") else "normal",
            zorder=6,
        )

    # Vector labels
    ax.text(
        2.05,
        -0.05,
        r"$\mathbf{a} = \binom{4}{1}$",
        color=CYAN,
        fontsize=11,
        fontweight="bold",
        bbox=dict(boxstyle="round,pad=0.25", fc=NAVY_DARK, ec=CYAN, lw=1.0),
        zorder=6,
    )
    ax.text(
        5.32,
        1.95,
        r"$\mathbf{b} = \binom{2}{3}$",
        color=CYAN_SOFT,
        fontsize=11,
        fontweight="bold",
        bbox=dict(boxstyle="round,pad=0.25", fc=NAVY_DARK, ec=CYAN_SOFT, lw=1.0),
        zorder=6,
    )
    ax.text(
        1.9,
        4.15,
        r"$\mathbf{r} = \mathbf{a} + \mathbf{b} = \binom{6}{4}$",
        color=NAVY_DARK,
        fontsize=11,
        fontweight="bold",
        bbox=dict(boxstyle="round,pad=0.34", fc=LIME, ec=LIME, lw=1.0),
        zorder=7,
    )
    # Clean leader line from r badge to resultant midpoint
    ax.annotate(
        "",
        xy=(3.45, 2.32),
        xytext=(3.2, 3.85),
        arrowprops=dict(arrowstyle="->", color=LIME, lw=1.5, connectionstyle="arc3,rad=-0.12"),
        zorder=6,
    )

    ax.set_title(
        "Triangle & Parallelogram Law of Vector Addition",
        fontsize=13,
        fontweight="bold",
        color=INK_LIGHT,
        pad=14,
        loc="left",
    )
    ax.set_xlabel("x (horizontal component)", fontsize=10, labelpad=6)
    ax.set_ylabel("y (vertical component)", fontsize=10, labelpad=6)

    for spine in ["top", "right"]:
        ax.spines[spine].set_visible(False)
    for spine in ["bottom", "left"]:
        ax.spines[spine].set_color(NAVY_GRID)

    out = save_svg(fig, "template/vector-addition.svg")
    return str(out)


def build_right_triangle_trig() -> str:
    apply_schwork_style()
    fig, ax = plt.subplots(figsize=(6.8, 4.3))

    # Triangle vertices: A (0,0), B (5,0), C (5,3.2)
    A = np.array([0.0, 0.0])
    B = np.array([5.0, 0.0])
    C = np.array([5.0, 3.2])

    tri = Polygon([A, B, C], closed=True, facecolor=CYAN, alpha=0.14, edgecolor="none", zorder=1)
    ax.add_patch(tri)

    # Triangle sides
    ax.plot([A[0], B[0]], [A[1], B[1]], color=CYAN, linewidth=2.8, zorder=3)
    ax.plot([B[0], C[0]], [B[1], C[1]], color=CYAN_SOFT, linewidth=2.8, zorder=3)
    ax.plot([A[0], C[0]], [A[1], C[1]], color=LIME, linewidth=3.2, zorder=4)

    # Right-angle square marker at B
    sq_size = 0.42
    sq = Rectangle((B[0] - sq_size, B[1]), sq_size, sq_size, facecolor="none", edgecolor=CYAN_SOFT, linewidth=1.8, zorder=3)
    ax.add_patch(sq)

    # Angle arc at A
    theta_deg = np.degrees(np.arctan2(C[1] - A[1], C[0] - A[0]))
    arc = Arc(A, 1.8, 1.8, angle=0, theta1=0, theta2=theta_deg, color=LIME, linewidth=2.2, zorder=4)
    ax.add_patch(arc)
    ax.text(1.06, 0.25, r"$\theta$", color=LIME, fontsize=14, fontweight="bold", zorder=5)

    # Vertex dots & labels
    for pt, lbl, offset in [
        (A, "A", (-0.32, -0.25)),
        (B, "B (90°)", (0.12, -0.32)),
        (C, "C", (0.14, 0.14)),
    ]:
        ax.scatter(*pt, color=INK_LIGHT, s=42, zorder=6)
        ax.text(pt[0] + offset[0], pt[1] + offset[1], lbl, fontsize=11, fontweight="bold", color=INK_LIGHT, zorder=6)

    # Side labels
    ax.text(
        2.5,
        -0.58,
        "Adjacent  (a = 4 cm)",
        ha="center",
        color=CYAN,
        fontsize=11,
        fontweight="bold",
        bbox=dict(boxstyle="round,pad=0.25", fc=NAVY_DARK, ec=CYAN, lw=1.0),
    )
    ax.text(
        5.28,
        1.6,
        "Opposite\n(b = 3 cm)",
        va="center",
        color=CYAN_SOFT,
        fontsize=11,
        fontweight="bold",
        bbox=dict(boxstyle="round,pad=0.25", fc=NAVY_DARK, ec=CYAN_SOFT, lw=1.0),
    )
    ax.text(
        2.45,
        1.92,
        "Hypotenuse (c = 5 cm)",
        ha="center",
        va="center",
        rotation=theta_deg,
        color=NAVY_DARK,
        fontsize=10.5,
        fontweight="bold",
        bbox=dict(boxstyle="round,pad=0.28", fc=LIME, ec=LIME, lw=1.0),
        zorder=6,
    )

    # Reference formula callout box cleanly above the hypotenuse
    ax.text(
        -0.45,
        4.32,
        "Pythagoras:  $c^2 = a^2 + b^2$\n"
        r"$\sin\theta = \frac{\mathrm{Opp}}{\mathrm{Hyp}}$     "
        r"$\cos\theta = \frac{\mathrm{Adj}}{\mathrm{Hyp}}$     "
        r"$\tan\theta = \frac{\mathrm{Opp}}{\mathrm{Adj}}$",
        fontsize=9.8,
        color=INK_LIGHT,
        va="top",
        bbox=dict(boxstyle="round,pad=0.45", fc=NAVY_DARK, ec=CYAN, lw=1.0),
        zorder=7,
    )

    ax.set_xlim(-0.7, 7.0)
    ax.set_ylim(-1.05, 4.6)
    ax.set_aspect("equal")
    ax.axis("off")
    ax.set_title(
        "Right-Angled Triangle Reference (Geometry & Trig)",
        fontsize=12.5,
        fontweight="bold",
        color=INK_LIGHT,
        pad=10,
        loc="left",
    )

    out = save_svg(fig, "template/right-triangle-trig.svg")
    return str(out)


def build_all() -> list[str]:
    return [
        build_vector_addition(),
        build_right_triangle_trig(),
    ]


if __name__ == "__main__":
    for path in build_all():
        print(f"Generated: {path}")
