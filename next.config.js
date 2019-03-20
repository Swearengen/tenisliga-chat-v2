require('dotenv').config()
const path = require('path')
const Dotenv = require('dotenv-webpack')

const prod = process.env.NODE_ENV === 'production'

const withTypescript = require('@zeit/next-typescript')
module.exports = withTypescript({
    webpack(config, options) {
        config.plugins = config.plugins || []

        config.plugins = [
          ...config.plugins,

          // Read the .env file
          new Dotenv({
            path: path.join(__dirname, `./environment/.env.${prod ? 'prod' : 'dev'}`),
            systemvars: true
          })
        ]

        return config
    }
})
