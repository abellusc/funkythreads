import { Worker } from 'worker_threads';

/**
 * Runs a function in a separate thread.
 * @param fn Function to run in a separate thread. Can be an async function.
 * @returns result of the function after it has been run in the separate thread.
 */
export async function runFunctionAsThread(fn: (...params: any[]) => any | Promise<any>, args?: any[]) {
  return await new Promise((resolve, reject) => {
    const worker = new Worker(require.resolve('./runTask'), { workerData: { fn: fn.toString(), args } });
    worker.on('message', (result) => resolve(new Function(`'use strict'; return (${result})`)()())); // return value is boxed in a function
    worker.on('error', reject);
  });
}
