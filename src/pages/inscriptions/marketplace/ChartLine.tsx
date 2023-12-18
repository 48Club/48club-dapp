import { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';
import axios from 'axios';

const ChartLine = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        asyncFetch();
    }, []);

    const asyncFetch = () => {
        axios.get('https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json')
            .then((response) => response.data)
            .then((json) => setData(json))
            .catch((error) => {
                console.log('fetch data failed', error);
            });
    };

    const config: any = {
        data,
        xField: 'Date',
        yField: 'scales',
        tooltip: {
            // showMarkers: false,
            marker: {
                fill: 'black'
            },
            formatter: () => {
                return { name: 1, value: 2 + '%' };
            },
            customContent: (title: string, data: any) => {
                console.log(data, 'data')
                return `<div style="padding: 10px;">${title}-${data[0]?.value}</div>`;
            }
        },
        animation: {
            appear: {
                animation: 'path-in',
                duration: 1000,
            },
        },
        annotations: [
            {
                type: 'line',
                start: ['min', 'median'],
                end: ['max', 'median'],
                style: {
                    stroke: 'black',
                    fillOpacity: 0.6,
                },
            },
            {
                type: 'line',
                offsetY: 40,
                start: ['min', 'median'],
                end: ['max', 'median'],
                text: {
                    content: '中位线',
                    position: 'right',
                    offsetY: 18,
                    style: {
                        fill: '#C0EA04',
                        textAlign: 'right',
                    },
                },
                style: {
                    stroke: '#C0EA04',
                },
            },
        ],
        lineStyle: {
            fillOpacity: 0.5,
            stroke: 'black',
            lineWidth: 2,
            cursor: 'pointer'
        },
        yAxis: {
            tickLine: null,
            position: "right",
            grid: {
                line: {
                    style: {
                        stroke: 'black',
                        lineWidth: 1,
                        strokeOpacity: 0.04,
                        cursor: 'pointer'
                    }
                },
            },
            label: {
                style: {
                    fill: "black",
                    fontSize: 10
                }
            },
        },
        xAxis: {
            tickLine: null,
            tickCount: 0,
            line: {
                style: {
                    stroke: 'black',
                    lineWidth: 1,
                    strokeOpacity: 0.04,
                    cursor: 'pointer'
                },
            },
        }
    };

    return <Line {...config} />;
};

export default ChartLine;