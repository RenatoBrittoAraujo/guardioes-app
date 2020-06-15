import styled from 'styled-components';

import Spinner from 'react-native-spinkit';

export default styled(Spinner).attrs({
    type: "ThreeBounce",
    color: "#ffffff",
    size: 80
})`
    position: absolute;
    bottom: 0;
    margin-bottom: 15%;
`;