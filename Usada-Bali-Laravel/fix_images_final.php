$files = [
    'ZvyEZxe22unVzS09DhZuvIE2lxavdeviFYiVvbmm.jpg',
    'LZkLcg5nwC3fJTnJXUrirJ9YWRKQ7GetRk2u7vCv.png',
    'HQucoe6WKqXRKqNQ16mmYMvTqW0gg3eHODCUCnBK.png',
    'ywCI6DiOL3oVa0h2iMcBX9nCcdWmIvHLNKSexzRk.png'
];
$products = \App\Models\Product::all();
foreach($products as $i => $p) {
    $f = $files[$i % count($files)];
    $p->images = ['products/' . $f];
    $p->save();
    echo "Updated {$p->name} to products/{$f}\n";
}
