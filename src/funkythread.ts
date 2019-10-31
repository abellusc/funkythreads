import { isArrowFunctionExpression, isFunction, isFunctionExpression, valueToNode } from '@babel/types';
import { isObject, isPrimitive } from 'util';
import { Worker } from 'worker_threads';

/**
 * Runs a function in a separate thread.
 * @param fn Function to run in a separate thread. Can be an async function.
 * @returns result of the function after it has been run in the separate thread.
 */
export async function runFunctionAsThread(fn: (...params: any) => any, ...args: any[]) {
  return await new Promise((resolve, reject) => {
    if ((fn as any).then) { throw new TypeError('Async functions are not allowed.'); }
    // build the args into a transportable type
    const built: any[] = buildArgs(args);
    const worker = new Worker(require.resolve('./runTask'), {
        workerData: { fn: fn.toString(), args: built },
    });
    worker.stdout.pipe(process.stdout);
    worker.stderr.pipe(process.stderr);

    worker.on('message', (result) => (
      resolve(
        reviveResponse(new Function(`'use strict'; return (${result})`)()()), // revive the unboxed response
      )
    )); // return value is boxed in a function
    worker.on('error', reject);
  });
}

function reviveResponse(data: any) {
  if (typeof data === 'string' && data[0] === '{') {
    return JSON.parse(data, (key, value) => {
      // revive functions
      if (typeof value === 'string' && (value.includes('function') || value.includes('() =>'))) {
        return new Function(`return (${value})`);
      } else {
        return value;
      }
    });
  } else {
    return data;
  }
}

// builds the arguments in a way that is transportable without loss
function buildArgs(args: any[]): any[] {
  const ret = [];
  for (const arg of args) {
    ret.push(JSON.stringify(arg, (key, value) => {
      // TODO: this will pass a primitive or object, but not a function!
      if (value.toString().includes('function')) {
        return value.toString();
      } else {
        return value;
      }
    }));
  }
  return ret;
}
