// Get DOM elements for the form, comment input, and comment list.

const url = 'http://localhost:8000/backend';

// Get the comments and render list.
document.onreadystatechange = () => {
    if(document.readyState === 'complete') {
        getComments();
    }
}

/**
 * Performs GET request to backend for comments.
 */
getComments = () => {
    const commentsDiv = document.getElementById('comments');

    // Make GET request.
    let xmlReq = new XMLHttpRequest();
    xmlReq.open('GET', `${url}/comments`, false);
    xmlReq.send(null);
    let json = JSON.parse(xmlReq.responseText);

    // Create list elements.
    commentsDiv.append(generateComments(json));
}

/**
 * Recursive function to create comment components.
 * @param {Object[]} comments comments in JSON format.
 */
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

/**
 * Creates HTML+Bootstrap component for a comment.
 * @param {Object} comment the comment to use for the component.
 */
createCommentComponent = (comment) => {
    const container = document.createElement('li');
    container.setAttribute('id', `comment-${comment.id}`)

    let classes = '';
    if(comment.id.length === 1 && comment.children.length > 0) {
        // Parent with children.
        classes = 'comment-with-child';
    }
    else if(comment.id.length > 1) {
        // Child
        classes = 'comment-child';
    }
    else {
        // Parent without children.
        classes = 'comment-without-child'
    }
    container.setAttribute('class', classes);

    // Create Bootstrap grid elements
    const avatarDiv = document.createElement('div');
    const commentInfoDiv = document.createElement('div');
    // Need 3 rows for comment info.
    const userTimestampDiv = document.createElement('div');
    const commentTextDiv = document.createElement('div');
    const commentCtrlsDiv = document.createElement('div');

    // Create comment elements.
    const userSpan = document.createElement('span');
    const timestampSpan = document.createElement('span');
    const commentText = document.createElement('p');
    const upvoteBtn = document.createElement('button');
    const replyBtn = document.createElement('button');
    const replySectionDiv = document.createElement('div');
    const replyTextArea = document.createElement('textarea');
    const replyCommentBtn = document.createElement('button');
    const spacerSpan = document.createElement('span');

    // Set the attributes.
    avatarDiv.setAttribute('class', 'avatar');
    commentInfoDiv.setAttribute('class', 'col');

    userTimestampDiv.setAttribute('class', 'row');
    commentTextDiv.setAttribute('class', 'row');
    commentCtrlsDiv.setAttribute('class', 'row');

    userSpan.setAttribute('class', 'user');
    spacerSpan.setAttribute('class', 'col-auto');
    timestampSpan.setAttribute('class', 'timestamp');
    commentText.setAttribute('class', 'comment-text');
    upvoteBtn.setAttribute('class', 'upvote-btn');

    replyTextArea.setAttribute('class', 'form-control');
    replyTextArea.setAttribute('rows', '3');
    replyCommentBtn.setAttribute('class', 'btn btn-primary');

    replySectionDiv.appendChild(replyTextArea);
    replySectionDiv.appendChild(document.createElement('br'));
    replySectionDiv.appendChild(replyCommentBtn);

    replyBtn.setAttribute('class', 'reply-btn');
    replySectionDiv.setAttribute('hidden', '')

    // Onclick events.
    upvoteBtn.onclick = () => {
        // Make PUT request.
        const xmlReq = new XMLHttpRequest();
        xmlReq.open('PUT', `${url}/upvote/${comment.id}`, false);
        xmlReq.setRequestHeader('Content-type', 'application/json')
        xmlReq.send(null);
        window.location.reload();
    };
    replyBtn.onclick = () => {
        if(replySectionDiv.hasAttribute('hidden')) {
            replySectionDiv.removeAttribute('hidden');
            replyTextArea.focus();
        }
        else {
            replySectionDiv.setAttribute('hidden', '');
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

        replySectionDiv.setAttribute('hidden', '');
        window.location.reload();
    };

    // Set comment data.
    avatarDiv.innerHTML = `<img src="${comment.avatar}">`
    userSpan.innerText = comment.user;
    spacerSpan.innerHTML = '•';
    timestampSpan.innerText = comment.timestamp;
    commentText.innerText = comment.comment;
    upvoteBtn.innerText = comment.upvotes > 0? `▲ Upvote (${comment.upvotes})` : '▲ Upvote';
    replyBtn.innerText = 'Reply';
    replyCommentBtn.innerText = 'Reply';

    // Construct the component.
    userTimestampDiv.appendChild(userSpan);
    userTimestampDiv.appendChild(spacerSpan);
    userTimestampDiv.appendChild(timestampSpan);

    commentTextDiv.appendChild(commentText);

    commentCtrlsDiv.appendChild(upvoteBtn);
    commentCtrlsDiv.appendChild(replyBtn);
    commentCtrlsDiv.appendChild(replySectionDiv);

    commentInfoDiv.appendChild(userTimestampDiv);
    commentInfoDiv.appendChild(commentTextDiv);
    commentInfoDiv.appendChild(commentCtrlsDiv);

    container.appendChild(avatarDiv);
    container.appendChild(commentInfoDiv);

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