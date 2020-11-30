const tbodyEl = document.getElementById('menu_tbody');

let menu_data = [
    {number:1, product_number:'abc00001', category:'시즌메뉴', name:'토피넛 밀크티+펄(라지)', price:5000},
    {number:2, product_number:'abc00002', category:'시즌메뉴', name: '초코바른 토피넛 스무디(라지)', price:5500},
    {number:3, product_number:'abc00003', category:'시즌메뉴', name: '다크초코 밀크티+펄(라지)', price:4900},
    {number:4, product_number:'abc00004', category:'베스트 콤비네이션', name: '블랙 밀크티 + 펄(라지)', price:4500},
    {number:5, product_number:'abc00005', category:'베스트 콤비네이션', name: '블랙 밀크티 + 펄(점보)', price:5800},
    {number:6, product_number:'abc00006', category:'베스트 콤비네이션', name: '타로 밀크티 + 펄(점보)', price:4500},
    {number:7, product_number:'abc00007', category:'베스트 콤비네이션', name: '타로 밀크티 + 펄(라지)', price:5800},
    {number:8, product_number:'abc00008', category:'베스트 콤비네이션', name: '제주 그린 밀크티+ 펄(라지)', price:4900},
    {number:9, product_number:'abc00009', category:'베스트 콤비네이션', name: '우롱티+ 밀크폼(라지)', price:3700},
    {number:10, product_number:'abc00010', category:'베스트 콤비네이션', name: '우롱티+ 밀크폼(점보)', price:4900},

];

updateDom(menu_data);

function formatMoney(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateDom(menu_data){
    //clear main div
    tbodyEl.innerHTML = '';

    menu_data.forEach(item=> {
        const element = document.createElement('tr');
        element.innerHTML = 
            `<th scope="row" style="text-align:center">${item.number}</th>
            <td>${item.category}</td>
            <td>${item.name}</td>
            <td style="text-align:right">${formatMoney(item.price)}</td>`;
        tbodyEl.appendChild(element);
    });
}


 
