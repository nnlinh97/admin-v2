import React, { Component } from 'react';
import { Doughnut, Bar, Line, Pie } from 'react-chartjs-2';
import ReactTable from 'react-table';
import { apiPost } from '../../services/api';
import { formatCurrency } from './../../helper/';
import 'react-table/react-table.css';
import './index.css';

const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
const trimesters = ['Qúy 1', 'Qúy 2', 'Qúy 3', 'Qúy 4'];
const colorMonths = [
    'rgba(54, 162, 235, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(54, 162, 235, 0.6)'
];
const colorTrimesters = [
    'rgba(54, 162, 235, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(54, 162, 235, 0.6)'
];

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: {},
            year: 2019,
            label: 'month',
            text: 'Biểu đồ doanh thu theo tháng năm 2019',
            table: []
        }
    }

    async componentDidMount() {
        const { label, year } = this.state;
        try {
            let chartData = await apiPost('/admin/statistics', { time: label, year: year });
            chartData = chartData.data.data;
            const data = this.data(chartData);
            let backgroundColor = [];
            let labels = {};
            if (label === 'month') {
                labels = months;
                backgroundColor = colorMonths;
            }
            if (label === 'quarters') {
                labels = trimesters;
                backgroundColor = colorTrimesters;
            }
            this.setState({
                chartData: {
                    labels,
                    datasets: [
                        {
                            label: 'VND',
                            data,
                            backgroundColor
                        }
                    ]
                },
                table: chartData
            });
        } catch (error) {
        }
    }

    getDataChart = () => {
        this.setState({
            chartData: {
                labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
                datasets: [
                    {
                        label: 'VND',
                        data: [
                            617594,
                            181045,
                            153060,
                            106519,
                            105162,
                            90000,
                            617594,
                            181045,
                            153060,
                            106519,
                            105162,
                            90000
                        ],
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(54, 162, 235, 0.6)'
                        ]
                    }
                ]
            }
        });
    }

    data = (array) => {
        let result = [];
        array.forEach(item => {
            result.push(item.total_proceeds - item.total_spents)
        });
        return result;
    }

    prepairDataChart = async (labels, year) => {
        try {
            let chartData = await apiPost('/admin/statistics', { time: labels, year: year });
            chartData = chartData.data.data;
            console.log(chartData)
            const data = this.data(chartData);
            let backgroundColor = [];
            if (labels === 'month') {
                labels = months;
                backgroundColor = colorMonths;
            }
            if (labels === 'quarters') {
                labels = trimesters;
                backgroundColor = colorTrimesters;
            }
            return {
                labels,
                datasets: [
                    {
                        label: 'VND',
                        data,
                        backgroundColor
                    }
                ]
            }
        } catch (error) {
        }
    }

    handleChangeYear = async ({ target }) => {
        const year = target.value;
        try {
            let chartData = await apiPost('/admin/statistics', { time: this.state.label, year: year });
            chartData = chartData.data.data;
            const data = this.data(chartData);
            let backgroundColor = [];
            let labels = {};
            if (this.state.label === 'month') {
                labels = months;
                backgroundColor = colorMonths;
            }
            if (this.state.label === 'quarters') {
                labels = trimesters;
                backgroundColor = colorTrimesters;
            }
            this.setState({
                year: year,
                chartData: {
                    labels,
                    datasets: [
                        {
                            label: 'VND',
                            data,
                            backgroundColor
                        }
                    ]
                },
                table: chartData,
                text: this.state.label === 'month' ? ('Biểu đồ doanh thu theo tháng năm ' + year) : ('Biểu đồ doanh thu theo quý năm ' + year),
            });
        } catch (error) {
        }
    }

    handleChangeTime = async ({ target }) => {
        const label = target.value;
        try {
            let chartData = await apiPost('/admin/statistics', { time: label, year: this.state.year });
            chartData = chartData.data.data;
            const data = this.data(chartData);
            let backgroundColor = [];
            let labels = {};
            if (label === 'month') {
                labels = months;
                backgroundColor = colorMonths;
            }
            if (label === 'quarters') {
                labels = trimesters;
                backgroundColor = colorTrimesters;
            }
            this.setState({
                label: label,
                chartData: {
                    labels,
                    datasets: [
                        {
                            label: 'VND',
                            data,
                            backgroundColor
                        }
                    ]
                },
                table: chartData,
                text: label === 'month' ? ('Biểu đồ doanh thu theo tháng năm ' + this.state.year) : ('Biểu đồ doanh thu theo quý năm ' + this.state.year),
            });
        } catch (error) {
        }
    }

    render() {
        const columnsMonth = [
            {
                Header: "Thời gian",
                Cell: props => <p>{'Tháng ' + (props.index + 1)}</p>,
                style: { textAlign: 'center' },
            },
            {
                Header: "Thu",
                accessor: "total_proceeds",
                Cell: props => <p>{formatCurrency(props.original.total_proceeds)}</p>,
                style: { textAlign: 'center' }
            },
            {
                Header: "Chi",
                accessor: "total_spents",
                Cell: props => <p>{formatCurrency(props.original.total_spents)}</p>,
                style: { textAlign: 'center' }
            },
            {
                Header: "Tổng",
                accessor: "total_spents",
                Cell: props => <p>{formatCurrency(props.original.total_proceeds - props.original.total_spents)}</p>,
                style: { textAlign: 'center' }
            }
        ];

        const columnsQuy = [
            {
                Header: "Thời gian",
                Cell: props => <p>{'Quý ' + (props.index + 1)}</p>,
                style: { textAlign: 'center' },
            },
            {
                Header: "Thu",
                accessor: "total_proceeds",
                Cell: props => <p>{formatCurrency(props.original.total_proceeds)}</p>,
                style: { textAlign: 'center' }
            },
            {
                Header: "Chi",
                accessor: "total_spents",
                Cell: props => <p>{formatCurrency(props.original.total_spents)}</p>,
                style: { textAlign: 'center' }
            },
            {
                Header: "Tổng",
                accessor: "total_spents",
                Cell: props => <p>{formatCurrency(props.original.total_proceeds - props.original.total_spents)}</p>,
                style: { textAlign: 'center' }
            }
        ];
        return <div style={{ minHeight: '100vh', paddingTop: '70px' }} className="content-wrapper">
            <section style={{ marginBottom: '20px' }} className="content-header">
                <h1> THỐNG KÊ </h1>
            </section>
            <section className="content">
                <div className="row row_1_dashboard">
                    <div className="combobox_1_chart">
                        <p>Năm: </p>
                        <select onChange={this.handleChangeYear} value={this.state.year} className="form-control combobox">
                            <option value="2019">2019</option>
                            <option value="2020">2020</option>
                            <option value="2021">2021</option>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2028">2028</option>
                            <option value="2029">2029</option>
                        </select>
                    </div>
                    <div className="combobox_2_chart">
                        <p>Thời Gian: </p>
                        <select onChange={this.handleChangeTime} value={this.state.label} className="form-control combobox">
                            <option value="month">Tháng</option>
                            <option value="quarters">Quý</option>
                            {/* <option value="year">Năm</option> */}
                        </select>
                    </div>
                </div>
                <div className="row">
                    <Bar
                        data={this.state.chartData}
                        options={{
                            title: {
                                display: true,
                                text: this.state.text,
                                fontSize: 20,
                                position: 'bottom'
                            },
                            legend: {
                                display: true,
                                position: 'right'
                            }
                        }}
                        height={140}
                    />
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 book_tour_history">
                            {this.state.label === 'month' && <ReactTable
                                data={this.state.table}
                                columns={columnsMonth}
                                defaultPageSize={12}
                                showPagination={false} >
                            </ReactTable>}
                            {this.state.label === 'quarters' && <ReactTable
                                data={this.state.table}
                                columns={columnsQuy}
                                defaultPageSize={4}
                                showPagination={false} >
                            </ReactTable>}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    }
}

export default Chart;