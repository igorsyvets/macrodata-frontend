const makePerplexityRequest = async (text: string) => {
  const url = 'https://api.perplexity.ai/chat/completions'
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.REACT_APP_PERPLEXITY_API_KEY}`, // Fetch from your project's environment variables
  }
  const body = {
    model: 'sonar',
    stream: false,
    max_tokens: 2048,
    frequency_penalty: 1,
    temperature: 0.0,
    messages: [
      //   {
      //     role: 'system',
      //     content: 'Be precise and concise in your responses.',
      //   },
      {
        role: 'user',
        content: text,
      },
    ],
  }

  return fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('perplexity data', data)
      const stop_reason = data.choices[0].finish_reason
      if (stop_reason !== 'stop') {
        console.error('Perplexity did not finish properly:', stop_reason)
        //return []
      }

      return data.choices[0].message.content
    })
    .catch((error) => console.error('Error:', error))
}

export default makePerplexityRequest
