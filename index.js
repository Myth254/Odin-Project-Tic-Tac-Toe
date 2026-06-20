const Gameboard = (() => {
    const gameboardState = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ]

    const getBoard = () => {
        return gameboardState
    }

    const dropMark = (row, col, player) => {
        if (gameboardState[row][col] === "") {
            gameboardState[row][col] = player
            return true; // Return true if the move was successful
        } else {
            console.log("Space already occupied!")
            return false; // Return false if the space was taken
        }
    }

    const resetBoard = () => {
        for(let row = 0; row < 3; row++) {
            for(let col = 0; col < 3; col++) {
                gameboardState[row][col] = ""
            }
        }
    }

    return {getBoard, dropMark, resetBoard}
})()

// Player Factory Function
function createPlayer(name, marker) {
    return { 
        get name() { return name },
        get marker() { return marker }
    }
}


const GameController = (() => {
    let isgameOverFlag = false
    const board = Gameboard.getBoard()
    let gameResultStatus = "active" // Tracks: "active", "won", or "draw"
    let winner = null
    
    // Player instances
    let player1 = null
    let player2 = null
    let currentActivePlayer = null

     const initializePlayers = (name1, name2) => {
        // Use fallbacks if inputs are blank
        player1 = createPlayer(name1.trim() || "Player 1", "X")
        player2 = createPlayer(name2.trim() || "Player 2", "O")
        currentActivePlayer = player1
    }

    const winning_combinations = [
        // Rows
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        // Columns
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        // Diagonals
        [[0, 0], [1, 1], [2, 2]],
        [[2, 0], [1, 1], [0, 2]]
    ]
    
    const checkWin = (board, marker) => {
        for (const combo of winning_combinations) {
            const [cell1, cell2, cell3] = combo
            const [r1,c1] = cell1
            const [r2,c2] = cell2
            const [r3,c3] = cell3
            if (board[r1][c1] === marker && board[r2][c2] === marker && board[r3][c3] === marker) {
                return true
            }
        }
        return false
    }
    
    const checkTie = (board) => {
        return board.flat().every(cell => cell !== "")
    }

    const playRound = (rowIndex, colIndex) => {
        if (isgameOverFlag || !currentActivePlayer) return

        if (Gameboard.dropMark(rowIndex, colIndex, currentActivePlayer.marker)) {
            Gameboard.getBoard()
    
            if (checkWin(board, currentActivePlayer.marker)) {
                isgameOverFlag = true
                gameResultStatus = "won"
                winner = currentActivePlayer
                return
            }
    
            if (checkTie(board)) {
                isgameOverFlag = true
                gameResultStatus = "draw"
                return
            }
    
            if (!isgameOverFlag) {
                currentActivePlayer = (currentActivePlayer === player1) ? player2 : player1
            }
        }
    }

    const getGameStatus = () => {
        return {
            isGameOver: isgameOverFlag,
            status: gameResultStatus,
            winner: winner,
            isInitialized: player1 !== null 
        }
    }
    
    const restartGame = () => {
        currentActivePlayer = player1
        isgameOverFlag = false
        gameResultStatus = "active"
        winner = null
        Gameboard.resetBoard()
    }

    return { playRound, getGameStatus, restartGame, initializePlayers }
})()

const body = document.querySelector("body")

const renderDisplay = (() => {
    const title = document.createElement('h1')
    title.textContent = "Tic Tac Toe Game"
    body.appendChild(title)

   // Create input wrapper container
    const inputContainer = document.createElement("div")
    inputContainer.classList.add("input-container")
    body.appendChild(inputContainer)

    const p1Cont = document.createElement('div')
    const xlabel = document.createElement('label')
    xlabel.textContent = "Player X:"
    // Player 1 Input
    const p1Input = document.createElement("input")
    p1Input.placeholder = "Player 1 Name (X)"
    p1Input.value = "Player 1"
    p1Cont.append(xlabel, p1Input)
    inputContainer.appendChild(p1Cont)

    const p2Cont = document.createElement('div')
    const olabel = document.createElement("label")
    olabel.textContent = "Player O:"
    // Player 2 Input
    const p2Input = document.createElement("input")
    p2Input.placeholder = "Player 2 Name (O)"
    p2Input.value = "Player 2"
    p2Cont.append(olabel, p2Input)
    inputContainer.appendChild(p2Cont)

    // Start Button
    const startBtn = document.createElement("button")
    startBtn.textContent = "Start Game"
    inputContainer.appendChild(startBtn)


    const results = document.createElement("div")
    results.classList.add('showResults')
    body.appendChild(results)

    const container = document.createElement('div')
    container.classList.add("container")
    body.appendChild(container)

    const restartBtn = document.createElement('button')
    restartBtn.textContent = "Restart"
    restartBtn.classList.add('restartBtn')
    restartBtn.addEventListener('click', () => {
        // Only allow restarts if the game was actually initialized once
        if (!GameController.getGameStatus().isInitialized) {
            results.textContent = "Please start the game first!"
            return
        }
        results.textContent = "Game reset! Make your move."
        GameController.restartGame()
        renderBoard()
    })
    body.appendChild(restartBtn)
    
    const renderBoard = () => {
        container.innerHTML = ""
        const board = Gameboard.getBoard()

       for (let row = 0; row < board.length; row++) {
           for (let col = 0; col < board.length; col++) {
                const square = document.createElement("div")
                square.textContent = board[row][col]
                square.classList.add("box")

                square.dataset.row = row
                square.dataset.col = col

                container.appendChild(square)
            }
        }
    }

     // Handle the Start Game initialization
    startBtn.addEventListener('click', () => {
        const name1 = p1Input.value
        const name2 = p2Input.value
        
        GameController.initializePlayers(name1, name2)
        GameController.restartGame()
        results.textContent = "Game started! X goes first."
        renderBoard()
    })

    container.addEventListener('click', (e) => {
        if (!e.target.classList.contains("box")) return

        const gameStatusBefore = GameController.getGameStatus()
        if (!gameStatusBefore.isInitialized) {
            results.textContent = "⚠️ Click 'Start Game' to input names and play!"
            return
        }

        // Read the coordinates directly off the clicked element
        const row = parseInt(e.target.dataset.row)
        const col = parseInt(e.target.dataset.col)

        GameController.playRound(row, col)
        renderBoard()

        const gameStatusAfter = GameController.getGameStatus()
        if (gameStatusAfter.isGameOver) {
            if (gameStatusAfter.status === "won") {
                results.textContent = `🎉 Congratulations! ${gameStatusAfter.winner.name} wins the match!`
            } else if (gameStatusAfter.status === "draw") {
                results.textContent = "🤝 It's a draw! Well played both."
            }
        }
    })

   return { renderBoard }
}) ()

renderDisplay.renderBoard()