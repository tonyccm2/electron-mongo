const { BrowserWindow, ipcMain , ipcRenderer, Menu} = require('electron')

const alumno = require('./models/alumno')
const docente = require('./models/docente')

let CrudAlumnoWindow
let CrudDocenteWindow
let ListaTutorandos
let Tutor= '';
//crear ventana de electron
function createWindow(){
    const win = new BrowserWindow({
        width: 1200,
        heigth: 900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    })
    win.loadFile('src/index.html')
    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);
}
const templateMenu = [
    {
        label: 'Registrar',
        submenu: [
            {
                label: 'Registrar Alumno',
                click(){
                    createCrudAlumno();
                }
            },
            {
                label: 'Registrar Docente',
                click(){
                    createCrudDocente();
                }
            }
        ]
    },
    {
        label: 'DevTools',
        submenu: [
            {
                label: 'Dev tools',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    }
]

// ventanas para cruds
function createCrudAlumno(){
    CrudAlumnoWindow = new BrowserWindow({
        width: 1200,
        heigth: 900,
        title: 'Registrar Alumno',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    })
    CrudAlumnoWindow.loadFile('src/ui/alumno.html')
}
function createCrudDocente(){
    CrudDocenteWindow = new BrowserWindow({
        width: 1200,
        heigth: 900,
        title: 'Registrar Docente',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    })
    CrudDocenteWindow.loadFile('src/ui/docente.html')
}

function createWindowTutorandos(){
    ListaTutorandos = new BrowserWindow({
        width: 1200,
        heigth: 900,
        title: 'Lista Tutorandos',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    })
    ListaTutorandos.loadFile('src/ui/tutorandos.html')
}
// eventos crud para persona
ipcMain.on('login', async(e,args) => {
    try {
        const Buscar = await docente.find({'codigo': args.codigo})
        if(Buscar[0].password === args.password){
            Tutor = Buscar[0];
            createWindowTutorandos();
        }else{
            e.reply('longinError');
        }
    } catch (error) {
        e.reply('longinError');
        console.log(error);
    }
    

});

//eventos crud para alumno

ipcMain.on('nuevoAlumno', async(e,args) => {
    const nuevoAlumno = new alumno(args);
    const alumnoGuardado = await nuevoAlumno.save();
    e.reply('nuevoAlumnoCreado',JSON.stringify(alumnoGuardado));
});

ipcMain.on('obtenerAlumnos', async (e,args) => {
    const alumnos = await alumno.find();
    e.reply('listaAlumnos', JSON.stringify(alumnos));
});

ipcMain.on('buscarAlumno', async (e,args) => {
    const alumnoBuscado = await alumno.find({'codigo': args.codigo});
    e.reply('alumnoBuscado', JSON.stringify(alumnoBuscado));
});

ipcMain.on('obtenerAlumnosDeDocente', async (e) => {
    const alumnos = await alumno.find({'codigoTutor': Tutor.codigo});
    e.reply('listaAlumnos', JSON.stringify(alumnos));
});

ipcMain.on('eliminarAlumno', async (e,args) => {
    const alumnoEliminado = await alumno.findByIdAndDelete(args);
    e.reply('alumnoEliminado',JSON.stringify(alumnoEliminado));
});

ipcMain.on('editarAlumno', async (e,args) =>{
    const alumnoEditado = await alumno.findByIdAndUpdate(args.idAlumnoEditar,{
        codigo: args.codigo,
        nombres: args.nombres,
        apellidoPaterno: args.apellidoPaterno,
        apellidoMaterno: args.apellidoMaterno,
        codigoEP: args.codigoEP,
    },{new: true});
    e.reply('alumnoEditado',JSON.stringify(alumnoEditado));
});
//eventos crud para docente

ipcMain.on('nuevoDocente', async(e,args) => {
    const nuevoDocente = new docente(args);
    const docenteGuardado = await nuevoDocente.save();
    e.reply('nuevoDocenteCreado',JSON.stringify(docenteGuardado));
});

ipcMain.on('obtenerDocentes', async (e,args) => {
    const docentes = await docente.find();
    e.reply('listaDocentes', JSON.stringify(docentes));
});

ipcMain.on('buscarDocente', async (e,args) => {
    const docenteBuscado = await docente.find({'codigo': args.codigo});
    e.reply('docenteBuscado', JSON.stringify(docenteBuscado));
});

ipcMain.on('eliminarDocente', async (e,args) => {
    const docenteEliminado = await docente.findByIdAndDelete(args);
    e.reply('docenteEliminado',JSON.stringify(docenteEliminado));
});

ipcMain.on('editarDocente', async (e,args) =>{
    const docenteEditado = await docente.findByIdAndUpdate(args.idDocenteEditar,{
        codigo: args.codigo,
        nombres: args.nombres,
        apellidoPaterno: args.apellidoPaterno,
        apellidoMaterno: args.apellidoMaterno,
        codigoEP: args.codigoEP,
    },{new: true});
    e.reply('docenteEditado',JSON.stringify(docenteEditado));
});


//eventos crud para tutorando

ipcMain.on('buscarTutorando', async (e,args) => {
    const tutorandoBuscado = await alumno.find({'codigo': args.codigo});
    e.reply('tutorandoBuscado', JSON.stringify(tutorandoBuscado));
});


module.exports = {createWindow}