let userName = prompt("Insira seu nome de usuário");
const section = document.querySelector("section");
const userSection = document.querySelector(".contact-list");
const inputValue = document.querySelector("textarea");

//contains all users online in a html format
let userList = "";
//contains all messages from server in a html format
let messageHtml = "";
//contains the last message position
let lastMessage = 0;
//check if the program should scroll messages to the bottom or not
let scrollMessages = true;

postUserName()
function postUserName() {
    //tenta postar o nome do usuário
    user = { name: userName }
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", user)
    promise.then(userDontExists);
    promise.catch(userAlreadyExists);
    //se não existir alerta seja bem vindo
    //se existir atualiza userName e chama a função de novo
}
function userDontExists(){
    setInterval(function(){
        const keepUser = axios.post("https://mock-api.driven.com.br/api/v6/uol/status",user)
    },5000)
    //get messages every 3 seconds
    setInterval(function(){
        let messageHtml = ""
        getMessages();
    },3000)
    //get users every 3 seconds
    setInterval(function(){
        getUsers();
    },3000)
}
function userAlreadyExists() {
    userName = prompt("Este nome está sendo usado, insira um nome válido");
    postUserName()
}
//busca as mensagens para mostrar
function getMessages() {
    const messages = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    messages.then(buildMessages)
    messages.catch(didntFindMessages)
}
//constroi as mensagens em uma variavel messageHtml
function buildMessages(response){
    messageHtml = "";
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
        else if(response.data[i].type === "private_message"){
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
function showMessages(){
    section.innerHTML=messageHtml
    let showThisMessage = document.querySelector(".message"+lastMessage);
    if(scrollMessages === true){
        scrollMessages = false;
        showThisMessage.scrollIntoView();
    }
}
function didntFindMessages(response){
    alert("Não foi possivel obter as mensagens do servidor")
}
function sendMessageToAll(){
    messageText = inputValue.value;
    userMessage = {from:userName,to:"Todos",text:messageText,type:"message"}
    const message = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",userMessage);
    inputValue.value = "";
    scrollMessages = true;
}
function getUsers() {
    //retorna os usuários ativos
    const users = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    users.then(buildUsersList);
}
function buildUsersList(response){
    userList=`
    <div class="contact">
        <button class="contact-button">
            <ion-icon name="people"></ion-icon>
            <p>
                Todos
            </p>
        </button>
        <ion-icon class="check hidden" name="checkmark-sharp"></ion-icon>
    </div>
    `
    for (i=0;i<response.data.length;i++){
        userList+=`
        <div class="contact">
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
    showUsers()
}
function showUsers(){
    userSection.innerHTML=userList

}