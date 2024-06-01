"use client";
import React, { useEffect, useRef, useState } from "react";
import { ImCross, ImRadioUnchecked } from "react-icons/im";
import tw from "tailwind-styled-components";

interface DivProps {
  $hover: boolean;
  $firstMove: boolean;
}

export default function Home() {
  const Btn = tw.div<DivProps>`bg-slate-700 p-4 rounded-xl  relative  ${(p) =>
    p.$hover ? "cursor-pointer hover:opacity-75" : ""} ${(p) =>
    p.$firstMove ? "animate-pulse" : ""}`;
  const Cross = (
    <ImCross
      className="text-sky-400 text-6xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
"
    />
  );
  const Circle = (
    <ImRadioUnchecked
      className="text-orange-400 text-6xl absolute top-1/2  left-1/2 transform -translate-x-1/2 -translate-y-1/2 
"
    />
  );

  const [board, setBoard] = useState<JSX.Element[]>(
    Array.from(Array(9), (_, i) => <React.Fragment key={i}></React.Fragment>)
  );
  const [boardState, setBoardState] = useState<(string | null)[]>(
    Array(9).fill(null)
  );
  const [playedMoves, setPlayedMoves] = useState<number[]>([]);

  const [currentPlayer, setCurrentPlayer] = useState<string | null>("X");
  const [winningCells, setWinningCells] = useState<number[]>([]);
  const [score, setScore] = useState<{ X: number; O: number }>({ X: 0, O: 0 });
  const [points, setPoints] = useState<number>(0);
  const [showWinnerModal, setShowWinnerModal] = useState<boolean>(false);
  const [gameMode, setGameMode] = useState<"pvp" | "pvc">("pvp");
  const [showModeModal, setShowModeModal] = useState<boolean>(true);

  const winningBoard: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const boardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (boardRef.current) {
      for (let i = 0; i < 9; i++) {
        setBoard((prevBoard) => [
          ...prevBoard,
          <Btn
            key={i}
            onClick={() => {
              handlePlay(i);
            }}
            $hover={true}
            $firstMove={playedMoves[0] === i && playedMoves.length >= 6}
            id={i.toString()}
            className={
              "aspect-square" +
              (winningCells.includes(i)
                ? " animate-pulse border-2 border-green-500"
                : "")
            }
          >
            {boardState[i] === "X"
              ? Cross
              : boardState[i] === "O"
              ? Circle
              : null}
          </Btn>,
        ]);
      }
    }
    console.log(points, score);

    return () => setBoard([]);
  }, [boardState, winningCells]);

  const handlePlay = (i: number) => {
    if (boardState[i] === null) {
      setBoardState((prevBoardState) => {
        const newBoardState = [...prevBoardState];
        newBoardState[i] = currentPlayer;
        return newBoardState;
      });
      setPlayedMoves((prevPlayedMoves) => [...prevPlayedMoves, i]);
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      setPoints((prevPoints) => prevPoints + 100);
      if (playedMoves.length >= 6) {
        removeFirstMove();
      }
    }
  };

  const getAvailableMoves = () => {
    const availableMoves = [];
    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] === null) {
        availableMoves.push(i);
      }
    }
    return availableMoves;
  };
  const cpuMove = () => {
    const availableMoves = getAvailableMoves();
    let bestScore = -Infinity;
    let bestMoves = [0];
    const randomChance = 0.1; // 10% chance of making a random move

    if (Math.random() < randomChance) {
      const randomIndex = Math.floor(Math.random() * availableMoves.length);
      const randomMove = availableMoves[randomIndex];
      handlePlay(randomMove);
      return;
    }
    for (let i = 0; i < availableMoves.length; i++) {
      const move = availableMoves[i];
      boardState[move] = "O";
      const score = minimax(boardState, 0, false);
      boardState[move] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMoves = [move];
      } else if (score === bestScore) {
        bestMoves.push(move);
      }
    }

    const randomIndex = Math.floor(Math.random() * bestMoves.length);
    const bestMove = bestMoves[randomIndex];

    handlePlay(bestMove);
  };

  const minimax = (
    board: (string | null)[],
    depth: number,
    isMaximizing: boolean
  ) => {
    const result = checkWinner();
    if (result !== null) {
      return result === "X" ? -10 + depth : 10 - depth;
    }

    if (getAvailableMoves().length === 0) {
      return 0;
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = "O";
          const score = minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(bestScore, score);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = "X";
          const score = minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(bestScore, score);
        }
      }
      return bestScore;
    }
  };

  const checkWinner = () => {
    for (let i = 0; i < winningBoard.length; i++) {
      const [a, b, c] = winningBoard[i];
      if (
        boardState[a] &&
        boardState[a] === boardState[b] &&
        boardState[a] === boardState[c]
      ) {
        return boardState[a];
      }
    }
    return null;
  };

  useEffect(() => {
    if (gameMode === "pvc" && currentPlayer === "O") {
      setTimeout(() => {
        cpuMove();
      }, 602);
    }

    checkWin();
  }, [playedMoves]);

  const removeFirstMove = () => {
    setBoardState((prevBoardState) => {
      const newBoardState = [...prevBoardState];
      newBoardState[playedMoves[0]] = null;
      return newBoardState;
    });
    setPlayedMoves((prevPlayedMoves) => prevPlayedMoves.slice(1));
  };

  const checkWin = () => {
    for (let i = 0; i < winningBoard.length; i++) {
      const [a, b, c] = winningBoard[i];
      if (
        boardState[a] &&
        boardState[a] === boardState[b] &&
        boardState[a] === boardState[c]
      ) {
        setWinningCells([a, b, c]);
        const winner = currentPlayer === "X" ? "O" : "X";
        setScore((prevScore) => ({
          ...prevScore,
          [winner as "X" | "O"]: prevScore[winner as "X" | "O"] + points,
        }));

        setTimeout(() => {
          handleReset();
          return;
        }, 600);
      }
    }
  };

  const handleReset = () => {
    setBoardState(Array(9).fill(null));
    setPlayedMoves([]);
    setWinningCells([]);
    setPoints(() => 0);
    return;
  };

  useEffect(() => {
    if (score.X >= 3000 || score.O >= 3000) {
      setCurrentPlayer(null);
      setShowWinnerModal(true);
    }
  }, [score]);

  function WinnerModal() {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-10">
        <div className="bg-[#061a32] p-8 rounded-lg">
          <h2 className="text-4xl font-bold mb-4">
            {currentPlayer === "X" ? "O" : "X"} Wins!
          </h2>

          <button
            onClick={() => {
              handleReset();
              setScore({ X: 0, O: 0 });
              setCurrentPlayer("X");
              setShowModeModal(true);
              setShowWinnerModal(false);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  function ModeModal() {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-10">
        <div className="bg-[#061a32] p-8 rounded-lg">
          <h2 className="text-4xl font-bold mb-4">Choose Game Mode</h2>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                setGameMode("pvp");
                setShowModeModal(false);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Player vs Player
            </button>
            <button
              onClick={() => {
                setGameMode("pvc");
                setShowModeModal(false);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Player vs CPU
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col justify-center items-center h-screen text-2xl text-center p-8 gap-4 lg:gap-8 relative">
      {showWinnerModal && <WinnerModal />}
      {showModeModal && <ModeModal />}
      <div className="grid grid-cols-3 gap-4 w-full max-w-[400px] mb-8 ">
        <Btn $hover={false} $firstMove={false}>
          TURN
          <br />
          {currentPlayer}
        </Btn>
        <Btn $hover={false} $firstMove={false}>
          Points
          <br />
          {points}
        </Btn>
      </div>
      <div
        ref={boardRef}
        className="grid grid-cols-3 w-full gap-4 max-w-[400px]"
      >
        {board}
      </div>
      <div className="grid grid-cols-2 w-full lg:gap-8 gap-2 max-w-[400px] text-2xl">
        <Btn $hover={false} $firstMove={false} className="bg-sky-400">
          X<div>{score.X}</div>
        </Btn>

        <Btn $hover={false} $firstMove={false} className=" bg-orange-400">
          O<div>{score.O}</div>
        </Btn>
      </div>
    </main>
  );
}
