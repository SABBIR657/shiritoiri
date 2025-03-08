import { useEffect, useState } from "react";

const words = new Set<string>();
const api = "https://api.dictionaryapi.dev/api/v2/entries/en";

interface Score {
  player1: number;
  player2: number;
}

const Games = () => {
  const [currentWord, setCurrentWord] = useState<string>("");
  const [wordHistory, setWordHistory] = useState<string[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<number>(1);
  const [yourScore, setYourScore] = useState<Score>({ player1: 0, player2: 0 });
  const [timer, setTimer] = useState<number>(20);
  const [gameOver] = useState<boolean>(false);

  useEffect(() => {
    if (!gameOver) {
      const timeCount = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            handleInvalidWord();
            return 20;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timeCount);
    }
  }, [currentPlayer, gameOver]);

  const validWord = async (word: string): Promise<boolean> => {
    if (word.length < 4 || words.has(word)) return false;
    if (
      wordHistory.length &&
      word[0] !== wordHistory[wordHistory.length - 1].slice(-1)
    )
      return false;

    try {
      const response = await fetch(`${api}/${word}`);
      return response.ok;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (await validWord(currentWord)) {
      words.add(currentWord);
      setWordHistory((prev) => [...prev, currentWord]);

      setYourScore((prevScore) => ({
        ...prevScore,
        [`player${currentPlayer}` as keyof Score]: prevScore[`player${currentPlayer}` as keyof Score] + 1,
      }));

      setCurrentWord("");
      setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
      setTimer(20);
    } else {
      handleInvalidWord();
    }
  };

  const handleInvalidWord = () => {
    setYourScore((prevScore) => {
        const playerKey = `player${currentPlayer}` as keyof Score;
        return {
          ...prevScore,
          [playerKey]: prevScore[playerKey] - 1,
        };
      });
      

    setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
    setTimer(20);
  };

  return (
    <div>
      <h1>Shiritori</h1>
      <p>Player {currentPlayer}'s turn</p>
      <p>Timer: {timer}</p>
      <input
        value={currentWord}
        type="text"
        onChange={(e) => setCurrentWord(e.target.value.toLowerCase())}
      />
      <button onClick={handleSubmit}>Submit</button>
      <div>
        <h2>Scores</h2>
        <p>
          Player 1: {yourScore.player1} || Player 2: {yourScore.player2}
        </p>
      </div>
      <div>
        <h2>Word History</h2>
        <ul>
          {wordHistory.map((word, index) => (
            <li key={index}>{word}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Games;
