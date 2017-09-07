'use strict';

(function () {

  let map
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
    })
  }, 2000)

  return initMap()
})()