import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';

export const Container = styled.View`
  height: 50%;
`;

export const Background = styled(LinearGradient).attrs({
  colors: ['#348eac', '#5DD39E'],
})`
  border-bottom-left-radius: 50;
  border-bottom-right-radius: 50;
  flex: 1;
`;
