import Link from 'next/link';
import { Card, Grid, Button } from 'semantic-ui-react';
import factory from '../../../ethereum/factory';
import web3 from '../../../ethereum/web3';
import createCampaignInstance from '../../../ethereum/campaign';
import ContributeForm from '../../../components/ContributeForm';

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const campaigns = await factory.methods.getDeployedCampaigns().call();

  // Get the paths we want to pre-render based on campaigns
  const paths = campaigns.map(address => ({
    params: { campaignAdd: address },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const campaign = createCampaignInstance(params.campaignAdd);

  const campaignSummary = await campaign.methods.getSummary().call();

  const [minimumContribution, balance, numReq, numContributors, manager] = Object.values(campaignSummary);

  return {
    // will be passed to the page component as props
    props: {
      minimumContribution,
      balance,
      numReq,
      numContributors,
      manager,
      campaignAdd: params.campaignAdd
    },
  };
}

function viewCampaign({ minimumContribution, balance, numReq, numContributors, manager, campaignAdd }) {
  const items = [
    {
      header: manager,
      meta: 'Address of Manager',
      description: ' The manager created this campaign and can create payment requests',
      style: { overflowWrap: 'break-word' }
    },
    {
      header: minimumContribution,
      meta: 'Minimum Contribution (wei)',
      description: 'You must contribute at least this much wei to be an approver of payment requests'
    },
    {
      header: numReq,
      meta: 'Total number of Requests',
      description: 'A request to withdraw money from the contract. Requests must be approved by approvers'
    },
    {
      header: numContributors,
      meta: 'Number of Approvers',
      description: 'Number of contributors who have the ability to approve payment requests from the manager'
    },
    {
      header: web3.utils.fromWei(balance, 'ether'),
      meta: 'Campaign Balance (ether)',
      description: 'The balance is how much money this campaign has gathered'
    }
  ];
  return (
    <>
      <h3> Campaign {campaignAdd}</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Card.Group items={items} />
          </Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm campaignAdd={campaignAdd} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${campaignAdd}/requests`}>
              <Button primary>View Requests</Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
}

export default viewCampaign;