"use client";
import React, { useEffect, useRef, useState } from "react";
import { ImCross, ImRadioUnchecked } from "react-icons/im";
import tw from "tailwind-styled-components";
import { getBestMove, isMovesLeft } from "./minimax";

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
  const [gameState, setGameState] = useState(board);
  const [boardMoves, setBoardMoves] = useState<number[]>([]);
  const [boardState, setBoardState] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [showModal, setShowModal] = useState(false);
  const [points, setPoints] = useState(0);

  let winningEl: number[] = [];

  const winningBoard = [
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
            onClick={() => makeMove(i, currentPlayer)}
            key={i}
            $hover={true}
            $firstMove={boardMoves[0] === i && boardMoves.length > 6}
            className={
              winningEl.includes(i)
                ? "animate-pulse border-green-400 border-2 "
                : "" + "aspect-square"
            }
          >
            {gameState[i]}
          </Btn>,
        ]);
      }
    }

    checkWin();
    if (currentPlayer === "O") {
      setTimeout(() => {
        makeMove(getBestMove(boardState), "O");
      }, 500);
    }

    return () => setBoard([]);
  }, [boardState]);

  // const makeMove = (index: number, player: string) => {
  //   if (boardState[index] !== null) {
  //     return;
  //   }

  //   setGameState((prevState) => {
  //     const newState = [...prevState];
  //     newState[index] = player === "X" ? Cross : Circle;
  //     return newState;
  //   });

  //   setBoardState((prevState) => {
  //     const newState = [...prevState];
  //     newState[index] = player;
  //     return newState;
  //   });
  //   if (boardMoves.length > 6) {
  //     removeMove();
  //   }
  //   setBoardMoves((prevMoves) => [...prevMoves, index]);
  //   setCurrentPlayer(player === "X" ? "O" : "X");
  //   setPoints((prevPoints) => prevPoints + 50);
  // };

  const makeMove = (index: number, player: string) => {
    if (boardState[index] !== null) {
      return;
    }

    if (player === "X") {
      // Human player's move
      setGameState((prevState) => {
        const newState = [...prevState];
        newState[index] = Cross;
        return newState;
      });

      setBoardState((prevState) => {
        const newState = [...prevState];
        newState[index] = "X";
        return newState;
      });
    } else {
      // AI player's move
      const bestMove = getBestMove(boardState);
      setGameState((prevState) => {
        const newState = [...prevState];
        newState[bestMove] = Circle;
        return newState;
      });

      setBoardState((prevState) => {
        const newState = [...prevState];
        newState[bestMove] = "O";
        return newState;
      });
    }

    setBoardMoves((prevMoves) => [...prevMoves, index]);
    setCurrentPlayer(player === "X" ? "O" : "X");
    setPoints((prevPoints) => prevPoints + 50);
    let boardMovesCopy = [...boardMoves];
    if (boardMovesCopy.length > 6) {
      boardMovesCopy.shift();
      removeMove();
    }
  };
  const removeMove = () => {
    setBoardState((prevState) =>
      [...prevState].map((item, idx) => {
        if (idx === boardMoves[0]) {
          return null;
        }
        return item;
      })
    );
    setGameState((prevState) =>
      [...prevState].map((item, idx) => {
        const Empty = <></>;
        if (idx === boardMoves[0]) {
          return Empty;
        }
        return item;
      })
    );
    setBoardMoves((prevMoves) => [...prevMoves].filter((_, idx) => idx !== 0));
  };

  const isGameOver = (boardState: (string | null)[]) => {
    for (let i = 0; i < winningBoard.length; i++) {
      const [a, b, c] = winningBoard[i];
      if (
        boardState[a] &&
        boardState[a] === boardState[b] &&
        boardState[b] === boardState[c]
      ) {
        winningEl = [a, b, c];

        return true;
      }
    }
    return false;
  };

  const checkWin = () => {
    if (isGameOver(boardState)) {
      setTimeout(() => {
        console.log(winningEl);

        setScore((prevScore) => ({
          ...prevScore,
          [currentPlayer === "X" ? "O" : "X"]:
            prevScore[currentPlayer === "X" ? "O" : "X"] + points,
        }));
        resetGame();
      }, 1500);
    }
    if (score.X >= 1500) {
      setShowModal(true);
    }
    if (score.O >= 1500) {
      setShowModal(true);
    }
  };

  const resetGame = () => {
    setBoardState(Array(9).fill(null));
    setGameState(
      Array.from(Array(9), (_, i) => <React.Fragment key={i}></React.Fragment>)
    );
    setBoardMoves([]);
    setCurrentPlayer("X");
    setPoints(0);
  };

  function WinnerModal() {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div className="bg-[#061a32] p-8 rounded-lg">
          <h2 className="text-4xl font-bold mb-4">
            {currentPlayer === "X" ? "O" : "X"} Wins!
          </h2>

          <button
            onClick={() => setShowModal(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col justify-center items-center h-screen text-2xl text-center p-8 gap-4 lg:gap-8 ">
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
      {showModal && <WinnerModal />}
    </main>
  );
}
