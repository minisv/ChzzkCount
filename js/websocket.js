'use strict'

import { getParameterByName } from "./library.js";
import { startTimer, cancelTimer } from "./count.js";


let socket;
let isManualClose = false;

let connectWebSocket = () => {
  const ssID = Math.floor(Math.random() * 10) + 1;
  const serverUrl = "wss://kr-ss"+ssID+".chat.naver.com/chat";
  
  socket  = new WebSocket(serverUrl);
  
  socket.addEventListener("open", async () => {
    console.log("✅ 서버에 연결되었습니다.");
    
    let chatChannelID = getParameterByName("chzzk");
    if (chatChannelID === null || chatChannelID === "") return;
    let option =  { "ver": "2", "cmd": 100, "svcid": "game", "cid": `${chatChannelID}`, "bdy": { "devType":2001, "auth":"READ" }, "tid": 1 };
    socket.send(JSON.stringify(option));
  });
  
  socket.addEventListener("message", async (event) => {
    let data = JSON.parse(event.data);
    if (data.bdy?.[Symbol.iterator]) {
      for (let body of data.bdy) {
        let profile = JSON.parse(body.profile);
        let extras = JSON.parse(body.extras);
        
        if (profile.userRoleCode === "streamer") {
          const command = body.msg.substring(0, body.msg.indexOf(" "));
          const options = body.msg.substring(body.msg.indexOf(" "), body.msg.length);
          switch (command) {
            case "/카운트":
              await startTimer(options);
              break;
            case "/카운트취소":
              await cancelTimer();
              break;
          }
        }
      }
    }
    if (data.cmd === 0) socket.send(JSON.stringify({"ver": "2", "cmd": 10000}));
    else if (data.cmd === 10100) socket.send(JSON.stringify({"ver": "2", "cmd": 0}));
  });
  
  socket.addEventListener("close", () => {
    console.log("❌ 서버와 연결이 끊겼습니다. 자동으로 재 연결을 시도 합니다.");
    if (!isManualClose) connectWebSocket();
  });
  
  socket.addEventListener("error", (error) => {
    console.error("WebSocket 오류:", error);
    console.log("⚠️ 오류 발생: 콘솔을 확인하세요.");
  });
  
}

window.addEventListener("beforeunload", () => {
  isManualClose = true;
  socket.close();
});

connectWebSocket();