from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient('localhost', 27017) # mongoDB의 27017 포트로 들어감
db = client.dbGongchaTest   # 'dbGongchaTest'라는 이름의 db 생성



def make_order_db(no, d, pro, tpri):
    number = no
    transaction_date = d
    date_split = transaction_date.split('-')
    date_list = date_split[:3]
    date_list.append(number)
    receipt_number = ''.join(date_list)
    products = pro  # [[products, amount, per_price, *options], ...]
    total_price = tpri

    order = {'number': number, 'receipt_number': receipt_number, 'products': products,
             'total_price': total_price}

    db.order.insert_one(order)

def make_pay_db(no, d, dpri, rpri):
    number = no
    transaction_date = d  # 거래 날짜
    date_split = transaction_date.split('-')
    date_list = date_split[:3]
    date_list.append(number)
    receipt_number = ''.join(date_list)  # 영수증 번호
    discount_price = dpri  # 할인 금액
    real_price = rpri  # 결제 금액 (메뉴 가격 - 할인 금액)

    pay = {'receipt_number': receipt_number, 'transaction_date': transaction_date, 'discount_price': discount_price,
           'real_price': real_price}

    db.pay.insert_one(pay)

def make_payments_db(): # order DB + pay DB = payments DB 만들기
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


test_data = [{'no': '0001',
        'd': '2020-11-21-09:37',
        'pro': [{'product':'다크초코 밀크티+펄(L)', 'amount':1, 'per_price':5000, 'options': ['COLD(포장)', 'Regular Ice', '50%']}, {'product':'딸기 밀크티+펄(L)', 'amount':1, 'per_price':5000, 'options': ['COLD(포장)', 'Regular Ice', '50%']}],
        'tpri': 10000,
        'dpri': 5000,
        'rpri': 5000,
          },
        {'no': '0002',
        'd': '2020-11-21-09:37',
        'pro': [{'product':'얼그레이 밀크티(L)', 'amount':2, 'per_price':5000, 'options': ['COLD(포장)', 'Regular Ice', '50%']}],
        'tpri': 10000,
        'dpri': 600,
        'rpri': 9400
         },
         {'no': '0001',
        'd': '2020-11-22-09:37',
        'pro': [{'product':'얼그레이 밀크티(J)', 'amount':1, 'per_price':5000, 'options': ['COLD(포장)', 'Regular Ice', '50%']}],
        'tpri': 5000,
        'dpri': 600,
        'rpri': 4400
         },
        {'no': '0002',
        'd': '2020-11-22-09:37',
        'pro': [{'product':'다크초코 밀크티+펄(L)', 'amount':1, 'per_price':5000, 'options': ['COLD(포장)', 'Regular Ice', '50%']}, {'product':'딸기 밀크티+펄(L)', 'amount':1, 'per_price':5000, 'options': ['COLD(포장)', 'Regular Ice', '50%']}],
        'tpri': 10000,
        'dpri': 5000,
        'rpri': 5000,
          },
        {'no': '0001',
        'd': '2020-11-23-09:37',
        'pro': [{'product':'얼그레이 밀크티(J)', 'amount':1, 'per_price':5000, 'options': ['COLD(포장)', 'Regular Ice', '50%']}],
        'tpri': 5000,
        'dpri': 600,
        'rpri': 4400
         },
        {'no': '0002',
        'd': '2020-11-23-09:37',
        'pro': [{'product':'다크초코 밀크티+펄(L)', 'amount':1, 'per_price':5000, 'options': ['COLD(포장)', 'Regular Ice', '50%']}, {'product':'딸기 밀크티+펄(L)', 'amount':1, 'per_price':5000, 'options': ['COLD(포장)', 'Regular Ice', '50%']}],
        'tpri': 10000,
        'dpri': 5000,
        'rpri': 5000,
          },
        {'no': '0001',
        'd': '2020-11-24-09:37',
        'pro': [{'product':'블랙 밀크티(J)', 'amount':1, 'per_price':5000, 'options': ['COLD(포장)', 'Regular Ice', '50%']}],
        'tpri': 5000,
        'dpri': 0,
        'rpri': 5000
         }
        ]

db.order.delete_many({})
db.pay.delete_many({})
db.payments.delete_many({})

for data in test_data:
    no = data['no']
    d = data['d']
    pro = data['pro']
    tpri = data['tpri']
    dpri = data['dpri']
    rpri = data['rpri']

    make_order_db(no, d, pro, tpri)
    make_pay_db(no, d, dpri, rpri)

make_payments_db()

