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
        <title>GTS WEB3</title>
        <style>
            body {
                background:#0f0f0f;
                color:white;
                font-family:sans-serif;
                text-align:center;
                padding-top:80px;
            }
            .btn {
                padding:15px 25px;
                background:#00ff88;
                border:none;
                border-radius:10px;
                color:black;
                font-weight:bold;
                cursor:pointer;
            }
        </style>
    </head>
    <body>
        <h1>🌍 GTS WEB3 GAME</h1>
        <p>Server Online ✅</p>

        <button class="btn" onclick="alert('Game loading...')">
            🎮 Play
        </button>
    </body>
    </html>
    `)
})

// USER
app.post("/user",(req,res)=>{
    const { id } = req.body

    res.json(getUser(id))
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

app.listen(process.env.PORT,()=>{
    console.log("🔥 GTS PRO API RUNNING")
})
