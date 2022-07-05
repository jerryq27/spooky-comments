import express from 'express';
import bodyParser from 'body-parser';

const PORT = process.env.PORT || 8000;

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
        user: 'Ghost Greg',
        avatar: 'img/spooky/avatar-ghost.png',
        timestamp: '45 min ago',
        comment: 'Jeepers creepers now that\'s a huge release with some big ' +
            'community souls to back it - it must be so rewarding ' +
            'seeing creatures quit their night jobs after monetizing ' +
            '(with real MRR) on the new haunted platform.',
        upvotes: 0,
        children: [],
    },
    {
        id: '2',
        user: 'Vampire Vlad',
        avatar: 'img/spooky/avatar-vampire.png',
        timestamp: 'Yesterday',
        comment: 'Svitched our blog from Vampspot to Ghost a century ago -- ' +
            'turned out to be a great decision. Looking forvard to this ' +
            'update....the in-platform analytics look expecially delicious.. >:)',
        upvotes: 0,
        children: [
            {
                id: '2-1',
                user: 'Mummy',
                avatar: 'img/spooky/avatar-mummy.png',
                timestamp: '2 hrs ago',
                comment: 'Thanks Vlad! Last year has been an absolute goldrush for ' +
                    'the creature economy. Slowly at first, then all at once. Will be ' +
                    'interesting to see how this ecosystem.. unravels.. over the next century',
                upvotes: 0,
                children: [],
            },
        ]
    },
    {
        id: '3',
        user: 'Reaper Randy',
        avatar: 'img/spooky/avatar-reaper.png',
        timestamp: '3 weeks ago',
        comment: 'Love the native memberships and the spooky themes, I was ' +
            'just asked by a living friend about the options for a new site, and I ' +
            'think I know what I\'ll be recommending then...',
        upvotes: 0,
        children: [],
    }
];

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
    // Get the comment data.
    const newComment = req.body['comment'];
    newComment.id = `${comments.length + 1}`;
    comments.push(newComment);

    res.redirect('/');
});

app.put('/backend/addreply/:id', (req, res) => {
    const id = req.params.id;
    const parentComment = findComment(id, id.split('-'), comments, 0, 1);

    if(parentComment) {
        // Get reply data.
        const reply = req.body['reply'];
        reply.id = parentComment.id + `-${parentComment.children.length + 1}`
        parentComment.children.push(reply);

        res.statusCode = 200;
    }
    res.send(parentComment);
});

app.put('/backend/upvote/:id', (req, res) => {
    const id = req.params.id;
    const comment = findComment(id, id.split('-'), comments, 0, 1);

    if(comment) {
        comment.upvotes += 1;
        res.statusCode = 200;
    }

    res.send(comment);
});

// Run Server
app.listen(PORT, () => {
    console.log(`Server running on https://spooky-comments-v3.herokuapp.com:${PORT}/`);
});