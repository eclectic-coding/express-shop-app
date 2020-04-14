const path = require('path')
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')

const errorController = require('./controllers/error')
// const User = require('./models/user')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

// const adminRoutes = require('./routes/admin')
// const shopRoutes = require('./routes/shop')

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  User.findById('5e95caf0d06e714617516ad0')
    .then(user => {
      req.user = new User(user.name, user.email, user.cart, user._id)
      next()
    })
    .catch(err => console.log(err))
})

// app.use('/admin', adminRoutes)
// app.use(shopRoutes)

app.use(errorController.get404)

mongoose.connect(process.env.MONGODB_LOGIN)
  .then(result => {
    app.listen(3000)
  })
  .catch(err => {
    console.log(err)
  })


