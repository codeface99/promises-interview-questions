/*
 * Problem Statement:
 * Implement a function that retries a promise-based operation a specific number of times
 * before giving up. The function should attempt to resolve the promise, and if it fails,
 * retry the operation up to a given number of times.
 */
function retryPromise(promiseFn: () => Promise<any>, retries: number) {
  return new Promise((resolve, reject) => {
    const attempt = (n: number) => {
      promiseFn()
        .then(resolve)
        .catch((error) => {
          if (n === 0) {
            reject(error);
          } else {
            console.log(`Retrying... Attempts left: ${n}`);
            attempt(n - 1);
          }
        });
    };

    attempt(retries); // Start the first attempt
  });
}

function mockNetworkRequest() {
  return new Promise((resolve, reject) => {
    const success = Math.random() > 0.7; // 30% chance of success
    setTimeout(() => {
      if (success) {
        resolve("Network request successful!");
      } else {
        reject("Network request failed!");
      }
    }, 100);
  });
}

retryPromise(mockNetworkRequest, 3)
  .then((data) => console.log(data))
  .catch((error) => console.error("Operation failed after 3 retries:", error));
