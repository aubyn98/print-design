export const isDev = process.env.NODE_ENV === 'development'

export const API_ADDRESS = {
  dev: 'http://192.168.42.106:8080',
  pro: 'http://192.168.42.200:8080',
}

export const TENANT_SECRET_KEY = ''
export const baseURL = API_ADDRESS[isDev ? 'dev' : 'pro']
