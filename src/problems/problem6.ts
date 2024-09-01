/*
 * Problem Statement:
 * Implement a promise-based cache interface where:
 * 1. Cached data is returned immediately if available.
 * 2. If the cached data is stale or not available in the cache, fetch it and store it.
 */
function createPromiseCache(
  fetchFunction: (key: string) => Promise<any>,
  ttl: number
): (key: string) => Promise<any> {
  const cache = new Map(); // Cache storage

  return async function (key: string) {
    const cachedData = cache.get(key);
    const now = Date.now();

    // If the data is available & still fresh, return it
    if (cachedData && now - cachedData.timestamp < ttl) {
      return cachedData.value;
    }

    // If no data is cached, fetch it and store it
    const freshData = await refreshCache(key);
    return freshData;
  };

  async function refreshCache(key: string) {
    const freshData = await fetchFunction(key);
    cache.set(key, { value: freshData, timestamp: Date.now() });
    return freshData;
  }
}

const fetchFunction = async (key: string) => {
  console.log(`Fetching fresh data for key: ${key}`);
  return `Data for ${key}`;
};

const getCachedData = createPromiseCache(fetchFunction, 5000); // 5-second TTL

// Initial fetch, should trigger a fresh data fetch
getCachedData("test").then((data) => console.log("Initial fetch:", data));

// Second fetch within TTL, should return cached data
setTimeout(() => {
  getCachedData("test").then((data) =>
    console.log("Second fetch (cached):", data)
  );
}, 1000);

// Third fetch after TTL, should return stale data and refresh in the background
setTimeout(() => {
  getCachedData("test").then((data) =>
    console.log("Third fetch (stale):", data)
  );
}, 6000);
