const router = require('express').Router();
const { Router } = require('express');
const path = require('path');
const { route } = require('./api');

const brief = path.join(__dirname, '..', '/public/resources/krishi-brief.pdf');
const uml = path.join(__dirname, '..', '/public/resources/krishi-uml.pdf');

router.get('/brief', (req, res) => {
    res.sendFile(brief);
});

router.get('/uml', (req, res) => {
    res.download(uml);
});

router.get('/proposal', (req, res) => {
    res.send("Not found");
});

router.get('/ppt', (req, res) => {
    res.send("Not found");
});

module.exports = router;