import { authService } from './auth'

interface ReactNativeFileUpload {
  uri: string
  name: string
  type: string
}

// API endpoint types based on backend routes
type AuthEndpoints = 
  | '/auth/initial-register'
  | '/auth/verify-registration-code'
  | '/auth/complete-registration'
  | '/auth/login'
  | '/auth/request-reset'
  | '/auth/verify-token'
  | '/auth/reset-password'
  | '/auth/user'

type RecipeEndpoints = 
  | '/recipes'
  | '/recipes/:id'
  | '/recipes/:id/reviews'
  | '/recipes/:id/favorites'
  | '/recipes/:id/favorites/check'
  | '/recipes/user/favorites'

type CourseEndpoints = 
  | '/courses'
  | '/courses/:id'
  | '/courses/:id/register'
  | '/courses/user/subscribed'

type ResourceEndpoints = 
  | '/resources/ingredients'
  | '/resources/utensils'

type SearchEndpoints = 
  | '/search'

export type ApiEndpoints = AuthEndpoints | RecipeEndpoints | CourseEndpoints | ResourceEndpoints | SearchEndpoints

type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export async function api(
  uri: ApiEndpoints,
  method: ApiMethod,
  options: {
    params?: { [key: string]: string | number }
    query?: { [key: string]: string | number }
    data?: { [key: string]: any }
    files?: { [key: string]: ReactNativeFileUpload }
    signal?: AbortSignal
  } = {}
) {
  const { params, data, files, query, signal } = options

  const token = await authService.getToken()

  let parsedUri = uri.startsWith('/')
    ? uri
    : `/${uri}`

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      parsedUri = parsedUri.replace(`:${key}`, String(value))
    })
  }
  
  if (query) {
    const searchParams = new URLSearchParams() 
    Object.entries(query).forEach(([key, value]) => {
      searchParams.append(key, String(value))
    })
    parsedUri += `?${searchParams.toString()}`
  }

  console.log('Requesting API:', method, parsedUri)

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

  return await fetch(`${process.env.EXPO_PUBLIC_API_URL}${parsedUri}`, {
    method,
    headers: {
      'Content-Type': files ? 'multipart/form-data' : 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    },
    body: data ? payload : undefined,
    signal
  })
}
