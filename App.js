import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Voice from '@react-native-community/voice';


import { asPercentage } from './functions.js';                // function to calculate percentage
import { playMorse } from './morsefuncs.js';                  // functions to peform specific project related tasks
import { RadioButton } from 'react-native-paper';             // for radio button options
import { textToMorse } from './texttomorse.js';               // convert spoken text to Morse code

const scope = 26;     // Change the selected charecters to practice with
const morse_character = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]; 
const phonetic = ["alpha","bravo","charlie","delta","echo","foxtrot","golf","hotel","india","juliet","kilo","lima","mike","november","oscar","papa","quebec","romeo","sierra","tango","uniform","victor","whiskey","x-ray","yankee","zulu"];
const morse_code = [".-","-...","-.-.","-..",".","..-.","--.","....","..",".---","-.-",".-..","--","-.","---",".--.","--.-",".-.","...","-","..-","...-",".--","-..-","-.--","--.."]

let letter = 0;   // default index for random generator
let score = 0;    // initialise score
let count = 0;    // initialise count
let stats = 0;    // initialise stats
let autoMode = true; // default automatic mode
let hintMode = false;
//---------------------------------------------------------------------------------------


const App = () => {
  const [scoreText, setScoreText] = useState("Current score = ");       //report onscreen score
  const [percentText, setPercentText] = useState("Current Stats = ");   //report onscreen stats
  const [statusText, setStatus] = useState("Wait");                     //report current on screen status
  const [checked, setChecked] = useState(false);                        //radiobutton boolean
  const [autochecked, setAutoChecked] = useState(false);                //radiobutton boolean
  const [hintMode, setHintMode] = React.useState(false);                //link button logic to external boolean
  const [autoMode, setAutoMode] = React.useState(false);                //link button logic to external boolean

  const [result, setResult] = useState('');                             //update text results
  const [isListening, setLoading] = useState(false);                    // speech rec loading state  

  function incScore(){                                                   //increment score{   
   score += 1;
  };

  function incCount() {                                                 //increment count   
    count += 1;
  };

  const next = () => {                                                  //function to call next letter
    letter = Math.floor(Math.random() * scope);                         //random generator to work within the  desiered scope
    //console.log(morse_character[letter]);
    let code = (morse_code[letter]);                                    //assign the code string of the random index
    let character = (morse_character[letter]);                          //assign the character string of the random index
    //console.log(score,'/',count);
    //console.log(asPercentage(score,count));                           
    incCount();                                                         //increace running count
    playMorse(character.toLowerCase());                                 //stadatise character an call funtion to play sound
    hintMode && setResult(character + "               " + code);        //Just to help practice 
    !hintMode && setResult("               " + code);                   //Just to help practice 
    setTimeout(() => { startRecording(); }, 100);                       //slightly delay recording speech
    setStatus('Listening');                                             //tell user system is listening
  };

  const speechStartHandler = e => {                                     //start function handler
    //console.log(' started ok', e);
  };
  const speechEndHandler = e => {                                       //report errors from speech handler
    setLoading(false);                                                  //stop loading on error
    //console.log('stopped ok', e);
  };

  const speechResultsHandler = e => {                                   //returns the speech result
    var text = e.value[0];                                              //the return text is the first of the values returned
    if(text.toLowerCase() === phonetic[letter]) {
      //text = 'Correct'
     
      setStatus("Correct");                                             //report the user's success
      incScore();                                                       //add 1 to the running score
     autoMode && next();                                                //if auto is set then call next character
    } 
  
    if(text.toLowerCase() != phonetic[letter] && phonetic.includes(text.toLowerCase())) { //report incorrect after a valid read
      setStatus('Incorrect:   You said ' + text + ' but it was ' + phonetic[letter]);     //but user said the wrong Morse character
      //text = 'Incorrect!';
    }
    setResult(text);                                                    //report what the user actually said
  };


  const startRecording = async () => {                                  //start listening 
    setLoading(true);                                                   //loading
    try {
      await Voice.start('en-US');                                       //set language option
    } catch (error) {                                                   //look for errors
      //console.log('we have problems starting ', error);
    }
  };

  const stopRecording = async () => {                                   //stop recording
    try {
      await Voice.stop();                                               //stop the voice recorder
      setLoading(false);                                                //stop loading
    } catch (error) {
      //console.log('we have problems stopping ', error);
    }
  };

  const clear = () => {                                                 //function to clear the result
    setResult('');
  };

  


  useEffect(() => {
    Voice.onSpeechStart = speechStartHandler;                           //hook for voice library fonctions
    Voice.onSpeechEnd = speechEndHandler;                               //hook for voice library fonctions
    Voice.onSpeechResults = speechResultsHandler;                       //hook for voice library fonctions

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);                   //stop listening an close all listeners
    };
  }, []);
  
  return (
  
    <View style={styles.container}>
      <SafeAreaView>

        <Text style={styles.headingText}>Morse code practice trainer</Text>                  
        <View>
            <Text style={styles.scoreText} onChangeText = {() => setScoreText("")}>
                    {scoreText + score + "/" + count + " (" + asPercentage(score,count)+ ")" }
            </Text>
        
        </View>
        <View style={styles.textInputStyle}>
          <TextInput
            value={result}
            multiline={true}
            placeholder=""
            style={{
              flex: 1,
              height: '100%',
              fontSize:32,
            }}
            onChangeText={text => setResult(text)}
          />
          
        </View>
        
        <View>
            <Text style={styles.scoreText} onChangeText = {() => setStatus("")}>
                    {statusText }
            </Text>
        </View>


        <RadioButton
          value="hint"
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => {
            setChecked(!checked); // Toggle the value
            setHintMode(!checked);
        }}
        />
         <Text>Show letter as a hint</Text>

<RadioButton
          value="auto"
          status={autochecked ? 'checked' : 'unchecked'}
          onPress={() => {
            setAutoChecked(!autochecked); // Toggle the value
            setAutoMode(!autochecked);
        }}
        />
        <Text>Automatic mode</Text>
          

        <View style={styles.btnContainer}>
          {isListening ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            <TouchableOpacity onPress={startRecording} style={styles.speak}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>Retry</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.stop} onPress={stopRecording}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>Stop</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.clear} onPress={next}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Sound Code</Text>
        </TouchableOpacity>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c1e5d2',
    padding: 24,
  },
  headingText: {
    alignSelf: 'center',
    marginVertical: 22,
    fontWeight: 'bold',
    fontSize: 22,
  },
  scoreText: {
    alignSelf: 'center',
    marginVertical: 22,
    fontWeight: 'bold',
    fontSize: 18,
  },
  textInputStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 100,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 2,
    shadowOpacity: 0.4,
    color: '#000',
    
  },
  speak: {
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 20,
  },
  stop: {
    backgroundColor: 'red',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 20,
  },
  clear: {
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 20,
    marginTop: 15,
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    with: '50%',
    justifyContent: 'space-evenly',
    marginTop: 24,
  },
});

export default App;
