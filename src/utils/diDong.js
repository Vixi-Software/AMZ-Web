import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "./firebase.js";

// Đổi tên collection cho loa di động
const COLLECTION_NAME = "03-di-dong-cu";

// Đơn giản hóa cache cho loa di động
const cache = {
  data: new Map(),
  listeners: new Map(),
  lastFetch: null
};

const CACHE_KEY = '03-di-dong-cu';

function saveCacheToLocalStorage() {
  try {
    const obj = Object.fromEntries(cache.data.entries());
    localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
  // eslint-disable-next-line no-unused-vars
  } catch (e) { /* empty */ }
}

function loadCacheFromLocalStorage() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const obj = JSON.parse(raw);
      Object.entries(obj).forEach(([k, v]) => cache.data.set(k, v));
    }
  // eslint-disable-next-line no-unused-vars
  } catch (e) { /* empty */ }
}
loadCacheFromLocalStorage();

/**
 * Lấy tất cả loa di động với cache và real-time updates
 */
export const getAllLoaDiDong = (callback, useCache = true) => {
  const cacheKey = 'all_loa_di_dong';

  if (useCache && cache.data.has(cacheKey)) {
    callback(cache.data.get(cacheKey));
  }

  const q = query(collection(db, COLLECTION_NAME));

  const unsubscribe = onSnapshot(q,
    (snapshot) => {
      const items = [];
      snapshot.forEach((docSnap) => {
        items.push({
          id: docSnap.id,
          ...docSnap.data()
        });
      });

      cache.data.set(cacheKey, items);
      saveCacheToLocalStorage();
      cache.lastFetch = new Date();

      callback(items);
    },
    (error) => {
      console.error("Error getting loa di dong:", error);
      if (cache.data.has(cacheKey)) {
        callback(cache.data.get(cacheKey));
      }
    }
  );

  cache.listeners.set(cacheKey, unsubscribe);

  return unsubscribe;
};