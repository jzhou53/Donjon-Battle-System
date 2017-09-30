/**
 * @extends Component
 */
class Animator extends Component {

    constructor(owner) {
        super(owner);

        this._index = 0;
        this._pattern = 0;
        this._maxPattern = 0;
        this._animationCount = 0;
        this._loop = false;

    }

    update() {
        this._updateAnimation();
    }

    setupListeners_() {

    }

    /**
     *
     */
    startAnimation(animationId) {
        const data = $dataAnimations[animationId];
        this._index = data.source_index;
        this._maxPattern = data.patterns;
        this._loop = data.loop;

        this._pattern = 0;
    }

    _updateAnimation() {
        this._updateAnimationCount();
        if (this._animationCount >= this._animationWait()) {
            this._updatePattern();
            this._animationCount = 0;
        }
    }

    _updateAnimationCount() {
        this._animationCount++;
    }

    _animationWait() {
        //return (9 - this.realMoveSpeed()) * 3;
        return (9 - 3) * 3;
    }

    _updatePattern() {
        this._pattern = (this._pattern + 1) % this.maxPattern();

    }

    maxPattern() {
        return this._maxPattern;
    }

}

// /**
//  * @extends Component
//  */
// class Component_RMMV_Animator extends Component {
//
//     constructor(owner) {
//         super(owner);
//
//         this._pattern = 0;
//         this._walkAnime = true;
//         this._stepAnime = false;
//         this._stopCount = 0;
//     }
//
//     update() {
//         this._updateAnimation();
//     }
//
//     setupListeners_() {
//
//     }
//
//     _updateAnimation() {
//         this._updateAnimationCount();
//         if (this._animationCount >= this._animationWait()) {
//             this._updatePattern();
//             this._animationCount = 0;
//         }
//     }
//
//     _updateAnimationCount() {
//         //this.isMoving() &&
//         if (this.hasWalkAnime()) {
//             this._animationCount += 1.5;
//         } else if (this.hasStepAnime() || !this.isOriginalPattern()) {
//             this._animationCount++;
//         }
//     }
//
//     _animationWait() {
//         //return (9 - this.realMoveSpeed()) * 3;
//         return (9 - 3) * 3;
//     }
//
//     _updatePattern() {
//         if (!this.hasStepAnime() && this._stopCount > 0) {
//             this.resetPattern();
//         } else {
//             this._pattern = (this._pattern + 1) % this.maxPattern();
//         }
//     }
//
//     maxPattern() {
//         return 4;
//     }
//
//     pattern() {
//         return this._pattern < this.maxPattern ? this._pattern : 0;
//     }
//
//     isOriginalPattern() {
//         return this.pattern() === 0;
//     }
//
//     resetPattern() {
//         this.setPattern(1);
//     }
//
//     setPattern(pattern) {
//         this._pattern = pattern;
//     }
//
//     hasStepAnime() {
//         return this._stepAnime;
//     }
//
//     setStepAnime(stepAnime) {
//         this._stepAnime = stepAnime;
//     }
//
//     hasWalkAnime() {
//         return this._walkAnime;
//     }
//
//     setWalkAnime(walkAnime) {
//         this._walkAnime = walkAnime;
//     }
//
// }