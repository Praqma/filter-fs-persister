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

If the sensitive data is in a sub-level of ``text``, use the ``path`` option to go one level deeper.



## Use

There are two options to add to the persister-options:

- Filter, is an array of words to filter out
- Path, is a way to look one step deeper into the text object.

Register the persister with Polly.js the same way as FSPersister, but with extra options and ``filter-fs``as ``id``.

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
        filter:['user', 'email','name', 'fullname'],
        path: 'items'
      }
    }
 });
```