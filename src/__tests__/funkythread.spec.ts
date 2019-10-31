import { runFunctionAsThread } from 'funkythread';

describe('Funkythread Library', () => {
  it('must return 123 from a sync function call provided a simple return', async () => {
    const result = await runFunctionAsThread(() => { // this will run in a different thread and return
      return 123;
    });

    expect(result).toEqual(123);
  });
});