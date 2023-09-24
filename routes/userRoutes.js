const express = require("express");
const { fetchUserById, updateUser } = require("../controller/userController");
const router=express.Router();

router.route('/own').get(fetchUserById);
router.route('/:id').patch(updateUser);
module.exports=router;