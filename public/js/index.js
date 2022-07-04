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
    xmlReq.open('GET', `${url}/comments`, false);
    xmlReq.send(null);
    let json = JSON.parse(xmlReq.responseText);

    commentsDiv.append(generateComments(json));
}

generateComments = (comments) => {
    const uList = document.createElement('ul');
    uList.style.listStyle = 'none';

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

    // Create elements.
    const userSpan = document.createElement('span');
    const timestampSpan = document.createElement('span');
    const commentText = document.createElement('p');
    const upvoteCtrl = document.createElement('button');
    const replyCtrl = document.createElement('button');
    const replyDiv = document.createElement('div');
    const replyTextArea = document.createElement('textarea');
    const replyCommentBtn = document.createElement('button');
    const spacerSpan = document.createElement('span');

    // Set the attributes.
    userSpan.setAttribute('class', 'user');
    timestampSpan.setAttribute('class', 'text-muted');
    commentText.setAttribute('class', 'comment-text');
    upvoteCtrl.setAttribute('class', 'link-btn');

    replyTextArea.setAttribute('class', 'form-control');
    replyTextArea.setAttribute('rows', '3');
    replyCommentBtn.setAttribute('class', 'btn btn-primary');

    replyDiv.appendChild(replyTextArea);
    replyDiv.appendChild(document.createElement('br'));
    replyDiv.appendChild(replyCommentBtn);

    replyCtrl.setAttribute('class', 'link-btn');
    replyDiv.setAttribute('hidden', '')

    // Onclick events.
    upvoteCtrl.onclick = () => {
        // Make PUT request.
        const xmlReq = new XMLHttpRequest();
        xmlReq.open('PUT', `${url}/upvote/${comment.id}`, false);
        xmlReq.setRequestHeader('Content-type', 'application/json')
        xmlReq.send(null);
        window.location.reload();
    };
    replyCtrl.onclick = () => {
        if(replyDiv.hasAttribute('hidden')) {
            replyDiv.removeAttribute('hidden');
            replyTextArea.focus();
        }
        else {
            replyDiv.setAttribute('hidden', '');
        }   
    };
    replyCommentBtn.onclick = () => {
        // PUT request.
        const xmlReq = new XMLHttpRequest();
        xmlReq.open('PUT', `${url}/addreply/${comment.id}`)
        xmlReq.setRequestHeader('Accept', 'application/json');
        xmlReq.setRequestHeader('Content-Type', 'application/json');
        xmlReq.send(JSON.stringify(
            { 'reply-input': replyTextArea.value }
        ));

        replyDiv.setAttribute('hidden', '');
        window.location.reload();
    }

    // Set comment data.
    userSpan.innerText = comment.user;
    spacerSpan.innerText = ' • ';
    timestampSpan.innerText = comment.timestamp;
    commentText.innerText = comment.comment;
    upvoteCtrl.innerText = comment.upvotes > 0? `▲ Upvote (${comment.upvotes})` : '▲ Upvote';
    replyCtrl.innerText = 'Reply';
    replyCommentBtn.innerText = 'Reply';

    // Construct the component.
    container.appendChild(userSpan);
    container.appendChild(spacerSpan);
    container.appendChild(timestampSpan);
    container.appendChild(commentText);
    container.appendChild(upvoteCtrl);
    container.appendChild(replyCtrl);
    container.appendChild(replyDiv);

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