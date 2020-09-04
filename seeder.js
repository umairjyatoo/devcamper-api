const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//Load env variables
dotenv.config({ path: './config/config.env' })

//Load Models

const Bootcamp = require('./Models/Bootcamp')

//Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
});

//Read JSON Files

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))

//Import into DB (To run in terminal "node seeder -i")
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps)
        console.log('Data Imported...'.green.inverse)
        process.exit()
    } catch (err) {
        console.error(err)
    }
}

//Delete data (To run in terminal "node seeder -d")
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany()
        console.log('Data Destroyed...'.red.inverse)
        process.exit()
    } catch (err) {
        console.error(err)
    }
}

if (process.argv[2] === '-i') {
    importData()
} else if (process.argv[2] === '-d') {
    deleteData()
}