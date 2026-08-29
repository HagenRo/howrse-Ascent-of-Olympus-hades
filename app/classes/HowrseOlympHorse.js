class HowrseOlympHorse extends HowrseOlympRewardItem{
    constructor(name, levelmax, skilla, skillb, skillc, skilld, id, arrayOfTargetIds) {
        super('HowrseOlympHorse', arrayOfTargetIds);
        this.name = name;
        this.levelmax = levelmax;
        this.currentlevel = 1;
        this.skilla = skilla;
        this.skillb = skillb;
        this.skillc = skillc;
        this.skilld = skilld;
        this.currentstamina = 4;
        this.id = id;
    }
}