const functions = require('firebase-functions');
// For the default version
const admin = require('firebase-admin');

const algoliasearch = require('algoliasearch');


var firebaseConfig = {
    apiKey: "AIzaSyC0XYbiF-HEIFvm6OhGySWMY9f5SugWMnQ",
    authDomain: "snowballapp-84bc6.firebaseapp.com",
    databaseURL: "https://snowballapp-84bc6.firebaseio.com",
    projectId: "snowballapp-84bc6",
    storageBucket: "snowballapp-84bc6.appspot.com",
    messagingSenderId: "504283891171",
    appId: "1:504283891171:web:a61276864b1a3521ef8cd6"
};

admin.initializeApp(firebaseConfig);

const client = algoliasearch("F71UYNAT2F", "52f5e43e72f92aa62410b65dbc3acd7a");
const collectionIndex = client.initIndex("Snowball");

exports.usersEntry = functions.firestore.document('snowball/{uid}').onCreate(async (snapshot, context) => {

    const record = snapshot.data();
    if (record) { // Removes the possibility  // We only index products that are complete.
        const objectID = snapshot.id;
        // In this example, we are including all properties of the Firestore document
        // in the Algolia record, but do remember to evaluate if they are all necessary.
        // More on that in Part 2, Step 2 above.
        return collectionIndex.saveObject({...record, objectID});
    }

});

exports.userUpdate = functions.firestore.document('snowball/{uid}').onUpdate(async (change, context) => {
    const newData = change.after.data();
    const objectID = change.after.id;
    return collectionIndex.saveObject({...newData, objectID});
});

exports.userIndexDeletion = functions.firestore.document('snowball/{uid}').onDelete(async (snapshot, context) => {
    if (snapshot.exists) {
        const objectID = snapshot.id;
        collectionIndex.deleteObject(objectID);
    }
});
