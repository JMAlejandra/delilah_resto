const getAllUsers = 'Select id, full_name, username, email, phone, address, created_at, is_admin from users'
const getUserById = `Select id, full_name, username, email, phone, address, created_at, is_admin from users where id = `
const createNewUser = `INSERT INTO users 
                        (full_name, username, email, phone, address, user_password, is_admin) 
                        VALUES 
                        (:full_name, :username, :email, :phone, :address, :user_password, :is_admin);`
const userIsAdminById = `select is_admin from users where id = :id`
const getUserCredentialsByUsername = `select id, is_admin, username, user_password from users where username = :username`
const getUserCredentialsByEmail = `select id, is_admin, username, user_password, email from users where email = :email`
const updateUserRole = `UPDATE users SET is_admin = :is_admin WHERE id = :id ;`

module.exports = {
    getAllUsers,
    getUserById,
    createNewUser,
    userIsAdminById,
    getUserCredentialsByUsername,
    getUserCredentialsByEmail,
    updateUserRole,
}