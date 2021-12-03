import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import createCampaignInstance from '../../../../ethereum/campaign';
import web3 from '../../../../ethereum/web3';

export default function NewRequest() {
  const router = useRouter();
  const { campaignAdd } = router.query;

  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createRequest = async e => {
    e.preventDefault();

    setLoading(true);

    // if there was an error, reset it
    if (!!error) {
      setError('');
    }

    const campaign = createCampaignInstance(campaignAdd);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.createRequest(
        description,
        web3.utils.toWei(value, 'ether'),
        recipient
      ).send({
        from: accounts[0]
      });

      setLoading(false);

      router.push(`/campaigns/${campaignAdd}/requests`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <h3> Create a Request </h3>
      <Form onSubmit={createRequest} error={!!error}>
        <Form.Field>
          <label> Description </label>
          <Input
            placeholder='Enter Description'
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label> Value (ether) </label>
          <Input
            label='ether'
            labelPosition='right'
            placeholder='0.001'
            value={value}
            onChange={e => setValue(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label> Recipient </label>
          <Input
            placeholder='0x00000000'
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
          />
        </Form.Field>
        <Message error header='Error occured when creating Payment Request' content={error} />
        <Button primary loading={loading}>Create</Button>
        <Link href={`/campaigns/${campaignAdd}/requests`}>
          <Button secondary type='text'>Cancel</Button>
        </Link>
      </Form>
    </>
  );
}