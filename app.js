// Main Application JavaScript
document.addEventListener("DOMContentLoaded", () => {
    // App State
    const state = {
      currentView: "map",
      isDarkTheme: false,
      savedPlaces: JSON.parse(localStorage.getItem("savedPlaces")) || [],
      mapMarkers: [],
      selectedPlace: null,
    }
  
    // DOM Elements
    const navLinks = document.querySelectorAll(".main-nav a")
    const views = document.querySelectorAll(".view")
    const themeToggle = document.getElementById("theme-toggle")
    const searchInput = document.getElementById("search-input")
    const searchButton = document.getElementById("search-button")
    const filterButtons = document.querySelectorAll(".filter-btn")
    const mapContainer = document.getElementById("map-container")
    const placeDetails = document.getElementById("place-details")
    const closeDetailsBtn = document.getElementById("close-details")
    const savePlaceBtn = document.getElementById("save-place")
    const savedPlacesContainer = document.querySelector(".saved-places-container")
    const notification = document.getElementById("notification")
    const notificationMessage = document.getElementById("notification-message")
  
    // Initialize the application
    function init() {
      // Set up event listeners
      setupEventListeners()
  
      // Initialize the map
      initMap()
  
      // Load saved places
      renderSavedPlaces()
  
      // Check for saved theme preference
      if (localStorage.getItem("darkTheme") === "true") {
        toggleTheme()
      }
    }
  
    // Set up event listeners
    function setupEventListeners() {
      // Navigation
      navLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
          e.preventDefault()
          const viewName = this.getAttribute("data-view")
          changeView(viewName)
        })
      })
  
      // Theme toggle
      themeToggle.addEventListener("click", toggleTheme)
  
      // Search functionality
      searchButton.addEventListener("click", performSearch)
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          performSearch()
        }
      })
  
      // Filter buttons
      filterButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
          const category = this.getAttribute("data-category")
          filterPlaces(category)
  
          // Toggle active class
          filterButtons.forEach((b) => b.classList.remove("active"))
          this.classList.add("active")
        })
      })
  
      // Place details
      closeDetailsBtn.addEventListener("click", () => {
        placeDetails.classList.add("hidden")
      })
  
      savePlaceBtn.addEventListener("click", saveSelectedPlace)
    }
  
    // Change the current view
    function changeView(viewName) {
      // Update state
      state.currentView = viewName
  
      // Update navigation
      navLinks.forEach((link) => {
        if (link.getAttribute("data-view") === viewName) {
          link.classList.add("active")
        } else {
          link.classList.remove("active")
        }
      })
  
      // Update view display
      views.forEach((view) => {
        if (view.id === `${viewName}-view`) {
          view.classList.add("active")
        } else {
          view.classList.remove("active")
        }
      })
  
      // If changing to map view, reset the map
      if (viewName === "map") {
        resetMap()
      }
    }
  
    // Toggle between light and dark theme
    function toggleTheme() {
      state.isDarkTheme = !state.isDarkTheme
      document.body.classList.toggle("dark-theme", state.isDarkTheme)
      themeToggle.textContent = state.isDarkTheme ? "☀️" : "🌙"
      localStorage.setItem("darkTheme", state.isDarkTheme)
    }
  
    // Initialize the map
    function initMap() {
      // Create a canvas element for the map
      const canvas = document.createElement("canvas")
      canvas.width = mapContainer.clientWidth
      canvas.height = mapContainer.clientHeight
      canvas.style.width = "100%"
      canvas.style.height = "100%"
      canvas.style.display = "block"
  
      // Clear any existing content
      mapContainer.innerHTML = ""
      mapContainer.appendChild(canvas)
  
      const ctx = canvas.getContext("2d")
  
      // Draw a simple map (this would be replaced with a real map API in a production app)
      drawMap(ctx, canvas.width, canvas.height)
  
      // Add event listener for map clicks
      canvas.addEventListener("click", (e) => {
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
  
        // Check if a marker was clicked
        const clickedMarker = state.mapMarkers.find((marker) => {
          const dx = x - marker.x
          const dy = y - marker.y
          return Math.sqrt(dx * dx + dy * dy) < 15 // 15px radius for marker hit detection
        })
  
        if (clickedMarker) {
          showPlaceDetails(clickedMarker.place)
        } else {
          // Add a new marker at the clicked position (simulating finding a new place)
          addMapMarker(x, y, generateRandomPlace(x, y))
        }
      })
  
      // Add some initial markers
      addSampleMarkers(ctx, canvas.width, canvas.height)
  
      // Handle window resize
      window.addEventListener("resize", () => {
        if (state.currentView === "map") {
          // Redraw the map when window is resized
          canvas.width = mapContainer.clientWidth
          canvas.height = mapContainer.clientHeight
          drawMap(ctx, canvas.width, canvas.height)
          drawMarkers(ctx)
        }
      })
    }
  
    // Update the drawMap function to make the map more visible
    function drawMap(ctx, width, height) {
      // Clear the canvas
      ctx.clearRect(0, 0, width, height)
  
      // Draw background
      const bgColor = state.isDarkTheme ? "#1a1a1a" : "#e6e6e6"
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, width, height)
  
      // Draw grid lines
      ctx.strokeStyle = state.isDarkTheme ? "#333" : "#ccc"
      ctx.lineWidth = 1
  
      // Vertical lines
      for (let x = 0; x < width; x += 50) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
  
      // Horizontal lines
      for (let y = 0; y < height; y += 50) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, height)
        ctx.stroke()
      }
  
      // Draw main roads
      ctx.strokeStyle = state.isDarkTheme ? "#555" : "#999"
      ctx.lineWidth = 5
  
      // Horizontal main road
      ctx.beginPath()
      ctx.moveTo(0, height / 2)
      ctx.lineTo(width, height / 2)
      ctx.stroke()
  
      // Vertical main road
      ctx.beginPath()
      ctx.moveTo(width / 2, 0)
      ctx.lineTo(width / 2, height)
      ctx.stroke()
  
      // Draw water feature (like a river or lake)
      ctx.fillStyle = state.isDarkTheme ? "#1a3c5e" : "#a8d5ff"
      ctx.beginPath()
      ctx.arc(width * 0.7, height * 0.3, 80, 0, Math.PI * 2)
      ctx.fill()
  
      // Draw a park
      ctx.fillStyle = state.isDarkTheme ? "#1e4d2b" : "#90ee90"
      ctx.beginPath()
      ctx.rect(width * 0.1, height * 0.6, 150, 100)
      ctx.fill()
  
      // Add city blocks
      drawCityBlocks(ctx, width, height)
  
      // Add compass
      drawCompass(ctx, 60, 60, 40)
  
      // Add scale
      drawScale(ctx, width - 150, height - 30)
    }
  
    // Add new function to draw city blocks
    function drawCityBlocks(ctx, width, height) {
      const blockSize = 100
      const padding = 10
      const blockColor = state.isDarkTheme ? "#2c2c2c" : "#d9d9d9"
      const buildingColor = state.isDarkTheme ? "#3c3c3c" : "#bfbfbf"
  
      // Draw blocks in a grid pattern
      for (let x = 50; x < width - 50; x += blockSize + padding) {
        for (let y = 50; y < height - 50; y += blockSize + padding) {
          // Skip blocks where roads or water features are
          if (
            (x < width / 2 + 30 && x > width / 2 - 30) ||
            (y < height / 2 + 30 && y > height / 2 - 30) ||
            Math.sqrt(Math.pow(x - width * 0.7, 2) + Math.pow(y - height * 0.3, 2)) < 80 ||
            (x > width * 0.1 - 10 && x < width * 0.1 + 160 && y > height * 0.6 - 10 && y < height * 0.6 + 110)
          ) {
            continue
          }
  
          // Draw block
          ctx.fillStyle = blockColor
          ctx.fillRect(x, y, blockSize, blockSize)
  
          // Draw buildings inside block
          ctx.fillStyle = buildingColor
          const buildingCount = Math.floor(Math.random() * 3) + 2
          for (let i = 0; i < buildingCount; i++) {
            const bx = x + Math.random() * (blockSize - 30)
            const by = y + Math.random() * (blockSize - 30)
            const bw = Math.random() * 20 + 10
            const bh = Math.random() * 20 + 10
            ctx.fillRect(bx, by, bw, bh)
          }
        }
      }
    }
  
    // Add new function to draw a compass
    function drawCompass(ctx, x, y, radius) {
      // Draw outer circle
      ctx.fillStyle = state.isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
  
      // Draw inner circle
      ctx.fillStyle = state.isDarkTheme ? "#333" : "#fff"
      ctx.beginPath()
      ctx.arc(x, y, radius - 5, 0, Math.PI * 2)
      ctx.fill()
  
      // Draw N, S, E, W
      ctx.fillStyle = state.isDarkTheme ? "#fff" : "#000"
      ctx.font = "bold 14px Roboto"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
  
      ctx.fillText("N", x, y - radius + 15)
      ctx.fillText("S", x, y + radius - 15)
      ctx.fillText("E", x + radius - 15, y)
      ctx.fillText("W", x - radius + 15, y)
  
      // Draw compass needle
      ctx.strokeStyle = "#e74c3c"
      ctx.lineWidth = 2
  
      // North pointer
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, y - radius + 10)
      ctx.stroke()
  
      // South pointer
      ctx.strokeStyle = "#3498db"
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, y + radius - 10)
      ctx.stroke()
    }
  
    // Add new function to draw a scale
    function drawScale(ctx, x, y) {
      const scaleWidth = 100
  
      ctx.fillStyle = state.isDarkTheme ? "#fff" : "#000"
      ctx.font = "12px Roboto"
      ctx.textAlign = "center"
  
      // Draw scale line
      ctx.strokeStyle = state.isDarkTheme ? "#fff" : "#000"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + scaleWidth, y)
      ctx.stroke()
  
      // Draw ticks
      for (let i = 0; i <= 4; i++) {
        const tickX = x + (scaleWidth / 4) * i
        ctx.beginPath()
        ctx.moveTo(tickX, y)
        ctx.lineTo(tickX, y - 5)
        ctx.stroke()
      }
  
      // Draw labels
      ctx.fillText("0", x, y - 10)
      ctx.fillText("500m", x + scaleWidth, y - 10)
    }
  
    // Update the drawMarkers function to make markers more visible
    function drawMarkers(ctx) {
      // We don't need to clear and redraw the map here, as it causes flickering
      // Just draw the markers on top of the existing map
  
      // Draw each marker
      state.mapMarkers.forEach((marker) => {
        // Marker shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
        ctx.beginPath()
        ctx.arc(marker.x, marker.y + 2, 12, 0, Math.PI * 2)
        ctx.fill()
  
        // Marker circle
        ctx.fillStyle = getCategoryColor(marker.place.category)
        ctx.beginPath()
        ctx.arc(marker.x, marker.y, 12, 0, Math.PI * 2)
        ctx.fill()
  
        // Marker border
        ctx.strokeStyle = state.isDarkTheme ? "#fff" : "#000"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(marker.x, marker.y, 12, 0, Math.PI * 2)
        ctx.stroke()
  
        // Marker icon (simplified)
        ctx.fillStyle = "#fff"
        ctx.beginPath()
        ctx.arc(marker.x, marker.y, 5, 0, Math.PI * 2)
        ctx.fill()
  
        // Marker label with background for better readability
        const labelText = marker.place.name
        ctx.font = "bold 12px Roboto"
        const textWidth = ctx.measureText(labelText).width
  
        // Label background
        ctx.fillStyle = state.isDarkTheme ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.7)"
        ctx.fillRect(marker.x - textWidth / 2 - 5, marker.y + 15, textWidth + 10, 20)
  
        // Label text
        ctx.fillStyle = state.isDarkTheme ? "#fff" : "#000"
        ctx.textAlign = "center"
        ctx.fillText(labelText, marker.x, marker.y + 30)
      })
    }
  
    // Get color based on place category
    function getCategoryColor(category) {
      switch (category) {
        case "restaurant":
          return "#e74c3c"
        case "hotel":
          return "#3498db"
        case "attraction":
          return "#2ecc71"
        default:
          return "#f39c12"
      }
    }
  
    // Add a map marker
    function addMapMarker(x, y, place) {
      const canvas = mapContainer.querySelector("canvas")
      const ctx = canvas.getContext("2d")
  
      const marker = {
        x,
        y,
        place,
      }
  
      state.mapMarkers.push(marker)
      drawMarkers(ctx)
    }
  
    // Add sample markers to the map
    function addSampleMarkers(ctx, width, height) {
      const samplePlaces = [
        {
          name: "Central Park",
          address: "123 Park Avenue",
          rating: 4.8,
          category: "attraction",
          description: "A beautiful park in the center of the city with walking trails and picnic areas.",
        },
        {
          name: "Grand Hotel",
          address: "456 Main Street",
          rating: 4.5,
          category: "hotel",
          description: "A luxurious 5-star hotel with excellent amenities and stunning views.",
        },
        {
          name: "Gourmet Restaurant",
          address: "789 Food Lane",
          rating: 4.7,
          category: "restaurant",
          description: "An upscale dining experience with a diverse menu and excellent service.",
        },
        {
          name: "City Museum",
          address: "101 History Road",
          rating: 4.6,
          category: "attraction",
          description: "Explore the rich history of the city through interactive exhibits and artifacts.",
        },
      ]
  
      // Add markers at different positions
      addMapMarker(width * 0.2, height * 0.3, samplePlaces[0])
      addMapMarker(width * 0.8, height * 0.2, samplePlaces[1])
      addMapMarker(width * 0.3, height * 0.7, samplePlaces[2])
      addMapMarker(width * 0.7, height * 0.6, samplePlaces[3])
    }
  
    // Generate a random place (for demo purposes)
    function generateRandomPlace(x, y) {
      const categories = ["restaurant", "hotel", "attraction"]
      const category = categories[Math.floor(Math.random() * categories.length)]
  
      const names = {
        restaurant: ["Tasty Bites", "Spice Garden", "Ocean Delight", "Urban Kitchen"],
        hotel: ["Comfort Inn", "Luxury Suites", "City View Hotel", "Riverside Lodge"],
        attraction: ["Adventure Park", "Art Gallery", "Historic Tower", "Botanical Garden"],
      }
  
      const name = names[category][Math.floor(Math.random() * names[category].length)]
  
      return {
        name,
        address: `${Math.floor(Math.random() * 999) + 1} ${["Main St", "Park Ave", "River Rd", "Market St"][Math.floor(Math.random() * 4)]}`,
        rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
        category,
        description: `A ${category === "restaurant" ? "delightful" : category === "hotel" ? "comfortable" : "fascinating"} ${category} located in the heart of the city.`,
      }
    }
  
    // Show place details
    function showPlaceDetails(place) {
      // Update state
      state.selectedPlace = place
  
      // Update UI
      document.getElementById("place-name").textContent = place.name
      document.getElementById("place-address").textContent = place.address
      document.getElementById("place-rating").textContent = "⭐".repeat(Math.round(place.rating))
      document.getElementById("place-description").textContent = place.description
  
      // Show the details panel
      placeDetails.classList.remove("hidden")
    }
  
    // Save the currently selected place
    function saveSelectedPlace() {
      if (!state.selectedPlace) return
  
      // Check if place is already saved
      const isAlreadySaved = state.savedPlaces.some(
        (place) => place.name === state.selectedPlace.name && place.address === state.selectedPlace.address,
      )
  
      if (isAlreadySaved) {
        showNotification("This place is already saved!")
        return
      }
  
      // Add to saved places
      state.savedPlaces.push(state.selectedPlace)
  
      // Save to localStorage
      localStorage.setItem("savedPlaces", JSON.stringify(state.savedPlaces))
  
      // Update UI
      renderSavedPlaces()
  
      // Show notification
      showNotification("Place saved successfully!")
  
      // Hide details panel
      placeDetails.classList.add("hidden")
    }
  
    // Render saved places
    function renderSavedPlaces() {
      // Clear container
      savedPlacesContainer.innerHTML = ""
  
      if (state.savedPlaces.length === 0) {
        savedPlacesContainer.innerHTML = '<p class="empty-state">You haven\'t saved any places yet.</p>'
        return
      }
  
      // Add each saved place
      state.savedPlaces.forEach((place, index) => {
        const placeCard = document.createElement("div")
        placeCard.className = "place-card"
        placeCard.innerHTML = `
                  <h3>${place.name}</h3>
                  <p class="address">${place.address}</p>
                  <div class="rating">${"⭐".repeat(Math.round(place.rating))}</div>
                  <p>${place.description.substring(0, 100)}${place.description.length > 100 ? "..." : ""}</p>
                  <div class="actions">
                      <button class="view-btn" data-index="${index}">View on Map</button>
                      <button class="remove-btn" data-index="${index}">Remove</button>
                  </div>
              `
  
        savedPlacesContainer.appendChild(placeCard)
      })
  
      // Add event listeners to buttons
      document.querySelectorAll(".view-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const index = Number.parseInt(this.getAttribute("data-index"))
          viewSavedPlace(index)
        })
      })
  
      document.querySelectorAll(".remove-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const index = Number.parseInt(this.getAttribute("data-index"))
          removeSavedPlace(index)
        })
      })
    }
  
    // View a saved place on the map
    function viewSavedPlace(index) {
      const place = state.savedPlaces[index]
  
      // Switch to map view
      changeView("map")
  
      // Find a suitable position for the marker (this is simplified)
      const canvas = mapContainer.querySelector("canvas")
      const x = Math.random() * (canvas.width - 100) + 50
      const y = Math.random() * (canvas.height - 100) + 50
  
      // Add marker and show details
      addMapMarker(x, y, place)
      showPlaceDetails(place)
  
      // Show notification
      showNotification("Showing saved place on map")
    }
  
    // Remove a saved place
    function removeSavedPlace(index) {
      // Remove from array
      state.savedPlaces.splice(index, 1)
  
      // Save to localStorage
      localStorage.setItem("savedPlaces", JSON.stringify(state.savedPlaces))
  
      // Update UI
      renderSavedPlaces()
  
      // Show notification
      showNotification("Place removed successfully!")
    }
  
    // Perform search
    function performSearch() {
      const searchTerm = searchInput.value.trim().toLowerCase()
  
      if (!searchTerm) {
        showNotification("Please enter a search term")
        return
      }
  
      // Clear existing markers
      state.mapMarkers = []
  
      // Get canvas dimensions
      const canvas = mapContainer.querySelector("canvas")
      const width = canvas.width
      const height = canvas.height
  
      // Generate some random search results
      const numResults = Math.floor(Math.random() * 3) + 2 // 2-4 results
  
      for (let i = 0; i < numResults; i++) {
        const x = Math.random() * (width - 100) + 50
        const y = Math.random() * (height - 100) + 50
  
        // Create a place that matches the search term
        const place = generateRandomPlace(x, y)
        place.name = `${searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)} ${place.name}`
  
        addMapMarker(x, y, place)
      }
  
      // Show notification
      showNotification(`Found ${numResults} results for "${searchTerm}"`)
    }
  
    // Filter places by category
    function filterPlaces(category) {
      // Clear existing markers
      state.mapMarkers = []
  
      // Get canvas dimensions
      const canvas = mapContainer.querySelector("canvas")
      const width = canvas.width
      const height = canvas.height
  
      // Generate some random filtered results
      const numResults = Math.floor(Math.random() * 4) + 3 // 3-6 results
  
      for (let i = 0; i < numResults; i++) {
        const x = Math.random() * (width - 100) + 50
        const y = Math.random() * (height - 100) + 50
  
        // Create a place with the specified category
        const place = generateRandomPlace(x, y)
        place.category = category
  
        addMapMarker(x, y, place)
      }
  
      // Show notification
      showNotification(`Showing ${numResults} ${category}s`)
    }
  
    // Reset the map
    function resetMap() {
      const canvas = mapContainer.querySelector("canvas")
      if (!canvas) return
  
      const ctx = canvas.getContext("2d")
  
      // Clear markers
      state.mapMarkers = []
  
      // Redraw map
      drawMap(ctx, canvas.width, canvas.height)
  
      // Add sample markers
      addSampleMarkers(ctx, canvas.width, canvas.height)
  
      // Hide place details
      placeDetails.classList.add("hidden")
    }
  
    // Show notification
    function showNotification(message) {
      notificationMessage.textContent = message
      notification.classList.add("show")
  
      // Hide after 3 seconds
      setTimeout(() => {
        notification.classList.remove("show")
      }, 3000)
    }
  
    // Initialize the app
    init()
  })
  
  
