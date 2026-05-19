import zipfile
import os
import shutil

# Path to your .docx file
docx_path = r'c:/Hugo/bin/fmlead/content/focus/projects/inverter-design-from-first-principles/Inverter Design from First Principles post.docx'
# Output folder for images
output_folder = r'c:/Hugo/bin/fmlead/content/focus/projects/inverter-design-from-first-principles/media'

with zipfile.ZipFile(docx_path, 'r') as docx:
    for file in docx.namelist():
        if file.startswith('word/media/'):
            filename = os.path.basename(file)
            out_path = os.path.join(output_folder, filename)
            with docx.open(file) as source, open(out_path, 'wb') as target:
                shutil.copyfileobj(source, target)
            print(f'Extracted: {filename}')

print('All images extracted!')
