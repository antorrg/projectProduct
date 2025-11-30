import dotenv from 'dotenv'

const ENV_FILE = {
  production: '.env.production',
  development: '.env.development',
  test: '.env.test'
} as const
type Environment = keyof typeof ENV_FILE
const NODE_ENV = (process.env.NODE_ENV as Environment) ?? 'production'

dotenv.config({ path: ENV_FILE[NODE_ENV] })

const getNumberEnv = (key: string, defaultValue: number): number => {
  const parsed = Number(process.env[key])
  return isNaN(parsed) ? defaultValue : parsed
}
const getStringEnv = (key: string, defaultValue: string): string => {
  return process.env[key] ?? defaultValue
}
const envConfig = {
  Port: getNumberEnv('PORT', 3000),
  Status: NODE_ENV,
  UserImg: getStringEnv('USER_IMG', ''),
  DatabaseUrl: getStringEnv('DATABASE_URL', ''),
  Secret: getStringEnv('JWT_SECRET', ''),
  ExpiresIn: getStringEnv('JWT_EXPIRES_IN', '1')
}
export default envConfig
