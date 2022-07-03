// Get DOM elements for the form, comment input, and comment list.

const url = 'http://localhost:8000/backend'

const commentForm = document.querySelector('form')
const input = document.getElementById('comment')
const comments = document.getElementById('comments');

// Get the comments and render list.
document.onreadystatechange = () => {
    if(document.readyState === 'complete') {
        getComments();
    }
}

getComments = () => {
    // Make GET request.
    let xmlReq = new XMLHttpRequest();
    xmlReq.open("GET", `${url}/comments`, false);
    xmlReq.send(null);
    let json = JSON.parse(xmlReq.responseText);

    // Create list elements.
    json.forEach(comment => {
        const listItem = document.createElement('li');    
        listItem.innerHTML = comment['comment'];
        comments.appendChild(listItem);
    });
}

// Handle form submit/post.
commentForm.onsubmit = (event) => {
    // event.prevenDefault(); // Prevents the page from refreshing.
    addComment(input.value);
}
function addComment(comment) {
    // Make post request.
}