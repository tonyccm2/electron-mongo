const listaAlumnos = document.querySelector('#lista-alumnos')
const formBuscar = document.querySelector('#formBuscar')
const formCodigoBuscar = document.querySelector('#codigoBuscar')
const alumnoBuscado = document.querySelector('#alumno-buscado')

const { ipcRenderer } = require('electron')

let alumnos = [];

//submit

formBuscar.addEventListener('submit',e => {
    e.preventDefault();
    const alumno = {
        codigo: formCodigoBuscar.value,
    }
    ipcRenderer.send('buscarTutorando',alumno);
    formBuscar.reset();
    console.log('buscando...')
});

ipcRenderer.on('tutorandoBuscado',(e,args) =>{
    const alumnoBuscado = JSON.parse(args);
    console.log("renderizando...");
    renderBuscado(alumnoBuscado);
});
//renderer
ipcRenderer.send('obtenerAlumnosDeDocente');

ipcRenderer.on('listaAlumnos',(e,args) =>{
    alumnos = JSON.parse(args);
    console.log(alumnos);
    renderAlumnos(alumnos);
});


//funciones
function renderAlumnos(alumnos){
    listaAlumnos.innerHTML = ''
    alumnos.map( p =>{
        listaAlumnos.innerHTML += `
        <div class="row">
            <li class="card card-body">
                <p>Codigo: ${p.codigo} </p>
                <p>Nombres: ${p.nombres} ${p.apellidoPaterno} ${p.apellidoMaterno} </p>
                <p>Codigo EP: ${p.codigoEP}</p>
                <p>Descripcion: ${p.descripcion}</p>
                <p>Asesorado: </p>
                <input type="checkbox" name="asesorado">
            </li>
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
        </div>
        `;
    });
}
