import theme from '@/constants/theme';
import { faDumbbell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const HumbleH = ({fontSize}: any) => (
  <FontAwesomeIcon 
    icon={faDumbbell} 
    size={fontSize}
    style={{
      transform: [{ scaleY: 1.2 }],
      marginHorizontal: 2,
      marginBottom: -4,
    }}
    color={theme.colors.text}
  />
);

export default HumbleH;
