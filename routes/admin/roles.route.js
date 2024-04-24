const express = require('express');

// create Router
const router = express.Router();

// controller
const controller = require('../../controllers/admin/roles.controller');

// use
router.get('/', controller.index);

router.get('/create', controller.createView);

router.post('/create', controller.createRole);

router.delete('/delete-soft/:id', controller.deleteSoft)

router.get('/edit/:id', controller.editView);

router.patch('/edit/:id', controller.editRole);

router.get('/permissions', controller.permissions);

router.patch('/permissions', controller.changePermissions);

// export
module.exports = router;