import {Word} from './Word'

export class Problem {
    words: Word[]
    timedue: number
    delayindex: number

    constructor(words: Word[]) {
        this.words = words //words.slice(0);
        this.timedue = 0
        this.delayindex = 0
    }
    clone() {
        return new Problem(this.words);
    }
    getCorrectWord() {
        for (var i in this.words) {
            if (this.words[i].correct) {
                return this.words[i];
            }
        }
        return null;
    }
    
}