$products = \App\Models\Product::all();
foreach($products as $i => $p) {
    $f = (($i % 3) + 1) . '.jpg';
    $p->images = ['products/' . $f];
    $p->save();
    echo "Updated {$p->name} to products/{$f}\n";
}
