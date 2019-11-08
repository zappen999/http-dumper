const Notera = require('notera')
const noteraTransportTerminal = require('notera-transport-terminal')

const logger = new Notera()

logger.addTransport(noteraTransportTerminal())

module.exports = logger
