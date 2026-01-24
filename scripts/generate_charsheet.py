#!/usr/bin/env python3
"""
Generate a filled-in LaTeX character sheet from a YAML character file.

Usage:
    python generate_charsheet.py <character.yaml> [--output <output.tex>]

Example:
    python generate_charsheet.py characters/kelly-clarkson/kelly-clarkson.yaml
    python generate_charsheet.py characters/kelly-clarkson/kelly-clarkson.yaml --output kelly.tex
"""

import argparse
import re
import sys
from pathlib import Path

import yaml


def load_character(yaml_path: Path) -> dict:
    """Load character data from YAML file."""
    with open(yaml_path, 'r') as f:
        data = yaml.safe_load(f)

    # The final character data is in the 'final' section
    if 'final' in data:
        return data['final']
    return data


def escape_latex(text: str) -> str:
    """Escape special LaTeX characters."""
    if not text:
        return ''

    # Characters that need escaping in LaTeX
    replacements = {
        '&': r'\&',
        '%': r'\%',
        '$': r'\$',
        '#': r'\#',
        '_': r'\_',
        '{': r'\{',
        '}': r'\}',
        '~': r'\textasciitilde{}',
        '^': r'\textasciicircum{}',
    }

    for char, escaped in replacements.items():
        text = text.replace(char, escaped)

    return text


def format_expertise(expertise: list) -> str:
    """Format expertise list for LaTeX."""
    if not expertise:
        return ''

    lines = []
    for item in expertise:
        if isinstance(item, dict):
            skill = item.get('skill', '')
            rank = item.get('rank', 0)
            lines.append(f"{escape_latex(skill)}-{rank}")
        else:
            lines.append(escape_latex(str(item)))

    return ', '.join(lines)


def format_careers(careers: list) -> str:
    """Format careers list for LaTeX."""
    if not careers:
        return ''

    lines = []
    for career in careers:
        if isinstance(career, dict):
            name = career.get('name', '')
            terms = career.get('terms', 0)
            rank = career.get('rank', 0)
            rank_str = f" (Rank {rank})" if rank > 0 else ""
            lines.append(f"{escape_latex(name)} — {terms} term{'s' if terms != 1 else ''}{rank_str}")
        else:
            lines.append(escape_latex(str(career)))

    return r'\\[0.3em]'.join(lines)


def format_list(items: list) -> str:
    """Format a simple list for LaTeX."""
    if not items:
        return ''

    escaped = [escape_latex(str(item)) for item in items]
    return ', '.join(escaped)


def format_equipment(char: dict) -> str:
    """Format equipment section including cash, gear, and vehicles."""
    parts = []

    equipment = char.get('equipment', {})

    # Cash
    cash = equipment.get('cash', 0)
    if cash:
        parts.append(f"Cash: Cr{cash:,}")

    # Vehicles
    vehicles = equipment.get('vehicles', [])
    if vehicles:
        parts.append(f"Vehicles: {format_list(vehicles)}")

    # Other gear
    gear = equipment.get('gear', [])
    if gear:
        parts.append(f"Gear: {format_list(gear)}")

    return r'\\[0.3em]'.join(parts)


def format_notes(char: dict) -> str:
    """Format notes section."""
    notes = char.get('notes', '')
    backstory = char.get('backstory', {})

    parts = []

    if backstory:
        if 'birthplace' in backstory:
            parts.append(f"Birthplace: {escape_latex(backstory['birthplace'])}")
        if 'university' in backstory:
            parts.append(f"University: {escape_latex(backstory['university'])}")

    if notes:
        # Truncate long notes and escape
        note_text = notes.strip()
        if len(note_text) > 500:
            note_text = note_text[:500] + '...'
        # Replace newlines with LaTeX line breaks
        note_text = escape_latex(note_text)
        note_text = note_text.replace('\n', r'\\')
        parts.append(note_text)

    return r'\\[0.3em]'.join(parts) if parts else ''


def load_template(template_path: Path) -> str:
    """Load the LaTeX template."""
    with open(template_path, 'r') as f:
        return f.read()


def fill_template(template: str, char: dict) -> str:
    """Fill in the template with character data."""
    attrs = char.get('attributes', {})
    hp = char.get('hit_protection', {})
    equipment = char.get('equipment', {})

    replacements = {
        '<<NAME>>': escape_latex(char.get('name', 'Unknown')),
        '<<STR>>': str(attrs.get('STR', '')),
        '<<DEX>>': str(attrs.get('DEX', '')),
        '<<END>>': str(attrs.get('END', '')),
        '<<INT>>': str(attrs.get('INT', '')),
        '<<EDU>>': str(attrs.get('EDU', '')),
        '<<SOC>>': str(attrs.get('SOC', '')),
        '<<PSI>>': str(attrs.get('PSI', '')) if attrs.get('PSI') else '',
        '<<ARMOR>>': escape_latex(str(hp.get('armor', ''))),
        '<<BLOODIED>>': str(hp.get('bloodied', '')),
        '<<DYING>>': str(hp.get('total', '')),  # Dying threshold = total HP
        '<<AGE>>': str(char.get('age', '')),
        '<<HOMEWORLD>>': escape_latex(char.get('homeworld', '')),
        '<<SCHOOLING>>': escape_latex(char.get('schooling', '')),
        '<<CAREERS>>': format_careers(char.get('careers', [])),
        '<<EXPERTISE>>': format_expertise(char.get('expertise', [])),
        '<<WEAPONS>>': format_list(equipment.get('weapons', [])),
        '<<EQUIPMENT>>': format_equipment(char),
        '<<NOTES>>': format_notes(char),
    }

    result = template
    for placeholder, value in replacements.items():
        result = result.replace(placeholder, value)

    return result


def main():
    parser = argparse.ArgumentParser(
        description='Generate a LaTeX character sheet from a YAML character file.'
    )
    parser.add_argument('character', type=Path, help='Path to character YAML file')
    parser.add_argument('--output', '-o', type=Path, help='Output LaTeX file path')
    parser.add_argument('--template', '-t', type=Path,
                        help='Path to LaTeX template (default: templates/charsheet.tex)')
    parser.add_argument('--pdflatex', action='store_true',
                        help='Use pdflatex-compatible template (no fontspec)')

    args = parser.parse_args()

    # Determine paths
    script_dir = Path(__file__).parent
    project_root = script_dir.parent

    if args.template:
        template_path = args.template
    elif args.pdflatex:
        template_path = project_root / 'templates' / 'charsheet-pdflatex.tex'
    else:
        template_path = project_root / 'templates' / 'charsheet.tex'

    if args.output:
        output_path = args.output
    else:
        output_path = args.character.with_suffix('.tex')

    # Load and process
    if not args.character.exists():
        print(f"Error: Character file not found: {args.character}", file=sys.stderr)
        sys.exit(1)

    if not template_path.exists():
        print(f"Error: Template file not found: {template_path}", file=sys.stderr)
        sys.exit(1)

    print(f"Loading character from: {args.character}")
    char = load_character(args.character)

    print(f"Loading template from: {template_path}")
    template = load_template(template_path)

    print(f"Generating LaTeX...")
    filled = fill_template(template, char)

    print(f"Writing output to: {output_path}")
    with open(output_path, 'w') as f:
        f.write(filled)

    print(f"\nDone! To compile to PDF, run:")
    if args.pdflatex:
        print(f"  pdflatex {output_path}")
    else:
        print(f"  lualatex {output_path}")
        print(f"  (or use --pdflatex flag for pdflatex compatibility)")


if __name__ == '__main__':
    main()
