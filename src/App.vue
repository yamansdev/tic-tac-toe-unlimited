<script setup lang="ts">

import { ref, watchEffect } from 'vue'
import Btn from './components/Btn.vue'
import WinnerModal from './components/winnerModal.vue'
import ModeModal from './components/modeModal.vue'
import Cross from '@/assets/cross.svg'
import Circle from '@/assets/radio-unchecked.svg'

const board = ref<string[]|null[]>(Array(9).fill(null))
const playedMoves = ref<number[]>([])
const winningCells = ref<number[]>([])
const currentPlayer = ref<string>('X')
const points = ref<number>(0)
const score=ref<{x:number,o:number}>({x:0,o:0})
const gameMode=ref<string>('')
const showWinnerModal = ref<boolean>(false)
const showModeModal = ref<boolean>(true)
const haveWinner = ref<boolean>(false)
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


const handlePlay=(index:number)=>{
  if(board.value[index]===null ){
    board.value[index]=currentPlayer.value
    playedMoves.value.push(index)
    points.value+=100
    if(playedMoves.value.length>=7){
      removeFirstMove()
      
    }
    handleWin()
    if(!haveWinner.value) {
      currentPlayer.value=currentPlayer.value==='X' ? 'O' : 'X'  
    } 

}
}

const removeFirstMove=()=>{
    board.value[playedMoves.value[0]]=null
    playedMoves.value.shift()
}

const handleWin=()=>{
  for (let i = 0; i < winningBoard.length; i++) {
      const [a, b, c] = winningBoard[i];
      if (
        board.value[a] &&
        board.value[a] === board.value[b] &&
        board.value[a] === board.value[c]
      ) {
        winningCells.value = winningBoard[i];
        score.value[currentPlayer.value==='X' ? 'x' : 'o']+=points.value
        if(score.value[currentPlayer.value==='X' ? 'x' : 'o']>=3000){
          showWinnerModal.value=true
          haveWinner.value=true
        }
        setTimeout(()=>{
          
          handleReset()
        },600)

        
}}    
}

const handleReset=()=>{
  board.value=Array(9).fill(null)
  playedMoves.value=[]
  winningCells.value=[]
  points.value=0
  haveWinner.value=false
}

const checkWinner=(player:string)=>{

  for (let i = 0; i < winningBoard.length; i++) {
      const [a, b, c] = winningBoard[i];
      if (
        board.value[a] &&
        board.value[a] === board.value[b] &&
        board.value[a] === board.value[c] &&
        board.value[a]===player
      ) {
        return true
      }
  }
}

// Cpu logic

const handleCpu=()=>{

  if(gameMode.value!=='pvc' && currentPlayer.value!=='O'){
    return
  }
  const availableSpots = getAvailableSpots()
  let bestScore = -Infinity
  let bestMoves=[0]
  const randomChance=0.1

  if(Math.random()<randomChance){
    const randomSpot=availableSpots[Math.floor(Math.random()*availableSpots.length)]
    handlePlay(randomSpot)

  }else{
    for (let i = 0; i < availableSpots.length; i++) {
      const move = availableSpots[i]
      board.value[move] = 'O'
      const score = minimax(board.value, 0, false)
      board.value[move] = null
      if (score > bestScore) {
        bestScore = score
        bestMoves = [move]
      } else if (score === bestScore) {
        bestMoves.push(move)
      }
    }
    const bestMove = bestMoves[Math.floor(Math.random() * bestMoves.length)]
    handlePlay(bestMove)
  }
}
const getAvailableSpots=()=>{
  const availableSpots = []
  for (let i = 0; i < board.value.length; i++) {
    if (board.value[i] === null) {
      availableSpots.push(i)
    }
  }
  return availableSpots
}

const minimax=(board: string[]|null[], depth: number, isMaximizing: boolean) => {
  const availableSpots = getAvailableSpots()
  if (checkWinner('X')) {
    return -10
  } else if (checkWinner('O')) {
    return 10
  } else if (availableSpots.length === 0) {
    return 0
  }

  if (isMaximizing) {
    let bestScore = -Infinity
    for (let i = 0; i < availableSpots.length; i++) {
      const move = availableSpots[i]
      board[move] = 'O'
      const score = minimax(board, depth + 1, false)
      board[move] = null
      bestScore = Math.max(score, bestScore)
    }
    return bestScore
  } else {
    let bestScore = Infinity
    for (let i = 0; i < availableSpots.length; i++) {
      const move = availableSpots[i]
      board[move] = 'X'
      const score = minimax(board, depth + 1, true)
      board[move] = null
      bestScore = Math.min(score, bestScore)
    } 
    return bestScore
  }
}

watchEffect(()=>{

  if(gameMode.value==='pvc' && currentPlayer.value==='O'){
    setTimeout(()=>handleCpu(),300)
  }
})

</script>

<template>

  <main class="flex flex-col justify-center items-center h-screen text-2xl text-center p-8 gap-4 lg:gap-8 relative">
    <WinnerModal v-if="showWinnerModal" :current-player="currentPlayer" @handle-reset="() => {

      handleReset(),
      score={x:0,o:0}
      currentPlayer='X',
      showWinnerModal=false
      showModeModal=true
    }
    " @showWinnerModal="(hide)=>showWinnerModal=hide" />
      <ModeModal v-if="showModeModal" @gameMode="(mode)=> gameMode=mode" @showModeModal="(hide)=>showModeModal=hide" />

    



    <div class="grid grid-cols-3 gap-4 w-full max-w-[400px] mb-8">
      <Btn>
        Turn
        <br>
        {{ currentPlayer }}
      </Btn>
      
      <Btn>
        Points
        <br>
        {{points}}
      </Btn>

    </div>
    <div class="grid grid-cols-3 w-full gap-4 max-w-[400px] ">

      <Btn :hover="true" :first-move="playedMoves[0]===index && playedMoves.length>=6" v-for="(i, index) in board" :key="index" @click="handlePlay(index)" class="aspect-square " :class="[winningCells.includes(index) ? 'animate-pulse border-2 border-green-500' : '']">
       
          <Cross v-if="i === 'X'" class="fill-sky-400 scale-[2]"/>


          <Circle v-if="i === 'O'" class="fill-orange-400 scale-[2] " />


      </Btn>


    </div>
    <div class="grid grid-cols-2 w-full lg:gap-8 gap-2 max-w-[400px] text-2xl">

      <Btn class="!bg-sky-400" >
        X<div>{{ score.x }}</div>
      </Btn>
      <Btn class="!bg-orange-400" >
        O<div>{{ score.o }}</div>
      </Btn>

    </div>

  </main>
</template>
