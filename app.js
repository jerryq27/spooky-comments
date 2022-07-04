import express from 'express';
import bodyParser from 'body-parser';

const PORT = 8000;

const app = express();

// Loads in local CSS and JS.
app.use(express.static('public'));
// Express middleware for parsing the body of POST requests.
app.use(bodyParser.urlencoded({ extended: true }));
// Express middlewaer for parsing body with JSON.
app.use(bodyParser.json());

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

/**
 * Recursive function to find comments.
 * @param {string} searchId the id of the comment to search for.
 * @param {number[]} idNums the id string as an array: '2-1-1' = [2, 1, 1]
 * @param {Object[]} commentThread the thread of comments to search.
 * @param {number} start the start of the id array.
 * @param {number} end the end of the id array.
 * @returns {Object} reference to the comment object.
 */
 const findComment = (searchId, idNums, commentThread, start, end) => {
    if(end > idNums.length) return;

    const result = commentThread.find(c => c.id === searchId);
    if(result) return result;

    const parentId = idNums.slice(start, end).join('-');
    const parent = commentThread.find(c => c.id === parentId);
    // console.log('id: ' + parentId)
    // console.log('parent: ' + JSON.stringify(parent));
    if(!parent) return;
    if(parent.children) {
        return findComment(searchId, idNums, parent.children, start, end + 1);
    }
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
    // let newComment = {...commentTemplate};
    const newComment = JSON.parse(JSON.stringify(commentTemplate));
    newComment.id = `${comments.length + 1}`;
    newComment.comment = req.body['comment-input'];
    comments.push(newComment);

    res.redirect('/');
});

app.put('/backend/addreply/:id', (req, res) => {
    const id = req.params.id;
    const parentComment = findComment(id, id.split('-'), comments, 0, 1);

    // console.log(req.body);

    if(parentComment) {
        // const reply = {...commentTemplate};
        const reply = JSON.parse(JSON.stringify(commentTemplate));
        reply.id = parentComment.id + `-${parentComment.children.length + 1}`
        reply.comment = req.body['reply-input'];
        parentComment.children.push(reply);

        res.statusCode = 200;
    }
    res.send(parentComment);
});

app.put('/backend/upvote/:id', (req, res) => {
    const id = req.params.id;
    const comment = findComment(id, id.split('-'), comments, 0, 1);
    // console.log(`${id} => ${JSON.stringify(comment)}`);

    if(comment) {
        console.log('updating ' + id)
        comment.upvotes += 1;
        res.statusCode = 200;
    }
    // console.log(JSON.stringify(comment));
    res.send(JSON.stringify(comment));
});

// Run Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});