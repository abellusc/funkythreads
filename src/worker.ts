import { workerData, parentPort } from 'worker_threads';

/**
 * Runs a sync or async function as a separate thread via Worker. This is the worker.
 */
export async function runTask() {
  let result: any;
  if (workerData.taskFn.then !== undefined) {
    // task is an async function
    result = await workerData.taskFn(...{ ...workerData, taskFn: undefined });
  } else {
    result = workerData.taskFn(...{ ...workerData, taskFn: undefined });
  }

  if (parentPort !== null) {
    parentPort.postMessage(result);
  } else {
    throw new ReferenceError('Parent port is undefined.');
  }
}

runTask();
