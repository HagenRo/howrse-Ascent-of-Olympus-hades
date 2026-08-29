class HowrseOlympRewardItem {
    constructor(rewardType, arrayOfTargetIds) {
        this.rewardType = rewardType;
        this.arrayOfTargetIds = arrayOfTargetIds;//false/null if not the selected RewardItem true if selected Booster arrayOFTargetIds if slected LevelUp or StaminaRefill
    }
}