const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const route = require('./routes/route')

app.use(express.json())
app.use(cors())
app.use(bodyParser.json())

const config = {
    autoIndex: true,
    useNewUrlParser: true
}

//mongodb+srv://Natkamon:nut61515002@cluster0.2ulvt.mongodb.net/miniprojectDatabase?retryWrites=true&w=majority
const connectionString = 'mongodb+srv://TestPymongo:1111@cluster0.whdxu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(connectionString, config)
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.log('Cannot Connect to MongoDB...'))

app.get('/', (req, res) => {
    res.send('miniproject Nutz')
})
app.use('/api', route)

app.use((req, res, next) => {
    const err = new Error('Not found')
    err.status = 404
    next(err)
})


app.use((err, req, res, next) => {
    const error = app.get('env') === 'development'? err:{}
    const status = err.status || 500
    res.status(status).json({
        error: {
            message: error.message, 
            status: error.status
        }
    })
    console.error(err)
})

const port = app.get('port') || 3100
app.listen(port, () => console.log(`Sever is listening on port ${port}`))

