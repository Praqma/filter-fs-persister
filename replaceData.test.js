'use strict'

const replaceData = require('./replaceData')
const expect = require('chai').expect

let withAuthToken = {
    "request": {
        "url": "testUrl",
        "headers": [
            {
                "name": "authorization",
                "value": "A very secret token"
            }
        ]
    }
}

let filteredAuthToken = {
    "request": {
        "url": "testUrl",
        "headers": [
            {
                "name": "authorization",
                "value": "Test token"
            }
        ],
    }
}

let withRealId = {

    "request": {
        "queryString": [
            {
                "name": "user_id",
                "value": "real_id"
            }
        ],
    }
}
let withTestId = {
    "request": {
        "queryString": [
            {
                "name": "user_id",
                "value": "test id"
            }
        ],
    }
}
let secretURL = {
    "request": {
        "url": "a very secret url with my user_id"
    }
}
let testUrl = {
    "request": {
        "url": "testUrl"
    }
}


describe('replaceData', () => {

    it('can filter out request headers', () => {
        let options = {request: {headers: {authorization: 'Test token'}}}
        let data = replaceData(withAuthToken, options)
        expect(data).to.eql(filteredAuthToken)
    })
    it('can filter out request parameters', () => {
        let options = {request: {queryString: {user_id: 'test id'}}}
        let data = replaceData(withRealId, options)
        expect(data).to.eql(withTestId)
    })
    it('can set another url', () => {
        let options = {request: {url: 'testUrl'}}
        let data = replaceData(secretURL, options)
        expect(data).to.eql(testUrl)
    })
})
