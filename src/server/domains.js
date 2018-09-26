let baseUrl = ''
if (process.env.NODE_ENV === 'development') {
  baseUrl = 'http://sm.ddznzj.com/'
} else {
  baseUrl = 'http://sm.ddznzj.com/'
}
export default {
  'pro1': baseUrl
}
