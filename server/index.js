const express = require('express')
const comicsRouter = require('./routes/comics.routes')
const imagesRouter = require('./routes/images.routes')
const usersRouter = require('./routes/users.routes')

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 8080

const app = express()

app.use(bodyParser.json({limit: '500mb'}))
app.use('/api',comicsRouter)
app.use('/api',imagesRouter)
app.use('/api',usersRouter)


app.listen(PORT, () => console.log(`Сервер запущен с портом: ${PORT}`))


