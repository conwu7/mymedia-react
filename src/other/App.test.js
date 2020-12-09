import { render, screen } from '@testing-library/react';
import MyMediaApp from '../my-media-app';

test('renders learn react link', () => {
  render(<MyMediaApp />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
