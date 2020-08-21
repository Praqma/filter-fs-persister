'use strict'

const FilterFsPersister = require('./filterFsPersister.js')
const expect = require('chai').expect

class MockPolly {
    constructor(persisterOptions = {}) {
        this.config = {
            persisterOptions: {
                'filter-fs': persisterOptions || {} }
        };
    }
}


let oneEntryIn = {
    "log": {
        "entries": [
            {"response": {
                    "content": {
                        "mimeType": "application/json; charset=utf-8",
                        "text": "[{\"email\":\"foo\",\"fullname\":\"bar\"},{\"email\":\"foo\",\"fullname\":\"buzz\"}]"
                    }
                }
            }
        ]
    }
}

let replaceNothing = {
    "log": {
        "entries": [
            {"response": {
                    "content": {
                        "mimeType": "application/json; charset=utf-8",
                        "text": "[{\"email\":\"foo\",\"fullname\":\"bar\"},{\"email\":\"foo\",\"fullname\":\"buzz\"}]"
                    }
                }
            }
        ]
    }
}



let onlyReplaceEmail = {
    "log": {
        "entries": [
            {"response": {
                    "content": {
                        "mimeType": "application/json; charset=utf-8",
                        "text": "[{\"email\":\"email 1\",\"fullname\":\"bar\"},{\"email\":\"email 1\",\"fullname\":\"buzz\"}]"
                    }
                }
            }
        ]
    }
}
let replaceEmailAndFullname = {
    "log": {
        "entries": [
            {"response": {
                    "content": {
                        "mimeType": "application/json; charset=utf-8",
                        "text": "[{\"email\":\"email 1\",\"fullname\":\"fullname 1\"},{\"email\":\"email 1\",\"fullname\":\"fullname 2\"}]"
                    }
                }
            }
        ]
    }
}
let twoEntries = {
    "log": {
        "entries": [
            {"response": {
                    "content": {
                        "mimeType": "application/json; charset=utf-8",
                        "text": "[{\"email\":\"foo\",\"fullname\":\"bar\"},{\"email\":\"foo\",\"fullname\":\"buzz\"}]"
                    }
                }
            },
            {"response": {
                    "content": {
                        "mimeType": "application/json; charset=utf-8",
                        "text": "[{\"email\":\"foo\",\"fullname\":\"bar\"},{\"email\":\"fizz\",\"fullname\":\"razz\"}]"
                    }
                }
            }
        ]
    }
}
let twoEntriesOut = {
    "log": {
        "entries": [
            {"response": {
                    "content": {
                        "mimeType": "application/json; charset=utf-8",
                        "text": "[{\"email\":\"email 1\",\"fullname\":\"fullname 1\"},{\"email\":\"email 1\",\"fullname\":\"fullname 2\"}]"
                    }
                }
            },
            {"response": {
                    "content": {
                        "mimeType": "application/json; charset=utf-8",
                        "text": "[{\"email\":\"email 1\",\"fullname\":\"fullname 1\"},{\"email\":\"email 2\",\"fullname\":\"fullname 3\"}]"
                    }
                }
            }
        ]
    }
}

let timeEntries = {
    "log": {
    "entries": [
        {
            "response": {
                "content": {
                    "mimeType": "application/json; charset=utf-8",
                    "text": "{\"user\":\"Busy Person 1\",\"data\":[{\"user\":\"Busy Person 1\",\"client\":\"Big client 1\",\"project\":\"Huge project 1\"},{\"user\":\"Busy Person 2\",\"client\":\"Big client 1\",\"project\":\"Huge project 1\"}]}"
                }
            }
        },
        {
            "response": {
                "content": {
                    "mimeType": "application/json; charset=utf-8",
                    "text": "{\"data\":[{\"user\":\"Busy Person 3\",\"client\":\"Big client 2\",\"project\":\"Huge project 2\"},{\"user\":\"Busy Person 2\",\"client\":\"Big client 1\",\"project\":\"Huge project 1\"}]}"
                }
            }
        }
]
}
}
let timeEntriesOut = {
    "log": {
        "entries": [
            {
                "response": {
                    "content": {
                        "mimeType": "application/json; charset=utf-8",
                        "text": "{\"user\":\"user 1\",\"data\":[{\"user\":\"user 1\",\"client\":\"client 1\",\"project\":\"project 1\"},{\"user\":\"user 2\",\"client\":\"client 1\",\"project\":\"project 1\"}]}"
                    }
                }
            },
            {
                "response": {
                    "content": {
                        "mimeType": "application/json; charset=utf-8",
                        "text": "{\"data\":[{\"user\":\"user 3\",\"client\":\"client 2\",\"project\":\"project 2\"},{\"user\":\"user 2\",\"client\":\"client 1\",\"project\":\"project 1\"}]}"
                    }
                }
            }
        ]
    }
}

