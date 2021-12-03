import { Container } from 'semantic-ui-react';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <Container>
      <Navbar />
      {children}
    </Container>
  );
}