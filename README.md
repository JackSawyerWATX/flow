# Flowing Cursor Effect

A simple web design program that creates a colorful tracer behind the cursor as it moves across a colorful galaxy. Built with Three.js, this effect generates animated particles that follow your mouse movement and fade out over time.

## Controls

- **Change Colors button** - Cycles through four different color palettes
- **Toggle Style button** - Switches between sphere-shaped and cylinder-shaped particles

## Getting Started

1. Make sure all files are in the same folder:
   - index.html
   - styles.css
   - script.js

2. Open index.html in a web browser

For best results, use a local web server rather than opening the file directly. You can use:
- Python: `python -m http.server 8000`
- Node.js: `npx http-server`
- VS Code Live Server extension

## File Structure

- **index.html** - Main HTML page with canvas element and buttons
- **styles.css** - Styling for the page layout and controls
- **script.js** - Three.js code that creates and animates the particles

## Customization

### Change the Number of Particles

In script.js, modify this line:
```javascript
const MAX_PARTICLES = 200;
```

### Add Custom Colors

In script.js, add your own color palette to the colorPalettes array:
```javascript
const colorPalettes = [
  [0xff006e, 0xfb5607, 0xffbe0b, 0x8338ec, 0x3a86ff],
  [0xYOURCOLOR1, 0xYOURCOLOR2, 0xYOURCOLOR3]
];
```

Colors are in hexadecimal format (0x followed by 6 characters).

### Adjust Particle Speed

In script.js, find the velocity section in the createParticle function and adjust the multiplier:
```javascript
const velocity = new THREE.Vector3(
  (Math.random() - 0.5) * 0.1,  // Change 0.1 to adjust speed
  (Math.random() - 0.5) * 0.1,
  (Math.random() - 0.5) * 0.1
);
```

### Change Fade Speed

In the animate function, adjust this value:
```javascript
p.life -= 0.01;  // Lower number = slower fade
```

## Technical Details

- Built with Three.js r128
- Uses WebGL for rendering
- Particles are 3D mesh objects with emissive materials
- Automatically cleans up old particles to maintain performance

## Browser Requirements

Works in modern browsers that support WebGL:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

**Nothing appears on screen:**
- Check that Three.js is loading from the CDN
- Open browser console to check for errors
- Try running with a local web server

**Slow performance:**
- Reduce the MAX_PARTICLES value
- Close other browser tabs
- Try a different browser

## License

Free to use and modify.

### I love you all!! Happy cooding!!