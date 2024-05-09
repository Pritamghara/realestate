import express from 'express'
import { createListing, deleteListing, getListing, getlistings, updateListing } from '../controllers/Listingcontroller.js'
import { verifyToken } from '../utils/verifyuser.js'


const router =express.Router()


router.post('/create',verifyToken,createListing)
router.delete('/delete/:id',verifyToken,deleteListing)
router.post('/update/:id',verifyToken,updateListing)
router.get('/get/:id',getListing)
router.get('/get',getlistings)
export default router