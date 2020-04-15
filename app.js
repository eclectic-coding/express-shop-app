const path = require('path')
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')

const errorController = require('./controllers/error')
const User = require('./models/user')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  User.findById('5e97131ad4abf71c5496c18a')
    .then(user => {
      req.user = user
      next()
    })
    .catch(err => console.log(err))
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

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
    app.listen(3000)
  })
  .catch(err => {
    console.log(err)
  })


