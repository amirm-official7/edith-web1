import React, { useState, useEffect, useRef } from 'react'
import './App.css';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import { useSpeechSynthesis } from 'react-speech-kit';


// functions 
import funcs from './f'

function App() {


  const serverUrl = "http://localhost:5000"
  // const [ listening, setlistening ] = useState(false)
  // const [ transcript, settranscript ] = useState("")
  
  // {user: 'B:bot / C:client', message: ""}
  const [Messages, setMessages] = useState([])
  const { speak, voices } = useSpeechSynthesis();


  const ResizeRef = useRef(null);
  
  useEffect(() => {
    const updateSize = () => {
      const element_size = ResizeRef.current.offsetWidth
      console.log(element_size);
      if (element_size >= 390) {
        document.documentElement.style.setProperty('--button-size','290px');
      } else{
        const size = element_size / 1.5 + "px" 
        document.documentElement.style.setProperty('--button-size',size);
      }

    };
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [])
  
  useEffect(() => {
    document.addEventListener('keypress', SearchKey);
    return () => document.removeEventListener('keypress', SearchKey);
  },[])

  
  const ferzan = {commend: "", Sruncode: "", CFunction: "", CFunctionPram: ""}
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();


  const BotWriteSpeek = (text)=> {
    speak({ text, voice: voices[1] })
    setMessages(prevMessages => [...prevMessages, {
      user: 'B',
      message: text
    }])
  }

  const requestRes = (v) => {
    axios.get(serverUrl, {
      params: {
        message: v
      }
    })
    .then(function (response) {
      if(response.data.CFunction.length > 0){
        // eval(response.data.CFunction)
        let F = funcs.find(f => f.name === response.data.CFunction);
        F.func(response.data.CFunctionPrams)
      }
      if(response.data.commend.length > 0){
        BotWriteSpeek(response.data.commend)
      }
    })
    .catch(function (error) {
      console.log(error);
    });  
  }

  const audioendF = (t) => {
    setMessages([{
      user: 'C',
      message: t
    }])
    resetTranscript()
    requestRes(t)
  };
  
  useEffect(() => {
    if (!listening && transcript) {
      audioendF(transcript)
    }else if (listening) {
      setMessages([])
    }
  }, [transcript, listening]);

  if (!browserSupportsSpeechRecognition) {
    return <h1>your Browser doesn't support speech recognition.</h1>;
  }



  const SearchKey = (e) => {
    if(e.key === "l"){
      SpeechRecognition.startListening()
    }
  }


  return (
    <div className="App">
      <header ref={ResizeRef} className='header'>
        {!listening ?
          <button className='start_listening_btn' onClick={()=> {SpeechRecognition.startListening()}}>
            <div className='start_listening_btn_inside_boder'>
              <span>EDITH</span>
            </div>
          </button>
          :
          <button className='stop_listening_btn' onClick={()=> {SpeechRecognition.stopListening()}}>
            <div className='stop_listening_btn_inside_boder'>
              <span>LISTENING...</span>
            </div>
          </button>
        }
      </header>
      <div className='message_parent'>
        <ul className='message_container'>

          {Messages.map((m, index)=> {
            if(m.user === "C"){
              return (
                <li key={index} className="client_M">
                  <div>
                    <span>{m.message}</span>
                  </div>
                </li>
              )
            } else {
              return (
                <li key={index} className="bot_M">
                  <div>
                    <span>{m.message}</span>
                  </div>
                </li>
              )
            }

          })}

          



          {transcript.length > 0?
            <li className="client_M">
              <div>
                <span>{transcript}</span>
              </div>
            </li>
          :null}
        </ul>
      </div> 
    </div>
  );
}

export default App;
