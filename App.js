import React,{useState, useEffect} from 'react';
import { Dimensions, View, Button, StyleSheet } from 'react-native';
import { GameEngine } from 'react-native-game-engine';


export default function App() {
  const { width, height } = Dimensions.get('window')
  const [items, setItems] = useState({
    1:createBall( 10, 20)
  })
  const ball2 = createBall( 100, 200)

  useEffect(() => {
    console.log("useEffect, entities :", items);
  }, [items]);

  console.log("window size: ", width, height)
  
  function createBall( x, y){
    return {
      position: {
        x: width/2 - 25,
        y: height/2 - 25,
      },
      size: 50,
      velocity: {
        x: 0.1,
        y: 0.1,
      },
      renderer: function(props) { // Now using a regular function syntax
        const { position, size } = props;
        return (
          <View
            style={{
              backgroundColor: 'red',
              position: 'absolute',
              left: position.x,
              top: position.y,
              width: size,
              height: size,
              borderRadius: size / 2,
            }}
          ></View>
        );
      },
    }
  }

  const addBall = () => {
    // Create the new ball entity
    const newBallId = Object.keys(items).length + 1;
    console.log("addBall() newKey: ", newBallId)
    const newBall = createBall( Math.random() * width, Math.random() * height)
    console.log(newBall)
    // Update the state to include the new ball
    setItems({
      ...items, 
      [newBallId]:newBall,
    }); // cann't call print on entities, because it's async
  };

const update = (entities, { time }) => {
      //console.log("Entities ", entities)
      const ballEntity = entities.ball2;
    
      ballEntity.position.x += ballEntity.velocity.x * time.delta;
      ballEntity.position.y += ballEntity.velocity.y * time.delta;
    
      if (ballEntity.position.x + ballEntity.size > width || ballEntity.position.x < 0) {
        ballEntity.velocity.x *= -1;
      }
    
      if (ballEntity.position.y + ballEntity.size > height || ballEntity.position.y < 0) {
        ballEntity.velocity.y *= -1;
      }
  
    return entities;
  };
  
  // const update = (entities, { time }) => {
  //   // Delta time since last update
  //   const delta = time.delta;
  
  //   // Iterate over all entities and update those that are balls
  //  //console.log("in update: ",entities)

  //   Object.keys(entities).forEach(key => {
  //    // console.log("inside update time:" , time, "key: ", key)
  //     if (entities[key].renderer) {
  //       // Assuming that entities with a renderer are balls
  //       const ball = entities[key];
  
  //       // Update the position based on velocity and delta time
  //       ball.position.x += ball.velocity.x * delta;
  //       ball.position.y += ball.velocity.y * delta;
  
  //       // Implement collision detection with boundaries if necessary
  //       // For example, if the ball hits the edge of the screen, it could bounce
  //       // This is just a placeholder for your logic
  //       if (ball.position.x + ball.size > width || ball.position.x < 0) {
  //         console.log("change direction ", ball.position.x)
  //         ball.velocity.x *= -1; // Reverse direction on X axis
  //       }
  //       if (ball.position.y > height - ball.size || ball.position.y < 0) {
  //         ball.velocity.y = -ball.velocity.y; // Reverse direction on Y axis
  //       }
  //     }
  //   });
  
  //   return entities;
  // };
console.log("before return ", items)
  return (
    <View style={styles.container}>
      <GameEngine
        key={Object.keys(items).length} // Change key to force re-render on items change
        entities={{ball2}}
        systems={[update]}
        style={{ flex: 1, backgroundColor: 'white' }}
      />
      <Button title="Add Ball" onPress={addBall} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
