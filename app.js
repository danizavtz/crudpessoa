const express = require('express')
const postgres = require('./lib/postgres');
const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Hello, world' })
})

app.get('/pessoas', async (req, res) => {
    try {
        const sql = 'SELECT id, nome, apelido, nascimento FROM pessoa'
        const { rows } = await postgres.query(sql)
        res.status(200).json(rows)
    } catch (err) {
        console.log(err);
        res.status(500).json({ "errors": [{ msg: "Houve um erro." }] })
    }
})

app.get('/pessoas/:id', async (req, res) => {
    try {
        const sql = 'SELECT id, nome, apelido, nascimento FROM pessoa WHERE id = $1'
        const { rows } = await postgres.query(sql, [req.params.id])
        if (rows.length === 0) {
            res.status(404).json({ "errors": [{ msg: "not found" }] })
            return
        }
        res.status(200).json(rows[0])
    } catch (err) {
        console.log(err);
        res.status(500).json({ "errors": [{ msg: "Houve um erro." }] })
    }
})
app.put('/pessoas/:id', async (req, res) => {
    try {
        const sql = 'UPDATE pessoa SET nome = $2, apelido = $3, nascimento = $4 WHERE id = $1 RETURNING *'
        const { rows } = await postgres.query(sql, [req.params.id, req.body.nome, req.body.apelido, req.body.nascimento])
        if (rows.length === 0) {
            res.status(404).json({ "errors": [{ msg: "not found" }] })
            return
        }
        res.status(200).json(rows[0])
    } catch (err) {
        console.log(err);
        res.status(500).json({ "errors": [{ msg: "Houve um erro." }] })
    }
})

app.post('/pessoas', async (req, res) => {
    try {
        const sql = 'INSERT INTO pessoa (nome, apelido, nascimento) VALUES ($1,$2,$3) RETURNING id'
        const { rows } = await postgres.query(sql, [req.body.nome, req.body.apelido, req.body.nascimento])
        res.status(201).json(rows[0])
    } catch (err) {
        console.log(err);
        res.status(500).json({ "errors": [{ msg: "Houve um erro." }] })
    }
})

app.listen(3000)