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
function changeDate(payment_data){
    const selected_start_date = start_date.value.split('/');
    const selected_end_date = end_date.value.split('/'); //[month,day,year]순
    let selected_date_data = [];
    console.log("시작 날짜", selected_start_date);

    payment_data.forEach(item=>{
        const transaction_date_array = item.transaction_date.split('-');
        console.log(transaction_date_array);
        const year = parseInt(transaction_date_array[0]);
        const month = parseInt(transaction_date_array[1]);
        const day = parseInt(transaction_date_array[2]);

        if( year <= parseInt(selected_end_date[2])
        && month<=parseInt(selected_end_date[0])
        && day<=parseInt(selected_end_date[1])){

            if(parseInt(selected_start_date[2])<=year
            && parseInt(selected_start_date[0])<=month
            && parseInt(selected_start_date[1])<=day){
                selected_date_data.push(item);
            }
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