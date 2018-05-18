let webpack = require('webpack');
let path = require('path');
let glob = require('glob');
let fs = require('fs');

let ExtractTextPlugin = require("extract-text-webpack-plugin");
let PurifyCSSPlugin = require('purifycss-webpack');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');

let BuildManifestPlugin = require('./build/plugins/BuildManifestPlugin');
let BuildCallbackPlugin = require('./build/plugins/BuildCallbackPlugin');

var production = process.env.NODE_ENV === 'production';


var WebpackNotifierPlugin = require('webpack-notifier');


module.exports = {

    entry: {

        app: [

            './source/main.js',
            './source/main.scss',
        ],

        vendor: ['jquery']
    },

    output: {

        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
    },

    module: {

        rules: [

            
            {
                test: /\.s[ac]ss$/,
                use: ExtractTextPlugin.extract({

                    use: [
                     
                        { loader: 'css-loader' },
                        { loader: 'postcss-loader' },
                        { loader: 'sass-loader' }
                    ],

                    fallback:  { loader: 'style-loader'},
                })
            },


            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },

            
            {
                test: /\.html?$/,
                use: 'html-loader'
            },


            {

                test: /\.(png|jpe?g|gif|svg)$/,
                loaders: [

                    {
                        loader: 'file-loader', 
                        options: { 
                            name: '[name].[ext]',
                            outputPath: 'images/'
                        }
                    },
                    
                    {
                        loader: 'img-loader', 
                        options: {}
                    },

                ],

            },


            {
                test: /\.(eot|ttf|woff|woff2|json|xml|ico)$/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]'
                }

            },
            

        ]
    },


    devServer: {

        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
        open: true,
        watchContentBase: true

    },

    plugins: [


        new CleanWebpackPlugin(['dist'], {

            root:     __dirname,
            verbose:  true,
            dry:      false,
            exclude:  [],
        }),


        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, '/*.html')), // app/**/*.html
            minimize: production
        }),

        new ExtractTextPlugin('[name].css'),

        
        new webpack.LoaderOptionsPlugin({
            minimize: production
        }),

        new HtmlWebpackPlugin({template: path.join(__dirname, '/source/index.html') }),

    //    new BuildManifestPlugin()




        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),


        new WebpackNotifierPlugin({
            title: 'Webpack',
            message: 'Mission Successfully Completed!',
            sound: true
        })



    ]
};


if( production ){
    module.exports.plugins.push (
        new webpack.optimize.UglifyJsPlugin()
    )
}


