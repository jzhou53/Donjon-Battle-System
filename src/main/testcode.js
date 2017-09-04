function boooooooom() {
    const dataArmr = $dataArmors[1],
        dataWpn = $dataWeapons[2];

    const weapon = new Game_Weapon(dataWpn);
    const armor = new Game_Armor(dataArmr);

    console.log(weapon.toString());
    console.log(armor.toString());

    for (let i = 0; i < 10; i++) {
        simulate_clashing(weapon, armor);
        console.log(armor.toString());
        console.log("");
    }

}

/**
 * @param pWeapon {Game_Weapon}
 * @param pArmor {Game_Armor}
 */
function simulate_clashing(pWeapon, pArmor) {
    const chanceHit = 50;
    let criticalFlag = false;
    console.log("Simulation at chance " + chanceHit + "%:");
    let d100 = Math.randomInt(100) + 1;
    console.log("first rolled: " + d100);
    if (d100 < chanceHit) {
        d100 = Math.randomInt(100) + 1;
        console.log("second rolled: " + d100);
        if (d100 < pWeapon.getMaxCritical()) {
            console.log("Critical!!!");
            criticalFlag = true;
        }

        let factor = Math.randomInt(100) / 100 + 0.75;

        const rawDamage = pWeapon.makeDamage(factor, criticalFlag);
        pArmor.receiveDamage(rawDamage);

        console.log("weapon delivered "
            + pArmor.getFlushDamage() + " flesh damage, and "
            + pArmor.getArmorDamage() + " armor damage.");
    }
}