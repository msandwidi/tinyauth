const sendgrid = require('sendgrid')
const helper = sendgrid.mail
const config = require('../')

const isTestMode = process.env.NODE_ENV === 'test';

class Mailer extends helper.Mail {
  constructor({
    subject,
    recipients
  }, content) {
    super()
    let mailer = this
    mailer.sgApi = sendgrid(config.SENDGRID_SECRET)
    mailer.from_email = new helper.Email(config.NO_REPLY_EMAIL_ADDRESS)
    mailer.subject = subject
    mailer.body = new helper.Content('text/html', content)
    mailer.recipients = mailer.formatAddresses(recipients)

    mailer.addContent(mailer.body)
    mailer.addClickTracking()
    mailer.addRecipients()
  }

  formatAddresses(recipients) {
    return recipients.map(({
      email
    }) => {
      return new helper.Email(email)
    })
  }

  addClickTracking() {
    let mailer = this
    const trackingSettings = new helper.TrackingSettings()
    const clickTracking = new helper.ClickTracking(true, true)

    trackingSettings.setClickTracking(clickTracking)
    mailer.addTrackingSettings(trackingSettings)
  }

  addRecipients() {
    let mailer = this
    const personalize = new helper.Personalization()

    mailer.recipients.forEach(recipient => {
      personalize.addTo(recipient)
    })
    mailer.addPersonalization(personalize)
  }

  async send() {
    let mailer = this
    const request = mailer.sgApi.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mailer.toJSON()
    })
    if (isTestMode) return new Promise(resolve => resolve({}))
    return await mailer.sgApi.API(request)
  }
}

module.exports = Mailer