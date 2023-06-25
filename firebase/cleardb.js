const { db } = require("./firebaseConfig.js");

async function deleteCollection(db, collectionPath, batchSize) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy("__name__").limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, batchSize, resolve, reject);
  });
}

async function deleteDocumentWithSubcollections(db, docRef) {
  // Fetch subcollections of the document.
  const subcollections = await docRef.listCollections();

  // Delete each subcollection.
  for (const subcollection of subcollections) {
    await deleteCollection(db, `${docRef.path}/${subcollection.id}`, 10);
  }

  // Delete the document itself.
  await docRef.delete();
}

async function deleteQueryBatch(db, query, batchSize, resolve, reject) {
  query
    .get()
    .then((snapshot) => {
      if (snapshot.size === 0) {
        return 0;
      }

      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      return batch
        .commit()
        .then(() => {
          return snapshot.size;
        })
        .catch(reject);
    })
    .then((numDeleted) => {
      if (numDeleted === 0) {
        resolve();
        return;
      }

      process.nextTick(() =>
        deleteQueryBatch(db, query, batchSize, resolve, reject)
      );
    })
    .catch(reject);
}

async function deleteAllData() {
  // Fetch top-level collections.
  const topLevelCollections = await db.listCollections();

  // Delete each top-level collection and their documents including subcollections.
  for (const topLevelCollection of topLevelCollections) {
    // Delete documents with subcollections.
    const topLevelDocsSnapshot = await topLevelCollection.get();
    topLevelDocsSnapshot.docs.forEach(async (doc) => {
      await deleteDocumentWithSubcollections(db, doc.ref);
    });

    // Delete documents without subcollections and the top-level collection.
    await deleteCollection(db, topLevelCollection.path, 10);
  }
}

deleteAllData();