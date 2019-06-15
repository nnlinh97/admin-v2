import React, { Component } from 'react';
import { Doughnut, Bar, Line, Pie } from 'react-chartjs-2';

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

const dataMonths = [
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
];
const dataTrimesters = [
    617594,
    181045,
    153060,
    106519,
];

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: {},
            year: 2019,
            label: 'month'
        }
    }

    componentDidMount() {
        const { label, year } = this.state;
        this.setState({ chartData: this.prepairDataChart(label, year) })
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

    prepairDataChart = (labels, year) => {
        let backgroundColor = [];
        let data = [];
        if (labels === 'month') {
            labels = months;
            backgroundColor = colorMonths;
            data = [...dataMonths];
        }
        if (labels === 'trimester') {
            labels = trimesters;
            backgroundColor = colorTrimesters;
            data = [...dataTrimesters];
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

    }

    handleChangeYear = ({ target }) => {
        this.setState({ year: target.value });
    }

    handleChangeTime = ({ target }) => {
        this.setState({ label: target.value, chartData: this.prepairDataChart(target.value, this.state.year) });
    }

    render() {
        return <div style={{ minHeight: '100vh', paddingTop: '70px' }} className="content-wrapper">
            <section style={{ marginBottom: '20px' }} className="content-header">
                <h1> THỐNG KÊ </h1>
            </section>
            <section className="content">
                <div className="row row_1_dashboard">
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
                    <select onChange={this.handleChangeTime} value={this.state.label} className="form-control combobox">
                        <option value="month">Tháng</option>
                        <option value="trimester">Quý</option>
                        <option value="year">Năm</option>
                    </select>
                </div>
                <div className="row">
                    <Bar
                        data={this.state.chartData}
                        options={{
                            title: {
                                display: true,
                                text: 'Biểu đồ doanh thu theo tháng năm 2019',
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
            </section>
        </div>
    }
}

export default Chart;