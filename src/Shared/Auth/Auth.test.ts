import { describe, it, expect } from 'vitest'
import session from 'supertest'
import serverTest from './testHelpers/serverTest.help.js'
import { Auth } from './Auth.js'
import { setUserToken, getUserToken, setAdminToken, getAdminToken } from '../../../test/testHelpers/testStore.help.js'
const agent = session(serverTest)

describe('"Auth" class. Jsonwebtoken middlewares. Unit tests.', () => {
  describe('Auth.generateToken, Auth.verifyToken. ', () => {
    it('should generate a JWT and allow access through the verifyToken middleware and set the userInfo object (req.useInfo)', async () => {
      const user = { id: '123', email: 'userexample@test.com', role: 'User', otherField: 'other' }
      const token = Auth.token(user)
      setUserToken(token)
      const test = await agent
        .post('/')
        .send({ user })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
      expect(test.body.success).toBe(true)
      expect(test.body.message).toBe('Passed middleware')
      expect(test.body.data).toEqual({ user })
      expect(test.body.userInfo).toEqual({ userId: '123', userRole: 1 })// through decoded
    })
    it('should return 401 if no token is provided', async () => {
      const user = { id: '123', email: 'userexample@test.com', role: 1, otherField: 'other' }
      const token = getUserToken()
      const test = await agent
        .post('/')
        .send({ user })
      // .set('Authorization', `Bearer ${token}`)
        .expect(401)
      expect(test.body.success).toBe(false)
      expect(test.body.message).toBe('Unauthorized access. Token not provided')
      expect(test.body.data).toBe(null)
    })
    it('should return 401 if token is missing after Bearer', async () => {
      const user = { id: '123' }
      const token = getUserToken()
      const test = await agent
        .post('/')
        .send({ user })
        .set('Authorization', 'Bearer ')
        .expect(401)
      expect(test.body.success).toBe(false)
      expect(test.body.message).toBe('Missing token!')
      expect(test.body.data).toBe(null)
    })
    it('should return 401 if token is invalid', async () => {
      const user = { id: '123' }
      const test = await agent
        .post('/')
        .send({ user })
        .set('Authorization', 'Bearer ñasdijfasdfjoasdiieieiehoifdoiidoioslsleoiudoisosdfhoi')
        .expect(401)
      expect(test.body.success).toBe(false)
      expect(test.body.message).toBe('Invalid token')
      expect(test.body.data).toBe(null)
    })
    it('should return 401 if token is expired', async () => {
      const user = { id: '123', email: 'userexample@test.com', role: 'User', otherField: 'other' }
      const expiredToken = Auth.token(user, 1)
      // Esperamos 2 segundos para asegurarnos de que expire
      await new Promise(resolve => setTimeout(resolve, 3000))
      const test = await agent
        .post('/')
        .send({ user })
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401)
      expect(test.body.success).toBe(false)
      expect(test.body.message).toBe('Expired token')
      expect(test.body.data).toBe(null)
    })
  })
  describe('Auth.checkRole', () => {
    it('should allow access if user has an allowed role', async () => {
      const user = { id: '123', email: 'userexample@test.com', role: 'User', otherField: 'other' }
      const token = Auth.token(user)
      setUserToken(token)
      const test = await agent
        .post('/roleUser')
        .send({ user })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
      expect(test.body.success).toBe(true)
      expect(test.body.message).toBe('Passed middleware')
      expect(test.body.data).toEqual({ user })
      expect(test.body.userInfo).toEqual({ userId: '123', userRole: 1 })
    })
    it('should return 403 and deny access if user does not have an allowed role', async () => {
      const user = { id: '123', email: 'userexample@test.com', role: 'Admin', otherField: 'other' }
      const token = Auth.token(user)
      setUserToken(token)
      const test = await agent
        .post('/roleUser')
        .send({ user })
        .set('Authorization', `Bearer ${token}`)
        .expect(403)
      expect(test.body.success).toBe(false)
      expect(test.body.message).toBe('Access forbidden!')
      expect(test.body.data).toBe(null)
      expect(test.body.userInfo).toBe(undefined)
    })
  })
})
