import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Input, Form, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

function newCampaign() {
  const router = useRouter();
  const [minContribution, setMinContribution] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onCreateCampaignFormSubmit = async e => {
    e.preventDefault();

    setLoading(true);

    // if there was an error, reset it
    if (!!error) {
      setError('');
    }

    try {
      const accounts = await web3.eth.getAccounts();

      await factory.methods.createCampaign(minContribution).send({ from: accounts[0] });

      const campaigns = await factory.methods.getDeployedCampaigns().call();

      setLoading(false);

      router.push(`/campaigns/${campaigns[campaigns.length - 1]}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <h3> Create Campaign</h3>
      <Form onSubmit={onCreateCampaignFormSubmit} error={!!error}>
        <Form.Field>
          <label>Minimum Contribution in Wei</label>
          <Input
            label='wei'
            labelPosition='right'
            placeholder='100'
            value={minContribution}
            onChange={e => setMinContribution(e.target.value)}
          />
        </Form.Field>
        <Message error header='Error occured when creating Campaign' content={error} />
        <Button primary loading={loading}>Create</Button>
      </Form>
    </>
  );
};

export default newCampaign;