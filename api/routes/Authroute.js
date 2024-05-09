import express from 'express'
import { authtoken, google, signOut, signin, signup } from '../controllers/Authcontroller.js';

const router=express.Router();


router.post('/signup',signup)
router.post('/signin',signin)
router.post('/google',google)
router.get('/signout',signOut)

router.get('/token',authtoken);
export default router;