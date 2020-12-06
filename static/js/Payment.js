var localstorage = this.localStorage
var lType_of_payment = ['공차 쿠폰', '통신사 할인', '기프티콘'];
var lWhat_to_do = ['전화 번호를', '전화 번호를', '기프티콘 번호를'];
var lPic_src = ['../../static/img/coupon_scan.jpg', '../../static/img/membership_scan.jpg', '../../static/img/gifticon_scan.jpg'];

function payment_type_set(_type) {
    localstorage.removeItem('Payment_type');
    localstorage.removeItem('Pic_src');

    localstorage.setItem('Payment_type', lType_of_payment[_type]);
    localstorage.setItem('What_to_do', lWhat_to_do[_type]);
    localstorage.setItem('Pic_src', lPic_src[_type]);
    if(_type == 0 || _type == 1) {
        localstorage.setItem('Is_Discount', '1');
    }
    return window.location.href = '/client/pay/scan';
}

function cancel() {
    if(localstorage.getItem('Is_Discount')) {
        let paymenttype = localstorage.getItem('Payment_type')
        if(paymenttype == '공차 쿠폰' || paymenttype == '통신사 할인') {
            localstorage.removeItem('Is_Discount');
        }
    }
    return location.href = '/client/pay/select';
}

function Err_display() {
    var Errcode = localstorage.getItem('Err_code')
    var Err_type = '사유: '
    switch(Errcode) {
        case '1':
            Err_type += '결제 시간 초과';
            break;
        default:
            Err_type += '기기 오류';
            break;
    }
    document.getElementById('Reason_failure').innerText = Err_type;
    return;
}