import express from 'express';

const PORT = 8000;

const app = express();

let comments = [
    { id: 1, user: '', timestamp: '', comment: '' },
    { id: 2, user: '', timestamp: '', comment: '' },
    { id: 3, user: '', timestamp: '', comment: '' },
    { id: 4, user: '', timestamp: '', comment: '' }
];

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '\\src\\index.html')
})

app.get('/backend/hello', (req, res) => {
    res.send('Hello, world!');
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});