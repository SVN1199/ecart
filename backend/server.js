const app = require('./app')
const path = require('path')
const connectDatabase = require('./config/database')
const port = process.env.PORT || 5000


connectDatabase()

const server = app.listen(port, () => {
    console.log(`Server Running on ${port} in ${process.env.NODE_ENV}`)
})

process.on('unhandledRejection', (err) => {
    console.log(`Error  :  ${err.message}`)
    console.log(`Shutdown the server due to unhandledRejection`)
    server.close(() => {
        process.exit(1)
    })
})

process.on('uncaughtException', (err) => {
    console.log(`Error  :  ${err.message}`)
    console.log(`Shutdown the server due to uncaughtException`)
    server.close(() => {
        process.exit(1)
    })
})

