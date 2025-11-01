# Vizstar Builders - Component Structure

## Overview
This project now uses a component-based architecture where common elements (header, footer, slide menu) are stored in separate files and dynamically loaded into each page.

## Component Files Location
```
components/
├── header.html      - Website header with navigation
├── footer.html      - Website footer with links and branding
└── slide-menu.html  - Mobile/desktop slide-out navigation menu
```

## How It Works

### 1. Component Loading
- Components are loaded via JavaScript when the DOM is ready
- Uses `fetch()` API to load HTML content from component files
- Injects content into placeholder `<div>` elements

### 2. Page Structure
Each page now uses placeholder divs:
```html
<body>
    <!-- Header Component Placeholder -->
    <div id="header-placeholder"></div>
    
    <main>
        <!-- Page-specific content here -->
    </main>
    
    <!-- Slide Menu Component Placeholder -->
    <div id="slide-menu-placeholder"></div>
    
    <!-- Footer Component Placeholder -->
    <div id="footer-placeholder"></div>
    
    <script src="assets/main.js"></script>
</body>
```

### 3. JavaScript Implementation
- **loadComponent()** - Loads individual components
- **loadAllComponents()** - Loads all components in parallel
- **initializeComponentDependentFeatures()** - Sets up event listeners after components load
- **initializeSlideMenu()** - Initializes menu functionality
- **initializeHeader()** - Initializes header functionality

## Benefits

### ✅ Maintainability
- Update header/footer once, changes reflect across all pages
- No need to copy-paste common elements
- Centralized component management

### ✅ Consistency  
- Ensures identical header/footer on all pages
- Prevents manual copy-paste errors
- Single source of truth for common elements

### ✅ Scalability
- Easy to add new pages without recreating components
- Quick to modify navigation or branding
- Streamlined development workflow

### ✅ Performance
- Components load asynchronously
- Parallel loading of all components
- Error handling for failed component loads

## File Changes Made

### Created Files:
- `components/header.html` - Extracted from index.html
- `components/footer.html` - Extracted from index.html  
- `components/slide-menu.html` - Extracted from index.html

### Modified Files:
- `assets/main.js` - Added component loading functionality
- `index.html` - Replaced header/footer/menu with placeholders
- `about.html` - Added component placeholders and main.js
- `contact.html` - Added component placeholders and main.js

## Usage for New Pages

To create a new page:

1. **Create your HTML file** with this structure:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title | Vizstar Builders</title>
    <link rel="stylesheet" href="assets/style.css">
    <!-- Add other head elements -->
</head>
<body>
    <!-- Header Component Placeholder -->
    <div id="header-placeholder"></div>
    
    <main>
        <!-- Your page content here -->
    </main>
    
    <!-- Slide Menu Component Placeholder -->
    <div id="slide-menu-placeholder"></div>
    
    <!-- Footer Component Placeholder -->
    <div id="footer-placeholder"></div>

    <script src="assets/main.js"></script>
</body>
</html>
```

2. **No additional setup needed** - Components will load automatically!

## Troubleshooting

### Components Not Loading?
- Check browser console for errors
- Ensure files are served from a web server (not file:// protocol)
- Verify component file paths are correct
- Check that placeholder div IDs match exactly

### Functionality Not Working?
- Components load asynchronously, so ensure dependent JavaScript runs after loading
- Event listeners are re-initialized after component loading
- Check that IDs in components match those expected by JavaScript

## Future Enhancements

Consider adding:
- Component caching for better performance
- Loading indicators while components load
- Fallback content if components fail to load
- Component versioning for cache busting
