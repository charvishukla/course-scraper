const { db, admin } = require("./firebaseConfig.js");

async function fetchDataFromCollection(db, collectionName) {
  const collectionRef = db.collection(collectionName);
  const querySnapshot = await collectionRef.get();

  return Promise.all(
    querySnapshot.docs.map(async (doc) => ({
      id: doc.id,
      ...doc.data(),
      subcollections: await fetchSubcollections(db, collectionName, doc.id),
    }))
  );
}

async function fetchSubcollections(db, collectionName, documentId) {
  const documentRef = db.collection(collectionName).doc(documentId);
  const subcollectionsList = await documentRef.listCollections();

  return Promise.all(
    subcollectionsList.map(async (subcollection) => {
      const subcollectionRef = documentRef.collection(subcollection.id);
      const subcollectionSnapshot = await subcollectionRef.get();

      return {
        id: subcollection.id,
        documents: subcollectionSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      };
    })
  );
}

module.exports = {
  fetchCourses: async (collectionName) => {
    const coursesData = await fetchDataFromCollection(db, collectionName);
    return coursesData;
  },
};