let menu_data = [
    {number:1, product_number:'abc00001', category:'시즌메뉴', name:'토피넛 밀크티+펄(L)', price:5000, 
    ice:true, hot:true, topping_number:3, is_waiting:false, is_output_kitchen:true},
    {number:2, product_number:'abc00002', category:'시즌메뉴', name: '초코바른 토피넛 스무디(L)', price:5500,
    ice:true, hot:true, topping_number:3, is_waiting:false, is_output_kitchen:true},
    {number:3, product_number:'abc00003', category:'시즌메뉴', name: '다크초코 밀크티+펄(라지)', price:4900,
    ice:true, hot:true, topping_number:3, is_waiting:false, is_output_kitchen:true},
    {number:4, product_number:'abc00004', category:'베스트 콤비네이션', name: '블랙 밀크티 + 펄(라지)', price:4500,
    ice:true, hot:true, topping_number:3, is_waiting:false, is_output_kitchen:true},
    {number:5, product_number:'abc00005', category:'베스트 콤비네이션', name: '블랙 밀크티 + 펄(J)', price:5800,
    ice:true, hot:true, topping_number:3, is_waiting:false, is_output_kitchen:true},
    {number:6, product_number:'abc00006', category:'베스트 콤비네이션', name: '타로 밀크티 + 펄(점보)', price:4500,
    ice:true, hot:true, topping_number:3, is_waiting:false, is_output_kitchen:true},
    {number:7, product_number:'abc00007', category:'베스트 콤비네이션', name: '타로 밀크티 + 펄(라지)', price:5800,
    ice:true, hot:true, topping_number:3, is_waiting:false, is_output_kitchen:true},
    {number:8, product_number:'abc00008', category:'베스트 콤비네이션', name: '제주 그린 밀크티+ 펄(라지)', price:4900,
    ice:true, hot:true, topping_number:3, is_waiting:false, is_output_kitchen:true},
    {number:9, product_number:'abc00009', category:'베스트 콤비네이션', name: '우롱티+ 밀크폼(라지)', price:3700,
    ice:true, hot:true, topping_number:3, is_waiting:false, is_output_kitchen:true},
    {number:10, product_number:'abc00010', category:'베스트 콤비네이션', name: '우롱티+ 밀크폼(점보)', price:4900,
    ice:true, hot:true, topping_number:3, is_waiting:false, is_output_kitchen:true},
];

let category_data = ['시즌메뉴', '베스트 콤비네이션'];

const category_selectEl = document.getElementById('category_select');
const menu_selectEl = document.getElementById('menu_select');

const input_categoryEl = document.getElementById('input_category');
const input_menuEl = document.getElementById('input_menu');
const input_priceEl = document.getElementById('input_price');
const input_kitchenEl = document.getElementById('input_kitchen');
const input_waitingEl = document.getElementById('input_waiting');
const input_iceEl = document.getElementById('input_ice');
const input_hotEl = document.getElementById('input_hot');
const input_toppingEl = document.getElementById('input_topping');
const input_imgEl = document.getElementById('input_img');

const menu_add_btn = document.getElementById('menu_add_btn');
const menu_modify_btn = document.getElementById('menu_modify_btn');
const menu_remove_btn = document.getElementById('menu_remove_btn');

const modal_title = document.querySelectorAll('.modal-title');
const modal_body = document.querySelectorAll('.modal-body');

const add_ok_btn = document.getElementById('add_ok_btn');
const remove_ok_btn = document.getElementById('remove_ok_btn');
const modify_ok_btn = document.getElementById('modify_ok_btn');

//카테고리 추가 수정 삭제 버튼
const category_add_btn = document.getElementById('category_add_btn');
const category_remove_btn = document.getElementById('category_remove_btn');

const category_add_ok_btn = document.getElementById('cateogory_add_ok_btn');
const category_remove_ok_btn = document.getElementById('cateogory_remove_ok_btn');

const input_category_add = document.getElementById('input_category_add');


updateCategories(category_data);

