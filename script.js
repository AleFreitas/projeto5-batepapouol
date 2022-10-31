let userName = prompt("Insira seu nome de usuário");
//ALL QUERY SELECTORS USED
const choosePublic = document.querySelector(".public");
const choosePrivate = document.querySelector(".private");
const section = document.querySelector("section");
const userSection = document.querySelector(".contact-list");
const sideMenu = document.querySelector(".sidemenu-back");
const inputValue = document.querySelector("textarea");
const sendingTo = document.querySelector(".sending-to");
//contains who will receive this message
let receiver = "Todos";
//contains message privacy value
let messagePrivacy = "public";
//contains all users online in a html format
let userList = "";
//contains all messages from server in a html format
let messageHtml = "";
//contains the last message position
let lastMessage = 0;
//check if the program should scroll messages to the bottom or not
let scrollMessages = true;
//contains the html element of the previous selected contact
let previousContact = document.querySelector(".contact.Todos")

postUserName()
getUsers()
//try to post the chosen name in the API using a post request 
function postUserName() {
    user = { name: userName }
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", user)
    promise.then(userDontExists);
    promise.catch(userAlreadyExists);
}
//there is no user with the chosen name
function userDontExists(){
    //keeps the user online
    setInterval(function(){
        const keepUser = axios.post("https://mock-api.driven.com.br/api/v6/uol/status",user);
        keepUser.catch(userLeft)
    },5000)
    //get messages every 3 seconds
    setInterval(function(){
        let messageHtml = ""
        getMessages();
    },3000)
    //get users every 10 seconds
    setInterval(function(){
        getUsers();
    },10000)
}
//there is already a user with the chosen name
function userAlreadyExists() {
    userName = prompt("Este nome está sendo usado, insira um nome válido");
    postUserName()
}
//the user has left the room
function userLeft(){
    alert("Você perdeu a conexão com a sala");
    window.location.reload()
}
//sends a get request to the API to get all messages
function getMessages() {
    const messages = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    messages.then(buildMessages)
    messages.catch(didntFindMessages)
}
//build all messages html divs in a single variable
function buildMessages(response){
    messageHtml = "<ion-icon name='arrow-down-circle-sharp' onclick='scrollDown()'></ion-icon>";
    for(i=0;i<response.data.length;i++){
        if(response.data[i].type === "status"){
            messageHtml+=`
            <div class="message status message${i}">
                <p>
                    <span class="time">(${response.data[i].time})</span> <span class="name">${response.data[i].from}</span> ${response.data[i].text}
                </p>
            </div>
            `;
        }else if(response.data[i].type === "message"){
            messageHtml+=`
            <div class="message normal-message message${i}">
                <p>
                    <span class="time">(${response.data[i].time})</span> <span class="name">${response.data[i].from}</span> para <span class="name">${response.data[i].to}:</span> ${response.data[i].text}
                </p>
            </div>
            `;
        }
        else if((response.data[i].type === "private_message") && ((userName === response.data[i].to) || (userName === response.data[i].from))){
            messageHtml+=`
            <div class="message private-message message${i}">
                <p>
                    <span class="time">(${response.data[i].time})</span> <span class="name">${response.data[i].from}</span> reservadamente para <span class="name">${response.data[i].to}</span>: ${response.data[i].text}
                </p>
            </div>
            `;
        }
        lastMessage = i;
    }
    showMessages();
}
//puts all divs of messages into section.innerHTML
function showMessages(){
    section.innerHTML=messageHtml
    let showThisMessage = document.querySelector(".message"+lastMessage);
    if(scrollMessages === true){
        scrollMessages = false;
        showThisMessage.scrollIntoView();
    }
}
//error on getMessages()
function didntFindMessages(response){
    alert("Não foi possivel obter as mensagens do servidor");
    window.location.reload()

}
//tells the website to scroll down in the next interval of getMessages()
function scrollDown(){
    scrollMessages = true;
    getMessages();
}
//sends a message with a post request to the API
function sendMessage(){
    messageText = inputValue.value;
    if(messagePrivacy === "public"){
        userMessage = {from:userName,to:receiver,text:messageText,type:"message"}
    }else{
        userMessage = {from:userName,to:receiver,text:messageText,type:"private_message"}
    }
    const message = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",userMessage);
    message.catch(userLeft);
    inputValue.value = "";
    scrollMessages = true;
}
//sends a get request to the API to get online users
function getUsers() {
    //retorna os usuários ativos
    const users = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    users.then(buildUsersList);
}
//build a variable with all online users html divs and call showUsers()
function buildUsersList(response){
    if(receiver === "Todos"){
        userList=`
        <div class="contact Todos selected" data-identifier="participant" onclick="selectContact(this,'Todos')">
            <button class="contact-button">
                <ion-icon name="people"></ion-icon>
                <p>
                    Todos
                </p>
            </button>
            <ion-icon class="check" name="checkmark-sharp"></ion-icon>
        </div>
        `
    }else{
        userList=`
        <div class="contact Todos" data-identifier="participant" onclick="selectContact(this,'Todos')">
            <button class="contact-button">
                <ion-icon name="people"></ion-icon>
                <p>
                    Todos
                </p>
            </button>
            <ion-icon class="check" name="checkmark-sharp"></ion-icon>
        </div>
        `
    }
    for (i=0;i<response.data.length;i++){
        if(receiver === response.data[i].name){
            userList+=`
            <div class="contact ${response.data[i].name} selected" data-identifier="participant" onclick="selectContact(this,'${response.data[i].name}')">
                <button class="contact-button">
                    <ion-icon name="person-circle"></ion-icon>
                    <p>
                        ${response.data[i].name}
                    </p>
                </button>
                <ion-icon class="check hidden" name="checkmark-sharp"></ion-icon>
            </div>
            `
        }else{
            userList+=`
            <div class="contact ${response.data[i].name}" data-identifier="participant" onclick="selectContact(this,'${response.data[i].name}')">
                <button class="contact-button">
                    <ion-icon name="person-circle"></ion-icon>
                    <p>
                        ${response.data[i].name}
                    </p>
                </button>
                <ion-icon class="check hidden" name="checkmark-sharp"></ion-icon>
            </div>
            `
        }
    }
    showUsers()
}
//show online Users on side menu
function showUsers(){
    userSection.innerHTML=userList

}
//hide and show side menu
function toggleSideMenu(){
    sideMenu.classList.toggle("hidden")
}
//toggles privacy options
function togglePrivacy(type){
    if(type === "public"){
        messagePrivacy = "public"
        choosePublic.classList.toggle("hidden")
        choosePrivate.classList.toggle("hidden")
        sendingTo.innerHTML=`Enviando para ${receiver} (publicamente)`
    }else{
        messagePrivacy = "private"
        choosePublic.classList.toggle("hidden")
        choosePrivate.classList.toggle("hidden")
        sendingTo.innerHTML=`Enviando para ${receiver} (reservadamente)`
    }
}
//selects a online user
function selectContact(element,receiverName){
    if(previousContact !== element){
        previousContact.classList.toggle("selected")
        element.classList.toggle("selected");
        previousContact = element;
        receiver = receiverName;
        getUsers()
        if(messagePrivacy === "public"){
            sendingTo.innerHTML=`Enviando para ${receiver} (publicamente)`
        }else{
            sendingTo.innerHTML=`Enviando para ${receiver} (reservadamente)`
        }
    }
}