const button = document.querySelector('#submit')

const insertDataCEP = data =>{
    document.querySelector('#street').innerHTML = data.logradouro
    document.querySelector('#city').innerHTML = data.localidade
    document.querySelector('#district').innerHTML = data.bairro
    document.querySelector('#state').innerHTML = data.uf
    document.querySelector('#ddd').innerHTML = data.ddd

}

const searchCEP = async ()=>{
    let cep = document.querySelector('#search').value
    let date = new Date
    let ibge = ""
    console.log(cep)
   
    await fetch(`https://viacep.com.br/ws/${cep}/json/unicode/`)
        .then(response =>response.json())
        .then(data=>{
            console.log(data)
            insertDataCEP(data)
            ibge = data.ibge
        })
    
    await fetch(`https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/${date.getFullYear()}/variaveis/9324?localidades=N6[${ibge}]`)
            .then(response => response.json())
            .then(data => {
                document.querySelector('#population').innerHTML = `${data[0].resultados[0].series[0].serie[date.getFullYear()]} pessoas`
            })

}

button.addEventListener('click', searchCEP)