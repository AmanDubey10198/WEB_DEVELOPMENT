const express = require('express');
const menusRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const menuItemRouter = require('./menu-items.js');
menusRouter.use('/:menuId/menu-items', menuItemRouter);

module.exports = menusRouter;

menusRouter.get('/', (req, res, next) => {
    db.all('SELECT * FROM Menu', (error, rows) => {
        if(error){
            next(error);
        }else{
            res.status(200).json({ menus: rows});
        }
    });
});

const validateReqBody = (req, res, next) => {
    if(!req.body.menu.title){
        return res.sendStatus(400);
    }
    next();
}

menusRouter.post('/',validateReqBody, (req, res, next) => {
    db.run('INSERT INTO Menu (title) VALUES ($title)',
        {$title: req.body.menu.title},
        function(error){
           if(error){
               next(error);
           } else{
               db.get(`SELECT * FROM Menu WHERE id = ${this.lastID}`,
               (err, row) => {
                   if(err){
                       next(err);
                   }else{
                       res.status(201).json({ menu: row });
                   }
               });
           }
        });
});

//check menu ID existence
menusRouter.param('menuId', (req, res, next, menuId) => {
    db.get(`SELECT * FROM Menu WHERE id = ${menuId}`,
        (error, row) => {
            if(error){
                next(error);
            }else if(row){
                req.menu = row;
                next();
            }else{
                return res.sendStatus(404);
            }
        });
});

menusRouter.get('/:menuId', (req, res, next) => {
    res.status(200).json({ menu: req.menu });
});

menusRouter.put('/:menuId',validateReqBody, (req, res, next) => {
    db.run('UPDATE Menu SET title = $title WHERE id = $ID',
        {
            $title: req.body.menu.title,
            $ID: req.params.menuId
        },
        function(error) {
            if(error){
                next(error);
            }
            else{
                db.get(`SElECT * FROM Menu WHERE id = ${req.params.menuId}`,
                (err, row) =>{
                    if(err){
                        next(err);
                    }else{
                        res.status(200).json({ menu: row });
                    }
                })
            }
        })
});



menusRouter.delete('/:menuId', (req, res, next) => {

    db.get(`SELECT * FROM MenuItem WHERE menu_id = ${req.params.menuId}`,
    (error, row) => {
        if(error){
            next(error);
        }else if(row){
            res.sendStatus(400);
        }else{
            db.run(`DELETE FROM Menu WHERE id = ${req.params.menuId}`,
                (err) => {
                    if(err){
                        next(err);
                    }else{
                        res.sendStatus(204);
                    }
                });   
        }
    });
});