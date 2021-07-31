const resolve = require('path').resolve
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'none',
    entry: {
        entry1: './src/entry1.js',
        entry2: './src/entry2.js'
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    output: {
        filename: '[name].bundle.js',
        path: resolve(__dirname, 'dist')
    },
    optimization: {
        // splitChunks作用: 把 entry1.js 和 entry2.js 都共同引入的模块分包出来。
        // 假如 entry1.js 和 entry2.js 都引入了 element，那么 entry1.bundle.js 和 entry2.bundle.js
        // 不分包的话都会将 element 打包进去，两个文件就都会很大，所以需要分包处理
        splitChunks: {
            // 默认值就是async，分包的对象共同引入的异步模块。
            // initial: 分包的对象是共同引入的初始静态导入模块。all: 分包所有的共同引入的模块。
            chunks: 'all',
            // name代表打包出来的 chunk 的名称，有三种值：
            // 1.boolean = false (webpack5中不支持true)
            // 2.function (module, chunks, cacheGroupKey) => string 
            // 3.string
            // 一般都是使用 false，就是以 cacheGroups 中的 name 命名，如果没有 name，默认为 2.js, 3.js 这种数字类型的
            name: false,
            // 表示要被提取的模块最小被引用次数，引用次数超过或等于minChunks值，才能被提取
            // 这个例子里 subtract 被引用了 2 次，如果设置成 3 则不能被分包
            minChunks: 2,
            // 表示只有超过了多少字节才会被提取, 默认值是 20000，这里设置成 1 是为了这个例子里能分包 modules 中模块
            minSize: 1,
            // 模块打包生成的文件大小不能超过的值，如果超了要对其进行分割并打包生成新的文件。
            // webpack4中默认为0表示大小不限制, webpack5中取消了默认值设置为0时表示大于0的就会分割
            maxSize: 9999999999,
            // 动态引入的模块，并行请求的最大数量
            maxAsyncRequests: 5,
            // 打包后的入口文件加载时，能同时初始加载js文件的数量
            // 优先级: maxInitialRequest/maxAsyncRequests < maxSize < minSize
            maxInitialRequests: 3,
            // 命名连接符
            automaticNameDelimiter: '~',
            cacheGroups: {
                vendors: {
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10
                },
                modules: {
                    name: 'modules',
                    test: resolve('src/modules'),
                    priority: 10,
                    reuseExistingChunk: true
                }
            }
        }
    }
}