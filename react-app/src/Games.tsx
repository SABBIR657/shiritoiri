import { useEffect, useState } from "react";

const words = new Set<string>();
const api = "https://api.dictionaryapi.dev/api/v2/entries/en"
interface Score {
  player1: number;
  player2: number;
}


const Games = () => {
const [currentWord, setCurrentWord] = useState<string>("");
const [wordhistory, setWordHistory] = useState<string[]>([]);
const [currentPlayer, setCurrentPlayer] = useState<number>(1);
const [yourScore, setYourScore] = useState<yourScore>({player1: 0, player2: 0});
const [timer, setTimer] = useState<number>(20);
const [gameOver] = useState<boolean>(false);

useEffect(()=>{
    if(!gameOver){
        const timeCount = setInterval(
            ()=>{
                setTimer((prev)=>{
                    if(prev === 1){
                        handleInvalidWord();
                        return 20;
                    }
                    return prev-1;
                })
            }, 1000
        )
        return () => clearInterval(timeCount);
    }
},[currentPlayer, gameOver]);

const validWord = async (word: string): Promise<boolean> => {
if(word.length < 4 || words.has(word)) return false;
if(wordhistory.length && word[0] !== wordhistory[wordhistory.length-1].slice(-1)) return false;

try{
    const response = await fetch(`${api}/${word}`);
    return response.ok;

}
catch{
    return false;
}

}

const handleSubmit = async () => {
    if(await validWord(currentWord)){
        words.add(currentWord);
        setWordHistory([...wordhistory, currentWord]);
        setYourScore((prevScore: { [x: string]: number; })=>({
            ...prevScore,
            [`player${currentPlayer}`]: prevScore[`player${currentPlayer}` as keyof Score] +1 ,
        }))
        setCurrentWord("");
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        setTimer(20);
    }
    else{
        handleInvalidWord();
    }
}

const handleInvalidWord = () => {
    setYourScore((prevScore: { [x: string]: number; })=> ({
        ...prevScore,
        [`player${currentPlayer}`]: prevScore[`player${currentPlayer}` as keyof Score] -1,
    }));
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    setTimer(20);
}

  return (
    <div> 
        <h1>Shiritoiri</h1>
        <p>Player {currentPlayer}'s turn</p>
        <p>Timer: {timer}</p>
        <input
        value={currentWord}
        type="text"
        onChange={(e)=> setCurrentWord(e.target.value.toLowerCase())}

        
        />
        <button
        onClick={handleSubmit}
        >Submit</button>
        <div>
            <h2>Scores</h2>
            <p>Player 1: {yourScore.player1} || Plyer 2 : {yourScore.player2}</p>
        </div>
        <div>
            <h2>Word History</h2>
            <ul>
                {wordhistory.map((word,index)=>(
                    <li key={index}>
                        {word}
                    </li>
                ))}
            </ul>
        </div>
    </div>
  )
}

export default Games