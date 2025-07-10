import { 
  collection, 
  onSnapshot, 
  query, 
  enableNetwork,
  disableNetwork
} from "firebase/firestore";
import { db } from "./firebase.js";

const COLLECTION_NAME = "01-nhet-tai-cu";

// Cache object để lưu trữ dữ liệu
const cache = {
  data: new Map(),
  listeners: new Map(),
  lastFetch: null,
  isOnline: navigator.onLine
};

// Kiểm tra trạng thái mạng
window.addEventListener('online', () => {
  cache.isOnline = true;
  enableNetwork(db);
});

window.addEventListener('offline', () => {
  cache.isOnline = false;
  disableNetwork(db);
});

/**
 * Lấy tất cả tài nghe nhét tai cũ với cache và real-time updates
 */
export const getAllTaiNgheNhetTai = (callback, useCache = true) => {
  const cacheKey = 'all_tai_nghe_nhet_tai';

  if (useCache && cache.data.has(cacheKey)) {
    callback(cache.data.get(cacheKey));
  }

  const q = query(
    collection(db, COLLECTION_NAME)
  );

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
      console.error("Error getting tai nghe nhet tai:", error);
      if (cache.data.has(cacheKey)) {
        callback(cache.data.get(cacheKey));
      }
    }
  );

  cache.listeners.set(cacheKey, unsubscribe);

  return unsubscribe;
};

// --- Thêm 2 hàm helper cho localStorage ---
const CACHE_KEY = 'tai_nghe_cache_v1';

function saveCacheToLocalStorage() {
  try {
    const obj = Object.fromEntries(cache.data.entries());
    localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
  // eslint-disable-next-line no-unused-vars
  } catch (e) {
    // ignore
  }
}

function loadCacheFromLocalStorage() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const obj = JSON.parse(raw);
      Object.entries(obj).forEach(([k, v]) => cache.data.set(k, v));
    }
  // eslint-disable-next-line no-unused-vars
  } catch (e) {
    // ignore
  }
}

// --- Load cache khi file được import ---
loadCacheFromLocalStorage();