
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