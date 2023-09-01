const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const {MongoClient} = require('mongodb');
const mongoose = require('mongoose');
const app= express();
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());
// app.use(function(res,req,next){
//     res.headers('Access-Control-Allow-Origin','*');
//     res.headers('Access-Control-Allow-Headers','Orgin, X-Requested-With,Content-Type,Accept');
//     next();
// })
const url = `mongodb://0.0.0.0:27017/notetakingapp`;
const client = new MongoClient(url);
client.connect();
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }); // Add options
mongoose.connection.once('open', () => 
    console.log("Successfully connected to Database!")
    ).on('error', (error) => {
        console.log("Connection Error!", error)
    })
app.listen(4000,()=>{
    console.log(`Server running !`)
})

  const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  });
  
  const user = mongoose.model('User', userSchema);

  const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    username: { type: String, required: true } // Reference to user
  });
  
  const notes = mongoose.model('Note', noteSchema);

  //USER POST API
app.post('/users', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if a user with the same email already exists
    const existingUser = await user.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this username already exists' });
    }


    // Create a new user with the hashed password
    const newUser = new user({
      username,
      password,
    });

    // Save the new user
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
    console.log('User Posted Successfully');
  } catch (error) {
    console.error(error);
    res.send(error)
    res.status(500).json({ message: 'Internal server error' });
  }
});


  //NOTES POST API
  app.post('/notes', async (req, res) => {
    const username = req.body.username;
    const title = req.body.title;
    const body = req.body.body;
  
    try {
      // Find the user by username (you should have a 'User' model)
      const users = await user.findOne({ username });
  
      if (!users) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Create a new note associated with the user
      const newNote = new notes({
        title,
        body,
        username: users.username, // Associate the note with the user
      });
  
      // Save the new note
      const savedNote = await newNote.save();
  
      res.status(201).json(savedNote);
      console.log('Note Posted Successfully');
    } catch (error) {
      console.error(error);
      res.send(error)
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

  //NOTES GET API
  app.get('/users/:username', async (req, res) => {
    console.log(req.params.username)
    try {
    const foundUser = await client.db('notetakingapp').collection('users').findOne({username: req.params.username});
    const foundNote = await client.db('notetakingapp').collection('notes').find({ username: req.params.username }).toArray();
    if (foundUser) {
      console.log('Found user:', foundUser);
      console.log('Notes user:', foundNote);
      const responseData = {
        userData: foundUser,
        noteData: foundNote,
        message: "User Details Fetched!"
    };
    res.send(responseData);
  } else {
    console.log('User not found');
    const responseData= {
      message:"User not found!"
    }
    res.send(responseData);
  }
} catch (error) {
  const responseData = {
    err: error,
    message: "Error while Fetching"
};
  res.send(responseData)
}   
    });

//Update Notes API
app.put('/notes/:id', async (req, res) => {
  const noteId = req.params.id;
  const updatedTitle = req.body.title;
  const updatedBody = req.body.body;
  console.log(noteId)
  try {
    // Find the note by ID and update it
    const updatedNote = await notes.findByIdAndUpdate(noteId, {
      title: updatedTitle,
      body: updatedBody,
    }, { new: true }); // { new: true } returns the updated note

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ message: 'Note updated successfully', data: updatedNote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//DELETE NOTE API
app.delete('/notes/:id', async(req,res)=>{
  const noteId = req.params.id;
  console.log(noteId)
  try {
    // Delete the note by ID
    const deleteNote = await notes.findByIdAndDelete(noteId);

    if (!deleteNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})