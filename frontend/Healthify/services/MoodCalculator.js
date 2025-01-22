import Icon from 'react-native-vector-icons/FontAwesome';
import { View } from 'react-native';
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
      if (mood < 25) {
        moodIcon = <Icon name="frown-o" size={30} color="#e74c3c" />; 
      } else if (mood <= 50) {
        moodIcon = <Icon name="meh-o" size={30} color="#f1c40f" />; 
      } else if (mood <= 75) {
        moodIcon = <Icon name="smile-o" size={30} color="#2ecc71" />; 
      } else {
        moodIcon = <Icon name="smile-o" size={30} color="#2ecc71" />; 
      }
      return (
        <View>
          {moodIcon}
        </View>
      );
  }
