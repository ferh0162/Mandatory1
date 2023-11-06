import React, { useState } from "react"; // Import useState
import { Dimensions, View, Alert } from "react-native";
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GameEngine } from "react-native-game-engine";

const { width, height } = Dimensions.get("window");

const ball = {
  position: {
    x: width / 2 - 25,
    y: height / 2 - 25,
  },
  size: 40,
  velocity: {
    x: 0.4,
    y: 0.4,
  },
  renderer: (props) => {
    const { position, size } = props;
    return (
      <View
        style={{
          backgroundColor: "white",
          position: "absolute",
          left: position.x,
          top: position.y,
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
      />
    );
  },
};

const paddle = {
  position: {
    x: width / 2 - 50,
    y: height - 50,
  },
  size: {
    width: 100,
    height: 20,
  },
  renderer: (props) => {
    const { position, size } = props;
    return (
      <View
        style={{
          backgroundColor: "white",
          position: "absolute",
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
        }}
      />
    );
  },
};

const update = (entities, { time }) => {
  const ballEntity = entities.ball;
  const paddleEntity = entities.paddle;


  
    //ball constantly moves
  ballEntity.position.x += ballEntity.velocity.x * time.delta;
  ballEntity.position.y += ballEntity.velocity.y * time.delta;

    // Increase ball speed every 2 seconds
    if (!entities.ball.lastSpeedIncrease || time.current - entities.ball.lastSpeedIncrease >= 2000) {
      entities.ball.velocity.x *= 1.1; // Increase speed by 10%
      entities.ball.velocity.y *= 1.1; // Increase speed by 10%
      entities.ball.lastSpeedIncrease = time.current; // Update last speed increase time
    }

  // Ball collision with walls
  if (
    ballEntity.position.x + ballEntity.size > width ||
    ballEntity.position.x < 0
  ) {
    ballEntity.velocity.x *= -1;
  }

  if (ballEntity.position.y < 0) {
    ballEntity.velocity.y *= -1;
  }

  // Ball collision with paddle
  if (
    ballEntity.position.y + ballEntity.size > paddleEntity.position.y &&
    ballEntity.position.x + ballEntity.size > paddleEntity.position.x &&
    ballEntity.position.x < paddleEntity.position.x + paddleEntity.size.width
  ) {
    ballEntity.velocity.y *= -1;
  }



 // Check if the ball has fallen below the screen and no alert is shown
 if (ballEntity.position.y > height && !entities.alertShown) {
  entities.alertShown = true; // Set the flag to prevent new alerts

  // Trigger an alert
  Alert.alert("Game Over", "You lost", [
    {
      text: "Retry",
      onPress: () => {
        entities.resetRequested = true; // Set a flag to request a reset
      }
    }
  ]);

  // Stop the ball
  ballEntity.velocity.x = 0;
  ballEntity.velocity.y = 0;
}

// Check if a reset is requested
if (entities.resetRequested) {
  resetGame(entities);
  entities.alertShown = false; // Reset the alertShown flag
  entities.resetRequested = false; // Reset the resetRequested flag
}

  return entities;
};

const movePaddle = (entities, { touches }) => {
  touches.filter(t => t.type === 'move').forEach(t => {
    let paddleEntity = entities.paddle;
    if (paddleEntity && paddleEntity.position) {
      paddleEntity.position.x = t.event.pageX - paddleEntity.size.width / 2;
    }
  });

    return entities;
  };

  const timerSystem = (entities, { time }) => {
    const { setTimer } = entities;
    if (!entities.alertShown) {
      setTimer(prevTime => prevTime + time.delta / 1000); // increment timer
    }
  
  
    return entities;
  };
  

  const resetGame = (entities) => {
    // Reset ball position and velocity
    entities.ball.position.x = width / 2 - 25;
    entities.ball.position.y = height / 2 - 25;
    entities.ball.velocity.x = 0.4;
    entities.ball.velocity.y = 0.4;
  
    // Reset paddle position
    entities.paddle.position.x = width / 2 - 50;
    entities.paddle.position.y = height - 50;

     // Reset timer
  entities.setTimer(0);
  
    return entities;
  };

  export default function App() {
    const [gameStarted, setGameStarted] = useState(false);
    const [alertShown, setAlertShown] = useState(false);
    const [timer, setTimer] = useState(0); // New timer state
    const [highScore, setHighScore] = useState(0);
    if (timer > highScore) {
      setHighScore(timer);
    }
  
    if (!gameStarted) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Welcome to the Game!</Text>
          <TouchableOpacity style={styles.playButton} onPress={() => setGameStarted(true)}>
            <Text style={styles.playButtonText}>Play</Text>
          </TouchableOpacity>
        </View>
      );
    }
  
    return (
      <View style={{ flex: 1 }}>
      <Text style={styles.timerText}>Timer: {timer.toFixed(1)}</Text>
      <Text style={styles.highScoreText}>Highscore: {highScore.toFixed(1)}</Text>
      <GameEngine
      systems={[update, movePaddle, timerSystem]} // Add the timer system
      entities={{
        ball: { ...ball, renderer: ball.renderer },
        paddle: { ...paddle, renderer: paddle.renderer },
        alertShown: alertShown,
        setAlertShown: setAlertShown,
        resetRequested: false,
        setTimer: setTimer // Pass the setTimer function
      }}
        style={{ flex: 1, backgroundColor: 'black' }}
      />
        </View>

    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      color: 'white',
      marginBottom: 20,
    },
    playButton: {
      backgroundColor: 'white',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
    },
    playButtonText: {
      color: 'black',
      fontSize: 18,
    },
    timerText: {
      color: 'white',
      fontSize: 20,
      position: 'absolute',
      top: 40,
      alignSelf: 'center',
      zIndex: 1,
    },
    highScoreText: {
      color: 'white',
      fontSize: 20,
      position: 'absolute',
      top: 80,
      alignSelf: 'center',
      zIndex: 1,
    },
  });
  
  
  
  
  
  