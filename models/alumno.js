const {model,Schema} = require('mongoose')

const newAlumnoSchema = new Schema({
    codigo: {
        type: String,
        require: true,
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
    codigoTutor: {
        type: String,
        require: true,
    },
    descripcion: {
        type: String,
        require: false,
    }
})

module.exports = model('alumno',newAlumnoSchema)