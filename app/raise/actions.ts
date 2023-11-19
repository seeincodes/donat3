'use server'

export interface WorkerRequest {
  name: string
  owner: string
  addresses?: Record<string, string | undefined> | undefined
  texts?: Record<string, string | undefined> | undefined
  contenthash?: string | undefined
  signature: {
    message: string
    hash: string
  }
}

export async function postToCloudflare(requestBody: WorkerRequest) {
  try {
    console.log('in Post to Cloudflare')

    const response = await fetch(
      'https://ens-gateway.seeinplays.workers.dev/set',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    )
    console.log('response', response)

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('Failed to post data:', error)
  }
}
