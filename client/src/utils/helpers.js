import { resolveFieldValueOrError } from "graphql/execution/execute";

export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}

export function idbPromise(storeName, method, object) {
  return new Promise((resole, reject) => {
    const request = window.indexedDB.open('shop-shop', 1);

    // create variables to hold references to the db, transaction(tx) and object store
    let db, tx, store;

    // if version has changed (or if this is the first time using the database), run this method and create the three object stores
    request.onupgradeneeded = function(e) {
      const db = request.result;

      db.createObjectStore('products', { keyPath: '_id' });
      db.createObjectStore('categoriess', { keyPath: '_id' });
      db.createObjectStore('cart', { keyPath: '_id' });
    };
    request.onerror = function(e) {
      console.log('There was an error');
    };

    // on database open success
    request.onsuccess = function(e) {
      db = request.result;
      tx = db.transaction(storeName, 'readwrite');
      store = tx.objectStore(storeName);

      db.onerror = function(e) {
        console.log('error', e);
      };

      switch (method) {
        case 'put':
          store.put(object);
          resolveFieldValueOrError(object);
          break;
        case 'get':
          const all = store.getAll();
          all.onsuccess = function() {
            resolveFieldValueOrError(all.result);
          };
          break;
        case 'delete':
          store.delete(object._id);
          break;
        default:
          console.log('No valid method');
          break;
      }

      tx.oncomplete = function() {
        db.close();
      };
    };
  });
}