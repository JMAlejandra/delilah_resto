CREATE DATABASE delilahresto;

USE delilahresto;

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
  `total` decimal(10,2),
  `created_at` timestamp
);

CREATE TABLE `products` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
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
  `product_price` decimal(10,2) NOT NULL
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

INSERT INTO `users` 
(`id`, `full_name`, `username`, `email`, `phone`, `address`, `user_password`, `created_at`, `is_admin`) 
VALUES 
(NULL, 'admin user', 'admin', 'admin@delilahresto.com.ar', '54 011 5555 5555', 'Cabildo 500. Buenos Aires, Argentina', '$2b$10$1PQiZfD5N3RpK3Sblt9.3e3zL7oL3M7L3qXhdqU6LmZbraep6B6SO', current_timestamp(), '1'); 