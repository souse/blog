```javascript
import { Configuration, OpenAIApi } from 'openai'
import { WechatyBuilder } from 'wechaty'
import qrcodeTerminal from 'qrcode-terminal'

const configuration = new Configuration({
  // TODO 这里需要openaiKey
  apiKey: '',
})
const openai = new OpenAIApi(configuration)

async function askQuestion(question, previousAnswer) {
  const requestBody = {
    model: 'text-davinci-003',
    prompt: previousAnswer ? `${previousAnswer}\n${question}` : question,
    temperature: 0.8,
    max_tokens: 2048,
  }
  try {
    const res = await openai.createCompletion(requestBody)
    console.log(res.data)
    const answer = res.data.choices[0].text.trim()

    return answer
  } catch (error) {
    return error.message
  }
}

const wechaty = WechatyBuilder.build({
  name: 'wechaty-chatgpt',
  puppet: 'wechaty-puppet-wechat',
  puppetOptions: {
    uos: true,
  },
})

wechaty
  .on('scan', async (qrcode, status) => {
    qrcodeTerminal.generate(qrcode) // 在console端显示二维码
    const qrcodeImageUrl = [
      'https://api.qrserver.com/v1/create-qr-code/?data=',
      encodeURIComponent(qrcode),
    ].join('')
    console.log(qrcodeImageUrl)
  })
  .on('login', (user) => console.log(`User ${user} logged in`))
  .on('logout', (user) => console.log(`User ${user} has logged out`))
  .on('message', async (message) => {
    const contact = message.talker()
    const content = message.text()
    const isText = message.type() === wechaty.Message.Type.Text
    if (message.self() || !isText) {
      return
    }
    console.log(`contact: ${contact} content: ${content}`)
    if (content === 'ding') {
      await contact.say('dong')
    }
    if (content.startsWith('/gpt ')) {
      // const response = await api.sendMessage(content.replace('/c ', ''))
      // TODO 这里写返回值
      try {
        const response = await askQuestion(content.replace('/gpt ', ''))

        await contact.say(response)
      } catch (e) {
        console.error(e)
      }
    }
  })
wechaty
  .start()
  .then(() => console.log('Start to log in wechat...'))
  .catch((e) => console.error(e))
```
