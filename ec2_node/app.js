// app.js
const express = require('express');
const app = express();


app.get('', (req, res, next) => {
    res.send("Hello world nodejs\n");
});


app.listen(7000, () => {
    console.log("App is listening 7000 port 알겠누");
});
