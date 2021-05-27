import {
  Icon,
  Table as SemanticUiTable,
  Input,
  Button,
  Grid,
  Segment,
} from 'semantic-ui-react';
import { head } from 'lodash';
import Accordion from '../Accordion/container';

const { Header, HeaderCell, Row, Cell, Body } = SemanticUiTable;

const Table = ({
  repos,
  branch,
  branchRef,
  handleClickApply,
  handleClickApplyWithFetch,
}) => (
  <SemanticUiTable celled>
    <Header>
      <Row>
        <HeaderCell>Repository</HeaderCell>
        <HeaderCell colSpan="3">
          <Grid columns="equal">
            <Grid.Column width={6}>
              <Input
                placeholder="Branch..."
                icon="code branch"
                iconPosition="left"
                ref={branchRef}
                fluid
              />
            </Grid.Column>
            <Grid.Column width={2}>
              <Button color="green" onClick={handleClickApply} fluid>
                Apply
              </Button>
            </Grid.Column>
            <Grid.Column width={3}>
              <Button color="blue" onClick={handleClickApplyWithFetch} fluid>
                Apply with Fetch
              </Button>
            </Grid.Column>
          </Grid>
        </HeaderCell>
      </Row>
    </Header>
    <Body>
      {repos.map(({ name, tag, isWarning, log }) => (
        <Row key={name}>
          <Cell collapsing error={isWarning}>
            <Icon name="folder" /> {name}
          </Cell>
          <Cell collapsing error={isWarning}>
            <Icon name="code branch" /> {branch}
          </Cell>
          <Cell error={isWarning}>
            {tag && (
              <>
                <Icon name="tag" /> {tag}
              </>
            )}
          </Cell>
          <Cell error={isWarning}>
            {log && (
              <>
                <Accordion title={head(log)}>
                  <Segment inverted>
                    {log.map((v, i) => (
                      <p key={i}>{v}</p>
                    ))}
                  </Segment>
                </Accordion>
              </>
            )}
          </Cell>
        </Row>
      ))}
    </Body>
  </SemanticUiTable>
);

export default Table;
