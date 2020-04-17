const path = require('path')
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

// Controllers
const errorController = require('./controllers/error')
const User = require('./models/user')

const app = express()
const store = new MongoDBStore({
  uri: process.env.MONGODB_LOGIN,
  collection: 'sessions'
})

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

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)
app.use(errorController.get404)

const port = process.env.PORT

mongoose.connect(process.env.MONGODB_LOGIN)
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: 'Chuck',
          email: 'chuck@test.com',
          cart: {
            items: []
          }
        })
        user.save()
      }
    })
    app.listen(port)
  })
  .catch(err => {
    console.log(err)
  })


