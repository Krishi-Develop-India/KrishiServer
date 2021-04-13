if(process.env !== 'production') require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const sms = require('./services/sms');
const api = require('./routes/api');
const authapi = require('./routes/authApi');
const admin = require('./routes/admin');
const download = require('./routes/download');

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}).then(() => console.log("Connected"));

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({extended: true}));
app.use('/public/images/profile' ,express.static(__dirname+'/public/images/profile'));
app.use('/public/resources' ,express.static(__dirname+'/public/resources'));

app.use('/api', api);
app.use('/auth/api', authapi);
app.use('/admin', admin);
app.use('/download', download);

app.listen(process.env.PORT, ()=>console.log(`Server started on port ${process.env.PORT}`));