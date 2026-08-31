class OlympHelper {

    /*Checks for too few selected cards on button click (fight).
    - The win rate is less than 100 percent.
    - There are still selectable horses available on the screen.
    - The user has not previously selected the option to choose less than the maximum number of cards.
     */
    static registerFightMisclickProtection() {

        $("body")[0].addEventListener('click', function (event) {

            if ($('#js-rgproba__value')?.[0]?.textContent) {
                let winrate = $('#js-rgproba__value')[0].textContent;
                let selectLess = ('true' === window.localStorage.getItem('OH_selectLessTry'));
                let selectableHorses = $('.rowguecard:not(.js-rowguecard--disabledclickable, .js-rowguecard--selectedfortry, .js-rowguecard--disabled)').length;
                let isButton = $(event.target).closest('.rgproba__btn.btn--primary.btn').length == 1 ? true : false;
                if (winrate < 100 && selectableHorses > 0 && isButton && !selectLess) {
                    //console.log('blub')
                    let ja = confirm('Willst du wirklich weniger anwählen als du könntest?');
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    if (ja) {
                        window.localStorage.setItem('OH_selectLessTry', 'true');
                    } else {

                    }

                }
            }

        }, true)


        //reset the too few selected cards variable.
        $(document).on('click', '.rgproba__btn.btn--primary.btn', function () {
            window.localStorage.setItem('OH_selectLessTry', 'false');
        })


    }


    /*Checks if leveled precious or devine card would be cut.
     */
    static registerRewardNewHorseMisclickProtection() {

        $("body")[0].addEventListener('click', function (event) {
            let rewardIsNewCard = $('.js-rowgue-bonus-type-newCard.block.js-block--selected')?.[0] ? true : false;
            console.log(event.target)
            let selectedHorseIsToGood = $(event.target).is('.rowguecard.rowguecard--precious[data-currentlevel]:not([data-currentlevel="1"]),.rowguecard.rowguecard--devine[data-currentlevel]:not([data-currentlevel="1"])');
            console.log(selectedHorseIsToGood)

            if (rewardIsNewCard && selectedHorseIsToGood) {
                let cutCard = ('true' === window.localStorage.getItem('OH_cutCard'));
                if (!cutCard) {
                    let yes = confirm('Willst du wirklich dieses Pferd entfernen?');
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    if (yes) {
                        window.localStorage.setItem('OH_cutCard', 'true');
                    } else {

                    }
                }
            }

        }, true);

        //reset the too few selected cards variable.
        $(document).on('click', '.rgproba__btn.btn--primary.btn', function () {
            window.localStorage.setItem('OH_cutCard', 'false');
        })
    }

    static registerRewardSelectMisclickProtection() {
        /*checks for too less selected cards (rewards)
*/
        $("body")[0].addEventListener('click', function (event) {

            let isButton = $(event.target).closest('.js-bonusvalidationbtn').length == 1 ? true : false;
            let selectLess = ('true' === window.localStorage.getItem('OH_selectLess'));
            if (!selectLess && isButton) {
                let selectableHorses = $('.rowguecard:not(.js-rowguecard--disabled, .js-rowguecard--selectedforbonus, .rowguecard--s)').length;
                if (selectableHorses > 0) {
                    let ja = confirm('Willst du wirklich weniger anwählen als du könntest?');
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    if (ja) {
                        window.localStorage.setItem('OH_selectLess', 'true');
                    }
                }
            }
        }, true)

        //resets selectLess boolean
        $(document).on('click', '.js-bonusvalidationbtn', function () {

            window.localStorage.setItem('OH_selectLess', 'false');

        });
    }
}

OlympHelper.registerFightMisclickProtection();
OlympHelper.registerRewardNewHorseMisclickProtection();
OlympHelper.registerRewardSelectMisclickProtection();
