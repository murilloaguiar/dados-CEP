const button = document.querySelector('#submit')
const principal = document.querySelector('#cep-data')

const removeChilds = (list)=>{
   while (list.hasChildNodes()) {
      list.removeChild(list.firstChild);
   }
}

const insertDataCEP = data =>{
   const cep_data = ['localidade', 'logradouro', 'bairro', 'uf', 'ddd', 'complemento']

   if(principal.children.length>0) removeChilds(principal)
   
   for (const key in data) {
      if (cep_data.indexOf(key) != -1) {
         const div_card_principal = document.createElement('div')
         div_card_principal.className = "col-sm-12 col-md-6"

         const div_card = document.createElement('div')
         div_card.className = "card text-warning bg-dark mb-3"

         const div_card_header = document.createElement('div')
         div_card_header.className = "card-header fw-bold"
         div_card_header.innerHTML = key.toUpperCase() 

         div_card.appendChild(div_card_header)

         const div_card_body = document.createElement('div')
         div_card_body.className = "card-body"

         const p_card_body = document.createElement('p')
         p_card_body.className = "card-text"
         p_card_body.innerHTML = data[key] || 'Indisponível'

         div_card_body.appendChild(p_card_body)

         div_card.appendChild(div_card_body)
         div_card_principal.appendChild(div_card)

         principal.appendChild(div_card_principal)
      }

   }

   console.log(principal.children.length)

      
   // document.querySelector('#street').innerHTML = data.logradouro
   // document.querySelector('#city').innerHTML = data.localidade
   // document.querySelector('#district').innerHTML = data.bairro
   // document.querySelector('#state').innerHTML = data.uf
   // document.querySelector('#ddd').innerHTML = data.ddd
}

const insertPIB = data =>{
    for (const key in data) {
        let p = document.createElement('p')
        p.innerHTML = `${key}: ${data[key]}`
        document.querySelector("#pib").appendChild(p)

    }
}

const insertAgricultura = (unidade, variavel, dados) =>{
    
    for (const key in dados) {

        let categoria = dados[key].classificacoes[0].categoria
        for (const key2 in categoria) {
            let h5 = document.createElement('h5')
            h5.innerHTML = `${categoria[key2]}`
            document.querySelector("#agricultura").appendChild(h5)
            
        }
        
        let anos = dados[key].series[0].serie
        for (const key3 in anos) {
            let p = document.createElement('p')
            p.innerHTML = `${key3}: ${anos[key3]}`
            document.querySelector("#agricultura").appendChild(p)
            
        }
    }
}

const searchCEP = async ()=>{
   document.querySelector('#main').classList.remove('d-none')


   let cep = document.querySelector('#search').value
   let date = new Date
   let ibge = ""
   let microrregiao = ""
   let data = ""
   

   /*dados do cep*/ 
   await fetch(`https://viacep.com.br/ws/${cep}/json/unicode/`)
      .then(response =>response.json())
      .then(data=>{
         this.data = data
         insertDataCEP(data)
         ibge = data.ibge
      })
   

   /*recuperando a microrregiao para obter dados agricolas*/
   await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${ibge}`)
      .then(response => response.json())
      .then(data => {
         microrregiao = data.microrregiao.id
   
      })

   /*dados agricolas*/    
   await fetch(`https://servicodados.ibge.gov.br/api/v3/agregados/1613/periodos/-3/variaveis/2313|216|214|112|215?localidades=N9[${microrregiao}]&classificacao=82[2717,45981,2719,2720,40472,2722,2723,40473,2725,2728,2731,2732,2733,2734,2735,2736,2737,2738,2741,2742,2743,2745,2748]`)
      .then(response => response.json())
      .then(data => {

         let unidade = data[0].unidade
         
         let variavel = data[0].variavel
         

         let dados = data[0].resultados
         

         insertAgricultura(unidade, variavel, dados)

         /*console.log(data[0].resultados[0].classificacoes[0].categoria)

         for (const key in dados) {
               console.log(data[0].resultados[key].classificacoes[0].categoria)
               console.log(data[0].resultados[key].series[0].serie)
         }*/

      })

   /*PIB*/    
   await fetch(`https://servicodados.ibge.gov.br/api/v3/agregados/5938/periodos/-5/variaveis/37?localidades=N6[${ibge}]`)
      .then(response => response.json())
      .then(data => {
         let serie = data[0].resultados[0].series[0].serie
         insertPIB(serie)
      })    
   
   /*população total*/ 
   await fetch(`https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/${date.getFullYear()}/variaveis/9324?localidades=N6[${ibge}]`)
      .then(response => response.json())
      .then(data => {
            document.querySelector('#population').innerHTML = `${data[0].resultados[0].series[0].serie[date.getFullYear()]} pessoas`
      })

}

button.addEventListener('click', searchCEP)