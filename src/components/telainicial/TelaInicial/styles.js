import styled from 'styled-components';

import { scale } from '../../../utils/scallingUtils';

export const Logo = styled.Image`
    height: ${scale(160)}px;
    resize-mode: contain;
`;

export const WelcomeText = styled.Text`
    font-family: ArgentumSans-SemiBold;
    font-size: 20px;
    color: #fff;
    margin-top: 2%;
    margin-bottom: 20%;
`;

export const Label = styled.Text`
    font-family: ArgentumSans-Medium;
    font-size: 18px;
    color: #32323b;
`;