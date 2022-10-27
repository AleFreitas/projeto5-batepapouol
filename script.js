let userName = prompt("Insira seu nome de usuário");
const section = document.querySelector("section")
postUserName()
function postUserName() {
    console.log(userName)
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
    setInterval(function(){
        getMessages();
    },3000)
}
function userAlreadyExists() {
    userName = prompt("Este nome está sendo usado, insira um nome válido");
    postUserName()
}
function getMessages() {
    const messages = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    messages.then(showMessages)
    messages.catch(didntFindMessages)
    //busca as mensagens para mostrar
}
function showMessages(response){
    section.innerHTML="";
    console.log(response.data)
    for(i=0;i<response.data.length;i++){
        if(response.data[i].type === "status"){
            section.innerHTML+=`
            <div class="message status message${i}">
                <p>
                    <span class="time">(${response.data[i].time})</span> <span class="name">${response.data[i].from}</span> ${response.data[i].text}
                </p>
            </div>
            `;
        }else if(response.data[i].type === "message"){
            section.innerHTML+=`
            <div class="message normal-message message${i}">
                <p>
                    <span class="time">(${response.data[i].time})</span> <span class="name">${response.data[i].from}</span> para <span class="name">${response.data[i].to}:</span> ${response.data[i].text}
                </p>
            </div>
            `;
        }
        else if(response.data[i].type === "private_message"){
            section.innerHTML+=`
            <div class="message private-message message${i}">
                <p>
                    <span class="time">(${response.data[i].time})</span> <span class="name">${response.data[i].from}</span> reservadamente para <span class="name">${response.data[i].to}</span>: ${response.data[i].text}
                </p>
            </div>
            `;
        }
        let showThisMessage = document.querySelector(".message"+i);
        showThisMessage.scrollIntoView();
    }
}
function didntFindMessages(response){
    alert("Não foi possivel obter as mensagens")
}
function getUsers() {
    //retorna os usuários ativos
}
