// src/indexedDB.ts

const DB_NAME = "myDatabase";
const DB_VERSION = 1;
const STORE_NAME = "myObjectStore";

export interface IData {
  id?: number;
  firstName: string;
  lastName: string;
}

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("Database error:", (event.target as IDBRequest).error);
      reject((event.target as IDBRequest).error);
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };
  });
}

export function addData(db: IDBDatabase, data: IData): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.add(data);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
    };
  });
}

export function getData(
  db: IDBDatabase,
  id: number
): Promise<IData | undefined> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.get(id);

    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
    };
  });
}

export function updateData(db: IDBDatabase, data: IData): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.put(data);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
    };
  });
}

export function deleteData(db: IDBDatabase, id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
    };
  });
}
