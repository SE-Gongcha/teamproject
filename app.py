from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import time

app = Flask(__name__)

client = MongoClient('localhost', 27017) # mongoDB의 27017 포트로 들어감
db = client.dbGongchaTest   # 'dbGongchaTest'라는 이름의 db 생성

#주문번호 DB 생성하기
db.orderCount.delete_many({})
init_count = '{0:04d}'.format(1)
db.orderCount.insert_one({'order_count': init_count})

# HTML을 주는 부분
@app.route('/')
def home():
    return render_template('client/main.html')

# Client View HTML
@app.route('/client/main')
def main():
    return render_template('client/main.html')

@app.route('/client/menu/layout')
def layout():
    return render_template('client/layout.html')

@app.route('/client/menu/best')
def best():
    return render_template('client/best.html')

@app.route('/client/menu/tea')
def tea():
    return render_template('client/tea.html')

@app.route('/client/menu/milktea')
def milktea():
    return render_template('client/milktea.html')

@app.route('/client/menu/brownsugar')
def brownsugar():
    return render_template('client/brownsugar.html')

@app.route('/client/menu/fruitmix')
def fruitmix():
    return render_template('client/fruitmix.html')

@app.route('/client/menu/smoothee')
def smoothe():
    return render_template('client/smoothee.html')

@app.route('/client/menu/coffee')
def coffee():
    return render_template('client/coffee.html')

@app.route('/client/menu/snack')
def snack():
    return render_template('client/snack.html')

@app.route('/client/order/option')
def option_layout():
    return render_template('client/option_layout.html')

@app.route('/client/order/confirm')
def order_confirm():
    return render_template('client/order_confirm.html')

@app.route('/client/pay/select')
def payment_selection():
    return render_template('client/payment_selection.html')

@app.route('/client/pay/credit')
def payment_credit():
    return render_template('client/payment_credit.html')

@app.route('/client/pay/scan')
def payment_scan():
    return render_template('client/payment_scan.html')

@app.route('/client/pay/manual')
def payment_manual():
    return render_template('client/payment_manual.html')

@app.route('/client/pay/error')
def payment_error():
    return render_template('client/payment_error.html')

@app.route('/client/pay/success')
def payment_success():
    return render_template('client/payment_success.html')

@app.route('/client/stamp/scan')
def stamp_scan():
    return render_template('client/stamp_scan.html')

@app.route('/client/stamp/manual')
def stamp_manual():
    return render_template('client/stamp_manual.html')

@app.route('/client/stamp/success')
def stamp_success():
    return render_template('client/stamp_success.html')

@app.route('/client/print')
def print_order():
    return render_template('client/print_order.html')

# Manager View HTML
@app.route('/manager/login')
def login():
    return render_template('manager/login.html')

@app.route('/manager/menu/list')
def menu_list():
    return render_template('manager/menu_list.html')

# @app.route('/manager/menu/change')
# def menu_change():
#     return render_template('menu_change.html')

# @app.route('/manager/topping/change')
# def topping_change():
#     return render_template('topping_change.html')

@app.route('/manager/payment/list')
def payment_list():
    return render_template('manager/payment_list.html')

@app.route('/manager/payment/result')
def payment_result():
    return render_template('manager/payment_result.html')

# Kitchen View HTML
@app.route('/kitchen')
def kitchen_display():
    return render_template('kitchen/kitchen_display.html')

## API 역할을 하는 부분
@app.route('/order_db', methods=['POST'])
# 주문 정보 저장하기
def post_order_db():
    # 주문 번호
    order_count = db.orderCount.find_one({}, {'_id': 0})
    number = order_count['order_count']

    # 영수증 번호
    transaction_date = time.strftime("%Y-%m-%d-%H:%M")
    date_split = transaction_date.split('-')
    date_list = date_split[:3]
    date_list.append(number)
    receipt_number = ''.join(date_list)

    # 주문 제품
    product = request.form['product_give']  # [[product, amount, per_price, *options], ...]
    amount = int(request.form['amount_give'])
    per_price = int(request.form['pprice_give'])
    opt = request.form['options_give']
    options = [x.strip() for x in opt.split(',')]
    products = [{'product': product, 'amount': amount, 'per_price': per_price, 'options': options}]

    # 총 주문 가격
    total_price = int(request.form['tprice_give'])

    order = {'number': number, 'receipt_number': receipt_number, 'products': products,
             'total_price': total_price}

    db.order.insert_one(order)

    return jsonify({'result': 'success'})

