'use strict'

const DataFilter = require('./dataFilter.js')
const expect = require('chai').expect

let oneEntryIn = {
    "log": {
        "entries": [
            {
                "response": {
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
            {
                "response": {
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
            {
                "response": {
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
            {
                "response": {
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
            {
                "response": {
                    "content": {
                        "mimeType": "application/json; charset=utf-8",
                        "text": "[{\"email\":\"foo\",\"fullname\":\"bar\"},{\"email\":\"foo\",\"fullname\":\"buzz\"}]"
                    }
                }
            },
            {
                "response": {
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
            {
                "response": {
                    "content": {
                        "mimeType": "application/json; charset=utf-8",
                        "text": "[{\"email\":\"email 1\",\"fullname\":\"fullname 1\"},{\"email\":\"email 1\",\"fullname\":\"fullname 2\"}]"
                    }
                }
            },
            {
                "response": {
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

let keywordWithArray = {
    "log": {
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
let keywordWithArrayOut = {
    "log": {
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
let errorHTMLAsJSON = {
    "log": {
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

let errorHTMLAsHTMLIn = {
    "log": {
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
let errorHTMLAsHTMLOut = {
    "log": {
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

let withAuthToken = {
    "log": {
        "entries": [
            {
                "request": {
                    "headers": [
                        {
                            "name": "authorization",
                            "value": "A very secret token"
                        }
                    ]
                },
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
let filteredAuthToken = {
    "log": {
        "entries": [
            {
                "request": {
                    "headers": [
                        {
                            "name": "authorization",
                            "value": "Test token"
                        }
                    ],
                },
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
let withRealId = {
    "log": {
        "entries": [
            {
                "request": {
                    "queryString": [
                        {
                            "name": "user_id",
                            "value": "real_id"
                        }
                    ],
                    "url": "the url"
                },
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
let withTestId = {
    "log": {
        "entries": [
            {
                "request": {
                    "queryString": [
                        {
                            "name": "user_id",
                            "value": "test id"
                        }
                    ],
                    "url": "the url"
                },
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
let secretURL = {
    "log": {
        "entries": [
            {
                "request": {
                    "url": "a very secret url with my user_id"
                },
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
let testUrl = {
    "log": {
        "entries": [
            {
                "request": {
                    "url": "testUrl"
                },
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


describe('DataFilter', () => {

    it('does nothing with   out options', () => {
        const dataFilter = new DataFilter({})
        expect(dataFilter.filterData(oneEntryIn)).to.eql(replaceNothing)
    })
    it('filter email and use same replacement if value is the same ', () => {
        let options = {filter: ['email']}
        const dataFilter = new DataFilter(options)
        expect(dataFilter.filterData(oneEntryIn)).to.eql(onlyReplaceEmail)
    })
    it('filter email and fullname', () => {
        let options = {filter: ['email', 'fullname']}
        const dataFilter = new DataFilter(options)
        expect(dataFilter.filterData(oneEntryIn)).to.eql(replaceEmailAndFullname)
    })
    it('filter email and fullname for two entries', () => {
        let options = {filter: ['email', 'fullname']}
        const dataFilter = new DataFilter(options)
        expect(dataFilter.filterData(twoEntries)).to.eql(twoEntriesOut)
    })
    it('filters client, user and project for with a path to the sensitive data', () => {
        let options = {filter: ['client', 'project', 'user']}
        const dataFilter = new DataFilter(options)
        expect(dataFilter.filterData(timeEntries)).to.eql(timeEntriesOut)
    })
    it('filters when nested differently', () => {
        let options = {filter: ['client', 'project', 'user']}
        const dataFilter = new DataFilter(options)
        expect(dataFilter.filterData(deepNested)).to.eql(deepNestedOut)
    })
    it('only replaces strings', () => {
        let options = {filter: ['data']}
        const dataFilter = new DataFilter(options)
        expect(dataFilter.filterData(keywordWithArray)).to.eql(keywordWithArrayOut)
    })
    it('throws a nice error when trying to parse non JSON claimed to be JSON', () => {
        let options = {filter: ['data']}
        const dataFilter = new DataFilter(options)
        try {
            dataFilter.filterData(errorHTMLAsJSON)
            throw new Error('This error should not be thrown')
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.eql("<html><body>Error!</... can not be parsed as JSON!")
        }
    })
    it('do not modify HTML', () => {
        let options = {filter: ['data']}
        const dataFilter = new DataFilter(options)
        expect(dataFilter.filterData(errorHTMLAsHTMLIn)).to.eql(errorHTMLAsHTMLOut)
    })
})
