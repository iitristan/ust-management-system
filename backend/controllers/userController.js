const { insertUser, updateUser, deleteUser, getUserById, getAllUsers, getUserByEmail } = require('../models/user');

const createUser = async (req, res) => {
  try {
    const { name, email, role, picture, hd, access } = req.body;
    console.log("Creating user with:", name, email, role, picture, hd, access);
    const result = await insertUser(name, email, role, picture, hd, access);
    console.log("User created:", result);
    res.status(201).json({ message: 'User created successfully', user: result[0] });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: 'Error creating user', error });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      console.log("Fetching user with ID:", id);
      const result = await getUserById(id);
      if (result.length === 0) {
        res.status(404).json({ message: 'User not found' });
      } else {
        console.log("User fetched:", result);
        res.status(200).json({ user: result[0] });
      }
    } else {
      console.log("Fetching all users");
      const result = await getAllUsers();
      console.log("Users fetched:", result);
      res.status(200).json({ users: result });
    }
  } catch (error) {
    console.error("Error fetching user(s):", error);
    res.status(500).json({ message: 'Error fetching user(s)', error });
  }
};

const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, picture, hd, access } = req.body;
    console.log("Editing user with ID:", id);
    const result = await updateUser(id, name, email, role, picture, hd, access);
    console.log("User updated:", result);
    res.status(200).json({ message: 'User updated successfully', user: result[0] });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: 'Error updating user', error });
  }
};



const checkUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Checking user with email:", email);
    const result = await getUserByEmail(email);
    if (result.length > 0) {
      console.log("User exists:", result);
      res.status(200).json({ exists: true, user: result[0] });
    } else {
      res.status(404).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking user:", error);
    res.status(500).json({ message: 'Error checking user', error });
  }
};


const removeUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting user with ID:", id);
    await deleteUser(id);
    console.log("User deleted");
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

module.exports = {
  createUser,
  getUser,
  editUser,
  removeUser,
  checkUserByEmail,
};