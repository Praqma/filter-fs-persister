const express = require('express')
const app = express()
const port = 3001
const path = require('path');
const fetch = require("node-fetch");
const expect = require('chai').expect

const NodeAdapter = require('@pollyjs/adapter-node-http');
const FilterFsPersister = require('./filterFsPersister.js')
const { Polly, setupMocha: setupPolly } = require('@pollyjs/core');
Polly.register(NodeAdapter);
Polly.register(FilterFsPersister);

describe("FilterFsPersister",()=>{
    let server
    before(async ()=>{

        app.get('/', (req, res) => {
            res.send('Hello World!')
        })

        server = await app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`)
        })
    })

    after(async ()=>{
        server.close()
    })


    setupPolly({
        adapters: ['node-http'],
        persister: 'filter-fs',
        recordIfMissing: false,
        recordFailedRequests: false,
        matchRequestsBy: {
            order:false,
            url: {
                port:true
            }
        },
        persisterOptions: {
            'filter-fs': {
                recordingsDir: path.resolve(__dirname, './recordings'),
                filter: ['fullname','email','user', 'client', 'name','project', 'task','description'],
                substitute:{request: {headers: {authorization: 'Test token'}}}
            }
        }
    });
    it('records a get', async ()=>{
        let data
        await fetch('http://localhost:3001/').then(response => response.text())
            .then(d => data = d);
        expect(data).to.eql('Hello World!')
    })
    it('records another get', async ()=>{
        let data
        await fetch('http://localhost:3001/',{headers:{authorization:'secret token' }}).then(response => response.text())
            .then(d => data = d);
        await fetch('http://localhost:3001/',{headers:{authorization:'another token' }}).then(response => response.text())
            .then(d => data = d);
        expect(data).to.eql('Hello World!')
    })


})