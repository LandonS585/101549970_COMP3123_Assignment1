const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const logger = require('../utils/logger');

function handleError(error, res, action) {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    logger.warn('Validation failed during ' + action + ': ' + error.message);
    return res.status(400).json({ message: 'Invalid employee data' });
  }
  logger.error('Error during ' + action + ': ' + error.message);
  return res.status(500).json({ message: 'Server error' });
}

async function getEmployees(req, res) {
  try {
    const employees = await Employee.find({ user: req.user._id });

    logger.info('User ' + req.user.username + ' fetched their employees');
    return res.status(200).json(employees);
  } catch (error) {
    return handleError(error, res, 'get employees');
  }
}

async function createEmployee(req, res) {
  try {
    const employee = await Employee.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      position: req.body.position,
      salary: req.body.salary,
      date_of_joining: req.body.date_of_joining,
      department: req.body.department,
      user: req.user._id
    });

    logger.info('User ' + req.user.username + ' created employee ' + employee._id);
    return res.status(201).json(employee);
  } catch (error) {
    return handleError(error, res, 'create employee');
  }
}

async function getEmployeeById(req, res) {
  try {
    const eid = req.params.eid;

    if (!mongoose.Types.ObjectId.isValid(eid)) {
      logger.warn('Invalid employee id: ' + eid);
      return res.status(400).json({ message: 'Invalid employee id' });
    }

    const employee = await Employee.findById(eid);

    if (!employee) {
      logger.warn('Employee not found: ' + eid);
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (employee.user.toString() !== req.user._id.toString()) {
      logger.warn('Authorization failed: ' + req.user.username + ' tried to access employee ' + eid);
      return res.status(403).json({ message: 'You do not have access to this employee' });
    }

    logger.info('User ' + req.user.username + ' fetched employee ' + eid);
    return res.status(200).json(employee);
  } catch (error) {
    return handleError(error, res, 'get employee');
  }
}

async function updateEmployee(req, res) {
  try {
    const eid = req.params.eid;

    if (!mongoose.Types.ObjectId.isValid(eid)) {
      logger.warn('Invalid employee id: ' + eid);
      return res.status(400).json({ message: 'Invalid employee id' });
    }

    const employee = await Employee.findById(eid);

    if (!employee) {
      logger.warn('Employee not found: ' + eid);
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (employee.user.toString() !== req.user._id.toString()) {
      logger.warn('Authorization failed: ' + req.user.username + ' tried to update employee ' + eid);
      return res.status(403).json({ message: 'You do not have access to this employee' });
    }

    const updatedEmployee = await Employee.findOneAndUpdate(
      { _id: eid, user: req.user._id },
      {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        position: req.body.position,
        salary: req.body.salary,
        date_of_joining: req.body.date_of_joining,
        department: req.body.department
      },
      { new: true, runValidators: true }
    );

    logger.info('User ' + req.user.username + ' updated employee ' + eid);
    return res.status(200).json(updatedEmployee);
  } catch (error) {
    return handleError(error, res, 'update employee');
  }
}

async function deleteEmployee(req, res) {
  try {
    const eid = req.query.eid;

    if (!eid) {
      logger.warn('Delete failed: eid missing');
      return res.status(400).json({ message: 'Employee id (eid) is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(eid)) {
      logger.warn('Invalid employee id: ' + eid);
      return res.status(400).json({ message: 'Invalid employee id' });
    }

    const employee = await Employee.findById(eid);

    if (!employee) {
      logger.warn('Employee not found: ' + eid);
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (employee.user.toString() !== req.user._id.toString()) {
      logger.warn('Authorization failed: ' + req.user.username + ' tried to delete employee ' + eid);
      return res.status(403).json({ message: 'You do not have access to this employee' });
    }

    await Employee.findOneAndDelete({ _id: eid, user: req.user._id });

    logger.info('User ' + req.user.username + ' deleted employee ' + eid);
    return res.status(204).send();
  } catch (error) {
    return handleError(error, res, 'delete employee');
  }
}

module.exports = {
  getEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
};