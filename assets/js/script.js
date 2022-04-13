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
         div_card_principal.className = "col-12 col-md-6"

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

}

const insertPIB = data =>{
   const div_pib = document.querySelector('#pib')
   if(div_pib.children.length>0) removeChilds(div_pib)

   for (const key in data) {
   
      const div_card_principal = document.createElement('div')
      div_card_principal.className = "col-12 col-md-6"

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
      p_card_body.innerHTML = data[key]!= '' ? 'R$ '+data[key]+' mil' : 'Indisponível'

      div_card_body.appendChild(p_card_body)

      div_card.appendChild(div_card_body)
      div_card_principal.appendChild(div_card)

      div_pib.appendChild(div_card_principal)

   }
}

const insertAgricultura = (dados) =>{
   const div_agricultura = document.querySelector('#agricultura')

   if(div_agricultura.children.length>0) removeChilds(div_agricultura)

   for (const key in dados) {

      let categoria = dados[key].classificacoes[0].categoria

      const div_card_principal = document.createElement('div')
      div_card_principal.className = "col-12 col-md-6"

      const div_card = document.createElement('div')
      div_card.className = "card text-warning bg-dark mb-3"

      const div_card_header = document.createElement('div')
      div_card_header.className = "card-header fw-bold"
      div_card_header.innerHTML = `${Object.values(categoria)}`

      div_card.appendChild(div_card_header)

      

      const div_card_body = document.createElement('div')
      div_card_body.className = "card-body"


      let anos = dados[key].series[0].serie

      for (const key3 in anos) {

         const p_card_body = document.createElement('p')
         p_card_body.className = "card-text"
         p_card_body.innerHTML = anos[key3] == '-' || anos[key3] == '...' ? `${key3}: 0 hectares` : `${key3}: ${anos[key3]} hectar(es)`

         div_card_body.appendChild(p_card_body)
   
      
      }

      div_card.appendChild(div_card_body)
      div_card_principal.appendChild(div_card)

      div_agricultura.appendChild(div_card_principal)

   }
}

const searchCEP = async ()=>{
   const main = document.querySelector('#main')
   const alert = document.querySelector('#alert')

   let cep = document.querySelector('#search').value
   let ibge = ""

   /*dados do cep*/ 
   await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(response =>response.json())
      .then(data=>{

         if(data.erro){
            if(!main.classList.contains('d-none')) main.classList.add('d-none')
            alert.classList.remove('d-none')
         } 
         else {
            if(!alert.classList.contains('d-none')) alert.classList.add('d-none')

            main.classList.remove('d-none')
            insertDataCEP(data)
            ibge = data.ibge
         }
      })
   
   /*dados agricolas*/    
   await fetch(`https://servicodados.ibge.gov.br/api/v3/agregados/1613/periodos/-4/variaveis/2313?localidades=N6[${ibge}]&classificacao=82[2717,45981,2719,2720,2722,2723,40473,2725,2728,2731,2732,2733,2734,2735,2736,2737,2738,90001,2741,2742,2745,2748]`)
      .then(response => response.json())
      .then(data => {

         let dados = data[0].resultados
         console.log(dados)

         insertAgricultura(dados)

      })

   /*PIB*/    
   await fetch(`https://servicodados.ibge.gov.br/api/v3/agregados/5938/periodos/-5/variaveis/37?localidades=N6[${ibge}]`)
      .then(response => response.json())
      .then(data => {
         let serie = data[0].resultados[0].series[0].serie
         insertPIB(serie)
      })    
   
   /*população total*/ 
   await fetch(`https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/-1/variaveis/9324?localidades=N6[${ibge}]`)
      .then(response => response.json())
      .then(data => {
            data = data[0].resultados[0].series[0].serie
            document.querySelector('#population').innerHTML = `${Object.getOwnPropertyNames(data)}: ${Object.values(data)} pessoas`
      })

}

button.addEventListener('click', searchCEP)