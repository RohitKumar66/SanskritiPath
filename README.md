# SanskritiPath

SanskritiPath is a frontend-only project for exploring cultural traditions and heritage places from selected states in India. It was created as a Smart India Hackathon 2026 project (SIH26195).

## Overview

The site presents cultural entries and heritage places through a single-page interface. Visitors can browse by state or culture category, search and filter entries, and open a detail view with descriptions, cultural significance, and key facts.

The current bundled content in `data.js` contains 4 hero slides, 8 states, 120 culture entries, and 120 heritage places. This is a student project prototype, not a production service.

## Features

- Rotating hero image slideshow
- State cards and culture-category browsing
- Search across entry titles, states, categories, and short descriptions
- State and category filters for the Explore section
- State and place-type filters for heritage places
- Detail modal for culture and heritage entries
- Random culture discovery button
- Responsive navigation and page layouts
- Fallback image shown when an image cannot be loaded

## Technologies

- HTML5 for page structure
- CSS3 for styling and responsive layouts
- Vanilla JavaScript for rendering and interactions
- JavaScript and JSON-formatted data files for content
- Google Fonts: DM Sans and Playfair Display

There is no backend, database, build system, or package manager in this project.

## How It Works

`index.html` defines the page sections, controls, and detail modal. It loads `style.css` for presentation and loads `data.js` before `script.js`.

`data.js` assigns the content to `window.APP_DATA` and provides an image-error fallback. `script.js` reads `window.APP_DATA` and uses it to render the page, populate filters, and handle interactions. If `window.APP_DATA` is unavailable, the script attempts to fetch a file named `data.json`; no `data.json` currently exists in the repository, so the normal setup uses the data bundled in `data.js`.

`data_filled_massive.json` is also included as a JSON-formatted content file, but the current page does not load it. The site needs no install step. Some fonts and image URLs are remote and require an internet connection; local images are stored under `assets/images/`.

## Project Structure

```text
SanskritiPath/
├── assets/
│   ├── icons/
│   │   ├── favicon.ico
│   │   └── logo.png
│   └── images/
│       ├── culture/
│       │   ├── bihar/
│       │   ├── kerala/
│       │   ├── maharashtra/
│       │   ├── punjab/
│       │   ├── rajasthan/
│       │   ├── tamil-nadu/
│       │   ├── telangana/
│       │   └── west-bengal/
│       ├── heritage/
│       │   └── [state folders]
│       └── hero-state/
├── data.js                   # Active bundled content and image fallback
├── data_filled_massive.json  # JSON content file; not loaded by the current page
├── index.html                # Page markup and script/style references
├── script.js                 # Rendering, filtering, and UI interactions
├── style.css                 # Visual styles and responsive breakpoints
├── README.md
└── .gitignore
```

The `culture/` and `heritage/` image folders each contain folders for the eight states listed above. The `hero-state/` folder contains state images.

## Run Locally

No dependencies need to be installed. From the project folder, start a simple local web server:

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000). You can also open `index.html` directly in a browser, though a local server handles root-relative asset paths more consistently. Python is only used here as a convenient local server; it is not part of the website.

## Contributing

1. Fork the repository and create a branch for your change.
2. Keep changes focused and preserve the existing static-site setup unless a change requires otherwise.
3. Test the page locally, including its search, filters, and detail modal.
4. Open a pull request with a short description of what changed.

When adding cultural information or images, include reliable sources and any required image attribution.

## Possible Future Improvements

These are ideas for future work and are not currently implemented:

- Add source references and image credits for individual entries.
- Make the JSON content file the single editable data source.
- Expand the collection to additional states and territories.
- Add automated checks for data consistency and common UI behavior.

## Credits

The interface uses DM Sans and Playfair Display, loaded from Google Fonts. Some image URLs in the project point to Unsplash; other images are stored locally in `assets/images/`. The repository does not currently include a complete per-image attribution list, so verify usage and add appropriate credits before redistributing images.

Project reference: Smart India Hackathon 2026, SIH26195.

