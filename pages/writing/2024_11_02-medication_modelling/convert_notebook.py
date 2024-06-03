import nbformat
from nbconvert import HTMLExporter

# Load the notebook
with open("fit_elvanse_concentration.ipynb") as f:
    notebook = nbformat.read(f, as_version=4)

# Initialize the HTML exporter
html_exporter = HTMLExporter()

# Convert the notebook to HTML
(body, resources) = html_exporter.from_notebook_node(notebook)

# Write the HTML output to a file
with open("fit_elvanse_concentration.html", "w") as f:
    f.write(body)