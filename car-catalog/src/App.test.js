import { render, screen } from '@testing-library/react';
import App from './components/App';

test('renders the header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Car Catalog/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders the footer', () => {
  render(<App />);
  const footerElement = screen.getByText(/© 2023 Car Catalog/i);
  expect(footerElement).toBeInTheDocument();
});