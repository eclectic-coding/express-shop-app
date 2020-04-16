exports.getLogin = (req, res) => {
  const isLoggedIn = req
    .get('Cookie')
    .split('=')[1]
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenicated: isLoggedIn
  })
}

exports.postLogin = (req, res) => {
  res.setHeader('Set-Cookie', 'logged=true; HttpOnly')
  res.redirect('/')
}
