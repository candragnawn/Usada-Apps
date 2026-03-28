$files = ['2gsIkqBG4zffKpkCr1tsogKP', '2lxavdeviFYiVvbmm.jpg', 'ZvyEZxe22unVzS09DhZuvIE2'];
$products = \App\Models\Product::all();
foreach($products as $i => $p) {
    if ($files) {
        $f = $files[$i % count($files)];
        $p->images = ['products/' . $f];
        $p->save();
        echo "Updated {$p->name} (ID: {$p->id}) to products/{$f}\n";
    }
}
