const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

const codesRoutes = require('./routes/codes-routes');
const usersRoutes = require('./routes/users-routes');
const {errorController, errorControllerForOther} = require("./controllers/error-controller");
const path = require("path");

const app = express();

app.use(bodyParser.json());

// app.use(express.static(path.join('public')));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods',
        'GET, POST, DELETE, PATCH');
    next();
})

app.use('/api/codes', codesRoutes);
app.use('/api/users', usersRoutes);

// app.use((req, res, next) => {
//     res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
// })

app.use(errorControllerForOther)

app.use(errorController)

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vqhr9e3.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`).then(() => {
    app.listen(process.env.PORT || 5000);
}).catch(err => {
    console.log(err);
})

