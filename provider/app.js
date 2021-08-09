const formLogin = document.querySelector('#formLogin')
const formCodigo = document.querySelector('#codigo')
const formPassword = document.querySelector('#password')

const { ipcRenderer } = require('electron')

let personas = [];

formLogin.addEventListener('submit',e => {
    e.preventDefault();
    const docente = {
        codigo: formCodigo.value,
        password: formPassword.value,
    }
    ipcRenderer.send('login',docente);
    console.log(docente);
    formLogin.reset();
});

ipcRenderer.on('loginError',(e) =>{
    alert('Error de contraseña');
});


ipcRenderer.send('obtenerPersonas');

// renderer.on
ipcRenderer.on('nuevaPersonaCreada', (e,args) =>{
    const personaCreada = JSON.parse(args);
    personas.push(personaCreada);
    renderPersonas(personas);
    alert('Persona creada correctamente');
});

ipcRenderer.on('listaPersonas',(e,args) =>{
    personas = JSON.parse(args);
    console.log(personas);
    renderPersonas(personas);
});

ipcRenderer.on('personaEliminada',(e,args) =>{
    const personaEliminada = JSON.parse(args);
    newpersonas = personas.filter(p =>{
        return p._id !== personaEliminada._id;
    })
    personas = newpersonas;
    renderPersonas(personas);
});

ipcRenderer.on('personaEditada', (e,args) =>{
    const personaEditada = JSON.parse(args);
    personas = personas.map(p =>{
        if(p._id === personaEditada._id){
            p.codigo = personaEditada.codigo;
            p.nombres = personaEditada.nombres;
            p.apellidoPaterno = personaEditada.apellidoPaterno;
            p.apellidoMaterno = personaEditada.apellidoMaterno;
        }
        return p;
    });
    editarEstado = false;
    renderPersonas(personas);
});

//funciones
function renderPersonas(personas){
    listaPersonas.innerHTML = ''
    personas.map( p =>{
        listaPersonas.innerHTML += `
        <div class="row">
            <li class="card card-body col-md-6">
                <p>Codigo: ${p.codigo}</p>
                <p>Nombres: ${p.nombres}</p>
                <p>Apellido Paterno: ${p.apellidoPaterno}</p>
                <p>Apellido Materno: ${p.apellidoMaterno}</p>
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
    const result = confirm('¿Estás seguro de querer eliminar esta persona?');
    if (result){
        ipcRenderer.send('eliminarPersona',id);
    }
    return;
}

function editar(id){
    editarEstado = true;
    idPersonaEditar = id;
    const persona = personas.find( p => p._id === id)
    formCodigo.value = persona.codigo;
    formNombres.value = persona.nombres;
    formApellidoParteno.value = persona.apellidoPaterno;
    formApellidoMarteno.value = persona.apellidoMaterno;
    
}