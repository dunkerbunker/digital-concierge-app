import os

IGNORED_FOLDERS = {'.git', 'node_modules', '.next'}

def generate_file_structure(directory_path, prefix=''):
    lines = []
    try:
        items = sorted(os.listdir(directory_path))
    except PermissionError:
        return [f"{prefix}└── [Permission Denied] {os.path.basename(directory_path)}/"]

    for index, item in enumerate(items):
        if item in IGNORED_FOLDERS:
            continue

        item_path = os.path.join(directory_path, item)
        connector = '└── ' if index == len(items) - 1 else '├── '
        lines.append(f"{prefix}{connector}{item}")
        if os.path.isdir(item_path):
            extension = '    ' if index == len(items) - 1 else '│   '
            lines.extend(generate_file_structure(item_path, prefix + extension))
    return lines

def write_to_markdown(directory_path, output_file='structure.md'):
    structure_lines = generate_file_structure(directory_path)
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(f"# 📁 Directory Structure of `{os.path.abspath(directory_path)}`\n\n")
        f.write("```\n")
        f.write(f"{os.path.basename(os.path.abspath(directory_path)) or '/'}\n")
        f.write("\n".join(structure_lines))
        f.write("\n```")

if __name__ == "__main__":
    current_dir = os.getcwd()
    write_to_markdown(current_dir)
    print(f"✅ Directory structure saved to `structure.md` in {current_dir}")
