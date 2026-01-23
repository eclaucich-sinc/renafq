import React from 'react';
import { shallow } from 'enzyme';
import NotFound from '../NotFound';

it('renders without crashing', () => {
    shallow(<NotFound />);
});