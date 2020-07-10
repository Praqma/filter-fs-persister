# FilterFsPersister

This is a persister to be used with https://github.com/Netflix/pollyjs/. 

## Purpose
To filter out sensitive data from your recordings not to store them in version-control.

## Function
The sensitive words will be replaced with their key suffixed with the order they appear in.

``` [{user: Foo, email: bar}{user: Foo, email: baz}]``` 

is turned into


``` [{user: user 1, email: email 1}{user: user 1, email: email 2}]``` 


## Prerequisites

The persister will look in each ``log.entries`` for ``response.content.text`` The text should be JSON as a string. 

The persister will then traverse the data and replace everything with one of the defined keys. 


## Use

There is one option to add to the persister-options:

- Filter, is an array of words to filter out

Register the persister with Polly.js the same way as FSPersister, but with the ``filter``option and ``filter-fs``as ``id``.

```
 Polly.register(NodeAdapter);
 Polly.register(FilterFsPersister);

 setupPolly({
   adapters: ['node-http'],
   persister: 'filter-fs',
   recordIfMissing: false,
   recordFailedRequests: false,
   persisterOptions: {
     'filter-fs': {
        recordingsDir: path.resolve(__dirname, '../recordings'),
        filter:['user', 'email','name', 'fullname']
      }
    }
 });
```