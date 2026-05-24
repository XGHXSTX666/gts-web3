require("dotenv").config()

const { Telegraf } = require("telegraf")
const axios = require("axios")

const bot = new Telegraf(process.env.BOT_TOKEN)

// START
bot.start((ctx)=>{
    ctx.reply("🌍 GTS WEB3 PRO",{
        reply_markup:{
            inline_keyboard:[[
                {
                    text:"🎮 PLAY",
                    web_app:{
                        url:process.env.DOMAIN
                    }
                }
            ]]
        }
    })
})

// ADMIN
bot.command("admin",(ctx)=>{
    if(ctx.from.id != process.env.ADMIN_ID){
        return ctx.reply("❌ NO ACCESS")
    }

    ctx.reply("🛡 ADMIN PANEL ACTIVE")
})

// SHOP
bot.command("shop",(ctx)=>{
    ctx.reply(`
🏪 GTS SHOP

1️⃣ sword - 50 GTS
2️⃣ shield - 80 GTS
3️⃣ vip - 200 GTS

Use:
/buy sword
/buy shield
/buy vip
`)
})

// BUY
bot.command("buy", async (ctx)=>{
    const id = ctx.from.id

    const item = ctx.message.text.split(" ")[1]

    if(!item){
        return ctx.reply("❌ Use /buy sword")
    }

    let price = 0

    if(item === "sword") price = 50
    else if(item === "shield") price = 80
    else if(item === "vip") price = 200
    else return ctx.reply("❌ Item not found")

    try{
        const res = await axios.post("http://localhost:3000/buy",{
            id,
            item,
            price
        })

        if(res.data.error){
            return ctx.reply("❌ Not enough balance")
        }

        ctx.reply(`✅ You bought ${item}`)
    }
    catch(e){
        ctx.reply("❌ Server error")
    }
})

// BALANCE
bot.command("balance", async (ctx)=>{
    const id = ctx.from.id

    try{
        const res = await axios.post("http://localhost:3000/user",{id})

        ctx.reply(`💰 Balance: ${res.data.balance} GTS`)
    }
    catch(e){
        ctx.reply("❌ Error")
    }
})

bot.launch()

console.log("BOT PRO RUNNING")
