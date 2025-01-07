import React from 'react';
import { render } from '@testing-library/react';
import Garden from '../../components/Garden';

test('renders tasks in the garden', () => {
    const tasks = [
        { _id: '1', description: 'Task 1' },
        { _id: '2', description: 'Task 2' },
    ];
    const { getByText } = render(<Garden tasks={tasks} />);

    expect(getByText('🌱 Task 1')).toBeInTheDocument();
    expect(getByText('🌱 Task 2')).toBeInTheDocument();
});
