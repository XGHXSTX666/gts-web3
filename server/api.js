require("dotenv").config()

const express = require("express")

const { getUser, updateUser, getDB } = require("../db/db")
const { rateLimit } = require("../security/guard")

const app = express()

app.use(express.json())

app.get("/", (req,res)=>{
    res.send(`
<!DOCTYPE html>
<html>
<head>
<title>GTS GAME</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{
    margin:0;
    background:#0d0d0d;
    color:white;
    font-family:sans-serif;
    text-align:center;
}

.card{
    margin-top:60px;
}

button{
    padding:15px 30px;
    font-size:18px;
    border:0;
    border-radius:12px;
    background:#00ff88;
    cursor:pointer;
}

.box{
    margin:10px;
    font-size:18px;
}
</style>
</head>

<body>

<div class="card">
    <h1>🌍 GTS WEB3 GAME</h1>

    <div class="box" id="balance">Balance: ...</div>
    <div class="box" id="xp">XP: ...</div>
    <div class="box" id="level">Level: ...</div>

    <button onclick="mine()">⛏ Mine</button>
</div>


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("SERVER RUNNING ON PORT " + PORT)
})

<script>
const id = 123; // لاحقاً رح نربطه مع Telegram ID

async function load(){
    const res = await fetch("/user", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({id})
    });

    const data = await res.json();

    document.getElementById("balance").innerText = "Balance: " + data.balance;
    document.getElementById("xp").innerText = "XP: " + data.xp;
    document.getElementById("level").innerText = "Level: " + data.level;
}

async function mine(){
    await fetch("/mine", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({id})
    });

    load();
}

load();
</script>

</body>
</html>
    `)
})

// USER
app.post("/user", (req,res)=>{
    const {id} = req.body

    let user = getUser(id)

    res.json(user)
})

// MINE
app.post("/mine",(req,res)=>{
    const { id } = req.body

    if(!rateLimit(id)){
        return res.json({error:"SLOW"})
    }

    const user = getUser(id)

    let xpGain = user.vip ? 2 : 1

    let xp = user.xp + xpGain
    let level = user.level

    let reward = 1

    if(xp >= level * 10){
        level++
        reward += 2
    }

    updateUser(id,{
        balance: user.balance + reward,
        xp,
        level
    })

    res.json({
        ok:true,
        reward,
        level
    })
})

// BUY
app.post("/buy",(req,res)=>{
    const { id, item, price } = req.body

    const user = getUser(id)

    if(user.balance < price){
        return res.json({error:"NO_MONEY"})
    }

    const inv = user.inventory || []

    inv.push(item)

    updateUser(id,{
        balance: user.balance - price,
        inventory: inv
    })

    res.json({ok:true})
})

// LEADERBOARD
app.get("/leaderboard",(req,res)=>{
    const db = getDB()

    const top = Object.values(db.users)
        .sort((a,b)=>b.balance - a.balance)
        .slice(0,10)

    res.json(top)
})

app.listen(process.env.PORT || 3000,()=>{
    console.log("🔥 GTS PRO API RUNNING")
})
