const router = require('express').Router();
const { Router } = require('express');
const path = require('path');
const { route } = require('./api');
const fs = require('fs');

const brief = path.join(__dirname, '..', '/public/resources/brief.pdf');
const uml = path.join(__dirname, '..', '/public/resources/uml.pdf');

router.get('/brief.pdf', (req, res) => {
    res.download(brief);
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