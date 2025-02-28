const db = require('../config')



class UsersController{

    async createUser(req,res){
        
        const { name, login, pass } = req.body
        const sql = (
            `insert into users (name, login, pass) values (?, ?, ?);`
        )
        db.all(sql,[name, login, pass], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)     
        })
        
    }   

    async getUser(req,res){
        const { login, pass} = req.body
        console.log(email, pass)
        const sql = (
            `select * from users where (login=? AND pass=?);`
        )
        db.all(sql,[login, pass], (err,rows) => {
            if (err) return res.json(err)
            if(rows.length === 0) return res.json('Данные не совпадают! Проверьте и повторите попытку')
            else res.json(rows)
    })
    }

    async getUserName(req,res){
        const { id } = req.body
       
        const sql = (
            `select * from users where id=?;`
        )
        db.all(sql,[id], (err,rows) => {
            if (err) return res.json(err)
            else res.json(rows)
    })
    }



    async deleteUser(req,res){
        const { id } = req.body
        const sql = (
            `delete from users where id =?;`
        )
        db.all(sql,[id], (err,rows) => {
            if (err) return res.json(err)
            else res.json(rows)
         })
    }    

}



module.exports = new UsersController()