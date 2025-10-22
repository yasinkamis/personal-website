# Space Portfolio - Personal Portfolio Template

A stunning, space-themed personal portfolio website built with React and Framer Motion. Features smooth page transitions, particle effects, and a modern dark purple aesthetic.

## Features

- **No-Scroll Design**: Full-screen sections with smooth transitions using mouse wheel, keyboard, or touch
- **Space Theme**: Beautiful particle effects, purple/black color scheme, and cosmic animations
- **Fully Responsive**: Works on desktop, tablet, and mobile devices
- **JSON-Driven**: All content managed through a single JSON file for easy customization
- **Smooth Animations**: Powered by Framer Motion for buttery-smooth transitions
- **4 Sections**:
  - Overview (Hero section with stats)
  - Work Experience (Interactive job timeline)
  - Testimonials (Carousel slider)
  - Contact (Social links and contact info)

## Technologies Used

- **React** - UI library
- **Vite** - Build tool
- **Framer Motion** - Animation library
- **@tsparticles/react** - Particle effects
- **React Icons** - Icon library

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd space-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Customization

### Update Your Information

Edit the `src/data/portfolio.json` file to customize all content:

```json
{
  "personal": {
    "name": "Your Name",
    "title": "Your Title",
    ...
  },
  "workExperience": [...],
  "testimonials": [...],
  "contact": {...}
}
```

### Modify Theme

Edit `src/theme.js` to customize colors, fonts, spacing, and animations:

```javascript
export const spaceTheme = {
  colors: {
    primary: '#9333EA',        // Change primary color
    background: '#0A0A0F',     // Change background
    ...
  },
  ...
}
```

## Navigation

- **Mouse Wheel**: Scroll up/down to navigate between sections
- **Keyboard**: Use Arrow keys or PageUp/PageDown
- **Touch**: Swipe up/down on mobile devices
- **Side Navigation**: Click on the dots on the right side

## Project Structure

```
space-portfolio/
├── src/
│   ├── components/
│   │   ├── StarField.jsx      # Particle background
│   │   └── Navigation.jsx      # Side navigation dots
│   ├── sections/
│   │   ├── Overview.jsx        # Hero section
│   │   ├── WorkExperience.jsx  # Work history
│   │   ├── Testimonials.jsx    # Testimonials slider
│   │   └── Contact.jsx         # Contact section
│   ├── data/
│   │   └── portfolio.json      # All content data
│   ├── theme.js                # Theme configuration
│   ├── index.css               # Global styles
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # Entry point
├── package.json
└── README.md
```

## Build for Production

```bash
npm run build
```

The optimized files will be in the `dist/` folder, ready to deploy.

## Deployment

You can deploy this to:

- **Vercel**: `npm install -g vercel && vercel`
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use `gh-pages` package
- **Any static hosting**: Upload the `dist` folder

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - Feel free to use this template for your own portfolio!

## Credits

Built with React, Framer Motion, and TSParticles
Designed with a cosmic theme in mind

---

Made with passion in the cosmos
