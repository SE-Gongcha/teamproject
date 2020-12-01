let administrator_information = {id: 'hufs', pd: '1234'};

const login_btn = document.getElementById('login_btn');
const id= document.getElementById('id');
const pd=document.getElementById('password');
const not_correct_text= document.getElementById('is_not_correct');
login_btn.addEventListener('click', (e)=>{
    e.preventDefault();
    if(administrator_information.id===id.value && administrator_information.pd===pd.value){
        location.replace('/menu_list');
        console.log(id.value);
    }else{
        not_correct_text.innerText=`입력하신 아이디와 패스워드가 일치하지 않습니다.`;
    }

});