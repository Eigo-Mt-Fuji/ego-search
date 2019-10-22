const path = require('path');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = function(env, argv) {

    const main = {
        mode: argv.mode === 'production' ? "production" : "development",
        target: 'node',
        entry: path.join(__dirname, 'src', 'tasks/index.ts'),
        optimization: {
            minimize: false
        },
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, 'dist')
        },
        resolve: {
            extensions: ['.json', '.js', '.ts']
        },
        node: {
            __dirname: false,
            __filename: false
        },
        module: {
            rules: [
                {
                    test: /\.(tsx|ts)$/,
                    use: [ 'ts-loader' ],
                    include: [
                        path.resolve(__dirname, 'src'),
                        path.resolve(__dirname, 'node_modules'),
                    ],
                },
                {
                    test: /\.(html)$/,
                    use: {
                      loader: 'html-loader'
                    }
                }
            ]
        },
        plugins: [
            //ignore the drivers you don't want. This is the complete list of all drivers -- remove the suppressions for drivers you want to use.
            new FilterWarningsPlugin({
                exclude: [/mongodb/, /mssql/, /mysql/, /mysql2/, /oracledb/, /pg/, /pg-native/, /pg-query-stream/, /redis/, /sqlite3/]
            })
        ]
    };

    return [ main ];
};
