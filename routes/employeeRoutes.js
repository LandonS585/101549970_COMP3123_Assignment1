const express = require('express');
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/employees', employeeController.getEmployees);
router.post('/employees', employeeController.createEmployee);
router.get('/employees/:eid', employeeController.getEmployeeById);
router.put('/employees/:eid', employeeController.updateEmployee);
router.delete('/employees', employeeController.deleteEmployee);

module.exports = router;