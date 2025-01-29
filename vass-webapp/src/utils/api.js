const API_BASE_URL = 'http://localhost:8000/api' // Change this to your API base URL

export const apiRequest = async (
  endpoint,
  method = 'GET',
  body = null,
  customHeaders = {}
) => {
  const token =
    sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token') // Get token

  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}` // Attach token to request
  }

  // Ensure GET requests do not include a body
  const options = {
    method,
    headers,
    ...(body && method !== 'GET' ? { body: JSON.stringify(body) } : {}), // Exclude body in GET requests
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, options)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return await response.json() // Return parsed JSON response
  } catch (error) {
    console.error(`API Request Failed: ${error.message}`)
    throw error
  }
}
