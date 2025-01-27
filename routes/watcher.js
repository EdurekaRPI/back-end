// // watcher.js
// const mongoose = require('mongoose');
// const axios = require('axios');
//
// // Watch for changes in the "events" collection
// async function watchEventsCollection() {
//     const collection = mongoose.connection.collection('eventModelSuperset');
//     const changeStream = collection.watch();
//
//     changeStream.on('change', async (change) => {
//         try {
//             const externalURI = ''; // TODO: Need to get external reference from RPI Event Hub & Study Compass
//
//             const payload = {
//                 externalRef: change.fullDocument.externalRef,  // externalRef field should be in the document
//                 eventId: change.documentKey._id,  // The ID of the document that changed
//                 action: change.operationType, // 'insert', 'update', 'delete'
//             };
//
//             // Send the change data to the external DB
//             await axios.post(externalURI, payload);
//             console.log(`Notified external DB about the ${change.operationType} of event ${change.documentKey._id}`);
//         } catch (err) {
//             console.error('Error notifying external DB:', err);
//         }
//     });
//
//     console.log('Watching for changes in the events collection...');
// }
//
// module.exports = { watchEventsCollection };
