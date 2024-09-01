/*
 * Problem Statement:
 * Implement a polyfill for `Promise.any()` which:
 * - Resolves with the value of the first promise that fulfills.
 * - Rejects with an `AggregateError` if all promises reject.
 */
function promiseAny<T>(promises: Array<Promise<T>>) {
  return new Promise((resolve, reject) => {
    let rejectedCount = 0;
    const errors: Array<Error> = [];

    // Iterate over each promise in the input array
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(resolve)
        .catch((error: Error) => {
          rejectedCount++;
          errors[index] = error;

          if (rejectedCount === promises.length) {
            reject(new AggregateError(errors, "All promises were rejected"));
          }
        });
    });
  });
}

const p1 = new Promise((resolve, reject) => setTimeout(reject, 100, "Error 1"));
const p2 = new Promise((resolve, reject) => setTimeout(reject, 200, "Error 2"));
const p3 = new Promise((resolve, reject) =>
  setTimeout(resolve, 150, "Success 3")
);
const p4 = new Promise((resolve, reject) =>
  setTimeout(resolve, 50, "Success 4")
);

promiseAny([p1, p2, p3, p4])
  .then((value) => console.log("Promise fulfilled with:", value))
  .catch((error) => console.error("All promises were rejected:", error));
