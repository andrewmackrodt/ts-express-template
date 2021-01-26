import { createServer } from '../../index'
import { UserInfoRepository } from '../repositories/UserInfoRepository'
import * as request from 'supertest'
import { container } from 'tsyringe'

describe('Test HomeController', () => {
    it('Get / should return 200', async () => {
        const mockGet = jest.fn()
        const expected = {
            ip: '127.0.0.1',
            user_agent: 'jest',
        }
        mockGet.mockReturnValue(expected)

        container.registerInstance(UserInfoRepository, {
            getFromRequest: mockGet,
        })

        const res = await request(createServer().app)
            .get('/')
            .send()

        expect(res.status).toBe(200)
        expect(mockGet).toBeCalled()
        expect(res.body).toEqual(expected)
    })
})
