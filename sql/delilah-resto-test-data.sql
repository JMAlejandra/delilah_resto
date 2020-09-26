-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-09-2020 a las 21:16:05
-- Versión del servidor: 10.4.14-MariaDB
-- Versión de PHP: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `delilahresto`
--

--
-- Volcado de datos para la tabla `orders`
--

INSERT INTO `orders` (`id`, `id_status`, `id_payment_option`, `id_user`, `total`, `created_at`) VALUES
(1, 2, 1, 2, '1200.00', '2020-09-26 19:06:55'),
(2, 1, 1, 1, '1780.00', '2020-09-26 18:57:57'),
(3, 1, 1, 2, '620.00', '2020-09-26 18:59:10');

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`id`, `description`, `price`, `image_url`, `is_favorite`, `is_enabled`, `created_at`) VALUES
(1, 'Vanilla Milkshake', '220.00', 'https://pintsizedbaker.com/wp-content/uploads/2015/12/Vanilla-Shake-4-480x360.jpg', 0, 1, '2020-09-26 18:47:16'),
(2, 'Triple Cheeseburger', '400.00', 'https://i.ytimg.com/vi/RhFWvHavf8w/hqdefault.jpg', 0, 1, '2020-09-26 18:42:56'),
(3, 'Nachos with Cheese', '220.00', 'https://www.camelliabrand.com/static/wp-content/uploads/2017/09/pimento_cheese_nachos_34_view-1-720x400.jpg', 0, 1, '2020-09-26 18:43:54'),
(4, 'Beer', '180.00', 'https://fotos.perfil.com/2018/02/03/craft-beer-in-argentina-20180203-01.jpg', 0, 0, '2020-09-26 18:50:40');

--
-- Volcado de datos para la tabla `products_by_order`
--

INSERT INTO `products_by_order` (`id`, `id_order`, `id_product`, `product_quantity`, `product_price`) VALUES
(1, 1, 1, 1, '220.00'),
(2, 1, 2, 2, '400.00'),
(3, 1, 4, 1, '180.00'),
(4, 2, 2, 3, '400.00'),
(5, 2, 3, 1, '220.00'),
(6, 2, 4, 2, '180.00'),
(7, 3, 1, 1, '220.00'),
(8, 3, 2, 1, '400.00');

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `full_name`, `username`, `email`, `phone`, `address`, `user_password`, `created_at`, `is_admin`) VALUES
(1, 'admin user', 'admin', 'admin@delilahresto.com.ar', '54 011 5555 5555', 'Cabildo 500. Buenos Aires, Argentina', '$2b$10$1PQiZfD5N3RpK3Sblt9.3e3zL7oL3M7L3qXhdqU6LmZbraep6B6SO', '2020-09-26 18:18:47', 1),
(2, 'John Doe II', 'new_user', 'johndoe@somemail.com', '55 555 1000 2000', 'Some Street 100, Metropolis 000AAA, Mars', '$2b$10$D0BycXL.uFmZO.XbbmDmnOHLqnwjpSNqs49pDEgl/GtZ3nBFrPU6u', '2020-09-26 18:39:04', 0),
(3, 'Jane Admin', 'new_admin', 'jane.admin@somemail.com', '55 555 2000 3000', 'Other Street 200, Metropolis 000AAA, Earth', '$2b$10$w9lv4VpJNMl07VwkOlq3Xe8ctWAMK8y6gsdAUh/eIj8iBcfDSRHo6', '2020-09-26 18:35:06', 1);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
