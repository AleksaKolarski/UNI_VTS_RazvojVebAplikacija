module.exports = {
    entry: {
        main: './src/main.ts'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.html$/,
                use: ["html-loader"]
            },
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', 'less']
    }
};