let deepNested = {
    "log": {
        "entries": [
            {
                "response": {
                    "content": {
                        "mimeType": "application/json; charset=utf-8",
                        "text": "{\"data\": [{\"title\": {\"project\": \"Project 1\",\"client\": \"Customer 1\"},\"items\":[{\"title\": {\"user\": \"Person 1\"}}]},{\"title\": {\"project\": \"Project 1\",\"client\": \"Customer 1\"},\"items\": [{\"title\": {\"user\": \"Person 2\"}},{\"title\": {\"user\": \"Person 1\"}}]}]}"
                    }
                }
            }
            ]
    }
}
let deepNestedOut = {
    "log": {
        "entries": [
            {
                "response": {
                    "content": {
                        "mimeType": "application/json; charset=utf-8",
                        "text": "{\"data\":[{\"title\":{\"project\":\"project 1\",\"client\":\"client 1\"},\"items\":[{\"title\":{\"user\":\"user 1\"}}]},{\"title\":{\"project\":\"project 1\",\"client\":\"client 1\"},\"items\":[{\"title\":{\"user\":\"user 2\"}},{\"title\":{\"user\":\"user 1\"}}]}]}"
                    }
                }
            }
        ]
    }
}

let keywordWithArray = {"log": {
    "entries": [
        {
            "response": {
                "content": {
                    "mimeType": "application/json; charset=utf-8",
                    "text": "{\"data\":[\"foo\"]}"
                }
            }
        }
    ]
}
}
let keywordWithArrayOut = {"log": {
        "entries": [
            {
                "response": {
                    "content": {
                            "mimeType": "application/json; charset=utf-8",
                        "text": "{\"data\":[\"foo\"]}"
                    }
                }
            }
        ]
    }
}
let errorHTMLAsJSON = {"log": {
        "entries": [
            {
                "response": {
                    "content": {
                        "mimeType": "application/json; charset=utf-8",
                        "text": "<html><body>Error!</body></html>"
                    }
                }
            }
        ]
    }
}

let errorHTMLAsHTMLIn = {"log": {
        "entries": [
            {
                "response": {
                    "content": {
                        "mimeType": "text/html; charset=utf-8",
                        "text": "<html><body>Error!</body></html>"
                    }
                }
            }
        ]
    }
}
let errorHTMLAsHTMLOut = {"log": {
        "entries": [
            {
                "response": {
                    "content": {
                        "mimeType": "text/html; charset=utf-8",
                        "text": "<html><body>Error!</body></html>"
                    }
                }
            }
        ]
    }
}
describe('filter data', () => {

    it('does nothing without options', () =>{
        const persister = new FilterFsPersister(new MockPolly())
        expect(persister.filterRecording(oneEntryIn)).to.eql(replaceNothing)
    })
    it('filter email and use same replacement if value is the same ', () =>{
        let options = {filter: ['email']}
        const persister = new FilterFsPersister(new MockPolly(options))

        expect(persister.filterRecording(oneEntryIn)).to.eql(onlyReplaceEmail)
    })
    it('filter email and fullname', () =>{
        let options = {filter: ['email', 'fullname']}
        const persister = new FilterFsPersister(new MockPolly(options))
        expect(persister.filterRecording(oneEntryIn)).to.eql(replaceEmailAndFullname)
    })
    it('filter email and fullname for two entries', () =>{
        let options = {filter: ['email', 'fullname']}
        const persister = new FilterFsPersister(new MockPolly(options))
        expect(persister.filterRecording(twoEntries)).to.eql(twoEntriesOut)
    })
    it('filters client, user and project for with a path to the sensitive data', () =>{
        let options = {filter: ['client', 'project', 'user'], path:'data'}
        const persister = new FilterFsPersister(new MockPolly(options))
        expect(persister.filterRecording(timeEntries)).to.eql(timeEntriesOut)
    })
    it('filters when nested differently', () =>{
        let options = {filter: ['client', 'project', 'user'], path:'data'}
        const persister = new FilterFsPersister(new MockPolly(options))
        expect(persister.filterRecording(deepNested)).to.eql(deepNestedOut)
    })
    it('only replaces strings', () =>{
        let options = {filter: ['data']}
        const persister = new FilterFsPersister(new MockPolly(options))
        expect(persister.filterRecording(keywordWithArray)).to.eql(keywordWithArrayOut)
    })
    it('throws a nice error when trying to parse non JSON claimed to be JSON', () =>{
        let options = {filter: ['data']}
        const persister = new FilterFsPersister(new MockPolly(options))
        try{
            persister.filterRecording(errorHTMLAsJSON)
            throw new Error('This error should not be thrown')
        }catch(error){
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.eql("<html><body>Error!</... can not be parsed as JSON!")
        }
    })
    it('do not modify HTML', () =>{
        let options = {filter: ['data']}
        const persister = new FilterFsPersister(new MockPolly(options))
        expect(persister.filterRecording(errorHTMLAsHTMLIn)).to.eql(errorHTMLAsHTMLOut)
    })
})
