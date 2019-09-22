const path = require('path');

module.exports = function(env, argv) {

    const main = {
        mode: argv.mode === 'production' ? "production" : "development",
        target: 'node',
        entry: path.join(__dirname, 'src', 'tasks/index.ts'),
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
            rules: [{
                test: /\.(tsx|ts)$/,
                use: [ 'ts-loader' ],
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'node_modules'),
                ],
            }]
        },
        plugins: []
    };

    return [ main ];
};
