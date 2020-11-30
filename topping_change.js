let topping_data= [
    {topping_name: '펄', price: 500, is_waiting:false, is_output_kitchen:true},
    {topping_name: '밀크폼', price: 500, is_waiting:false, is_output_kitchen:true},
    {topping_name: '코코넛', price: 500, is_waiting:false, is_output_kitchen:true},
    {topping_name: '알로에', price: 500, is_waiting:false, is_output_kitchen:true},
    {topping_name: '화이트펄', price: 500, is_waiting:false, is_output_kitchen:true},
    {topping_name: '치즈펄', price: 500, is_waiting:false, is_output_kitchen:true},
];

const topping_selectEl = document.getElementById('topping_select');

const input_topping_nameEl = document.getElementById('input_topping_name');
const input_topping_priceEl = document.getElementById('input_topping_price');
const input_topping_kitchenEl = document.getElementById('input_topping_kitchen');
const input_topping_imgEl = document.getElementById('input_topping_img');
const input_topping_waitingEl = document.getElementById('input_topping_waiting');

const topping_add_btn = document.getElementById('topping_add_btn');
const topping_modify_btn = document.getElementById('topping_modify_btn');
const topping_remove_btn = document.getElementById('topping_remove_btn');

const modal_title = document.querySelectorAll('.modal-title');
const modal_body = document.querySelectorAll('.modal-body');

const add_ok_btn = document.getElementById('add_ok_btn');
const remove_ok_btn = document.getElementById('remove_ok_btn');
const modify_ok_btn = document.getElementById('modify_ok_btn');


updateToppings(topping_data);

function findSelectedToppingIndex(){ //선택한 토핑의 인덱스 구하기
    let selected_topping_index= null;
    const selected_topping = (topping_selectEl.options[topping_selectEl.selectedIndex])? topping_selectEl.options[topping_selectEl.selectedIndex].value : null;

    topping_data.forEach((item,index)=>{
        if(item.topping_name ===selected_topping){
            selected_topping_index = index;
        }
    });
    console.log(selected_topping_index);
    return selected_topping_index;
}


function updateToppings(topping_data){ //토핑현황 업데이트
    topping_selectEl.innerHTML='';

    
    topping_data.forEach(topping=>{
        console.log(topping);
        const element = document.createElement('option');
        element.innerHTML = `${topping.topping_name}(+${topping.price})`;
        element.value= topping.topping_name;
        topping_selectEl.appendChild(element);
    });
};

function updateToppingDetail(){ //토핑 정보(상세사항) 업데이트 
    const selected_topping_index = findSelectedToppingIndex();

    const topping_detail = topping_data[selected_topping_index]; // topping_data에서 해당 topping 디테일 뽑기
    console.log(topping_detail);

    input_topping_nameEl.value = topping_detail.topping_name;
    input_topping_priceEl.value = topping_detail.price;
    input_topping_kitchenEl.checked= topping_detail.is_output_kitchen;
    input_topping_waitingEl.checked= topping_detail.is_waiting;

}

function isPossible(is_success, method){ //메뉴 등록 가능여부에 따른 모달창 
    if(is_success){
        if(method==="add"){
            modal_title[0].innerText = "토핑등록안내" ;
            modal_body[0].innerText = "토핑을 등록하시겠습니까?";
        }else if(method==="modify"){
            modal_title[1].innerText = "토핑수정안내" ;
            modal_body[1].innerText = "토핑을 수정하시겠습니까?";
        }else {
            modal_title[2].innerText = "토핑삭제안내" ;
            modal_body[2].innerText = "토핑을 정말 삭제하시겠습니까?";
        }
    
    }else{
        if(method==="add"){
            modal_title[0].innerText = "토핑등록안내";
            modal_body[0].innerText = "주어진 정보란에 모두 올바르게 작성해주세요.";
        }else if(method==="modify"){
            modal_title[1].innerText = "토핑수정안내" ;
            modal_body[1].innerText = "주어진 정보란에 모두 올바르게 작성해주세요.";
        }else {
            modal_title[2].innerText = "토핑삭제안내" ;
            modal_body[2].innerText = "삭제할 토핑을 선택해주세요.";
        }
    }
};

function checkTopping(method){ //메뉴등록이나 수정이 가능한지 체크 
    let is_success = true;
    // const menu_names = menu_data.map(item =>{return item.name}); 

    if(input_topping_nameEl.value.trim()===''){
        is_success=false;
    } //메뉴명 입력안하거나 동일한 메뉴명 있을 경우 false;
    if(input_topping_priceEl.value.trim()===''|| input_topping_priceEl.value<0){
        is_success=false;
    }//가격 입력 안하거나 0원보다 작을경우 false;

    console.log(method, is_success);
    isPossible(is_success, method);//팝업창띄우기
    return is_success;
};
function checkSelcetedTopping(method){ //삭제할 때 메뉴를 선택해야 삭제가능
    let is_success = true;
    if(findSelectedToppingIndex()===null){
        is_success=false;
    }
    console.log(method, is_success);
    isPossible(is_success, method);
    return is_success;
}

//events

topping_selectEl.addEventListener('change', updateToppingDetail);


input_topping_nameEl.addEventListener('change', (e)=>{
    input_topping_nameEl.value = e.target.value;
    console.log(input_topping_nameEl.value);
});
input_topping_priceEl.addEventListener('change', (e)=>{
    input_topping_priceEl.value = e.target.value;
    console.log(input_topping_priceEl.value);
});


topping_add_btn.addEventListener('click', (e)=>{
    e.preventDefault();
    checkTopping('add');
});

topping_modify_btn.addEventListener('click', (e)=>{
    e.preventDefault();
    checkTopping('modify');
});
topping_remove_btn.addEventListener('click', (e)=>{
    e.preventDefault();
    checkSelcetedTopping('remove'); //check할필요없이 바로 팝업창으로
})

add_ok_btn.addEventListener('click', ()=>{
    if(checkTopping("add")){
        const new_obj={topping_name: input_topping_nameEl.value, price: input_topping_priceEl.value, is_waiting:input_topping_waitingEl.checked, 
            is_output_kitchen:input_topping_kitchenEl.checked};
        topping_data.push(new_obj);//메뉴에 추가하기
        updateToppings(topping_data)//메뉴 업데이트
    }
});

modify_ok_btn.addEventListener('click', ()=>{
    if(checkTopping("modify")){
        const index = findSelectedToppingIndex();
        topping_data[index] = {topping_name: input_topping_nameEl.value, price: input_topping_priceEl.value, is_waiting:input_topping_waitingEl.checked, 
            is_output_kitchen:input_topping_kitchenEl.checked};
        console.log(topping_data);
        updateToppings(topping_data)//메뉴업데이트
    }
});

remove_ok_btn.addEventListener('click', ()=>{
    if(checkSelcetedTopping("remove")){
        const index = findSelectedToppingIndex();
        topping_data.splice(index,1);
        console.log(topping_data);
        updateToppings(topping_data)
    }
});