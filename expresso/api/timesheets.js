const express = require('express');
const timesheetRouter = express.Router({mergeParams: true});

const sqlite3 = require('sqlite3');
const { template } = require('babel-core');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

module.exports = timesheetRouter;

// check if employee exists or not
timesheetRouter.use('/', (req, res, next) => {
    db.get('SELECT * FROM Employee WHERE id = $empId',
    {
        $empId: req.params.employeeId
    },
    (error, row) => {
        if(error){
            next(error);
        }else if (row){
            next();
        }else{
            return res.sendStatus(404);
        }
    });
});

timesheetRouter.get('/', (req, res, next) => {
    db.all(`SELECT * FROM Timesheet WHERE employee_id = ${req.params.employeeId}`,
        (error, rows) => {
            if(error){
                next(error);
            }else if(rows){
                res.status(200).json({ timesheets: rows });
            }else{
                res.sendStatus(404);
            }
        });
});

const validateReqbody = (req,res, next) => {
    const obj = req.body.timesheet;
    if(!obj.rate || !obj.hours || !obj.date){
        return res.sendStatus(400);
    }
    next();
}

timesheetRouter.post('/', validateReqbody, (req, res, next) => {
    const obj = req.body.timesheet;

    db.run('INSERT INTO Timesheet (hours, rate, date, employee_id) '+
        'VALUES ($hours, $rate, $date, $employee_id)',
        {
            $hours: obj.hours,
            $rate: obj.rate,
            $date: obj.date,
            $employee_id: req.params.employeeId
        },
        function(error){
            if(error){
                next(error);
            }
            else{
                db.get(`SELECT * FROM Timesheet WHERE id = ${this.lastID}`,
                (err, row) => {
                    if(err){
                        next(err);
                    }else{
                        res.status(201).json({ timesheet: row });
                    }
                });
            }
        });
});

// check if the timesheet exists or not
timesheetRouter.param('timesheetId', (req, res, next, timesheetId) => {
    db.get(`SELECT * FROM Timesheet WHERE id = ${timesheetId}`,
    (err, row) => {
        if(err){
            next(err);
        }
        else if (row){
            next();
        }
        else{
            return res.sendStatus(404);
        }
    })
});

timesheetRouter.put('/:timesheetId', validateReqbody, (req, res, next) => {
    const obj = req.body.timesheet;
    db.run('UPDATE Timesheet SET hours = $hours, rate = $rate, date = $date, '+
        ' employee_id = $emp_id WHERE id = $ID',
        {
            $hours: obj.hours,
            $rate: obj.rate,
            $date: obj.date,
            $emp_id: req.params.employeeId,
            $ID: req.params.timesheetId
        },
        (error) => {
            if(error){
                next(error);
            }else{
                db.get(`SELECT * FROM Timesheet WHERE id = ${req.params.timesheetId}`,
                (err, row) => {
                    if(err){
                        next(err);
                    }else {
                        res.status(200).json({ timesheet: row});
                    }
                });
            }
        });
});

timesheetRouter.delete('/:timesheetId', (req, res, next) => {
    db.run('DELETE FROM Timesheet WHERE id = $ID',
        {$ID: req.params.timesheetId},
        (error) => {
            if(error){
                next(error);
            }else{
                res.sendStatus(204);
            }
        });
});
