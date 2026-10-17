const express = require('express');
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { employeeRules, idParamRules, idQueryRules } = require('../validators/employeeValidator');

const router = express.Router();

router.use(authMiddleware);

router.get('/employees', employeeController.getEmployees);
router.post('/employees', employeeRules, validate, employeeController.createEmployee);
router.get('/employees/:eid', idParamRules, validate, employeeController.getEmployeeById);
router.put('/employees/:eid', idParamRules, employeeRules, validate, employeeController.updateEmployee);
router.delete('/employees', idQueryRules, validate, employeeController.deleteEmployee);

module.exports = router;