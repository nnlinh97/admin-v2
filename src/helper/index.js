
import moment from 'moment';

export const sortRoute = async (routes) => {
    //true nếu arrive nhỏ hơn leave
    const sync_check_time = (arrive, leave) => {
        return Date.parse('01/01/2011 ' + arrive) < Date.parse('01/01/2011 ' + leave)
    }
    const compare2Route = (route1, route2) => {
        if (parseInt(route1.day) === parseInt(route2.day)) {
            if (sync_check_time(route1.arriveTime, route2.arriveTime)) {
                //route1 nhỏ hơn route2
                return -1;
            }
            else
                return 1
        }
        return (parseInt(route1.day) > parseInt(route2.day) ? 1 : -1)
    }
    routes.sort(compare2Route);
}

export const mergeBookHistory = (bookHistory) => {
    if (bookHistory) {
        let result = [];
        bookHistory.forEach(bookItem => {
            bookItem.passengers.forEach(item => {
                result.push({
                    ...bookItem,
                    passenger: {
                        ...item
                    }
                });
            });
        });
        return result;
    }
    return null;
}

export const filterBookHistory = (bookHistory) => {
    if (bookHistory) {
        return bookHistory.filter(item => item.status !== 'cancelled');
    }
    return null;
}

export function formatCurrency(amount) {
    try {
        let decimalCount = 0;
        const decimal = ',';
        const thousands = ',';
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? '-' : '';
        amount = Math.abs(Number(amount) || 0);
        const i = (amount.toFixed(decimalCount)).toString();
        const j = (i.length > 3) ? i.length % 3 : 0;

        const result = negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) + (decimalCount ? decimal + Math.abs(amount - parseInt(i, 10)).toFixed(decimalCount).slice(2) : '');
        return result;
    } catch (e) {
        // console.log(e);
        return 'NaN';
    }
}

export function newListSelect(list) {
    list.forEach(item => {
        item.value = item.id;
        item.label = item.name;
    });
    return list;
}

function changeAlias(alias) {
    let str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ + /g, " ");
    str = str.trim();
    return str;
}

export function matchString(str, key) {
    return changeAlias(str.toLowerCase()).indexOf(changeAlias(key.toLowerCase())) !== -1;
}

export function pagination(list, page, limit) {
    const offset = (page - 1) * limit;
    let result = [];
    if (offset + limit > list.length) {
        for (let i = offset; i < list.length; i++) {
            result.push(list[i]);
        }
    } else {
        for (let i = offset; i < offset + limit; i++) {
            result.push(list[i]);
        }
    }
    return result;
}

export function getStatusItem(status) {
    let colorStatus = '';
    let textStatus = '';
    switch (status) {
        case 'paid':
            colorStatus = 'success';
            textStatus = 'đã thanh toán';
            break;
        case 'booked':
            colorStatus = 'warning';
            textStatus = 'chưa thanh toán';
            break;
        case 'cancelled':
            colorStatus = 'default';
            textStatus = 'đã hủy';
            break;
        case 'pending_cancel':
            colorStatus = 'danger';
            textStatus = 'yêu cầu hủy';
            break;
        case 'finished':
            colorStatus = 'info';
            textStatus = 'đã tham gia';
            break;
    }
    return {
        colorStatus,
        textStatus
    };
}

export function getStatusTourTurn(startDate, endDate) {
    const currentDate = moment(new Date()).format('YYYY-MM-DD');

    let status = "";
    let css = '';
    if (startDate <= currentDate && currentDate <= endDate) {
        status = "đang đi";
        css = 'warning'
    } else if (startDate > currentDate) {
        status = "chưa đi";
        css = 'success';
    } else {
        status = "đã đi";
        css = 'default';
    }
    return { status, css };
}

export function getSex(sex) {
    let name = '';
    switch (sex) {
        case 'male':
            name = 'Nam';
            break;
        case 'female':
            name = 'Nữ';
            break;
        case 'other':
            name = 'Khác';
            break;
    }
    return name;
}

export function getCancelChecked(status) {
    switch (status) {
        case 'paid':
        case 'pending_cancel':
        case 'booked':
            return true;
        case 'cancelled':
        case '':
            return false;
    }
}

export function getPaymentChecked(status) {
    switch (status) {
        case 'booked':
            return true;
        case 'paid':
        case 'cancelled':
        case 'pending_cancel':
        case '':
            return false;
    }
}

export function getPercentRefund(numDate) {
    if (numDate >= 15) {
        return 100;
    } else if (8 <= numDate && numDate <= 14) {
        return 50;
    } else if (5 <= numDate && numDate <= 7) {
        return 30;
    } else if (2 <= numDate && numDate <= 4) {
        return 10;
    } else {
        return 0;
    }
}

export function getNumberDays(date1, date2) {
    date1 = date1.split('-');
    date2 = date2.split('-');

    date1 = new Date(date1[0], date1[1], date1[2]);
    date2 = new Date(date2[0], date2[1], date2[2]);

    const date1_unixtime = parseInt(date1.getTime() / 1000);
    const date2_unixtime = parseInt(date2.getTime() / 1000);

    const timeDifference = date2_unixtime - date1_unixtime;

    const timeDifferenceInHours = timeDifference / 60 / 60;

    const timeDifferenceInDays = timeDifferenceInHours / 24;

    return timeDifferenceInDays;
}

export function getPaymentType(type) {
    console.log(type)
    let result = '';
    switch (type) {
        case 'incash':
            result = 'Tiền mặt';
            break;
        case 'transfer':
            result = 'Chuyển khoản';
            break;
        case 'online':
            result = 'Trực tuyến';
            break;
    }
    return result;
}