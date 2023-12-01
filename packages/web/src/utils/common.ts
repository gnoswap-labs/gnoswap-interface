export function wait<T>(
  runner: () => Promise<T>,
  waitTime = 1000,
  finishTime = 10000,
) {
  return new Promise<T | null>(resolve => {
    let finishedResult = false;
    let result: T | null = null;
    let currentTime = 0;

    runner().then(response => {
      result = response;
      finishedResult = true;
    });

    const interval = setInterval(() => {
      if (finishedResult && currentTime >= waitTime) {
        clearInterval(interval);
        resolve(result);
      }

      if (currentTime >= finishTime) {
        clearInterval(interval);
        resolve(null);
      }
      currentTime += 500;
    }, 500);
  });
}
