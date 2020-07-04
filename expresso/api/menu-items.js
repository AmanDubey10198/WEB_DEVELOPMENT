const express = require('express');
const menuItemRouter = express.Router({mergeParams: true});

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

module.exports = menuItemRouter;

menuItemRouter.use('/', (req, res, next) => {
    db.all(`SELECT * FROM Menu WHERE id = ${req.params.menuId}`,
        (err, row) => {
            if(err){
                next(err);
            }else if(row){
                next();
            }else{
                return res.sendStatus(404);
            }
        });
});

menuItemRouter.get('/', (req, res, next) => {
   db.all(`SELECT * FROM MenuItem WHERE menu_id = ${req.params.menuId}`, (error, rows) => {
       if(error){
           next(error);
       }else{
           res.status(200).json({ menuItems: rows });
       }
   });
});

const validateReqBody = (req, res, next) => {
    const obj = req.body.menuItem;
    if(!obj.name || !obj.inventory || !obj.price){
        return res.sendStatus(400);
    }
    next();
};

menuItemRouter.post('/', validateReqBody, (req, res, next) => {
    const obj = req.body.menuItem;
    db.run('INSERT INTO MenuItem (name, description, inventory, price, menu_id) '+
        'VALUES ($name, $desc, $invent, $price, $menuId)',
        {
            $name: obj.name,
            $desc: obj.description || '',
            $invent: obj.inventory,
            $price: obj.price,
            $menuId: req.params.menuId
        },
        function(error){
            if(error){
                next(error);
            }else{
                db.get(`SELECT * FROM MenuItem WHERE id = ${this.lastID}`,
                    (err, row) => {
                        if(err){
                            next(err);
                        }else{
                            res.status(201).json({ menuItem: row });
                        }
                    });
            }
        });
});

menuItemRouter.param('menuItemId', (req, res, next, menuItemId) => {
   db.get(`SELECT * FROM MenuItem WHERE id = ${menuItemId}`,
        (error, row) => {
            if(error){
                next(error);
            }else if(row){
                next();
            }else{
                return res.sendStatus(404);
            }
        }); 
});

menuItemRouter.put('/:menuItemId',validateReqBody, (req, res, next) => {
    const obj = req.body.menuItem;
    db.run('UPDATE MenuItem SET name = $name, description = $desc, '+
        'inventory = $invent, price = $price, menu_id = $menuId '+
        'WHERE id = $ID',
        {
            $name: obj.name,
            $desc: obj.description || '',
            $invent: obj.inventory,
            $price: obj.price,
            $menuId: req.params.menuId,
            $ID: req.params.menuItemId
        },
        error => {
            if(error){
                next(error);
            }else{
                db.get(`SELECT * FROM MenuItem WHERE id = ${req.params.menuItemId}`,
                (err, row) => {
                    if(err){
                        next(err);
                    }else{
                        res.status(200).send({ menuItem:row });
                    }
                });
            }
        });
});

menuItemRouter.delete('/:menuItemId', (req, res, next) => {
    db.run('DELETE FROM MenuItem WHERE id = $ID',
        {
            $ID: req.params.menuItemId
        },
        (error) => {
            if(error){
                next(error);
            }else{
                res.sendStatus(204);
            }
        })
});
