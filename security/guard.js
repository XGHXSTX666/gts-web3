const limits = {}

function rateLimit(id, ms = 1000){
    const now = Date.now()

    if(!limits[id]){
        limits[id] = 0
    }

    if(now - limits[id] < ms){
        return false
    }

    limits[id] = now

    return true
}

function validateAmount(amount){
    if(amount < 0 || amount > 1000){
        return false
    }

    return true
}

module.exports = {
    rateLimit,
    validateAmount
}
