const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const { hash, compare } = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('cardiovascular');
    const logindetails = db.collection('logindetails');

    // Signup endpoint
    app.post('/signup', async (req, res) => {
      try {
        const { fullName, email, password, mobileNumber, gender, age } = req.body;
        
        const existingUser = await logindetails.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await hash(password, 10);
        const result = await logindetails.insertOne({
          fullName,
          email,
          password: hashedPassword,
          mobileNumber,
          gender,
          age: parseInt(age),
          createdAt: new Date()
        });

        res.status(201).json({ 
          message: 'User registered successfully',
          userId: result.insertedId 
        });
      } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Error creating user' });
      }
    });

    // Signin endpoint
    app.post('/signin', async (req, res) => {
      try {
        const { email, password } = req.body;
        
        const user = await logindetails.findOne({ email });
        if (!user) {
          return res.status(401).json({ 
            message: 'No account found with this email',
            type: 'email_error'
          });
        }

        const isValid = await compare(password, user.password);
        if (!isValid) {
          return res.status(401).json({ 
            message: 'You entered wrong password. Please enter correct password.',
            type: 'password_error'
          });
        }

        res.json({
          message: 'Signin successful',
          user: {
            fullName: user.fullName,
            email: user.email,
            mobileNumber: user.mobileNumber,
            gender: user.gender,
            age: user.age
          }
        });
      } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ message: 'Error during signin' });
      }
    });

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });

  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

main().catch(console.error);

// Handle cleanup on app shutdown
process.on('SIGINT', async () => {
  await client.close();
  process.exit(0);
});