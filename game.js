// 初始化腾讯云开发
const app = tcb.init({
    env: "YOUR_ENV_ID" // 稍后替换为您的环境ID
});

// 微信登录功能
document.getElementById("loginBtn").addEventListener("click", async () => {
    try {
        const auth = app.auth();
        await auth.signInWithRedirect(); // 使用重定向方式登录
    } catch (err) {
        console.error("微信登录失败", err);
        alert("登录失败，请重试");
    }
});

// 监听登录状态
app.auth().onLoginStateChanged((user) => {
    if (user) {
        // 用户已登录，进入游戏大厅
        showGameLobby(user);
    } else {
        // 未登录，显示登录按钮
        document.getElementById("loginSection").style.display = "block";
    }
});

// 显示游戏大厅
function showGameLobby(user) {
    const gameArea = document.getElementById("gameArea");
    gameArea.innerHTML = `
        <h2>欢迎，${user.nickName}!</h2>
        <button id="createRoomBtn">创建房间</button>
        <button id="joinRoomBtn">加入房间</button>
    `;

    document.getElementById("createRoomBtn").addEventListener("click", () => createRoom(user));
    document.getElementById("joinRoomBtn").addEventListener("click", () => joinRoom(user));
}

// 创建房间
function createRoom(user) {
    // 生成房间号：6位随机数
    const roomId = Math.floor(100000 + Math.random() * 900000);
    const gameArea = document.getElementById("gameArea");
    gameArea.innerHTML = `
        <h2>房间号：${roomId}</h2>
        <p>等待玩家加入...</p>
        <div id="playersList"></div>
        <button id="startGameBtn">开始游戏</button>
    `;

    // 保存房间信息到腾讯云数据库
    const db = app.database();
    db.collection("rooms").doc(roomId.toString()).set({
        host: user.openid,
        players: [{
            openid: user.openid,
            nickname: user.nickName,
            avatar: user.avatarUrl
        }],
        status: "waiting"
    });

    // 开始游戏按钮
    document.getElementById("startGameBtn").addEventListener("click", () => startGame(roomId));
}

// 开始游戏
function startGame(roomId) {
    alert("游戏开始！房间号：" + roomId);
    // 实际开发中，这里需要初始化游戏状态
}

// 加入房间
function joinRoom(user) {
    const roomId = prompt("请输入房间号：");
    if (roomId && roomId.length === 6) {
        const db = app.database();
        const roomRef = db.collection("rooms").doc(roomId);
        
        // 跳转到房间等待页面
        const gameArea = document.getElementById("gameArea");
        gameArea.innerHTML = `
            <h2>房间号：${roomId}</h2>
            <p>等待房主开始游戏...</p>
            <div id="playersList"></div>
        `;
    } else {
        alert("房间号必须是6位数字");
    }
}