import { isFunction, isObject } from 'util';
import { parentPort, workerData } from 'worker_threads';

/**
 * Runs a sync or async function as a separate thread via Worker. This is the worker.
 */
export async function runTask() {
  const args = revive(workerData.args);
  // encapsulate the function scope to effective rename the function to run
  return await (async () => {
    // note: syntax/logic errors with user function will show up as this line.
    const run = new Function(`return (${workerData.fn})(${args})`) as any;
    const result = await run();
    return await buildResponse(result);
  })();
}

async function buildResponse(data: any): Promise<any> {
  if (isFunction(data)) {
    return JSON.stringify(await data(), (key, value) => {
      if (isFunction(value)) {
        return buildResponse(value());
      } else {
        return value;
      }
    });
  } else {
    return data;
  }
}

function revive(args: any[]): any[] {
  const ret = [];
  for (const arg of args) {
    try {
      const obj = JSON.parse(arg, (key, value) => {
        if (typeof value === 'string' && (value.includes('function') || value.includes('() =>'))) {
          return new Function(`return (${value})`);
        } else {
          return value;
        }
      });
      ret.push(obj);
    } catch (e) {
      ret.push(arg);
    }
  }

  return ret;
}

runTask()
  .then((result: any) => {
    if (parentPort !== null) {
      const returnBox = `return (${JSON.stringify(result)})`;
      parentPort.postMessage(new Function(returnBox).toString()); // fn box that contains whatever data
    } else {
      throw new ReferenceError('Parent port is undefined.');
    }
  })
  .catch((e) => {
    throw e;
  });
