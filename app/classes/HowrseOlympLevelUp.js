class HowrseOlympLevelUp extends HowrseOlympRewardItem{
    constructor(numberLevel, numberHorses, arrayOfTargetIds) {
        super('HowrseOlympLevelUp', arrayOfTargetIds);
        this.numberLevel = numberLevel;//number of levels per horse
        this.numberHorses = numberHorses;//number of horses that receive the level(s)
    }
}