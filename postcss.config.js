
module.exports = (ctx) => ({
    map: ctx.options.map,
    plugins: {
        'postcss-import': {},
        'postcss-cssnext': {
            warnForDuplicates: false
        },
        'cssnano': ctx.env === 'production' ? {} : false
    }        
});