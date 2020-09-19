CREATE DATABASE delilah-resto;

USE delilah-resto;

CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `username` varchar(255) UNIQUE NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `phone` varchar(20) UNIQUE NOT NULL,
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
  `description` varchar(30) NOT NULL,
  `is_enabled` boolean NOT NULL
);

ALTER TABLE `orders` ADD FOREIGN KEY (`id_status`) REFERENCES `order_status` (`id`);

ALTER TABLE `orders` ADD FOREIGN KEY (`id_payment_option`) REFERENCES `payment_options` (`id`);

ALTER TABLE `orders` ADD FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);

ALTER TABLE `products_by_order` ADD FOREIGN KEY (`id_order`) REFERENCES `orders` (`id`);

ALTER TABLE `products_by_order` ADD FOREIGN KEY (`id_product`) REFERENCES `products` (`id`);
