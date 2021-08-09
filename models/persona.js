const {model,Schema} = require('mongoose')

const newPersonaSchema = new Schema({
    codigo: {
        type: String,
        require: true
    },
    nombres:{
        type: String,
        require: true
    },
    apellidoPaterno:{
        type: String,
        require: true
    },
    apellidoMaterno:{
        type: String,
        require: true
    },
})

module.exports = model('persona',newPersonaSchema)