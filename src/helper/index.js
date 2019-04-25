
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
    return changeAlias(str.toLowerCase()).indexOf(changeAlias(key)) !== -1;
}