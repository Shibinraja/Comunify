import React from 'react';
import Chart from 'react-apexcharts';

const MembersProfileGraph = () => {
    const series = [
        { name: 'Estimate', data: [10, 15, 4, 12, 17] },
        { name: 'Actual', data: [12, 10, 12, 5, 12] },
    ];
    const options = {};

    return (
        <div>
            <Chart options={options} type="line" series={series} width="100%" height="100%" />
        </div>
    );
};

export default MembersProfileGraph;
