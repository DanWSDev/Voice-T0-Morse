import Sound  from 'react-native-sound';            //import sound library
Sound.setCategory('Playback');                      //set device to playback sound

export const playMorse = (code) => {                //make function available elswhere
  let character = code;                             //assing incomming variable to local variable
  character += '.mp3';                              //add the .mp3 file extension
  const playCode = new Sound(character, Sound.MAIN_BUNDLE, (error) => {   //create new Sound object
    playCode.setVolume(1);                                                //set playback volume
    if (error) {
        console.log('failed to load the sound', error);                   //report if there are problems playin
    }  
    else {
        playCode.play((success) => {return;} )                            //return after sound has played  
        playCode.onEnd                                                    //close player
    }
  }
);
}

