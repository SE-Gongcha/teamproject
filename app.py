from flask import Flask, render_template, request, jsonify, redirect, url_for
from pymongo import MongoClient
import time
import json
import os
import base64

app = Flask(__name__)

# [초기 DB 생성하는 부분]

# Mongo DB
client = MongoClient('localhost', 27017)
db = client.dbGongchaTest

# 주문번호 DB
db.orderCount.delete_many({})
init_count = '{0:04d}'.format(1)
db.orderCount.insert_one({'order_count': init_count})

# 메뉴 DB
db.menu.delete_many({})
db.category.delete_many({})
db.topping.delete_many({})

db.menu.insert_one(
    {'number': 1, 'product_number': 'abc00001', 'category': '시즌메뉴', 'name': '토피넛 밀크티+펄(L)', 'price': 5000,
     'ice': True, 'hot': True, 'topping_number': 3, 'is_waiting': False, 'is_output_kitchen': True})
db.menu.insert_one(
    {'number': 2, 'product_number': 'abc00002', 'category': '시즌메뉴', 'name': '초코바른 토피넛 스무디(L)', 'price': 5500,
     'ice': True, 'hot': True, 'topping_number': 3, 'is_waiting': False, 'is_output_kitchen': True})
db.menu.insert_one(
    {'number': 3, 'product_number': 'abc00003', 'category': '시즌메뉴', 'name': '다크초코 밀크티+펄(라지)', 'price': 4900,
     'ice': True, 'hot': True, 'topping_number': 3, 'is_waiting': False, 'is_output_kitchen': True})
db.menu.insert_one(
    {'number': 4, 'product_number': 'abc00004', 'category': '베스트 콤비네이션', 'name': '블랙 밀크티 + 펄(라지)', 'price': 4500,
     'ice': True, 'hot': True, 'topping_number': 3, 'is_waiting': False, 'is_output_kitchen': True})
db.menu.insert_one(
    {'number': 5, 'product_number': 'abc00005', 'category': '베스트 콤비네이션', 'name': '블랙 밀크티 + 펄(J)', 'price': 5800,
     'ice': True, 'hot': True, 'topping_number': 3, 'is_waiting': False, 'is_output_kitchen': True})
db.menu.insert_one(
    {'number': 6, 'product_number': 'abc00006', 'category': '베스트 콤비네이션', 'name': '타로 밀크티 + 펄(점보)', 'price': 4500,
     'ice': True, 'hot': True, 'topping_number': 3, 'is_waiting': False, 'is_output_kitchen': True})
db.menu.insert_one(
    {'number': 7, 'product_number': 'abc00007', 'category': '베스트 콤비네이션', 'name': '타로 밀크티 + 펄(라지)', 'price': 5800,
     'ice': True, 'hot': True, 'topping_number': 3, 'is_waiting': False, 'is_output_kitchen': True})
db.menu.insert_one(
    {'number': 8, 'product_number': 'abc00008', 'category': '베스트 콤비네이션', 'name': '제주 그린 밀크티+ 펄(라지', 'price': 4900,
     'ice': True, 'hot': True, 'topping_number': 3, 'is_waiting': False, 'is_output_kitchen': True})
db.menu.insert_one(
    {'number': 9, 'product_number': 'abc00009', 'category': '베스트 콤비네이션', 'name': '우롱티+ 밀크폼(라지)', 'price': 3700,
     'ice': True, 'hot': True, 'topping_number': 3, 'is_waiting': False, 'is_output_kitchen': True})
db.menu.insert_one(
    {'number': 10, 'product_number': 'abc000010', 'category': '베스트 콤비네이션', 'name': '우롱티+ 밀크폼(점보)', 'price': 4900,
     'ice': True, 'hot': True, 'topping_number': 3, 'is_waiting': False, 'is_output_kitchen': True})

db.category.insert_one({'category': '시즌메뉴'})
db.category.insert_one({'category': '베스트 콤비네이션'})

db.topping.insert_one({'is_output_kitchen': True, 'is_waiting': False, 'price': 500, 'topping_name': '펄'})
db.topping.insert_one({'is_output_kitchen': True, 'is_waiting': False, 'price': 500, 'topping_name': '밀크폼'})
db.topping.insert_one({'is_output_kitchen': True, 'is_waiting': False, 'price': 500, 'topping_name': '코코넛'})
db.topping.insert_one({'is_output_kitchen': True, 'is_waiting': False, 'price': 500, 'topping_name': '알로에'})
db.topping.insert_one({'is_output_kitchen': True, 'is_waiting': False, 'price': 500, 'topping_name': '화이트펄'})
db.topping.insert_one({'is_output_kitchen': True, 'is_waiting': False, 'price': 500, 'topping_name': '치즈펄'})

