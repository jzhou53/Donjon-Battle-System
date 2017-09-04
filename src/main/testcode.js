function boooooooom() {
    const armorA = $dataArmors[1];
    const armorB = $dataArmors[2];
    const armorC = $dataArmors[3];
    const weaponA = $dataWeapons[1];
    const weaponB = $dataWeapons[1];
    const weaponC = $dataWeapons[1];

    //construct a Weapon/Armor object
    const A = new Game_Armor(armorA);
    console.log(A.toString());

    const B = new Game_Weapon(weaponA);
    console.log(B.toString());
}