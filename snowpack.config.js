/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: '/',
    src:'/dist'
  },
  plugins: [
    '@snowpack/plugin-svelte',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-postcss',
    '@snowpack/plugin-webpack'
  ],
  devOptions: {
    port: 3000
  },
  buildOptions: {
    baseUrl: './',
    out: 'dist'
  }
}
