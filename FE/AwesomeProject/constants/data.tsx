// constants/data.js
// Data statis untuk aplikasi

// Disease Categories Data

export const DISEASE_CATEGORIES = [
  { 
    id: '1', 
    image: require('../assets/images/1.png'), 
    name: 'Pernapasan',
    category: 'Pernapasan',
  
  },
  { 
    id: '2',
    image: require('../assets/images/2.png'), 
    name: 'Pencernaan',
    category: 'Pencernaan',

  },
  { 
    id: '3', 
    image: require('../assets/images/3.png'),
    name: 'Demam & Flu',
    category: 'Demam & Flu',
 
  },
  { 
    id: '4', 
    image: require('../assets/images/3.png'), 
    name: 'Kulit & Luka',
    category: 'Kulit & Luka',

  },
];

// Herbal Remedy Categories
export const HERBAL_CATEGORIES = [
  { 
    id: 'vitamin', 
    image: require('../assets/images/9.png'),
    name: 'Vitamin & Imunitas', 
  },
  { 
    id: 'batuk', 
    image: require('../assets/images/5.png'),
    name: 'Batuk & Flu', 
  },
  { 
    id: 'jamu', 
    image: require('../assets/images/10.png'),
    name: 'Jamu Tradisional', 
  },
  { 
    id: 'kulit', 
    image: require('../assets/images/8.png'),
    name: 'Perawatan Kulit', 
  }
];
export const FEATURED_REMEDIES = [
  {
    id: 1,
    image: require('../assets/images/rempah.jpg'),
    title: 'Ramuan Demam Tradisional',
    content: 'Herbal alami untuk menurunkan panas'
  },
  {
    id: 2,
    image: require('../assets/images/demam.jpg'),
    title: 'Jamu Pencernaan',
    content: 'Menjaga kesehatan sistem pencernaan'
  },
  {
    id: 3,
    image: require('../assets/images/boreh.jpeg'),
    title: 'Boreh Bali',
    content: 'Relaksasi otot dan penghangat tubuh'
  },
  {
    id: 4,
    image: require('../assets/images/loloh.jpeg'),
    title: 'Loloh Cemcem',
    content: 'Minuman herbal penyegar alami'
  }
];

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  stock: number;
}

