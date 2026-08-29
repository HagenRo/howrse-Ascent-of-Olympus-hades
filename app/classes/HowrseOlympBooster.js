class HowrseOlympBooster extends HowrseOlympRewardItem{
    constructor(dataSkillA, dataSkillB, dataSkillC, dataSkillD, arrayOfTargetIds) {
        super('HowrseOlympBooster', arrayOfTargetIds);
        if (dataSkillA>0) {
            this.boosterValue = dataSkillA;
            this.skill = 'A';
        }
        if (dataSkillB>0) {
            this.boosterValue = dataSkillB;
            this.skill = 'B';
        }
        if (dataSkillC>0) {
            this.boosterValue = dataSkillC;
            this.skill = 'C';
        }
        if (dataSkillD>0) {
            this.boosterValue = dataSkillD;
            this.skill = 'D';
        }
    }
}