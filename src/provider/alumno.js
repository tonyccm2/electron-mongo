const formAlumno = document.querySelector('#formAlumno')
const formCodigo      = document.querySelector('#codigo')
const formNombres     = document.querySelector('#nombres')
const formApellidoParteno = document.querySelector('#apellido-paterno')
const formApellidoMarteno = document.querySelector('#apellido-materno')
const formCodigoEP = document.querySelector('#codigo-ep')
const formCodigoTutor = document.querySelector('#codigo-tutor')
const formDescripcion = document.querySelector('#descripcion')
const listaAlumnos = document.querySelector('#lista-alumnos')

const formBuscar = document.querySelector('#formBuscar')
const formCodigoBuscar = document.querySelector('#codigoBuscar')
const alumnoBuscado = document.querySelector('#alumno-buscado')

const { ipcRenderer } = require('electron')

let alumnos = [];
let editarEstado = false;
let idAlumnoEditar = '';
let Tutor = '';

formAlumno.addEventListener('submit',e => {
    e.preventDefault();
    const alumno = {
        codigo: formCodigo.value,
        nombres: formNombres.value,
        apellidoPaterno: formApellidoParteno.value,
        apellidoMaterno: formApellidoMarteno.value,
        codigoEP: formCodigoEP.value,
        codigoTutor: formCodigoTutor.value,
        descripcion: formDescripcion.value
    }
    if(!editarEstado){
        ipcRenderer.send('nuevoAlumno',alumno);
    }
    else{
        ipcRenderer.send('editarAlumno',{...alumno,idAlumnoEditar})
    }
    formAlumno.reset();
});

formBuscar.addEventListener('submit',e => {
    e.preventDefault();
    const alumno = {
        codigo: formCodigoBuscar.value,
    }
    ipcRenderer.send('buscarAlumno',alumno);
    formBuscar.reset();
    console.log('buscando...')
});

// renderer.send


ipcRenderer.send('obtenerAlumnos');

// renderer.on
ipcRenderer.on('nuevoAlumnoCreado', (e,args) =>{
    const alumnoCreado = JSON.parse(args);
    alumnos.push(alumnoCreado);
    renderAlumnos(alumnos);
    alert('Alumno creado correctamente');
});

ipcRenderer.on('listaAlumnos',(e,args) =>{
    alumnos = JSON.parse(args);
    console.log(alumnos);
    renderAlumnos(alumnos);
});

ipcRenderer.on('AlumnoEliminado',(e,args) =>{
    const alumnoEliminado = JSON.parse(args);
    newalumnos = alumnos.filter(p =>{
        return p._id !== alumnoEliminado._id;
    });
    alumnos = newalumnos;
    renderAlumnos(alumnos);
});


ipcRenderer.on('alumnoEditado', (e,args) =>{
    const alumnoEditado = JSON.parse(args);
    alumnos = alumnos.map(p =>{
        if(p._id === alumnoEditado._id){
            p.codigo = alumnoEditado.codigo;
            p.nombres = alumnoEditado.nombres;
            p.apellidoPaterno = alumnoEditado.apellidoPaterno;
            p.apellidoMaterno = alumnoEditado.apellidoMaterno;
            p.codigoEP = alumnoEditado.codigoEP;
            p.codigoTutor = alumnoEditado.codigoTutor;
            p.descripcion = alumnoEditado.descripcion;
        }
        return p;
    });
    editarEstado = false;
    console.log("renderizando...");
    renderAlumnos(alumnos);
});

//tutor

ipcRenderer.send('obtenerAlumnosDeTutor');


//funciones
function renderAlumnos(alumnos){
    listaAlumnos.innerHTML = ''
    alumnos.map( p =>{
        listaAlumnos.innerHTML += `
        <div class="row">
            <li class="card card-body col-md-6 p-2">
                <p>Codigo: ${p.codigo} </p>
                <p>Nombres: ${p.nombres} ${p.apellidoPaterno} ${p.apellidoMaterno} </p>
                <p>Codigo EP: ${p.codigoEP}</p>
            </li>
            <div class="col-md-6">
                <button class="btn btn-primary p-2" onclick="editar('${p._id}')">
                    Editar
                </button>
                <button class="btn btn-primary p-2" onclick="eliminar('${p._id}')">
                    Eliminar
                </button>
            </div>
        </div>
        `;
    });
}
function renderBuscado(alumno){
    alumnoBuscado.innerHTML = ''
    alumno.map( p =>{
        alumnoBuscado.innerHTML += `
        <div class="row">
            <p>
            </p>
            <li class="card card-body col-md-6 p-2">
                <p>Codigo: ${p.codigo} </p>
                <p>Nombres: ${p.nombres} ${p.apellidoPaterno} ${p.apellidoMaterno} </p>
                <p>Codigo EP: ${p.codigoEP}</p>
                <p>Descripción: ${p.descripcion}</p>
            </li>
            <div class="col-md-6">
                <button class="btn btn-primary p-2" onclick="editar('${p._id}')">
                    Editar
                </button>
                <button class="btn btn-primary p-2" onclick="eliminar('${p._id}')">
                    Eliminar
                </button>
            </div>
        </div>
        `;
    });
}

function eliminar(id){
    const result = confirm('¿Estás seguro de querer eliminar este alumno?');
    if (result){
        ipcRenderer.send('eliminarAlumno',id);
    }
    return;
}

function editar(id){
    editarEstado = true;
    idAlumnoEditar = id;
    const alumno = alumnos.find( p => p._id === id)
    formCodigo.value = alumno.codigo;
    formNombres.value = alumno.nombres;
    formApellidoParteno.value = alumno.apellidoPaterno;
    formApellidoMarteno.value = alumno.apellidoMaterno;
    formCodigoTutor.value = alumno.codigoTutor;
    formCodigoEP.value = alumno.codigoEP;
    
}

//buscar



ipcRenderer.on('alumnoBuscado',(e,args) =>{
    const alumnoBuscado = JSON.parse(args);
    console.log("renderizando...");
    renderBuscado(alumnoBuscado);
});