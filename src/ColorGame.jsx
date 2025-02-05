import { React } from 'react';
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

const ColorGame = () => {
    const [targetColor, setTargetColor] = useState(getRandomColor());
    const [options, setOptions] = useState([]);
    const [message, setMessage] = useState("");
    const [score, setScore] = useState(() => {
        const storedScore = localStorage.getItem("score");
        return storedScore ? parseInt(storedScore) : 0;
    });

    const newGame = () => {
        setScore(0);
        setTargetColor(getRandomColor());
    };

    useEffect(() => {
        const colors = [targetColor];
        while (colors.length < 6) {
            const newColor = getRandomColor();
            if (!colors.includes(newColor)) {
                colors.push(newColor);
            }
        }
        setOptions(colors.sort(() => Math.random() - 0.5));
    }, [targetColor]);

    useEffect(() => {
        localStorage.setItem("score", score.toString());
    }, [score]);

    const checkAnswer = (color) => {
        if (color === targetColor) {
            setMessage('Correct 🎉');
            setScore(prevScore => prevScore + 1);
            setTimeout(() => {
                setTargetColor(getRandomColor());
                setMessage("");
            }, 1000);
        } else {
            setMessage('Wrong, try again! ❌');
        }
    };

    return (
        <div className='bg'>
            <div className='head'>
                <img src={image} alt="cameleon" />
                <h1>Guess the <span style={{ color: "#E67300", textShadow: "0px 4px 10px rgba(0, 0, 0, 0.6)" }}>Color</span></h1>
            </div>
            <div className='head-instruct'>
                <p data-testid="gameInstructions" className='game-instruct'>A target color is shown. Select the matching color from the options below.</p>
                <div className='joint'>
                    <h3 data-testid="score">Score {score} </h3>
                    <button data-testid="newGameButton" onClick={newGame} className='new-game'>New Game</button>
                </div>
            </div>
            <div data-testid="colorBox" className='target-color' style={{ backgroundColor: targetColor,  border: '15px solid transparent', boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)" }}></div>
            <div className='btn-box'>
                {options.map((color, index) => (
                    <button data-testid="colorOption" key={index} onClick={() => checkAnswer(color)} className='btn' style={{ backgroundColor: color, border: '15px solid transparent', boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)" }}></button>
                ))}
            </div>
            {message && <p data-testid="gameStatus" className='game-message' style={{ fontSize: "12px" }}>{message}</p>}
        </div>
    );
};

export default ColorGame;
