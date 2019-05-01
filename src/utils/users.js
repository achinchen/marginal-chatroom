const users = []

const addUser = ({id, name, room}) => {
  name = name.trim().toLowerCase()
  room = room.trim().toLowerCase()
  if(!name || !room) return ({error: 'name/room is required.'})
  const isExisting = users.find(user => user.name === name && user.room === room)
  if(isExisting) return ({ error: 'name is in use.' })
  const user = { id, name, room }
  console.log(user)

  users.push(user)
  return { user }
}

const getUser = id => {
  const index = users.findIndex(user => user.id === id)
  return index !== -1 ? users[index] : undefined
}

const removeUser = id => {
  const index = users.findIndex(user => user.id === id)
  if (index !== -1) return users.splice(index, 1)[0]
}

const getUsersInRoom = room => users.filter(user => user.room === room)


module.exports = {
  addUser,
  getUser,
  removeUser,
  getUsersInRoom
}