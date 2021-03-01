const api_key = 'dbabd41b2e93717cd2f1e8e1b5cd06b5-3939b93a-2899d6df';

const domain = 'sandbox50a4adacc9284ab8a4df59a9970a5c6f.mailgun.org';

export const mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});