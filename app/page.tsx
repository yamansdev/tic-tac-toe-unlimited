"use client";
import React, { useEffect, useRef, useState } from "react";
import { ImCross, ImRadioUnchecked } from "react-icons/im";
import { VscDebugRestart } from "react-icons/vsc";
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
  const [gameState, setGameState] = useState(board);
  const [boardMoves, setBoardMoves] = useState<number[]>([]);
  const [boardState, setBoardState] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [showModal, setShowModal] = useState(false);

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
            onClick={() => handleClick(i)}
            key={i}
            $hover={true}
            $firstMove={boardMoves[0] === i && boardMoves.length > 6}
            className="aspect-square"
          >
            {gameState[i]}
          </Btn>,
        ]);
      }
    }
    checkWin();

    return () => setBoard([]);
  }, [gameState]);
  const handleClick = (index: number) => {
    if (boardState[index] !== null) {
      return;
    }
    setGameState((prevState) => {
      const newState = [...prevState];
      newState[index] = currentPlayer === "X" ? Cross : Circle;
      return newState;
    });
    setBoardState((prevState) => {
      const newState = [...prevState];
      newState[index] = currentPlayer;
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      return newState;
    });
    setBoardMoves((prevMoves) => [...prevMoves, index]);
    if (boardMoves.length > 6) {
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

  const checkWin = () => {
    for (let i = 0; i < winningBoard.length; i++) {
      const [a, b, c] = winningBoard[i];

      if (
        boardState[a] &&
        boardState[a] === boardState[b] &&
        boardState[b] === boardState[c]
      ) {
        setShowModal(true);
        setScore((prevScore) => ({
          ...prevScore,
          [currentPlayer === "X" ? "O" : "X"]:
            prevScore[currentPlayer === "X" ? "O" : "X"] + 1,
        }));
        resetGame();
      }
    }
  };
  const resetGame = () => {
    setBoardState(Array(9).fill(null));
    setGameState(
      Array.from(Array(9), (_, i) => <React.Fragment key={i}></React.Fragment>)
    );
    setBoardMoves([]);
    setCurrentPlayer("X");
  };

  // Modal component
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
      <div className="grid grid-cols-3 place-items-center w-full max-w-[400px] ">
        <Btn $hover={false} $firstMove={false} className="col-start-2">
          {currentPlayer} TURN
        </Btn>
        <Btn
          onClick={resetGame}
          $hover
          $firstMove={false}
          className="place-self-end bg-red-400"
        >
          {" "}
          <VscDebugRestart />
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
