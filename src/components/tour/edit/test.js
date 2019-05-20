let arr = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 }
]

function swap(a, x, y) {
    a.splice(y, 1, a.splice(x, 1, a[y])[0]);
    return a;
}

console.log(swap(arr, 0, 2));