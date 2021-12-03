import Link from 'next/link';
import { Table, Button } from 'semantic-ui-react';
import createCampaignInstance from '../../../../ethereum/campaign';
import RequestRow from '../../../../components/RequestRow';

export async function getServerSideProps({ params }) {
  const { campaignAdd } = params;

  const campaign = createCampaignInstance(campaignAdd);
  const numRequests = await campaign.methods.numRequests().call();
  const numContributors = await campaign.methods.numContributors().call();

  const requests = await Promise.all(
    Array(parseInt(numRequests)).fill().map((_elem, idx) => {
      return campaign.methods.requests(idx).call();
    })
  );

  const formattedRequest = requests.map(({ description, value, recipient, paymentIssued, approversCount }) => {
    return { description, value, recipient, paymentIssued, approversCount };
  });

  return {
    // will be passed to the page component as props
    props: {
      campaignAdd,
      requests: formattedRequest,
      numContributors,
      numRequests
    },
  };
}

export default function Requests({ campaignAdd, requests, numContributors, numRequests }) {
  const { Header, Row, HeaderCell, Body } = Table;

  const RequestRows = requests.map((request, idx) => {
    return <RequestRow request={request} key={idx} id={idx} campaignAdd={campaignAdd} numContributors={numContributors} />;
  });

  return (
    <>
      <h3> Requests </h3>
      <Link href={`/campaigns/${campaignAdd}/requests/new`}>
        <Button primary floated='right' style={{ marginBottom: '10px' }}> Add Request </Button>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount (ether)</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Issue Payment</HeaderCell>
            <HeaderCell>Status</HeaderCell>
          </Row>
        </Header>
        <Body>
          {RequestRows}
        </Body>
      </Table>
      <div>Found {numRequests} requests </div>
    </>
  );
}