# 이미지 업로드
UPLOAD_FOLDER = './img'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = os.urandom(24)


# [HTML 주는 부분]

@app.route('/')
def home():
    return render_template('client/main.html')


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


@app.route('/manager/login')
def login():
    return render_template('manager/login.html')


@app.route('/manager/menu/list')
def menu_list():
    all_menu = list(db.menu.find({}, {'_id': 0}))
    for i in all_menu:
        if 'file' in i:
            i['file'] = str(i['file'])

    return render_template('manager/menu_list.html', all_menu=all_menu)


@app.route('/manager/payment/list')
def payment_list():
    return render_template('manager/payment_list.html')


@app.route('/manager/payment/result')
def payment_result():
    return render_template('manager/payment_result.html')


@app.route('/kitchen')
def kitchen_display():
    return render_template('kitchen/kitchen_display.html')


# [API 역할을 하는 부분]

# 메뉴 수정 페이지
@app.route('/manager/menu/change', methods=['GET'])
def menu_change():
    all_menu = list(db.menu.find({}, {'_id': 0}))
    all_category = list(db.category.find({}, {'_id': 0}))

    for i in all_menu:
        if 'file' in i:
            i['file'] = str(i['file'])

    return render_template('manager/menu_change.html', all_menu=all_menu, all_category=all_category)


# 토핑 등록 페이지
@app.route('/manager/topping/change', methods=['GET'])
def topping_change():
    all_topping = list(db.topping.find({}, {'_id': 0}))
    # for i in all_topping:
    #     print(i)

    return render_template('manager/topping_change.html', all_topping=all_topping)


# false -> False
def parse(string):
    d = {'true': True, 'false': False}
    return d.get(string, string)


# 메뉴 CRUD 함수
# 메뉴 생성
@app.route('/add_menu', methods=['POST'])
def add_menu():
    file = request.files['file']

    category_receive = request.form['category_give']
    menu_receive = request.form['menu_give']
    price_receive = request.form['price_give']
    kitchen_receive = request.form['kitchen_give']
    waiting_receive = request.form['waiting_give']
    ice_receive = request.form['ice_give']
    hot_receive = request.form['hot_give']
    topping_receive = request.form['topping_give']

    price_receive = int(price_receive)
    if topping_receive:
        topping_receive = int(topping_receive)
    kitchen_receive = parse(kitchen_receive)
    waiting_receive = parse(waiting_receive)
    ice_receive = parse(ice_receive)
    hot_receive = parse(hot_receive)

    encoded_string = base64.b64encode(file.read())

    all_menu = db.menu.find({}, {'_id': 0})

    menu_data = {
        'number': all_menu.count() + 1,
        'product_number': 'abc000' + str(all_menu.count() + 1),
        'category': category_receive,
        'name': menu_receive,
        'price': price_receive,
        'file': encoded_string,
        'is_output_kitchen': kitchen_receive,
        'is_waiting': waiting_receive,
        'ice': ice_receive,
        'hot': hot_receive,
        'topping_number': topping_receive
    }

    db.menu.insert_one(menu_data)
    return redirect(url_for('menu_change'))


# 메뉴 수정
@app.route('/update_menu', methods=['POST'])
def update_menu():
    new_menu = list(request.form.keys())
    menu = json.loads(new_menu[0])

    category_receive = menu['category_give']
    menu_receive = menu['menu_give']
    price_receive = menu['price_give']
    kitchen_receive = menu['kitchen_give']
    waiting_receive = menu['waiting_give']
    ice_receive = menu['ice_give']
    hot_receive = menu['hot_give']
    topping_receive = menu['topping_give']

    price_receive = int(price_receive)
    if topping_receive:
        topping_receive = int(topping_receive)
    kitchen_receive = parse(kitchen_receive)
    waiting_receive = parse(waiting_receive)
    ice_receive = parse(ice_receive)
    hot_receive = parse(hot_receive)

    db.menu.update_many({
        'category': category_receive,
        'name': menu_receive,
    },
        {
            '$set': {
                'price': price_receive,
                'is_output_kitchen': kitchen_receive,
                'is_waiting': waiting_receive,
                'ice': ice_receive,
                'hot': hot_receive,
                'topping_number': topping_receive
            }
        }
    )
    return render_template('manager/menu_change.html')


# 메뉴 삭제
@app.route('/delete_menu', methods=['POST'])
def delete_menu():
    category_receive = request.form['category_give']
    menu_receive = request.form['menu_give']

    db.menu.delete_one({
        'category': category_receive,
        'name': menu_receive,
    })
    return render_template('manager/menu_change.html')


# 카테고리 추가
@app.route('/add_category', methods=['POST'])
def add_category():
    category_receive = request.form['category_give']
    # if category_receive not in list(db.category.find({'category': category_receive})):
    db.category.insert_one({'category': category_receive})

    return render_template('manager/menu_change.html')


