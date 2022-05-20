let selectedRoom = ''
colorPicker.value = '#FF00FF'
colorPicker.addEventListener('change',e=>{
    document.documentElement.style.setProperty('--personal-color', `${colorPicker.value}`);
})
signUp.style.display = 'none'

btnSignIn.addEventListener('click',e=>{
    signIn.style.display = 'block'
    signUp.style.display = 'none'
})

btnSignUp.addEventListener('click',e=>{
    signUp.style.display = 'block'
    signIn.style.display = 'none'
})

let wsClient =  new WebSocket(`ws://localhost:6060`);
confirmSignIn.addEventListener('click',e=>{
    if(!inMail.value || !inPass.value){
        alert('complete all the fields')
    }else{
        let payLoad = {
            mode: 'signIn',
            mail: inMail.value,
            pass: inPass.value,
            color: colorPicker.value
        }
        wsClient.send(JSON.stringify(payLoad));
    }
    
})

confirmSignUp.addEventListener('click',e=>{
    if(!upNick.value || !upMail.value || !upPass.value){
        alert('complete all the fields')
    }else{
        let payLoad = {
            mode: 'signUp',
            nickName: upNick.value,
            mail: upMail.value,
            pass: upPass.value,
            color: colorPicker.value
        }
        wsClient.send(JSON.stringify(payLoad));
    }
})

wsClient.onmessage = function (event) {
    var data = JSON.parse(event.data);
    console.log("Server Response: ", data);
    switch(data.mode){
        case 'signUp':
            if(data.action){
                firstPage.style.display='none'
                secondPage.style.display='block'
                data.rooms.forEach(room=>{
                    //console.log(room)
                    document.querySelector('#listChatrooms').innerHTML += `<li onclick="selectRoom('${room}')">${room}</li> <br>`
                })
                userInfo.innerText = `${data.nickName}`
                document.querySelector('#screenTittle').innerText = `Select a chat room`   
            }
        break;
        case 'signIn':
            if(data.action){
                firstPage.style.display='none'
                secondPage.style.display='block'
                data.rooms.forEach(room=>{
                    //console.log(room)
                    document.querySelector('#listChatrooms').innerHTML += `<li onclick="selectRoom('${room}')">${room}</li> <br>`
                })
                userInfo.innerText = `${data.nickName}`
                document.querySelector('#screenTittle').innerText = `Select a chat room` 
            }else{
                alert(data.message)
            }
        break;
        case 'selectRoom':
            if(data.action){
                selectedRoom = data.SelectedRoom
                document.querySelector('#screenTittle').innerText = `your room is: ${selectedRoom}`
            }
        break;
        case 'createRoom':
            if(data.action){
                selectedRoom = data.newRoom
                document.querySelector('#screenTittle').innerText = `your room is: ${selectedRoom}`
                document.querySelector('#listChatrooms').innerHTML = ''
                data.rooms.forEach(room=>{
                    //console.log(room)
                    document.querySelector('#listChatrooms').innerHTML += `<li onclick="selectRoom('${room}')">${room}</li> <br>`
                })
            }
        break;
        case 'sendMessage':
            if(data.action){
                console.log('OK')
                messageList.innerHTML += `<li style="color: ${data.messageColor}"}> <div>send by: ${data.nickName}</div> <div>message: ${data.message}</div></li>`
            }
        break;
        
    }
}
document.querySelector('.screen').addEventListener('click',e=>{
    if(!selectedRoom){
        alert('pls select a chat room')
    }
})
document.querySelector('.messagesInput').addEventListener('click',e=>{
    if(!selectedRoom){
        alert('pls select a chat room')
    }
})
const selectRoom = (roomName) => {

    let payLoad = {
        mode: 'selectRoom',
        SelectedRoom: roomName
    }
    wsClient.send(JSON.stringify(payLoad));
}
addRoom.addEventListener('click', e=>{
    inputNewRoom.style.display = 'block'
})
confirmAddRoom.addEventListener('click',e=>{
    let payLoad = {
        mode: 'createRoom',
        newRoom: newRoomName.value
    }
    wsClient.send(JSON.stringify(payLoad));
    inputNewRoom.style.display = 'none'
})

btnSendMessage.addEventListener('click',e=>{
    let payLoad = {
        mode: 'sendMessage',
        message: newMessage.value,
        messageColor: colorPickerText.value
    }
    wsClient.send(JSON.stringify(payLoad));
    newMessage.value = ''
})

