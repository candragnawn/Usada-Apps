$jpgs = [
    'ZvyEZxe22unVzS09DhZuvIE2lxavdeviFYiVvbmm.jpg',
    '2gsIkqBG4zffKpkCr1tsogKPSFv8OF2Z2Y4jJZ7r.jpg',
    '5fd9P8ELcrwUKOw6I2Pe20QgONFKuAlUoAXYT4tz.jpg',
    'AFygEta6favsJKmjerE6B7eVi8bDOfNdjfZAmVeF.jpg',
    'ATHjNAWi4SYeKEIIntiBkyZYvt53e9lDp1n1SSkZ.jpg',
    'AxflU0lRDEQckQye9miuwjCi5Qv7iri8VEld0Kfk.jpg'
];
$products = \App\Models\Product::all();
foreach($products as $i => $p) {
    if (count($jpgs) > 0) {
        $f = $jpgs[$i % count($jpgs)];
        $p->images = ['products/' . $f];
        $p->save();
        echo "Updated {$p->name} to products/{$f}\n";
    }
}