# 카테고리 삭제
@app.route('/delete_category', methods=['POST'])
def delete_category():
    category_receive = request.form['category_give']

    db.category.delete_one({'category': category_receive})
    db.menu.delete_many({'category': category_receive})
    return render_template('manager/menu_change.html')


# 토핑 관련 함수
# 토핑 생성
@app.route('/add_topping', methods=['POST'])
def add_topping():
    new_topping = list(request.form.keys())
    topping = json.loads(new_topping[0])

    name_receive = topping['name_give']
    price_receive = topping['price_give']
    kitchen_receive = topping['kitchen_give']
    wating_receive = topping['wating_give']

    price_receive = int(price_receive)

    topping_data = {
        'topping_name': name_receive,
        'price': price_receive,
        'is_output_kitchen': kitchen_receive,
        'is_wating': wating_receive
    }

    db.topping.insert_one(topping_data)
    return render_template('manager/topping_change.html')


# 토핑 수정
@app.route('/update_topping', methods=['POST'])
def update_topping():
    new_topping = list(request.form.keys())
    topping = json.loads(new_topping[0])

    name_receive = topping['name_give']
    price_receive = topping['price_give']
    kitchen_receive = topping['kitchen_give']
    wating_receive = topping['wating_give']

    price_receive = int(price_receive)

    db.topping.update_many({
        'topping_name': name_receive
    },
        {
            '$set': {
                'price': price_receive,
                'is_output_kitchen': kitchen_receive,
                'is_wating': wating_receive
            }
        }
    )
    return render_template('manager/topping_change.html')


# 토핑 삭제
@app.route('/delete_topping', methods=['POST'])
def delete_topping():
    name_receive = request.form['name_give']

    db.topping.delete_one({'topping_name': name_receive})
    return render_template('manager/menu_change.html')


# 포인트 적립
@app.route('/save_points', methods=['POST'])
def save_points():
    phone_number = request.form['phone_number']
    db.users.update_one({'phone_number': phone_number}, {'$inc': {'points': 300}}, upsert=True)
    return render_template('client/stamp_manual.html')


# 주문 정보 처리
@app.route('/order_db', methods=['GET', 'POST'])
def make_order():
    if request.method == 'POST':
        order_count = db.orderCount.find_one({}, {'_id': 0})
        number = order_count['order_count']

        transaction_date = time.strftime("%Y-%m-%d-%H:%M")
        date_split = transaction_date.split('-')
        date_list = date_split[:3]
        date_list.append(number)
        receipt_number = ''.join(date_list)

        order_state = False

        product = request.form['product_give']
        amount = int(request.form['amount_give'])
        per_price = int(request.form['pprice_give'])
        opt = request.form['options_give']
        options = [x.strip() for x in opt.split(',')]
        products = [{'product': product, 'amount': amount, 'per_price': per_price, 'options': options}]

        total_price = int(request.form['tprice_give'])
        discount_price = int(request.form['dprice_give'])
        real_price = int(request.form['rprice_give'])

        order = {'number': number, 'receipt_number': receipt_number, 'order_state': order_state,
                 'transaction_date': transaction_date, 'products': products, 'total_price': total_price,
                 'discount_price': discount_price, 'real_price': real_price}

        db.order.insert_one(order)

        return jsonify({'result': 'success'})

    elif request.method == 'GET':
        order_count = db.orderCount.find_one({}, {'_id': 0})
        number = order_count['order_count']

        count = int(number) + 1
        count_update = '{0:04d}'.format(count)
        db.orderCount.update_one({}, {'$set': {'order_count': count_update}})

        return jsonify({'result': 'success', 'order_number': number})


# 결제 정보 처리
@app.route('/payment_db', methods=['GET', 'POST'])
def manange_payment():
    if request.method == 'POST':
        receipt_number = request.form['receipt_give']
        db.order.delete_one({'receipt_number': receipt_number})

        return jsonify({'result': 'success'})

    elif request.method == 'GET':
        result = list(db.order.find({}, {'_id': 0, 'order_state': 0}))

        return jsonify({'result': 'success', 'payment_data': result})


# 주방 정보 처리
@app.route('/kitchen_db', methods=['GET', 'POST'])
def check_order():
    if request.method == 'POST':
        receipt_receive = request.form['receipt_give']
        db.order.update_one({'receipt_number': receipt_receive}, {'$set': {'order_state': True}})

        return jsonify({'result': 'success'})

    elif request.method == 'GET':
        result = list(db.order.find({'order_state': False}, {'_id': 0, 'transaction_date': 0, 'total_price': 0,
                                                             'discount_price': 0, 'real_price': 0,
                                                             'order_state': 0}))

        return jsonify({'result': 'success', 'kitchen_data': result})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
