let userName = prompt("Insira seu nome de usuário");
postUserName()
getMessages()
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
    alert("seja bem vindo")
}
function userAlreadyExists() {
    userName = prompt("Este nome está sendo usado, insira um nome válido");
    postUserName()
}
function getMessages() {
    //busca as mensagens para mostrar
}
function getUsers() {
    //retorna os usuários ativos
}
