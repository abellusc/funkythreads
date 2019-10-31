import { parentPort, workerData } from 'worker_threads';

/**
 * Runs a sync or async function as a separate thread via Worker. This is the worker.
 */
export async function runTask() {
  const args = workerData.args;
  // encapsulate the function scope to effective rename the function to run
  return await (async () => {
    const run = new Function(`'use strict'; return (${workerData.fn})`) as any;

    return run(...args || []);
  })();
}

runTask()
  .then((result: any) => {
    if (parentPort !== null) {
      const returnBox = `'use strict'; return (${JSON.stringify(result())})`;
      parentPort.postMessage(new Function(returnBox).toString());
    } else {
      throw new ReferenceError('Parent port is undefined.');
    }
  })
  .catch((e) => {
    throw e;
  });
