import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';
import axios from 'axios';

jest.mock('axios');

test('adds a task and displays it in the garden', async () => {
    axios.get.mockResolvedValue({ data: [] });
    axios.post.mockResolvedValue({
        data: { _id: '1', description: 'New Task' },
    });

    const { getByPlaceholderText, getByText } = render(<App />);

    fireEvent.change(getByPlaceholderText('What did you accomplish?'), {
        target: { value: 'New Task' },
    });
    fireEvent.click(getByText('Add'));

    await waitFor(() => expect(getByText('🌱 New Task')).toBeInTheDocument());
});
