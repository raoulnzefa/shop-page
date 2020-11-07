const store = require('./store.js')
const logfile = require('./login.js')
const express = require('express')
const path = require('path')
const app = express()

app.use(express.json())

app.get('/api/store', (req, res) => {
    res.status(200).json(store.store)
})

app.post('/api/login', (req, res) => {
    if(req.body.login.indexOf('@mail.ch')) {
        logfile.logfile.forEach(el => {
            if(el.login === req.body.login.toString() && el.password === req.body.password.toString()) {
                res.status(200).json('/api/store')
            }
        })
    } else {
        res.status(200).json('');
    }
})

app.use(express.static(path.resolve(__dirname, 'app')))

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'app', 'index.html'))
})

app.listen(3000, () => {
    console.log('Server has been started at port 3000...')
})
