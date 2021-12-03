import Link from 'next/link';
import { Menu, Button } from 'semantic-ui-react';

export default function Navbar() {

  return (
    <Menu style={{ marginTop: '10px' }}>
      <Link href='/'>
        <Menu.Item
          name='CrowdCoin'
        />
      </Link>
      <Link href='/'>
        <Menu.Item
          name='Campaigns'
        />
      </Link>
      <Menu.Menu position='right'>
        <Menu.Item>
          <Link href='/campaigns/new' >
            <Button icon='add' />
          </Link>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}