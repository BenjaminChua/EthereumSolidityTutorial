import Link from 'next/link';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';

export async function getStaticProps() {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return {
    props: { campaigns }, // will be passed to the page component as props
  };
}

function HomePage({ campaigns }) {
  const items = campaigns.map(address => {
    return {
      header: address,
      description: <Link href={`/campaigns/${address}`}>View Campaign</Link>,
      fluid: true
    };

  });
  return (
    <>
      <h3> Open campaigns </h3>
      <Link href='/campaigns/new' >
        <Button floated="right" content='Create Campaign' icon='add circle' primary />
      </Link>
      <Card.Group items={items} />
    </>
  );
}

export default HomePage;