const db = require('../config')



class ImagesController{

    async addImage(req,res){
        
        const { user_id, base64} = req.body
        const sql = (
            `insert into images (user_id, base64) values (?, ?);`
        )
        db.all(sql,[user_id, base64], (err,rows) => {
            if (err) return res.json(err)
            else return res.json(rows)     
        })
        
    }   

    async updateImage(req,res){
        const { user_id, base64} = req.body
        const sql = (
            `UPDATE images SET base64 = ? WHERE id = ? AND user_id = ?`
        )
        db.all(sql,[ base64, user_id ], (err,rows) => {
            if (err) return res.json(err)
            if(rows.length === 0) return res.json('Данные не совпадают! Проверьте и повторите попытку')
            else res.json(rows)
    })
    }

    async getCurrentImage(req,res){
        const { id, user_id} = req.body
        const sql = (
            `select * from images where id=? and user_id=?`
        )
        db.all(sql,[ id, user_id], (err,rows) => {
            if (err) return res.json(err)
            if(rows.length === 0) return res.json('Данные не совпадают! Проверьте и повторите попытку')
            else res.json(rows)
    })
    }

    async getAllImagesByUser(req,res){
        const { user_id } = req.body
        const sql = (
            `select * from images where user_id=?`
        )
        db.all(sql,[ user_id ], (err,rows) => {
            if (err) return res.json(err)
            if(rows.length === 0) return res.json('Данные не совпадают! Проверьте и повторите попытку')
            else res.json(rows)
    })
    }

    async deleteImage(req,res){
        const { id, user_id } = req.body
        const sql = (
            `DELETE FROM images WHERE id = ? AND user_id = ?`
        )
        db.all(sql,[id, user_id], (err,rows) => {
            if (err) return res.json(err)
            else res.json(rows)
    })
    }

}



module.exports = new ImagesController()