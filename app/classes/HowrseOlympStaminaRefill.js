class HowrseOlympStaminaRefill extends HowrseOlympRewardItem{
    constructor(numberStamina, numberHorses, arrayOfTargetIds) {
        super('HowrseOlympStaminaRefill', arrayOfTargetIds);
        this.numberStamina = numberStamina;//number of stamina per horse
        this.numberHorses = numberHorses;//number of horses that receive the staminaRefill
    }
}