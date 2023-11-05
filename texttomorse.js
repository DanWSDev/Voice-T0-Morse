import { playMorse } from './morsefuncs.js';            //import funtion from file

export const textToMorse = (sentence) => {              //function to break up sentence and play sounds
    for(let i = 0 ; i < sentence.length; i++) {         //parse the sentence
      setTimeout(console.log(sentence[i].toLowerCase()),2000);
      setTimeout(() => { playMorse(sentence[i].toLowerCase()); }, 1000); //play each letter with delay between them.
        
    }
  }