function updateCategories(category_data){ //카테고리 업데이트
    category_selectEl.innerHTML='';

    category_data.forEach(category=>{
        const element = document.createElement('option');
        element.innerHTML = `${category}`;
        element.value= `${category}`;
        category_selectEl.appendChild(element);
   });

};
function findSelectedCategoryIndex(){
    let selected_category_index= null;
    const selected_category= category_selectEl.options[category_selectEl.selectedIndex].value;
    category_data.forEach((item,index)=>{
        if(item ===selected_category){
            selected_category_index = index;
        }
    });
    return selected_category_index;
}

function findSelectedMenuIndex(){
    let selected_menu_index= null;
    const selected_menu = (menu_selectEl.options[menu_selectEl.selectedIndex])? menu_selectEl.options[menu_selectEl.selectedIndex].value : null;

    menu_data.forEach((item,index)=>{
        if(item.name ===selected_menu){
            selected_menu_index = index;
        }
    });
    return selected_menu_index;
}

// function getCategories(menu_data){ //menu_data에 있는 카테고리 추출
//     const categories = [];
//     menu_data.forEach(item=>{
//         if(!categories.includes(item.category)){
//             categories.push(item.category);
//         }
//     })
//     return categories;
// };

function findMenuDetail(menu_name, menu_data){
    let menu_index = null;
    menu_data.forEach((item,index)=>{
        if(item.name ===menu_name){
            menu_index = index;
        }
    });
    return menu_data[menu_index];
}




function updateMenus(category,menu_data){ // 메뉴 업데이트
    //clear menu div
    menu_selectEl.innerHTML = '';

    menu_data.forEach(item=> {
        if(item.category===category){
            const element = document.createElement('option');
            element.innerHTML = `${item.name}`;
            element.value = `${item.name}`;
            menu_selectEl.appendChild(element);
        }
        
    });
};

function updateMenuDetail(menu, menu_data){
    // const categories = getCategories(menu_data);//menu_data에서 중복하지 않는 카테고리 배열 추출하기
    // categories.forEach(category=>{
    //     const element = document.createElement('option');
    //     element.innerHTML = `${category}`;
    //     element.value= `${category}`;
    //     input_categoryEl.appendChild(element);
    // }); 

    const menu_detail = findMenuDetail(menu, menu_data); // menu_data에서 해당 메뉴 디테일 뽑기
    console.log(menu_detail);

    input_menuEl.value = menu_detail.name;
    input_priceEl.value= menu_detail.price;
    
    input_kitchenEl.checked=menu_detail.is_output_kitchen;
    input_waitingEl.checked= menu_detail.is_waiting;
    input_iceEl.checked=menu_detail.ice;
    input_hotEl.checked=menu_detail.hot;
    
    input_toppingEl.value = menu_detail.topping_number;

};

function removeMenuDetail(){
    input_menuEl.value = null;
    input_priceEl.value= null;
    
    input_kitchenEl.checked=false;
    input_waitingEl.checked= false;
    input_iceEl.checked=false;
    input_hotEl.checked=false;
    
    input_toppingEl.value = null;

}
function selectCategory(){ //카테고리 누르면 메뉴 업데이트 + 상세사항에서 카테고리만 업데이트
    if(category_selectEl.options[category_selectEl.selectedIndex]){
        const selected_category = category_selectEl.options[category_selectEl.selectedIndex].value;
        console.log(selected_category);
        updateMenus(selected_category, menu_data);
        removeMenuDetail(); //카테고리 변경시 상세사항 지움.
        //상세사항 카테고리 업데이트
        input_categoryEl.innerHTML = '';
        const detail_element = document.createElement('option');
        detail_element.innerHTML = selected_category;
        input_categoryEl.appendChild(detail_element);
    }else{
        menu_selectEl.innerHTML = '';
        input_categoryEl.innerHTML = '';
    }
};

function selectMenu(){ // 메뉴 누르면 상세사항 업데이트
    const selected_menu = menu_selectEl.options[menu_selectEl.selectedIndex].value;

    console.log(selected_menu);
    
    updateMenuDetail(selected_menu, menu_data);
    
    
 
 
};


