CREATE DATABASE delilah-resto;

USE delilah-resto;

CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `username` varchar(255) UNIQUE NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `phone` varchar(30) UNIQUE NOT NULL,
  `address` varchar(255) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `created_at` timestamp,
  `is_admin` boolean NOT NULL
);

CREATE TABLE `payment_options` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `description` varchar(255),
  `is_enabled` boolean
);

CREATE TABLE `orders` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `id_status` int,
  `id_payment_option` int,
  `id_user` int,
  `total` decimal(5,2),
  `created_at` timestamp
);

CREATE TABLE `products` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `price` decimal(5,2) NOT NULL,
  `image_url` varchar(255) DEFAULT "https://icon-library.com/images/no-picture-available-icon/no-picture-available-icon-1.jpg",
  `is_favorite` boolean NOT NULL,
  `is_enabled` boolean NOT NULL,
  `created_at` timestamp
);

CREATE TABLE `products_by_order` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `id_order` int NOT NULL,
  `id_product` int NOT NULL,
  `product_quantity` int NOT NULL,
  `product_price` int NOT NULL
);

CREATE TABLE `order_status` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `description` int NOT NULL,
  `is_enabled` boolean NOT NULL
);

ALTER TABLE `orders` ADD FOREIGN KEY (`id_status`) REFERENCES `order_status` (`id`);

ALTER TABLE `orders` ADD FOREIGN KEY (`id_payment_option`) REFERENCES `payment_options` (`id`);

ALTER TABLE `orders` ADD FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);

ALTER TABLE `products_by_order` ADD FOREIGN KEY (`id_order`) REFERENCES `orders` (`id`);

ALTER TABLE `products_by_order` ADD FOREIGN KEY (`id_product`) REFERENCES `products` (`id`);

INSERT INTO `order_status` (`id`, `description`, `is_enabled`) VALUES (NULL, 'Confirmado', '1'), (NULL, 'En Preparación', '1'), (NULL, 'En Camino', '1'), (NULL, 'Entregado', '1');

INSERT INTO `payment_options` (`id`, `description`, `is_enabled`) VALUES (NULL, 'Cash', '1'), (NULL, 'Debit Card', '2'), (NULL, 'Credit Card', '1'), (NULL, 'Gift Card', '1');

CREATE PROCEDURE GetOrdersBoard() 
NOT DETERMINISTIC CONTAINS SQL SQL SECURITY INVOKER 
SELECT 
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
GROUP BY OrderStatus, created_at, id_order, id_payment_option, total, full_name, address;

CREATE PROCEDURE GetOrderDetailsById(IN order_id int) 
NOT DETERMINISTIC CONTAINS SQL SQL SECURITY INVOKER
SELECT 
    ord.id as order_id, p.description as 'product_description', pbo.product_quantity,
    p.price, p.image_url, ord.total, os.description as 'order_status', po.description as 'payment_option', 
    u.address, u.full_name, u.username, u.email, u.phone
    FROM 
    orders ORD 
    INNER JOIN order_status OS ON ORD.id_status = OS.id 
    INNER JOIN products_by_order PBO ON PBO.id_order = ORD.id 
    INNER JOIN payment_options PO ON PO.id = ORD.id_payment_option 
    INNER JOIN users U ON U.id = ORD.id_user 
    INNER JOIN products P on P.id = PBO.id_product
 where ord.id = order_id;

CREATE PROCEDURE GetUserOrderDetailsById(IN order_id int, user_id int) 
NOT DETERMINISTIC CONTAINS SQL SQL SECURITY INVOKER
SELECT 
    ord.id as order_id, p.description as 'product_description', pbo.product_quantity,
    p.price, p.image_url, ord.total, os.description as 'order_status', po.description as 'payment_option', 
    u.address, u.full_name, u.username, u.email, u.phone
    FROM 
    orders ORD 
    INNER JOIN order_status OS ON ORD.id_status = OS.id 
    INNER JOIN products_by_order PBO ON PBO.id_order = ORD.id 
    INNER JOIN payment_options PO ON PO.id = ORD.id_payment_option 
    INNER JOIN users U ON U.id = ORD.id_user 
    INNER JOIN products P on P.id = PBO.id_product
 where ord.id = order_id and u.id = user_id;