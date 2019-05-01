const socket = io()

const formDOM = document.querySelector('.message-form')
const formMessageDOM = formDOM.querySelector('input')
const formButtonDOM = formDOM.querySelector('button')

const chatRoomDOM = document.querySelector('.chat-room')
const leaveButtonDOM = document.querySelector('.leave-button')
const locationButtonDOM = document.querySelector('.send-location')
const serverMessageDOM = document.querySelector('.server-message')

const {name, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const setServerMessage = message => {
  serverMessageDOM.innerText = message
  setTimeout(() => serverMessageDOM.innerText = '', 3000)
}

const autoScroll = () => {
  const containerHigh = chatRoomDOM.offsetHeight
  const contentHigh = chatRoomDOM.scrollHeight
  const scrollHigh = contentHigh + contentHigh
  const lastMessage = chatRoomDOM.lastChild.offsetHeight + chatRoomDOM.lastChild.clientHeight
  if ((containerHigh - lastMessage) <= scrollHigh) chatRoomDOM.scrollTop = chatRoomDOM.scrollHeight
}

formDOM.addEventListener('submit', event => {
  event.preventDefault()
  formButtonDOM.style.backgroundColor = '#de6560'

  socket.emit('send:message', formMessageDOM.value, serverMessage => {
    setServerMessage(serverMessage)
    formButtonDOM.style.backgroundColor = ''
  })

  formMessageDOM.value = ''
})

locationButtonDOM.addEventListener('click', () => {
  if (!navigator.geolocation) return serverMessageDOM.innerText = '你邊緣到不支援'
  locationButtonDOM.style.backgroundColor = '#de6560'
  navigator.geolocation.getCurrentPosition(({ coords }) => {
    const { latitude, longitude } = coords
    const message = `<a target="_blank" href="https://google.com/maps?q=${latitude},${longitude}">這裡</a>`
    socket.emit('send:location', message, serverMessage => {
      setServerMessage(serverMessage)
      locationButtonDOM.style.backgroundColor = ''
    })
  })
})

socket.on('message', context => {
  const { name, message, time } = context
  chatRoomDOM.innerHTML += `<p>${name} - ${message} <span class="time">${moment(time).format('hh:mm a')}</span></p>`
  autoScroll()
})

socket.on('information', ({ users, room }) => {
  console.log(users,room)
})

leaveButtonDOM.addEventListener('click', () => {
  socket.emit('disconnect')
})

socket.emit('join', { name, room }, error => {
  if(error) {
    alert(error)
    location.href= '/'
  }
})