@app.route('/pay_db', methods=['POST'])
# 결제 정보 저장하기
def pay_order():
    # 주문 번호
    order_count = db.orderCount.find_one({}, {'_id': 0})
    number = order_count['order_count']

    # 주문 시간 & 영수증 번호
    transaction_date = time.strftime("%Y-%m-%d-%H:%M")
    date_split = transaction_date.split('-')
    date_list = date_split[:3]
    date_list.append(number)
    receipt_number = ''.join(date_list)

    discount_price = int(request.form['discount_give'])  # 할인 금액
    real_price = int(request.form['real_give'])  # 결제 금액 (메뉴 가격 - 할인 금액)

    pay = {'receipt_number': receipt_number, 'transaction_date': transaction_date, 'discount_price': discount_price,
           'real_price': real_price}

    db.pay.insert_one(pay)

    return jsonify({'result': 'success'})


@app.route('/finish', methods=['GET'])
def finish_order():
    # 1. orderCount DB에서 order_number 값 조회해오기(Read)
    order_count = db.orderCount.find_one({}, {'_id': 0})
    number = order_count['order_count']

    # 2. orderCount DB 1만큼 업데이트 해주기
    count = int(number) + 1
    count_update = '{0:04d}'.format(count)
    db.orderCount.update_one({}, {'$set': {'order_count': count_update}})

    # 3. payment DB 생성하기
    make_payments_db()

    return jsonify({'result': 'success', 'order_number': number})

def make_payments_db(): # order DB + pay DB = payments DB 만들기
    db.payments.delete_many({})

    # 1. order DB에서 주문 정보 가져오기
    order_db = list(db.order.find({}, {'_id': 0}))

    for order in order_db:
        number = order['number']
        receipt_number = order['receipt_number']
        order_state = False  # 주문 처리 상태
        transaction_date = 0
        products = order['products']
        total_price = order['total_price']
        discount_price = 0
        real_price = 0

        payments = {'number': number, 'receipt_number': receipt_number, 'order_state': order_state,
                    'transaction_date': transaction_date, 'products': products, 'total_price': total_price,
                    'discount_price': discount_price, 'real_price': real_price}
        db.payments.insert_one(payments)

    # 2. pay DB에서 결제 정보 가져오기
    pay_db = list(db.pay.find({}, {'_id': 0}))

    for pay in pay_db:
        receipt_number = pay['receipt_number']
        transaction_date = pay['transaction_date']
        discount_price = pay['discount_price']
        real_price = pay['real_price']

        db.payments.update_one({'receipt_number': receipt_number}, {
            '$set': {'transaction_date': transaction_date, 'discount_price': discount_price, 'real_price': real_price}})

@app.route('/payment_db', methods=['POST'])
def post_payments_db():
    receipt_number = request.form['receipt_give']
    db.payments.delete_one({'receipt_number': receipt_number})

    return jsonify({'result': 'success'})

@app.route('/payment_db', methods=['GET'])
def get_payments_db():
    result = list(db.payments.find({}, {'_id': 0, 'order_state': 0}))

    return jsonify({'result': 'success', 'payment_data': result})

@app.route('/kitchen_db', methods=['GET', 'POST'])
def check_order():
    if request.method == 'POST': # 서빙이 끝난 주문의 처리 정보 수정하기
        receipt_receive = request.form['receipt_give']
        db.payments.update_one({'receipt_number': receipt_receive}, {'$set': {'order_state': True}})

        return jsonify({'result': 'success'})

    elif request.method == 'GET': # 주방 화면에 주문 번호(number), 영수증 번호(receipt_number)와 주문정보(products) 보내주기
        result = list(db.payments.find({'order_state': False}, {'_id': 0, 'transaction_date': 0, 'total_price': 0,
                                                                'discount_price': 0, 'real_price': 0, 'order_state': 0}))

        return jsonify({'result': 'success', 'kitchen_data': result})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)

