// wrapper for indexdb functions

let db;

function initDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("epubLibDB", 1);

    // initialize db
    req.onupgradeneeded = (event) => {
      db = event.target.result;

      if (!db.objectStoreNames.contains("epubs")) {
        db.createObjectStore("epubs", { keyPath: "id", autoIncrement: true });
      }
    };
    // runs when we already have the db
    req.onsuccess = (event) => {
      console.log("DB success");
      db = event.target.result;
      resolve(db);
    };

    req.onerror = (event) => {
      console.error("DB error: ", event.target.errorCode);
      reject(event.target.errorCode);
    };
  });
}

// util function for saving an epub
/**
 * type file {
 * title: string
 * file: blob
 * date: string
 * }
 */
function saveEpub(file) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["epubs"], "readwrite");
    const store = transaction.objectStore("epubs");

    const bookData = {
      title: file.name,
      file: file,
      dateAdded: new Date(),
    };

    const req = store.add(bookData);

    req.onsuccess = () => {
      console.log("Book save success: ", file.name);
      resolve(true);
    };

    req.onerror = (event) => {
      console.error("Book save error: ", event.target.error);
      reject(event.target.error);
    };
  });
}

function getAllEpubs() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["epubs"], "readonly");
    const store = transaction.objectStore("epubs");

    const req = store.getAll();

    req.onsuccess = (event) => {
      console.log("Get all epubs is successful");
      resolve(event.target.result); // array of books
    };

    req.onerror = (event) => {
      console.error("Error getting books:", event.target.error);
      reject(event.target.error);
    };
  });
}
