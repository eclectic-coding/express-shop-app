const path = require('path')
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')

// Controllers
const errorController = require('./controllers/error')
const User = require('./models/user')

const app = express()
const store = new MongoDBStore({
  uri: process.env.MONGODB_LOGIN,
  collection: 'sessions'
})
const csrfProtection = csrf()


// Set Templates and views
app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
  secret: process.env.MY_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store
}))
app.use(csrfProtection)
app.use(flash())


app.use((req, res, next) => {
  if (!req.session.user) {
    return next()
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user
      next()
    })
    .catch(err => console.log(err))
})

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn,
    res.locals.csrfToken = req.csrfToken()
  next()
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)
app.use(errorController.get404)

const port = process.env.PORT

mongoose.connect(process.env.MONGODB_LOGIN)
  .then(() => {
    app.listen(port)
  })
  .catch(err => {
    console.log(err)
  })


