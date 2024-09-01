/*
 * Problem Statement:
 * Given an array of URLs, we need to fetch data from these URLs.
 * At any given time, only 2 network calls should be in progress.
 * The function should return an array of results once all network calls have completed.
 */

const urls = [
  "https://jsonplaceholder.typicode.com/todos/1",
  "https://jsonplaceholder.typicode.com/todos/2",
  "https://jsonplaceholder.typicode.com/todos/3",
  "https://jsonplaceholder.typicode.com/todos/4",
  "https://jsonplaceholder.typicode.com/todos/5",
];

async function fetchWithConcurrencyLimit(urls: Array<string>, limit: number) {
  const results: Array<object | null> = [];
  let idx = 0;

  // Worker function to process each URL
  const worker = async () => {
    while (idx < urls.length) {
      const url = urls[idx]; // Get the next URL
      idx++;

      console.log(`Fetching ${url}... ⏳`);

      try {
        const response = await fetch(url);
        const data = await response.json();

        results.push(data);
      } catch (error) {
        results.push(null); // In case of error, push null to results
      } finally {
        console.log(`Worker finished processing ${url} ✅`);
      }
    }
  };

  // Create an array of workers (array of promises), limited by the concurrency limit
  const workers = [];
  for (let i = 0; i < limit; i++) {
    workers.push(worker());
  }

  // Wait for all workers to complete
  await Promise.all(workers);

  return results;
}

fetchWithConcurrencyLimit(urls, 2).then((data) =>
  console.log("Fetched data:", data)
);
