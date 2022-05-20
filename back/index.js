
const WebSocketServer = require('ws');

 

const wss = new WebSocketServer.Server({ port: 6060 })
let rooms = ['Astrology', 'Love', 'Talk', 'Books', 'Movies', 'Games']
const usersInfo = []
wss.on("connection", ws => {
    ws.id = wss.clients.size
    console.log("new client connected", ws.id);
    
    ws.on("message", message => {
        var data = JSON.parse(message)
        console.log(typeof data)
        console.log(data.mode)
        switch(data.mode){
            case 'signUp':
                usersInfo.push(data)
                data.rooms = rooms
                data.action = true
                ws.nickName = data.nickName
                ws.send(JSON.stringify(data))
            break;
            case 'signIn':
                usersInfo.forEach(obj=>{
                    //console.log(obj)
                    if(obj.mail === data.mail && obj.pass === data.pass){
                        data.rooms = rooms
                        data.action = true
                        data.nickName = obj.nickName
                        ws.send(JSON.stringify(data))
                    }else{
                        ws.send(JSON.stringify({mode:'signIn',action:false,message:'invalid credentials'}))
                    }
                })
            break;
            case 'selectRoom':
                ws.room = data.SelectedRoom
                data.rooms = rooms
                data.action = true
                ws.send(JSON.stringify(data))
            break;
            case 'createRoom':
                rooms.push(data.newRoom)
                ws.room = data.newRoom
                data.rooms = rooms
                data.action = true
                ws.send(JSON.stringify(data))
            break;
            case 'sendMessage':

                wss.clients.forEach((client) => {
                    if(client.room === ws.room){
                        client.send(JSON.stringify({mode:data.mode, nickName: ws.nickName, message: data.message, action:true, messageColor:data.messageColor}))
                    }
                })
                
            break;

        }
    });
    
    ws.on("close", () => {
        console.log("the client has disconnected");
    });
    
    ws.onerror = function () {
        console.log("Some Error occurred")
    }
});

console.log("The WebSocket server is running on port 6060");