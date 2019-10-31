import { Worker } from 'worker_threads';

/**
 * Runs a function in a separate thread.
 * @param fn Function to run in a separate thread. Can be an async function.
 * @returns result of the function after it has been run in the separate thread.
 */
export async function runFunctionAsThread(fn: (...params: any) => any, args?: any[]) {
  return await new Promise((resolve, reject) => {
    if ((fn as any).then) { throw new TypeError('Async functions are not allowed.'); }
    const worker = new Worker(require.resolve('./runTask'), {
        workerData: { fn: fn.toString(), args },
    });
    worker.stdout.pipe(process.stdout);
    worker.stderr.pipe(process.stderr);

    worker.on('message', (result) => (
      resolve(new Function(`'use strict'; return (${result})`)()())), // dynamic code execution is dangerous
    ); // return value is boxed in a function
    worker.on('error', reject);
  });
}
