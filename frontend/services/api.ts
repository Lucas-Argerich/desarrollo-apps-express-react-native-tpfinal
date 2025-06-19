import { authService } from "./auth"

interface ReactNativeFileUpload {
  uri: string
  name: string
  type: string
}

export async function api(uri: string, method: string, data: { [key: string]: any }, files?: { [key: string]: ReactNativeFileUpload}) {
  const token = await authService.getToken()

  const preparsedUri = uri.startsWith('/') ? uri : `/${uri}`
  const parsedUri = preparsedUri.startsWith('/api') ? preparsedUri.split('/api').at(1) : preparsedUri

  let payload: FormData | string

  if (files) {
    const formData = new FormData()
    Object.entries(files).forEach(([key, value]) => {
      // @ts-expect-error: special react native format for form data
      formData.append(key, value)
    })
    formData.append('data', JSON.stringify(data))
    payload = formData
  } else {
    payload = JSON.stringify(data)
  }

  return fetch(`${process.env.EXPO_PUBLIC_API_URL}${parsedUri}`, {
    method,
    headers: {
      'Content-Type': files ? 'multipart/form-data' : 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    },
    body: payload
  })
}