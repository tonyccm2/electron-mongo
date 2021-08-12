const formDocente = document.querySelector('#formDocente')
const formCodigo      = document.querySelector('#codigo')
const formPassword = document.querySelector('#password')
const formNombres     = document.querySelector('#nombres')
const formApellidoParteno = document.querySelector('#apellido-paterno')
const formApellidoMarteno = document.querySelector('#apellido-materno')
const formCodigoEP = document.querySelector('#codigo-ep')
const formCategoria = document.querySelector('#categoria')
const listaDocentes = document.querySelector('#lista-docentes')

const formBuscar = document.querySelector('#formBuscar')
const formCodigoBuscar = document.querySelector('#codigoBuscar')
const docenteBuscado = document.querySelector('#docente-buscado')

const { ipcRenderer } = require('electron')

let docentes = [];
let editarEstado = false;
let idDocenteEditar = '';

// submits
formDocente.addEventListener('submit',e => {
    e.preventDefault();
    const docente = {
        codigo: formCodigo.value,
        password: formPassword.value,
        nombres: formNombres.value,
        apellidoPaterno: formApellidoParteno.value,
        apellidoMaterno: formApellidoMarteno.value,
        codigoEP: formCodigoEP.value,
        categoria: formCategoria.value
    }
    if(!editarEstado){
        ipcRenderer.send('nuevoDocente',docente);
    }
    else{
        ipcRenderer.send('editarDocente',{...docente,idDocenteEditar})
    }
    formDocente.reset();
});

formBuscar.addEventListener('submit',e => {
    e.preventDefault();
    const docente = {
        codigo: formCodigoBuscar.value,
    }
    ipcRenderer.send('buscarDocente',docente);
    formBuscar.reset();
    console.log('buscando...')
});


ipcRenderer.send('obtenerDocentes');

// renderer.on

ipcRenderer.on('docenteBuscado',(e,args) =>{
    const docenteBuscado = JSON.parse(args);
    console.log("renderizando...");
    renderBuscado(docenteBuscado);
});

ipcRenderer.on('nuevoDocenteCreado', (e,args) =>{
    const docenteCreado = JSON.parse(args);
    docentes.push(docenteCreado);
    renderDocentes(docentes);
    alert('Docente creado correctamente');
});

ipcRenderer.on('listaDocentes',(e,args) =>{
    docentes = JSON.parse(args);
    console.log(docentes);
    renderDocentes(docentes);
});

ipcRenderer.on('DocenteEliminado',(e,args) =>{
    const docenteEliminado = JSON.parse(args);
    newdocentes = docentes.filter(p =>{
        return p._id !== docenteEliminado._id;
    });
    docentes = newdocentes;
    renderAlumnos(docentes);
});

ipcRenderer.on('docenteEditado', (e,args) =>{
    const docenteEditado = JSON.parse(args);
    docentes = docentes.map(p =>{
        if(p._id === docenteEditado._id){
            p.codigo = docenteEditado.codigo;
            p.nombres = docenteEditado.nombres;
            p.apellidoPaterno = docenteEditado.apellidoPaterno;
            p.apellidoMaterno = docenteEditado.apellidoMaterno;
            p.codigoEP = docenteEditado.codigoEP;
        }
        return p;
    });
    editarEstado = false;
    renderDocentes(docentes);
});

//funciones
function renderDocentes(docentes){
    listaDocentes.innerHTML = ''
    docentes.map( p =>{
        listaDocentes.innerHTML += `
        <div class="row">
            <li class="card card-body col-md-6 p-2">
                <p>Codigo: ${p.codigo}</p>
                <p>Nombres: ${p.nombres} ${p.apellidoPaterno} ${p.apellidoMaterno}</p>
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

function renderBuscado(docente){
    docenteBuscado.innerHTML = ''
    docente.map( p =>{
        docenteBuscado.innerHTML += `
        <div class="row">
            <p>
            </p>
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

function eliminar(id){
    const result = confirm('¿Estás seguro de querer eliminar este docente?');
    if (result){
        ipcRenderer.send('eliminarDocente',id);
    }
    return;
}

function editar(id){
    editarEstado = true;
    idDocenteEditar = id;
    const docente = docentes.find( p => p._id === id)
    formCodigo.value = docente.codigo;
    formNombres.value = docente.nombres;
    formApellidoParteno.value = docente.apellidoPaterno;
    formApellidoMarteno.value = docente.apellidoMaterno;
    
}

