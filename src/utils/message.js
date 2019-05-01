const Filter = require('bad-words')
const filter = new Filter()

const WELCOME_MESSAGE = '歡迎加入邊緣聊天室'
const NOTIFY_NEW_USER_MESSAGE = name =>  `這邊又有一個邊緣人了，名叫 ${name} 。`
const LEAVE_MESSAGE = name => `有一個邊緣人離開了，名叫 ${name} 。` 
const LOCATION_MESSAGE = message => `偶住在 ${message} 哦!`
const BANNED_ALERT_MESSAGE = '🈲️ 不准講*話'
const SUCCESS_DELIVER_MESSAGE = '📫 邊緣聊天訊息已送出'
const SUCCESS_DELIVER_LOCATION_MESSAGE = '🌍 全宇宙都知道了'


// const generateUser = (number=10) => `邊緣星球${Math.ceil(Math.random() * number)}號居民`

const generateNotifyNewUserAndLeftUserServerMessage = (name, isLeft = false) => ({
  name: '邊緣宇宙分析師',
  message: isLeft ? LEAVE_MESSAGE(name) : NOTIFY_NEW_USER_MESSAGE(name),
  time: new Date().getTime()
})

const generateWelcomeServerMessage = () => ({
  name: '邊緣宇宙分析師',
  message: WELCOME_MESSAGE,
  time: new Date().getTime()
})


const generateUserMessage = (name, message, callback) => {
  const isProfane = filter.isProfane(message)
  callback(isProfane ? BANNED_ALERT_MESSAGE : SUCCESS_DELIVER_MESSAGE)
  return ({
    name: isProfane ? '邊緣宇宙觀察員' : `邊緣星球居民 ${name} `,
    message: isProfane ? `${name}講了${message}` : message,
    time: new Date().getTime()
  })
} 

const generateUserLocationMessage = (name, message, callback) => {
  callback(SUCCESS_DELIVER_LOCATION_MESSAGE)
  return ({
    name: `邊緣星球居民 ${name} `,
    message: LOCATION_MESSAGE(message),
    time: new Date().getTime()
  })
}


module.exports = {
  generateNotifyNewUserAndLeftUserServerMessage,
  generateWelcomeServerMessage,
  generateUserMessage,
  generateUserLocationMessage
}