import {React} from 'react';
import { useState, useEffect } from 'react';
import image from "./assets/cameleon.png";

const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    } 
    return color;
  };

  const getSimilarColor = (baseColor, variation) => {
    let r = parseInt(baseColor.slice(1, 3), 16);
    let g = parseInt(baseColor.slice(3, 5), 16);
    let b = parseInt(baseColor.slice(5, 7), 16);
    
    r = Math.min(255, Math.max(0, r + Math.floor(Math.random() * variation - variation / 2)));
    g = Math.min(255, Math.max(0, g + Math.floor(Math.random() * variation - variation / 2)));
    b = Math.min(255, Math.max(0, b + Math.floor(Math.random() * variation - variation / 2)));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const ColorGame = () => {
    const [targetColor, setTargetColor] = useState(getRandomColor());
    const [options, setOptions] = useState([]);
    const [message, setMessage] = useState("");
    const [score, setScore] = useState(() => {
        const storedScore = localStorage.getItem("score");
        return storedScore ? parseInt(storedScore) : 0;
    });
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [difficulty, setDifficulty] = useState(50);

    const newGame = () => {
        setScore(0);
        setCorrectAnswers(0);
        setDifficulty(10);
    }

    useEffect(() => {
        let colors = [targetColor];
        let similarCount = Math.min(5, Math.floor(correctAnswers / 6)); // More similar colors over time
        let randomCount = 5 - similarCount; // The rest are random
    
        for (let i = 0; i < similarCount; i++) {
            colors.push(getSimilarColor(targetColor, difficulty));
        }
    
        for (let i = 0; i < randomCount; i++) {
            colors.push(getRandomColor());
        }
    
        setOptions(colors.sort(() => Math.random() - 0.5));
    
        // Reduce difficulty by 10% every 6 correct answers
        if (correctAnswers > 0 && correctAnswers % 6 === 0) {
            setDifficulty(prevDifficulty => Math.max(5, Math.floor(prevDifficulty * 0.9)));
        }
    }, [targetColor, correctAnswers]);

  useEffect(() => {
    localStorage.setItem("score", score.toString());
  },[score]);

  const checkAnswer = (color) => {
    if (color === targetColor) {
        setMessage('Correct 🎉')
        setScore(prevScore => prevScore + 1);
        setCorrectAnswers(prev => prev + 1);
 
        setTimeout(() => {
            setTargetColor(getRandomColor());
            setMessage("");
        }, 1000 );
    }else {
        setMessage('Wrong, try again! ❌')
        setScore(0);
        setCorrectAnswers(0);
        setDifficulty(10);

        setTimeout(() => {
            setTargetColor(getRandomColor());
            setMessage("");
        }, 1000);
    }
  };




  return (
    <div className='bg'>
        
        <div className='head'>
        <img src={image} alt="cameleon"/>
        <h1>Guess the <span style={{color:"#E67300", textShadow:"0px 4px 10px rgba(0, 0, 0, 0.6)"}}>Color</span></h1>
        </div>
        <div className='head-instruct'>

            <p data-testid="gameInstructions" className='game-instruct'>A target color is shown. Select the matching color from the options below. </p>
            <div className='joint'>
            <h3 data-testid="score">Score {score} </h3>
            <button data-testid="newGameButton" onClick={() => newGame()} className='new-game'>New Game</button>
            </div>
        </div>
        <div data-testid="colorBox" className='target-color'style={{ backgroundColor: targetColor , borderColor: 'transparent rgba(0, 0, 0, 0.1)', borderWidth: '15px', borderStyle: 'solid',boxShadow:"0px 4px 10px rgba(0, 0, 0, 0.3)"}} ></div>
        <div className='btn-box' data-testid="colorOption"> {options.map((color, index) => (
            <button key={index} onClick={() => checkAnswer(color)} className='btn' style={{backgroundColor: color, borderColor: 'transparent rgba(0, 0, 0, 0.1)', borderWidth: '15px', borderStyle: 'solid',boxShadow:"0px 4px 10px rgba(0, 0, 0, 0.3)" }}></button>
        ))}
        </div>
        {message && <p data-testid="gameStatus" style={{fontSize:"12px"}}>{message}</p>}
    </div>
  )
}

export default ColorGame