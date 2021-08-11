const {model,Schema} = require('mongoose')

const newDocenteSchema = new Schema({
    codigo: {
        type: String,
        require: true,
    },
    password:{
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
        require: true,
    },
    codigoEP:{
        type:String,
        require: true,
    },
    categoria:{
        type:String,
        require: true,
    }
})
module.exports = model('docente',newDocenteSchema)
