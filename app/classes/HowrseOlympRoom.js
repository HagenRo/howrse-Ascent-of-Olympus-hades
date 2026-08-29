class HowrseOlympRoom {
    constructor(threshold, room, difficulty,skillA, skillB, skillC, skillD, winrate, arraySelectedHorseIds, arrayOfRewardItems, horse, numberFragments) {
        this.threshold = threshold; //1;2;3;4
        this.room = room;//1m;...;5r;6l;7m
        this.difficulty = difficulty;//difficulty1;...;difficulty4
        this.howrseOlympRoomReward = new HowrseOlympRoomReward(arrayOfRewardItems, horse, numberFragments);
        this.howrseOlympFight = new HowrseOlympFight(skillA, skillB, skillC, skillD, winrate, arraySelectedHorseIds);

    }
    get room(){
        return ""+this.threshold+"-"+tanslateToHorwseWriting()+"-"+this.room[0]
    }
    rtanslateToHorwseWriting(){
        switch(this.room[1]){
            case "r":
                return "2";
            case "m":
                return "1";
            case "l":
                return "0";
            default:
                return "error";
        }
    }

}