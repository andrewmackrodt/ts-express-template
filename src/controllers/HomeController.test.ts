import { createServer } from '../../index'
import { create } from '../mixins/JsonObject'
import { UserInfo } from '../models/UserInfo'
import { UserInfoRepository } from '../repositories/UserInfoRepository'
import * as request from 'supertest'
import { container } from 'tsyringe'

describe('Test HomeController', () => {
    it('Get / should return 200', async () => {
        const userInfo = create(UserInfo, {
            requestTime: '2021-01-31T06:06:49.494Z',
            ip: '127.0.0.1',
            userAgent: 'jest',
        })

        const mockGet = jest.fn()
        mockGet.mockReturnValue(userInfo)
        container.registerInstance(UserInfoRepository, { getFromRequest: mockGet })

        const res = await request(createServer().app).get('/').send()
        expect(res.status).toBe(200)
        expect(mockGet).toBeCalled()
        expect(res.body).toEqual(userInfo.toJson({ transformCase: 'snake' }))
    })
})
