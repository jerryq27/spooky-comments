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
        avatar: 'img/sample-avatar-3.png',
        timestamp: '45 min ago',
        comment: 'Jeepers now that\'s a huge release with some big ' +
            'community earnings to back it - it must be so rewarding ' +
            'seeing creators quit their day jobs after monetizing ' +
            '(with real MRR) on the new platform.',
        upvotes: 0,
        children: [],
    },
    {
        id: '2',
        user: 'Sophie Brecht',
        avatar: 'img/sample-avatar-4.png',
        timestamp: 'Yesterday',
        comment: 'Switched our blog from Hubspot to Ghost a year ago -- ' +
            'turned out to be a great decision. Looking forward to this ' +
            'update....the in-platform analytics look expecially delicious. :)',
        upvotes: 0,
        children: [
            {
                id: '2-1',
                user: 'James',
                avatar: 'img/sample-avatar-2.png',
                timestamp: '2 hrs ago',
                comment: 'Thanks Sophie! Last year has been an absolut goldrush for ' +
                    'the creator economy. Slowly at first, then all at once. Will be ' +
                    'interesting to see how this ecosystem evolves over the next few years',
                upvotes: 0,
                children: [],
            },
        ]
    },
    {
        id: '3',
        user: 'Cameron Lawrence',
        avatar: 'img/sample-avatar-1.png',
        timestamp: '3 weeks ago',
        comment: 'Love the native memberships and the zipless themes, I was ' +
            'just asked by a friend about the options for a new site, and I ' +
            'think I know what I\'ll be recommending then...',
        upvotes: 0,
        children: [],
    }
];

let commentTemplate = {
    id: null,
    user: 'Rob Hope',
    avatar: 'img/sample-avatar-3.png',
    timestamp: 'Just now',
    comment: '',
    upvotes: 0,
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
    newComment.comment = req.body['comment-text'];
    comments.push(newComment);

    res.redirect('/');
});

app.put('/backend/update/:id', (req, res) => {
    const id = req.params.id;
    const comment = comments[id];

    if(comment) {
        console.log('updating ' + id)
        comment.upvotes += 1;
        res.statusCode = 200;
    }
    console.log(JSON.stringify(comment));
    res.send(JSON.stringify(comment));
});

// Run Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});