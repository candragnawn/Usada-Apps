-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 29, 2026 at 06:46 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `usada_bali`
--

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE `articles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `content` longtext NOT NULL,
  `ingredients` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ingredients`)),
  `benefits` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`benefits`)),
  `preparation_steps` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preparation_steps`)),
  `keywords` varchar(255) DEFAULT NULL,
  `meta_description` varchar(255) DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 1,
  `views_count` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `articles`
--

INSERT INTO `articles` (`id`, `title`, `slug`, `image_url`, `icon`, `category`, `description`, `content`, `ingredients`, `benefits`, `preparation_steps`, `keywords`, `meta_description`, `published_at`, `is_published`, `views_count`, `created_at`, `updated_at`) VALUES
(2, 'Ramuan Obat untuk Panas Membara dan Gelisah', 'ramuan-obat-untuk-panas-membara-dan-gelisah', 'articles/9f7N4fTmzNGPYkwPqcA7lEYljeIFe95lIA0q52Wf.png', 'C', 'Penyakit Dalam', 'Ramuan herbal ini digunakan untuk meredakan panas tubuh yang membara dan mengatasi perasaan gelisah. Dalam pengobatan tradisional, bahan-bahan alami ini dipercaya dapat menenangkan tubuh serta memberikan rasa sejuk dan nyaman. Pastikan tidak ada alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nJika timbul iritasi atau rasa tidak nyaman, hentikan penggunaan dan konsultasikan dengan tenaga medis.', 'Ramuan herbal ini digunakan untuk meredakan panas tubuh yang membara dan mengatasi perasaan gelisah. Dalam pengobatan tradisional, bahan-bahan alami ini dipercaya dapat menenangkan tubuh serta memberikan rasa sejuk dan nyaman.', '[\"Kelapa: Air kelapa dikenal memiliki sifat menyejukkan dan dapat membantu menurunkan panas tubuh.\",\"Adas: Adas digunakan dalam pengobatan tradisional untuk membantu meredakan gelisah dan menenangkan perasaan.\",\"Air Jeruk Nipis: Jeruk nipis memiliki efek pendinginan dan dipercaya dapat mengurangi rasa panas pada tubuh.\"]', '[\"Membantu meredakan panas tubuh yang membara.\",\"Menenangkan perasaan gelisah dan memberi efek relaksasi.\"]', '[\"Ambil air kelapa secukupnya.\",\"Campurkan dengan biji adas yang telah dihancurkan dan perasan air jeruk nipis.\",\"Gunakan ramuan ini untuk mandi dengan cara menyiramkan air ramuan ke tubuh secara perlahan.\"]', 'Gelisah', 'Ramuan herbal ini digunakan untuk meredakan panas tubuh yang membara dan mengatasi perasaan gelisah. Dalam pengobatan tradisional,', '2025-05-27 09:01:00', 1, 61, '2025-05-27 09:01:52', '2025-05-31 06:19:38'),
(3, 'Penawar untuk Bayi yang Sering Menangis Malam Hari', 'penawar-untuk-bayi-yang-sering-menangis-malam-hari', 'articles/4s9MKXCAPLqvAOJGRrsros4dUE7K7GUJVgkbIMf9.jpg', 'Anak', 'Penyakit Anak', 'Obat herbal ini digunakan untuk membantu meredakan tangisan bayi yang sering terjadi di malam hari. Penyakit ini dikenal dalam pengobatan tradisional dengan sebutan bajang tumereretan, yang dipercaya berkaitan dengan gangguan pada tubuh bayi. Pastikan bayi tidak memiliki alergi terhadap getah nangka.Jika terjadi iritasi pada kulit bayi, hentikan penggunaan dan konsultasikan dengan tenaga medis.', 'Obat herbal ini digunakan untuk membantu meredakan tangisan bayi yang sering terjadi di malam hari. Penyakit ini dikenal dalam pengobatan tradisional dengan sebutan bajang tumereretan, yang dipercaya berkaitan dengan gangguan pada tubuh bayi. Pastikan bayi tidak memiliki alergi terhadap getah nangka.Jika terjadi iritasi pada kulit bayi, hentikan penggunaan dan konsultasikan dengan tenaga medis.', '[\"Getah Nangka: Getah dari pohon nangka yang memiliki sifat menenangkan.\"]', '[\"Membantu meredakan tangisan bayi di malam hari.\",\"Menenangkan tubuh bayi menurut kepercayaan pengobatan tradisional.\"]', '[\"Oleskan sedikit getah nangka pada area antara alis bayi, dengan hati-hati dan pastikan tidak mengenai mata.\"]', NULL, 'Obat herbal', '2025-05-29 12:37:00', 1, 99, '2025-05-29 04:43:02', '2025-05-31 05:08:41'),
(4, 'Ramuan Obat untuk Bayi Panas', 'ramuan-obat-untuk-bayi-panas', NULL, 'Anak', 'Penyakit Anak', 'Ramuan herbal ini digunakan untuk meredakan panas pada bayi. Menurut pengobatan tradisional, kombinasi bahan-bahan alami ini dipercaya dapat membantu menurunkan suhu tubuh bayi yang demam. Pastikan bayi tidak memiliki alergi terhadap bahan-bahan yang digunakan.Hindari penggunaan terlalu banyak air arak karena dapat menyebabkan iritasi pada kulit bayi.Jika demam berlanjut atau bayi tidak nyaman, segera konsultasikan dengan tenaga medis.', 'Ramuan herbal ini digunakan untuk meredakan panas pada bayi. Menurut pengobatan tradisional, kombinasi bahan-bahan alami ini dipercaya dapat membantu menurunkan suhu tubuh bayi yang demam.Pastikan bayi tidak memiliki alergi terhadap bahan-bahan yang digunakan.Hindari penggunaan terlalu banyak air arak karena dapat menyebabkan iritasi pada kulit bayi.Jika demam berlanjut atau bayi tidak nyaman, segera konsultasikan dengan tenaga medis.', '[\"Daun Waribang: Daun waribang dikenal dalam pengobatan tradisional sebagai bahan yang dapat membantu meredakan panas.\",\"Daun Gandarusa Kling: Daun ini juga digunakan dalam berbagai ramuan tradisional untuk mengatasi demam.\",\"Air Arak: Air arak digunakan sebagai pelarut untuk ramuan ini, yang berfungsi untuk mempercepat penyerapan bahan aktif ke dalam tubuh.\"]', '[\"Membantu menurunkan panas atau demam pada bayi.\",\"Menenangkan tubuh bayi menurut kepercayaan pengobatan tradisional.\"]', '[\"Ambil daun waribang dan daun gandarusa kling secukupnya\",\"Campurkan dengan sedikit air arak.\",\"Gosokkan ramuan ini secara lembut pada tubuh bayi, terutama di bagian punggung dan dada.\"]', 'Bayi', 'Ramuan herbal ini digunakan untuk meredakan panas pada bayi. Menurut pengobatan tradisional', '2025-05-31 14:22:00', 1, 11, '2025-05-31 06:23:22', '2025-07-30 13:49:49'),
(5, 'Ramuan Obat untuk Bayi dengan Perut Kembung dan Kesulitan Buang Kotoran atau Kencing', 'ramuan-obat-untuk-bayi-dengan-perut-kembung-dan-kesulitan-buang-kotoran-atau-kencing', 'articles/xcFUqG0c0nYLGqlOGPndKt2gottY8VIEOUniVokx.png', 'Anak', 'Penyakit Anak', 'Ramuan herbal ini digunakan untuk membantu meredakan perut kembung pada bayi serta mengatasi kesulitan buang kotoran atau kencing. Ramuan ini dipercaya dalam pengobatan tradisional dapat menenangkan sistem pencernaan bayi dan membantu melancarkan proses buang air. Pastikan tidak ada reaksi alergi terhadap bahan-bahan tersebut.\r\nDosis harus disesuaikan dengan usia bayi, karena ramuan herbal dapat memiliki efek yang berbeda pada bayi yang lebih muda.\r\nJika bayi mengalami masalah yang lebih serius, segera hubungi tenaga medis.', 'Ramuan herbal ini digunakan untuk membantu meredakan perut kembung pada bayi serta mengatasi kesulitan buang kotoran atau kencing. Ramuan ini dipercaya dalam pengobatan tradisional dapat menenangkan sistem pencernaan bayi dan membantu melancarkan proses buang air. Pastikan tidak ada reaksi alergi terhadap bahan-bahan tersebut.\r\nDosis harus disesuaikan dengan usia bayi, karena ramuan herbal dapat memiliki efek yang berbeda pada bayi yang lebih muda.\r\nJika bayi mengalami masalah yang lebih serius, segera hubungi tenaga medis.', '[\"Daun Waribang: Daun waribang digunakan dalam pengobatan tradisional untuk membantu meredakan kembung pada perut.\",\"Air Limau: Air perasan limau memiliki sifat menyegarkan dan dipercaya dapat membantu melancarkan pencernaan.\",\"Inti Kunyit: Inti kunyit mengandung zat yang dapat membantu mengurangi peradangan dan meredakan perut kembung.\"]', '[\"Membantu meredakan perut kembung pada bayi.\",\"Memperlancar proses pembuangan kotoran dan kencing.\",\"Menenangkan perut bayi yang tidak nyaman.\"]', '[\"Ambil daun waribang, air limau, inti kunyit, dan santan secukupnya.\",\"Campurkan semua bahan hingga merata.\",\"Berikan ramuan ini kepada bayi dengan dosis yang sesuai, sesuai petunjuk penggunaan yang aman.\"]', 'Bayi', 'Ramuan herbal ini digunakan untuk membantu meredakan perut kembung pada bayi serta mengatasi kesulitan buang kotoran atau kencing.', '2025-05-31 03:20:00', 1, 0, '2025-05-31 06:29:28', '2025-05-31 06:29:28'),
(6, 'Ramuan Obat untuk Bayi dengan Perut Kembung', 'ramuan-obat-untuk-bayi-dengan-perut-kembung', NULL, 'Anak', 'Penyakit Anak', 'Ramuan herbal ini digunakan untuk meredakan perut kembung pada bayi. Dalam pengobatan tradisional, ramuan ini dipercaya dapat membantu melancarkan pencernaan bayi dan mengurangi rasa tidak nyaman akibat perut kembung. Pastikan bayi tidak memiliki alergi terhadap bahan-bahan tersebut.\r\nDosis harus disesuaikan dengan usia bayi, karena ramuan herbal dapat memiliki efek yang berbeda pada bayi yang lebih muda.\r\nJika bayi tidak nyaman atau perut kembung berlanjut, segera hubungi tenaga medis Pastikan bayi tidak memiliki alergi terhadap bahan-bahan tersebut.\r\nDosis harus disesuaikan dengan usia bayi, karena ramuan herbal dapat memiliki efek yang berbeda pada bayi yang lebih muda.\r\nJika bayi tidak nyaman atau perut kembung berlanjut, segera hubungi tenaga medis', 'Ramuan herbal ini digunakan untuk meredakan perut kembung pada bayi. Dalam pengobatan tradisional, ramuan ini dipercaya dapat membantu melancarkan pencernaan bayi dan mengurangi rasa tidak nyaman akibat perut kembung.', '[\"Sawi: Sawi dikenal dalam pengobatan tradisional untuk membantu meredakan kembung dan melancarkan pencernaan.\",\"Kunir Warangan: Kunir warangan (kunir yang sudah diproses) mengandung sifat antiinflamasi dan membantu menenangkan perut.\",\"Air Hangat: Air hangat membantu melancarkan pencernaan dan memberi efek menenangkan pada perut bayi.\"]', '[\"Membantu meredakan perut kembung pada bayi.\",\"Melancarkan pencernaan bayi dan mengurangi rasa tidak nyaman akibat perut kembung.\"]', '[\"Ambil sawi dan kunir warangan secukupnya.\",\"Campurkan dengan air hangat.\",\"Berikan ramuan ini kepada bayi dengan dosis yang sesuai, sesuai petunjuk penggunaan yang aman.\"]', 'Bayi', 'Ramuan herbal ini digunakan untuk meredakan perut kembung pada bayi. Dalam pengobatan tradisional,', '2025-05-31 14:32:00', 1, 24, '2025-05-31 06:34:08', '2025-06-01 02:40:56'),
(7, 'Ramuan Obat untuk Bayi dengan Jampi Kalingasih', 'ramuan-obat-untuk-bayi-dengan-jampi-kalingasih', 'articles/DICXzyegmN9ZIVEkWR4mrMwHHAE8VibVNFVKH2Ru.png', 'Anak', 'Penyakit Anak', 'Obat tradisional ini digunakan untuk membantu meredakan kondisi jampi kalingasih pada bayi. Dalam pengobatan tradisional, jampi kalingasih sering dikaitkan dengan gangguan kesehatan bayi yang bisa ditangani dengan bahan alami tertentu. Pastikan bayi tidak memiliki alergi terhadap bahan-bahan tersebut.\r\nGunakan ramuan ini dengan hati-hati dan sesuai dosis yang aman untuk bayi.\r\nJika kondisi bayi tidak membaik atau jika muncul reaksi yang tidak diinginkan, segera konsultasikan dengan tenaga medis.', 'Pastikan bayi tidak memiliki alergi terhadap bahan-bahan tersebut.\r\nGunakan ramuan ini dengan hati-hati dan sesuai dosis yang aman untuk bayi.\r\nJika kondisi bayi tidak membaik atau jika muncul reaksi yang tidak diinginkan, segera konsultasikan dengan tenaga medis.', '[\"Buah Belimbing Besi: Buah belimbing besi dikenal dalam pengobatan tradisional untuk meningkatkan daya tahan tubuh dan meredakan beberapa gangguan kesehatan.\",\"Pulasari: Pulasari memiliki sifat menenangkan dan digunakan dalam berbagai ramuan tradisional untuk mengatasi keluhan perut dan tubuh pada bayi.\"]', '[\"Membantu meredakan jampi kalingasih dan memberikan manfaat bagi kesehatan bayi.\",\"Memperkuat daya tahan tubuh dan meredakan ketidaknyamanan pada bayi.\"]', '[\"Ambil buah belimbing besi dan pulasari secukupnya.\",\"Makan langsung bahan tersebut atau campurkan keduanya untuk dikonsumsi, sesuai dengan dosis yang aman untuk bayi.\"]', 'Bayi', 'Obat tradisional ini digunakan untuk membantu meredakan kondisi jampi kalingasih pada bayi. Dalam pengobatan tradisional, jampi kalingasih', '2025-05-31 12:15:00', 1, 24, '2025-05-31 06:38:04', '2025-07-30 18:36:57'),
(8, 'Ramuan Obat untuk Bayi dengan Sakit Perut Kaku (Dihirup)', 'ramuan-obat-untuk-bayi-dengan-sakit-perut-kaku-dihirup', 'articles/8xD8ombZ87BkrbZHt6X8VjY494wiWO7ebfkzvTq7.png', 'Anak', 'Penyakit Anak', 'Ramuan herbal ini digunakan untuk membantu meredakan sakit perut kaku pada bayi dengan cara dihirup. Pengobatan tradisional ini dipercaya dapat memberikan efek menenangkan dan melancarkan pencernaan bayi yang mengalami perut kaku. Pastikan bayi tidak memiliki alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nHindari agar uap yang dihirup tidak terlalu panas untuk mencegah iritasi atau ketidaknyamanan.\r\nJika sakit perut berlanjut atau bayi merasa tidak nyaman, segera konsultasikan dengan tenaga medis.', 'Ramuan herbal ini digunakan untuk membantu meredakan sakit perut kaku pada bayi dengan cara dihirup. Pengobatan tradisional ini dipercaya dapat memberikan efek menenangkan dan melancarkan pencernaan bayi yang mengalami perut kaku. Pastikan bayi tidak memiliki alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nHindari agar uap yang dihirup tidak terlalu panas untuk mencegah iritasi atau ketidaknyamanan.\r\nJika sakit perut berlanjut atau bayi merasa tidak nyaman, segera konsultasikan dengan tenaga medis.', '[\"Laos: Laos (lengkuas) digunakan dalam pengobatan tradisional untuk membantu mengatasi gangguan pencernaan, termasuk sakit perut kaku.\",\"Cendana: Cendana memiliki sifat menenangkan dan digunakan untuk meredakan ketegangan pada tubuh.\",\"Air Kapur: Air kapur digunakan dalam beberapa ramuan tradisional untuk membantu menenangkan perut dan melancarkan pencernaan.\",\"Air Jeruk Nipis: Air jeruk nipis memiliki efek menenangkan dan menyegarkan yang dapat membantu meredakan rasa sakit pada perut.\"]', '[\"Membantu meredakan sakit perut kaku pada bayi dengan cara dihirup.\",\"Menenangkan ketegangan pada perut dan melancarkan pencernaan bayi.\"]', '[\"Ambil sedikit laos, cendana, dan tambahkan sedikit air kapur.\",\"Campurkan bahan-bahan tersebut dengan air jeruk nipis.\",\"Campurkan bahan-bahan tersebut dengan air jeruk nipis.\"]', 'Bayi', 'Ramuan herbal ini digunakan untuk membantu meredakan sakit perut kaku pada bayi dengan cara dihirup.', '2025-05-31 04:00:00', 1, 0, '2025-05-31 08:01:16', '2025-05-31 08:01:16'),
(9, 'Ramuan Obat untuk Bayi dengan Mual dan Sesak di Hulu Hati', 'ramuan-obat-untuk-bayi-dengan-mual-dan-sesak-di-hulu-hati', 'articles/wFA8YQGPCJDWcBgQgIW3Cc7oO16lD20Yo302aMhT.png', 'Anak', 'Penyakit Anak', 'Ramuan herbal ini digunakan untuk membantu meredakan mual dan sesak di hulu hati pada bayi. Dalam pengobatan tradisional, bahan-bahan ini dipercaya dapat melancarkan pencernaan dan memberikan efek menenangkan pada perut bayi yang mengalami ketidaknyamanan. Pastikan bayi tidak memiliki alergi terhadap bahan-bahan yang digunakan.\r\nGunakan ramuan ini dengan hati-hati, dan jika bayi menunjukkan tanda-tanda ketidaknyamanan atau reaksi negatif, segera hentikan penggunaan dan konsultasikan dengan dokter.\r\nDosis yang tepat harus disesuaikan dengan usia bayi, dan konsultasi medis dianjurkan sebelum pemberian ramuan.', 'Pastikan bayi tidak memiliki alergi terhadap bahan-bahan yang digunakan.\r\nGunakan ramuan ini dengan hati-hati, dan jika bayi menunjukkan tanda-tanda ketidaknyamanan atau reaksi negatif, segera hentikan penggunaan dan konsultasikan dengan dokter.\r\nDosis yang tepat harus disesuaikan dengan usia bayi, dan konsultasi medis dianjurkan sebelum pemberian ramuan.', '[\"Laos (Lengkuas): Laos digunakan dalam pengobatan tradisional untuk membantu mengatasi masalah pencernaan, seperti mual dan kembung.\",\"Bawang Putih: Bawang putih dikenal memiliki sifat antibakteri dan dapat membantu melancarkan pencernaan.\",\"Kapur Sirih: Kapur digunakan dalam beberapa ramuan tradisional untuk menenangkan perut dan mengurangi rasa tidak nyaman pada perut bayi.\"]', '[\"Membantu meredakan mual dan sesak di hulu hati pada bayi.\",\"Melancarkan pencernaan dan menenangkan perut bayi yang tidak nyaman.\"]', '[\"Ambil 3 irisan laos, bawang putih secukupnya, dan sedikit kapur sirih.\",\"Campurkan bahan-bahan tersebut dan ramuan siap untuk diminum.\",\"Dosis harus disesuaikan dengan usia dan kondisi bayi, serta dianjurkan untuk mengonsultasikan penggunaan ramuan ini dengan tenaga medis.\"]', 'Bayi', 'Ramuan herbal ini digunakan untuk membantu meredakan mual dan sesak di hulu hati pada bayi.', '2025-05-30 16:03:00', 1, 0, '2025-05-31 08:05:21', '2025-05-31 08:05:21'),
(10, 'Ramuan Obat untuk Sakit Perut (Sebagai Pupuk di Pusarnya)', 'ramuan-obat-untuk-sakit-perut-sebagai-pupuk-di-pusarnya', 'articles/3oANsLg3Fp3K83E7Uv0qsW27ylBdlsevM8awwdKm.png', 'Anak', 'Penyakit Anak', 'Obat tradisional ini digunakan untuk meredakan sakit perut dengan cara dioleskan di sekitar pusar. Penggunaan ramuan ini dipercaya dalam pengobatan tradisional dapat membantu melancarkan pencernaan dan mengurangi rasa sakit pada perut. Pastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan.\r\nGunakan ramuan ini dengan hati-hati agar tidak masuk ke mata atau mulut.\r\nJika terjadi iritasi atau ketidaknyamanan, hentikan penggunaan dan segera konsultasikan dengan tenaga medis.', 'Obat tradisional ini digunakan untuk meredakan sakit perut dengan cara dioleskan di sekitar pusar. Penggunaan ramuan ini dipercaya dalam pengobatan tradisional dapat membantu melancarkan pencernaan dan mengurangi rasa sakit pada perut. Pastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan.\r\nGunakan ramuan ini dengan hati-hati agar tidak masuk ke mata atau mulut.\r\nJika terjadi iritasi atau ketidaknyamanan, hentikan penggunaan dan segera konsultasikan dengan tenaga medis.', '[\"Serabut Dadap: Serabut dari pohon dadap digunakan dalam pengobatan tradisional untuk mengatasi berbagai gangguan pencernaan dan meredakan sakit perut.\",\"Pantat Bawang Putih: Bagian bawah dari bawang putih yang lebih berumur ini dikenal memiliki sifat penghangat dan dipercaya dapat membantu meredakan sakit perut serta memperlancar pencernaan.\"]', '[\"Membantu meredakan sakit perut pada bayi atau orang dewasa.\",\"Melancarkan pencernaan dan mengurangi ketidaknyamanan akibat perut kembung atau gangguan pencernaan lainnya.\"]', '[\"Ambil serabut dadap dan pantat bawang putih secukupnya.\",\"Haluskan bahan-bahan tersebut hingga menjadi pasta.\",\"Oleskan ramuan ini pada area sekitar pusar bayi, dan biarkan beberapa saat agar ramuan dapat bekerja menenangkan perut.\"]', 'Bayi', 'Obat tradisional ini digunakan untuk meredakan sakit perut dengan cara dioleskan di sekitar pusar.', '2025-05-31 01:20:00', 1, 0, '2025-05-31 08:30:31', '2025-05-31 08:30:31'),
(11, 'Ramuan Obat untuk Bayi dengan Pendarahan dari Hidung', 'ramuan-obat-untuk-bayi-dengan-pendarahan-dari-hidung', 'articles/SXFghgubrVqG4NGIfK23OCtR9GpVg5I52olhADSE.png', 'Anak', 'Penyakit Anak', 'Obat tradisional ini digunakan untuk mengatasi pendarahan dari hidung pada bayi. Pengobatan ini melibatkan penggunaan bahan-bahan alami yang dipercaya dapat membantu menghentikan pendarahan dan menenangkan kondisi tubuh bayi. Pastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nJangan menggunakan ramuan ini jika bayi merasa tidak nyaman atau jika ada iritasi pada kulit.\r\nGunakan dengan hati-hati, dan pastikan abu panas tidak menyebabkan luka bakar pada kulit bayi.\r\nJika pendarahan hidung berlanjut atau bayi merasa tidak nyaman, segera konsultasikan dengan tenaga medis.', 'Obat tradisional ini digunakan untuk mengatasi pendarahan dari hidung pada bayi. Pengobatan ini melibatkan penggunaan bahan-bahan alami yang dipercaya dapat membantu menghentikan pendarahan dan menenangkan kondisi tubuh bayi.', '[\"Sembung Gantung: Sembung gantung dikenal dalam pengobatan tradisional sebagai tanaman yang dapat membantu meredakan pendarahan dan memiliki sifat hemostatik.\",\"Lampuyang: Lampuyang, atau yang sering dikenal dengan sebutan lengkuas, digunakan dalam pengobatan tradisional untuk mengatasi\",\"Jalawe: Jalawe adalah tanaman yang dipercaya dalam pengobatan tradisional dapat membantu mengurangi peradangan dan mengatasi pendarahan.\",\"Sarilungid: Sarilungid digunakan dalam beberapa ramuan tradisional untuk membantu menghentikan pendarahan dan mempercepat penyembuhan.\",\"Abu Panas: Abu panas digunakan dalam beberapa praktik pengobatan tradisional sebagai media untuk menenangkan dan memberikan efek terapeutik pada area yang bermasalah.\"]', '[\"Membantu menghentikan pendarahan dari hidung pada bayi.\",\"Menenangkan kondisi tubuh dan mempercepat proses penyembuhan.\"]', '[\"Lumatkan sembung gantung, lampuyang, jalawe, dan sarilungid secukupnya hingga halus.\",\"Setelah itu, campurkan dengan abu panas.\",\"Tempelkan campuran ramuan ini di hidung bayi dengan hati-hati, pastikan ramuan tidak terlalu panas dan tidak mengenai bagian mata.\"]', 'Bayi', 'Obat tradisional ini digunakan untuk mengatasi pendarahan dari hidung pada bayi.', '2025-05-31 06:00:00', 1, 0, '2025-05-31 08:35:42', '2025-05-31 08:35:42'),
(12, 'Ramuan Obat untuk Bayi dengan Cairan Berbau Busuk dari Telinga (Tuli Curek)', 'ramuan-obat-untuk-bayi-dengan-cairan-berbau-busuk-dari-telinga-tuli-curek', 'articles/pkpjkGxGJQCnSgtJ8vIIue16E11GNUObxsH35zjQ.png', 'Anak', 'Penyakit Anak', 'Obat tradisional ini digunakan untuk mengatasi cairan berbau busuk yang keluar dari telinga bayi, yang dikenal dengan istilah tuli curek. Dalam pengobatan tradisional, ramuan ini dipercaya dapat membantu membersihkan telinga dan meredakan infeksi atau peradangan di area tersebut.', 'Obat tradisional ini digunakan untuk mengatasi cairan berbau busuk yang keluar dari telinga bayi, yang dikenal dengan istilah tuli curek. Dalam pengobatan tradisional, ramuan ini dipercaya dapat membantu membersihkan telinga dan meredakan infeksi atau peradangan di area tersebut.', '[\"Daun Sirih Jantan: Daun sirih jantan dikenal dalam pengobatan tradisional sebagai bahan yang memiliki sifat antibakteri dan antimikroba, yang dipercaya dapat membantu mengatasi infeksi pada telinga.\"]', '[\"Membantu mengatasi cairan berbau busuk dari telinga bayi.\",\"Mengurangi peradangan dan membantu membersihkan infeksi pada telinga.\"]', '[\"Ambil daun sirih jantan secukupnya.\",\"Panggang daun sirih jantan hingga agak layu dan hangat, namun tidak terlalu panas.\",\"Tempelkan daun sirih yang telah dipanggang pada telinga bayi dengan hati-hati, terutama pada bagian telinga yang mengeluarkan cairan.\"]', 'Bayi', 'Obat tradisional ini digunakan untuk mengatasi cairan berbau busuk yang keluar dari telinga bayi,', '2025-05-31 02:30:00', 1, 0, '2025-05-31 08:38:59', '2025-05-31 08:38:59'),
(13, 'Ramuan Obat untuk Bayi dengan Gangguan Kesehatan (Ditempel pada Bagian Tubuh yang Sakit)', 'ramuan-obat-untuk-bayi-dengan-gangguan-kesehatan-ditempel-pada-bagian-tubuh-yang-sakit', 'articles/qKdP4ABvKPbVqrOU3DDwrrmUXREB7btM5w0RPQrJ.png', 'Anak', 'Penyakit Anak', 'Ramuan herbal ini digunakan untuk meredakan sakit atau ketidaknyamanan pada tubuh bayi. Berdasarkan pengobatan tradisional, ramuan ini dipercaya dapat membantu meredakan rasa sakit dan mempercepat proses penyembuhan dengan cara ditempelkan pada bagian tubuh bayi yang sakit. Pastikan bayi tidak memiliki alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nGunakan ramuan ini dengan hati-hati dan pastikan tidak ada iritasi pada kulit bayi.\r\nJika kondisi bayi tidak membaik atau ada reaksi negatif, segera hentikan penggunaan dan konsultasikan dengan tenaga medis.', 'Pastikan bayi tidak memiliki alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nGunakan ramuan ini dengan hati-hati dan pastikan tidak ada iritasi pada kulit bayi.\r\nJika kondisi bayi tidak membaik atau ada reaksi negatif, segera hentikan penggunaan dan konsultasikan dengan tenaga medis.', '[\"Daun Sembung: Daun sembung dikenal dalam pengobatan tradisional untuk meredakan sakit tubuh dan membantu memperbaiki kondisi pencernaan.\",\"Daun Sigugu: Daun sigugu digunakan dalam pengobatan tradisional untuk mengatasi peradangan dan nyeri pada tubuh\",\"Daun Pupulutan: Daun pupulutan memiliki sifat menenangkan dan digunakan untuk membantu meredakan sakit pada tubuh.\"]', '[\"Membantu meredakan rasa sakit pada tubuh bayi.\",\"Mempercepat penyembuhan dan menenangkan tubuh bayi yang sakit.\"]', '[\"Lumatkan daun sembung, daun sigugu, dan daun pupulutan secukupnya hingga halus.\",\"Tempelkan ramuan yang telah dilumatkan ini pada bagian tubuh bayi yang terasa sakit atau tidak nyaman.\"]', 'Bayi', 'Gunakan ramuan ini dengan hati-hati dan pastikan tidak ada iritasi pada kulit bayi.\r\nJika kondisi bayi tidak membaik atau ada reaksi negatif,', '2025-06-01 02:40:00', 1, 149, '2025-05-31 08:42:40', '2025-06-01 03:33:14'),
(14, 'Ramuan Obat untuk Sakit Ulu Hati, Nyeri di Pusar, dan Gelisah (Tiwang Lumba-Lumba)', 'ramuan-obat-untuk-sakit-ulu-hati-nyeri-di-pusar-dan-gelisah-tiwang-lumba-lumba', NULL, 'Anak', 'Penyakit Anak', 'Obat tradisional ini digunakan untuk mengatasi sakit ulu hati, nyeri yang melilit di sekitar pusar, dan perasaan gelisah yang disebut dengan istilah tiwang lumba-lumba dalam pengobatan tradisional. Pastikan pasien tidak memiliki alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nGunakan ramuan ini dengan hati-hati dan pastikan tidak ada iritasi pada kulit pasien.\r\nJika kondisi pasien tidak membaik atau muncul reaksi negatif, segera hentikan penggunaan dan konsultasikan dengan tenaga medis.', 'Pastikan pasien tidak memiliki alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nGunakan ramuan ini dengan hati-hati dan pastikan tidak ada iritasi pada kulit pasien.\r\nJika kondisi pasien tidak membaik atau muncul reaksi negatif, segera hentikan penggunaan dan konsultasikan dengan tenaga medis.', '[\"Akar Kaktus: Akar kaktus dikenal dalam pengobatan tradisional untuk membantu meredakan nyeri perut dan mengatasi masalah pencernaan.\",\"Beras Merah: Beras merah digunakan dalam pengobatan tradisional untuk menyeimbangkan sistem pencernaan dan memberikan efek menenangkan pada tubuh.\"]', '[\"Membantu meredakan sakit ulu hati dan nyeri yang melilit di sekitar pusar.\",\"Menenangkan perasaan gelisah dan memberikan efek relaksasi pada tubuh.\"]', '[\"Ambil akar kaktus dan beras merah secukupnya.\",\"Ulek kedua bahan tersebut hingga halus dan merata.\",\"Tempelkan ramuan yang telah diulek pada area pusar pasien yang terasa sakit atau gelisah.\"]', 'Bayi', 'Obat tradisional ini digunakan untuk mengatasi sakit ulu hati, nyeri yang melilit di sekitar pusar,', '2025-05-30 16:46:00', 1, 0, '2025-05-31 08:47:37', '2025-05-31 08:47:37'),
(15, 'Ramuan Obat untuk Bengkak dalam Perut, Batuk-batuk, dan Keluar Nanah', 'ramuan-obat-untuk-bengkak-dalam-perut-batuk-batuk-dan-keluar-nanah', 'articles/p46HBe46Tc9IgMGe9pNSBgm65qyGwXdjdzJTCfFE.png', 'Dalam', 'Penyakit Dalam', 'Obat ini digunakan dalam pengobatan tradisional untuk mengatasi masalah bengkak dalam perut, batuk-batuk, dan keluarnya nanah. Ramuan ini dipercaya dapat membantu meredakan peradangan, mengatasi batuk, serta memperbaiki kondisi pencernaan dan mengatasi infeksi.Pastikan pasien tidak memiliki alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nDosis harus disesuaikan dengan kondisi pasien, terutama jika digunakan untuk bayi atau anak-anak.\r\nJika gejala berlanjut atau kondisi pasien tidak membaik, segera konsultasikan dengan tenaga medis.', 'Obat ini digunakan dalam pengobatan tradisional untuk mengatasi masalah bengkak dalam perut, batuk-batuk, dan keluarnya nanah. Ramuan ini dipercaya dapat membantu meredakan peradangan, mengatasi batuk, serta memperbaiki kondisi pencernaan dan mengatasi infeksi.Pastikan pasien tidak memiliki alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nDosis harus disesuaikan dengan kondisi pasien, terutama jika digunakan untuk bayi atau anak-anak.\r\nJika gejala berlanjut atau kondisi pasien tidak membaik, segera konsultasikan dengan tenaga medis.', '[\"Kunyit Warangan: Kunyit warangan memiliki sifat antiinflamasi dan antibakteri yang dapat membantu meredakan peradangan dan infeksi di dalam tubuh.\",\"Duri Jeruk Nipis: Duri jeruk nipis digunakan dalam pengobatan tradisional untuk membantu melancarkan peredaran darah dan mempercepat penyembuhan.\"]', '[\"Membantu meredakan bengkak dalam perut dan batuk-batuk.\",\"Mengatasi infeksi yang menyebabkan nanah dan mempercepat pemulihan tubuh.\"]', '[\"Ambil kunyit warangan dan duri jeruk nipis secukupnya.\",\"Bersihkan bahan-bahan tersebut dengan air bersih untuk menghindari kotoran atau debu.\",\"Kunyit warangan: Kupas dan parut kunyit warangan hingga halus.\",\"Duri jeruk nipis: Ambil duri jeruk nipis secukupnya dan tumbuk atau ulek hingga halus.\",\"Campurkan kunyit warangan yang sudah diparut halus dengan duri jeruk nipis yang sudah diulek.\",\"Tambahkan sedikit air matang (jika diperlukan) untuk membantu melarutkan ramuan agar lebih mudah diminum.\",\"Setelah bahan-bahan tersebut tercampur rata, saring ramuan untuk menghilangkan serat atau bagian yang kasar jika diinginkan. Ini akan membuat ramuan lebih nyaman untuk diminum.\",\"Ramuan ini siap untuk diminum. Dosis yang diberikan dapat disesuaikan dengan kondisi pasien, namun harus mengikuti anjuran atau resep yang ada.\"]', 'Dalam', 'Obat ini digunakan dalam pengobatan tradisional untuk mengatasi masalah bengkak dalam perut, batuk-batuk, dan keluarnya nanah.', '2025-05-31 06:00:00', 1, 0, '2025-05-31 08:52:40', '2025-05-31 08:52:40'),
(16, 'Ramuan Obat untuk Panas Dingin (Demam)', 'ramuan-obat-untuk-panas-dingin-demam', 'articles/T1jUtvxLzxQJCgew1E35l25xui8hMBqgEOZ1AjtA.png', 'Dalam', 'Penyakit Dalam', 'Obat ini digunakan dalam pengobatan tradisional untuk meredakan demam atau panas dingin pada tubuh. Ramuan ini dipercaya dapat membantu menenangkan suhu tubuh yang tidak stabil dan memberikan efek penyembuhan.', 'Obat ini digunakan dalam pengobatan tradisional untuk meredakan demam atau panas dingin pada tubuh. Ramuan ini dipercaya dapat membantu menenangkan suhu tubuh yang tidak stabil dan memberikan efek penyembuhan. Pastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nGunakan ramuan ini dengan hati-hati, terutama pada bayi atau anak-anak.\r\nJika demam berlanjut atau pasien merasa tidak nyaman, segera hubungi tenaga medis.', '[\"Lempuyang: Lempuyang dikenal dalam pengobatan tradisional untuk mengatasi demam, meredakan peradangan, dan memberikan efek menenangkan.\",\"Minyak Kelapa: Minyak kelapa memiliki sifat menyejukkan dan dapat membantu mengatasi panas tubuh yang berlebihan.\",\"Jebuggarum\\/Pala: Jebuggarum\\/Pala digunakan dalam pengobatan tradisional untuk membantu melancarkan peredaran darah dan menenangkan tubuh.\",\"Rendaman Air Ketan Gajih: Air ketan gajih digunakan untuk memberikan efek menenangkan dan meredakan panas tubuh.\"]', '[\"Membantu meredakan demam atau panas dingin pada tubuh.\",\"Menenangkan tubuh dan memperlancar peredaran darah.\"]', '[\"Ambil lempuyang secukupnya dan haluskan.\",\"Campurkan dengan minyak kelapa secukupnya hingga membentuk ramuan yang dapat dilulurkan.\",\"Lulurkan ramuan ini pada bagian tubuh yang terasa panas atau demam, seperti punggung, dada, atau leher.\",\"Ambil jebuggarum secukupnya dan campurkan dengan rendaman air ketan gajih.\",\"Haluskan dan buat menjadi ramuan.\",\"Lulurkan ramuan ini ke seluruh tubuh atau bagian tubuh yang masih terasa panas atau demam.\"]', 'Dalam', 'Obat ini digunakan dalam pengobatan tradisional untuk meredakan demam atau panas dingin pada tubuh.', '2025-05-31 04:20:00', 1, 0, '2025-05-31 09:02:44', '2025-05-31 09:02:44'),
(17, 'Ramuan Lulur untuk Penyakit Tuju/Vertigo', 'ramuan-lulur-untuk-penyakit-tujuvertigo', 'articles/juDhZdrIL7qxuzWZuiecLNIbl9cRNcnGVpPqh9ph.png', 'Dalam', 'Penyakit Dalam', 'Obat ini digunakan dalam pengobatan tradisional untuk meredakan gejala vertigo atau penyakit tuju, yang menyebabkan pusing atau rasa tidak seimbang. Ramuan ini dipercaya dapat membantu menenangkan tubuh dan mengurangi gejala pusing atau kepala yang terasa berputar. Pastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nGunakan ramuan ini dengan hati-hati, terutama pada area yang sensitif, dan pastikan tidak ada iritasi.\r\nJika gejala vertigo berlanjut atau pasien merasa tidak nyaman, segera konsultasikan dengan tenaga medis.', 'Obat ini digunakan dalam pengobatan tradisional untuk meredakan gejala vertigo atau penyakit tuju, yang menyebabkan pusing atau rasa tidak seimbang. Ramuan ini dipercaya dapat membantu menenangkan tubuh dan mengurangi gejala pusing atau kepala yang terasa berputar.', '[\"Daun Kecubung Kasyan: Daun kecubung kasyan digunakan dalam pengobatan tradisional untuk membantu meredakan rasa pusing atau kepala berputar yang terkait dengan vertigo.\",\"Daun Cempaka Kuning: Daun cempaka kuning dikenal memiliki sifat menenangkan dan dipercaya dapat membantu mengatasi rasa pusing serta memperbaiki sirkulasi darah.\",\"Bangle: Bangle memiliki efek antiinflamasi dan dapat membantu menenangkan peradangan atau ketegangan pada tubuh yang mungkin berkontribusi pada gejala vertigo.\",\"Trikatuka: Trikatuka, yang terdiri dari tiga bahan herbal, dipercaya dapat membantu meredakan pusing, meningkatkan sirkulasi darah, dan menenangkan sistem saraf.\"]', '[\"Membantu meredakan gejala vertigo atau penyakit tuju, seperti pusing dan rasa tidak seimbang.\",\"Menenangkan tubuh dan meredakan ketegangan yang mungkin memicu vertigo.\"]', '[\"Ambil daun kecubung kasyan, daun cempaka kuning, bangle, dan trikatuka secukupnya.\",\"Gerus atau haluskan semua bahan tersebut hingga membentuk pasta atau ramuan yang bisa digunakan sebagai lulur.\",\"Oleskan ramuan ini pada bagian tengkuk, leher, atau punggung atas (bagian tubuh yang sering terasa tegang) dan diamkan beberapa saat.\",\"Setelah beberapa menit, bersihkan ramuan lulur tersebut dengan air bersih.\"]', 'Dalam', 'Obat ini digunakan dalam pengobatan tradisional untuk mengatasi masalah bengkak dalam perut, batuk-batuk, dan keluarnya nanah.', '2025-06-01 02:00:00', 1, 46, '2025-05-31 09:09:38', '2025-07-30 18:35:52'),
(18, 'Ramuan Obat untuk Mata yang Selalu Kantuk', 'Obat tradisional ini digunakan untuk meredakan mata yang selalu merasa kantuk atau lelah. Ramuan ini dipercaya dapat memberikan efek menyegarkan pada mata dan meningkatkan kewaspadaan.', 'articles/u43HHxuAc3VCGt9U1RHOIOVWZQv8hsrgqECn3LeK.png', 'Dalam', 'Penyakit Dalam', 'Obat tradisional ini digunakan untuk meredakan mata yang selalu merasa kantuk atau lelah. Ramuan ini dipercaya dapat memberikan efek menyegarkan pada mata dan meningkatkan kewaspadaan. Pastikan ramuan tidak masuk ke dalam mata untuk menghindari iritasi.\r\nGunakan ramuan ini dengan hati-hati, terutama pada area sekitar mata yang sensitif.\r\nJika timbul iritasi atau reaksi negatif lainnya, segera hentikan penggunaan dan konsultasikan dengan tenaga medis.', 'Pastikan ramuan tidak masuk ke dalam mata untuk menghindari iritasi.\r\nGunakan ramuan ini dengan hati-hati, terutama pada area sekitar mata yang sensitif.\r\nJika timbul iritasi atau reaksi negatif lainnya, segera hentikan penggunaan dan konsultasikan dengan tenaga medis.', '[\"Merica: Merica memiliki sifat penghangat dan dapat membantu meningkatkan sirkulasi darah, yang dipercaya dapat merangsang energi tubuh dan mengurangi rasa kantuk.\",\"Rumput Teki: Rumput teki digunakan dalam pengobatan tradisional untuk menenangkan otot-otot mata dan mengurangi rasa lelah pada mata.\",\"Bawang Lanang (Bawang Putih Tunggal): Bawang lanang dikenal dengan kemampuannya untuk meningkatkan sirkulasi darah dan memberikan efek segar pada tubuh.\"]', '[\"Membantu meredakan rasa kantuk pada mata dan meningkatkan kewaspadaan.\",\"Menyegarkan mata dan mengurangi kelelahan mata.\"]', '[\"Pastikan ramuan tidak masuk ke dalam mata untuk menghindari iritasi.\",\"Gunakan ramuan ini dengan hati-hati, terutama pada area sekitar mata yang sensitif.\",\"Jika timbul iritasi atau reaksi negatif lainnya, segera hentikan penggunaan dan konsultasikan dengan tenaga medis.\"]', 'Dalam', 'Obat tradisional ini digunakan untuk meredakan mata yang selalu merasa kantuk atau lelah.', '2025-05-31 09:13:30', 1, 11, '2025-05-31 09:13:30', '2025-06-01 00:01:39'),
(19, 'Ramuan Obat untuk Kesemutan', 'ramuan-obat-untuk-kesemutan', 'articles/s01UUrAk3qC7yELTfmSfXgeh2cLSkTZSwdCmuEZW.png', 'Dalam', 'Penyakit Dalam', 'Obat ini digunakan dalam pengobatan tradisional untuk meredakan kesemutan pada kaki. Ramuan ini dipercaya dapat meningkatkan sirkulasi darah dan memberikan efek penyembuhan pada bagian tubuh yang mengalami kesemutan. Pastikan kulit pohon kepuh yang digunakan bersih dan berasal dari sumber yang terpercaya.\r\nJangan gunakan ramuan ini jika kulit Anda sensitif terhadap garam atau bahan lainnya.\r\nJika kesemutan berlanjut atau kondisi tidak membaik, segera konsultasikan dengan tenaga medis.', 'Kulit Pohon Kepuh: Kulit pohon kepuh dikenal dalam pengobatan tradisional untuk meredakan kesemutan dan meningkatkan sirkulasi darah di area yang terkena.', '[\"Kulit Pohon Kepuh: Kulit pohon kepuh dikenal dalam pengobatan tradisional untuk meredakan kesemutan dan meningkatkan sirkulasi darah di area yang terkena.\",\"Garam Butiran: Garam butiran digunakan untuk membantu melancarkan peredaran darah dan memberikan efek relaksasi pada otot yang tegang.\"]', '[\"Meningkatkan sirkulasi darah dan mempercepat proses penyembuhan pada bagian tubuh yang mengalami kesemutan.\",\"Membantu meredakan kesemutan pada kaki.\"]', '[\"Ambil kulit pohon kepuh secukupnya dan garam butiran sesuai kebutuhan.\",\"Haluskan kulit pohon kepuh atau dapat digunakan langsung dalam bentuk potongan kecil.\",\"Campurkan kulit pohon kepuh dengan garam butiran.\",\"Urutkan campuran bahan tersebut pada bagian kaki yang terasa kesemutan secara perlahan.\"]', 'Dalam', 'Obat ini digunakan dalam pengobatan tradisional untuk meredakan kesemutan pada kaki.', '2025-05-31 09:17:33', 1, 0, '2025-05-31 09:17:33', '2025-05-31 09:17:33'),
(20, 'Ramuan Obat untuk Bisul', 'ramuan-obat-untuk-bisul', NULL, 'kulit', 'Penyakit Kulit', 'Daun paspasan dicampur kapur sirih dan air, kemudian dioleskan ke bisul untuk membantu penyembuhan. Hindari penggunaan pada luka terbuka yang dalam.\r\nJika terjadi iritasi, hentikan pemakaian.', 'Daun paspasan dicampur kapur sirih dan air, kemudian dioleskan ke bisul untuk membantu penyembuhan.', '[\"Daun paspasan\",\"Kapur sirih\",\"Air\"]', '[\"Membantu mempercepat penyembuhan bisul.\"]', '[\"Daun dicampur kapur sirih dan air.\",\"Ramuan dioleskan pada area bisul.\"]', 'kulit', 'Daun paspasan dicampur kapur sirih dan air, kemudian dioleskan ke bisul untuk membantu penyembuhan.', '2025-05-31 09:22:23', 1, 43, '2025-05-31 09:22:23', '2025-07-30 18:37:30'),
(21, 'Ramuan Obat untuk Rematik', 'ramuan-obat-untuk-rematik', NULL, 'Dalam', 'Penyakit Dalam', 'Daun salam direbus dan diminum tiga per empat gelas, enam kali sehari, untuk mengobati rematik.\r\nKonsultasikan dengan dokter jika sedang menggunakan obat lain.\r\nPerhatikan dosis agar tidak berlebihan.', 'Daun salam direbus dan diminum tiga per empat gelas, enam kali sehari, untuk mengobati rematik.', '[\"Daun salam\"]', '[\"Meredakan gejala rematik.\"]', '[\"Daun salam direbus.\",\"Air rebusan diminum sebanyak \\u00be gelas, 6 kali sehari.\"]', 'Daun salam direbus dan diminum tiga per empat gelas, enam kali sehari, untuk mengobati rematik.', 'Daun salam direbus dan diminum tiga per empat gelas, enam kali sehari, untuk mengobati rematik.', '2025-06-15 03:11:00', 1, 46, '2025-07-30 13:23:21', '2025-07-30 18:35:40'),
(22, 'Ramuan Obat untuk Luka Baru', 'ramuan-obat-untuk-luka-baru', NULL, NULL, 'Penyakit Kulit', 'Getah dari tanaman jarak digunakan untuk mengatasi luka baru dengan cara dioleskan pada area yang terluka. Tanaman ini dipercaya memiliki sifat penyembuhan dan mempercepat proses pemulihan luka.\r\nPastikan tidak ada reaksi alergi terhadap getah jarak.\r\nHindari penggunaan pada luka yang terbuka atau dalam yang bisa menyebabkan iritasi.\r\nJika luka tidak sembuh atau timbul infeksi, segera konsultasikan dengan tenaga medis.', 'Pastikan tidak ada reaksi alergi terhadap getah jarak.\r\nHindari penggunaan pada luka yang terbuka atau dalam yang bisa menyebabkan iritasi.\r\nJika luka tidak sembuh atau timbul infeksi, segera konsultasikan dengan tenaga medis.', '[\"Getah jarak\"]', '[\"Membantu mempercepat penyembuhan luka baru.\"]', '[\"Getah jarak dioleskan pada bagian tubuh yang baru terluka untuk mempercepat penyembuhan.\"]', NULL, NULL, '2025-06-10 02:00:00', 1, 26, '2025-07-30 13:28:24', '2025-07-30 18:06:53'),
(23, 'Ramuan Obat Penolak Roh Jahat', 'ramuan-obat-penolak-roh-jahat', NULL, 'Dalam', 'Non-Medis', 'Jahe pait dikenal dalam pengobatan tradisional sebagai bahan yang tidak hanya bermanfaat untuk kesehatan fisik, tetapi juga untuk melindungi tubuh dari energi negatif. Tanaman ini dipercaya memiliki khasiat spiritual untuk menolak roh jahat. Tidak ada efek samping yang dikenal dari penggunaan jahe dalam jumlah biasa.\r\nGunakan sesuai dengan tujuan yang ditentukan.', 'Jahe ditanam di pekarangan rumah untuk melindungi rumah dari energi negatif.', '[\"Seluruh bagian jahe pait\"]', '[\"Menolak roh jahat dan melindungi rumah dari gangguan spiritual.\"]', '[\"Jahe ditanam di pekarangan rumah untuk melindungi rumah dari energi negatif.\"]', NULL, NULL, '2025-01-10 02:11:00', 1, 0, '2025-07-30 13:32:24', '2025-07-30 13:32:24'),
(24, 'Obat Gatal', 'obat-gatal', NULL, NULL, 'Penyakit Kulit', 'Obat ini digunakan untuk mengatasi rasa gatal pada kulit. Ramuan ini mengandung bahan alami yang dapat menenangkan kulit yang gatal.', 'Obat ini digunakan untuk mengatasi rasa gatal pada kulit. Ramuan ini mengandung bahan alami yang dapat menenangkan kulit yang gatal.', '[\"3 lembar daun Piper betle (Sirih)\",\"Minyak kelapa\",\"Garam\",\"Allium sativum (bawang putih)\",\"Sarang serangga (Kalisasoan\"]', '[\"Meredakan gatal dan iritasi pada kulit.\"]', '[\"Gulung daun sirih, campurkan dengan minyak kelapa, garam, bawang putih, dan sarang serangga yang dihancurkan.\",\"Oleskan campuran ini pada bagian tubuh yang terasa gatal.\",\"tal.\"]', NULL, NULL, '2025-05-10 02:11:00', 1, 0, '2025-07-30 13:36:52', '2025-07-30 13:36:52'),
(25, 'Obat Ilmu Hitam', 'obat-ilmu-hitam', NULL, NULL, 'Non-Medis', 'Obat ini digunakan untuk mengatasi gangguan mental yang disebabkan oleh ilmu hitam. Ramuan ini melibatkan doa dan ritual tertentu.', 'Tidak ada efek samping yang dikenal, namun pastikan untuk mengikuti ritual dengan hati-hati dan dengan keyakinan.\r\nJika gangguan mental berlanjut, segera bawa pasien ke tenaga medis.', '[\"Ocimum tenuiflorum (daun kemangi)\",\"Air\"]', '[\"Mengatasi gangguan mental yang disebabkan oleh ilmu hitam.\"]', '[\"Tidak ada efek samping yang dikenal, namun pastikan untuk mengikuti ritual dengan hati-hati dan dengan keyakinan.\",\"Jika gangguan mental berlanjut, segera bawa pasien ke tenaga medis.\"]', NULL, NULL, '2025-04-10 02:11:00', 1, 0, '2025-07-30 13:39:07', '2025-07-30 13:39:07'),
(26, 'Obat Stroke', 'obat-stroke', NULL, NULL, 'Penyakit Dalam', 'Obat tradisional ini digunakan untuk membantu pemulihan pasien stroke. Lulur boreh ini membantu meredakan ketegangan dan meningkatkan peredaran darah.', 'Biasanya pasien pulih setelah 1-3 kali perawatan.', '[\"3 lembar daun Piper betle (Sirih)\",\"Sedikit garam meja\",\"Lengkuas (A. galanga)\"]', '[\"Meredakan ketegangan tubuh dan membantu pemulihan stroke.\"]', '[\"Meredakan ketegangan tubuh dan membantu pemulihan stroke.\",\"Biasanya pasien pulih setelah 1-3 kali perawatan.\"]', NULL, NULL, '2025-02-10 03:12:00', 1, 0, '2025-07-30 13:42:23', '2025-07-30 13:42:23'),
(27, 'Obat Herpes', 'obat-herpes', NULL, NULL, 'Penyakit Kulit', 'Ramuan ini digunakan untuk mengatasi herpes. Spray ini mengandung bahan alami yang dapat membantu mengurangi rasa sakit dan mempercepat proses penyembuhan. Pastikan tidak ada iritasi saat menggunakan spray ini.\r\nJika gejala berlanjut, konsultasikan dengan tenaga medis.', 'Pastikan tidak ada iritasi saat menggunakan spray ini.\r\nJika gejala berlanjut, konsultasikan dengan tenaga medis.', '[\"Daun Beringin\",\"1 sendok makan Injin (beras ketan hitam)\"]', '[\"Membantu meredakan gejala herpes dan mempercepat penyembuhan.\"]', '[\"Semua bahan dihancurkan atau dikunyah, kemudian disemprotkan pada bagian tubuh yang terinfeksi herpes.\"]', NULL, NULL, '2025-04-14 21:43:00', 1, 0, '2025-07-30 13:44:31', '2025-07-30 13:44:31'),
(28, 'Obat Kanker', 'obat-kanker', NULL, NULL, 'Penyakit Dalam', 'Herbal medicine ini digunakan untuk membantu mengatasi tumor atau kanker. Ramuan ini dipercaya memiliki khasiat dalam mengurangi pembengkakan dan meredakan gejala kanker Gunakan dengan hati-hati dan sesuaikan dosis.\r\nSelalu konsultasikan dengan dokter jika digunakan untuk mengobati kanker.', 'Gunakan dengan hati-hati dan sesuaikan dosis.\r\nSelalu konsultasikan dengan dokter jika digunakan untuk mengobati kanker.', '[\"Daun Belimbing wuluh besi (Averrhoa carambola L.)\",\"Daun Katuk (Sauropus androgyne)\",\"Bawang merah (A. cepa)\",\"Sedikit garam\"]', '[\"Membantu meredakan gejala tumor dan kanker.\",\"Membantu memperbaiki kondisi tubuh selama proses penyembuhan.\"]', '[\"Semua bahan dihancurkan dan ramuan diminum pagi dan sore sebanyak setengah gelas.\"]', NULL, NULL, '2025-05-05 02:11:00', 1, 0, '2025-07-30 13:46:40', '2025-07-30 13:46:40'),
(29, 'Obat Muntah darah/pendarahan', 'obat-muntah-darahpendarahan', NULL, NULL, 'Penyakit Dalam', 'Obat tradisional ini digunakan untuk meredakan muntah darah atau pendarahan internal. Ramuan ini membantu menghentikan pendarahan dan memperbaiki kondisi tubuh secara keseluruhan. Pastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan.\r\nJika pendarahan berlanjut atau gejala memburuk, segera bawa pasien ke rumah sakit atau konsultasikan dengan tenaga medis', 'Pastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan.\r\nJika pendarahan berlanjut atau gejala memburuk, segera bawa pasien ke rumah sakit atau konsultasikan dengan tenaga medis', '[\"Daun Undis (Cajanus cajan)\",\"Jahe\",\"Cekuh\",\"Beras yang direndam\"]', '[\"Membantu menghentikan pendarahan dan meredakan muntah darah.\",\"Membantu memperbaiki kondisi tubuh yang lemah akibat pendarahan.\"]', '[\"Semua bahan dihancurkan dan disaring.\",\"Hasil saringan diminum oleh pasien, sementara ampasnya digunakan sebagai luluran pada dada dan perut pasien\"]', NULL, NULL, '2025-05-12 03:13:00', 1, 0, '2025-07-30 13:51:28', '2025-07-30 13:51:28'),
(30, 'Obat Keputihan', 'obat-keputihan', NULL, NULL, 'Penyakit Dalam', 'Obat ini digunakan untuk mengatasi masalah keputihan pada wanita. Ramuan ini mengandung bahan alami yang dapat membantu mengurangi keputihan dan meredakan infeksi pada organ kewanitaan.\r\nPastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan.\r\nJika gejala berlanjut atau ada perubahan yang mengkhawatirkan, segera hubungi tenaga medis.', 'Pastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan.\r\nJika gejala berlanjut atau ada perubahan yang mengkhawatirkan, segera hubungi tenaga medis.', '[\"Isep nanah\\/meniran putih\",\"Isep getih\\/meniran merah\",\"Bawang merah (A. cepa)\"]', '[\"Bawang merah (A. cepa)\",\"Meredakan gejala keputihan yang berlebihan.\"]', '[\"Semua bahan direbus dalam 3 cangkir air hingga tersisa 1 cangkir.\",\"Minum setengah gelas ramuan herbal ini pagi dan sore.\",\"Pengobatan biasanya dilakukan 1-3 kali hingga sembuh\"]', NULL, NULL, '2025-05-10 05:16:00', 1, 0, '2025-07-30 13:54:30', '2025-07-30 13:54:30'),
(31, 'Obat Diare', 'obat-diare', NULL, NULL, 'Penyakit Dalam', 'Gendola, yang dikenal juga dengan nama Basella alba, adalah tanaman yang memiliki khasiat untuk mengatasi diare. Ramuan dari daun Gendola yang dicampur dengan bahan alami lainnya dipercaya dapat menenangkan saluran pencernaan dan mengurangi gejala diare.\r\nPastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan.\r\nJika diare berlanjut atau disertai gejala lain yang mengkhawatirkan, segera hubungi tenaga medis.', 'Pastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan.\r\nJika diare berlanjut atau disertai gejala lain yang mengkhawatirkan, segera hubungi tenaga medis.', '[\"11 lembar daun Gendola (Basella alba)\",\"Cuka\",\"5 iris Lengkuas (Alpinia galanga)\"]', '[\"Mengatasi diare dengan menenangkan saluran pencernaan\",\"Membantu meredakan gejala perut tidak nyaman akibat diare.\"]', '[\"Ambil 11 lembar daun Gendola dan 5 iris lengkuas\",\"Campurkan dengan sedikit cuka dan hancurkan bahan-bahan tersebut hingga membentuk ramuan.\",\"Minum ramuan ini untuk mengatasi diare.\"]', NULL, NULL, '2025-05-12 09:09:00', 1, 0, '2025-07-30 13:56:56', '2025-07-30 13:56:56'),
(32, 'Obat Sifilis', 'obat-sifilis', NULL, NULL, 'Penyakit Kulit', 'Juwet (Eugenia cumini) adalah tanaman yang digunakan dalam pengobatan tradisional untuk mengatasi penyakit kelamin seperti sifilis. Kulit pohon Juwet dipercaya memiliki khasiat dalam menyembuhkan infeksi yang disebabkan oleh penyakit kelamin dengan cara yang alami.\r\nPastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan, terutama kulit pohon Juwet.\r\nJangan gunakan pada luka terbuka yang sangat besar atau infeksi berat tanpa konsultasi medis terlebih dahulu.\r\nJika gejala berlanjut atau memburuk, segera bawa pasien ke tenaga medis.', 'Pastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan, terutama kulit pohon Juwet.\r\nJangan gunakan pada luka terbuka yang sangat besar atau infeksi berat tanpa konsultasi medis terlebih dahulu.\r\nJika gejala berlanjut atau memburuk, segera bawa pasien ke tenaga medis.', '[\"Kulit pohon Juwet (Eugenia cumini)\",\"Citrus warangan (jeruk warangan)\"]', '[\"Mengobati penyakit kelamin seperti sifilis\",\"Membantu mempercepat penyembuhan luka atau infeksi pada tubuh.\"]', '[\"Hancurkan kulit pohon Juwet hingga menjadi bubuk.\",\"Campurkan bubuk kulit Juwet dengan Citrus warangan (jeruk warangan).\",\"Tempelkan campuran ini pada luka atau bagian tubuh yang terinfeksi akibat penyakit kelamin (seperti sifilis).\"]', NULL, NULL, '2025-05-13 05:17:00', 1, 0, '2025-07-30 14:00:35', '2025-07-30 14:00:35');
INSERT INTO `articles` (`id`, `title`, `slug`, `image_url`, `icon`, `category`, `description`, `content`, `ingredients`, `benefits`, `preparation_steps`, `keywords`, `meta_description`, `published_at`, `is_published`, `views_count`, `created_at`, `updated_at`) VALUES
(33, 'Obat Luka', 'obat-luka', NULL, NULL, 'Penyakit Kulit', 'Kedongdong (Spondias dulcis) adalah tanaman yang digunakan dalam pengobatan tradisional untuk mengatasi luka. Ramuan dari kulit pohon Kedongdong yang dicampur dengan bahan alami lainnya dipercaya dapat mempercepat penyembuhan luka.\r\nPastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan, terutama kulit pohon Kedongdong dan kunyit.\r\nJika luka tidak sembuh atau terjadi infeksi, segera konsultasikan dengan tenaga medis.', 'Pastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan, terutama kulit pohon Kedongdong dan kunyit.\r\nJika luka tidak sembuh atau terjadi infeksi, segera konsultasikan dengan tenaga medis.', '[\"Kulit pohon Kedongdong (Spondias dulcis)\",\"Kunyit (Curcuma longa Linn.)\",\"Air beras Coklat (Oryza rufipogon)\"]', '[\"Membantu menyembuhkan luka atau cedera pada tubuh\",\"Menenangkan dan meredakan peradangan pada luka.\"]', '[\"Hancurkan kulit pohon Kedongdong hingga menjadi bubuk.\",\"Campurkan bubuk kulit Kedongdong dengan kunyit yang telah dihancurkan dan air beras coklat.\",\"Oleskan campuran ini pada luka untuk mempercepat penyembuhan.\"]', NULL, NULL, '2025-05-15 01:24:00', 1, 0, '2025-07-30 14:03:02', '2025-07-30 14:03:02'),
(34, 'Obat Mata', 'obat-mata', NULL, NULL, 'Penyakit Dalam', 'Kedongdong (Spondias dulcis) adalah tanaman yang digunakan dalam pengobatan tradisional untuk mengatasi luka. Ramuan dari kulit pohon Kedongdong yang dicampur dengan bahan alami lainnya dipercaya dapat mempercepat penyembuhan luka.\r\nPastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan, terutama kulit pohon Kedongdong dan kunyit.\r\nJika luka tidak sembuh atau terjadi infeksi, segera konsultasikan dengan tenaga medis.', 'Pastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan, terutama kulit pohon Kedongdong dan kunyit.\r\nJika luka tidak sembuh atau terjadi infeksi, segera konsultasikan dengan tenaga medis.', '[\"Kulit pohon Kedongdong (Spondias dulcis)\",\"Kunyit (Curcuma longa Linn.)\",\"Air beras Coklat (Oryza rufipogon)\"]', '[\"Membantu menyembuhkan luka atau cedera pada tubuh.\",\"Menenangkan dan meredakan peradangan pada luka.\"]', '[\"Hancurkan kulit pohon Kedongdong hingga menjadi bubuk.\",\"Campurkan bubuk kulit Kedongdong dengan kunyit yang telah dihancurkan dan air beras coklat.\",\"Oleskan campuran ini pada luka untuk mempercepat penyembuhan.\"]', NULL, NULL, '2025-05-15 01:55:00', 1, 0, '2025-07-30 14:04:57', '2025-07-30 14:04:57'),
(36, 'Obat Mengobati Kondisi Lumpuh atau Plegia.', 'obat-mengobati-kondisi-lumpuh-atau-plegia', NULL, NULL, 'Penyakit Dalam', 'Kepuh (Sterculia foetida) adalah tanaman yang digunakan dalam pengobatan tradisional untuk mengobati kondisi lumpuh atau plegia. Ramuan ini terbuat dari daun, akar, dan kulit pohon Kepuh yang dicampur dengan bahan alami lainnya untuk membantu meredakan kelumpuhan dan mempercepat pemulihan.\r\nPastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan, terutama pada kulit sensitif.\r\nJika gejala kelumpuhan berlanjut atau memburuk, segera konsultasikan dengan tenaga medis.', 'Pastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan, terutama pada kulit sensitif.\r\nJika gejala kelumpuhan berlanjut atau memburuk, segera konsultasikan dengan tenaga medis.', '[\"Daun Kepuh (Sterculia foetida)\",\"Akar Kepuh\",\"Kulit Kepuh\",\"Kapur sirih\",\"Jus jeruk nipis (Citrus aurantifolia)\"]', '[\"Mengobati kelumpuhan atau plegia.\",\"Membantu merangsang peredaran darah dan meningkatkan fungsi saraf.\"]', '[\"Campurkan daun, akar, dan kulit pohon Kepuh dengan kapur sirih dan jus jeruk nipis.\",\"Aduk rata dan aplikasikan pada bagian tubuh yang lumpuh atau terpengaruh plegia.\",\"Penggunaan ramuan ini diharapkan dapat membantu meredakan gejala kelumpuhan dan mempercepat pemulihan.\"]', NULL, NULL, '2025-05-12 02:05:00', 1, 0, '2025-07-30 14:12:40', '2025-07-30 14:45:15'),
(37, 'Obat Wabah Penyakit Menular', 'obat-wabah-penyakit-menular', NULL, NULL, 'Penyakit Dalam', 'Kesimbukan (Paederia foetida L.) digunakan dalam pengobatan tradisional untuk mengatasi wabah penyakit menular. Tanaman ini dipercaya memiliki khasiat untuk membersihkan tubuh dari infeksi dan memperkuat sistem kekebalan tubuh. Ramuan ini melibatkan penggunaan daun Kesimbukan yang dicampur dengan bahan alami lainnya serta melibatkan ritual spiritual.\r\nPastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan.\r\nGunakan ramuan ini dengan hati-hati pada kulit sensitif dan jika Anda memiliki riwayat alergi terhadap bahan alami tertentu.', 'Pastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan.\r\nGunakan ramuan ini dengan hati-hati pada kulit sensitif dan jika Anda memiliki riwayat alergi terhadap bahan alami tertentu.', '[\"Daun Kesimbukan (Paederia foetida)\",\"Sarang Tawon yang terbuat dari tanah (diambil dari Sanggah Kemulan, pura ibu)\"]', '[\"Mengobati penyakit menular dan membantu meningkatkan daya tahan tubuh.\",\"Membersihkan tubuh dari infeksi dan memperkuat sistem kekebalan tubuh.\"]', '[\"Campurkan daun Kesimbukan dengan sarang tawon yang terbuat dari tanah di Sanggah Kemulan (pura ibu).\",\"Ramuan ini diolah menjadi pasta dan dioleskan pada bagian ubun-ubun kepala.\",\"Sambil menggunakan ramuan ini, mintalah kepada Ida Bhatara Brahma untuk membersihkan tubuh dari penyakit.\",\"Minum ramuan ini sebanyak tiga kali, dilakukan di depan dapur rumah.\"]', NULL, NULL, '2025-05-12 02:06:00', 1, 0, '2025-07-30 14:15:14', '2025-07-30 14:15:14'),
(38, 'Obat mengatasi pengaruh magis', 'obat-mengatasi-pengaruh-magis', NULL, NULL, 'Non-Medis', 'Pancarsona (Marremia mammosa) digunakan dalam pengobatan tradisional untuk mengatasi penyakit yang disebabkan oleh pengaruh magis atau ilmu hitam, terutama yang berasal dari seorang Pandita (pendeta) atau Brahmin. Tanaman ini digunakan untuk membersihkan tubuh dari energi negatif dan membantu mengembalikan keseimbangan tubuh yang terganggu akibat pengaruh spiritual.\r\nPenggunaan ramuan ini harus dilakukan dengan hati-hati dan sesuai dengan petunjuk spiritual yang ada.\r\nJika ada reaksi negatif atau ketidaknyamanan setelah penggunaan, segera hentikan dan konsultasikan dengan seorang ahli pengobatan atau spiritual.', 'Penggunaan ramuan ini harus dilakukan dengan hati-hati dan sesuai dengan petunjuk spiritual yang ada.\r\nJika ada reaksi negatif atau ketidaknyamanan setelah penggunaan, segera hentikan dan konsultasikan dengan seorang ahli pengobatan atau spiritual.', '[\"Pancarsona (Marremia mammosa)\"]', '[\"Mengatasi penyakit yang disebabkan oleh pengaruh magis atau ilmu hitam.\",\"Membantu menyeimbangkan kembali tubuh yang terganggu oleh energi negatif.\"]', '[\"Tanaman Pancarsona digunakan sebagai obat pembakar atau bahan untuk membakar sebagai ritual penyembuhan.\",\"Ramuan ini dipercaya dapat menghilangkan pengaruh magis atau energi negatif yang disebabkan oleh Pandita atau Brahmin.\"]', NULL, NULL, '2025-05-12 02:06:00', 1, 0, '2025-07-30 14:17:45', '2025-07-30 14:20:21'),
(39, 'Obat Mengatasi Penyakit akibat Kekuatan Magis', 'obat-mengatasi-penyakit-akibat-kekuatan-magis', NULL, NULL, 'Non-Medis', 'Panisih (Phyllanthus buxifolius) adalah tanaman yang digunakan dalam pengobatan tradisional untuk mengatasi penyakit yang disebabkan oleh kekuatan magis atau pengaruh gaib. Ramuan ini menggunakan getah dari tanaman Panisih yang dicampur dengan bahan alami lainnya, dipercaya dapat mengusir pengaruh magis dan mengembalikan keseimbangan tubuh.\r\nMembantu mengatasi penyakit yang disebabkan oleh pengaruh magis atau gaib.\r\nMengembalikan keseimbangan tubuh dan mengusir energi negatif yang mungkin mengganggu kesehatan', 'Membantu mengatasi penyakit yang disebabkan oleh pengaruh magis atau gaib.\r\nMengembalikan keseimbangan tubuh dan mengusir energi negatif yang mungkin mengganggu kesehatan', '[\"Getah Panisih (Phyllanthus buxifolius)\",\"Pohon cabai (Piper retrofractum)\",\"Jeruk nipis (Citrus aurantiifolia)\"]', '[\"Membantu mengatasi penyakit yang disebabkan oleh pengaruh magis atau gaib.\",\"Mengembalikan keseimbangan tubuh dan mengusir energi negatif yang mungkin mengganggu kesehatan.\"]', '[\"Campurkan getah Panisih dengan cabai pohon dan jeruk nipis.\",\"Gunakan campuran ini sebagai obat tetes pada tubuh, terutama pada area yang terpengaruh oleh kekuatan magis.\"]', NULL, NULL, '2025-05-12 02:08:00', 1, 11, '2025-07-30 14:20:03', '2025-07-30 18:06:39'),
(41, 'Obat untuk Pemali Brahma atau Nyeri Paha', 'obat-untuk-pemali-brahma-atau-nyeri-paha', NULL, NULL, 'Penyakit Dalam', 'Poh Amplem (Magifera sp.) adalah tanaman yang digunakan dalam pengobatan tradisional untuk mengatasi penyakit yang disebabkan oleh pemali Brahma (gangguan spiritual) atau nyeri pada sisi perut (stabbing pain). Ramuan ini menggabungkan kulit pohon Poh Amplem dengan bahan alami lainnya untuk meredakan rasa sakit dan membersihkan tubuh dari energi negatif.\r\nPastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan, terutama pada kulit sensitif.\r\nPenggunaan ramuan ini harus hati-hati, terutama pada area tubuh yang rentan atau terluka', 'Pastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan, terutama pada kulit sensitif.\r\nPenggunaan ramuan ini harus hati-hati, terutama pada area tubuh yang rentan atau terluka', '[\"Kulit pohon Poh Amplem (Magifera sp.)\",\"Kencur (Kaempferia galanga)\",\"Massoia aromatica (Cryptocarya massoia)\",\"Sinrong (campuran rempah seperti pala, ketumbar, massoia, jeringau, dan cengkeh)\"]', '[\"Mengatasi pemali Brahma yang disebabkan oleh gangguan spiritual.\",\"Meredakan nyeri pada sisi perut atau rasa sakit seperti ditusuk (stabbing pain).\"]', '[\"Campurkan kulit pohon Poh Amplem dengan kencur, massoia aromatica, dan sinrong.\",\"Semua bahan dihancurkan dan digunakan sebagai ramuan semprotan untuk disemprotkan pada bagian tubuh yang terkena nyeri perut atau gejala pemali Brahma.\"]', NULL, NULL, '2025-05-12 02:15:00', 1, 0, '2025-07-30 14:24:33', '2025-07-30 14:24:33'),
(42, 'Obat untuk Muntah', 'obat-untuk-muntah', NULL, NULL, 'Penyakit Dalam', 'Sentul (Sandoricum koetjape) digunakan dalam pengobatan tradisional untuk meredakan muntah. Daun dan akar tanaman ini dipercaya dapat menenangkan perut yang terganggu dan mengurangi rasa mual.\r\nGunakan sesuai dosis yang dianjurkan.\r\nJika muntah berlanjut atau disertai gejala lain, segera konsultasikan dengan tenaga medis.', 'Gunakan sesuai dosis yang dianjurkan.\r\nJika muntah berlanjut atau disertai gejala lain, segera konsultasikan dengan tenaga medis.', '[\"Akar dan daun Sentul (Sandoricum koetjape)\"]', '[\"Membantu meredakan muntah dan menenangkan saluran pencernaan.\"]', '[\"Akar dan daun Sentul digunakan sebagai ramuan yang diminum untuk mengatasi muntah.\"]', NULL, NULL, '2025-05-12 02:20:00', 1, 0, '2025-07-30 14:25:34', '2025-07-30 14:25:34'),
(43, 'Obat untuk Gastroenteritis', 'obat-untuk-gastroenteritis', NULL, NULL, 'Penyakit Dalam', 'Tanaman Sentul juga digunakan untuk mengatasi gastroenteritis atau peradangan pada saluran pencernaan yang dapat menyebabkan diare, mual, dan sakit perut. Kulit pohon Sentul dicampur dengan bahan alami lainnya untuk membantu meredakan gejala tersebut.\r\nPastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan.\r\nJika gejala gastroenteritis berlanjut, segera konsultasikan dengan dokter.', 'Pastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan.\r\nJika gejala gastroenteritis berlanjut, segera konsultasikan dengan dokter.', '[\"Kulit pohon Sentul (Sandoricum koetjape)\",\"Temu tis (Curcuma purpurascens Bl. syn. C. soloensis Val.)\",\"Garam panggang (roasted salt)\"]', '[\"Meredakan gejala gastroenteritis, seperti mual, diare, dan perut kembung.\",\"Membantu menenangkan saluran pencernaan dan mempercepat pemulihan.\"]', '[\"Campurkan kulit pohon Sentul dengan temu tis (Curcuma purpurascens) dan garam panggang.\",\"Semua bahan dihancurkan dan digunakan sebagai ramuan semprotan.\",\"Semprotkan ramuan ini pada perut pasien yang mengalami gastroenteritis.\"]', NULL, NULL, '2025-05-12 02:24:00', 1, 0, '2025-07-30 14:27:03', '2025-07-30 14:27:03'),
(44, 'Ramuan Obat untuk Sakit Telinga', 'ramuan-obat-untuk-sakit-telinga', NULL, NULL, 'Penyakit Dalam', 'Daun tanaman angket digunakan untuk mengobati sakit telinga dengan cara direbus, air rebusannya diambil sedikit dan diteteskan ke telinga.\r\nPastikan air rebusan tidak terlalu panas agar tidak melukai telinga.\r\nJika sakit telinga berlanjut, konsultasikan dengan dokter.', 'Pastikan air rebusan tidak terlalu panas agar tidak melukai telinga.\r\nJika sakit telinga berlanjut, konsultasikan dengan dokter.', '[\"Daun angket\"]', '[\"Meredakan sakit telinga dan mengurangi peradangan.\"]', '[\"Daun direbus, air rebusannya diambil sedikit.\",\"Air tersebut diteteskan ke telinga yang sakit.\"]', NULL, NULL, '2025-05-13 01:28:00', 1, 0, '2025-07-30 15:10:23', '2025-07-30 15:10:23'),
(45, 'Ramuan Obat Mabuk Tuak', 'ramuan-obat-mabuk-tuak', NULL, NULL, 'Penyakit Dalam', 'Daun tanaman jaka digunakan untuk mengobati mabuk tuak dengan cara direbus dan airnya diminum.\r\nGunakan dengan bijak dan hindari overdosis.', 'Gunakan dengan bijak dan hindari overdosis.', '[\"Daun jaka\"]', '[\"Membantu mengatasi mabuk alkohol (tuak).\"]', '[\"Daun direbus dan airnya diminum.\"]', NULL, NULL, '2025-05-13 01:15:00', 1, 0, '2025-07-30 15:23:12', '2025-07-30 15:23:12'),
(46, 'Ramuan Obat untuk Digigit Serangga', 'ramuan-obat-untuk-digigit-serangga', NULL, NULL, 'Penyakit Kulit', 'Getah dari tanaman pepaya digunakan sebagai obat untuk mengatasi gigitan serangga. Getah ini dicampur garam dan dioleskan pada bagian yang sakit.', 'Pastikan tidak alergi terhadap getah pepaya.', '[\"Getah pepaya\",\"Garam\"]', '[\"Mengurangi rasa sakit dan bengkak akibat gigitan serangga.\"]', '[\"Campurkan getah pepaya dengan garam.\",\"Oleskan campuran tersebut pada area gigitan serangga.\"]', NULL, NULL, '2025-05-13 02:13:00', 1, 0, '2025-07-30 15:24:49', '2025-07-30 15:24:49'),
(47, 'Obat Perut Kembung', 'obat-perut-kembung', NULL, NULL, 'Penyakit Dalam', 'Adas digunakan untuk mengatasi perut kembung dan gangguan pencernaan. Bijinya dihaluskan dan sarinya diminum untuk memberikan efek meredakan kembung.\r\nHindari penggunaan berlebihan karena dapat menyebabkan iritasi.', 'Hindari penggunaan berlebihan karena dapat menyebabkan iritasi.', '[\"Biji adas\"]', '[\"Meredakan perut kembung dan membantu melancarkan pencernaan.\"]', '[\"Biji dihaluskan dan sarinya diminum.\"]', NULL, NULL, '2025-05-13 02:15:00', 1, 0, '2025-07-30 15:26:06', '2025-07-30 15:26:06'),
(48, 'Ramuan Obat untuk Maag dan Rematik', 'ramuan-obat-untuk-maag-dan-rematik', NULL, NULL, 'Penyakit Dalam', 'Lempuyang adalah tanaman herbal yang banyak digunakan untuk mengatasi masalah pencernaan seperti maag dan juga rematik. Umbinya memiliki sifat antiinflamasi dan menenangkan.\r\nPerhatikan reaksi alergi.\r\nGunakan sesuai dosis dan konsultasikan dengan tenaga medis', 'Perhatikan reaksi alergi.\r\nGunakan sesuai dosis dan konsultasikan dengan tenaga medis', '[\"Umbi lempuyang\"]', '[\"Meredakan gejala maag.\",\"Mengurangi rasa sakit dan peradangan pada rematik.\"]', '[\"Umbi dihaluskan dan sarinya diminum untuk mengobati maag.\",\"Untuk rematik, umbi dicampur dengan daun sidowayah, daun kenanga, ketumbar, dan beras yang dihaluskan lalu ditambah air cuka, kemudian diparamkan.\"]', NULL, NULL, '2025-05-13 02:19:00', 1, 0, '2025-07-30 15:27:39', '2025-07-30 15:27:39'),
(49, 'Ramuan Obat untuk Diabetes dan Masalah Mata', 'ramuan-obat-untuk-diabetes-dan-masalah-mata', NULL, NULL, 'Penyakit Dalam', 'Bidara upas dikenal memiliki khasiat untuk membantu mengobati diabetes serta gangguan pada mata. Umbi dan daun bidara upas digunakan sebagai bahan utama dalam pengobatan tradisional.\r\nGunakan dengan hati-hati dan sesuai dosis.\r\nKonsultasi medis dianjurkan sebelum penggunaan.', 'Gunakan dengan hati-hati dan sesuai dosis.\r\nKonsultasi medis dianjurkan sebelum penggunaan.', '[\"Umbi bidara upas\",\"Daun dan biji bidara upas\"]', '[\"Membantu mengontrol gula darah.\",\"Mengatasi gangguan penglihatan atau masalah mata tertentu.\"]', '[\"Umbi dihaluskan dan sarinya diminum untuk mengobati diabetes.\",\"Daun dan biji direbus, airnya diminum dan juga digunakan untuk tetes mata.\"]', NULL, NULL, '2025-05-13 02:23:00', 1, 0, '2025-07-30 15:29:20', '2025-07-30 15:29:20'),
(50, 'Ramuan Obat untuk Diabetes dan Maag', 'ramuan-obat-untuk-diabetes-dan-maag', NULL, NULL, 'Penyakit Dalam', 'Mengkudu adalah tanaman yang digunakan secara luas dalam pengobatan tradisional untuk membantu mengatasi diabetes dan masalah pencernaan seperti maag. Buah atau bijinya mengandung zat yang dapat membantu mengatur kadar gula darah dan meredakan gejala maag.\r\nPastikan tidak alergi terhadap bahan-bahan alami ini.\r\nKonsultasikan dengan tenaga medis jika Anda sedang mengonsumsi obat diabetes.', 'Pastikan tidak alergi terhadap bahan-bahan alami ini.\r\nKonsultasikan dengan tenaga medis jika Anda sedang mengonsumsi obat diabetes.', '[\"Buah atau biji Mengkudu\",\"Campuran gamongan dan temulawak untuk menambah khasiat obat maag\"]', '[\"Membantu mengontrol kadar gula darah pada penderita diabetes.\",\"Meredakan gangguan pencernaan seperti maag.\"]', '[\"Buah atau biji mengkudu dicampur dengan gamongan dan temulawak.\",\"Sarinya diminum secara rutin untuk mengatasi maag dan membantu mengontrol gula darah.\"]', NULL, NULL, '2025-05-13 02:27:00', 1, 0, '2025-07-30 15:30:49', '2025-07-30 15:30:49'),
(51, 'Ramuan Obat untuk Menghidupkan Gairah Seksual', 'ramuan-obat-untuk-menghidupkan-gairah-seksual', NULL, NULL, 'Penyakit Dalam', 'Obat tradisional ini digunakan untuk meningkatkan gairah seksual. Ramuan ini dipercaya dapat memberikan efek positif pada kesehatan seksual, meningkatkan energi tubuh, dan mendukung peredaran darah yang sehat untuk fungsi seksual yang lebih baik.\r\nPastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nGunakan ramuan ini sesuai dengan dosis yang disarankan untuk menghindari konsumsi berlebihan.\r\nJika timbul ketidaknyamanan atau reaksi negatif lainnya, segera hentikan penggunaan dan konsultasikan dengan tenaga medis.', 'Pastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nGunakan ramuan ini sesuai dengan dosis yang disarankan untuk menghindari konsumsi berlebihan.\r\nJika timbul ketidaknyamanan atau reaksi negatif lainnya, segera hentikan penggunaan dan konsultasikan dengan tenaga medis.', '[\"Kelapa Muda Hijau yang Dikikir: Kelapa muda hijau yang dikikir dipercaya dapat memberikan energi yang baik untuk tubuh dan meningkatkan stamina.\",\"Madu: Madu digunakan dalam pengobatan tradisional untuk memberikan kelembapan dan meningkatkan vitalitas tubuh.\"]', '[\"Membantu meningkatkan gairah seksual dan vitalitas tubuh.\",\"Menambah energi dan stamina seksual secara alami.\"]', '[\"Ambil kelapa muda hijau dan kikir daging kelapa hingga halus.\",\"Panggang atau bakar kelapa muda tersebut hingga matang dan aromanya harum.\",\"Setelah dipanggang, campurkan kelapa muda yang telah dipanggang dengan madu secukupnya.\",\"Makan ramuan ini dalam jumlah yang disarankan.\"]', NULL, NULL, '2025-05-13 02:34:00', 1, 0, '2025-07-30 15:33:53', '2025-07-30 15:33:53'),
(52, 'Ramuan Obat untuk Meningkatkan Gairah Seksual', 'ramuan-obat-untuk-meningkatkan-gairah-seksual', NULL, NULL, 'Penyakit Dalam', 'Obat tradisional ini digunakan untuk membantu meningkatkan gairah seksual. Ramuan ini dipercaya dapat memberikan efek positif pada kesehatan seksual dan memperbaiki peredaran darah yang mendukung fungsi seksual yang lebih baik.\r\nPastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nGunakan dengan hati-hati dan sesuai dosis yang disarankan.\r\nJika timbul ketidaknyamanan atau efek samping lainnya, segera hentikan penggunaan dan konsultasikan dengan tenaga medis.', 'Pastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nGunakan dengan hati-hati dan sesuai dosis yang disarankan.\r\nJika timbul ketidaknyamanan atau efek samping lainnya, segera hentikan penggunaan dan konsultasikan dengan tenaga medis.', '[\"Bunga Jaruju: Bunga jaruju digunakan dalam pengobatan tradisional untuk meningkatkan sirkulasi darah dan merangsang energi seksual.\",\"Jasun Putih: Jasun putih, yang dikenal juga dalam beberapa pengobatan tradisional, dipercaya memiliki manfaat untuk meningkatkan vitalitas dan stamina tubuh.\"]', '[\"Membantu meningkatkan gairah seksual.\",\"Menambah vitalitas tubuh dan meningkatkan stamina.\"]', '[\"Ambil bunga jaruju dan jasun putih secukupnya.\",\"Haluskan atau lumatkan kedua bahan tersebut hingga membentuk ramuan yang bisa digunakan.\",\"Ramuan ini dapat langsung diminum atau digunakan sesuai petunjuk yang disarankan.\"]', NULL, NULL, '2025-05-13 02:35:00', 1, 0, '2025-07-30 15:35:25', '2025-07-30 15:35:25'),
(53, 'Ramuan Obat Penawar Luka Perut di Dalam', 'ramuan-obat-penawar-luka-perut-di-dalam', NULL, NULL, 'Penyakit Dalam', 'Obat tradisional ini digunakan untuk mengatasi luka dalam perut, seperti luka yang disebabkan oleh gangguan pencernaan atau iritasi pada saluran pencernaan. Ramuan ini dipercaya dapat membantu meredakan rasa sakit dan mempercepat proses penyembuhan pada luka dalam perut.\r\nPastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nJika ada ketidaknyamanan atau reaksi negatif setelah mengonsumsi ramuan ini, segera hentikan penggunaan dan konsultasikan dengan tenaga medis.\r\nGunakan ramuan ini dengan hati-hati pada bayi, anak-anak, atau individu yang memiliki gangguan pencernaan serius.', 'Pastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nJika ada ketidaknyamanan atau reaksi negatif setelah mengonsumsi ramuan ini, segera hentikan penggunaan dan konsultasikan dengan tenaga medis.\r\nGunakan ramuan ini dengan hati-hati pada bayi, anak-anak, atau individu yang memiliki gangguan pencernaan serius.', '[\"Lengkuas: Lengkuas memiliki sifat antiinflamasi dan antibakteri yang dapat membantu meredakan peradangan di dalam tubuh, termasuk di saluran pencernaan.\",\"Cendana: Cendana digunakan untuk memberikan efek menenangkan dan memiliki sifat antimikroba yang dapat membantu penyembuhan luka internal.\"]', '[\"Membantu meredakan rasa sakit akibat luka dalam perut.\",\"Mempercepat penyembuhan luka di saluran pencernaan.\"]', '[\"Ambil lengkuas dan cendana secukupnya.\",\"Gosokkan lengkuas dan cendana hingga halus, lalu buatkan air seduhan dengan mencampurkan bahan tersebut dalam air.\",\"Didihkan air tersebut hingga mendidih.\",\"Setelah mendidih, ambil airnya sebanyak seperempat dari total ramuan, kemudian campurkan dengan setengah dari perempat air gosokan cendana dan gosokan lengkuas.\",\"Saring ramuan ini dan minum sebanyak tiga sendok makan (dosis bisa disesuaikan).\"]', NULL, NULL, '2025-05-13 02:37:00', 1, 0, '2025-07-30 15:37:07', '2025-07-30 15:37:07'),
(54, 'Ramuan Obat untuk Panas Dalam', 'ramuan-obat-untuk-panas-dalam', NULL, NULL, 'Penyakit Dalam', 'Sembung hutan adalah tanaman yang digunakan untuk mengatasi panas dalam, yaitu kondisi tubuh yang terasa panas dan tidak nyaman. Seluruh tanaman dapat digunakan sebagai ramuan obat.\r\nGunakan sesuai dosis yang dianjurkan.\r\nKonsultasikan dengan tenaga medis jika ada kondisi khusus.', 'Gunakan sesuai dosis yang dianjurkan.\r\nKonsultasikan dengan tenaga medis jika ada kondisi khusus.', '[\"Seluruh bagian tanaman sembung hutan\",\"Bawang, adas, dan bidara upas (untuk campuran)\"]', '[\"Meredakan panas dalam dan membantu menyejukkan tubuh.\"]', '[\"Tanaman sembung hutan dicampur dengan bawang, adas, dan bidara upas yang dihaluskan.\",\"Ramuan ini diminum untuk mengurangi panas dalam tubuh.\"]', NULL, NULL, '2025-05-13 02:40:00', 1, 0, '2025-07-30 15:38:22', '2025-07-30 15:38:22'),
(55, 'Ramuan Lulur untuk Panas Dalam pada Bagian Bawah Punggung', 'ramuan-lulur-untuk-panas-dalam-pada-bagian-bawah-punggung', NULL, NULL, 'Penyakit Dalam', 'Obat tradisional ini digunakan untuk meredakan panas dalam pada tubuh, terutama di bagian bawah punggung. Ramuan ini dipercaya dapat memberikan efek menenangkan pada tubuh dan meredakan peradangan atau ketidaknyamanan yang disebabkan oleh panas dalam.\r\nPastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nGunakan ramuan ini dengan hati-hati, terutama pada kulit yang sensitif.\r\nJika timbul iritasi atau rasa tidak nyaman lainnya, segera hentikan penggunaan dan konsultasikan dengan tenaga medis.', 'Pastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nGunakan ramuan ini dengan hati-hati, terutama pada kulit yang sensitif.\r\nJika timbul iritasi atau rasa tidak nyaman lainnya, segera hentikan penggunaan dan konsultasikan dengan tenaga medis.', '[\"Akar Pohon Canging: Akar pohon canging digunakan dalam pengobatan tradisional untuk meredakan peradangan dan memberikan efek menenangkan pada tubuh yang panas.\",\"Akar Jaruju: Akar jaruju dikenal dalam pengobatan tradisional untuk mengatasi panas dalam dan membantu melancarkan peredaran darah.\",\"Pulasari: Pulasari digunakan untuk mengatasi peradangan dan memberikan efek menenangkan pada tubuh yang terasa panas atau tertekan.\",\"Bawang Adas: Bawang adas membantu menenangkan tubuh dan mengatasi gangguan pencernaan yang sering menjadi penyebab panas dalam.\"]', '[\"Membantu meredakan panas dalam pada bagian bawah punggung.\",\"Menenangkan tubuh dan membantu melancarkan peredaran darah.\",\"Mengurangi rasa tidak nyaman akibat panas dalam.\"]', '[\"Ambil akar pohon canging, akar jaruju, pulasari, dan bawang adas secukupnya.\",\"Haluskan semua bahan tersebut hingga membentuk pasta atau ramuan yang bisa digunakan untuk luluran.\",\"Oleskan ramuan ini pada bagian bawah punggung yang terasa panas atau tidak nyaman.\",\"Diamkan beberapa menit agar ramuan dapat bekerja meredakan panas dalam dan memberikan efek menenangkan.\"]', NULL, NULL, '2025-05-13 02:43:00', 1, 0, '2025-07-30 15:40:19', '2025-07-30 15:40:19'),
(56, 'Ramuan Obat untuk Demam', 'ramuan-obat-untuk-demam', NULL, NULL, 'Penyakit Anak', 'Obat ini digunakan dalam pengobatan tradisional untuk meredakan demam. Ramuan ini dipercaya dapat membantu menurunkan suhu tubuh yang tinggi dan memberikan efek menenangkan pada tubuh yang demam.\r\nPastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nDosis harus disesuaikan dengan usia dan kondisi pasien.\r\nJika demam berlanjut atau pasien merasa tidak nyaman, segera konsultasikan dengan tenaga medis.', 'Pastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nDosis harus disesuaikan dengan usia dan kondisi pasien.\r\nJika demam berlanjut atau pasien merasa tidak nyaman, segera konsultasikan dengan tenaga medis.', '[\"Kelapa: Air kelapa dikenal dalam pengobatan tradisional karena sifatnya yang menyejukkan dan dapat membantu menurunkan demam.\",\"Adas: Adas digunakan untuk membantu memperlancar peredaran darah dan menenangkan tubuh yang demam.\",\"Jeruk Nipis: Jeruk nipis memiliki sifat pendinginan dan dapat membantu menurunkan demam serta menyegarkan tubuh.\"]', '[\"Membantu menurunkan demam dan menyegarkan tubuh yang panas.\",\"Melancarkan peredaran darah dan memberikan efek menenangkan pada tubuh.\"]', '[\"Ambil air kelapa secukupnya, adas, dan jeruk nipis.\",\"Peras jeruk nipis dan campurkan dengan air kelapa serta sedikit adas\",\"Aduk rata dan minum ramuan ini untuk membantu menurunkan demam.\"]', NULL, NULL, '2025-05-13 02:45:00', 1, 0, '2025-07-30 15:42:05', '2025-07-30 15:42:05'),
(57, 'Ramuan Obat untuk Pinggang yang Terasa Kaku', 'ramuan-obat-untuk-pinggang-yang-terasa-kaku', NULL, NULL, 'Penyakit Dalam', 'Obat tradisional ini digunakan untuk meredakan rasa kaku pada pinggang. Ramuan ini dipercaya dapat membantu melancarkan peredaran darah, mengurangi ketegangan otot, dan meredakan rasa sakit akibat pinggang yang terasa kaku.\r\nPastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nGunakan ramuan ini dengan hati-hati pada kulit yang sensitif.\r\nJika rasa kaku pada pinggang berlanjut atau terjadi iritasi, segera hentikan penggunaan dan konsultasikan dengan tenaga medis.', 'Pastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nGunakan ramuan ini dengan hati-hati pada kulit yang sensitif.\r\nJika rasa kaku pada pinggang berlanjut atau terjadi iritasi, segera hentikan penggunaan dan konsultasikan dengan tenaga medis.', '[\"Kunyit Warangan: Kunyit warangan memiliki sifat antiinflamasi dan dipercaya dapat membantu meredakan rasa sakit serta peradangan pada tubuh, termasuk pinggang yang kaku.\",\"Jebuggarum: Jebuggarum digunakan dalam pengobatan tradisional untuk meredakan nyeri otot dan membantu mengatasi pembengkakan pada area yang terasa sakit.\"]', '[\"Membantu meredakan rasa kaku dan nyeri pada pinggang.\",\"Melancarkan peredaran darah dan mengurangi ketegangan otot.\"]', '[\"Ambil kunyit warangan dan jebuggarum secukupnya.\",\"Haluskan kedua bahan tersebut hingga membentuk pasta atau ramuan yang bisa digunakan.\",\"Oleskan ramuan ini pada bagian pinggang yang terasa kaku dengan lembut.\",\"Diamkan beberapa saat agar ramuan dapat bekerja meredakan ketegangan pada pinggang.\"]', NULL, NULL, '2025-05-13 02:48:00', 1, 0, '2025-07-30 15:43:50', '2025-07-30 15:43:50'),
(59, 'Ramuan Obat untuk Leher yang Terasa Kaku', 'ramuan-obat-untuk-leher-yang-terasa-kaku', NULL, NULL, 'Penyakit Dalam', 'Obat tradisional ini digunakan untuk meredakan rasa kaku pada leher. Ramuan ini dipercaya dapat membantu melancarkan peredaran darah, meredakan ketegangan otot, dan mengurangi rasa sakit akibat leher yang kaku.\r\nPastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nGunakan ramuan ini dengan hati-hati pada kulit yang sensitif.\r\nJika rasa kaku berlanjut atau ada reaksi negatif, segera hentikan penggunaan dan konsultasikan dengan tenaga medis.', 'Pastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nGunakan ramuan ini dengan hati-hati pada kulit yang sensitif.\r\nJika rasa kaku berlanjut atau ada reaksi negatif, segera hentikan penggunaan dan konsultasikan dengan tenaga medis.', '[\"Akar Dausa: Akar dausa digunakan dalam pengobatan tradisional untuk meredakan ketegangan otot dan membantu melancarkan peredaran darah\",\"Akar Bekul: Akar bekul dikenal memiliki sifat menenangkan dan digunakan untuk meredakan rasa sakit dan peradangan pada tubuh.\",\"Akar Gangyang: Akar gangyang digunakan dalam beberapa ramuan untuk meredakan rasa kaku dan meningkatkan kelenturan otot.\",\"Trikatuka: Trikatuka adalah campuran tiga bahan herbal yang digunakan dalam pengobatan tradisional untuk mengatasi peradangan dan meredakan rasa sakit.\"]', '[\"Membantu meredakan rasa kaku pada leher dan meningkatkan kelenturan otot.\",\"Mengurangi rasa sakit dan ketegangan pada bagian leher.\"]', '[\"Ambil akar dausa, akar bekul, akar gangyang, dan trikatuka secukupnya.\",\"Haluskan semua bahan tersebut hingga membentuk pasta atau ramuan yang bisa digunakan.\",\"Oleskan ramuan ini pada area leher yang terasa kaku dengan lembut.\",\"Diamkan selama beberapa menit agar ramuan dapat bekerja meredakan ketegangan pada leher.\"]', NULL, NULL, '2025-05-13 02:53:00', 1, 0, '2025-07-30 15:47:49', '2025-07-30 15:47:49'),
(60, 'Ramuan Obat untuk Mengatasi Lupa', 'ramuan-obat-untuk-mengatasi-lupa', NULL, NULL, 'Penyakit Dalam', 'Obat tradisional ini digunakan untuk membantu meredakan kondisi lupa atau gangguan memori ringan. Ramuan ini dipercaya dalam pengobatan tradisional dapat meningkatkan konsentrasi dan membantu memperbaiki daya ingat dengan cara dioleskan pada bagian tubuh tertentu.\r\nPastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nGunakan ramuan ini dengan hati-hati pada kulit yang sensitif.\r\nJika kondisi lupa atau gangguan memori berlanjut, segera konsultasikan dengan tenaga medis.', 'Pastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nGunakan ramuan ini dengan hati-hati pada kulit yang sensitif.\r\nJika kondisi lupa atau gangguan memori berlanjut, segera konsultasikan dengan tenaga medis.', '[\"Pulasari: Pulasari dikenal dalam pengobatan tradisional untuk meningkatkan daya ingat dan merangsang otak.\",\"Kencur: Kencur digunakan dalam pengobatan tradisional untuk menenangkan tubuh dan merangsang aliran darah, yang diharapkan dapat memperbaiki fungsi otak.\",\"Beras yang Dipanggang: Beras yang dipanggang digunakan dalam beberapa ramuan tradisional untuk memberikan efek menenangkan dan meningkatkan daya ingat.\"]', '[\"Membantu meningkatkan daya ingat dan mengatasi lupa.\",\"Merangsang sirkulasi darah di kepala dan meningkatkan konsentrasi.\"]', '[\"Ambil pulasari, kencur, dan beras yang dipanggang secukupnya.\",\"Panggang beras hingga harum dan sedikit kecoklatan.\",\"Gerus pulasari, kencur, dan beras yang telah dipanggang hingga halus dan tercampur rata.\",\"Oleskan ramuan ini pada bagian dahi atau area sekitar kepala yang terasa tegang, dengan lembut.\"]', NULL, NULL, '2025-05-13 02:56:00', 1, 0, '2025-07-30 15:49:25', '2025-07-30 15:49:25'),
(61, 'Ramuan Obat untuk Sakit pada Badan', 'ramuan-obat-untuk-sakit-pada-badan', NULL, NULL, 'Penyakit Dalam', 'Obat tradisional ini digunakan untuk meredakan sakit pada badan, seperti nyeri otot atau tubuh yang pegal. Ramuan ini dipercaya dapat memberikan efek relaksasi dan membantu meredakan rasa sakit dengan cara dioleskan pada tubuh.\r\nPastikan tidak ada reaksi alergi terhadap daun kayu puring atau bahan lainnya.\r\nGunakan ramuan ini dengan hati-hati, terutama pada kulit yang sensitif atau jika ada luka terbuka.\r\nJika rasa sakit berlanjut atau timbul reaksi negatif, segera hentikan penggunaan dan konsultasikan dengan tenaga medis.', 'Pastikan tidak ada reaksi alergi terhadap daun kayu puring atau bahan lainnya.\r\nGunakan ramuan ini dengan hati-hati, terutama pada kulit yang sensitif atau jika ada luka terbuka.\r\nJika rasa sakit berlanjut atau timbul reaksi negatif, segera hentikan penggunaan dan konsultasikan dengan tenaga medis.', '[\"Daun Kayu Puring: Daun kayu puring dikenal dalam pengobatan tradisional untuk meredakan rasa sakit dan nyeri pada tubuh. Daun ini memiliki sifat menenangkan yang dapat membantu mengurangi ketegangan pada otot dan tubuh.\"]', '[\"Membantu meredakan sakit pada badan, termasuk nyeri otot dan tubuh pegal.\",\"Memberikan efek menenangkan dan melancarkan peredaran darah di area yang sakit.\"]', '[\"Ambil daun kayu puring secukupnya.\",\"Gosokkan daun kayu puring tersebut hingga mengeluarkan getah atau aroma khas.\",\"Campurkan daun kayu puring yang sudah digosok dengan air hangat.\",\"Lulurkan ramuan ini pada bagian tubuh yang terasa sakit atau pegal, seperti punggung, leher, atau kaki.\"]', NULL, NULL, '2025-05-13 02:59:00', 1, 0, '2025-07-30 15:51:05', '2025-07-30 15:51:05'),
(62, 'Ramuan Obat untuk Pusing (Sakit Kepala)', 'ramuan-obat-untuk-pusing-sakit-kepala', NULL, NULL, 'Penyakit Dalam', 'Obat tradisional ini digunakan untuk mengatasi pusing atau sakit kepala. Ramuan ini menggabungkan bahan alami dengan mantra tertentu yang dipercaya dapat membantu meredakan pusing dan menyembuhkan sakit kepala dengan cara yang menenangkan.\r\nPastikan tidak ada reaksi alergi terhadap bahan kemiri jentung yang digunakan.\r\nGunakan ramuan ini dengan hati-hati dan pastikan tidak ada iritasi pada kulit.\r\nJika pusing atau sakit kepala berlanjut atau ada gejala lain yang mengkhawatirkan, segera konsultasikan dengan tenaga medis.', 'Pastikan tidak ada reaksi alergi terhadap bahan kemiri jentung yang digunakan.\r\nGunakan ramuan ini dengan hati-hati dan pastikan tidak ada iritasi pada kulit.\r\nJika pusing atau sakit kepala berlanjut atau ada gejala lain yang mengkhawatirkan, segera konsultasikan dengan tenaga medis.', '[\"Kemiri Jentung: Kemiri jentung digunakan dalam pengobatan tradisional untuk meredakan rasa pusing dan memberikan efek menenangkan pada tubuh.\"]', '[\"Membantu meredakan pusing atau sakit kepala.\",\"Menenangkan tubuh dan pikiran yang mengalami ketegangan atau gangguan yang menyebabkan pusing.\"]', '[\"Ambil kemiri jentung secukupnya.\",\"Potong kemiri jentung sambil mengucapkan mantra \\\"Sapagelo, yen meh rene patambaning anglempuyeng, den waras\\\" (Siapa yang gila, jika demikian berikan obat sakit kepala agar sembuh)\\u201d sebanyak 3 kali.\",\"Setelah itu, haluskan atau lumatkan kemiri jentung.\",\"Oleskan ramuan kemiri jentung yang telah dilumatkan pada dahi pasien yang sedang merasa pusing atau sakit kepala.\"]', NULL, NULL, '2025-05-14 03:01:00', 1, 0, '2025-07-30 15:52:35', '2025-07-30 15:52:35'),
(63, 'Ramuan Obat untuk Cedera Otot/Terkilir', 'ramuan-obat-untuk-cedera-ototterkilir', 'articles/G3DnNQqvQsIeWohgyzdHyQsygksBQMP1NiwZt0XX.png', NULL, 'Penyakit Dalam', 'Obat tradisional ini digunakan untuk meredakan cedera otot atau terkilir. Ramuan ini dipercaya dapat membantu mengurangi peradangan, meredakan rasa sakit, dan mempercepat proses penyembuhan pada cedera otot.\r\nPastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nGunakan ramuan ini dengan hati-hati, terutama pada area kulit yang sensitif.\r\nJika cedera berlanjut atau terjadi iritasi pada kulit, segera hentikan penggunaan dan konsultasikan dengan tenaga medis.', 'Pastikan tidak ada reaksi alergi terhadap bahan-bahan yang digunakan dalam ramuan ini.\r\nGunakan ramuan ini dengan hati-hati, terutama pada area kulit yang sensitif.\r\nJika cedera berlanjut atau terjadi iritasi pada kulit, segera hentikan penggunaan dan konsultasikan dengan tenaga medis.', '[\"Lalari: Lalari digunakan dalam pengobatan tradisional untuk membantu meredakan peradangan dan memberikan efek penyembuhan pada cedera otot.\",\"Pelepah dan Daun Pisang Saba yang Kering: Pelepah dan daun pisang saba dipercaya memiliki sifat menenangkan dan membantu meredakan nyeri serta mempercepat pemulihan.\",\"Daun Jarak yang Kering: Daun jarak digunakan dalam pengobatan tradisional untuk meredakan rasa sakit dan membantu mengatasi pembengkakan akibat cedera.\",\"Trikatuka: Trikatuka adalah campuran tiga bahan herbal yang digunakan dalam pengobatan tradisional untuk meredakan rasa sakit dan peradangan.\"]', '[\"Membantu meredakan cedera otot dan terkilir.\",\"Mengurangi pembengkakan, peradangan, dan rasa sakit.\",\"Mempercepat proses penyembuhan cedera otot.\"]', '[\"Ambil lalari, pelepah dan daun pisang saba yang sudah kering, serta daun jarak yang kering secukupnya.\",\"Panggang atau bakar bahan-bahan tersebut hingga layu atau agak terpanggang\",\"Gerus semua bahan yang telah dipanggang hingga halus.\",\"Campurkan bahan-bahan yang telah digerus dengan trikatuka.\",\"Oleskan atau bedakkan ramuan ini pada area cedera otot atau terkilir, seperti pada bagian yang bengkak atau nyeri.\"]', NULL, NULL, '2025-05-14 03:05:00', 1, 0, '2025-07-30 15:54:35', '2025-07-30 20:35:21');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(3, 'Vitamin & Imunitas', 'Vitamin & Imunitas', 1, '2025-05-31 03:36:18', '2025-05-31 03:36:18'),
(5, 'Perawatan Kulit', 'Khusus untuk oles di permukaan kulit', 1, '2026-05-19 07:09:28', '2026-05-19 07:09:28'),
(6, 'Batuk & Flu', 'Ramuan Untuk mengatasi flu dan batuk', 1, '2026-05-19 07:12:40', '2026-05-19 07:12:40'),
(7, 'Jamu Tradisional', 'untuk ramuan jamu tradisional', 1, '2026-05-19 07:13:23', '2026-05-19 07:13:23');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(47, '0001_01_01_000000_create_users_table', 1),
(48, '0001_01_01_000001_create_cache_table', 1),
(49, '0001_01_01_000002_create_jobs_table', 1),
(50, '2025_02_26_105757_create_categories_table', 1),
(51, '2025_02_28_102326_create_products_table', 1),
(52, '2025_02_28_102932_create_product_variants_table', 1),
(53, '2025_03_03_121834_create_orders_table', 1),
(54, '2025_03_03_123157_create_order_products_table', 1),
(55, '2025_03_10_110809_create_personal_access_tokens_table', 1),
(56, '2025_03_24_110457_create_articles_table', 1),
(57, '2025_04_07_113346_add_role_on_users_table', 1),
(58, '2025_05_26_154138_create_payments_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `phone` varchar(255) NOT NULL,
  `status` enum('PENDING','FAILED','PAID','CANCELLED') NOT NULL,
  `price` double NOT NULL,
  `total` double NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `payment_channel` varchar(255) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `address_description` text DEFAULT NULL,
  `city` varchar(255) NOT NULL,
  `postal_code` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `products_name` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `phone`, `status`, `price`, `total`, `url`, `payment_channel`, `payment_method`, `first_name`, `last_name`, `email`, `address`, `address_description`, `city`, `postal_code`, `country`, `products_name`, `created_at`, `updated_at`) VALUES
(53, 3, '081246662579', 'PENDING', 142000, 142000, 'https://checkout-staging.xendit.co/web/683b4c12bafdc379bf9370b6', NULL, NULL, 'Adika', 'Ananda', 'kadekadikaananda2006@gmail.com', 'Jalan Raya SIngapadu', 'aku', 'Kab. Gianyar', '12345', 'Indonesia', 'Kunyit Asem', '2025-05-31 10:36:00', '2025-05-31 10:36:03'),
(54, 3, '081246662579', 'PENDING', 47400, 47400, 'https://checkout-staging.xendit.co/web/683bd14a905c4498109b0341', NULL, NULL, 'Adika', 'Ananda', 'kadekadikaananda2006@gmail.com', 'Jalan Raya SIngapadu', 'aku', 'Kab. Gianyar', '12345', 'Indonesia', 'Loloh Cemcem, Kunyit Asem', '2025-05-31 20:04:24', '2025-05-31 20:04:25'),
(55, 1, '082236878772', 'PENDING', 88100, 88100, 'https://checkout-staging.xendit.co/web/6a0ddb98c458850bcfdde2ba', NULL, NULL, 'candra', '', '123@gmail.com', 'jsjsjall', 'lalal', 'denpasar', '23421', 'Indonesia', 'Loloh Cemcem, Minyak Oles Bokashi', '2026-05-20 08:04:37', '2026-05-20 08:04:42'),
(56, 1, '082236878772', 'PENDING', 28700, 28700, 'https://checkout-staging.xendit.co/web/6a0ddc60c458850bcfdde398', NULL, NULL, 'candra', '', '123@gmail.com', 'jsjsjall', 'lalal', 'denpasar', '23421', 'Indonesia', 'Minyak Oles Bokashi', '2026-05-20 08:07:58', '2026-05-20 08:08:00'),
(57, 1, '082236878772', 'PENDING', 28700, 28700, 'https://checkout-staging.xendit.co/web/6a0ddd7ec458850bcfdde4e7', NULL, NULL, 'candra', '', '123@gmail.com', 'jsjsjall', 'lalal', 'denpasar', '23421', 'Indonesia', 'Minyak Oles Bokashi', '2026-05-20 08:12:45', '2026-05-20 08:12:47');

-- --------------------------------------------------------

--
-- Table structure for table `order_products`
--

CREATE TABLE `order_products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `product_variant_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` double NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_products`
--

INSERT INTO `order_products` (`id`, `order_id`, `product_variant_id`, `quantity`, `price`, `created_at`, `updated_at`) VALUES
(52, 53, 3, 10, 12000, '2025-05-31 10:36:00', '2025-05-31 10:36:00'),
(53, 54, 2, 1, 10000, '2025-05-31 20:04:24', '2025-05-31 20:04:24'),
(54, 54, 3, 2, 12000, '2025-05-31 20:04:24', '2025-05-31 20:04:24'),
(55, 55, 2, 2, 10000, '2026-05-20 08:04:37', '2026-05-20 08:04:37'),
(56, 55, 4, 3, 17000, '2026-05-20 08:04:37', '2026-05-20 08:04:37'),
(57, 56, 4, 1, 17000, '2026-05-20 08:07:58', '2026-05-20 08:07:58'),
(58, 57, 4, 1, 17000, '2026-05-20 08:12:45', '2026-05-20 08:12:45');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `payment_method` varchar(255) NOT NULL,
  `payment_channel` varchar(255) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `xendit_id` varchar(255) NOT NULL,
  `status` enum('PENDING','PAID','FAILED','EXPIRED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `payment_url` varchar(255) DEFAULT NULL,
  `payment_code` varchar(255) DEFAULT NULL,
  `qr_code` text DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `callback_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`callback_data`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 2, 'auth_token', '7012918fcc3788b12fd9329e3a4ab9b8d7a002741f3b61e6a19ce97af7e8418d', '[\"*\"]', '2025-05-27 05:01:27', NULL, '2025-05-27 02:11:48', '2025-05-27 05:01:27'),
