let payment_data = null;

$(document).ready(function () {
    getPaymentData();
});


const datepicker = document.getElementById('datepicker');
const tableEl =document.querySelectorAll('#example-table-1 tr');
const tbodyEl = document.getElementById('payment_tbody');

const input_numberEl = document.getElementById('input_number');
const input_receipt_numberEl = document.getElementById('input_receipt_number');
const input_transaction_dateEl = document.getElementById('input_transaction_date');
const input_productsEl = document.getElementById('input_products');
const input_total_priceEl = document.getElementById('input_total_price');
const input_discount_priceEl = document.getElementById('input_discount_price');
const input_real_priceEl = document.getElementById('input_real_price');

const payment_cancel_btn = document.getElementById('payment_cancel');
const canel_ok_btn = document.getElementById('ok_btn');

function getPaymentData() {
    $.ajax({
        type: "GET",
        url: "/payment_db",
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                let get_data = response["payment_data"];
                payment_data = makePaymentData(get_data);
                updatePaymentDom(payment_data);
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

function changeDate(payment_data){
    const selected_date = datepicker.value.split('/'); //[month,day,year]순
    let selected_date_data = [];
    console.log(selected_date);

    payment_data.forEach(item=>{
        const transaction_date_array = item.transaction_date.split('-');
        console.log(transaction_date_array);
        const year = transaction_date_array[0];
        const month = transaction_date_array[1];
        const day = transaction_date_array[2];
        if(year ===selected_date[2] && month===selected_date[0] &&day===selected_date[1]){
            selected_date_data.push(item);
        }
    });
    return selected_date_data;
}

function formatMoney(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function formatProducts(products){
    if(products.length>1){
        return products[0].product + "...";
    }else{
        return products[0].product;
    }
}

function updatePaymentDom(provided_data=payment_data){
    //clear main div
    tbodyEl.innerHTML = '';
    const selected_date_data= changeDate(provided_data); //날짜선택하여 날짜에 맞는 데이터 추출
    removeDetailPayment();
    console.log(selected_date_data);
    selected_date_data.forEach(item=> {
        const element = document.createElement('tr');
        element.innerHTML =
            `<th scope="row">${item.number}</th>
            <td>${item.receipt_number}</td>
            <td>${item.transaction_date}</td>
            <td>${formatProducts(item.products)}</td>
            <td>${formatMoney(item.total_price)}</td>`;
        tbodyEl.appendChild(element);
    });
}

function showDetailPayment(payment_data,receipt_number){
    let detail_payment = null;
    payment_data.forEach((item,index)=>{
        if(item.receipt_number===receipt_number){
            detail_payment = payment_data[index];
        }
    })
    console.log(detail_payment);
    input_products.innerHTML=``;
    input_numberEl.innerHTML = `${detail_payment.number}`;
    input_receipt_numberEl.innerHTML = `${detail_payment.receipt_number}`;
    input_transaction_dateEl.innerHTML = `${detail_payment.transaction_date}`;
    detail_payment.products.forEach(item=> {
        const productsEl = document.createElement('div');
        productsEl.innerHTML = `<span style="width:200px">${item.product}</span>
        <span>${item.amount}</span>
        <span>${item.per_price*item.amount}</span>`;
        productsEl.classList.add('d-flex');
        productsEl.classList.add('justify-content-between');
        input_productsEl.appendChild(productsEl);
    });
    input_total_priceEl.innerHTML=`${detail_payment.total_price}`;
    input_discount_priceEl.innerHTML=`${detail_payment.discount_price}`;
    input_real_priceEl.innerHTML=`${detail_payment.real_price}`;

};

function removeDetailPayment(){
    input_numberEl.innerHTML = ``;
    input_receipt_numberEl.innerHTML = ``;
    input_transaction_dateEl.innerHTML = ``;
    input_productsEl.innerHTML=``;
    input_total_priceEl.innerHTML=``;
    input_discount_priceEl.innerHTML=``;
    input_real_priceEl.innerHTML=``;

};
$(document.body).delegate("#example-table-1 tr", 'click', function() {
    var tdArr = new Array();	// 배열 선언

    // 현재 클릭된 Row(<tr>)
    var tr = $(this);
    var td = tr.children();

    td.each(function(i){
        tdArr.push(td.eq(i).text());
    });
    console.log("영수증번호 담긴 값 : "+tdArr[1]);
    showDetailPayment(payment_data, tdArr[1]); //영수증번호로 detail값 구하기
});


payment_cancel_btn.addEventListener('click', ()=>{
    const remove_receipt_number =input_receipt_numberEl.innerText;
    $.ajax({
        type: "POST",
        url: "/payment_db",
        data: {receipt_give: remove_receipt_number},
        success: function (response) {
            if (response["result"] == "success") {
                payment_data.forEach((item, index) => {
                    if (item.receipt_number === remove_receipt_number) {
                        payment_data.splice(index, 1);
                    }
                });
                updatePaymentDom();
                removeDetailPayment();
            } else {
                alert("결제취소 실패");
            }
        }
    })
});


// $("#example-table-1 tr").click(function(){
//     var tdArr = new Array();	// 배열 선언

//     // 현재 클릭된 Row(<tr>)
//     var tr = $(this);
//     var td = tr.children();

//     td.each(function(i){
//         tdArr.push(td.eq(i).text());
//     });
//     console.log("영수증번호 담긴 값 : "+tdArr[1]);
//     showDetailPayment(payment_data, tdArr[1]); //영수증번호로 detail값 구하기
// });