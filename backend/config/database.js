const mongoose = require('mongoose')

const connectDatabase = () => {
    mongoose.connect(process.env.MONGO_URI,{
        // useNewUrlParser : true,
        // useUnifiedTopology : true
    }).then((con)=>{
        console.log(`MongoDB is Connected to the host : ${con.connection.host}`)
    })
}

module.exports = connectDatabase