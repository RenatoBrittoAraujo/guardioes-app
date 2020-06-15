import React from 'react';
import {SafeAreaView} from 'react-native';

import {
  Container,
  Background,
  StatusContainer,
  Text,
  StatusBemMal,
  StatusText,
  Bem,
  Mal,
} from './styles';

export default function Inicio() {
  return (
    <>
      <SafeAreaView backgroundColor="#348EAC" />
      <Background />
      <Container>
        <StatusContainer>
          <Text>Como está se sentindo hoje?</Text>
          <StatusBemMal>
            <Bem>
              <StatusText>BEM</StatusText>
            </Bem>

            <Mal>
              <StatusText>MAL</StatusText>
            </Mal>
          </StatusBemMal>
        </StatusContainer>
      </Container>
    </>
  );
}
