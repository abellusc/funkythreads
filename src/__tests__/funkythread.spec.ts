import { runFunctionAsThread } from '..';

describe('Funkythread Library', () => {
  it('must return a simple type from a threaded sync function', async () => {
    const result = await runFunctionAsThread(function run(){ // this will run in a different thread and return
      return 123;
    });

    expect(result).toEqual(123);
  });
  it('must return an object from a threaded sync function', async () => {
    const result = await runFunctionAsThread(function run() {
      return {
        test: 123
      }
    }) as any;

    expect(result).toHaveProperty('test');
    expect(result.test).toEqual(123);
  });
  it('must perform a CPU intensive task', async () => {
    const result = await runFunctionAsThread(function run() {
      function fibo(n: number): number {
        if (n < 2) return 1;
        return fibo(n - 2) + fibo(n - 1);
      }

      return fibo(25);
    })

    expect(result).toEqual(121393);
  }, 15000);
  it('must return the correct value given a different function name', async () => {
    const result = await runFunctionAsThread(function other_function_name() {
      return 123;
    }) as any;

    expect(result).toEqual(123);
  });

  it('must work with an arrow function which returns a promise', async () => {
    const result = await runFunctionAsThread(() => {
      function fibo(n: number): number {
        if (n < 2) return 1;
        return fibo(n - 2) + fibo(n - 1);
      }

      return new Promise((resolve) => resolve(fibo(25)));
    })

    expect(await result).toEqual(121393);
  });

  it('should work when passed an async handler function', async () => {

  });
});