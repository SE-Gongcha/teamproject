

from pymongo import MongoClient
from flask import render_template, request, flash, redirect, url_for, Flask

app = Flask(__name__)

client = MongoClient('localhost', 27017) # mongoDB의 27017 포트로 들어감

client = client.dbgongcha   # 'dbgongcha'라는 이름의 db 생성
db = client.dbgongcha # 공처 db뭉치 가져오기


# db.menu.insert_one({'number':1, 'category':'시즌메뉴', 'name':'토피넛 밀크티+펄(L)', 'price': 4900, 'ice':True, 'hot':True, 'topping_number':3, 'is_waiting':False, 'is_output_kitchen':True, 'img': None})
# db.menu.insert_one({'number':2, 'category':'시즌메뉴', 'name':'초코바른 토피넛  스무디', 'price':5500, 'ice':True, 'hot':True, 'topping_number':3, 'is_waiting':False, 'is_output_kitchen':True, 'img': None})
# db.menu.insert_one({'number':3, 'category':'베스트 콤비네이션', 'name':'블랙 밀크티+펄(L)', 'price':4500, 'ice':True, 'hot':True, 'topping_number':3, 'is_waiting':False, 'is_output_kitchen':True, 'img': None})
# db.menu.insert_one({'number':4, 'category':'베스트 콤비네이션', 'name':'타로 밀크티+펄(L)', 'price':4500, 'ice':True, 'hot':True, 'topping_number':3, 'is_waiting':False, 'is_output_kitchen':True, 'img': None})
# db.menu.insert_one({'number':5, 'category':'베스트 콤비네이션', 'name':'제주 그린 밀크티+펄(L)', 'price':4900, 'ice':True, 'hot':True, 'topping_number':3, 'is_waiting':False, 'is_output_kitchen':True, 'img': None})


# 디비 내용 확인용
all_menu = list(db.menu.find({}))
for i in all_menu:
    print(i)

all_category = list(db.category.find({}))
for i in all_category:
    print(i)

## HTML을 주는 부분
@app.route('/')
def home():
    return render_template('index.html')


@app.route('/menu/login')
def manager_login():
    pass
    # return render_template('index.html', note=note)


@app.route('/menu', methods=['POST', 'GET'])
def show_menu():
    all_menu = list(db.menu.find({}))
    all_category = list(db.category.find({}))
    return render_template('menu_change.html', all_menu = all_menu, all_category= all_category)

# 메뉴 생성
@app.route('/menu/add_category', methods=['POST', 'GET'])
def add_category():
    if request.method == 'POST':
        category= request.form['add_category']
        db.category.insert_one({'name': category} )
        return redirect(url_for('show_menu'))
    else:
        error = '잘못된 시도입니다'
    return render_template('menu_change.html', error = error)

# 메뉴 삭제
@app.route('/menu/delete_category', methods=['POST'])
def delete_category():
    if request.method == 'POST':
        category= request.form['delete_category']
        db.category.delete_one({'name': category} )
        return redirect(url_for('show_menu'))
    else:
        error = '잘못된 시도입니다'
    return render_template('menu_change.html', error = error)
    


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
