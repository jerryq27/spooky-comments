import express from 'express';

const PORT = 8000;

const app = express();

// Loads in local CSS and JS.
app.use(express.static('public'));

let comments = [
    {
        id: 1,
        user: 'Rob Hope',
        timestamp: '45 min ago',
        comment: 'Jeepers now that\'s a huge release with some big ' +
            'community earnings to back it - it must be so rewarding ' +
            'seeing creators quit their day jobs after monetizing ' +
            '(with real MRR) on the new platform.',
        children: [],
    },
    {
        id: 2,
        user: 'Sophie Brecht',
        timestamp: 'Yesterday',
        comment: 'Switched our blog from Hubspot to Ghost a year ago -- ' +
            'turned out to be a great decision. Looking forward to this ' +
            'update....the in-platform analytics look expecially delicious. :)',
        children: [
            {
                id: 3,
                user: 'James',
                timestamp: '2 hrs ago',
                comment: 'Thanks Sophie! Last year has been an absolut goldrush for ' +
                    'the creator economy. Slowly at first, then all at once. Will be ' +
                    'interesting to see how this ecosystem evolves over the next few years'
            },
        ]
    },
    {
        id: 4,
        user: 'Cameron Lawrence',
        timestamp: '3 weeks ago',
        comment: 'Love the native memberships and the zipless themes, I was ' +
            'just asked by a friend about the options for a new site, and I ' +
            'think I know what I\'ll be recommending then...',
        children: [],
    }
];

app.get('/', (req, res) => {
    res.sendFile('./index.html');
})

app.get('/backend/hello', (req, res) => {
    res.send('Hello, world!');
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});