(19, 'App\\Models\\User', 3, 'auth_token', 'b492152d5efdcc9a9c0aab5eda91353bbcb0f650f98cae2061a64aea9500cd8c', '[\"*\"]', '2025-05-31 21:00:16', NULL, '2025-05-31 20:02:48', '2025-05-31 21:00:16'),
(24, 'App\\Models\\User', 1, 'auth_token', '1c6055d5cf548a1d0ca8f37c14c92549a6bdf74c8cd9766df2dc10ecee082e84', '[\"*\"]', '2026-05-20 08:20:03', NULL, '2026-05-20 08:04:15', '2026-05-20 08:20:03');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `description` text DEFAULT NULL,
  `company` varchar(255) NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `price` double NOT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`images`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `is_active`, `description`, `company`, `category_id`, `price`, `images`, `created_at`, `updated_at`) VALUES
(2, 'Loloh Cemcem', 1, 'Loloh Cemcem', 'Usada', 3, 10000, '[\"products\\/gDEr8lit26fsgvytk8fsUksWYqRS0EdX43Som6CG.jpg\"]', '2025-05-31 03:37:59', '2025-05-31 09:23:50'),
(3, 'Kunyit Asem', 1, 'Kunyit Asem Menyegarkan', 'Usada', 3, 12000, '[\"products\\/tmRu16P3ZiVqxLujBedm4ZU9AQq5Q09zqTcUexyC.jpg\"]', '2025-05-31 09:25:10', '2025-05-31 09:25:10'),
(4, 'Minyak Oles Bokashi', 1, 'Minyak oles bokashi adalah obat bahan alam tergolong jamu yang berkhasiat untuk membantu\r\nmeredakan masalah kulit, pegal linu, masuk angin, serta digunakan sebagai minyak urut. Dibuat dari\r\nproses fermentasi berbagai tanaman berkhasiat obat dengan Teknologi Effective Microorganisms (EM)\r\nJepang. Dapat digunakan untuk semua usia, cocok sebagai pelengkap P3K keluarga.', 'PT Karya Pak Oles Tokcer', 5, 17000, '[\"products\\/NXE3zWoEQq4jSgCsKCOFEDjumeCb9WjUZTcWPsRn.jpg\"]', '2026-05-19 02:11:55', '2026-05-19 07:10:21'),
(5, 'Bokashi Care', 1, 'Bokashi Care merupakan minyak angin aromatherapy dengan aroma yang menyegarkan dikemas\r\ndengan kemasan minimalis yang memudahkan untuk dibawa kemanapun anda berpergian.\r\nDiformulasikan menggunakan bahan aktif yang terkandung dalam Menthol dan Camphor dan bahan\r\nalami seperti rempah-rempah yang berkhasiat dan dipadukan dengan aroma green lemon dan eucalyptus.', 'PT Karya Pak Oles Tokcer', 5, 17000, '[\"products\\/14fKvTKQpYArylvzXkDUIAfoa9tjKgValP8BxQIf.jpg\"]', '2026-05-19 07:18:26', '2026-05-19 07:18:26');

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `variant_name` varchar(255) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `size` int(11) DEFAULT NULL,
  `weight` decimal(8,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`id`, `product_id`, `variant_name`, `stock`, `size`, `weight`, `created_at`, `updated_at`) VALUES
