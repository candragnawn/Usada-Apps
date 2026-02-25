<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MockDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Categories Table
        $categories = [
            ['name' => 'Flu & Batuk', 'description' => 'Ramuan untuk meredakan gejala flu dan batuk.', 'is_active' => true],
            ['name' => 'Pencernaan', 'description' => 'Obat herbal untuk masalah perut dan pencernaan.', 'is_active' => true],
            ['name' => 'Kesehatan Kulit', 'description' => 'Perawatan kulit menggunakan bahan alami.', 'is_active' => true],
            ['name' => 'Imunitas', 'description' => 'Ramuan untuk meningkatkan daya tahan tubuh.', 'is_active' => true],
        ];

        foreach ($categories as $cat) {
            DB::table('categories')->updateOrInsert(['name' => $cat['name']], $cat);
        }

        // 2. Seed Articles Table
        $articles = [
            [
                'title' => 'Ramuan Jahe Merah',
                'slug' => 'ramuan-jahe-merah',
                'category' => 'Flu & Batuk',
                'description' => 'Jahe merah sangat efektif untuk menghangatkan tubuh dan meredakan batuk.',
                'content' => 'Jahe merah (Zingiber officinale var. rubrum) memiliki kandungan gingerol yang lebih tinggi dibandingkan jahe biasa...',
                'is_published' => true,
                'published_at' => now(),
            ],
            [
                'title' => 'Manfaat Kunyit Asam',
                'slug' => 'manfaat-kunyit-asam',
                'category' => 'Pencernaan',
                'description' => 'Minuman segar yang baik untuk melancarkan pencernaan.',
                'content' => 'Kunyit mengandung kurkumin yang berfungsi sebagai anti-inflamasi alami...',
                'is_published' => true,
                'published_at' => now(),
            ],
            [
                'title' => 'Lidah Buaya untuk Kulit',
                'slug' => 'lidah-buaya-untuk-kulit',
                'category' => 'Kesehatan Kulit',
                'description' => 'Cara alami melembabkan kulit dengan lidah buaya.',
                'content' => 'Lidah buaya dikenal sejak lama sebagai tanaman penyembuh luka dan pelembab alami...',
                'is_published' => true,
                'published_at' => now(),
            ],
        ];

        foreach ($articles as $art) {
            DB::table('articles')->updateOrInsert(['slug' => $art['slug']], $art);
        }
    }
}
