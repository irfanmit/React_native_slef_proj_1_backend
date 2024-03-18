const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require('firebase/storage');

//models
const User = require('../models/User')

const multer = require('multer');
const express = require('express');

// Initialize Firebase app
const firebaseConfig = {
    apiKey: "AIzaSyC4AP9lIjJx5GMvC9KvqT1cVOUdj2JljyQ",
    authDomain: "react-native-self-proj-1.firebaseapp.com",
    projectId: "react-native-self-proj-1",
    storageBucket: "react-native-self-proj-1.appspot.com",
    messagingSenderId: "984958558354",
    appId: "1:984958558354:web:991d45de08cccc7f70464b",
    measurementId: "G-T0L341LL97"
};
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the Firebase Storage service
const storage = getStorage(firebaseApp);

// Set up multer storage
const storageMulter = multer.memoryStorage();
const upload = multer({ storage: storageMulter });

// Set up express router
const router = express.Router();

// Create a Date object to get the current date and time
const currentDate = new Date();

// Format the date and time to use in the path
const formattedDate = currentDate.toISOString().replace(/[:.]/g, '-');

// Define route for uploading profile image
router.post('/Profile/:id', upload.single('image'), async (req, res) => {
  const id = req.params.id;
  console.log(req.file);
  try {
    // Check if file is present in request
    if (!req.file) {
        console.log("no file uplaoded");
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create a reference to the file in Firebase Storage
    const storageRef = ref(storage, `images/${formattedDate}`);
console.log(req.body);
    // Upload file to Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, req.file.buffer, {contentType : req.file.mimetype});

    // Wait for upload to complete
    await uploadTask;

    // Get download URL of the uploaded file
    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

    // Send download URL in response
   console.log("downloadURL: ", downloadURL);
   res.status(200).json({message : 'success', downloadURL})
   console.log("id for url :", id);
  await User.findByIdAndUpdate(id, { DpUrl: downloadURL });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;