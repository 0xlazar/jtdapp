# Journey to DevConnect

<p align="center">
  <img src="icons/logo.png" alt="Journey to DevConnect Logo" width="120" height="120" />
</p>

A Progressive Web App (PWA) that helps you discover and track blockchain events around the world.

## Features

- Interactive world map showing blockchain events
- Event clustering for better visualization
- Custom floating window for event details
- Offline support through PWA
- Mobile-friendly design
- Installable on devices

## Tech Stack

- HTML5
- Tailwind CSS
- JavaScript (Vanilla)
- Leaflet.js for maps
- PWA capabilities

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/jtdapp.git
cd jtdapp
```

2. Serve the project:
   - Using Python:
     ```bash
     # Python 3
     python -m http.server 8000
     ```
   - Using Node.js:
     ```bash
     npx serve
     ```

3. Open your browser and navigate to:
   - `http://localhost:8000` (if using Python)
   - `http://localhost:3000` (if using Node.js)

## Development

The project structure is simple:
```
jtdapp/
├── data/
│   └── events.json    # Event data
├── icons/            # PWA icons
├── scripts/
│   └── main.js       # Main application logic
├── index.html        # Main HTML file
├── manifest.json     # PWA manifest
├── sw.js            # Service worker
└── CHANGELOG.md     # Project changelog
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 