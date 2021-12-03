import { useRouter } from 'next/router';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import createCampaignInstance from '../ethereum/campaign';

export default function RequestRow({ request, id, campaignAdd, numContributors }) {
  const router = useRouter();
  const { Row, Cell } = Table;

  const onApprove = async () => {
    const campaign = createCampaignInstance(campaignAdd);
    const accounts = await web3.eth.getAccounts();

    await campaign.methods.approveRequest(id).send({
      from: accounts[0]
    });

    router.push(`/campaigns/${campaignAdd}/requests`);
  };

  const onIssuePayment = async () => {
    const campaign = createCampaignInstance(campaignAdd);
    const accounts = await web3.eth.getAccounts();

    await campaign.methods.issuePayment(id).send({
      from: accounts[0]
    });

    router.push(`/campaigns/${campaignAdd}/requests`);
  };

  return (
    <Row positive={request.paymentIssued}>
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
      <Cell>{request.recipient}</Cell>
      <Cell>{request.approversCount}/{numContributors}</Cell>
      <Cell>
        <Button positive disabled={request.paymentIssued} onClick={onApprove}>Approve</Button>
      </Cell>
      <Cell>
        <Button color='orange' onClick={onIssuePayment} disabled={request.paymentIssued}>Issue</Button>
      </Cell>
      <Cell> {request.paymentIssued ? 'Payment Issued' : 'Pending Approval/Issuance'} </Cell>
    </Row>
  );
}