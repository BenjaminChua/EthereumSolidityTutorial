import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Input, Form, Message } from 'semantic-ui-react';
import createCampaignInstance from '../ethereum/campaign';
import web3 from '../ethereum/web3';

export default function ContributeForm({ campaignAdd }) {
  const router = useRouter();
  const [contribution, setContribution] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendContribution = async e => {
    e.preventDefault();

    setLoading(true);

    // if there was an error, reset it
    if (!!error) {
      setError('');
    }

    const campaign = createCampaignInstance(campaignAdd);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(contribution, 'ether')
      });

      setLoading(false);

      router.push(`/campaigns/${campaignAdd}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={sendContribution} error={!!error}>
      <Form.Field>
        <label> Amount to Contribute </label>
        <Input
          label='ether'
          labelPosition='right'
          placeholder='0.001'
          value={contribution}
          onChange={e => setContribution(e.target.value)}
        />
      </Form.Field>
      <Message error header='Error occured when contributing' content={error} />
      <Button primary loading={loading}>Contribute</Button>
    </Form>
  );
}