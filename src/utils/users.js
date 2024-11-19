const users=[];

//AddUser
const addUser =({id,username,room})=>{
    username=username.trim().toLowerCase();
    room=room.trim().toLowerCase();

    if(!username || !room){
        return {
            error:'Username and Room are required!'
        }
    }
    //if user alrady exists , show error
    const existingUser=users.find((user)=>user.room===room && user.username===username)
    if(existingUser){
        return{
            error:'Username is in use!'
        }
    }
    const user={id,username,room}
    users.push(user);
    return {user};
}

//removeUser
const removeUser=(id)=>{
  const index= users.findIndex((user)=>user.id===id);
  if (index!==-1){
    return users.splice(index,1)[0]
  }
}

//getUser
const getUser=(id)=>{
    return users.find((user)=>user.id===id);
}

//getUser in room
const getUsersInRoom=(roomName)=>{
    roomName=roomName.trim().toLowerCase();
    return users.filter((user)=>user.room===roomName);
}

module.exports={
    addUser,removeUser,getUser,getUsersInRoom
}