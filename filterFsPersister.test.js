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
                        "text": "[{\"id\":5878303,\"email\":\"foo\",\"fullname\":\"bar\"},{\"id\":5113096,\"default_wid\":4343687,\"email\":\"foo\",\"fullname\":\"buzz\"}]"
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
                        "text": "[{\"id\":5878303,\"email\":\"email 1\",\"fullname\":\"bar\"},{\"id\":5113096,\"default_wid\":4343687,\"email\":\"email 1\",\"fullname\":\"buzz\"}]"
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
                        "text": "[{\"id\":5878303,\"email\":\"email 1\",\"fullname\":\"fullname 1\"},{\"id\":5113096,\"default_wid\":4343687,\"email\":\"email 1\",\"fullname\":\"fullname 2\"}]"
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
                        "text": "[{\"id\":5878303,\"email\":\"foo\",\"fullname\":\"bar\"},{\"id\":5113096,\"default_wid\":4343687,\"email\":\"foo\",\"fullname\":\"buzz\"}]"
                    }
                }
            },
            {"response": {
                    "content": {
                        "text": "[{\"id\":5878303,\"email\":\"foo\",\"fullname\":\"bar\"},{\"id\":5113096,\"default_wid\":4343687,\"email\":\"fizz\",\"fullname\":\"razz\"}]"
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
                        "text": "[{\"id\":5878303,\"email\":\"email 1\",\"fullname\":\"fullname 1\"},{\"id\":5113096,\"default_wid\":4343687,\"email\":\"email 1\",\"fullname\":\"fullname 2\"}]"
                    }
                }
            },
            {"response": {
                    "content": {
                        "text": "[{\"id\":5878303,\"email\":\"email 1\",\"fullname\":\"fullname 1\"},{\"id\":5113096,\"default_wid\":4343687,\"email\":\"email 2\",\"fullname\":\"fullname 3\"}]"
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
                    "text": "{\"total_currencies\":[{\"currency\":\"SEK\",\"amount\":6086.81}],\"total_count\":129,\"per_page\":50,\"data\":[{\"id\":1601558640,\"user\":\"Busy Person 1\",\"use_stop\":true,\"client\":\"Big client 1\",\"project\":\"Huge project 1\"},{\"id\":1601486085,\"user\":\"Busy Person 2\",\"client\":\"Big client 1\",\"project\":\"Huge project 1\"}]}"
                }
            }
        },
        {
            "response": {
                "content": {
                    "text": "{\"total_currencies\":[{\"currency\":\"SEK\",\"amount\":6086.81}],\"total_count\":129,\"per_page\":50,\"data\":[{\"id\":1601558640,\"user\":\"Busy Person 3\",\"use_stop\":true,\"client\":\"Big client 2\",\"project\":\"Huge project 2\"},{\"id\":1601486085,\"user\":\"Busy Person 2\",\"client\":\"Big client 1\",\"project\":\"Huge project 1\"}]}"
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
                        "text": "{\"total_currencies\":[{\"currency\":\"SEK\",\"amount\":6086.81}],\"total_count\":129,\"per_page\":50,\"data\":[{\"id\":1601558640,\"user\":\"user 1\",\"use_stop\":true,\"client\":\"client 1\",\"project\":\"project 1\"},{\"id\":1601486085,\"user\":\"user 2\",\"client\":\"client 1\",\"project\":\"project 1\"}]}"
                    }
                }
            },
            {
                "response": {
                    "content": {
                        "text": "{\"total_currencies\":[{\"currency\":\"SEK\",\"amount\":6086.81}],\"total_count\":129,\"per_page\":50,\"data\":[{\"id\":1601558640,\"user\":\"user 3\",\"use_stop\":true,\"client\":\"client 2\",\"project\":\"project 2\"},{\"id\":1601486085,\"user\":\"user 2\",\"client\":\"client 1\",\"project\":\"project 1\"}]}"
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
                        "text": "{\"data\":[{\"title\":{\"project\":\"project 1\",\"client\":\"client 1\"},\"items\":[{\"title\":{\"user\":\"user 1\"}}]},{\"title\":{\"project\":\"project 1\",\"client\":\"client 1\"},\"items\":[{\"title\":{\"user\":\"user 2\"}},{\"title\":{\"user\":\"user 1\"}}]}]}"
                    }
                }
            }
        ]
    }
}



describe('filter data', () => {

    it('does nothing without options', () =>{
        const persister = new FilterFsPersister(new MockPolly())
        expect(persister.filterRecording(oneEntryIn)).to.eql(oneEntryIn)
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
})
