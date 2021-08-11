const {createWindow} = require('./main')
const {app} = require('electron')
require('./dababase')


app.whenReady().then(createWindow)