function isPossibleMenu(is_success, method){ //메뉴 등록 가능여부에 따른 모달창 
    if(is_success){
        if(method==="add"){
            modal_title[0].innerText = "메뉴등록안내" ;
            modal_body[0].innerText = "메뉴를 등록하시겠습니까?";
        }else if(method==="modify"){
            
            modal_title[1].innerText = "메뉴수정안내" ;
            modal_body[1].innerText = "메뉴를 수정하시겠습니까?";
        }else {
            modal_title[2].innerText = "메뉴삭제안내" ;
            modal_body[2].innerText = "메뉴를 정말 삭제하시겠습니까?";
        }
    
    }else{
        if(method==="add"){
            modal_title[0].innerText = "메뉴등록 안내";
            modal_body[0].innerText = "주어진 정보란에 모두 올바르게 작성해주세요.";
        }else if(method==="modify"){
            modal_title[1].innerText = "메뉴수정 안내" ;
            modal_body[1].innerText = "수정할 메뉴를 선택하여 주어진 정보란에 모두 올바르게 작성해주세요.";
        }else {
            modal_title[2].innerText = "메뉴삭제안내" ;
            modal_body[2].innerText = "삭제할 메뉴를 선택해주세요.";
        }
    }
};
function isPossibleCategory(is_success){
    if(is_success){
        modal_title[4].innerText = "카테고리삭제안내" ;
        modal_body[4].innerText = "카테고리를 정말 삭제하시겠습니까? 카테고리에 있는 메뉴들은 모두 삭제됩니다.";
    }else{
        modal_title[4].innerText = "카테고리삭제안내" ;
        modal_body[4].innerText = "삭제할 카테고리를 선택해주세요.";
    }
    
};

function checkMenu(method){ //메뉴등록이나 수정이 가능한지 체크 
    let is_success = true;
    // const menu_names = menu_data.map(item =>{return item.name}); 

    if(input_menuEl.value.trim()===''){
        console.log(1);
        console.log(input_menuEl.value);
        is_success=false;
    } //메뉴명 입력안하거나 동일한 메뉴명 있을 경우 false;
    if(input_priceEl.value.trim()===''|| input_priceEl.value<0){
        is_success=false;
        console.log(2);
    }//가격 입력 안하거나 0원보다 작을경우 false;
    if(input_toppingEl.value.trim()==='' || input_toppingEl.value<0){
        is_success=false;
        console.log(3);
    }//토핑 제한 갯수 입력안하거나 0보다 작을경우
    if( !(input_iceEl.checked || input_hotEl.checked)){
        is_success=false;
        console.log(4);
    }// ice랑 hot 둘다 선택 안할 경우 
    
    console.log(method, is_success);
    isPossibleMenu(is_success, method);//팝업창띄우기
    return is_success;
};
function checkSelcetedMenu(method){ //삭제할 때 메뉴를 선택해야 삭제가능
    let is_success = true;
    console.log(findSelectedMenuIndex());
    if(findSelectedMenuIndex()===null){
        is_success=false;
    }
    console.log(is_success);
    isPossibleMenu(is_success, method);
    return is_success;
}

function checkSelectedCategory(){
    let is_success = true;
    const selected_category = category_selectEl.options[category_selectEl.selectedIndex]? category_selectEl.options[category_selectEl.selectedIndex].value: '';
    if(selected_category.trim()===''){
        is_success = false;
    }
    console.log("category", is_success);
    isPossibleCategory(is_success);
    return is_success;
}

//events

category_selectEl.addEventListener('change', selectCategory); // 카테고리 다른거 고를때 선택된 카테고리
menu_selectEl.addEventListener('click', selectMenu);


//form의 input에 따른 value 변화 
input_menuEl.addEventListener('change',(e)=>{
    input_menuEl.value=e.target.value;
    console.log(input_menuEl.value);
});
input_priceEl.addEventListener('change',(e)=>{
    input_priceEl.value=e.target.value;
    console.log(input_price.value);
});
input_toppingEl.addEventListener('change',(e)=>{
    input_toppingEl.value=e.target.value;
    console.log(input_toppingEl.value);
});

