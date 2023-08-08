const express= require('express');
const router= express.Router();
const {createUser, loginUser, getAllUser, getUser, deleteUser, updateUser, blockUser, unblockUser, handleCookie, logOut, changePassword, forgetPasswordToken, resetPassword}= require('../controller/userCtrl');
const { authmiddleware, isAdmin } = require('../middleware/authmiddleware');

router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/forget-password-token', authmiddleware, forgetPasswordToken);
router.put('/reset-password/:token', resetPassword)
router.get('/alluser', getAllUser);
router.get('/refreshToken', handleCookie);
router.get('/logout', logOut);
router.get('/:id', authmiddleware, isAdmin, getUser);
router.put('/edit_user',authmiddleware, updateUser);
router.put('/block_user/:id',authmiddleware, isAdmin, blockUser);
router.put('/unblock_user/:id',authmiddleware, isAdmin, unblockUser);
router.put('/resetPassword', authmiddleware, changePassword)
router.delete('/:id', deleteUser);


module.exports= router; 