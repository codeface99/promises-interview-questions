/*
 * Problem Statement:
 * Given an array of promises, some of which may already be resolved or rejected,
 * write a function that determines the order in which they resolve or reject.
 * The function should return an array of objects indicating the status ("resolved" or "rejected")
 * and the corresponding value or reason for each promise, in the order they settle.
 */
function getPromiseResolutionOrder(promises: Array<Promise<any>>) {
  const result: Array<any> = [];

  return Promise.all(
    promises.map((promise, index) =>
      promise
        .then((value) => result.push({ status: "resolved", value, index }))
        .catch((reason) => result.push({ status: "rejected", reason, index }))
    )
  ).then(() => result);
}

const p1 = Promise.resolve("Resolved 1");
const p2 = new Promise((_, reject) => setTimeout(reject, 100, "Rejected 2"));
const p3 = new Promise((resolve) => setTimeout(resolve, 50, "Resolved 3"));
const p4 = Promise.reject("Rejected 4");

getPromiseResolutionOrder([p1, p2, p3, p4])
  .then((order) => {
    order.forEach((result) => {
      if (result.status === "resolved") {
        console.log(`Promise ${result.index + 1} resolved with:`, result.value);
      } else {
        console.log(
          `Promise ${result.index + 1} rejected with:`,
          result.reason
        );
      }
    });
  })
  .catch((error) => console.error("Error:", error));
