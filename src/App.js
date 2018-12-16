import React, { Component } from 'react';
import './App.css';
import ic_lixeira from '../src/ic_lixeira.png';
import ic_remove from '../src/ic_remove.png';
import ic_add from '../src/ic_add.png';
import ColorPicker from 'rc-color-picker';

class Ativo {
    constructor(id, nome, valor, porcentagem) {
        this.id = id;
        this.nome = nome;
        this.valor = valor;
        this.porcentagem = porcentagem;
    }
}

class TabelaAtivos extends Component {
    constructor() {
        super();
        this.idAtual = 0;
        this.nomes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        this.state = {
            ativos:  [],
            tInvestimento: 0,
            tAplicado: 0, 
            tPorcentagem: 0,
        }
        this.getTotal = this.getTotal.bind(this);
        this.addAtivo = this.addAtivo.bind(this);
        this.removeAtivo = this.removeAtivo.bind(this);
        this.updateValor = this.updateValor.bind(this);
        this.updateInvestimento = this.updateInvestimento.bind(this);
    }

    componentDidMount() {
        const { ativosN } = this.props;
        
        if (ativosN !== undefined) {
            let total = this.getTotal(ativosN);
            this.setState({ativos: ativosN, tInvestimento: total, tAplicado: total, tPorcentagem: this.calculaPorcentagemT(ativosN)});
        }  
    }

    getRandomAtivo(n) {
        if (n)
            return new Ativo(this.idAtual++, this.nomes[Math.floor(Math.random() * 26)], 0, 0);
    
        return new Ativo(this.idAtual++, this.nomes[Math.floor(Math.random() * 26)], Math.floor(Math.random() * 1000), 0);
    }

    addAtivo() {
        this.setState({ativos: [...this.state.ativos, this.getRandomAtivo(true)]});
    }

    removeAtivo(e) {
        this.ativosAux = this.state.ativos.filter(ativo => ativo.id === e.target.value);
        this.setState({ativos: this.ativosAux});
        this.calculaPorcentagemT();
    }

    updateValor(e) {
        this.setState({ativos: this.state.ativos.map(ativo => {
            if (ativo.id === e.target.id)
                return {...ativo, valor: Number(e.target.value)};
            })
        });
    }

    updatePorcentagem(e) {
        
    }

    updateInvestimento(e) {
        const updatedActives = this.state.ativos.map(ativo => ({ ...ativo, porcentagem: ativo.valor / this.state.tInvestimento * 100 }));
      
        this.setState({
            ativos: updatedActives,
            tInvestimento: e.target.value,
            tAplicado: this.getTotal(updatedActives),
            tPorcentagem: this.calculaPorcentagemT(updatedActives),
        })
    }

    getTotal(ativos) {
        return ativos.reduce((total, atual) => total+atual.valor, 0);
    }

    calculaPorcentagemT(ativos) {
        return ativos.reduce((total, atual) => total+ atual.porcentagem, 0);
    }

    render() {
        return (
            <div>
                <table className="tableAtivos">
                <thead>
                    <tr className="theadAtivos">
                        <th className="thNomes">Ativos (<span>{this.state.ativos.length}</span>)</th>
                        <div className="right"><th>R$ <input type="text" value={this.state.tInvestimento} onChange={this.updateInvestimento}/><br/><span className="restante">(Restante:{this.state.tInvestimento - this.state.tAplicado})</span></th></div>
                        <th><span>{this.state.tPorcentagem}</span> %</th>
                        <th><img alt="" src={ic_lixeira}/></th>
                    </tr>
                 </thead>
                    <tbody className="tbodyAtivos">
                        {this.state.ativos.map(ativo => {
                        return (
                            <tr>
                                <td className="tdNomes">{ativo.nome}</td>
                                <td className="tdValor">R$ <input  type="text"  className="inputValor" id={ativo.id} value={ativo.valor} onChange={this.updateValor}/></td>
                                <td className="tdValorPercent"><input type="text"  id={ativo.id} className={this.state.max} value={ativo.porcentagem} onChange={this.calculaPorcentagem}/> %</td>
                                <td className="tdX"><img id={ativo.id} alt="" src={ic_remove} className="btnRemove"  onClick={this.removeAtivo} /></td>
                            </tr>
                            );
                        })}
                    </tbody>
                </table>
                <button src={ic_add}  alt="Adicionar"  className="btnAdd" onClick={this.addAtivo}/>
            </div>
        );
    }
}

TabelaAtivos.defaultProps = {
    qtdAtivos: 0,
}

export default class App extends Component {
  constructor() {
    super();
    this.nomes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    this.idAtual = 0;
    this.state = {
        portifolios: [ [
                new Ativo(0, this.nomes[Math.floor(Math.random() * 26)], 10, 33),
                new Ativo(1, this.nomes[Math.floor(Math.random() * 26)], 10, 33),
                new Ativo(2, this.nomes[Math.floor(Math.random() * 26)], 10, 33),
            ],
        ],
    }
    this.addPortfolio = this.addPortfolio.bind(this);
  }

    addPortfolio() {
        this.setState({portifolios: [...this.state.portifolios, []]});
    }

  render() {
    return (
      <div className="App"> 
            <h1>Gerenciamento de Ativos</h1>
            {this.state.portifolios.map(portfolio => {
              return (<TabelaAtivos ativosN={portfolio}/>)
            })}
            <button src={ic_add} className="btnAdd" alt="Novo Painel" onClick={this.addPortfolio}/>
      </div>
    );
  }
}