let payment_data=[
    {number:'0001', receipt_number:'202011210001', transaction_date:'2020-11-21-09:37', 
    products:[{product:'다크초코 밀크티+펄(L)', amount:1, per_price:5000}, {product:'딸기 밀크티+펄(L)', amount:1, per_price:5000}], total_price:10000, discount_price:5000, real_price:5000},
    {number:'0002', receipt_number:'202011210002', transaction_date:'2020-11-21-09:37', 
    products:[{product:'얼그레이 밀크티(L)', amount:2, per_price:5000}], total_price:10000, discount_price:600, real_price:9400},
    {number:'0001', receipt_number:'202011220001', transaction_date:'2020-11-22-09:37', 
    products:[{product:'얼그레이 밀크티(J)', amount:1, per_price:5000}], total_price:5000, discount_price:600, real_price:4400},
    {number:'0001', receipt_number:'202011240001', transaction_date:'2020-11-24-09:37', 
    products:[{product:'블랙 밀크티(J)', amount:1, per_price:5000}], total_price:5000, discount_price:0, real_price:5000},
    {number:'0001', receipt_number:'202011240001', transaction_date:'2020-11-24-09:37', 
    products:[{product:'블랙 밀크티(J)', amount:1, per_price:5000}], total_price:5000, discount_price:0, real_price:5000},
    {number:'0001', receipt_number:'202012010001', transaction_date:'2020-12-01-09:37', 
    products:[{product:'블랙 밀크티(J)', amount:1, per_price:5000}], total_price:5000, discount_price:0, real_price:5000},
    {number:'0001', receipt_number:'202012030001', transaction_date:'2020-12-03-09:37', 
    products:[{product:'블랙 밀크티(J)', amount:1, per_price:5000}], total_price:5000, discount_price:0, real_price:5000},
];

const payment_result_list = document.getElementById('payment_result_list'); 
const payment_result_all = document.getElementById('payment_result_all');
const start_date = document.getElementById('datepicker');
const end_date = document.getElementById('datepicker2');

updatePaymentResultDom();
function formatMoney(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getDateRange(startDate, endDate) // 선택한 시작한 날짜와 끝나는 날짜 사이의 리스트 구하기

    {
        console.log(startDate, endDate);
        var dateMove = new Date(startDate); 
        var strDate = startDate;
        var listDate = [];
        if (startDate == endDate)
        {
            var strDate = dateMove.toISOString().slice(0,10);
            listDate.push(strDate);
        }
        else
        {
            while (strDate < endDate)
            {
                var strDate = dateMove.toISOString().slice(0, 10);
                listDate.push(strDate);
                dateMove.setDate(dateMove.getDate() + 1);
            }
        }
        return listDate;

};

function changeDate(payment_data){
    const selected_start_date = start_date.value.split('/');
    const selected_end_date = end_date.value.split('/'); //[month,day,year]순 [11,22,2020]
    let selected_date_data = [];
 
    const end_year = parseInt(selected_end_date[2]);
    const end_month = parseInt(selected_end_date[0])<10? `0${parseInt(selected_end_date[0])}`:parseInt(selected_end_date[0]);
    const end_day = parseInt(selected_end_date[1])<10? `0${parseInt(selected_end_date[1])}`: parseInt(selected_end_date[1]);

    const start_year = parseInt(selected_start_date[2]);
    const start_month = parseInt(selected_start_date[0]) <10? `0${parseInt(selected_start_date[0])}`:parseInt(selected_start_date[0]);;
    const start_day = parseInt(selected_start_date[1])<10? `0${parseInt(selected_start_date[1])}`:parseInt(selected_start_date[1]);;

    const start = `${start_year}-${start_month}-${start_day}`;
    const end = `${end_year}-${end_month}-${end_day}`;
    const date_list = getDateRange(start, end);//날짜 리스트 구하기
    console.log(date_list);


    payment_data.forEach(item=>{
        const transaction_date= item.transaction_date.substr(0,10); //날짜 추출
        console.log(transaction_date);

        if (date_list.includes(transaction_date)){
            selected_date_data.push(item);
        }
    });
    return selected_date_data;
}

function updatePaymentResultDom(provided_data=payment_data){
    //clear main div
    payment_result_list.innerHTML = '';
    const selected_date_data= changeDate(provided_data); //날짜선택하여 날짜에 맞는 데이터 추출
    console.log(selected_date_data);
    selected_date_data.forEach(item=> {
        const element = document.createElement('tr');
        element.innerHTML = 
            `<th scope="row">${item.number}</th>
            <td>${item.receipt_number}</td>
            <td>${formatMoney(item.total_price)}</td>
            <td>${formatMoney(item.discount_price)}</td>
            <td>${formatMoney(item.real_price)}</td>`;
        payment_result_list.appendChild(element);
    });

    updatePaymentAllResult(selected_date_data);
}

function updatePaymentAllResult(selected_date_data){
    payment_result_all.innerHTML =``;
    let all_total_price = 0;
    let all_discount_price = 0;
    let all_real_price = 0;
    selected_date_data.forEach(item=>{
        all_total_price += item.total_price;
        all_discount_price += item.discount_price;
        all_real_price += item.real_price;
    })
    const element = document.createElement('tr');
    element.innerHTML = 
        `<td>${selected_date_data.length}</td>
        <td>${formatMoney(all_total_price)}</td>
        <td>${formatMoney(all_discount_price)}</td>
        <td>${formatMoney(all_real_price)}</td>`;
    payment_result_all.append(element);
};

