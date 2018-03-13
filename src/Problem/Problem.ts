import {Word} from './Word'

export class Problem {
    words: Word[]

    constructor(words: Word[]) {
        this.words = words;//words.slice(0);
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