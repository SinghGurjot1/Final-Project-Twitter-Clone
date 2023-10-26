// API URL's

const apiURLUser = "https://twitter-clone-d2717-default-rtdb.firebaseio.com/users.json" 
const apiURLFeed = "https://twitter-clone-d2717-default-rtdb.firebaseio.com/feed.json" 


//DOM Elements

const loggedIn = false;

const mainPage = document.querySelector(".main-page");
const loginPage = document.querySelector(".login-page");
const middleContent = document.querySelector(".middle-content");
const btnTop = document.querySelector(".btn-top");
const newsFeedPage = document.querySelector(".feeds-page");
const loginModel = document.querySelector(".login-model");
const modelX = document.querySelector(".login-model i");
const signupBtn = document.querySelector(".signup-btn");
const signUpModel = document.querySelector(".signup-model");
const modelX2 = document.querySelector(".signup-model i");
const loginModel2 = document.querySelector(".login-model2");
const modelX3 = document.querySelector(".login-model2 i");
const postBtn = document.querySelector(".post-btn");
const modalWrapper = document.querySelector(".modal-wrapper");
const modal = document.querySelector(".modal");
const postModalX = document.querySelector(".modal-header i");
const modalPostBtn = document.querySelector(".modal-header button");
const modalFooterPlus = document.querySelector(".modal-footer span");
const modalInput = document.querySelector(".modal-input");
const user = document.querySelector(".user");
const sidebar = document.querySelector(".sidebar");
const sidebarWrapper = document.querySelector(".sidebar-wrapper");
const xBtn = document.querySelector(".sidebar-header i");
const toggle = document.querySelector(".toggle");
const circle = document.querySelector(".circle");
const inputUserInfo = document.querySelector('.user-info');
const signOutButton = document.querySelector(".sign-out-button");
const signInNow = document.querySelector(".sign-in-now");
const followBtn = document.querySelector(".follow-btn");
 
 

// Adding User to the Firebase when signing up a new user
function addUser() {
    if (inputUserInfo.value === '') return;
    // Send a POST request to add a new to-do item

    fetch(apiURLUser, {
        method: 'POST',   
        body: JSON.stringify({ User: inputUserInfo.value, email: email.value, Userinfo: username.value }),
        headers: {
            'Content-Type': 'application/json',
        },
        
    })
        .then(response => response.json())
        .then(data => {
            addTodoItem(data);
            input.value = '';
            location.reload();
        })
        .catch(error => console.error('Error adding todo:', error));
}

const goToLoginPage = () => {
    mainPage.style.display='none';
    loginPage.style.display='grid';
};

middleContent.addEventListener('click',e=> {
    if(e.target.classList[1] === 'main-btn'){
        goToLoginPage();
    }
});


// Adding Post content to the firebase

function addFeed(data) {
     
    const textToPost = modalInput.value.trim();
    alert("addUser "  + inputUserInfo.value   + " value")
    if (inputUserInfo.value === '') return;
    // Send a POST request to add a new to-do item

    fetch(apiURLFeed, {
        method: 'POST',   
        body: JSON.stringify({text: data , createUser: inputUserInfo.value , createDateTime: "12/12/2023 5:30 PM" }),
        headers: {
            'Content-Type': 'application/json',
        },
        
    })
        .then(response => response.json())
        .then(responsedata => {
            console.log('Data posted to Firebase', responsedata);
            modal.style.display = 'none';
            modalWrapper.classList.remove('modal-wrapper-display');
            displayPosts();
        })
        .catch(error => console.error('Error adding todo:', error));
}

modalPostBtn.addEventListener('click', () => {
    const textToPost = modalInput.value;
    if (textToPost.trim() !== '') {
        addFeed(textToPost);
    }
});

// Function to delete the post

function deletePost(postId) {
    const deleteURL = `https://twitter-clone-d2717-default-rtdb.firebaseio.com/feed/${postId}.json`;

    fetch(deleteURL, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            // Post deleted successfully, you can handle this in your UI
            console.log('Post deleted successfully');
            const postElement = document.querySelector('[data-post-id=""$[postId]');
            if(postElement){
                postElement.remove();
            }
            else{
                console.error('Error deleting post');
            }
            // After deleting the post, you may want to refresh the post list
            // displayPosts();
        } else {
            console.error('Error deleting post');
        }
        // location.reload();
    })
    .catch(error => console.error('Error deleting post:', error));

    displayPosts()
}

// Function to Update the Post

function updatePost(postId, updatedText) {
    const updateURL = `https://twitter-clone-d2717-default-rtdb.firebaseio.com/feed/${postId}.json`;

    const updatedPostData = {
        text: updatedText , createUser: inputUserInfo.value , createDateTime: "12/12/2023 5:30 PM" 
       
    };

    fetch(updateURL, {
        method: 'PUT',  // You might need to use a different method depending on your Firebase setup
        body: JSON.stringify(updatedPostData),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            // Post updated successfully, you can handle this in your UI
            console.log('Post updated successfully');
            // After updating the post, you may want to refresh the post list
            displayPosts();
        } else {
            console.error('Error updating post');
        }
    })
    .catch(error => console.error('Error updating post:', error));
}



// Display the Posts on the front end

