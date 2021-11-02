const button = document.querySelector('#submit')

button.addEventListener('click', searchCEP)

const searchCEP = ()=>{
    let cep = document.querySelector('input').value

    
    fetch('https://viacep.com.br/ws/'+cep+'/json/unicode/')
        .then(response =>{
            
            
            console.log(response.json())
        })
}