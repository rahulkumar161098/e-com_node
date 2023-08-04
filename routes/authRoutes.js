const express= require('express');
const router= express.Router();
const {createUser, loginUser, getAllUser, getUser, deleteUser, updateUser, blockUser, unblockUser, handleCookie, logOut}= require('../controller/userCtrl');
const { authmiddleware, isAdmin } = require('../middleware/authmiddleware');

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/alluser', getAllUser);
router.get('/refreshToken', handleCookie);
router.get('/logout', logOut);
router.get('/:id', authmiddleware, isAdmin, getUser);
router.delete('/:id', deleteUser);
router.put('/edit_user',authmiddleware, updateUser);
router.put('/block_user/:id',authmiddleware, isAdmin, blockUser);
router.put('/unblock_user/:id',authmiddleware, isAdmin, unblockUser);


module.exports= router; 