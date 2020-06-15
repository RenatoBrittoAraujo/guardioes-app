import React from 'react';
import {SafeAreaView} from 'react-native';

import {Container, Background} from './styles';

export default function Inicio() {
  return (
    <>
      <SafeAreaView backgroundColor="#348EAC" />
      <Container>
        <Background />
      </Container>
    </>
  );
}
