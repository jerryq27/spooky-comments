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
    const upvoteBtn = document.createElement('button');
    const replyBtn = document.createElement('button');
    const replySectionDiv = document.createElement('div');
    const replyTextArea = document.createElement('textarea');
    const replyCommentBtn = document.createElement('button');
    const spacerSpan = document.createElement('span');

    // Set the attributes.
    userSpan.setAttribute('class', 'user');
    timestampSpan.setAttribute('class', 'text-muted');
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
    userSpan.innerText = comment.user;
    spacerSpan.innerHTML = '&nbsp;&nbsp;•&nbsp;&nbsp;';
    timestampSpan.innerText = comment.timestamp;
    commentText.innerText = comment.comment;
    upvoteBtn.innerText = comment.upvotes > 0? `▲ Upvote (${comment.upvotes})` : '▲ Upvote';
    replyBtn.innerText = 'Reply';
    replyCommentBtn.innerText = 'Reply';

    // Construct the component.
    container.appendChild(userSpan);
    container.appendChild(spacerSpan);
    container.appendChild(timestampSpan);
    container.appendChild(commentText);
    container.appendChild(upvoteBtn);
    container.appendChild(replyBtn);
    container.appendChild(replySectionDiv);

    // Insert CSS pseudo-class for bullet images.
    const listImgRule = `#${container.getAttribute('id')} {
        background: url("/${comment.avatar}") no-repeat;
        background-size: 35px 35px;
    }`;
    document.styleSheets[0].insertRule(listImgRule, 0);

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