(2, 2, 'Minuman', 97, 10, 100.00, '2025-05-31 03:37:59', '2026-05-20 08:04:37'),
(3, 3, 'Minuman', 18, 10, 117.00, '2025-05-31 09:25:10', '2025-05-31 20:04:24'),
(4, 4, 'Minyak Oles', 15, 140, 138.00, '2026-05-19 02:11:56', '2026-05-20 08:12:45'),
(5, 5, 'Minyak angin', 50, 100, 100.00, '2026-05-19 07:18:26', '2026-05-19 07:18:26');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('8wWu45pbBEismI0rCLCWXWNZYTCKcJRbCMAyeVC3', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoic2pXRGIxRWpJZzUzSlRTOUFZQWtVeUdDejhSSkllUW9VNnFVZkliQSI7czozOiJ1cmwiO2E6MDp7fXM6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjM2OiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYWRtaW4vcHJvZHVjdHMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxO30=', 1779289655),
('BFLOwPS8TIG2mAAF7VW5u3O1QDOvhS9hHCAVT3rc', NULL, '127.0.0.1', 'curl/8.19.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiU2NsaUU4dkFtRFU1d09NcjUwb3JEdklyVTI4RDlxRXdGQzRQWnNuMyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779292156),
('GI6ixEI2IurghmM2UChGsHHNSgSf3TF9IUrvb6GL', NULL, '127.0.0.1', 'curl/8.19.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoibHZrYU5mOE9QYzl1R21MRnNEbkJOQ0VOSUlOVUhPcWY0ZlBtS0k1RyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779292180),
('HYD3Bc69JA386OZgE9VoQfLust1xWWjIADgfxbAF', NULL, '127.0.0.1', 'okhttp/4.12.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZFpQWEVHZVoyS0JCdDAwRWpkRnNhbERXa0ZoSkRzYVNSMlhjMTNGMCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NzU6Imh0dHA6Ly8xMC4wLjIuMjo4MDAwL21lZGlhL2p1RGhaZHJJTDdxeHV6V1p1aWVjTE5JYmw5Y1JOY25HVnBQcWg5cGgucG5nP3Y9MiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779293598),
('IOj2aTIZ7wb6LDeUdEJcbQ7fIRpnn6fG8CDw5hQJ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY3NicWs1ODJnV1NOQTN0NFRvQTBaWmluVkRzRTM4S3YwenFtRHhRQSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NzI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9tZWRpYS9nREVyOGxpdDI2ZnNndnl0azhmc1Vrc1dZcVJTMEVkWDQzU29tNkNHLmpwZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779291209),
('lrdZselF9W4JSi8X9gSTl5z6n67qOFpT5HicJxe8', NULL, '127.0.0.1', 'curl/8.19.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibzJlZ1U4ejZHbmZ1eFRyTGw1d3U3V2ExOW5udFRZWVZPOFZDQWZ6RCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NzI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9tZWRpYS9qdURoWmRySUw3cXh1eldadWllY0xOSWJsOWNSTmNuR1ZwUHFoOXBoLnBuZyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1779292456),
('zlL1cFI8hM6DTLrHU0TpQYyXOwYGJi2mFbUS2iKt', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiY1Q4VmZIVWd2RFZYSGlMRHJNekxLczlVOHcyRmxBZWJvUVVPMmNzaCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779292122);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `role` enum('CUSTOMER','ADMIN') NOT NULL DEFAULT 'CUSTOMER'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `role`) VALUES
(1, 'admin', 'admin@gmail.com', NULL, '$2y$12$I9XKBDwE9z42W3QFtKa0oe/UipH04jjY6IURzFVYIMG7bSRQxpurC', NULL, '2025-05-27 01:57:01', '2026-05-20 08:03:34', 'ADMIN'),
(2, 'Adika Ananda', 'kadekadikaananda2006@gmail.com', NULL, '$2y$12$2gku.v7IvLjFwGkeJJW4heJCx164AEinXQD3WS5S8QSkwiV.bpnuK', NULL, '2025-05-27 02:11:17', '2025-05-27 02:11:17', 'CUSTOMER'),
(3, 'Adika Ananda', 'kadek@gmail.com', NULL, '$2y$12$bKXrXQ0R7OQowm.YYzE0EuFJYjEJLO9FoQaYyPtgw4J370B.WHi9G', NULL, '2025-05-31 10:34:50', '2025-05-31 10:34:50', 'CUSTOMER');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `articles_slug_unique` (`slug`),
  ADD KEY `articles_category_index` (`category`),
  ADD KEY `articles_is_published_index` (`is_published`),
  ADD KEY `articles_published_at_index` (`published_at`);
ALTER TABLE `articles` ADD FULLTEXT KEY `articles_title_description_content_fulltext` (`title`,`description`,`content`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_name_unique` (`name`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_user_id_foreign` (`user_id`);

--
-- Indexes for table `order_products`
--
ALTER TABLE `order_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_products_order_id_foreign` (`order_id`),
  ADD KEY `order_products_product_variant_id_foreign` (`product_variant_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payments_xendit_id_unique` (`xendit_id`),
  ADD KEY `payments_order_id_foreign` (`order_id`),
  ADD KEY `payments_status_created_at_index` (`status`,`created_at`),
  ADD KEY `payments_expires_at_index` (`expires_at`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `products_name_unique` (`name`),
  ADD KEY `products_category_id_foreign` (`category_id`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_variants_product_id_foreign` (`product_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `order_products`
--
ALTER TABLE `order_products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_products`
--
ALTER TABLE `order_products`
  ADD CONSTRAINT `order_products_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_products_product_variant_id_foreign` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
