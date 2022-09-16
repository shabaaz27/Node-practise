const express = require('express')
const { getAllTours, createTour, getTour, updateTour, deleteTour,aliasTopTours,highPrice } = require('../controller/tourController')

const router = express.Router() //middleware



router.route('/top-5-cheap').get(aliasTopTours,getAllTours)
router.route('/top-5-luxury').get(highPrice,getAllTours)
router.route('/').get(getAllTours).post(createTour)
router.route('/:id').get(getTour).put(updateTour).delete(deleteTour)


module.exports = router