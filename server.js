var express = require('express');
var path = require('path');
var app = express();


// Server routes...

app.get('/hello', (req, res) => res.send( { hi: "there"} ));


if(process.env.NODE_ENV !== "production"){
    var webpackMiddleware = require('webpack-dev-middleware');
    var webpack = require('webpack');
    var webpackConfig = require('./webpack.config.js');
    app.use( webpackMiddleware( webpack( webpackConfig ) ) );
} else {
    
    app.use(express.static('dist'));

    app.get('*', (req, res) => {
        req.sendFile(path.join(__dirname, 'dist/index.html'));
    });

}


app.listen( process.env.PORT || 3050, () => console.log("Listening...") );



