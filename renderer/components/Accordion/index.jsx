import {
  Accordion as SemanticUiAccordion,
  Icon,
  Segment,
} from 'semantic-ui-react';

const { Title, Content } = SemanticUiAccordion;
import { segmentContainer } from './styles';

const Accordion = ({ title, isActive, handleClick, children }) => (
  <SemanticUiAccordion>
    <Title active={isActive} index={0} onClick={handleClick}>
      <Segment css={segmentContainer}>
        <Icon name="dropdown" />
        {title}
      </Segment>
    </Title>
    <Content active={isActive}>{children}</Content>
  </SemanticUiAccordion>
);

export default Accordion;
