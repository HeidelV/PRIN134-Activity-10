class Player {
    constructor(name, team) {
        this.name = name;
        this.team = team;
        this.score = 0;
    }

    attemptShot(successRate) {
        if (Math.random() < successRate) {
            this.score++;
            return true;
        }
        return false;
    }
}

let players = [];
let teamCounter = 1; // Just for auto-generating team names

function addPlayer() {
    if (players.length >= 4) {
        alert("You can only add up to 4 players.");
        return;
    }

    const input = document.getElementById('playerName');
    const name = input.value.trim();

    if (name === "" || !/[a-zA-Z]/.test(name)) {
        alert("Please enter a valid player name (must include at least one letter).");
        input.focus();
        return;
    }

    const newPlayer = new Player(name, `Team ${teamCounter++}`);
    players.push(newPlayer);

    const playerList = document.getElementById('playerList');
    const teamList = document.getElementById('teamList');

    // Clear default text if it's still there
    if (playerList.textContent === "No players yet.") playerList.textContent = "";
    if (teamList.textContent === "No teams yet.") teamList.textContent = "";

    // Add player to Player list
    const p = document.createElement('p');
    p.textContent = `${newPlayer.name}`;
    playerList.appendChild(p);

    // Add team to Team list
    const t = document.createElement('p');
    t.textContent = `${newPlayer.team}`;
    teamList.appendChild(t);

    input.value = ""; // Clear input
}

document.getElementById('addForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addPlayer();
});

function generateSuccessRate() {
    return Math.random() * 0.5 + 0.5; // Between 0.5 and 1.0
}

function startGame() {
    if (players.length !== 4) {
        alert("Please add exactly 4 players to start the game.");
        return;
    }

    // Reset scores before starting
    players.forEach(player => player.score = 0);

    // Clear old game results text before new round
    const gameResults = document.getElementById('gameResults');
    gameResults.innerHTML = ""; // ← this clears "Press play to start."

    // Update the UI text
    const gameRoundHeader = document.getElementById('gameRoundHeader');
    gameRoundHeader.textContent = "Game in Progress...";

    // Begin round 1
    playGame(players, 3, 1);  // 3 attempts per player in round 1
}

function playGame(players, attemptsPerPlayer, round = 1) {
    const gameResultsDiv = document.getElementById('gameResults');

    // Create a new round card
    const roundCard = document.createElement('div');
    roundCard.classList.add('card', 'mb-3', 'roundCard'); // Optional styling classes

    const roundHeader = document.createElement('h5');
    roundHeader.classList.add('card-header');
    roundHeader.textContent = `🏀 Round ${round} Begins!`;
    roundCard.appendChild(roundHeader);

    const roundBody = document.createElement('div');
    roundBody.classList.add('card-body');

    // Collect results for the round
    let resultsHTML = "";
    players.forEach(player => {
        let successRate = generateSuccessRate();
        let successfulShots = 0;

        for (let i = 0; i < attemptsPerPlayer; i++) {
            if (player.attemptShot(successRate)) {
                successfulShots++;
            }
        }

        resultsHTML += `<p>${player.name} scored ${successfulShots} successful shots.</p>`;
    });

    roundBody.innerHTML = resultsHTML;
    roundCard.appendChild(roundBody);
    gameResultsDiv.appendChild(roundCard);

    // Check for tie
    let rankedPlayers = rankPlayers(players);
    let topScore = rankedPlayers[0].score;
    let topPlayers = rankedPlayers.filter(player => player.score === topScore);

    if (topPlayers.length > 1) {
        const tieMsg = document.createElement('p');
        tieMsg.textContent = "Tie! Starting another round...";
        gameResultsDiv.appendChild(tieMsg);
        setTimeout(() => playGame(topPlayers, 3, round + 1), 2000);
    } else {
        announceWinners(rankedPlayers);
    }
}


function rankPlayers(players) {
    return players.sort((a, b) => b.score - a.score);
}

function announceWinners(players) {
    let topScore = players[0].score;
    let winners = players.filter(player => player.score === topScore);

    const newCard = document.createElement('div');
    newCard.classList.add('card', 'rankingsCard', 'no-radius');

    const header = document.createElement('h5');
    header.classList.add('card-header');
    header.textContent = "🏆 Final Game Results";
    newCard.appendChild(header);

    const body = document.createElement('div');
    body.classList.add('card-body');
    
    let resultHTML = "<h6>Game Over! Final Rankings:</h6><ul>";
    players.forEach((player, index) => {
        resultHTML += `<li>${index + 1}. ${player.name} - ${player.score} points</li>`;
    });
    resultHTML += "</ul>";

    if (winners.length > 1) {
        resultHTML += `<p>🔄 Tie-breaker needed between: ${winners.map(p => p.name).join(", ")}</p>`;
    } else {
        resultHTML += `<p>🏆 The champion is ${winners[0].name} with ${winners[0].score} points!</p>`;
    }
    const resultText = document.createElement('div');
    resultText.classList.add('card-text');
    resultText.innerHTML = resultHTML;
    body.appendChild(resultText);
    newCard.appendChild(body);

    const gameResultsDiv = document.getElementById('gameResults');
    gameResultsDiv.appendChild(newCard);

    // Hide the "Play Game" button and show "Reset Game" button
    document.getElementById('playButton').style.display = 'none';
    document.getElementById('resetButton').style.display = 'block';

    // Update the UI text to show game is finished
    const gameRoundHeader = document.getElementById('gameRoundHeader');
    gameRoundHeader.textContent = "Game Finished";
}

function resetGame() {
    players = [];
    teamCounter = 1; // Reset team counter
    const playerListDiv = document.getElementById('playerList');
    playerListDiv.textContent = "No players yet."; // Reset player list

    const teamListDiv = document.getElementById('teamList');
    teamListDiv.textContent = "No teams yet."; // Reset team list

    const gameResultsDiv = document.getElementById('gameResults');
    gameResultsDiv.innerHTML = "Press play to start.";

    const gameRoundHeader = document.getElementById('gameRoundHeader');
    gameRoundHeader.textContent = "Ready to play!";  // Reset header text

    document.getElementById('playButton').style.display = 'block';  // Show play button again
    document.getElementById('resetButton').style.display = 'none'; // Hide reset button
}
