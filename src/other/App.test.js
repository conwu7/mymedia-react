import { render, screen } from '@testing-library/react';
import MyMediaListsApp from '../my-media-lists-app';

test('renders learn react link', () => {
  render(<MyMediaListsApp />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
