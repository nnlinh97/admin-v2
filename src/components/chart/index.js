import React, { Component } from 'react';
import { Doughnut, Bar, Line, Pie } from 'react-chartjs-2';
import ReactTable from 'react-table';
import { apiPost, apiGet } from '../../services/api';
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
            chartMoney: {},
            charBookTour: {},
            year: 2019,
            label: 'month',
            textMoney: 'Biểu đồ doanh thu theo tháng năm 2019',
            textBookTour: 'Biểu đồ đặt và hủy tour theo tháng năm 2019',
            topFive: [],
            chartBookTour: {
                labels: ["1900", "1950", "1999", "2050"],
                datasets: [{
                    label: "Europe",
                    type: "bar",
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    data: [408, 547, 675, 734],
                }, {
                    label: "Africa",
                    type: "bar",
                    backgroundColor: "rgba(0,0,0,0.2)",
                    backgroundColorHover: "#3e95cd",
                    data: [133, 221, 783, 2478]
                }]
            }
        }
    }

    async componentDidMount() {
        const { label, year } = this.state;
        const chartMoneyPromise = apiPost('/admin/statistics_v2', { time: label, year: year });
        const topFiveTourPromise = apiGet('/admin/getTop5MostBookedTours');
        Promise.all([chartMoneyPromise, topFiveTourPromise]).then(([chartMoneyResult, topFiveTourResult]) => {
            const chartData = chartMoneyResult.data.data;
            const data = this.data(chartMoneyResult.data.data);
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
                chartMoney: {
                    labels,
                    datasets: [{
                        label: 'VND',
                        data: data.totalMoney,
                        backgroundColor
                    }]
                },
                chartBookTour: {
                    labels,
                    datasets: [{
                        label: "Số lần đặt tour",
                        type: "bar",
                        backgroundColor: "rgba(54, 162, 235, 0.6)",
                        data: data.booked,
                    }, {
                        label: "Số lần hủy tour",
                        type: "bar",
                        backgroundColor: "rgba(0,0,0,0.2)",
                        backgroundColorHover: "#3e95cd",
                        data: data.cancelled
                    }]
                },
                topFive: topFiveTourResult.data.data
            });
        });
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
        let booked = [];
        let cancelled = [];
        let totalMoney = [];
        array.forEach(item => {
            booked.push(item.total_book_tours);
            cancelled.push(item.total_cancel_book_tours);
            totalMoney.push(item.total_proceeds);
        });
        return { booked, cancelled, totalMoney };
    }

    prepairDataChart = async (labels, year) => {
        try {
            let chartData = await apiPost('/admin/statistics_v2', { time: labels, year: year });
            chartData = chartData.data.data;
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
            let chartData = await apiPost('/admin/statistics_v2', { time: this.state.label, year: year });
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
                chartMoney: {
                    labels,
                    datasets: [{
                        label: 'VND',
                        data: data.totalMoney,
                        backgroundColor
                    }]
                },
                chartBookTour: {
                    labels,
                    datasets: [{
                        label: "Số lần đặt tour",
                        type: "bar",
                        backgroundColor: "rgba(54, 162, 235, 0.6)",
                        data: data.booked,
                    }, {
                        label: "Số lần hủy tour",
                        type: "bar",
                        backgroundColor: "rgba(0,0,0,0.2)",
                        backgroundColorHover: "#3e95cd",
                        data: data.cancelled
                    }]
                },
                table: chartData,
                textMoney: this.state.label === 'month' ? ('Biểu đồ doanh thu theo tháng năm ' + year) : ('Biểu đồ doanh thu theo quý năm ' + year),
                textBookTour: this.state.label === 'month' ? ('Biểu đồ đặt và hủy tour theo tháng năm ' + year) : ('Biểu đồ đặt và hủy tour theo quý năm ' + year),
            });
        } catch (error) {
        }
    }

    handleChangeTime = async ({ target }) => {
        const label = target.value;
        try {
            let chartData = await apiPost('/admin/statistics_v2', { time: label, year: this.state.year });
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
                chartMoney: {
                    labels,
                    datasets: [{
                        label: 'VND',
                        data: data.totalMoney,
                        backgroundColor
                    }]
                },
                chartBookTour: {
                    labels,
                    datasets: [{
                        label: "Số lần đặt tour",
                        type: "bar",
                        backgroundColor: "rgba(54, 162, 235, 0.6)",
                        data: data.booked,
                    }, {
                        label: "Số lần hủy tour",
                        type: "bar",
                        backgroundColor: "rgba(0,0,0,0.2)",
                        backgroundColorHover: "#3e95cd",
                        data: data.cancelled
                    }]
                },
                table: chartData,
                textMoney: label === 'month' ? ('Biểu đồ doanh thu theo tháng năm ' + this.state.year) : ('Biểu đồ doanh thu theo quý năm ' + this.state.year),
                textBookTour: label === 'month' ? ('Biểu đồ đặt và hủy tour theo tháng năm ' + this.state.year) : ('Biểu đồ đặt và hủy tour theo quý năm ' + this.state.year),
            });
        } catch (error) {
        }
    }

    render() {
        const columns = [
            {
                Header: "STT",
                Cell: props => <p>{props.index + 1}</p>,
                style: { textAlign: 'center' },
                width: 80,
                maxWidth: 80,
                minWidth: 80
            },
            {
                Header: "Tour",
                accessor: "name",
                Cell: props => <p>{props.original.name}</p>,
                style: { textAlign: 'left', whiteSpace: 'unSet' }
            },
            {
                Header: "Số lần đặt",
                accessor: "num_book_tour",
                Cell: props => <p>{props.original.num_book_tour}</p>,
                style: { textAlign: 'center' }
            }
        ];
        const chartOptions = {
            responsive: false
        }
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
                <div style={{ marginBottom: '50px' }} className="row">
                    <Bar
                        data={this.state.chartMoney}
                        options={{
                            title: {
                                display: true,
                                text: this.state.textMoney,
                                fontSize: 20,
                                position: 'bottom',
                            },
                            legend: {
                                display: true,
                                position: 'right'
                            }
                        }}
                        height={140}
                    />
                </div>
                <div style={{ marginBottom: '50px', marginRight: '40px' }} className="row">
                    <Bar data={this.state.chartBookTour}
                        options={{
                            title: {
                                display: true,
                                text: this.state.textBookTour,
                                fontSize: 20,
                                position: 'bottom',
                            },
                            legend: {
                                display: true,
                                position: 'right'
                            }
                        }}
                        width={800}
                        height={400} />
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 book_tour_history">
                            <ReactTable
                                data={this.state.topFive}
                                columns={columns}
                                defaultPageSize={5}
                                showPagination={false} >
                            </ReactTable>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 book_tour_history">
                            <p style={{ fontSize: '20px', textAlign: 'center', fontWeight: 'bold', marginTop: '10px', color: '#636363' }}>
                                Bảng thống kê top 5 Tour được đặt nhiều nhất
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    }
}

export default Chart;