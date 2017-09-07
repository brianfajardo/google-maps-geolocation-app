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

  // Poll for user's current location every 2 seconds
  setInterval(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude: lat, longitude: lng } = pos.coords
      socket.emit('location:update', { lat, lng })
    }, (err) => {
      console.log(err)
    }, positionOptions)
  }, 2000)

  // Set markers
  socket.on('location:update', (locations) => {

    if (locations.length > 0) {
      markers.forEach((marker, id) => {
        marker.setMap(null)
        markers.delete(id)
      })
    }

    locations.forEach(([id, position]) => {
      if (position.lat && position.lng) {
        const marker = new google.maps.Marker({
          map,
          position,
          title: id,
        })
        markers.set(id, marker)
      }
    })
  })

  socket.on('client:disconnect', id => markers.delete(id))

  return initMap()
})()