document.addEventListener('DOMContentLoaded', () => {
  const socket = io('/')

  const positionOptions = {
    enableHighAccuracy: true,
    maximumAge: 0
  }

  setInterval(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude: lat, longitude: lng } = position.coords
      socket.emit('location:update', { lat, lng })
      console.log('sent')
    }, (err) => {
      console.log(err)
    }, positionOptions)
  }, 2000)
})