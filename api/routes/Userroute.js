import express from 'express'
import { verifyToken } from '../utils/verifyuser.js';
import { deleteUser, getUserListing, searchuser, test, updateUser } from '../controllers/Usercontroller.js';
const route=express.Router();

route.get('/test',test)
route.post('/update/:id',verifyToken,updateUser)
route.delete('/delete/:id',verifyToken,deleteUser)
route.get('/listings/:id',verifyToken,getUserListing)
route.get('/:id',verifyToken,searchuser)




export default route

