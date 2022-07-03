// Get DOM elements for the form, comment input, and comment list.

const url = 'http://localhost:8000/backend'

// Get the comments and render list.
document.onreadystatechange = () => {
    if(document.readyState === 'complete') {
        getComments();
    }
}

getComments = () => {
    const comments = document.getElementById('comments');

    // Make GET request.
    let xmlReq = new XMLHttpRequest();
    xmlReq.open("GET", `${url}/comments`, false);
    xmlReq.send(null);
    let json = JSON.parse(xmlReq.responseText);

    // Create list elements.
    json.forEach(comment => {
        const listItem = createCommentComponent(comment);
        comments.appendChild(listItem);
        
        // Handle children comments
        if(comment.children) {
            const nestedList = document.createElement('ul');
            comment.children.forEach(child => {
                const childItem = createCommentComponent(child);
                nestedList.appendChild(childItem);
            });
            listItem.appendChild(nestedList);
        }
    });
}

createCommentComponent = (comment) => {
    const container = document.createElement('li');
    container.setAttribute('id', `comment-${comment.id}`)
    container.setAttribute('class', 'comment');

    const userSpan = document.createElement('span');
    userSpan.setAttribute('class', 'user');

    const timestampSpan = document.createElement('span');
    timestampSpan.setAttribute('class', 'timestamp');

    const commentText = document.createElement('p');
    commentText.setAttribute('class', 'comment-text');

    const upvoteCtrl = document.createElement('button');
    upvoteCtrl.setAttribute('class', 'upvote');

    const replyCtrl = document.createElement('button');
    replyCtrl.setAttribute('class', 'reply');

    const spacerSpan = document.createElement('span');

    userSpan.innerText = comment.user;
    spacerSpan.innerText = ' * ';
    timestampSpan.innerText = comment.timestamp;
    commentText.innerText = comment.comment;
    upvoteCtrl.innerText = '^ Upvote';
    replyCtrl.innerText = 'Reply';

    container.appendChild(userSpan);
    container.appendChild(spacerSpan);
    container.appendChild(timestampSpan);
    container.appendChild(commentText);
    container.appendChild(upvoteCtrl);
    container.appendChild(replyCtrl);

    return container;
}