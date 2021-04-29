const router = require('express').Router();
const { Router } = require('express');
const path = require('path');
const { route } = require('./api');
const fs = require('fs');

const brief = path.join(__dirname, '..', '/public/resources/krishi-brief.pdf');
const uml = path.join(__dirname, '..', '/public/resources/krishi-uml.pdf');
const ppt = path.join(__dirname, '..', '/public/resources/krishi-ppt.pptx');

router.get('/brief.pdf', (req, res) => {
    res.download(brief);
});

router.get('/uml.pdf', (req, res) => {
    res.download(uml);
});

router.get('/proposal.pdf', (req, res) => {
    res.send("Not found");
});

router.get('/ppt.pptx', (req, res) => {
    res.download(ppt);
});

module.exports = router;