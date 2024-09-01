/*
 * Problem Statement:
 * Create a function that waits for multiple promises to resolve using `Promise.all()`.
 * If any promise rejects or takes longer than a specified timeout, the entire operation should be rejected.
 */
function promiseAllWithTimeout(promises: Array<Promise<any>>, timeout: number) {
  return new Promise((resolve, reject) => {
    // Create a timeout promise that rejects after the specified time
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error("Timeout: Operation took too long")),
        timeout
      );
    });

    // Use Promise.race() to race between the promises and the timeout
    Promise.race([Promise.all(promises), timeoutPromise])
      .then(resolve) // If Promise.all(promises) wins, resolve with its results
      .catch(reject); // If timeoutPromise rejects first, or any promise rejects, reject the operation
  });
}

const p1 = new Promise((resolve) => setTimeout(resolve, 100, "Resolved 1"));
const p2 = new Promise((resolve) => setTimeout(resolve, 200, "Resolved 2"));
const p3 = new Promise((resolve) => setTimeout(resolve, 300, "Resolved 3"));

promiseAllWithTimeout([p1, p2, p3], 250)
  .then((results) => console.log("All promises resolved:", results))
  .catch((error) => console.error("Error:", error));
