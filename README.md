# MapExplorer


## Project Overview

MapExplorer is a single page web application (SPA) built with vanilla JavaScript, HTML, and CSS that allows users to discover and save points of interest on an interactive map. This project was developed as part of the COMP1004 Computing Practice module.

### Live Demo

[[View Live Demo](https://assigment-lovat-eta.vercel.app/)](#) (Add your deployed application link when available)

## Features

- **Interactive Map Interface**: Explore a custom-rendered map with various points of interest
- **Search Functionality**: Search for places by name
- **Category Filtering**: Filter places by category (restaurants, hotels, attractions)
- **Place Details**: View detailed information about places including ratings and descriptions
- **Save Favorites**: Save places to a personal collection for future reference
- **Responsive Design**: Works seamlessly on both desktop and mobile devices
- **Theme Toggle**: Switch between light and dark themes for comfortable viewing in any environment
- **Local Storage**: User preferences and saved places persist between sessions

## Technologies Used

- **HTML5**: For structure and semantic markup
- **CSS3**: For styling, animations, and responsive design
- **Vanilla JavaScript**: For all functionality and interactivity
- **Canvas API**: For rendering the interactive map
- **Local Storage API**: For persisting user data

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone [https://github.com/yourusername/map-explorer.git](https://github.com/Eyadayyman/comp1004.git)
  

```
2. No build process or dependencies required! Simply open `index.html` in your browser:


3. Alternatively, you can use a local development server:

```shellscript
# Using Python
python -m http.server

# Using Node.js and npx
npx serve
```




## Usage Instructions

### Map Navigation

- **Pan**: Click and drag on the map to move around
- **Interact with Places**: Click on any marker to view details about that place


### Searching and Filtering

- Use the search bar at the top to find specific places
- Click on category buttons to filter places (Restaurants, Hotels, Attractions)


### Saving Places

1. Click on a place marker to view its details
2. Click the "Save to My Places" button to add it to your collection
3. Access your saved places by clicking the "Saved Places" tab in the navigation


### Theme Toggle

- Click the moon/sun icon in the top right to switch between dark and light themes


## Project Structure

```plaintext
map-explorer/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling
├── app.js              # JavaScript functionality
└── README.md           # Project documentation
```

### Code Organization

The JavaScript code is organized into logical sections:

- **State Management**: Handles application data and state
- **UI Controllers**: Manages user interface interactions
- **Map Rendering**: Handles canvas-based map drawing and interactions
- **Place Management**: Manages place data, searching, and filtering
- **Storage**: Handles saving and loading data from localStorage


## Software Development Lifecycle

This project was developed following the software development lifecycle:

1. **Requirements Analysis**: Identifying user needs for a location-based application
2. **Design**: Creating wireframes and planning the application architecture
3. **Implementation**: Building the application using agile methodology with sprints
4. **Testing**: Ensuring functionality works across different devices and scenarios
5. **Deployment**: Preparing the application for presentation


## Future Improvements

- Integration with real map APIs (Google Maps, Mapbox, etc.)
- User authentication for personalized experiences
- Ability to add custom places and notes
- Sharing functionality for saved places
- Directions and routing between places
- Offline support using Service Workers


## Credits

- Developed by Eyadayyman
- Created for COMP1004 Computing Practice module
- Icons and design inspiration from various sources


## License

This project is licensed under the MIT License - see the LICENSE file for details.
