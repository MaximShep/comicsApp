const db = require('../config')


class ComicsController {

    async createComics(req, res) {

        const { name, user_id, img1_id, img2_id, img3_id, img4_id, img5_id, img6_id, img7_id, img8_id, img9_id, img10_id } = req.body
        const sql = (
            
            `insert into comics ( name, user_id, img1_id, img2_id, img3_id, img4_id, img5_id, img6_id, img7_id, img8_id, img9_id, img10_id) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );`
        )
        db.all(sql, [name, user_id, img1_id, img2_id, img3_id, img4_id, img5_id, img6_id, img7_id, img8_id, img9_id, img10_id], (err, rows) => {
                if (err) return res.json(err)
                else return res.json(rows)
            })

    }

    async getAllComics(req, res) {
        const sql = `SELECT * from comics;`;
    
        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: "Ошибка при получении комиксов", details: err.message });
            }
    
            // Просто возвращаем все строки как есть
            return res.json(rows);
        });
    }

    async getCurrentComics(req, res) {
        const { id, user_id } = req.body
        const sql = (
            `select * from comics where id=? and user_id=?`
        )
        db.all(sql, [id, user_id], (err, rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
        })
    }

    async getAllComicsByUSer(req, res) {
        const { user_id } = req.body
        const sql = (
            `select * from comics where user_id=?`
        )
        db.all(sql, [ user_id], (err, rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
        })
    }

    async updateComics(req, res) {
        const { id, name, user_id, img1_id, img2_id, img3_id, img4_id, img5_id, img6_id, img7_id, img8_id, img9_id, img10_id  } = req.body
        const sql = (
            `UPDATE images
                        SET name = ?, 
                        SET img1_id = ?,
                        SET img2_id = ?, 
                        SET img3_id = ?, 
                        SET img4_id = ?,
                        SET img5_id = ?,
                        SET img6_id = ?,
                        SET img7_id = ?,
                        SET img8_id = ?,
                        SET img9_id = ?,
                        SET img10_id = ?
                        WHERE id = ? AND user_id = ?`
        )
        db.all(sql, [name, img1_id, img2_id, img3_id, img4_id, img5_id, img6_id, img7_id, img8_id, img9_id, img10_id, id, user_id  ], (err, rows) => {
            if (err) return res.json(err)
            else return res.json(rows)
        })
    }

    async deleteComics(req,res){
        const { id, user_id } = req.body
        const sql = (
            `DELETE FROM comics WHERE id = ? AND user_id = ?`
        )
        db.all(sql,[id, user_id], (err,rows) => {
            if (err) return res.json(err)
            else res.json(rows)
    })
    }
}

module.exports = new ComicsController()