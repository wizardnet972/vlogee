const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
  const ejsPath = process.env.VLOGEE_OFFLINE ? './logs.offline.ejs' : './logs.ejs';

  const logsHtml = fs.readFileSync(path.resolve(__dirname, ejsPath), 'utf-8');
  const logs = fs.readdirSync('./logs').map(file => file);
  const html = ejs.render(logsHtml, { logs });
  res.send(html);
});

router.get('/:id', (req, res) => {
  const d = fs.readFileSync(`./logs/${req.params.id}`, 'utf-8');

  const logs = d
    .split('\n')
    .filter(s => !!s)
    .map(s => JSON.parse(s))
    .reverse();

  res.json(logs);
});

module.exports = { router };
