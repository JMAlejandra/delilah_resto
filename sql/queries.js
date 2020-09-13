const getAllUsers = 'Select id, full_name, username, email, phone, address, created_at, is_admin from users'
const getUserById = `Select id, full_name, username, email, phone, address, created_at, is_admin from users where id = `

module.exports = {
    getAllUsers,
    getUserById
}