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
//const getOrdersBoard = `CALL GetOrdersBoard();`
//const getOrderDetailsById = `CALL GetOrderDetailsById(:order_id);`
//const getUserOrderDetailsById = `CALL GetUserOrderDetailsById(:order_id , :user_id);`
//const getOrderInfoById = `CALL GetOrderInfoById(:order_id);`
const getProductPrice = `SELECT id as id_product, price from products where id = :id`
const addNewProductToOrder = `INSERT INTO products_by_order (id, id_order, id_product, product_quantity, product_price) 
VALUES (NULL, :id_order, :id_product, :quantity, :price)`
const createNewOrder = `INSERT INTO orders (id, id_status, id_payment_option, id_user, total) 
VALUES (null, 1, :id_payment_option, :id_user, :total);`
const updateOrderStatus = `UPDATE orders SET id_status = :id_status WHERE id = :id;`
const getListOfOrderStatus = `SELECT id, description FROM order_status;`
const deleteOrderProductsById = `delete from products_by_order where id_order = :id;`
const deleteOrderById = `delete from orders where id = :id`

const getOrdersBoard = `SELECT 
OrderStatus, created_at, id_order, id_payment_option, payment_type, total, 
full_name, address, GROUP_CONCAT(product_quantity, 'x ', description) as description 
from ( 
    SELECT 
    ORD.id AS id_order, OS.description AS 'OrderStatus', ord.created_at, PO.id as id_payment_option, 
    PO.description as payment_type, ORD.total, U.full_name, U.address, P.description, PBO.product_quantity 
    FROM 
    orders ORD 
    INNER JOIN order_status OS ON ORD.id_status = OS.id 
    INNER JOIN products_by_order PBO ON PBO.id_order = ORD.id 
    INNER JOIN payment_options PO ON PO.id = ORD.id_payment_option 
    INNER JOIN users U ON U.id = ORD.id_user 
    INNER JOIN products P on P.id = PBO.id_product ) as X 
GROUP BY OrderStatus, created_at, id_order, id_payment_option, total, full_name, address
ORDER BY id_order ASC;`

const getOrderDetailsById = `SELECT 
p.description, pbo.product_quantity, pbo.product_price,  
pbo.product_price * pbo.product_quantity as subtotal, p.image_url
FROM 
orders ORD 
INNER JOIN products_by_order PBO ON PBO.id_order = ORD.id 
INNER JOIN products P on P.id = PBO.id_product
where ord.id = :order_id;`

const getUserOrderDetailsById = `SELECT 
p.description, pbo.product_quantity, pbo.product_price,  
pbo.product_price * pbo.product_quantity as subtotal, p.image_url
FROM 
orders ORD 
INNER JOIN products_by_order PBO ON PBO.id_order = ORD.id 
INNER JOIN products P on P.id = PBO.id_product
where ord.id = :order_id and ord.id_user = :user_id;`

const getOrderInfoById = `SELECT 
ord.id as order_id, ord.total, os.description as 'order_status', 
po.description as 'payment_option', u.address, u.full_name, 
u.username, u.email, u.phone 
FROM 
orders ORD 
INNER JOIN order_status OS ON ORD.id_status = OS.id 
INNER JOIN products_by_order PBO ON PBO.id_order = ORD.id 
INNER JOIN payment_options PO ON PO.id = ORD.id_payment_option 
INNER JOIN users U ON U.id = ORD.id_user 
INNER JOIN products P on P.id = PBO.id_product 
where ord.id = :order_id;`

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
  getOrderInfoById,
  getProductPrice,
  addNewProductToOrder,
  createNewOrder,
  updateOrderStatus,
  getListOfOrderStatus,
  deleteOrderProductsById,
  deleteOrderById,
}