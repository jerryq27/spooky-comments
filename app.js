import express from 'express';
import bodyParser from 'body-parser';

const PORT = 8000;

const app = express();

// Loads in local CSS and JS.
app.use(express.static('public'));
// Express middleware for parsing the body of POST requests.
app.use(bodyParser.urlencoded({ extended: true }));

let comments = [
    {
        id: '1',
        user: 'Rob Hope',
        timestamp: '45 min ago',
        comment: 'Jeepers now that\'s a huge release with some big ' +
            'community earnings to back it - it must be so rewarding ' +
            'seeing creators quit their day jobs after monetizing ' +
            '(with real MRR) on the new platform.',
        children: [],
    },
    {
        id: '2',
        user: 'Sophie Brecht',
        timestamp: 'Yesterday',
        comment: 'Switched our blog from Hubspot to Ghost a year ago -- ' +
            'turned out to be a great decision. Looking forward to this ' +
            'update....the in-platform analytics look expecially delicious. :)',
        children: [
            {
                id: '2-1',
                user: 'James',
                timestamp: '2 hrs ago',
                comment: 'Thanks Sophie! Last year has been an absolut goldrush for ' +
                    'the creator economy. Slowly at first, then all at once. Will be ' +
                    'interesting to see how this ecosystem evolves over the next few years'
            },
        ]
    },
    {
        id: '3',
        user: 'Cameron Lawrence',
        timestamp: '3 weeks ago',
        comment: 'Love the native memberships and the zipless themes, I was ' +
            'just asked by a friend about the options for a new site, and I ' +
            'think I know what I\'ll be recommending then...',
        children: [],
    }
];

let commentTemplate = {
    id: null,
    user: 'Rob Hope',
    timestamp: '',
    comment: '',
    children: []
};

// Endpoints
app.get('/', (req, res) => {
    res.sendFile('./index.html');
});

app.get('/backend/comments', (req, res) => {
    res.statusCode = 200;
    res.json(comments);
});

app.post('/backend/addcomment', (req, res) => {
    // Deep copy the template.
    let newComment = {...commentTemplate};
    newComment.comment = req.body.comment;
    comments.push(newComment);

    res.redirect('/');
});

// Run Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});