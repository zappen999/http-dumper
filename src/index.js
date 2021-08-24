const fs = require('fs')
const path = require('path')
const util = require('util')
const Koa = require('koa')
const getRawBody = require('raw-body')
const logger = require('./utils/log')
const config = require('./config')

const appendFile = util.promisify(fs.appendFile)

const app = new Koa()
app.proxy = config.BEHIND_PROXY

app
  .use(track)
  .listen(config.PORT, err => {
    if (err) {
      logger.err('Could not listen', err)
      return
    }

    logger.info(`Listening on port ${config.PORT}`)
  })

async function store (date, ip, method, url, header, bodyBuf) {
  const fileName = `req-${date.replace(/:|\./g, '-')}`
  const filePath = path.join(config.REQ_LOGS, fileName)
  const head = JSON.stringify({ date, ip, method, path: url, header }, null, 2) +
    '\n\n--------------\n'

  await appendFile(filePath, head)
  await appendFile(filePath, bodyBuf)
}

async function track (ctx) {
  let bodyBuf
  const date = new Date().toISOString()
  const ip = ctx.ip
  const method = ctx.method
  const url = ctx.url

  try {
    bodyBuf = await getRawBody(ctx.req, { limit: '10mb' })
  } catch (err) {
    logger.err('Could not get raw body', err)
    ctx.status = 500
    return
  }

  try {
    await store(date, ip, method, url, ctx.request.header, bodyBuf)
  } catch (err) {
    logger.err('Could not store request', err, ctx.request)
    ctx.status = 500
    return
  }

  // Access log for overview
  logger.info(`${date} - [${ip}] ${method} ${url}`)

  ctx.status = 200
  ctx.body = 'OK'
}
