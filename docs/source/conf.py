# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = "Qwik"
copyright = "2024, Rayaan"
author = "Rayaan"

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = ["sphinx.ext.napoleon", "sphinxext.opengraph", "sphinx_copybutton"]


templates_path = ["_templates"]
exclude_patterns = []

latex_elements = {
    "sphinxsetup": "verbatimwithframe=false",
}

html_title = "Qwik"

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = "furo"
html_static_path = ["_static"]

html_theme_options = {
    "dark_css_variables": {
        "color-brand-primary": "#A685E2",
        "color-brand-content": "#FFABE1",
    },
    "light_css_variables": {
        "color-brand-primary": "#6867AC",
        "color-brand-content": "#CE7BB0",
    },
}

ogp_site_url = "https://qwik.readthedocs.io"
ogp_image = { "https://raw.githubusercontent.com/TRaya1n/qwik/QwikV2/docs/source/_static/qwik.png" }