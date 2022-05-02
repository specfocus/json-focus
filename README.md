# json-focus
*JSON schema, validation and serialization*

Many of the JSON related libraries used today seem obsolete or unperformant or incomplete, uninspiring.

Therefore this library proposes on-stop shop with all the useful tools we need when dealing with JSON.

 1. Schema builder (code helpers)
 2. Schema validation
 3. Schema generation from JavaScript object(s)
 4. Schema import from JSON schema
 5. Schema export to JSON schema
 6. Typescript definition generation from schema
 7. Async read from a stream (single JSON, item by item)
 8. Async write to a stream (single JSON array, item by item)
 9. Async read stream of JSON (multiple JSON objects, one by one)
10. Async write stream of JSON (multiple JSON objects, one by one)
11. Uses the action specs defined in main-focus

a. The newly implemented functionality will is based in async, await, Promise, AsyncGenerator, AsyncIterable, AsyncIterableIterator, AsyncIterator.

b. No callback is used.
