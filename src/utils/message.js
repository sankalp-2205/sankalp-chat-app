const generateMessage = (username,text)=>
{
    return{
        username,
        text,
        createdAt : new Date().getTime()
    }

}
const generatelocationMessage = (username,url)=>
{
    return{
        username,
        url,
        createdAt : new Date().getTime()
    }

}
const generatestaticMessage = (text)=>
{
    return{
        text
    }

}
module.exports = {
    generateMessage,
    generatelocationMessage,
    generatestaticMessage
}