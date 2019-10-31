import { Worker } from 'worker_threads';

/**
 * Runs a function in a separate thread.
 * @param fn Function to run in a separate thread.
 * @returns result of the function after it has been run in the separate thread.
 */
export async function runFunctionAsThread(fn: (...params: any[]) => any | Promise<any>) {
  return await new Promise((resolve, reject) => {
    const worker = new Worker(require.resolve('./worker'), { workerData: { fn } });
    worker.on('message', resolve);
    worker.on('error', reject);
  });
}