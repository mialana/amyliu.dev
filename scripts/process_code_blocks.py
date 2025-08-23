import os
import re

def convert_indentation_in_code_blocks(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        lines = f.readlines()

    inside_code_block = False
    new_lines = []

    for line in lines:
        # Detect start or end of fenced code block
        if re.match(r"^```", line):
            inside_code_block = not inside_code_block
            new_lines.append(line)
            continue

        if inside_code_block:
            # Replace leading multiples of 4 spaces with half as many 2-spaces
            match = re.match(r"^( +)", line)
            if match:
                leading = match.group(1)
                # Count spaces and rebuild with 2-space groups
                space_count = len(leading)
                new_indent = " " * (space_count // 4 * 2 + space_count % 4)
                line = new_indent + line[space_count:]
        new_lines.append(line)

    with open(filepath, "w", encoding="utf-8") as f:
        f.writelines(new_lines)
    print(f"Updated: {filepath}")


def process_directory(directory="."):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".md"):
                convert_indentation_in_code_blocks(os.path.join(root, file))


if __name__ == "__main__":
    process_directory("./src/content")  # Change "." to another path if needed
