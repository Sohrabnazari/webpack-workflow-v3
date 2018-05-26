let webpack = require('webpack');
let path = require('path');
let glob = require('glob');
let fs = require('fs');


let PurifyCSSPlugin = require('purifycss-webpack');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
let MiniCssExtractPlugin = require("mini-css-extract-plugin");



var production = process.env.NODE_ENV === 'production';


var WebpackNotifierPlugin = require('webpack-notifier');


module.exports = {

    mode: 'production',

    entry: {

        app: [

            './source/main.js',
            './source/main.scss',
        ],

        vendor: ['jquery']
    },

    output: {

        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash].js'
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all'
                }
            }
        }
    },


    module: {

        rules: [

            
            {
                test: /\.s[ac]ss$/,
                use: [

                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader' },
                    { loader: 'postcss-loader' },
                    { loader: 'sass-loader' }
                ]
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
        watchContentBase: true,
        overlay: true

    },

    plugins: [


        // new BundleAnalyzerPlugin(),

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

        new MiniCssExtractPlugin({
            filename: production ? '[name].[hash].css' : '[name].css',
            chunkFilename: production ? '[id].[hash].css' : '[id].css'
        }),
        
        new webpack.LoaderOptionsPlugin({
            minimize: production
        }),

        new HtmlWebpackPlugin({template: path.join(__dirname, '/source/index.html') }),



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


