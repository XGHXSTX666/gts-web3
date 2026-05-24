require("dotenv").config()

const { Telegraf } = require("telegraf")

const bot = new Telegraf(process.env.BOT_TOKEN, {
    handlerTimeout: 9000
})

// ⚡ START (سريع جداً بدون تعليق)
bot.start(async (ctx)=>{
    await ctx.reply("🌍 BOT ONLINE ⚡")

    setImmediate(() => {
        ctx.reply("🎮 PLAY", {
            reply_markup: {
                inline_keyboard: [[
                    {
                        text: "PLAY",
                        web_app: { url: process.env.DOMAIN }
                    }
                ]]
            }
        })
    })
})

// 🏪 SHOP (بسيط وسريع)
bot.command("shop", (ctx) => {
    ctx.reply(
`🏪 GTS SHOP

🗡 Sword - 50 GTS
🛡 Shield - 80 GTS
💎 VIP - 200 GTS

/buy sword
/buy shield
/buy vip`
    )
})

// 💰 BUY (بدون API خارجي حتى ما يعلق)
bot.command("buy", (ctx) => {
    const item = ctx.message.text.split(" ")[1]

    if (!item) return ctx.reply("❌ Use /buy sword")

    let price = 0

    if (item === "sword") price = 50
    else if (item === "shield") price = 80
    else if (item === "vip") price = 200
    else return ctx.reply("❌ Item not found")

    ctx.reply(`✅ You bought ${item} for ${price} GTS`)
})

// 🧪 TEST (للتأكد السرعة)
bot.command("ping", (ctx) => {
    ctx.reply("⚡ PONG FAST")
})

// ⚡ تشغيل فوري
bot.launch()

console.log("🚀 GTS BOT RUNNING FAST")