function displayPosts(){
    const postList = document.getElementById('post-list');
    postList.innerHTML = '';
    alert("display posts")
    fetch(apiURLFeed)
    .then((response) => response.json())
    .then((data) => {
        for (const postId in data) {
            const post = data[postId];
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            

            const timestamp = new Date(post.timestamp);
            const formattedDate = timestamp.toLocaleString();

            postElement.innerHTML = `
            <div class="post-content">
            <p> ${post.createUser}</p>
            <p></p>
            
            <p>${post.text}</p>
            </div>
            <div class = "post-actions">
                <i class="far fa-comment"> </i>
                <i class="fas fa-retweet"> </i>
                <i class="far fa-heart"> </i>
                <i class="fas fa-share-alt"> </i>
                <button class="delete-button" data-post-id="${postId}">Delete</button>
                <button class="update-button" data-post-id="${postId}">Update</button>
            </div>
            `;

            const deleteButton = postElement.querySelector('.delete-button');
            const updateButton = postElement.querySelector('.update-button');

            

            deleteButton.addEventListener('click', () => {
                const postId = deleteButton.getAttribute('data-post-id');
                deletePost(postId);
            });

            updateButton.addEventListener('click', () => {
                const postId = updateButton.getAttribute('data-post-id');
                const updatedText = prompt('Update you Post');
                if(updatedText !== null){
                    updatePost(postId, updatedText);
                }
            });

            postList.appendChild(postElement);
                       
        }
    })
    .catch((error) => console.error('Error fetching posts', error));
}

displayPosts();


 // Event Listener for Login button

btnTop.addEventListener('click',()=> {
    const inputUserInfo = document.querySelector('.user-info');
    const inputPassword = document.querySelector('.password');
    const userName = inputUserInfo.value;
    // const inputUserinfo = document.querySelector('.user-info');
    const userFound = false 
 
    // To check if the user exists in the database only then allow login
    fetch(apiURLUser)
    .then(response => response.json())
    .then(data => { 
        for (const recordId in data) { 
            if (inputUserInfo.value == data[recordId].Userinfo) { 
                mainPage.style.display = 'none';
                newsFeedPage.style.display = 'block';
                userFound = true
                loggedIn = true
            } else{
                mainPage.style.display = 'grid';
                newsFeedPage.style.display = 'none';
            }     
        }
        
    })
    .catch(error => console.error("Error fetching data", error)); 
    if(inputUserInfo.value !=="" && inputPassword.value !== ""){
        mainPage.style.display = 'none';
        newsFeedPage.style.display = 'block';
    }else{
        loginModel.style.display='block';
    }
});

modelX.addEventListener("click", ()=> {
    loginModel.style.display = 'none';
});

signupBtn.addEventListener("click", () => {

    const loginUserName = document.querySelector(".login-user-name");
    const loginUserEmail = document.querySelector(".login-user-email");
    const loginUserInfo = document.querySelector(".login-user-info");
    const loginPassword = document.querySelector(".login-password");

  alert("loginUserName "  + loginUserName.value)

    if(loginUserName.value !=="" && loginUserEmail.value !=="" && loginUserInfo.value !=="" && loginPassword.value !=="") {
        loginPage.style.display='none';
        mainPage.style.display="grid";
        loginModel2.style.display="block";

        fetch(apiURLUser, {
            method: 'POST',   
            body: JSON.stringify({ User: loginUserName.value, email: loginUserEmail.value, Userinfo: loginUserInfo.value }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                addTodoItem(data);
                input.value = '';
                location.reload();
            })
            .catch(error => console.error('Error adding todo:', error));
            

    }else{
        signUpModel.style.display='block';
        
    }
});

modelX2.addEventListener("click", ()=> {
    signUpModel.style.display = 'none';
});

modelX3.addEventListener("click", ()=> {
    loginModel2.style.display = 'none';
});

// News Feed Page

// Post Modal

postBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    modalWrapper.classList.add("modal-wrapper-display");

    if(modalInput.value !=="") {
        modalInput.value="";
        changeOpacity(0.5);
    }
});

const changeOpacity = (x) => {
    modalPostBtn.style.opacity = x;
    modalFooterPlus.style.opacity = x;
}

postModalX.addEventListener('click', () => {
    modal.style.display = 'none';
    modalWrapper.classList.remove('modal-wrapper-display');
});

modalInput.addEventListener("keypress", e => {
    if(e.target.value !== '') {
        changeOpacity(1);
    }
});

modalInput.addEventListener("blur", (e) => {
    if(e.target.value === '') {
        changeOpacity(0.5);
    }
});


// Sidebar


user.addEventListener("click",() => {
    sidebar.classList.add('sidebar-display');
    sidebarWrapper.classList.add('sidebar-wrapper-display');
} );

xBtn.addEventListener("click", () => {
    sidebar.classList.remove("sidebar-display");
    sidebarWrapper.classList.remove("sidebar-wrapper-display");
});

// Dark-Mode

const darkElements1 = document.querySelectorAll(".dark-mode-1");
const darkElements2 = document.querySelectorAll(".dark-mode-2");
const lightText = document.querySelectorAll(".light-text");
const borders = document.querySelectorAll(".border");

toggle.addEventListener("click",() => {
    circle.classList.toggle('move');
    Array.from(darkElements1).map(darkEl1 => darkEl1.classList.toggle('dark-1'));
    Array.from(darkElements2).map(darkEl2 => darkEl2.classList.toggle('dark-2'));
    Array.from(lightText).map((lightText) => lightText.classList.toggle('light'));
    Array.from(border).map((border) => border.classList.toggle('border-color'));
});

signOutButton.addEventListener("click", () => {
    mainPage.style.display = 'grid';
    newsFeedPage.style.display = 'none';
});

signInNow.addEventListener("click", () => {
    loginPage.style.display = 'none';
    mainPage.style.display = 'grid';
});



