var users = []
//add users

const adduser = ({id,username,room}) =>
{
     username = username.trim().toLowerCase();
     room = room.trim().toLowerCase();
    if(!username || !room)
    {
        return{
            error : "Username and room must be provided"
        }
    }
 const existinguser =  users.find((user)=>{
        return(user.username === username && user.room === room)
    })
if(existinguser)
{
    return{
        error : "User already present in the chat room"
    }
}

const user = {id,username,room}
users.push(user);
return {user};
}

//removeusers

const removeusers = (id)=>{
    const index = users.findIndex((user)=>{
        return(user.id ===id)
    })
    if(index !== -1)
    {
        return users.splice(index,1)[0]
    }
    
}

//get users

const getuser = (id)=>{
     return users.find((user)=>user.id===id)
}

//get users in a room

const getuserinroom = (room)=>{
    return users.filter((user)=>user.room===room)
}


 module.exports = {
     adduser,
     removeusers,
     getuser,
     getuserinroom
 }

