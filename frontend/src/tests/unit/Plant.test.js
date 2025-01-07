import React from 'react';
import { render } from '@testing-library/react';
import Plant from '../../components/Plant';

test('does not render plant when task count is zero', () => {
    const { queryByAltText } = render(<Plant taskCount={0} />);
    expect(queryByAltText('Growing Plant')).toBeNull();
});

