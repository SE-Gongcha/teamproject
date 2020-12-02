let payment_data = null;

$(document).ready(function () {
    getPaymentData();
});

const payment_result_list = document.getElementById('payment_result_list');
const payment_result_all = document.getElementById('payment_result_all');
const start_date = document.getElementById('datepicker');
const end_date = document.getElementById('datepicker2');

function getPaymentData() {
    $.ajax({
        type: "GET",
        url: "/payment_db",
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                let get_data = response["payment_data"];
                payment_data = makePaymentData(get_data);
                updatePaymentResultDom();
            } else {
                alert("데이터 가져오기 실패");
            }
        }
    })
}

function makePaymentData(get_data) {
    let data = get_data;
    let data_list = [];
    for (let i = 0; i < data.length; i++) {
        let no = data[i]['number'];
        let rno = data[i]['receipt_number'];
        let tdate = data[i]['transaction_date'];
        let pro = data[i]['products'];
        let tpri = data[i]['total_price'];
        let dpri = data[i]['discount_price'];
        let rpri = data[i]['real_price'];

        let data_dict = {number: no, receipt_number: rno, transaction_date: tdate, products: pro, total_price: tpri, discount_price: dpri, real_price: rpri};

        data_list.push(data_dict);
    }
    return data_list;
}

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