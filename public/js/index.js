// Get DOM elements for the form, comment input, and comment list.

const url = 'http://localhost:8000/backend'

// Get the comments and render list.
document.onreadystatechange = () => {
    if(document.readyState === 'complete') {
        getComments();
    }
}

getComments = () => {
    const commentsDiv = document.getElementById('comments');

    // Make GET request.
    let xmlReq = new XMLHttpRequest();
    xmlReq.open("GET", `${url}/comments`, false);
    xmlReq.send(null);
    let json = JSON.parse(xmlReq.responseText);

    commentsDiv.append(generateComments(json));
}

generateComments = (comments) => {
    const uList = document.createElement('ul');

    comments.forEach(comment => {
        const listItem = createCommentComponent(comment);
        uList.append(listItem);

        if(comment.children) {
            const childList = generateComments(comment.children);
            listItem.append(childList);
        }
    });

    return uList;
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
    upvoteCtrl.setAttribute('class', 'upvote btn btn-link');

    const replyCtrl = document.createElement('button');
    replyCtrl.setAttribute('class', 'reply btn btn-link');

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

validateComment = () => {
    const form = document.querySelector('form[name="comment-form"]');
    const commentText = form.elements['comment-input'].value;

    if(commentText) {
        return true;
    }
    else {
        alert('Must submit a value.');
        return false;
    }
}