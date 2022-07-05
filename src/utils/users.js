const users = [];

const addUser = ({ id, username, room }) => {
  //Check to see if username and room were provided
  if (!username || !room) {
    return {
      error: "Must provide a username and room",
    };
  }

  //make a newUser obj with clean data
  const newUser = {
    id,
    username: username.toLowerCase().trim(),
    room: room.toLowerCase().trim(),
  };

  //Check to see if the username is already being used
  const dupUser = users.find((user) => {
    return user.username === newUser.username && user.room === newUser.room;
  });

  if (dupUser) {
    return {
      error: "Username is currently in use",
    };
  }

  //Add user to the users array and return the newUser obj
  users.push(newUser);
  return {
    user: newUser,
  };
};

const removeUser = (id) => {
  //Look for the user by id and if found, splice from array and return removed user
  const index = users.findIndex((user) => user.id === id);
  return users.splice(index, 1)[0];
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

const getAllUsers = () => {
  return [...users];
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  getAllUsers,
};
