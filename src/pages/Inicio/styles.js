import styled from 'styled-components/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

export const Container = styled.View`
  flex: 1;
`;

export const Background = styled(LinearGradient).attrs({
  colors: ['#348eac', '#5DD39E'],
})`
  height: 50%;
  border-bottom-left-radius: 50;
  border-bottom-right-radius: 50;
  flex: 1;
`;

export const StatusContainer = styled.View`
  background: white;
  border-radius: 20;

  margin-right: 30px;
  margin-left: 30px;

  padding: 30px;
  padding-bottom: 30px;

  align-items: center;

  shadow-color: #000;
  shadow-offset: {width: 0, height: 4};
  shadow-opacity: 0.30;
  shadow-radius: 4.65;

  elevation: 8;
`;

export const Text = styled.Text`
  margin-bottom: 20px;

  font-weight: bold;
  font-size: 18px;
`;

export const StatusBemMal = styled.View`
  align-self: center;
  flex-direction: row;
`;

export const Bem = styled(TouchableOpacity)`
  height: 60px;
  width: 120px;
  background: #348eac;
  border-bottom-left-radius: 22;
  border-top-left-radius: 22;

  margin-right: 3px;

  align-items: center;
  justify-content: center;

  shadow-color: #348eac;
  shadow-offset: {width: 0, height: 4};
  shadow-opacity: 0.30;
  shadow-radius: 4.65;

  elevation: 8;
`;

export const Mal = styled(TouchableOpacity)`
  height: 60px;
  width: 120px;
  background: #f18f01;
  border-bottom-right-radius: 22;
  border-top-right-radius: 22;

  margin-left: 3px;

  align-items: center;
  justify-content: center;

  shadow-color: #f18f01;
  shadow-offset: {width: 0, height: 4};
  shadow-opacity: 0.30;
  shadow-radius: 4.65;

  elevation: 8;
`;

export const StatusText = styled.Text`
  font-weight: bold;
  color: white;
  font-size: 16px;
`;