// Data dummy produk
export const products: Product[] = [
  {
    id: '1',
    name: 'Minyak Kayu Putih Usada',
    description: 'Minyak kayu putih alami dari Bali, terbuat dari bahan berkualitas tinggi. Dapat membantu meredakan perut kembung, masuk angin, dan memberikan sensasi hangat pada tubuh. Produk ini merupakan salah satu ramuan tradisional Bali yang telah digunakan secara turun-temurun.',
    price: 45000,
    image: 'https://via.placeholder.com/300x300.png?text=Minyak+Kayu+Putih',
    category: 'Minyak',
    rating: 4.8,
    stock: 50
  },
  {
    id: '2',
    name: 'Jamu Kunyit Asam',
    description: 'Jamu kunyit asam tradisional Bali yang dibuat dari kunyit pilihan dan asam jawa berkualitas. Baik untuk menyegarkan tubuh, membantu pencernaan, dan dapat membantu mengurangi nyeri haid bagi wanita. Tanpa pengawet dan pemanis buatan.',
    price: 15000,
    image: 'https://via.placeholder.com/300x300.png?text=Jamu+Kunyit+Asam',
    category: 'Minuman',
    rating: 4.5,
    stock: 100
  },
  {
    id: '3',
    name: 'Lulur Tradisional',
    description: 'Lulur tradisional Bali dengan campuran rempah pilihan. Membantu mengangkat sel kulit mati, mencerahkan kulit, dan memberikan kelembaban alami. Cocok untuk perawatan tubuh rutin di rumah.',
    price: 75000,
    image: 'https://via.placeholder.com/300x300.png?text=Lulur+Tradisional',
    category: 'Perawatan Tubuh',
    rating: 4.7,
    stock: 30
  },
  {
    id: '4',
    name: 'Minyak Telon Plus',
    description: 'Minyak telon plus dengan campuran minyak esensial yang aman untuk bayi dan anak. Membantu menjaga kehangatan tubuh dan memberikan kenyamanan. Dapat digunakan untuk pijat ringan pada bayi.',
    price: 55000,
    image: 'https://via.placeholder.com/300x300.png?text=Minyak+Telon',
    category: 'Minyak',
    rating: 4.9,
    stock: 45
  },
  {
    id: '5',
    name: 'Boreh Tradisional',
    description: 'Boreh tradisional Bali yang terbuat dari rempah-rempah berkualitas tinggi. Baik untuk menghangatkan tubuh, melancarkan peredaran darah, dan meredakan nyeri otot. Dapat digunakan sebagai masker tubuh untuk relaksasi.',
    price: 65000,
    image: 'https://via.placeholder.com/300x300.png?text=Boreh+Tradisional',
    category: 'Perawatan Tubuh',
    rating: 4.6,
    stock: 25
  },
  {
    id: '6',
    name: 'Wedang Jahe',
    description: 'Minuman jahe tradisional Bali dengan campuran rempah pilihan. Membantu menghangatkan tubuh, meredakan masuk angin, dan meningkatkan daya tahan tubuh. Praktis dan mudah diseduh.',
    price: 20000,
    image: 'https://via.placeholder.com/300x300.png?text=Wedang+Jahe',
    category: 'Minuman',
    rating: 4.4,
    stock: 75
  },
  {
    id: '7',
    name: 'Minyak Urut Tradisional',
    description: 'Minyak urut tradisional Bali dengan ramuan khusus. Cocok untuk pijat seluruh tubuh, membantu meredakan pegal-pegal, dan memberikan relaksasi pada otot yang tegang. Aromanya yang menenangkan memberikan efek relaksasi.',
    price: 85000,
    image: 'https://via.placeholder.com/300x300.png?text=Minyak+Urut',
    category: 'Minyak',
    rating: 4.8,
    stock: 40
  },
  {
    id: '8',
    name: 'Jamu Beras Kencur',
    description: 'Jamu beras kencur tradisional Bali yang menyegarkan. Baik untuk menjaga stamina, meningkatkan nafsu makan, dan memberikan kesegaran pada tubuh. Dibuat dari bahan-bahan alami pilihan tanpa tambahan pengawet.',
    price: 18000,
    image: 'https://via.placeholder.com/300x300.png?text=Jamu+Beras+Kencur',
    category: 'Minuman',
    rating: 4.3,
    stock: 60
  },
  {
    id: '9',
    name: 'Loloh Cemcem',
    description: 'Minuman herbal tradisional Bali yang terbuat dari daun cemcem. Memiliki khasiat detoksifikasi, menyegarkan tubuh, dan baik untuk kesehatan pencernaan. Minuman ini telah dikenal sejak dulu di masyarakat Bali.',
    price: 25000,
    image: 'https://via.placeholder.com/300x300.png?text=Loloh+Cemcem',
    category: 'Minuman',
    rating: 4.5,
    stock: 50
  },
  {
    id: '10',
    name: 'Masker Rempah',
    description: 'Masker wajah dari campuran rempah tradisional Bali. Membantu mengangkat sel kulit mati, membersihkan pori-pori, dan memberikan nutrisi alami pada kulit wajah. Cocok untuk semua jenis kulit.',
    price: 45000,
    image: 'https://via.placeholder.com/300x300.png?text=Masker+Rempah',
    category: 'Perawatan Wajah',
    rating: 4.7,
    stock: 35
  },
  {
    id: '11',
    name: 'Minyak Cengkeh',
    description: 'Minyak cengkeh murni dari Bali dengan kualitas premium. Dapat digunakan untuk meredakan sakit gigi, nyeri sendi, dan memberikan kehangatan pada area yang sakit. Memiliki aroma khas cengkeh yang kuat.',
    price: 60000,
    image: 'https://via.placeholder.com/300x300.png?text=Minyak+Cengkeh',
    category: 'Minyak',
    rating: 4.6,
    stock: 0
  },
  {
    id: '12',
    name: 'Serum Wajah Kunyit',
    description: 'Serum wajah dengan ekstrak kunyit asli Bali. Membantu mencerahkan kulit, mengurangi bekas jerawat, dan memberikan kelembaban. Formula ringan yang mudah meresap ke dalam kulit.',
    price: 120000,
    image: 'https://via.placeholder.com/300x300.png?text=Serum+Kunyit',
    category: 'Perawatan Wajah',
    rating: 4.8,
    stock: 20
  }
];

// Data kategori produk
export const categories = [
  'Minyak',
  'Minuman',
  'Perawatan Tubuh',
  'Perawatan Wajah'
];