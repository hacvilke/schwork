"""
Shared Matplotlib styling helper for Schwork static SVG diagrams.

Use static Matplotlib SVGs selectively when an interactive browser graph cannot
draw the figure cleanly (e.g. geometry congruence proofs, vector addition diagrams,
ray optics, Physics free-body diagrams, or Integrated Science lab apparatus).

All figures use Schwork's academic palette:
  - Deep Navy (#1B365D) canvas — crisp in both Light & Dark mode
  - Soft Sage Teal (#6BC4B0) primary geometry & axes
  - Warm Amber (#F5A352) contrast accent for resultants, key angles, and callouts
"""

from pathlib import Path
import matplotlib as mpl
import matplotlib.pyplot as plt

# Palette constants
NAVY_BG = "#1B365D"
NAVY_GRID = "#274773"
NAVY_DARK = "#122440"
CYAN = "#6BC4B0"
CYAN_SOFT = "#9DD9CB"
LIME = "#F5A352"
INK_LIGHT = "#F4F7FA"
INK_MUTED = "#A5C0D6"
CORAL = "#F07152"

REPO_ROOT = Path(__file__).resolve().parents[2]
DIAGRAMS_OUT = REPO_ROOT / "static" / "img" / "diagrams"


def apply_schwork_style() -> None:
    """Configure Matplotlib rcParams for crisp, lightweight vector SVGs."""
    mpl.rcParams.update(
        {
            "figure.facecolor": NAVY_BG,
            "axes.facecolor": NAVY_BG,
            "savefig.facecolor": NAVY_BG,
            "savefig.edgecolor": NAVY_BG,
            "text.color": INK_LIGHT,
            "axes.labelcolor": INK_LIGHT,
            "axes.edgecolor": CYAN_SOFT,
            "xtick.color": INK_MUTED,
            "ytick.color": INK_MUTED,
            "grid.color": NAVY_GRID,
            "grid.linewidth": 0.9,
            "font.family": "sans-serif",
            "font.sans-serif": ["DejaVu Sans", "Liberation Sans", "Arial"],
            "mathtext.fontset": "dejavusans",
            "svg.fonttype": "path",  # Crisp consistent glyphs across all phones/browsers
            "axes.linewidth": 1.2,
        }
    )


def save_svg(fig: plt.Figure, rel_path: str) -> Path:
    """Save figure as a tightly cropped, lightweight SVG under static/img/diagrams/."""
    out_path = DIAGRAMS_OUT / rel_path
    out_path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(
        out_path,
        format="svg",
        bbox_inches="tight",
        pad_inches=0.22,
        facecolor=NAVY_BG,
    )
    plt.close(fig)
    return out_path
