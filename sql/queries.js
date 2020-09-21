// USER QUERIES
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

// PRODUCT QUERIES
const getAllProducts = `select * from products`
const getAllEnabledProducts = `select * from products where is_enabled = 1`
const getProductById = `select * from products where id = :id`
const getEnabledProductById = `select * from products where id = :id and is_enabled = 1`
const deleteProductById = `DELETE FROM products WHERE id = :id`
const createNewProduct = `INSERT INTO products 
                            (description, price, image_url, is_favorite, is_enabled) 
                          VALUES 
                            (:description, :price, :image_url, :is_favorite, :is_enabled);`
const updateProductById = `UPDATE products 
                            SET 
                                price = :price, 
                                description = :description,
                                image_url = :image_url,
                                is_favorite = :is_favorite,
                                is_enabled = :is_enabled
                            WHERE id = :id `
const updateIsFavoriteProductById = `UPDATE products SET is_favorite = :is_favorite WHERE id = :id`
const updateIsEnabledProductById = `UPDATE products SET is_enabled = :is_enabled WHERE id = :id`
const getOrdersBoard = `CALL GetOrdersBoard();`
const getOrderDetailsById = `CALL GetOrderDetailsById(:order_id);`
const getUserOrderDetailsById = `CALL GetUserOrderDetailsById(:order_id , :user_id);`
const getProductPrice = `SELECT id as id_product, price from products where id = :id`
const addNewProductToOrder = `INSERT INTO products_by_order (id, id_order, id_product, product_quantity, product_price) 
VALUES (NULL, :id_order, :id_product, :quantity, :price)`
const createNewOrder = `INSERT INTO orders (id, id_status, id_payment_option, id_user, total) 
VALUES (null, 1, :id_payment_option, :id_user, :total);`
const updateOrderStatus = `UPDATE orders SET id_status = :id_status WHERE id = :id;`
const getListOfOrderStatus = `SELECT id, description FROM order_status;`

module.exports = {
  getAllUsers,
  getUserById,
  createNewUser,
  userIsAdminById,
  getUserCredentialsByUsername,
  getUserCredentialsByEmail,
  updateUserRole,
  getAllProducts,
  getAllEnabledProducts,
  getProductById,
  getEnabledProductById,
  deleteProductById,
  createNewProduct,
  updateProductById,
  updateIsEnabledProductById,
  updateIsFavoriteProductById,
  getOrdersBoard,
  getOrderDetailsById,
  getUserOrderDetailsById,
  getProductPrice,
  addNewProductToOrder,
  createNewOrder,
  updateOrderStatus,
  getListOfOrderStatus,
}