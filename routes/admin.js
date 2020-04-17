const express = require('express')

const adminController = require('../controllers/admin')

const isAuth = require('../middleware/is-auth')

const router = express.Router()

// /admin/add-product
router.get('/add-product', isAuth, adminController.getAddProduct)
router.post('/add-product', isAuth, adminController.postAddProduct)

// /admin/products
router.get('/products', isAuth, adminController.getProducts)

// /admin/edit-products
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct)
router.post('/edit-product', isAuth, adminController.postEditProduct)

// /admin/delete-products
router.post('/delete-product', isAuth, adminController.postDeleteProduct)

module.exports = router
