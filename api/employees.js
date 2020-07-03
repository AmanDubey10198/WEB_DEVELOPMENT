const express = require('express');
const employeesRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

module.exports = employeesRouter;

const timesheetRouter = require('./timesheets.js');
employeesRouter.use('/:employeeId/timesheets', timesheetRouter);


/* GET ALL THE EMPLOYEES */
employeesRouter.get('/', (req, res, next) => {
    db.all('SELECT * FROM Employee WHERE is_current_employee = 1', 
    (error, row) => {
        if(error){
            next(error);
        }else{
            res.status(200);
            res.json({ employees: row });
        }
    });
});

/* validation of requst body */
const validateReqBody = (req, res, next) => {
    const obj = req.body.employee;
    if(!obj.name || !obj.position || !obj.wage){
        return res.sendStatus(400);
    }
    if(!obj.is_current_employee){
        obj.is_current_employee = 1;
    }
    next();
}

/* post request handling */
employeesRouter.post('/', validateReqBody, (req, res, next) => {
    const obj = req.body.employee;

    db.run('INSERT INTO Employee(name, position, wage, is_current_employee) '+
    'VALUES ($name, $position, $wage, $is_curr_emp)',
    {
        $name: obj.name,
        $position: obj.position,
        $wage: obj.wage,
        $is_curr_emp: obj.is_current_employee
    },
    function(error){
        if(error){
            next(error);
        }else{
            db.get(`SELECT * FROM Employee WHERE id = ${this.lastID}`,
            (err, row) => {
                if(err){
                    next(err);
                }else{
                    res.status(201).json({ employee: row });
                }
            });
        }
    });
    
});

/* employee id param function */
employeesRouter.param('employeeId', (req, res, next, employeeId) => {
    db.get(`SELECT * FROM Employee WHERE id = ${employeeId}`,
    (error, row) => {
        if(error){
            next(error);
        }else if(row){
            req.employee = row;
            next();
        }else{
            return res.sendStatus(404);
        }
    });
});

employeesRouter.get('/:employeeId', (req, res, next) => {
    res.status(200).json({ employee: req.employee });
});

employeesRouter.put('/:employeeId', validateReqBody, (req, res, next) => {
    const obj = req.body.employee;
    db.run('UPDATE Employee SET name = $name, '+
        'position = $position, wage = $wage, '+
        'is_current_employee = $is_curr_emp '+
        'WHERE id = $ID',
        {
            $name: obj.name,
            $position: obj.position,
            $wage: obj.wage,
            $is_curr_emp: obj.is_current_employee,
            $ID: req.employee.id

        }, 
        function(error){
            if(error){
                next(error);
            }
            else{
                db.get(`SELECT * FROM Employee WHERE id = ${req.employee.id}`,
                (error, row) => {
                    if(error){
                        next(error);
                    }
                    else{
                        res.status(200).json({ employee: row });
                    }
                });
            }
        }
        );
});

employeesRouter.delete('/:employeeId', (req, res, next) => {
    db.run('UPDATE Employee SET is_current_employee = 0 '+
        'WHERE id = $ID',
        {
            $ID: req.employee.id
        },
        (error) => {
            if(error){
                next(error);
            }
            else{
                db.get(`SELECT * FROM Employee WHERE id = ${req.employee.id}`,
                (error, row) => {
                    if(error){
                        next(error);
                    }
                    else{
                        res.status(200).json({ employee: row });
                    }
                });
            }
        });
});