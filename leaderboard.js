// JavaScript source code
const dreamloPublicKey = "YOUR_PUBLIC_KEY";  // Replace with your Dreamlo Public Key
const dreamloPrivateKey = "YOUR_PRIVATE_KEY";  // Replace with your Dreamlo Private Key

// Function to submit a score from Unity
function submitScore(playerName, score) {
    const url = `https://www.dreamlo.com/lb/${dreamloPrivateKey}/add/${playerName}/${score}`;
    fetch(url)
        .then(() => console.log("Score submitted successfully!"))
        .catch(error => console.error("Error submitting score:", error));
}

// Function to fetch leaderboard and send it back to Unity
function fetchLeaderboard() {
    const url = `https://www.dreamlo.com/lb/${dreamloPublicKey}/json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let scores = data.dreamlo.leaderboard.entry;
            scores.sort((a, b) => b.score - a.score);  // Sort from highest to lowest

            // Format leaderboard as a string: "1. Player - Score\n2. Player - Score\n..."
            let leaderboardString = scores.slice(0, 10).map((entry, index) =>
                `${index + 1}. ${entry.name} - ${entry.score}`
            ).join("\n");

            // Send leaderboard data back to Unity
            SendLeaderboardToUnity(leaderboardString);
        })
        .catch(error => console.error("Error fetching leaderboard:", error));
}

// This function will be called from JavaScript to Unity
function SendLeaderboardToUnity(leaderboardData) {
    if (typeof unityInstance !== "undefined") {
        unityInstance.SendMessage("LeaderboardManager", "ReceiveLeaderboard", leaderboardData);
    } else {
        console.error("Unity instance not found!");
    }
}
