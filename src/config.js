module.exports.PORT = process.env.PORT || 8080
module.exports.REQ_LOGS = process.env.REQ_LOGS || './requests'
module.exports.BEHIND_PROXY = process.env.BEHIND_PROXY === '1'
