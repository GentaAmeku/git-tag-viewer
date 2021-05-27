import { Header, Icon, Segment, Grid, Dimmer, Loader } from 'semantic-ui-react';

import { container } from './styles';

const Initialize = ({ isLoading }) => {
  return (
    <Segment css={container}>
      {isLoading ? (
        <Dimmer active>
          <Loader size="large">Loading</Loader>
        </Dimmer>
      ) : (
        <Grid columns="equal">
          <Grid.Column>
            <Icon name="folder" size="big"></Icon>
          </Grid.Column>
          <Grid.Column width={13}>
            <Header as="h1">File &gt; Open</Header>
          </Grid.Column>
        </Grid>
      )}
    </Segment>
  );
};

export default Initialize;
