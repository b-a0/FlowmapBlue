import React, { useState } from 'react'
import Nav from './Nav';
import styled from '@emotion/styled';
import { Button, Classes, H5, Intent, TextArea } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Switch, Route, useHistory } from 'react-router-dom';
import { dsvFormat } from 'd3-dsv';
import { Location as HistoryLocation } from 'history'
import { Location, Flow } from './types';
import FlowMap from './FlowMap';
import { PromiseState } from 'react-refetch';
import { DEFAULT_CONFIG } from './config';
import MapContainer from './MapContainer';

interface Props {
  location: HistoryLocation<{
    locations: Location[];
    flows: Flow[];
  }>;
}

const FlowMapContainer = (props: Props) => {
  const { flows, locations } = props.location.state;
  return (
    <MapContainer>
      <FlowMap
        flowsFetch={PromiseState.resolve(flows)}
        locationsFetch={PromiseState.resolve(locations)}
        config={DEFAULT_CONFIG}
        spreadSheetKey={undefined}
      />
    </MapContainer>
  )
}

const ContentBody = styled.div`
  padding: 30px 30px;
  & h1 { font-size: 2rem; }
  & li { margin: 0.5em 0; }
  margin: auto;
  max-width: 1500px;
`

const ButtonArea = styled.div`
  text-align: right;
`

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: min-content 1fr min-content;
  column-gap: 1rem;
  row-gap: 0.5rem;
  align-items: center;
  & > textarea {
    min-height: 350px;
    height: 100%;
    font-size: 12px !important; 
    white-space: pre;
    font-family: monospace;
  }
`


const InBrowserFlowMap = () => {
  const [locationsCsv, setLocationsCsv] = useState(
    `id\tname\tlat\tlon
1\tNew York\t40.713543\t-74.011219
2\tLondon\t51.507425\t-0.127738
3\tRio de Janeiro\t-22.906241\t-43.180244`
  )
  const [flowsCsv, setFlowsCsv] = useState(
    `origin\tdest\tcount
1\t2\t42
2\t1\t51
3\t1\t50
2\t3\t40
1\t3\t22
3\t2\t42`
  )
  const history = useHistory()
  const handleVisualize = () => {
    history.push('/in-browser/visualize', {
      locations: dsvFormat('\t').parse(locationsCsv,
        (row: any) => ({
          ...row,
          lat: +row.lat,
          lon: +row.lon,
        })
      ),
      flows: dsvFormat('\t').parse(flowsCsv),
    })
  }
  return (
    <Switch>
      <Route
        path="/in-browser/visualize"
        component={FlowMapContainer}
      />
      <>
        <Nav />
        <ContentBody className={Classes.DARK}>
          <h1>In-browser flow map</h1>
          <section>
            <p>
              Visualize OD-data as a flow map directly in your browser
              without the need to upload it to Google Sheets.
              Your data will remain in your browser and <i>will not be uploaded anywhere</i>.
              Note that the visualization will be lost as soon as you close the browser window with it.
              There will be no URL to come back to or to share with other people.
            </p>
          </section>
          <Container>
            <H5>Locations TSV (tab-separated values)</H5>
            <H5>Flows TSV</H5>
            <TextArea
              growVertically={false}
              large={true}
              intent={Intent.PRIMARY}
              onChange={event => setLocationsCsv(event.target.value)}
              value={locationsCsv}
            />
            <TextArea
              growVertically={false}
              large={true}
              intent={Intent.PRIMARY}
              onChange={event => setFlowsCsv(event.target.value)}
              value={flowsCsv}
            />
          </Container>
          <ButtonArea>
            <Button
              icon={IconNames.CHART}
              large={true}
              onClick={handleVisualize}
            >Visualize</Button>
          </ButtonArea>
        </ContentBody>
      </>
    </Switch>
  )
}

export default InBrowserFlowMap
