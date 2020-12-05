from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)

client = MongoClient('localhost', 27017) # mongoDB의 27017 포트로 들어감
db = client.dbGongchaTest   # 'dbGongchaTest'라는 이름의 db 생성

db.orderCount.delete_many({})
# db.orderCount.insert_one({'order_count': 1})

## HTML을 주는 부분
@app.route('/')
def home():
    return render_template('kitchen_display.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/menu_list')
def menu_list():
    return render_template('menu_list.html')

# @app.route('/menu_change')
# def menu_change():
#     return render_template('menu_change.html')

# @app.route('/topping_change')
# def topping_change():
#     return render_template('topping_change.html')

@app.route('/payment_list')
def payment_list():
    return render_template('payment_list.html')

@app.route('/payment_result')
def payment_result():
    return render_template('payment_result.html')

@app.route('/kitchen_display')
def kitchen_display():
    return render_template('kitchen_display.html')

## API 역할을 하는 부분
# @app.route('/order', methods=['GET', 'POST'])
# def make_order():
#     if request.method == 'POST': # 주문 정보 저장히기
#         products = request.form['products_give']  # [[products, amount, per_price, *options], ...]
#         total_price = request.form['price_give']
#
#         order_count = db.orderCount.find_one({}, {'_id': 0})
#         number = order_count['order_count']  # *주문 번호
#
#         order_date = str(datetime.today().date()) # 주문 날짜
#
#         #receipt_number =  #order_date + number # 영수증 번호 형식 수정 필요 (202011280001)
#
#         order = {'number': number, 'receipt_number': receipt_number, 'products': products,
#                  'total_price': total_price}
#
#         db.order.insert_one(order)
#
#         return jsonify({'result': 'success'})
#
#     elif request.method == 'GET': # 결제 화면에 total_price 값 뿌려주기 (optional)
#         order_count = db.orderCount.find_one({}, {'_id': 0})
#         number = order_count['order_count']
#         order_date = str(datetime.today().date())
#         #receipt_number =  #order_date + number
#
#         result = db.order.find_one({'receipt_number': receipt_number}, {'_id': 0, 'number': 0, 'receipt_number': 0, 'products': 0})
#
#         return jsonify({'result': 'success', 'total_price': result})
#
# @app.route('/pay', methods=['GET', 'POST'])
# def pay_order():
#     if request.method == 'POST': # 결제 정보 저장하기
#         order_count = db.orderCount.find_one({}, {'_id': 0})
#         number = order_count['order_count']
#         order_date = str(datetime.today().date())
#         #receipt_number =  #order_date + number
#
#         #transaction_date =  #날짜+시간
#         # order_date = str(datetime.today().date())
#         # order_time = datetime.today()
#
#         discount_price = request.form['discount_give']  # 할인 금액
#         real_price = request.form['real_give']  # 결제 금액 (메뉴 가격 - 할인 금액)
#
#         pay = {'receipt_number': receipt_number, 'transaction_date': transaction_date, 'discount_price': discount_price, 'real_price': real_price}
#
#         db.pay.insert_one(pay)
#
#         return jsonify({'result': 'success'})
#
#     elif request.method == 'GET': # 최종 결제 화면에 real_price 값 뿌려주기 (optional)
#         order_count = db.orderCount.find_one({}, {'_id': 0})
#         number = order_count['order_count']
#         order_date = str(datetime.today().date())
#         #receipt_number =  #order_date + number
#
#         result = db.pay.find_one({'receipt_number': receipt_number},
#                                  {'_id': 0, 'receipt_number': 0, 'transaction_date': 0, 'discount_price': 0})
#
#         return jsonify({'result': 'success', 'real_price': result})
#
# @app.route('/finish', methods=['GET'])
# def finish_order():
#     # 1. orderCount DB에서 order_number 값 조회해오기(Read)
#     order_count = db.orderCount.find_one({}, {'_id': 0})
#     order_number = order_count['order_count']
#
#     # 2. orderCount DB 1만큼 업데이트 해주기
#     order_count_update = order_number + 1
#     db.orderCount.update_one({}, {'$set': {'order_count': order_count_update}})
#
#     return jsonify({'result': 'success', 'order_number': order_number})
#
# def make_payments_db(): # order DB + pay DB = payments DB 만들기
#     # 1. order DB에서 주문 정보 가져오기
#     order_db = list(db.order.find({}, {'_id': 0}))
#
#     for order in order_db:
#         number = order['number']
#         receipt_number = order['receipt_number']
#         order_state = False  # 주문 처리 상태
#         transaction_date = 0
#         products = order['products']
#         total_price = order['total_price']
#         discount_price = 0
#         real_price = 0
#
#         payments = {'number': number, 'receipt_number': receipt_number, 'order_state': order_state,
#                     'transaction_date': transaction_date, 'products': products, 'total_price': total_price,
#                     'discount_price': discount_price, 'real_price': real_price}
#         db.payments.insert_one(payments)
#
#     # 2. pay DB에서 결제 정보 가져오기
#     pay_db = list(db.pay.find({}, {'_id': 0}))
#
#     for pay in pay_db:
#         receipt_number = pay['receipt_number']
#         transaction_date = pay['transaction_date']
#         discount_price = pay['discount_price']
#         real_price = pay['real_price']
#
#         db.payments.update_one({'receipt_number': receipt_number}, {
#             '$set': {'transaction_date': transaction_date, 'discount_price': discount_price, 'real_price': real_price}})

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

