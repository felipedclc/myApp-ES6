class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    
    validarDados() {
        for(let i in this) {  // percorrendo todos os elementos e retornando os atributos de "Despesa"
        // recuperando os valores dos atriutos
            if(this[i] === undefined || this[i] === '' || this[i] === null) {
                return false
            }
        }
        return true
    }
}

class Bd {

    constructor() {
        let id = localStorage.getItem('id')

        if(id === null) {
            localStorage.setItem('id', 0) // iniciando o id com valor 0
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(d) {

        let id = this.getProximoId() 

        // transformando o item "d" em JSON e incluindo em localStorage
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)    
    }

    recuperarTodosRegistros() {
        
        let listaDespesas = Array()
        
        let id = localStorage.getItem('id')

        for(let i=1; i<=id; i++) { // varrendo todos itens no localStoarge
            let despesa = JSON.parse(localStorage.getItem(i)) // obtendo os itens e passando de JSON para obj
            if(despesa !== null) {
                despesa.id = i
                listaDespesas.push(despesa) // add os itens no array despesas
            }
        }   
        return listaDespesas
    }

    pesquisar(despesa) {
        // recuperando todos os itens e atribuindo ao array despesasFiltradas
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()

        if(despesa.ano !== '') {
            despesasFiltradas = despesasFiltradas.filter(f => f.ano === despesa.ano) // comparando os atributos para a filtragem
        }
        if(despesa.mes !== '') {
            despesasFiltradas = despesasFiltradas.filter(f => f.mes === despesa.mes)
        }
        
        if(despesa.ano !== '') {
            despesasFiltradas = despesasFiltradas.filter(f => f.dia === despesa.dia)
        }
        
        if(despesa.ano !== '') {
            despesasFiltradas = despesasFiltradas.filter(f => f.tipo === despesa.tipo)
        }
        
        if(despesa.ano !== '') {
            despesasFiltradas = despesasFiltradas.filter(f => f.descricao === despesa.descricao)
        }
        
        if(despesa.ano !== '') {
            despesasFiltradas = despesasFiltradas.filter(f => f.valor === despesa.valor)
        }
        
        return despesasFiltradas
    }

    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa() {
    
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )
    
    if (despesa.validarDados()) {
        bd.gravar(despesa) // recuperando o objeto literal 

        document.getElementById('modal_titulo').innerHTML = 'Registro foi inserido!' // innerHTML - conteúdo interno 
        document.getElementById('modal_titulo_div').className = 'modal-header text-success' // mudando a class
        document.getElementById('modal_conteudo').innerHTML = 'Despesa cadastrada com sucesso!'
        document.getElementById('modal_button').innerHTML = 'Voltar'
        document.getElementById('modal_button').className = 'btn btn-outline-success'

        $('#modalGravacao').modal('show') // bibilioteca JQuery

        // limpando os campos
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    }
    else {
        document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Ocorreu um erro na gravação, verifique se os campos foram preenchidos corretamente'
        document.getElementById('modal_button').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal_button').className = 'btn btn-outline-danger'
        $('#modalGravacao').modal('show') // bibilioteca JQuery
    }
}

function carregaListaDespesas(listaDespesas = Array(), filtro = false) {    

    if(listaDespesas.length === 0 && filtro == false) {
        listaDespesas = bd.recuperarTodosRegistros()
    }
     
    let listaConsultas = document.getElementById('listaConsultas') // selecionando o tbody

    listaDespesas.forEach(d => {
        // criando a linha
        let linha = listaConsultas.insertRow() // associando a linha criada no tbody 

        linha.insertCell(0).innerHTML = `${d.dia} / ${d.mes} / ${d.ano}` 
        // ajustando o tipo
        if(d.tipo === '1') {
            d.tipo = 'Alimentação'
        }
        else if(d.tipo === '2') {
            d.tipo = 'Educação'
        }
        else if(d.tipo === '3') {
            d.tipo = 'Lazer'
        }
        else if(d.tipo === '4') {
            d.tipo = 'Saúde'
        }
        else if(d.tipo === '5') {
            d.tipo = 'Transporte'
        }
        linha.insertCell(1).innerHTML = d.tipo // insertCell (insere coluna) 
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        /****** criando o botão de exclusão *************/
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger' // class btn bootstrap
        btn.innerHTML = '<i class="fas fa-times"></i>' // class fontAwesome
        btn.id = d.id // associando o id do btn com o id da despesa
        btn.onclick = function() {  
            bd.remover(d.id)
            window.location.reload() // atualizando a página após remover
         }
        linha.insertCell(4).append(btn) // append faz a inserção de 'btn'
    })
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano,mes,dia,tipo,descricao,valor)
    
    let listaDespesas = bd.pesquisar(despesa)

    let listaConsultas = document.getElementById('listaConsultas') // selecionando o tbody
    listaConsultas.innerHTML = '' // limpando os dados para a busca

    carregaListaDespesas(listaDespesas, true)
}