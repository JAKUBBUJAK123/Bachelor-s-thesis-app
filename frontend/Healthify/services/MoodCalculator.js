import Icon from 'react-native-vector-icons/FontAwesome';
import { View , StyleSheet, Text } from 'react-native';
const normalize = (value, min, max) => (value - min) / (max - min);

export const calculateMoodScore = (steps, totalDistance, burnedKcal, calories, fat, protein, carbs) => {
  const normalizedSteps = normalize(steps, 0, 20000); 
  const normalizedDistance = normalize(totalDistance, 0, 20);
  const normalizedBurnedKcal = normalize(burnedKcal, 0, 1000); 
  const normalizedCalories = normalize(calories, 0, 3000); 
  const normalizedFat = normalize(fat, 0, 100); 
  const normalizedProtein = normalize(protein, 0, 200); 
  const normalizedCarbs = normalize(carbs, 0, 400);

  const weightSteps = 0.2;
  const weightDistance = 0.2;
  const weightBurnedKcal = 0.2;
  const weightCalories = 0.1;
  const weightFat = 0.1;
  const weightProtein = 0.1;
  const weightCarbs = 0.1;


  const moodScore = 
    (normalizedSteps * weightSteps) +
    (normalizedDistance * weightDistance) +
    (normalizedBurnedKcal * weightBurnedKcal) +
    (normalizedCalories * weightCalories) +
    (normalizedFat * weightFat) +
    (normalizedProtein * weightProtein) +
    (normalizedCarbs * weightCarbs);
    
  return Math.round(moodScore*100) ;
};


    export const MoodComponent = ({ mood }) => {
      let moodIcon;
      let text;
      if (mood < 25) {
        moodIcon = <Icon name="frown-o" size={30} color="#e74c3c" />;
        text = "You're just getting started! Every step counts!";
      } else if (mood <= 50 && mood >= 25) {
        moodIcon = <Icon name="meh-o" size={30} color="#f1c40f" />;
        text = "You're making progress! Keep pushing forward!";
      } else if (mood <= 75 && mood > 50) {
        moodIcon = <Icon name="smile-o" size={30} color="#2ecc71" />;
        text = "You're doing fantastic! Keep up the great work!";
      } else {
        moodIcon = <Icon name="smile-o" size={30} color="#2ecc71" />;
        text = "You're absolutely crushing it! Keep shining!";
      }
      return (
        <View style={style.moodIcon}>
          {moodIcon}
          <Text style={style.text}>{text}</Text>
        </View>
      );
    };
    
    const style = StyleSheet.create({
      moodIcon: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        maxWidth: '80%'
      },
      text: {
        fontSize: 15,
        color: '#fff',
        marginLeft: 10,
        fontWeight: '300'
      },
    });