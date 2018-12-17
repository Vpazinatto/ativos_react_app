import React, { Component } from 'react';
import './App.css';
import ic_lixeira from '../src/ic_lixeira.png';
import ic_remove from '../src/ic_remove.png';
import ic_add from '../src/ic_add.png';
import ic_add_large from '../src/ic_add_large.png';
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';
import Popup from "reactjs-popup";

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
            color: '#000',
            pMaxima: '#000',
            travado: false,
        }
        this.getTotal = this.getTotal.bind(this);
        this.addAtivo = this.addAtivo.bind(this);
        this.removeAtivo = this.removeAtivo.bind(this);
        this.removeAtivos = this.removeAtivos.bind(this);
        this.updateValor = this.updateValor.bind(this);
        this.updatePorcentagem = this.updatePorcentagem.bind(this);
        this.updateInvestimento = this.updateInvestimento.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
    }

    componentDidMount() {
        const { ativosN } = this.props;

        if (ativosN.length !== 0) {
            let total = this.getTotal(ativosN);
            this.idAtual = ativosN.length-1;
            this.setState({ativos: ativosN, tInvestimento: total, tAplicado: total, tPorcentagem: this.calculaPorcentagemT(ativosN), travado: true});
        } else {
            this.setState({travado: false});
            this.idAtual =0;
        }
    }

    addAtivo() {
        this.setState({ativos: [...this.state.ativos, new Ativo(this.idAtual++, this.nomes[Math.floor(Math.random() * 26)], 0, 0)]});
    }

    removeAtivo(e) {
        let novosAtivos = this.state.ativos.filter(ativo => ativo.id !== Number(e.target.id));

        novosAtivos = novosAtivos.map(ativo => (ativo.id === e.target.id) ? {ativo, porcentagem: ativo.valor/this.state.tInvestimento * 100} : ativo);
        novosAtivos = novosAtivos.map(ativo => (ativo.id === e.target.id) ? { ...ativo, valor: ativo.porcentagem / 100 * this.state.tInvestimento } : ativo);

        if (!this.state.travado) {
            this.setState({tInvestimento: this.getTotal(novosAtivos)});
        }

        this.setState({
            ativos: novosAtivos,
            tAplicado: this.getTotal(novosAtivos),
            tPorcentagem: this.calculaPorcentagemT(novosAtivos),
        });
    }

    removeAtivos() {
        if (window.confirm("Deseja exlcuir todos os ativos ?"))
            this.setState({ativos: [], tInvestimento: 0, tAplicado: 0, tPorcentagem: 0});
    }

    updateValor(e) {
        let valor = Number(e.target.value);
        let id = Number(e.target.id);

        let novosAtivos = this.state.ativos.map(ativo => (ativo.id === id) ? {...ativo, valor } : ativo);
        novosAtivos = novosAtivos.map(ativo => (ativo.id === id) ? {...ativo, porcentagem: ativo.valor/this.getTotal(novosAtivos) * 100} : ativo);

        if (!this.state.travado) {
            this.setState({tInvestimento: this.getTotal(novosAtivos)});

            novosAtivos = novosAtivos.map(ativo => ({...ativo, porcentagem: ativo.valor/this.getTotal(novosAtivos)*100}));
        }

        this.setState({
            ativos: novosAtivos,
            tAplicado:  this.getTotal(novosAtivos),
            tPorcentagem: this.calculaPorcentagemT(novosAtivos),
        });
        
    }

    updatePorcentagem(e) {
        let porcentagem = Number(e.target.value);
        let id = Number(e.target.id);

        let novosAtivos = this.state.ativos.map(ativo => (ativo.id === id) ? { ...ativo, porcentagem } : ativo);
        novosAtivos = novosAtivos.map(ativo => (ativo.id === id) ? { ...ativo, valor: porcentagem / 100 * this.getTotal(novosAtivos) } : ativo);

        if (!this.state.travado) {  
            this.setState({tInvestimento: this.getTotal(novosAtivos)});
        }
        
        this.setState({
            ativos: novosAtivos,
            tAplicado: this.getTotal(novosAtivos),
            tPorcentagem: this.calculaPorcentagemT(novosAtivos),
        });
    }

    updateInvestimento(e) {
        if (!this.state.travado)
            this.setState({travado: true});

        const novosAtivos = this.state.ativos.map(ativo => ({ ...ativo, porcentagem: ativo.valor / this.state.tInvestimento * 10 }));
        this.setState({
            ativos: novosAtivos,
            tInvestimento: Number(e.target.value),
            tAplicado: this.getTotal(novosAtivos),
            tPorcentagem: this.calculaPorcentagemT(novosAtivos),
            travado: true,
        });
    }

    getTotal(ativos) {
        return Number(ativos.reduce((total, atual) => total+atual.valor, 0));
    }

    calculaPorcentagemT(ativos) {
        let pTotal = Number(ativos.reduce((total, atual) => total + atual.porcentagem, 0));
        if (pTotal !== 100)
            this.setState({pMaxima: '#f00'});
        else
            this.setState({pMaxima: '#000'});
        
        return pTotal;
    }

    changeHandler(colors) {
        this.setState({color: colors.color});
    }

    render() {
        return (
            <div className="App">
                
                <hr color={this.state.color} className="react-custom-trigger"/>
                <table className="tableAtivos">
                <thead>
                    <tr className="theadAtivos">         
                        <th className="thNomes">Ativos (<span>{this.state.ativos.length}</span>)</th>
                        <th className="thInvestimento">R$ <input type="text" value={this.state.tInvestimento.toFixed(0)} onChange={this.updateInvestimento}/><br/><span className="spanRestante">(Restante: {(this.state.tInvestimento - this.state.tAplicado).toFixed(2)})</span></th>
                        <th><span style={{color: this.state.pMaxima}}>{this.state.tPorcentagem.toFixed(0)}%</span></th>
                        <th><img className="btnLixeira" alt="" src={ic_lixeira} onClick={this.removeAtivos}/></th>
                        <th><ColorPicker animation="slide-up"color={this.state.color} onChange={this.changeHandler}/></th>
                    </tr>
                 </thead>
                    <tbody className="tbodyAtivos">
                        {this.state.ativos.map(ativo => {
                        return (
                            <tr key={ativo.id}>
                                <td className="tdNomes">{ativo.nome}</td>
                                <td className="tdValor">R$ <input  type="text"  className="inputValor" id={ativo.id} value={ativo.valor.toFixed(0)} onChange={this.updateValor}/></td>
                                <td className="tdValorPorcento"><input type="text"  id={ativo.id} className={this.state.max} value={ativo.porcentagem.toFixed(0)} onChange={this.updatePorcentagem}/> %</td>
                                <td className="tdRemove"><img id={ativo.id} alt="" src={ic_remove} className="btnRemove"  onClick={this.removeAtivo} /></td>
                            </tr>
                            );
                        })}
                    </tbody>
                </table>
                <button className="btnAdd" onClick={this.addAtivo}><img src={ic_add} alt="addAtivo"/> <span className="btnText">Adicionar Ativo</span></button>
            </div>
        );
    }
}

export default class App extends Component {
    constructor() {
        super();
        this.idAtual = 0;
        this.state = {
            portifolios: [ [
                    new Ativo(0, 'A', 10, 50),
                    new Ativo(1, 'B', 10, 50),
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
                return (<TabelaAtivos key={this.idAtual++} ativosN={portfolio}/>)
                })}
                <button className="btnAddPortfolio" onClick={this.addPortfolio}><img src={ic_add_large} alt="addPortfolio"/><br/>Adicionar Portfolio</button>
        </div>
        );
    }
}