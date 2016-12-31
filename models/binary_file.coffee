mongoose = require('mongoose')
Schema = mongoose.Schema
passportLocalMongoose = require('passport-local-mongoose')

BinaryFile = new Schema(
  binary: Buffer
  )

BinaryFile.plugin passportLocalMongoose
module.exports = mongoose.model('BinaryFile', BinaryFile)