menu_add_btn.addEventListener('click', function(e){
    e.preventDefault();
    checkMenu('add');
});

menu_modify_btn.addEventListener('click', (e)=>{
    e.preventDefault();
    checkMenu('modify');
    checkSelcetedMenu('modify');
});
menu_remove_btn.addEventListener('click', (e)=>{
    e.preventDefault();
    checkSelcetedMenu('remove'); //check할필요없이 바로 팝업창으로
});

add_ok_btn.addEventListener('click', ()=>{
    if(checkMenu("add")){
        const new_obj={number: menu_data.length+1, category:category_selectEl.options[category_selectEl.selectedIndex].value, name: input_menuEl.value, 
        price:input_priceEl.value,ice:input_iceEl.checked, hot:input_hotEl.checked, 
        topping_number:input_toppingEl.value, is_waiting:input_waitingEl.checked, is_output_kitchen:input_kitchenEl.checked};
        menu_data.push(new_obj);//메뉴에 추가하기
        add_menu();

        selectCategory();//메뉴 업데이트
    }
});



modify_ok_btn.addEventListener('click', ()=>{
    if(checkMenu("modify") &&checkSelcetedMenu("modify")){
        const index = findSelectedMenuIndex();
        console.log(input_priceEl.value);
        menu_data[index] = {number: index+1, category:category_selectEl.options[category_selectEl.selectedIndex].value, name: input_menuEl.value, 
            price:input_priceEl.value,ice:input_iceEl.checked, hot:input_hotEl.checked, 
            topping_number:input_toppingEl.value, is_waiting:input_waitingEl.checked, is_output_kitchen:input_kitchenEl.checked};
        console.log(menu_data);

        selectCategory();//메뉴업데이트
    }
});

remove_ok_btn.addEventListener('click', ()=>{
    if(checkSelcetedMenu("remove")){
        const index = findSelectedMenuIndex();
        menu_data.splice(index,1);
        console.log(menu_data);
        selectCategory();
    }
});

//category 추가 수정 삭제 버튼
category_add_btn.addEventListener('click', (e)=>{
    e.preventDefault();
});

category_remove_btn.addEventListener('click', (e)=>{
    e.preventDefault();
    checkSelectedCategory();
});


category_add_ok_btn.addEventListener('click', ()=>{
        const new_category=input_category_add.value;
        category_data.push(new_category);//카테고리에 추가하기
        updateCategories(category_data);//카테고리 업데이트
});



category_remove_ok_btn.addEventListener('click', ()=>{
    if(checkSelectedCategory("remove")){
        const selected_category = category_selectEl.options[category_selectEl.selectedIndex].value;
        const category_index= findSelectedCategoryIndex();
        category_data.splice(category_index, 1);

        menu_data.forEach((item,index)=> {
            if(item.category===selected_category){
                menu_data.splice(index,1);
            }
        });
        updateCategories(category_data);
        selectCategory();
        console.log(menu_data);
        console.log(category_data);

        //입력받은 category를 categorydata와 menudata에서 삭제시키기 + 카테고리 업데이트
    }
});

function add_menu(){
    // let category = $("#input_category_add").val();
    let category = $(this).attr("input_category_add");
    console.log(category)
    let menu = $("#input_menu").val();
    let price = $("#input_price").val();
    let category = $("#input_category_add").val();
    Boolean kitchen = $("#input_kitchen").val();
    Boolean waiting = $("#input_waiting").val();
    Boolean ice = $("#input_ice").val();
    Boolean hot = $("#input_hot").val();
    let topping = $("#input_topping").val()
    console.log("hi");


    $.ajax({
        type: "POST",
        url: "{{url_for('add_menu')}}",
        data: {
            category_give : category,
            menu_give : menu,
            price_give : price,
            category_give : category,
            kitchen_give : kitchen,
            waiting_give : waiting,
            ice_give : ice,
            hot_give : hot,
            topping_give : topping
        },
        success: function(response){
           if(response['result'] == "success"){
               console.log("성공!");
            alert(response['msg']);
            window.location.reload();
           }
        }
    })
}

