import React from 'react';
import { ProgressProviderProps } from './progressProviderTypes';

const ProgressProvider: React.FC<ProgressProviderProps> = ({ valueStart, valueEnd, children }) => {
    const [value, setValue] = React.useState(valueStart);
    React.useEffect(() => {
        setValue(valueEnd);
    }, [valueEnd]);

    return children(value);
};
export default ProgressProvider;
