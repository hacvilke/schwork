"""
Master runner for all Schwork Matplotlib static SVG diagram generators.

Run with:
    .venv/bin/python scripts/matplotlib/build_all.py
"""

from template_diagrams import build_all as build_template_diagrams


def main() -> None:
    generated: list[str] = []
    generated.extend(build_template_diagrams())

    print(f"Successfully generated {len(generated)} SVG diagram(s):")
    for item in generated:
        print(f"  - {item}")


if __name__ == "__main__":
    main()
