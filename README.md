# funkythreads

[![CircleCI](https://circleci.com/gh/digitalkitten/funkythreads.svg?style=svg)](https://circleci.com/gh/digitalkitten/funkythreads) [![npm version](https://badge.fury.io/js/funkythreads.svg)](https://badge.fury.io/js/funkythreads) 

A simple library for running a CPU-intensive sync function inside a worker thread without having to create a module. This library leverages dynamic code evaluation (via `new Function`) to allow you to pass a function and have it dynamically evaluated inside another thread. All evaluation logic happens inside the other thread, so there is little performance loss.

This is a very basic library with limited features. 

## Installation and Usage

**This module requires that you use v11.0.0+ to leverage the currently experimental features of worker threads.**

### Installation
```
npm install funkythreads
```
To use this library, import `funkythreads`:

\>= ES6:
```js
import * as funkythreads from 'funkythreads'
```

or 

< ES6
```js
const funkythreads = require('funkythreads');
```

then, use one of the available functions.

### runFunctionAsThread
This function runs the provided function in a new thread.

```typescript
const result = await funkythreads.runFunctionAsThread(function run(){
  return 123;
});

console.log(result); // 123
```

### Limitations
1. You cannot return a promise. You can use promises in your handler code, but all promises must resolve before returning. The other thread will make no attempt to resolve your promises. This also means no async functions, because async functions are self-resolving promises.

2. If the main thread closes, the worker threads are not guaranteed to close like child processes are.

3. This library makes no attempt to create a thread pool or scheduler.

4. Worker thread has no shared memory with the main thread. This effectively means that you cannot `require` something in the main thread and import it into the worker thread. This library is intended for pure functions without external dependencies.

## Contributing
If you would like to contribute to this project, feel free to do so on Github by:
1. Creating a fork;
2. Making your changes;
3. Opening a Pull Request for your changes to be merged in.

Note: Linting rules can change at any time.

## Issues
If you have a bug, file an issue on Github and it will be addressed in due time. Anybody is welcome to fix bugs found in issues, just submit a PR with your fix.

## Planned Features
- Async Function Handlers
- Thread Pools
- Scheduling (wait for thread)
- Emitter Threads (thread functions that emit values over time)

**Acceptance Criteria**
Any PR submission must meet these criteria:
- Must pass all unit tests
- Must have 100% coverage
- Must pass all linting tests
- Must be written using Typescript with no rules disabled (make a PR for a linting rule change if you want though)