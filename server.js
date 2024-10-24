const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const https = require('https');
const Busboy = require('busboy');
const greenlock = require('greenlock-express');

const app = express();
const port = 80; // HTTP port

app.use(cors());
app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());


// Define a schema and model for assignments
const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  filePath: String,
  createdAt: { type: Date, default: Date.now }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/submit', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'submit.html'));
});

app.get('/payment', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'payment.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.post('/submit-assignment', (req, res) => {
  const busboy = new Busboy({ headers: req.headers });
  const uploadPath = path.join(__dirname, 'uploads');
  const fields = {};

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    const saveTo = path.join(uploadPath, filename);
    file.pipe(fs.createWriteStream(saveTo));
    file.on('end', () => {
      fields.file = { filename, encoding, mimetype, path: saveTo };
    });
  });

  busboy.on('field', (fieldname, val) => {
    fields[fieldname] = val;
  });

  busboy.on('finish', async () => {
    try {
      const assignment = new Assignment({
        title: fields.title,
        description: fields.description,
        filePath: fields.file.path
      });
      await assignment.save();
      res.json({ message: 'Assignment submitted successfully!', fields });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save assignment' });
    }
  });

  req.pipe(busboy);
});

// Use greenlock-express to handle HTTPS
greenlock.init({
  packageRoot: __dirname,
  configDir: './greenlock.d',
  maintainerEmail: 'your-email@example.com', // Replace with your email
  cluster: false,
  packageAgent: {
    name: require('./package.json').name,
    version: require('./package.json').version
  }
}).serve(app);

console.log(`Server is running on http://localhost:${port}`);