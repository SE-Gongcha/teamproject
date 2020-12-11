const tbodyEl = document.getElementById('menu_tbody');

updateDom(menu_data);

function formatMoney(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateDom(menu_data) {
    //clear main div
    tbodyEl.innerHTML = '';

    menu_data.forEach(item => {
        const element = document.createElement('tr');
        element.innerHTML =
            `<th scope="row" style="text-align:center">${item.number}</th>
            <td>${item.category}</td>
            <td>${item.name}</td>
            <td style="text-align:right">${formatMoney(item.price)}</td>`;
        tbodyEl.appendChild(element);
    });
}