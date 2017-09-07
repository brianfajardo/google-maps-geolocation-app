'use strict';

(function () {

  let map
  let markers = new Map()
  const socket = io('/')
  const initialZoom = 9
  const positionOptions = { enableHighAccuracy: true, maximumAge: 0 }

  // Initialize Google map on user's current location.
  function initMap() {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude: lat, longitude: lng } = pos.coords
      map = new google.maps.Map(document.getElementById('map'), {
        center: { lat, lng },
        zoom: initialZoom
      })
    })
  }

  // Set markers
  socket.on('location:update', (locations) => {
    console.log(locations)
    locations.forEach(([id, position]) => {
      const marker = new google.maps.Marker({
        position,
        map,
        title: id
      })
      if (markers.has(id)) {
        const oldMarker = markers.get(id)
        oldMarker.setMap(null)
        markers.delete(id)
      }
      markers.set(id, marker)
    })
  })

  // Poll for user's current location every 2 seconds
  setInterval(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude: lat, longitude: lng } = pos.coords
      socket.emit('location:update', { lat, lng })
    }, (err) => {
      console.log(err)
    }, positionOptions)
  }, 2000)

  return initMap()
})()