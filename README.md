# fm-lead
Source code for FM‑Lead.com (Hugo site)

## Prerequisites

- Hugo Extended v0.146.0 or later (https://gohugo.io/installation/)

## Local Development

To run the site locally:

```bash
hugo server
```

The site will be available at http://localhost:1313/

## Building

To build the site for production:

```bash
hugo
```

The generated site will be in the `public/` directory.

## Project Structure

- `content/` - Markdown content files
- `themes/` - Hugo themes (using Ananke theme)
- `static/` - Static assets
- `layouts/` - Custom layout templates
- `hugo.toml` - Hugo configuration file
